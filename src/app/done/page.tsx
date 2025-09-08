import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import DoneClient from './DoneClient';

export default async function DonePage({ searchParams }: { searchParams: { form?: string } }) {
  const session = await getServerSession(authOptions);
  const lineId = session?.lineId as string | undefined;
  if (!lineId) return <p>ログインが切れています。再ログインしてください。</p>;
  return <DoneClient lineId={lineId} form={searchParams.form ?? ''} />;
}
