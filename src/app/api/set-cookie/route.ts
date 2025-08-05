// app/api/set-cookie/route.ts
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET() {
  cookies().set({
    name: 'test_cookie',
    value: 'hello_cookie_value',
    httpOnly: true,
    secure: false, // ローカル環境なので false（本番は true）
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24, // 1日
  });

  return NextResponse.json({ message: 'Cookie set!' });
}
