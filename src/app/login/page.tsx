import { Suspense } from 'react';
import LoginClient from './LoginClient';

// 必要ならSSR前提を明示（任意）
// export const dynamic = 'force-dynamic';
// export const fetchCache = 'force-no-store';

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="p-6">読み込み中…</div>}>
      <LoginClient />
    </Suspense>
  );
}
