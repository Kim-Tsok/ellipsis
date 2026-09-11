import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { oAuthProxy } from 'better-auth/plugins';
import prisma from '@/lib/prisma';
import {
  sendVerificationEmail as sendBrevoVerificationEmail,
  sendPasswordResetEmail as sendBrevoPasswordResetEmail,
} from '@/lib/email/brevo';

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: 'postgresql',
  }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    async sendResetPassword({ user, url }) {
      await sendBrevoPasswordResetEmail(user.email, url);
    },
  },
  emailVerification: {
    async sendVerificationEmail({ user, url }) {
      await sendBrevoVerificationEmail(user.email, url);
    },
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      redirectURI: `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/callback/google`,
    },
    github: {
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
      redirectURI: `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/callback/github`,
    },
    discord: {
      clientId: process.env.DISCORD_CLIENT_ID!,
      clientSecret: process.env.DISCORD_CLIENT_SECRET!,
      redirectURI: `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/callback/discord`,
    },
    twitter: {
      clientId: process.env.TWITTER_CLIENT_ID!,
      clientSecret: process.env.TWITTER_CLIENT_SECRET!,
      redirectURI: `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/callback/twitter`,
    },
  },
  trustedOrigins: [process.env.NEXT_PUBLIC_APP_URL!],
  advanced: {
    cookies: {
      state: {
        attributes: {
          sameSite: 'none',
          secure: true,
        },
      },
    },
  },
  plugins: [
    oAuthProxy({
      productionURL: process.env.NEXT_PUBLIC_APP_URL,
    }),
  ],
  user: {
    additionalFields: {
      role: {
        type: 'string',
        defaultValue: 'USER',
      },
    },
  },
});
