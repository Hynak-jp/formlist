// src/app/login/page.tsx
import Link from 'next/link';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';

export default async function LoginPage() {
  const session = await getServerSession(authOptions);
  if (session?.lineId) redirect('/form');

  return (
    <main className="container mx-auto p-6 max-w-xl">
      <h1 className="text-2xl font-bold mb-4">LINEでログイン</h1>
      <p className="mb-6">ログインするとフォーム一覧に移動します。</p>
      <Link
        href="/api/auth/signin/line?callbackUrl=/form"
        className="px-4 py-2 rounded bg-green-600 text-white"
      >
        LINEでログイン
      </Link>
    </main>
  );
}
