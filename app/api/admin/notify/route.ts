import { NextResponse, type NextRequest } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { getViewer } from '@/lib/access';
import { courseBase, courseByKey } from '@/lib/courses';
import { getContent } from '@/lib/content';
import { sendBatch, updateEmailHtml } from '@/lib/mail';

// Owner-only: e-mail one course update to everyone who has access to that course. Each update is sent once.
export async function POST(req: NextRequest) {
  const site = (process.env.NEXT_PUBLIC_SITE_URL || req.nextUrl.origin).replace(/\/$/, '');
  const viewer = await getViewer();
  if (!viewer.owner) return NextResponse.json({ ok: false }, { status: 403 });

  const form = await req.formData().catch(() => null);
  const course = courseByKey(String(form?.get('course') ?? ''));
  const k = course ? getContent(course.key) : undefined;
  const update = k?.updates.find((u) => u.id === String(form?.get('update') ?? ''));
  if (!course || !k || !update) return NextResponse.redirect(`${site}/admin?error=unknown`, 303);

  const admin = createAdminClient();
  const { data: already } = await admin.from('update_mailings').select('update_id').eq('course_key', course.key).eq('update_id', update.id).maybeSingle();
  if (already) return NextResponse.redirect(`${site}/admin?error=already`, 303);

  // everyone with access: course_access rows, plus the legacy flag for Physics 3
  const ids = new Set<string>();
  const { data: acc } = await admin.from('course_access').select('user_id').eq('course_key', course.key);
  (acc ?? []).forEach((r: { user_id: string }) => ids.add(r.user_id));
  if (course.key === 'bgu-physics-3') {
    const { data: legacy } = await admin.from('profiles').select('id').eq('has_access', true);
    (legacy ?? []).forEach((r: { id: string }) => ids.add(r.id));
  }
  const { data: people } = ids.size
    ? await admin.from('profiles').select('email').in('id', [...ids])
    : { data: [] as { email: string | null }[] };
  const emails = [...new Set((people ?? []).map((p) => p.email).filter((e): e is string => !!e))];

  try {
    const html = updateEmailHtml({ courseTitle: course.title, update, url: `${site}${courseBase(course)}/updates`, siteUrl: site });
    const sent = emails.length ? await sendBatch(emails, `${course.title}: ${update.title}`, html) : 0;
    await admin.from('update_mailings').insert({ course_key: course.key, update_id: update.id, recipients: sent });
    return NextResponse.redirect(`${site}/admin?sent=${sent}`, 303);
  } catch (e) {
    console.error('admin notify failed', e);
    return NextResponse.redirect(`${site}/admin?error=send`, 303);
  }
}
