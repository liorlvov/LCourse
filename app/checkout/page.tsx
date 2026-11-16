import Link from 'next/link';
import { redirect } from 'next/navigation';
import type { Metadata } from 'next';
import Brand from '@/components/Brand';
import DealSummary from '@/components/DealSummary';
import SiteFooter from '@/components/SiteFooter';
import { getViewer } from '@/lib/access';
import { PRICE_ILS, accessOpen } from '@/lib/legal';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'רכישת גישה מלאה · פיזיקה 3' };

export default async function Checkout({ searchParams }: { searchParams: Promise<{ need_accept?: string; payment?: string }> }) {
  const sp = await searchParams;
  const viewer = await getViewer();
  if (!viewer.userId) redirect('/login?next=/checkout');
  if (viewer.hasAccess) redirect('/course/map');

  return (
    <>
      <div className="topbar">
        <Brand />
        <div className="spacer" />
        <div className="acct"><Link className="btn ghost small" href="/course/map">חזרה לקורס</Link></div>
      </div>
      <main className="legal checkout">
        <p className="kicker">רכישה</p>
        <h1>גישה מלאה לפיזיקה 3</h1>
        {!accessOpen() ? (
          <p className="banner warn">המכירה לסמסטר הזה הסתיימה. רוצה לדעת כשתיפתח לסמסטר הבא? כתוב לנו.</p>
        ) : (
          <>
            {sp.payment === 'failed' ? <p className="banner warn">התשלום לא הושלם ולא חויבת. אפשר לנסות שוב.</p> : null}
            {sp.payment === 'error' ? <p className="banner warn">לא הצלחנו לפתוח את דף התשלום. נסה שוב בעוד דקה, ואם זה חוזר, כתוב לנו.</p> : null}
            <DealSummary />
            <form className="payform" action="/api/checkout" method="post">
              <label className={`agree${sp.need_accept ? ' need' : ''}`}>
                <input type="checkbox" name="accept" value="yes" required />
                <span>
                  קראתי ואני מסכים ל<Link href="/terms" target="_blank">תנאי השימוש והרכישה</Link>,
                  ל<Link href="/refunds" target="_blank">מדיניות הביטול</Link> ול<Link href="/privacy" target="_blank">מדיניות הפרטיות</Link>.
                </span>
              </label>
              {sp.need_accept ? <p className="banner warn">צריך לסמן את התיבה כדי להמשיך.</p> : null}
              <button className="btn accent big" type="submit">לתשלום מאובטח · {PRICE_ILS} ₪</button>
              <p className="muted small">תועבר לדף התשלום של Morning. החשבון שלך: <span dir="ltr">{viewer.email}</span></p>
            </form>
          </>
        )}
        <SiteFooter />
      </main>
    </>
  );
}
