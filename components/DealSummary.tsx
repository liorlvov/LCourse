import Link from 'next/link';
import { SELLER, REFUND_DAYS } from '@/lib/legal';
import { formatDate, getUni, type Course } from '@/lib/courses';
import { getContent } from '@/lib/content';

/** The deal in one box: shown before payment (the legally required disclosure) and after it (the written deal details). */
export default function DealSummary({ course, after = false, paidAt }: { course: Course; after?: boolean; paidAt?: string | null }) {
  const stats = getContent(course.key)?.stats;
  return (
    <section className="deal" aria-labelledby="deal-h">
      <h2 id="deal-h">{after ? 'פרטי העסקה שלך' : 'פרטי העסקה'}</h2>
      <dl>
        <dt>מה {after ? 'קנית' : 'קונים'}</dt>
        <dd>
          גישה מלאה לקורס &quot;{course.title}: {course.subtitle}&quot; ({getUni(course.uni)?.short}) באתר
          {stats ? `: כל ${stats.cards} כרטיסי הלימוד, כל ${stats.exercises} השאלות עם פתרון מלא ודף הנוסחאות המלא` : ''},
          וכל חומר שיתווסף לקורס במהלך תקופת הגישה. מוצר דיגיטלי בלבד, בלי משלוח.
        </dd>
        <dt>מחיר</dt>
        <dd>{course.price} ₪, תשלום אחד. זה המחיר הסופי, בלי תוספות.</dd>
        <dt>תשלום</dt>
        <dd>בכרטיס אשראי, בדף התשלום המאובטח של Morning (חשבונית ירוקה). פרטי הכרטיס לא מגיעים אלינו. קבלה נשלחת למייל.</dd>
        <dt>גישה</dt>
        <dd>נפתחת מיד אחרי התשלום, לחשבון שלך בלבד, עד {formatDate(course.accessUntil)} (כולל).</dd>
        <dt>ביטול</dt>
        <dd>
          אפשר לבטל בתוך {REFUND_DAYS} יום מהרכישה, מכל סיבה, ולקבל החזר מלא. שולחים מייל ל־
          <a href={`mailto:${SELLER.email}`} dir="ltr">{SELLER.email}</a>. כל הפרטים ב<Link href="/refunds">מדיניות הביטול</Link>.
        </dd>
        <dt>המוכר</dt>
        <dd>{SELLER.brand}. שם העוסק: {SELLER.legalName}, מס׳ עוסק {SELLER.id}, {SELLER.address}.</dd>
        {after && paidAt ? (<><dt>תאריך הרכישה</dt><dd>{paidAt}</dd></>) : null}
      </dl>
    </section>
  );
}
