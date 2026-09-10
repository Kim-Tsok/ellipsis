import { betterAuth } from "better-auth"
import { prismaAdapter } from "@better-auth/prisma-adapter"
import { prisma } from "./db"

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
  },
  emailAndPassword: {
    enabled: true,
  },
  // Set the base URL for the app (used in emails, etc.)
  baseURL: process.env.BETTER_AUTH_URL,
  // Additional options can be added here
})

// Re-export the auth methods for use in API routes
export const {
  signIn,
  signOut,
  createAccount,
  updateUser,
  verifyEmail,
  sendResetPassword,
  resetPassword,
  updateEmail,
  updatePassword,
  linkAccount,
  unlinkAccount,
  createSession,
  validateSessionToken,
  invalidateSessionToken,
  invalidateUserSessionIds,
} = auth
