import type { Metadata } from 'next';
import { SELLER, PRICE_ILS, REFUND_DAYS, TERMS_UPDATED } from '@/lib/legal';

export const metadata: Metadata = { title: 'ביטול עסקה והחזר כספי · פיזיקה 3' };

export default function Refunds() {
  return (
    <article>
      <p className="kicker">מסמך</p>
      <h1>ביטול עסקה והחזר כספי</h1>
      <p className="muted">עודכן לאחרונה: {TERMS_UPDATED}.</p>

      <div className="callout">
        <b>בקצרה:</b> קנית ולא התאים לך? בתוך {REFUND_DAYS} יום מהרכישה מקבלים את כל {PRICE_ILS} השקלים בחזרה, בלי לנמק ובלי דמי ביטול.
      </div>

      <h2>ביטול בתוך {REFUND_DAYS} יום, מכל סיבה</h2>
      <ul>
        <li>אפשר לבטל בתוך {REFUND_DAYS} יום מיום הרכישה, גם אם כבר התחלת להשתמש בגישה המלאה.</li>
        <li>ההחזר מלא, בלי דמי ביטול. המדיניות הזו נדיבה יותר ממה שהחוק מחייב.</li>
        <li>עם הביטול, הגישה לתוכן בתשלום נסגרת. התוכן החינמי נשאר פתוח, וגם ההתקדמות שסימנת נשמרת.</li>
      </ul>

      <h2>אחרי {REFUND_DAYS} יום</h2>
      <p>
        זה מוצר דיגיטלי שנמסר מיד, ולכן אחרי {REFUND_DAYS} יום אין החזר על חרטה. אבל אם יש תקלה שלא תיקנו בזמן סביר,
        או שהתוכן לא תואם למה שתיארנו לפני הרכישה, תקבל החזר מלא בכל שלב בתקופת הגישה.
      </p>

      <h2>איך מבטלים</h2>
      <p>שולחים הודעה באחת הדרכים האלה:</p>
      <ul>
        <li>מייל: <a href={`mailto:${SELLER.email}?subject=${encodeURIComponent('ביטול רכישה - פיזיקה 3')}`} dir="ltr">{SELLER.email}</a></li>
        <li>טלפון או וואטסאפ: <a href={`tel:${SELLER.phone.replace(/-/g, '')}`} dir="ltr">{SELLER.phone}</a></li>
        <li>דואר: {SELLER.name}, {SELLER.address}</li>
      </ul>
      <p>בהודעה כותבים: שם מלא, כתובת המייל של החשבון באתר, ותאריך הרכישה (או מספר הקבלה).</p>

      <h2>מתי הכסף חוזר</h2>
      <p>
        נאשר שקיבלנו את הבקשה, ונחזיר את הכסף לאותו כרטיס שממנו שילמת בתוך {REFUND_DAYS} יום מיום שקיבלנו את ההודעה.
        מועד הזיכוי בפועל תלוי בחברת האשראי.
      </p>

      <h2>מי מוכר</h2>
      <p>{SELLER.name} ({SELLER.trade}), {SELLER.status} {SELLER.id}, {SELLER.address}.</p>
    </article>
  );
}
