import { auth } from "../../../../lib/auth";

console.log('auth.handler type:', typeof auth.handler);
console.log('auth.handler:', auth.handler);

// Try to wrap the handler
export const GET = async (req: Request) => {
  try {
    console.log('GET handler called');
    // If auth.handler is a function that returns a promise, we need to call it
    // If it's already a handler function, we call it with req
    const result = auth.handler(req);
    console.log('handler result:', result);
    // If result is a promise, await it
    const response = result instanceof Promise ? await result : result;
    return response;
  } catch (error) {
    console.error('Error in GET handler:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};

// For other methods, we can export them similarly, but for now just GET to test
export const POST = auth.handler;
export const PUT = auth.handler;
export const PATCH = auth.handler;
export const DELETE = auth.handler;
export const HEAD = auth.handler;
export const OPTIONS = auth.handler;
