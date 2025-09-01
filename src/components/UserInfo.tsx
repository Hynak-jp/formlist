// src/components/UserInfo.tsx
'use client';
import { useSession } from 'next-auth/react';
import { useMemo, useState } from 'react';

export default function UserInfo() {
  const { data: session, status } = useSession();
  const [err, setErr] = useState<string | null>(null);

  const picture = useMemo(
    () => (session?.user?.image ? String(session.user.image) : ''),
    [session?.user?.image]
  );

  if (status === 'loading') {
    return <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse" />;
  }

  return (
    <div className="flex items-center gap-3">
      {/* ★ フォールバックは一切出さない。画像URLがある時だけ描画 */}
      {picture ? (
        <img
          src={picture}
          alt="avatar"
          width={40}
          height={40}
          className="rounded-full"
          referrerPolicy="no-referrer" // 参照元制限の可能性を潰す
          onError={(e) => {
            console.error('[Avatar onError]', picture, e.currentTarget);
            setErr('onError');
          }}
          onLoad={() => {
            console.log('[Avatar onLoad]', picture);
            setErr(null);
          }}
        />
      ) : (
        <div className="w-10 h-10 rounded-full bg-gray-100" />
      )}

      {/* デバッグ表示（確認できたら消してOK） */}
      <pre className="text-[10px] opacity-60 max-w-[50ch] overflow-hidden text-ellipsis">
        {picture}
        {err ? `\nERR: ${err}` : ''}
      </pre>
    </div>
  );
}
