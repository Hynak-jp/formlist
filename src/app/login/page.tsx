'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import liff from '@line/liff';

export default function LoginPage() {
  const router = useRouter();
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const init = async () => {
      try {
        await liff.init({ liffId: process.env.NEXT_PUBLIC_LIFF_ID! });
        if (liff.isLoggedIn()) {
          const profile = await liff.getProfile();
          const decoded = liff.getDecodedIDToken();

          const user = {
            name: profile.displayName,
            picture: profile.pictureUrl || '',
            sub: decoded?.sub,
          };

          sessionStorage.setItem('lineUser', JSON.stringify(user));
          router.push('/form');
        }
      } catch (e) {
        console.error('LIFF Init Failed', e);
      }
    };
    init();
  }, []);

  const handleLogin = () => {
    if (!agreed) return;
    setLoading(true);
    liff.login();
  };

  return (
    <main className="container mx-auto p-6 max-w-xl">
      <h1 className="text-2xl font-bold mb-4">LINEログイン & 利用同意</h1>
      <p className="mb-4">このフォームは破産申立のための必要情報を収集するものです。あなたのLINEアカウントと連携することで、各フォームへの入力情報と紐づけて管理します。</p>
      <label className="flex items-center mb-6">
        <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} className="mr-2" />
        利用目的を理解し、同意します
      </label>
      <button onClick={handleLogin} disabled={!agreed || loading} className="px-6 py-2 bg-green-500 text-white rounded disabled:bg-gray-400">
        {loading ? 'ログイン中…' : 'LINEでログインする'}
      </button>
    </main>
  );
}
