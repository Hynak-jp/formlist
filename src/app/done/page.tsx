import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import DoneClient from './DoneClient';

export default async function DonePage() {
  const store = await cookies();
  const lineId = store.get('lineId')?.value;
  if (!lineId) redirect('/login');

  return <DoneClient lineId={lineId} />;
}
