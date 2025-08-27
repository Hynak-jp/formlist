'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import liff from '@line/liff';

export default function LoginPage() {
  const router = useRouter();
  const search = useSearchParams();
  const redirectTo = search.get('redirect') || '/form';

  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const bridgeAndGo = useCallback(async () => {
    const decoded = liff.getDecodedIDToken();
    const sub = decoded?.sub;
    if (!sub) return;

    await fetch('/api/set-login-cookie', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      // same-origin なので credentials 省略可（明示したいなら 'same-origin' を設定）
      body: JSON.stringify({ lineId: sub }),
    });

    router.replace(redirectTo);
  }, [router, redirectTo]);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        await liff.init({ liffId: process.env.NEXT_PUBLIC_LIFF_ID! });
        if (liff.isLoggedIn()) {
          await bridgeAndGo(); // 既ログインなら即ブリッジ→遷移
        }
      } catch (e) {
        console.error(e);
        setErrorMsg('LINEの初期化に失敗しました。しばらくしてから再度お試しください。');
      } finally {
        setLoading(false);
      }
    })();
  }, [bridgeAndGo]);

  const handleLogin = async () => {
    if (!agreed || loading) return;
    setLoading(true);
    setErrorMsg(null);
    try {
      if (!liff.isLoggedIn())
        await liff.login(); // 戻ってきたら useEffect 側が bridgeAndGo を実行
      else await bridgeAndGo();
    } catch (e) {
      console.error(e);
      setErrorMsg('ログインに失敗しました。もう一度お試しください。');
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

      <label className="flex items-center mb-4">
        <input
          type="checkbox"
          checked={agreed}
          onChange={(e) => setAgreed(e.target.checked)}
          className="mr-2"
        />
        利用目的を理解し、同意します
      </label>

      {errorMsg && <p className="mb-3 text-red-600 text-sm">{errorMsg}</p>}

      <button
        onClick={handleLogin}
        disabled={!agreed || loading}
        className="px-4 py-2 bg-green-500 text-white rounded disabled:opacity-50"
      >
        {loading ? '処理中…' : 'LINEでログイン'}
      </button>
    </main>
  );
}
