import crypto from 'crypto';

const SECRET = process.env.BOOTSTRAP_SECRET!;

const hmac = (s: string) => crypto.createHmac('sha256', SECRET).update(s).digest('hex');

export function makeFormUrl(base: string, lineId: string, caseId: string) {
  const url = new URL(base);
  const ts = Date.now().toString();
  url.searchParams.set('lineId', lineId);
  url.searchParams.set('caseId', caseId);
  url.searchParams.set('ts', ts);
  url.searchParams.set('sig', hmac(`${lineId}|${caseId}|${ts}`));
  return url.toString();
}

