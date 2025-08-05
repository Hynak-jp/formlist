'use client';

import { useEffect, useState } from 'react';
import liff from '@line/liff';
import Image from 'next/image';

type Props = {
  onReady: (userData: { name: string; picture: string; sub: string }) => void;
};

export default function UserInfo({ onReady }: Props) {
  const [user, setUser] = useState<{ name: string; picture: string; sub: string } | null>(null);

  useEffect(() => {
    const initLiff = async () => {
      try {
        await liff.init({ liffId: process.env.NEXT_PUBLIC_LIFF_ID! });

        if (!liff.isLoggedIn()) {
          liff.login();
        } else {
          const profile = await liff.getProfile();
          const idToken = liff.getDecodedIDToken();
          const userData = {
            name: profile.displayName,
            picture: profile.pictureUrl || '',
            sub: idToken?.sub || '',
          };
          sessionStorage.setItem('lineUser', JSON.stringify(userData));
          setUser(userData);
          onReady(userData);
        }
      } catch (e) {
        console.error('LIFF init error', e);
      }
    };

    const stored = sessionStorage.getItem('lineUser');
    if (stored) {
      const parsed = JSON.parse(stored);
      setUser(parsed);
      onReady(parsed);
    } else {
      initLiff();
    }
  }, []);

  const handleLogout = () => {
    liff.logout();
    sessionStorage.removeItem('lineUser');
    location.href = '/login';
  };

  if (!user) return null;

  return (
    <div className="mb-6 p-4 border rounded shadow-sm bg-white">
      <div className="flex items-center gap-4 mb-2">
        <Image src={user.picture} alt="プロフィール画像" width={64} height={64} className="rounded-full" unoptimized />
        <div>
          <p className="font-bold">{user.name} さんでログイン中</p>
          <p className="text-sm text-gray-600">LINE ID: {user.sub}</p>
        </div>
      </div>
      <button onClick={handleLogout} className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">
        ログアウト
      </button>
    </div>
  );
}
