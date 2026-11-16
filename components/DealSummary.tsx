import Link from 'next/link';
import { SELLER, PRICE_ILS, ACCESS_UNTIL, REFUND_DAYS } from '@/lib/legal';
import { STATS } from '@/lib/content';

/** The deal in one box: shown before payment (disclosure) and after it (the written deal details). */
export default function DealSummary({ after = false, paidAt }: { after?: boolean; paidAt?: string | null }) {
  return (
    <section className="deal" aria-labelledby="deal-h">
      <h2 id="deal-h">{after ? 'פרטי העסקה שלך' : 'פרטי העסקה'}</h2>
      <dl>
        <dt>מה {after ? 'קנית' : 'קונים'}</dt>
        <dd>
          גישה מלאה לסביבת הלמידה &quot;פיזיקה 3&quot; באתר: כל {STATS.cards} כרטיסי הלימוד, כל {STATS.exercises} השאלות עם פתרון מלא,
          דף הנוסחאות המלא, וכל חומר שיתווסף לקורס במהלך תקופת הגישה. מוצר דיגיטלי בלבד, בלי משלוח.
        </dd>
        <dt>מחיר</dt>
        <dd>{PRICE_ILS} ₪, תשלום אחד. זה המחיר הסופי: העוסק פטור ממע״מ ולא מתווסף מע״מ.</dd>
        <dt>תשלום</dt>
        <dd>בכרטיס אשראי, בדף התשלום המאובטח של Morning (חשבונית ירוקה). פרטי הכרטיס לא מגיעים אלינו. קבלה נשלחת למייל.</dd>
        <dt>גישה</dt>
        <dd>נפתחת מיד אחרי התשלום, לחשבון שלך בלבד, עד {ACCESS_UNTIL} (כולל).</dd>
        <dt>ביטול</dt>
        <dd>
          אפשר לבטל בתוך {REFUND_DAYS} יום מהרכישה, מכל סיבה, ולקבל החזר מלא. שולחים מייל ל־
          <a href={`mailto:${SELLER.email}`} dir="ltr">{SELLER.email}</a> או מתקשרים ל־
          <a href={`tel:${SELLER.phone.replace(/-/g, '')}`} dir="ltr">{SELLER.phone}</a>. כל הפרטים ב<Link href="/refunds">מדיניות הביטול</Link>.
        </dd>
        <dt>המוכר</dt>
        <dd>{SELLER.name} ({SELLER.trade}), {SELLER.status} {SELLER.id}, {SELLER.address}.</dd>
        {after && paidAt ? (<><dt>תאריך הרכישה</dt><dd>{paidAt}</dd></>) : null}
      </dl>
    </section>
  );
}
