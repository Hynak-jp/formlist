// app/api/read-cookie/route.ts
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET() {
  const cookieStore = cookies();
  const value = cookieStore.get('test_cookie')?.value || null;

  return NextResponse.json({ value });
}
