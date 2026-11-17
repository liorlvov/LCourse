import { NextResponse, type NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { createPaymentForm } from '@/lib/morning';
import { TERMS_VERSION } from '@/lib/legal';
import { accessOpen, courseBase, courseByKey } from '@/lib/courses';
import { getViewer, hasCourse } from '@/lib/access';

function siteUrl(req: NextRequest) {
  return (process.env.NEXT_PUBLIC_SITE_URL || req.nextUrl.origin).replace(/\/$/, '');
}

export async function POST(req: NextRequest) {
  const base = siteUrl(req);
  const form = await req.formData().catch(() => null);
  const course = courseByKey(String(form?.get('course') ?? ''));
  if (!course || course.status !== 'live' || !course.price) return NextResponse.redirect(`${base}/`, 303);
  const back = `${base}/checkout?course=${course.key}`;

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || !user.email) return NextResponse.redirect(`${base}/login?next=${encodeURIComponent(`/checkout?course=${course.key}`)}`, 303);

  // The buyer must accept the terms on the checkout page before paying.
  if (form?.get('accept') !== 'yes') return NextResponse.redirect(`${back}&need_accept=1`, 303);
  if (!accessOpen(course)) return NextResponse.redirect(back, 303);
  if (hasCourse(await getViewer(), course.key)) return NextResponse.redirect(`${base}${courseBase(course)}/map`, 303);

  const amount = course.price;
  const admin = createAdminClient();
  const row = { user_id: user.id, amount, currency: 'ILS', status: 'pending' };
  let { data: purchase, error } = await admin
    .from('purchases')
    .insert({ ...row, course_key: course.key, terms_version: TERMS_VERSION, terms_accepted_at: new Date().toISOString() })
    .select('id')
    .single();
  if (error && /course_key|terms_/.test(error.message ?? '')) {
    // migrations 0002/0003 not applied yet: still sell, but log loudly
    console.error('checkout: run supabase/migrations 0002 and 0003', error.message);
    ({ data: purchase, error } = await admin.from('purchases').insert(row).select('id').single());
  }
  if (error || !purchase) {
    console.error('checkout: could not create purchase', error);
    return NextResponse.redirect(`${back}&payment=error`, 303);
  }

  try {
    const url = await createPaymentForm({
      purchaseId: purchase.id, email: user.email, name: user.user_metadata?.full_name ?? '', amount, siteUrl: base,
      description: `${course.title}: גישה מלאה לסביבת הלמידה`, courseKey: course.key,
    });
    await admin.from('purchases').update({ payment_url: url }).eq('id', purchase.id);
    return NextResponse.redirect(url, 303);
  } catch (e) {
    console.error('checkout: Morning payment form failed', e);
    await admin.from('purchases').update({ status: 'failed' }).eq('id', purchase.id);
    return NextResponse.redirect(`${back}&payment=error`, 303);
  }
}
