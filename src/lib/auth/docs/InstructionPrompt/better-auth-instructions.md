# GitHub Copilot Main Instructions: Better Auth (Complete Reference)

You are an expert developer using Better Auth (BA). The official source of documentation is locally available in the `docs/` folder in the project workspace. **IMPORTANT: NEVER make changes to the documentation files under the `docs` folder (`#docs`). These files are for reference only and must not be edited.**

## BEST PRACTICES FOR AI:

1. Prioritize responses based on the linked `better-auth.com/docs/` URLs.
2. For in-depth code examples, ask the user to refer to the local file via `#docs/...`.
3. BA is framework-agnostic (React, Next.js, Hono, etc.). Always provide solutions for the framework the user is working with (when possible).

---

## 1. GETTING STARTED

- **Introduction & Features:** Overview of what BA is and its core features (e.g., 2FA, Multi-tenancy).
  - URL: https://www.better-auth.com/docs/introduction
- **Installation:** Steps to install the package and its dependencies (e.g., Drizzle ORM).
  - URL: https://www.better-auth.com/docs/installation
- **Basic Usage:** How to create `auth` and `authClient` instances.
  - URL: https://www.better-auth.com/docs/basic-usage

## 2. CONCEPTS

- **Database Structure:** Describes the necessary tables (`User`, `Account`, `Session`, `Verification`).
  - URL: https://www.better-auth.com/docs/concepts/database
  - _Local file:_ `#docs/concepts/database.mdx`
- **CLI (Command Line Interface):** Using the CLI for schema generation, initialization, and diagnostics.
  - URL: https://www.better-auth.com/docs/concepts/cli
  - _Local file:_ `#docs/concepts/cli.mdx`
- **Session Management:** How tokens and session data are stored and validated.
  - URL: https://www.better-auth.com/docs/concepts/session
  - _Local file:_ `#docs/concepts/session-management.mdx`

## 3. AUTHENTICATION & FLOW

- **Login with Email & Password:** Implementing login forms and the `signIn` method.
  - URL: https://www.better-auth.com/docs/auth-flow/login
  - _Local file:_ `#docs/authentication/email-password.mdx`
- **Registration (Signup):** Creating new users with the `signUp` method.
  - URL: https://www.better-auth.com/docs/auth-flow/register
  - _Local file:_ `#docs/authentication/email-password.mdx` (registration is often handled in the same file)
- **Social Login (OAuth):** Configuration and handling of external providers (Google, GitHub, etc.).
  - URL: https://www.better-auth.com/docs/auth-flow/social-login
  - _Local file:_ `#docs/authentication/google.mdx`, `#docs/authentication/github.mdx`, etc.
- **Magic Link (Passwordless):** Flow for login via email link.
  - URL: https://www.better-auth.com/docs/auth-flow/magic-link
  - _Local file:_ `#docs/plugins/magic-link.mdx`
- **Two-Factor Authentication (2FA):** Activation and verification.
  - URL: https://www.better-auth.com/docs/auth-flow/2fa
  - _Local file:_ `#docs/plugins/2fa.mdx`

## 4. USER MANAGEMENT

- **Fetch User Data:** Using `useSession` (client) and `auth.api.getSession` (server).
  - URL: https://www.better-auth.com/docs/user-management/data
  - _Local file:_ `#docs/concepts/users-accounts.mdx`
- **Update Profile:** Methods for changing user information (name, email, password).
  - URL: https://www.better-auth.com/docs/user-management/update-profile
  - _Local file:_ `#docs/concepts/users-accounts.mdx`
- **Password Reset:** Details about `resetPassword` and token handling.
  - URL: https://www.better-auth.com/docs/user-management/reset-password
  - _Local file:_ `#docs/plugins/email-otp.mdx` (or relevant plugin for reset)
- **Email Verification:** Verification of user's email address.
  - URL: https://www.better-auth.com/docs/user-management/email-verification
  - _Local file:_ `#docs/concepts/email.mdx`

## 5. ADVANCED & INTEGRATION

- **Error Handling (Troubleshooting):** Details on how to catch and handle errors from the API (e.g., during login).
  - URL: https://www.better-auth.com/docs/error-handling
  - _Local file:_ `#docs/reference/faq.mdx` (or relevant troubleshooting section)
- **Authorization:** Managing roles and permissions (RBAC).
  - URL: https://www.better-auth.com/docs/authorization
  - _Local file:_ `#docs/concepts/plugins.mdx` (or relevant RBAC documentation)
- **Security:** Configuration options for headers, CORS, and rate limiting.
  - URL: https://www.better-auth.com/docs/security
  - _Local file:_ `#docs/concepts/rate-limit.mdx`

## 6. PLUGINS & GUIDES

- **Organization Plugin:** Managing Multi-tenancy, organizations, and invitations.
  - URL: https://www.better-auth.com/docs/plugins/organization
  - _Local file:_ `#docs/plugins/organization.mdx`
- **Migration Guides (e.g., NextAuth.js):** Specific guides for switching from other frameworks.
  - URL: https://www.better-auth.com/docs/guides/next-auth-migration-guide
  - _Local file:_ `#docs/guides/next-auth-migration-guide.mdx`
- **Framework-Specific Handlers (Adapters):** Documentation for Next.js, SvelteKit, Hono, etc.
  - URL: See sections under `Installation` and `Basic Usage`.

---

**HOW TO USE:**

When asking a question to Copilot in VS Code, always use **`#`** to point to the file in your local Better Auth folder.

_Example:_

> "I want to add a custom field to the user schema. How do I do that according to the file #docs/concepts/database.mdx?"
