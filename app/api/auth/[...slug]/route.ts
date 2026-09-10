import { auth } from "../../../../lib/auth";

console.log('auth.handler type:', typeof auth.handler);
console.log('auth.handler:', auth.handler);

export const GET = auth.handler;
export const POST = auth.handler;
export const PUT = auth.handler;
export const PATCH = auth.handler;
export const DELETE = auth.handler;
export const HEAD = auth.handler;
export const OPTIONS = auth.handler;
