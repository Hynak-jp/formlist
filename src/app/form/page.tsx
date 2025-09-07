import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import UserInfo from '@/components/UserInfo';
import FormProgressClient from '@/components/FormProgressClient';
import { makeFormUrl } from '@/lib/formUrl';
import { headers } from 'next/headers';
// headers は不要。内部 API には相対パスで十分。

// サーバー動作の安定化（SSRで毎回取得）
export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';
export const runtime = 'nodejs';

// いまはAPIを叩かず、この関数内で定義した配列を返します。
// ※将来 /api/forms を作るなら、この関数の中身を fetch に置換してください。
type FormDef = { formId: string; title: string; description: string; baseUrl: string };
async function loadForms(): Promise<{ forms: FormDef[] }> {
  const forms: FormDef[] = [
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
  return { forms };
}

export default async function FormPage() {
  const { forms } = await loadForms(); // ← ここで取得
  const session = await getServerSession(authOptions);
  const lineId = session?.lineId ?? null;
  const displayName = session?.user?.name ?? '';

  if (!lineId) redirect('/login');

  // ← ここからは API 経由だけ。署名は API 側で実施。
  // 絶対URLを優先（未設定時はヘッダから組み立て）
  const h = await headers();
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL ||
    `${h.get('x-forwarded-proto') ?? 'http'}://${h.get('host')}`;
  const res = await fetch(`${baseUrl}/api/bootstrap`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ lineId, displayName }),
    cache: 'no-store',
  });

  let activeCaseId = '0001';
  try {
    const data = (await res.json()) as { activeCaseId?: string; ok?: boolean };
    if (res.ok && data?.activeCaseId) activeCaseId = data.activeCaseId;
  } catch {
    // ログだけ残してフォールバック
    console.error('bootstrap: non-JSON');
  }

  const formsWithHref = forms.map((f) => ({
    ...f,
    href: makeFormUrl(f.baseUrl, lineId!, activeCaseId || '0001'),
  }));

  return (
    <main className="container mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-6">提出フォーム一覧</h1>
      <UserInfo />
      <FormProgressClient lineId={lineId!} displayName={displayName} forms={formsWithHref} />
    </main>
  );
}
