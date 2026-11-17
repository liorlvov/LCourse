import { NextResponse, type NextRequest } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { courseBase, courseByKey } from '@/lib/courses';

// "Tell me when it opens" for coming-soon courses. Only the server writes the waitlist table.
export async function POST(req: NextRequest) {
  const base = (process.env.NEXT_PUBLIC_SITE_URL || req.nextUrl.origin).replace(/\/$/, '');
  const form = await req.formData().catch(() => null);
  const course = courseByKey(String(form?.get('course') ?? ''));
  if (!course) return NextResponse.redirect(`${base}/`, 303);
  const page = `${base}${courseBase(course)}`;
  const email = String(form?.get('email') ?? '').trim().toLowerCase();
  if (!/^[^\s@]{1,64}@[^\s@]{1,190}\.[a-z]{2,}$/i.test(email)) return NextResponse.redirect(`${page}?error=1`, 303);
  const { error } = await createAdminClient()
    .from('waitlist')
    .upsert({ email, course_key: course.key }, { onConflict: 'email,course_key', ignoreDuplicates: true });
  if (error) {
    console.error('waitlist: insert failed (run migration 0003?)', error.message);
    return NextResponse.redirect(`${page}?error=1`, 303);
  }
  return NextResponse.redirect(`${page}?joined=1`, 303);
}
