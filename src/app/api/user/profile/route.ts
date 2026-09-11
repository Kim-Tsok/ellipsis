import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth/auth';
import { headers } from 'next/headers';
import prisma from '@/lib/prisma';
import { z } from 'zod';

const profileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
});

export async function PATCH(req: Request) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const result = profileSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error.errors[0].message },
        { status: 400 }
      );
    }

    const { name } = result.data;

    const updatedUser = await prisma.user.update({
      where: { email: session.user.email },
      data: { name },
    });

    return NextResponse.json({
      user: {
        name: updatedUser.name,
        email: updatedUser.email,
        image: updatedUser.image,
      },
    });
  } catch (error) {
    console.error('PROFILE_UPDATE_ERROR', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: {
        accounts: {
          where: { providerId: 'email' },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Check if user has an email account (password)
    const hasPassword = user.accounts.length > 0;

    return NextResponse.json({
      user: {
        name: user.name,
        email: user.email,
        image: user.image,
        hasPassword,
      },
    });
  } catch (error) {
    console.error('PROFILE_FETCH_ERROR', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
