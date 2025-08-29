import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function FormPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  return (
    <main className="p-6">
      <div className="flex items-center gap-3 mb-4">
        {session.user?.image && <img src={session.user.image} alt="" width={36} height={36} className="rounded-full" />}
        <div>
          <div className="text-sm text-gray-500">ログイン中</div>
          <div className="font-medium">{session.user?.name ?? "LINEユーザー"}</div>
        </div>
      </div>

      <a className="inline-block rounded px-3 py-2 border mb-6"
         href="/api/auth/signout?callbackUrl=/login">ログアウト</a>

      {/* ここに既存のフォーム一覧UIを埋め込む。CSRのコンポーネントでもOK */}
      <h1 className="text-xl mb-2">フォーム一覧</h1>
      {/* <FormList /> 等 */}
    </main>
  );
}
