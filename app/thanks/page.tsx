import Link from 'next/link';
import Brand from '@/components/Brand';
import DealSummary from '@/components/DealSummary';
import SiteFooter from '@/components/SiteFooter';
import { createClient } from '@/lib/supabase/server';
import { getViewer, hasCourse } from '@/lib/access';
import { DEFAULT_COURSE, courseBase, courseByKey } from '@/lib/courses';

export const dynamic = 'force-dynamic';

export default async function Thanks({ searchParams }: { searchParams: Promise<{ pid?: string }> }) {
  const { pid } = await searchParams;
  const supabase = await createClient();
  const viewer = await getViewer();
  let purchase: { paid_at?: string | null; course_key?: string | null; status?: string } | null = null;
  if (viewer.userId && pid && /^[0-9a-f-]{36}$/i.test(pid)) {
    const { data } = await supabase.from('purchases').select('*').eq('id', pid).maybeSingle();
    purchase = data;
  }
  const course = courseByKey(purchase?.course_key ?? DEFAULT_COURSE.key) ?? DEFAULT_COURSE;
  const paid = purchase?.status === 'paid' || hasCourse(viewer, course.key);
  const paidAt = purchase?.paid_at ? new Date(purchase.paid_at).toLocaleDateString('he-IL', { timeZone: 'Asia/Jerusalem' }) : null;
  return (
    <>
      {!paid ? <meta httpEquiv="refresh" content="4" /> : null}
      <div className="topbar"><Brand /></div>
      <main className="legal thanks">
        {paid ? (
          <>
            <div className="thanks-hero">
              <p className="kicker">התשלום עבר</p>
              <h1>הגישה פתוחה. בהצלחה!</h1>
              <p className="muted">קבלה נשלחה למייל שלך. כדאי לשמור את העמוד הזה או את המייל, יש בהם את פרטי העסקה.</p>
              <Link className="btn accent big" href={`${courseBase(course)}/map`}>ל{course.title}</Link>
            </div>
            <DealSummary course={course} after paidAt={paidAt} />
          </>
        ) : (
          <div className="thanks-hero">
            <div className="pulse" aria-hidden="true" />
            <h1>מאשרים את התשלום…</h1>
            <p className="muted">זה לוקח בדרך כלל כמה שניות. הדף מתרענן לבד.</p>
            {pid ? <p className="muted small">מספר הזמנה: <span dir="ltr">{pid.slice(0, 8)}</span></p> : null}
          </div>
        )}
        <SiteFooter />
      </main>
    </>
  );
}
