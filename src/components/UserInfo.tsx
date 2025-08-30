// src/components/UserInfo.tsx
'use client';
import Image from 'next/image';
import { useSession, signOut } from 'next-auth/react';
import { useState } from 'react';

export default function UserInfo() {
  const { data: session } = useSession();
  const name = session?.user?.name ?? 'ログイン中';
  const lineId = session?.lineId;
  const [imgErr, setImgErr] = useState(false);

  // エラー時はローカルのフォールバック画像へ
  const picture = !imgErr && session?.user?.image ? session.user.image : '/avatar-fallback.svg';

  return (
    <div className="flex items-center justify-between p-4 mb-6 rounded bg-gray-50">
      <div className="flex items-center gap-3">
        <Image
          src={picture}
          alt="avatar"
          width={40}
          height={40}
          className="rounded-full"
          onError={() => setImgErr(true)}
          // 動作確認用。remotePatternsが効けば外してOK
          unoptimized
        />
        <div>
          <p className="font-bold">{name} さんでログイン中</p>
          {lineId && <p className="text-sm text-gray-600">LINE ID: {lineId}</p>}
        </div>
      </div>
      <button
        onClick={() => signOut({ callbackUrl: '/login' })}
        className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
      >
        ログアウト
      </button>
    </div>
  );
}
