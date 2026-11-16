import { NextResponse, type NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { createPaymentForm } from '@/lib/morning';
import { PRICE_ILS, TERMS_VERSION, accessOpen } from '@/lib/legal';

function siteUrl(req: NextRequest) {
  return (process.env.NEXT_PUBLIC_SITE_URL || req.nextUrl.origin).replace(/\/$/, '');
}

export async function POST(req: NextRequest) {
  const base = siteUrl(req);
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || !user.email) return NextResponse.redirect(`${base}/login?next=/checkout`, 303);

  // The buyer must accept the terms on the checkout page before paying.
  const form = await req.formData().catch(() => null);
  if (form?.get('accept') !== 'yes') return NextResponse.redirect(`${base}/checkout?need_accept=1`, 303);
  if (!accessOpen()) return NextResponse.redirect(`${base}/checkout`, 303);

  const { data: profile } = await supabase.from('profiles').select('has_access').eq('id', user.id).maybeSingle();
  if (profile?.has_access) return NextResponse.redirect(`${base}/course/map`, 303);

  const amount = PRICE_ILS;
  const admin = createAdminClient();
  const row = { user_id: user.id, amount, currency: 'ILS', status: 'pending' };
  let { data: purchase, error } = await admin
    .from('purchases')
    .insert({ ...row, terms_version: TERMS_VERSION, terms_accepted_at: new Date().toISOString() })
    .select('id')
    .single();
  if (error && /terms_/.test(error.message ?? '')) {
    // migration 0002 not applied yet: still sell, log loudly
    console.error('checkout: run supabase/migrations/0002_terms.sql to record terms acceptance');
    ({ data: purchase, error } = await admin.from('purchases').insert(row).select('id').single());
  }
  if (error || !purchase) {
    console.error('checkout: could not create purchase', error);
    return NextResponse.redirect(`${base}/checkout?payment=error`, 303);
  }

  try {
    const url = await createPaymentForm({
      purchaseId: purchase.id, email: user.email, name: user.user_metadata?.full_name ?? '', amount, siteUrl: base,
    });
    await admin.from('purchases').update({ payment_url: url }).eq('id', purchase.id);
    return NextResponse.redirect(url, 303);
  } catch (e) {
    console.error('checkout: Morning payment form failed', e);
    await admin.from('purchases').update({ status: 'failed' }).eq('id', purchase.id);
    return NextResponse.redirect(`${base}/checkout?payment=error`, 303);
  }
}
