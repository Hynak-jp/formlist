import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { lineId } = await request.json();

  const response = NextResponse.json({ success: true });

  response.headers.append('Set-Cookie', `lineId=${lineId}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${60 * 60 * 24 * 7}`);

  return response;
}
