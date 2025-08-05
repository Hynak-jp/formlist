import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import FormCard from '@/components/FormCard';
import UserInfo from '@/components/UserInfo';

export default async function FormPage() {
  const cookieStore = await cookies(); // ✅ await をつける
  const lineId = cookieStore.get('lineId')?.value ?? null;

  console.log('🟢 lineId from cookie:', lineId);

  if (!lineId) {
    redirect('/login'); // 未ログインならログイン画面へ
    return null;
  }

  const forms = [
    {
      title: '家計表',
      description: '収支や借金の内容を記入します',
      baseUrl: 'https://business.form-mailer.jp/lp/47a7602b302516',
    },
    {
      title: '財産目録',
      description: '資産や保険などを記入します',
      baseUrl: 'https://business.form-mailer.jp/lp/47a7602b302516',
    },
    {
      title: '債権者一覧',
      description: '借入先の情報を記入します',
      baseUrl: 'https://business.form-mailer.jp/lp/47a7602b302516',
    },
    {
      title: 'その他情報',
      description: '家族や特記事項などを記入します',
      baseUrl: 'https://business.form-mailer.jp/lp/47a7602b302516',
    },
  ];

  return (
    <main className="container mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-6">提出フォーム一覧</h1>

      <UserInfo />

      <div className="grid gap-6 md:grid-cols-2">
        {forms.map((form) => (
          <FormCard key={form.title} title={form.title} description={form.description} baseUrl={form.baseUrl} lineId={lineId!} />
        ))}
      </div>
    </main>
  );
}
