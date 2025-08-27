import { Suspense } from 'react';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import LoginClient from './LoginClient';

export default async function LoginPage() {
  // ✅ サーバー側でCookie確認
  const store = await cookies();
  const lineId = store.get('lineId')?.value;
  if (lineId) {
    // すでにログイン済みなら即 /form へ
    redirect('/form');
  }

  return (
    <Suspense fallback={<div className="p-6">読み込み中…</div>}>
      <LoginClient />
    </Suspense>
  );
}
