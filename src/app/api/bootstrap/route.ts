import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

const GAS_ENDPOINT = process.env.GAS_ENDPOINT!;
const SECRET = process.env.BOOTSTRAP_SECRET!;

const hmac = (s: string) => crypto.createHmac('sha256', SECRET).update(s).digest('hex');

export async function POST(req: NextRequest) {
  try {
    const { lineId, displayName } = await req.json();
    if (!lineId) return NextResponse.json({ error: 'missing_lineId' }, { status: 400 });
    const ts = Date.now().toString();
    const sig = hmac(`${lineId}|${ts}`);
    const r = await fetch(GAS_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ lineId, displayName, ts, sig }),
      cache: 'no-store',
    });
    const data = await r.json();
    return r.ok ? NextResponse.json(data) : NextResponse.json(data, { status: 500 });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
