import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import type { Metadata } from 'next';
import Brand from '@/components/Brand';
import DealSummary from '@/components/DealSummary';
import SiteFooter from '@/components/SiteFooter';
import { getViewer, hasCourse } from '@/lib/access';
import { DEFAULT_COURSE, accessOpen, courseBase, courseByKey } from '@/lib/courses';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'רכישת גישה מלאה' };

export default async function Checkout({ searchParams }: { searchParams: Promise<{ course?: string; need_accept?: string; payment?: string }> }) {
  const sp = await searchParams;
  const course = courseByKey(sp.course ?? DEFAULT_COURSE.key);
  if (!course || course.status !== 'live') notFound();
  const here = `/checkout?course=${course.key}`;
  const viewer = await getViewer();
  if (!viewer.userId) redirect(`/login?next=${encodeURIComponent(here)}`);
  if (hasCourse(viewer, course.key)) redirect(`${courseBase(course)}/map`);

  return (
    <>
      <div className="topbar">
        <Brand />
        <div className="spacer" />
        <div className="acct"><Link className="btn ghost small" href={`${courseBase(course)}/map`}>חזרה לקורס</Link></div>
      </div>
      <main className="legal checkout">
        <p className="kicker">רכישה</p>
        <h1>גישה מלאה ל{course.title}</h1>
        {!accessOpen(course) ? (
          <p className="banner warn">המכירה לסמסטר הזה הסתיימה. רוצה לדעת כשתיפתח שוב? כתוב לנו.</p>
        ) : (
          <>
            {sp.payment === 'failed' ? <p className="banner warn">התשלום לא הושלם ולא חויבת. אפשר לנסות שוב.</p> : null}
            {sp.payment === 'error' ? <p className="banner warn">לא הצלחנו לפתוח את דף התשלום. נסה שוב בעוד דקה, ואם זה חוזר, כתוב לנו.</p> : null}
            <DealSummary course={course} />
            <form className="payform" action="/api/checkout" method="post">
              <input type="hidden" name="course" value={course.key} />
              <label className={`agree${sp.need_accept ? ' need' : ''}`}>
                <input type="checkbox" name="accept" value="yes" required />
                <span>
                  קראתי ואני מסכים ל<Link href="/terms" target="_blank">תנאי השימוש והרכישה</Link>,
                  ל<Link href="/refunds" target="_blank">מדיניות הביטול</Link> ול<Link href="/privacy" target="_blank">מדיניות הפרטיות</Link>.
                </span>
              </label>
              {sp.need_accept ? <p className="banner warn">צריך לסמן את התיבה כדי להמשיך.</p> : null}
              <button className="btn accent big" type="submit">לתשלום מאובטח · {course.price} ₪</button>
              <p className="muted small">תועבר לדף התשלום של Morning. החשבון שלך: <span dir="ltr">{viewer.email}</span></p>
            </form>
          </>
        )}
        <SiteFooter />
      </main>
    </>
  );
}
