import { NextResponse, type NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { createPaymentForm } from '@/lib/morning';

function siteUrl(req: NextRequest) {
  return (process.env.NEXT_PUBLIC_SITE_URL || req.nextUrl.origin).replace(/\/$/, '');
}

export async function POST(req: NextRequest) {
  const base = siteUrl(req);
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || !user.email) return NextResponse.redirect(`${base}/login?next=/course/map`, 303);

  const { data: profile } = await supabase.from('profiles').select('has_access').eq('id', user.id).maybeSingle();
  if (profile?.has_access) return NextResponse.redirect(`${base}/course/map`, 303);

  const amount = Number(process.env.COURSE_PRICE_ILS ?? 69);
  const admin = createAdminClient();
  const { data: purchase, error } = await admin
    .from('purchases')
    .insert({ user_id: user.id, amount, currency: 'ILS', status: 'pending' })
    .select('id')
    .single();
  if (error || !purchase) {
    console.error('checkout: could not create purchase', error);
    return NextResponse.redirect(`${base}/course/map?payment=error`, 303);
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
    return NextResponse.redirect(`${base}/course/map?payment=error`, 303);
  }
}
