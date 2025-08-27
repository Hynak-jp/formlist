'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import liff from '@line/liff';

export default function LoginPage() {
  const router = useRouter();
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);

  const bridgeAndGo = useCallback(async () => {
    const decoded = liff.getDecodedIDToken();
    const sub = decoded?.sub;
    if (!sub) return;
    await fetch('/api/set-login-cookie', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ lineId: sub }),
    });
    router.replace('/form');
  }, [router]);

  useEffect(() => {
    (async () => {
      await liff.init({ liffId: process.env.NEXT_PUBLIC_LIFF_ID! });
      if (liff.isLoggedIn()) {
        await bridgeAndGo();
      }
    })();
  }, [bridgeAndGo]); // ←依存配列に追加OK

  const handleLogin = async () => {
    if (!agreed) return;
    setLoading(true);
    try {
      if (!liff.isLoggedIn()) await liff.login();
      await bridgeAndGo();
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="container mx-auto p-6 max-w-xl">
      <h1 className="text-2xl font-bold mb-4">LINEログイン & 利用同意</h1>
      <p className="mb-4">
        このフォームは破産申立のための必要情報を収集するものです。あなたのLINEアカウントと連携することで、各フォームへの入力情報と紐づけて管理します。
      </p>
      <label className="flex items-center mb-6">
        <input
          type="checkbox"
          checked={agreed}
          onChange={(e) => setAgreed(e.target.checked)}
          className="mr-2"
        />
        利用目的を理解し、同意します
      </label>
      <button
        onClick={handleLogin}
        disabled={!agreed || loading}
        className="px-4 py-2 bg-green-500 text-white rounded disabled:opacity-50"
      >
        LINEでログイン
      </button>
    </main>
  );
}
