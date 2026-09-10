export const GET = () => {
  return new Response(JSON.stringify({ message: 'test' }), {
    headers: { 'Content-Type': 'application/json' },
  });
};
