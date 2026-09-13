'use server';

import prisma from '@/lib/prisma';
import { ai } from '@/lib/gemini';
import { auth } from '@/lib/auth/auth'; // Adjust to your BetterAuth server setup
import { headers } from 'next/headers';
import { Type } from '@google/genai';

// Get active authenticated user
async function getAuthenticatedUser() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session?.user) throw new Error('Unauthorized');
  return session.user;
}

/**
 * 1. Upload a Note & Compute Vector Embedding
 */
export async function createNote(title: string, content: string, workspaceId?: string) {
  const user = await getAuthenticatedUser();
  const textToEmbed = `${title}\n${content}`;

  const embeddingResponse = await ai.models.embedContent({
    model: 'gemini-embedding-001',
    contents: textToEmbed,
    config: { outputDimensionality: 768 },
  });

  const vector = embeddingResponse.embeddings?.[0]?.values;

  if (!vector) {
    throw new Error('Failed to extract embedding vector.');
  }

  // Insert into Neon / pgvector database
  await prisma.$executeRaw`
    INSERT INTO "Note" ("id", "title", "content", "userId", "workspaceId", "embedding", "updatedAt")
    VALUES (
      gen_random_uuid(),
      ${title},
      ${content},
      ${user.id},
      ${workspaceId || null},
      ${JSON.stringify(vector)}::vector,
      NOW()
    )
  `;

  return { success: true };
}

/**
 * 2. Expand a Note using Related Notes as Context (RAG)
 */
export async function expandNoteWithContext(noteId: string) {
  const user = await getAuthenticatedUser();

  // Fetch current note
  const currentNote = await prisma.note.findFirst({
    where: { id: noteId, userId: user.id },
  });
  if (!currentNote) throw new Error('Note not found.');

  // Fetch top 3 contextually relevant notes using Cosine Distance (<=>)
  const contextNotes: Array<{ title: string; content: string }> = await prisma.$queryRaw`
    SELECT "title", "content"
    FROM "Note"
    WHERE "userId" = ${user.id} AND "id" != ${noteId} AND "embedding" IS NOT NULL
    ORDER BY "embedding" <=> (SELECT "embedding" FROM "Note" WHERE "id" = ${noteId})
    LIMIT 3;
  `;

  const contextText = contextNotes
    .map((n) => `[Related Note: ${n.title}]\n${n.content}`)
    .join('\n\n');

  const prompt = `
You are an expert workspace assistant. Expand and add missing details to the note below. 
Use information from the provided Related Notes for context where relevant.

Base Note Title: ${currentNote.title}
Base Note Content: ${currentNote.content}

--- Related Context Notes ---
${contextText || 'No related notes found.'}
`;

  const response = await ai.models.generateContent({
    model: 'gemini-3.5-flash-lite',
    contents: prompt,
  });

  return response.text;
}

/**
 * 3. Auto-organize notes into structured categories
 */
export async function organizeUserNotes() {
  const user = await getAuthenticatedUser();

  const notes = await prisma.note.findMany({
    where: { userId: user.id },
    select: { id: true, title: true, content: true },
  });

  if (!notes.length) return { success: false, message: 'No notes found.' };

  const notesList = notes
    .map((n) => `ID: ${n.id}\nTitle: ${n.title}\nExcerpt: ${n.content.slice(0, 150)}`)
    .join('\n---\n');

  const response = await ai.models.generateContent({
    model: 'gemini-3.5-flash-lite',
    contents: `Analyze and group these notes into concise categories:\n\n${notesList}`,
    config: {
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            category: { type: Type.STRING },
            noteIds: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
          },
          required: ['category', 'noteIds'],
        },
      },
    },
  });

  const groupings: Array<{ category: string; noteIds: string[] }> = JSON.parse(
    response.text || '[]'
  );

  for (const group of groupings) {
    await prisma.note.updateMany({
      where: {
        id: { in: group.noteIds },
        userId: user.id,
      },
      data: { category: group.category },
    });
  }

  return { success: true, groupings };
}