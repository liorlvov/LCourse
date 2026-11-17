import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Brand from '@/components/Brand';
import { getViewer } from '@/lib/access';
import { createAdminClient } from '@/lib/supabase/admin';
import { COURSES, courseBase, getUni } from '@/lib/courses';
import { getContent } from '@/lib/content';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'ניהול', robots: { index: false } };

const MSG: Record<string, string> = {
  unknown: 'לא נמצא העדכון או הקורס.',
  already: 'המייל על העדכון הזה כבר נשלח.',
  send: 'השליחה נכשלה. בדוק ש־RESEND_API_KEY ו־MAIL_FROM מוגדרים ב־Vercel.',
};

async function counts() {
  const admin = createAdminClient();
  const [users, access, legacy, paid, waitlist, mailings] = await Promise.all([
    admin.from('profiles').select('id', { count: 'exact', head: true }),
    admin.from('course_access').select('course_key'),
    admin.from('profiles').select('id', { count: 'exact', head: true }).eq('has_access', true),
    admin.from('purchases').select('*').eq('status', 'paid'),
    admin.from('waitlist').select('course_key'),
    admin.from('update_mailings').select('course_key, update_id, recipients, sent_at'),
  ]);
  const by = (rows: { course_key?: string }[] | null) =>
    (rows ?? []).reduce<Record<string, number>>((m, r) => ({ ...m, [r.course_key ?? 'bgu-physics-3']: (m[r.course_key ?? 'bgu-physics-3'] ?? 0) + 1 }), {});
  const revenue = (paid.data ?? []).reduce<Record<string, number>>((m, r) => {
    const key = r.course_key ?? 'bgu-physics-3';
    return { ...m, [key]: (m[key] ?? 0) + Number(r.amount ?? 0) };
  }, {});
  return {
    users: users.count ?? 0,
    access: by(access.data),
    legacy: legacy.count ?? 0,
    sales: by(paid.data),
    revenue,
    waitlist: by(waitlist.data),
    mailed: new Map((mailings.data ?? []).map((m) => [`${m.course_key}/${m.update_id}`, m])),
    migrated: !access.error && !waitlist.error,
  };
}

export default async function Admin({ searchParams }: { searchParams: Promise<{ sent?: string; error?: string }> }) {
  const viewer = await getViewer();
  if (!viewer.owner) notFound();
  const sp = await searchParams;
  const c = await counts();
  return (
    <>
      <div className="topbar">
        <Brand />
        <div className="spacer" />
        <div className="acct"><span className="muted" dir="ltr">{viewer.email}</span><Link className="btn ghost small" href="/">לאתר</Link></div>
      </div>
      <main className="legal admin">
        <p className="kicker">ניהול</p>
        <h1>לוח הבקרה</h1>
        {sp.sent ? <p className="banner ok">נשלח ל־{sp.sent} משתמשים.</p> : null}
        {sp.error ? <p className="banner warn">{MSG[sp.error] ?? 'שגיאה.'}</p> : null}
        {!c.migrated ? <p className="banner warn">חסרה מיגרציה: מריצים ב־Supabase את <code>supabase/migrations/0003_courses.sql</code>.</p> : null}

        <section className="readouts admin-stats">
          <div><b>{c.users}</b><span>משתמשים רשומים</span></div>
          <div><b>{Object.values(c.sales).reduce((a, b) => a + b, 0)}</b><span>רכישות ששולמו</span></div>
          <div><b>{Object.values(c.revenue).reduce((a, b) => a + b, 0)}</b><span>₪ הכנסות</span></div>
        </section>

        {COURSES.map((course) => {
          const k = getContent(course.key);
          const holders = (c.access[course.key] ?? 0) || (course.key === 'bgu-physics-3' ? c.legacy : 0);
          return (
            <section className="deal" key={course.key}>
              <h2>{course.title} · {getUni(course.uni)?.short}</h2>
              <p className="muted">
                {course.status === 'live'
                  ? `${holders} עם גישה · ${c.sales[course.key] ?? 0} רכישות · ${c.revenue[course.key] ?? 0} ₪`
                  : `בקרוב · ${c.waitlist[course.key] ?? 0} נרשמו לעדכון`}
                {' · '}<Link href={courseBase(course)}>לדף הקורס</Link>
              </p>
              {k?.updates.length ? (
                <ul className="admin-updates">
                  {k.updates.map((u) => {
                    const m = c.mailed.get(`${course.key}/${u.id}`);
                    return (
                      <li key={u.id}>
                        <span><b>{u.title}</b> <span className="muted small">({u.date})</span></span>
                        {m ? (
                          <span className="muted small">נשלח ל־{m.recipients}</span>
                        ) : (
                          <form action="/api/admin/notify" method="post">
                            <input type="hidden" name="course" value={course.key} />
                            <input type="hidden" name="update" value={u.id} />
                            <button className="btn small accent" type="submit">שלח מייל לכל בעלי הגישה</button>
                          </form>
                        )}
                      </li>
                    );
                  })}
                </ul>
              ) : null}
            </section>
          );
        })}
        <p className="muted small">כמבעלים יש לך גישה מלאה לכל הקורסים בלי לשלם. כלי ניהול נוספים יתווספו כאן.</p>
      </main>
    </>
  );
}
