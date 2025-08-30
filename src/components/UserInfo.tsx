// src/components/UserInfo.tsx
'use client';
import Image from 'next/image';
import { useSession, signOut } from 'next-auth/react';

export default function UserInfo() {
  const { data: session } = useSession();
  const name = session?.user?.name ?? 'ログイン中';
  const picture = session?.user?.image ?? '';
  const lineId = session?.lineId;

  return (
    <div className="flex items-center justify-between p-4 mb-6 rounded bg-gray-50">
      <div className="flex items-center gap-3">
        {picture ? (
          <Image src={picture} alt="avatar" width={40} height={40} className="rounded-full" />
        ) : (
          <div className="w-10 h-10 rounded-full bg-gray-300" />
        )}
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
