import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth/auth';
import { headers } from 'next/headers';
import { z } from 'zod';

const passwordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string().min(6, 'Password must be at least 6 characters'),
});

export async function POST(req: Request) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const result = passwordSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error.errors[0].message },
        { status: 400 }
      );
    }

    const { currentPassword, newPassword } = result.data;

    try {
      await auth.api.changePassword({
        headers: await headers(),
        body: {
          currentPassword,
          newPassword,
          revokeOtherSessions: true,
        },
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to update password';
      return NextResponse.json({ error: errorMessage }, { status: 400 });
    }

    return NextResponse.json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error('PASSWORD_UPDATE_ERROR', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
