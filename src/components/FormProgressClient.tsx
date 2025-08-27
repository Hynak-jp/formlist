'use client';

import ProgressBar from './ProgressBar';
import ResetProgressButton from './ResetProgressButton';
import { makeProgressStore } from '@/lib/progressStore';
import FormCard from './FormCard';

type Props = {
  lineId: string;
  forms: Array<{ formId: string; title: string; description: string; baseUrl: string }>;
};

export default function FormProgressClient({ lineId, forms }: Props) {
  const store = makeProgressStore(lineId)();
  const doneCount = forms.filter((f) => store.statusByForm[f.formId] === 'done').length;

  return (
    <>
      <ProgressBar total={forms.length} done={doneCount} />
      <div className="grid gap-6 md:grid-cols-2">
        {forms.map((form) => (
          <FormCard
            key={form.formId}
            formId={form.formId}
            title={form.title}
            description={form.description}
            baseUrl={form.baseUrl}
            lineId={lineId}
          />
        ))}
      </div>

      <ResetProgressButton onReset={store.resetAll} />
    </>
  );
}
