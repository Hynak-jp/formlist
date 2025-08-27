'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { makeProgressStore } from '@/lib/progressStore';

export default function DoneClient({ lineId }: { lineId: string }) {
  const search = useSearchParams();
  const router = useRouter();
  const formId = search.get('formId') || 'unknown';

  const store = makeProgressStore(lineId)();

  useEffect(() => {
    // 送信完了を記録して一覧へ
    store.setStatus(formId, 'done');
    router.replace('/form');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formId]);

  return <div className="p-6">送信を記録しています…</div>;
}
