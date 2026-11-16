import { NextResponse, type NextRequest } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { getDocument } from '@/lib/morning';

// Morning calls this after a successful payment (notifyUrl of the payment form).
// Morning does not sign these calls, so we (1) check a secret token in the URL and
// (2) re-read the document from Morning before granting access.
export async function POST(req: NextRequest) {
  const token = req.nextUrl.searchParams.get('token');
  const pid = req.nextUrl.searchParams.get('pid');
  if (!token || token !== process.env.MORNING_WEBHOOK_SECRET || !pid) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  const raw = await req.text();
  let payload: Record<string, unknown> = {};
  try {
    payload = raw.trim().startsWith('{') ? JSON.parse(raw) : Object.fromEntries(new URLSearchParams(raw));
  } catch {
    payload = { raw };
  }
  const documentId = String(payload.documentId ?? payload.document_id ?? payload.id ?? '');

  const admin = createAdminClient();
  const { data: purchase } = await admin.from('purchases').select('id, user_id, amount, status').eq('id', pid).maybeSingle();
  if (!purchase) return NextResponse.json({ ok: false, reason: 'unknown purchase' }, { status: 404 });
  if (purchase.status === 'paid') return NextResponse.json({ ok: true, duplicate: true });

  await admin.from('purchases').update({ raw_notify: payload }).eq('id', pid);
  if (!documentId) return NextResponse.json({ ok: false, reason: 'no documentId' }, { status: 202 });

  try {
    const doc = await getDocument(documentId);
    const candidates = [doc.amount, doc.total, doc.amountTotal, doc.payment?.[0]?.price].map(Number).filter((n) => Number.isFinite(n) && n > 0);
    const total = candidates.length ? candidates[0] : null;
    if (total !== null && total < Number(purchase.amount) - 0.01) {
      console.error('notify: amount mismatch', { pid, total, expected: purchase.amount });
      return NextResponse.json({ ok: false, reason: 'amount mismatch' }, { status: 202 });
    }
  } catch (e) {
    console.error('notify: could not verify document', e);
    return NextResponse.json({ ok: false, reason: 'verify failed' }, { status: 500 }); // Morning will retry
  }

  const now = new Date().toISOString();
  await admin.from('purchases').update({ status: 'paid', paid_at: now, morning_document_id: documentId }).eq('id', pid);
  await admin.from('profiles').update({ has_access: true, access_granted_at: now }).eq('id', purchase.user_id);
  return NextResponse.json({ ok: true });
}
