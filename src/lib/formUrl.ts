// src/lib/formUrl.ts
import crypto from 'crypto';

export function makeFormUrl(baseUrl: string, lineId: string, caseId: string) {
  const ts = Date.now();
  const secret = process.env.BOOTSTRAP_SECRET!;

  // FormMailerの隠しフィールドに対応
  const params = new URLSearchParams({
    'line_id[0]': lineId,
    'case_id[0]': caseId,
    ts: String(ts),
    sig: crypto.createHmac('sha256', secret).update(`${lineId}|${caseId}|${ts}`).digest('hex'),
  });

  return `${baseUrl}?${params.toString()}`;
}

// 受付フォーム: lineId|ts で署名（caseId なし）
export function makeIntakeUrl(baseUrl: string, lineId: string, redirectUrl?: string) {
  const ts = Math.floor(Date.now() / 1000); // 秒に統一
  const secret = process.env.BOOTSTRAP_SECRET!;
  const sig = crypto.createHmac('sha256', secret).update(`${lineId}|${ts}`, 'utf8').digest('hex');
  const params = new URLSearchParams({
    'line_id[0]': lineId,
    ts: String(ts),
    sig,
  });
  if (redirectUrl) params.set('redirect_url', redirectUrl);
  return `${baseUrl}?${params.toString()}`;
}
// 署名対象: lineId|caseId|ts（formId は不要）
// アルゴリズム: HMAC-SHA256, 出力は hex(64文字)
// 秘密鍵: BOOTSTRAP_SECRET（環境変数）
// caseId を含めることで URL の使い回し防止
// ts はミリ秒の UNIX タイム。FormMailer 側で有効期限チェック可能
// 署名は FormMailer 側で検証する前提
//
// アルゴリズム変更時:
// - makeFormUrl と FormMailer 両方を更新
// - 後方互換や段階的移行を検討
// - セキュリティレビューと十分なテストを実施
// - ドキュメントを更新し、関係者に周知
