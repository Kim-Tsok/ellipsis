'use server';

import prisma from '@/lib/prisma';
import { ai } from '@/lib/gemini';
import { auth } from '@/lib/auth/auth'; // Adjust to your BetterAuth server setup
import { headers } from 'next/headers';
import { deriveTitleFromContent } from '@/lib/text';

// Get active authenticated user
async function getAuthenticatedUser() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session?.user) throw new Error('Unauthorized');
  return session.user;
}

async function embed(text: string): Promise<number[]> {
  const embeddingResponse = await ai.models.embedContent({
    model: 'gemini-embedding-001',
    contents: text,
    config: { outputDimensionality: 768 },
  });

  const vector = embeddingResponse.embeddings?.[0]?.values;
  if (!vector) throw new Error('Failed to extract embedding vector.');
  return vector;
}

/**
 * 1. Capture a Ping (quick brain-dump) & compute its vector embedding
 */
export async function createPing(content: string) {
  const trimmed = content.trim();
  if (!trimmed) throw new Error('Ping content cannot be empty.');

  const user = await getAuthenticatedUser();
  const vector = await embed(trimmed);

  const [ping]: Array<{
    id: string;
    content: string;
    createdAt: Date;
  }> = await prisma.$queryRaw`
    INSERT INTO "Ping" ("id", "content", "userId", "embedding", "updatedAt")
    VALUES (
      gen_random_uuid(),
      ${trimmed},
      ${user.id},
      ${JSON.stringify(vector)}::vector,
      NOW()
    )
    RETURNING "id", "content", "createdAt"
  `;

  return { success: true, ping };
}

/**
 * Fetch all pings for the active user, most recent first
 */
export async function getPings() {
  const user = await getAuthenticatedUser();
  const pings = await prisma.ping.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: 'desc' },
    select: { id: true, content: true, createdAt: true },
  });
  return pings;
}

/**
 * Delete a ping outright (discard it)
 */
export async function deletePing(id: string) {
  const user = await getAuthenticatedUser();
  await prisma.ping.deleteMany({ where: { id, userId: user.id } });
  return { success: true };
}

/**
 * 2. Promote a ping into a full Note.
 * Reuses the ping's already-captured text as the note content, derives
 * a title, computes a fresh embedding for the Note table, and removes
 * the ping once it has become a note.
 */
export async function convertPingToNote(
  pingId: string
): Promise<{ success: boolean; noteId: string }> {
  const user = await getAuthenticatedUser();

  const ping = await prisma.ping.findFirst({
    where: { id: pingId, userId: user.id },
  });
  if (!ping) throw new Error('Ping not found.');

  const title = deriveTitleFromContent(ping.content);
  const vector = await embed(`${title}\n${ping.content}`);

  const [note]: Array<{ id: string }> = await prisma.$queryRaw`
    INSERT INTO "Note" ("id", "title", "content", "userId", "embedding", "updatedAt")
    VALUES (
      gen_random_uuid(),
      ${title},
      ${ping.content},
      ${user.id},
      ${JSON.stringify(vector)}::vector,
      NOW()
    )
    RETURNING "id"
  `;

  await prisma.ping.delete({ where: { id: ping.id } });

  return { success: true, noteId: note.id };
}
