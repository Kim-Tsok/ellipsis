import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth/auth';
import { headers } from 'next/headers';
import prisma from '@/lib/prisma';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

export async function POST(req: Request) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create unique filename
    const filename = `${uuidv4()}${path.extname(file.name)}`;
    const uploadDir = path.join(process.cwd(), 'public/uploads');

    // Ensure directory exists
    try {
      await mkdir(uploadDir, { recursive: true });
    } catch {}

    const filepath = path.join(uploadDir, filename);
    await writeFile(filepath, buffer);

    const imageUrl = `/uploads/${filename}`;

    // Update user in database
    await prisma.user.update({
      where: { email: session.user.email },
      data: { image: imageUrl },
    });

    return NextResponse.json({ imageUrl });
  } catch (error) {
    console.error('IMAGE_UPLOAD_ERROR', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
