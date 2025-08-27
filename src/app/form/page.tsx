// src/app/form/page.tsx
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import UserInfo from '@/components/UserInfo';
import FormProgressClient from '@/components/FormProgressClient';

// SSR で毎回ガード
export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

export default async function FormPage() {
  const cookieStore = await cookies();
  const lineId = cookieStore.get('lineId')?.value ?? null;

  if (!lineId) {
    redirect('/login');
  }

  // ← 必要なフォームをここで定義（formId を必ず付ける）
  const forms = [
    {
      formId: '302516',
      title: '破産者情報フォーム',
      description: '収支や借金の内容を記入します',
      baseUrl: 'https://business.form-mailer.jp/lp/47a7602b302516',
    },
    {
      formId: '302516-2',
      title: '債権者一覧フォーム',
      description: '借入先の情報を記入します',
      baseUrl: 'https://business.form-mailer.jp/lp/47a7602b302516',
    },
    {
      formId: '302516-3',
      title: '収入・支出フォーム',
      description: '家計の情報を記入します',
      baseUrl: 'https://business.form-mailer.jp/lp/47a7602b302516',
    },
    {
      formId: '302516-4',
      title: '添付書類アップロード',
      description: '各種証明書等をアップロードします',
      baseUrl: 'https://business.form-mailer.jp/lp/47a7602b302516',
    },
  ];

  return (
    <main className="container mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-6">提出フォーム一覧</h1>
      <UserInfo />
      <FormProgressClient lineId={lineId!} forms={forms} />
    </main>
  );
}
