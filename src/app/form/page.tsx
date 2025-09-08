import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import UserInfo from '@/components/UserInfo';
import FormProgressClient from '@/components/FormProgressClient';
import { makeFormUrl, makeIntakeUrl } from '@/lib/formUrl';
import { headers } from 'next/headers';
// headers は不要。内部 API には相対パスで十分。

// サーバー動作の安定化（SSRで毎回取得）
export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';
export const runtime = 'nodejs';

// TODO: 必要に応じて /api/forms に移行
type FormDef = { formId: string; title: string; description: string; baseUrl: string };
async function loadForms(): Promise<{ forms: FormDef[] }> {
  const forms: FormDef[] = [
    {
      formId: '302516',
      title: '初回受付フォーム',
      description: '初回受付の情報を記入します',
      baseUrl: 'https://business.form-mailer.jp/fms/47a7602b302516',
    },
    {
      formId: '308335',
      title: 'S2002 破産手続開始申立書',
      description: '破産手続開始申立書の情報を記入します',
      baseUrl: 'https://business.form-mailer.jp/fms/d9b655cb308335',
    },
    {
      formId: '308463',
      title: 'S2005 債権者一覧表',
      description: '債権者情報を記入します',
      baseUrl: 'https://business.form-mailer.jp/lp/47a7602b302516',
    },
    {
      formId: '308466',
      title: 'S2011 家計収支提出フォーム',
      description: '申立前２か月分の家計収支表を記入します',
      baseUrl: 'https://business.form-mailer.jp/fms/0f10ce9b307065',
    },
    {
      formId: '307065',
      title: '書類提出フォーム',
      description: '給与明細などの書類をアップロードします',
      baseUrl: 'https://business.form-mailer.jp/fms/0f10ce9b307065',
    },
  ];
  return { forms };
}

export default async function FormPage() {
  const { forms } = await loadForms(); // ← ここで取得
  const session = await getServerSession(authOptions);
  const lineId = session?.lineId ?? null;
  const displayName = session?.user?.name ?? '';

  if (!lineId) redirect('/login');

  // ステータス問い合わせ（caseId が無ければ intake フォームのみ表示）
  const h = await headers();
  const origin =
    process.env.NEXT_PUBLIC_BASE_URL ||
    `${h.get('x-forwarded-proto') ?? 'http'}://${h.get('host')}`;
  const res = await fetch(`${origin}/api/status`, {
    method: 'GET',
    headers: { 'x-line-id': lineId },
    cache: 'no-store',
  });
  const status = (await res.json()) as {
    ok?: boolean;
    hasIntake?: boolean;
    activeCaseId?: string | null;
  };

  if (!status?.hasIntake) {
    const intakeBase = process.env.NEXT_PUBLIC_INTAKE_FORM_URL!;
    const url = makeIntakeUrl(intakeBase, lineId!, `${origin}/done?form=intake`);
    return (
      <main className="container mx-auto px-4 py-10">
        <h1 className="text-2xl font-semibold mb-4">まずは「受付フォーム」をご記入ください</h1>
        <UserInfo />
        <div className="mt-6">
          <a className="inline-block px-4 py-2 bg-blue-600 text-white rounded" href={url}>
            受付フォームを開く
          </a>
        </div>
      </main>
    );
  }

  const activeCaseId = status.activeCaseId || '0001';
  const formsWithHref = forms.map((f) => ({
    ...f,
    href: makeFormUrl(f.baseUrl, lineId!, activeCaseId),
  }));

  return (
    <main className="container mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-6">提出フォーム一覧</h1>
      <UserInfo />
      <FormProgressClient lineId={lineId!} displayName={displayName} forms={formsWithHref} />
    </main>
  );
}
