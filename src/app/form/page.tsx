import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { getServerSession, type Session } from 'next-auth';
import { authOptions } from '@/lib/auth';

import UserInfo from '@/components/UserInfo';
import FormProgressClient from '@/components/FormProgressClient';

// NextAuthのSessionに lineId を“拡張”した型
type BASession = Session & { lineId?: string | null };

export default async function FormPage() {
  // 1) NextAuth セッションを最優先
  const session = (await getServerSession(authOptions)) as BASession | null;
  const lineIdFromSession = session?.lineId ?? null;

  // 2) 旧cookie(lineId)でフォールバック（移行中だけ）
  const cookieStore = await cookies();
  const lineIdFromCookie = cookieStore.get('lineId')?.value ?? null;

  const lineId = lineIdFromSession || lineIdFromCookie;
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

      <div className="mt-8">
        {/* NextAuth標準のログアウト */}
        <a
          className="inline-block rounded px-3 py-2 border"
          href="/api/auth/signout?callbackUrl=/login"
        >
          ログアウト
        </a>
      </div>
    </main>
  );
}
