import { NextResponse } from 'next/server';

export async function POST() {
  const secure = process.env.NODE_ENV === 'production' ? 'Secure; ' : '';
  const res = NextResponse.json({ ok: true });
  res.headers.append(
    'Set-Cookie',
    `lineId=; Path=/; HttpOnly; ${secure}SameSite=Lax; Max-Age=0`
  );
  return res;
}
