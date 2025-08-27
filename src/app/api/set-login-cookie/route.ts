// src/app/api/set-login-cookie/route.ts
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { lineId } = await request.json();

  const response = NextResponse.json({ success: true });

  // ✅ dev(http)では Secure 付けない。本番(https)では付ける
  const secure = process.env.NODE_ENV === 'production' ? 'Secure; ' : '';
  // ✅ Path は必ず '/' に
  response.headers.append(
    'Set-Cookie',
    `lineId=${encodeURIComponent(lineId)}; Path=/; HttpOnly; ${secure}SameSite=Lax; Max-Age=${60 * 60 * 24 * 7}`
  );

  return response;
}
