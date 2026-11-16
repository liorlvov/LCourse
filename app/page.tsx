import Link from 'next/link';
import Brand from '@/components/Brand';
import BuyButton from '@/components/BuyButton';
import { getViewer } from '@/lib/access';
import { STATS, CHAPTERS } from '@/lib/content';

export const dynamic = 'force-dynamic';

const ANATOMY = [
  ['כותרת ומשפט אחד', 'על מה מדברים, בלי מושגים מפחידים. זה כל מה שרואים כשהכרטיס סגור.'],
  ['למה בכלל? (מקופל)', 'מה הבעיה, איפה זה פוגש אותנו בעולם, וקצת היסטוריה. פותחים רק אם רוצים.'],
  ['האינטואיציה', 'התמונה שבראש, בכמה משפטים, לפני כל חישוב.'],
  ['ההוכחה, צעד אחר צעד (מקופל)', 'כל צעד: מה עושים, הנוסחה בשורה משלה, ולמה זה מותר.'],
  ['מה לזכור לתרגילים', 'השורה התחתונה, מסומנת בצהוב. בדיוק מה שצריך כדי לפתור.'],
];

const FAQ = [
  ['למי זה מתאים?', 'לסטודנטים בפיזיקה 3 (תנודות וגלים). החומר מסודר לפי סדר הנושאים בקורס בבן־גוריון, אבל מתאים לכל קורס תנודות וגלים ברמה הזאת.'],
  ['זה מחליף את ההרצאות?', 'לא. זה המקום לעבור על החומר בקצב שלך, להבין למה דברים עובדים, ולתרגל עם פתרונות מלאים.'],
  ['איך משלמים?', 'תשלום אחד דרך Morning, עם קבלה למייל. הגישה נפתחת אוטומטית מיד אחרי התשלום.'],
  ['מה קורה כשנלמד חומר חדש?', 'הקורס מתעדכן במהלך הסמסטר, והגישה המלאה כוללת את כל העדכונים.'],
  ['זה אתר רשמי של האוניברסיטה?', 'לא. זה פרויקט עצמאי של סטודנט, ואין לו קשר רשמי לאוניברסיטת בן־גוריון.'],
];

export default async function Landing() {
  const viewer = await getViewer();
  const startHref = viewer.userId ? '/course/map' : '/login?next=/course/map';
  const price = process.env.COURSE_PRICE_ILS ?? '69';
  const contact = process.env.NEXT_PUBLIC_CONTACT_EMAIL;
  return (
    <>
      <div className="topbar">
        <Brand />
        <div className="spacer" />
        <div className="acct">
          {viewer.userId ? <Link className="btn small" href="/course/map">לקורס</Link> : <Link className="btn ghost small" href="/login">כניסה</Link>}
        </div>
      </div>
      <div className="landing">
        <section className="l-hero">
          <div>
            <p className="kicker">פיזיקה 3 · תנודות וגלים</p>
            <h1>פיזיקה 3, בלי שהחומר יפחיד</h1>
            <p className="lead">
              כל נושא נפתח באותו סדר: מה הבעיה ולמה זה מעניין, אינטואיציה, ורק אז הוכחה צעד אחר צעד.
              הכל מקופל, אז רואים רק את מה שצריך עכשיו.
            </p>
            <div className="l-cta">
              <Link className="btn" href={startHref}>להתחיל בחינם</Link>
              <a className="btn ghost" href="#plans">מה יש בגישה המלאה</a>
            </div>
            <p className="l-note">שיעורים 1–4 ותרגילים נבחרים פתוחים בחינם. בלי כרטיס אשראי.</p>
          </div>
          <div className="mock" aria-hidden="true">
            <details className="card cat-concept" open>
              <summary>
                <span className="badge b-concept">קונספט</span>
                <span className="ctitle">פעימות</span>
                <span className="cone">שתי תנודות בתדרים קרובים מתחברות לתנודה מהירה שהעוצמה שלה עולה ויורדת לאט.</span>
              </summary>
              <div className="cbody">
                <details className="sub sub-why"><summary>למה בכלל? מוטיבציה, איפה זה פוגש אותנו, קצת היסטוריה</summary></details>
                <section className="blk intu"><h4>האינטואיציה</h4><p>שני גלים שמתחילים יחד מחזקים זה את זה. אחד מהיר קצת יותר, אז אחרי זמן מה הם מבטלים זה את זה, ושוב מתיישרים.</p></section>
                <details className="sub sub-proof"><summary>ההוכחה, צעד אחר צעד</summary></details>
                <section className="remember"><h4>מה לזכור לתרגילים</h4><ul><li>תדר הפעימות שנשמע הוא הפרש התדרים.</li></ul></section>
              </div>
            </details>
            <div className="card cat-tool"><span style={{ display: 'block', padding: '12px 16px' }}><span className="badge b-tool">כלי</span> <b>מתכון: מציאת מודים במערכת בדידה</b></span></div>
          </div>
        </section>

        <div className="stats">
          <div className="stat"><b>{STATS.cards}</b><span>כרטיסי לימוד: קונספטים, משפטים וכלים</span></div>
          <div className="stat"><b>{STATS.exercises}</b><span>שאלות מתרגולים ושיעורי בית, עם פתרון מלא</span></div>
          <div className="stat"><b>{CHAPTERS.length}</b><span>פרקים, מאוסילטור בודד ועד כוח מאלץ</span></div>
        </div>

        <section className="l-sec">
          <h2>איך בנוי כל כרטיס</h2>
          <p className="sub">אותו מבנה בכל נושא, כדי שהמוח יתרגל ולא יצטרך לנחש איפה הדבר החשוב.</p>
          <ol className="anat">
            {ANATOMY.map(([b, s]) => (<li key={b}><div><b>{b}</b><span>{s}</span></div></li>))}
          </ol>
        </section>

        <section className="l-sec">
          <h2>שלושה סוגי כרטיסים, בלשוניות נפרדות</h2>
          <div className="howgrid">
            <div className="how"><span className="badge b-concept">קונספט</span><p>מה התופעה ואיך לחשוב עליה.</p></div>
            <div className="how"><span className="badge b-theorem">משפט</span><p>טענה מדויקת והוכחה מלאה.</p></div>
            <div className="how"><span className="badge b-tool">כלי</span><p>מתכון לפתרון: איך מזהים, הצעדים, דוגמה ומלכודות.</p></div>
          </div>
        </section>

        <section className="l-sec" id="plans">
          <h2>מה מקבלים</h2>
          <div className="plans">
            <div className="plan">
              <h3>חינם</h3>
              <div className="price">0 ₪</div>
              <ul>
                <li>{STATS.freeCards} כרטיסים: כל מה שנלמד בשיעורים 1–4</li>
                <li>{STATS.freeExercises} שאלות פתורות: תרגול 2 ושיעורי בית 1–2</li>
                <li>החלק הראשון של דף הנוסחאות</li>
                <li>שמירת התקדמות בטלפון ובמחשב</li>
              </ul>
              <Link className="btn ghost" href={startHref}>להתחיל בחינם</Link>
            </div>
            <div className="plan best">
              <h3>גישה מלאה</h3>
              <div className="price">{price} ₪ <small>תשלום אחד לסמסטר</small></div>
              <ul>
                <li>כל {STATS.cards} הכרטיסים, כולל שיעור 5 והלאה</li>
                <li>כל {STATS.exercises} השאלות עם פתרון מלא, צעד אחר צעד</li>
                <li>שאלות ממבחנים קודמים, מתויגות לפי נושא ולפי "אפשר לפתור כבר"</li>
                <li>דף הנוסחאות המלא ורשימת הטעויות שעולות נקודות</li>
                <li>כל החומר שיתווסף במהלך הסמסטר</li>
              </ul>
              {viewer.userId ? <BuyButton /> : <Link className="btn accent" href="/login?next=/course/map">להירשם ולקנות</Link>}
            </div>
          </div>
        </section>

        <section className="l-sec faq">
          <h2>שאלות נפוצות</h2>
          {FAQ.map(([q, a]) => (<details key={q}><summary>{q}</summary><div>{a}</div></details>))}
        </section>

        <footer className="footer">
          <span>פרויקט עצמאי, ללא קשר רשמי לאוניברסיטת בן־גוריון בנגב.</span>
          {contact ? <span>שאלות: <a href={`mailto:${contact}`} dir="ltr">{contact}</a></span> : null}
        </footer>
      </div>
    </>
  );
}
