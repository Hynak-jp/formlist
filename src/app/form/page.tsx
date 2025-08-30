import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import UserInfo from '@/components/UserInfo';
import FormProgressClient from '@/components/FormProgressClient';

export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

export default async function FormPage() {
  const session = await getServerSession(authOptions);
  const lineId = session?.lineId ?? null;

  if (!lineId) redirect('/login');

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
      formId: '307065',
      title: '書類提出フォーム',
      description: '給与明細、家計収支などの書類をアップロードします',
      baseUrl: 'https://business.form-mailer.jp/fms/0f10ce9b307065',
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
