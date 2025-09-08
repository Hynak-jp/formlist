'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { makeProgressStore } from '@/lib/progressStore';

export default function DoneClient({ lineId, form }: { lineId: string; form: string }) {
  const search = useSearchParams();
  const router = useRouter();
  const formId = search.get('formId') || 'unknown';

  const store = makeProgressStore(lineId)();

  useEffect(() => {
    // 受付フォーム完了のときだけ、サーバー間で intake_complete を通知
    if (form === 'intake') {
      fetch('/api/intake/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lineId }),
      }).catch(() => {});
    }
    // 送信完了を記録して一覧へ
    store.setStatus(formId, 'done');
    router.replace('/form');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form, formId, lineId]);

  return <p>送信ありがとうございました。フォーム一覧に戻れます。</p>;
}
