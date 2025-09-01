'use client';

import Image from 'next/image';
import { useSession, signOut } from 'next-auth/react';
import { useState } from 'react';

export default function UserInfo() {
  const { data: session, status } = useSession();
  const [imgErr, setImgErr] = useState(false);

  const name = session?.user?.name ?? 'ログイン中';
  const lineId = session?.lineId;

  // 認証済みかつエラーなしなら LINE の画像URL、それ以外はローカルのフォールバック
  const picture =
    status === 'authenticated' && !imgErr && session?.user?.image
      ? session.user.image
      : '/avatar-fallback.svg';

  return (
    <div className="flex items-center justify-between p-4 mb-6 rounded bg-gray-50">
      <div className="flex items-center gap-3">
        <Image
          key={picture} // 画像URLが変わったときに再描画されるように
          src={picture}
          alt="avatar"
          width={40}
          height={40}
          className="rounded-full"
          onError={() => setImgErr(true)}
          referrerPolicy="no-referrer"
          // ※ unoptimized は動作確認用。remotePatternsが効いていれば外してOK
          unoptimized
        />
        <div>
          <p className="font-bold">{name} さんでログイン中</p>
          {lineId && <p className="text-sm text-gray-600">LINE ID: {lineId}</p>}
        </div>
      </div>
      {status === 'authenticated' && (
        <button
          onClick={() => signOut({ callbackUrl: '/login' })}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          ログアウト
        </button>
      )}
    </div>
  );
}
