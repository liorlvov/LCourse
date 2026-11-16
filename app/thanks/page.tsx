import Link from 'next/link';
import Brand from '@/components/Brand';
import DealSummary from '@/components/DealSummary';
import SiteFooter from '@/components/SiteFooter';
import { createClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

export default async function Thanks({ searchParams }: { searchParams: Promise<{ pid?: string }> }) {
  const { pid } = await searchParams;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const { data: profile } = user
    ? await supabase.from('profiles').select('has_access').eq('id', user.id).maybeSingle()
    : { data: null };
  const paid = Boolean(profile?.has_access);
  let paidAt: string | null = null;
  if (paid && pid && /^[0-9a-f-]{36}$/i.test(pid)) {
    const { data: p } = await supabase.from('purchases').select('paid_at').eq('id', pid).maybeSingle();
    if (p?.paid_at) paidAt = new Date(p.paid_at).toLocaleDateString('he-IL', { timeZone: 'Asia/Jerusalem' });
  }
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
              <Link className="btn accent big" href="/course/map">לקורס</Link>
            </div>
            <DealSummary after paidAt={paidAt} />
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
