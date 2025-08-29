export default function LoginPage() {
  return (
    <main className="p-6">
      <h1 className="text-xl mb-4">ログイン</h1>
      <a
        className="inline-block rounded px-4 py-2 border"
        href="/api/auth/signin/line?callbackUrl=/form"
      >
        LINEでログイン
      </a>
    </main>
  );
}
