'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { makeProgressStore } from '@/lib/progressStore';

export default function DoneClient({ lineId }: { lineId: string }) {
  const search = useSearchParams();
  const router = useRouter();
  const formId = search.get('formId') || 'unknown';
  const formKey = search.get('form') || '';

  const store = makeProgressStore(lineId)();

  useEffect(() => {
    // 受付フォーム完了時に intake を確定（最初の一度だけ採番）
    const intakeFormId = process.env.NEXT_PUBLIC_INTAKE_FORM_ID;
    const isIntake = formKey === 'intake' || (intakeFormId && formId === intakeFormId);
    if (isIntake) {
      fetch('/api/intake/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lineId }),
        cache: 'no-store',
      }).catch(() => {});
    }
    // 送信完了を記録して一覧へ
    store.setStatus(formId, 'done');
    router.replace('/form');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formId, formKey]);

  return <div className="p-6">送信を記録しています…</div>;
}
