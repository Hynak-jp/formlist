// ✅ 1. app/api/set-login-cookie/route.ts
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { lineId } = await request.json();

  cookies().set({
    name: 'lineId',
    value: lineId,
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 7日間
  });

  return NextResponse.json({ success: true });
}
