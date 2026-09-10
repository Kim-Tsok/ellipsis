import { auth } from "../../../../lib/auth";
import { NextRequest } from "next/server";

export const GET = async (req: NextRequest) => {
  try {
    const res = await auth.handler(req);
    console.log('GET response status:', res.status);
    return res;
  } catch (error) {
    console.error('Error in GET handler:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};

export const POST = auth.handler;
export const PUT = auth.handler;
export const PATCH = auth.handler;
export const DELETE = auth.handler;
export const HEAD = auth.handler;
export const OPTIONS = auth.handler;
