import Link from 'next/link';
import Brand from '@/components/Brand';
import BuyButton from '@/components/BuyButton';
import ScopeTrace from '@/components/ScopeTrace';
import SiteFooter from '@/components/SiteFooter';
import Wave from '@/components/Wave';
import { IconConcept, IconTheorem, IconTool, IconCheck, IconArrow } from '@/components/Icons';
import { getViewer } from '@/lib/access';
import { STATS, CHAPTERS } from '@/lib/content';
import { PRICE_ILS, ACCESS_UNTIL, REFUND_DAYS } from '@/lib/legal';

export const dynamic = 'force-dynamic';

const ANATOMY = [
  ['כותרת ומשפט אחד', 'על מה מדברים, בלי מושגים מפחידים. זה כל מה שרואים כשהכרטיס סגור.'],
  ['למה בכלל?', 'מה הבעיה, איפה זה פוגש אותנו בעולם, וקצת היסטוריה. מקופל, פותחים רק אם רוצים.'],
  ['האינטואיציה', 'התמונה שבראש, בכמה משפטים, לפני כל חישוב.'],
  ['ההוכחה, צעד אחר צעד', 'כל צעד: מה עושים, הנוסחה בשורה משלה, ולמה זה מותר. גם היא מקופלת.'],
  ['מה לזכור לתרגילים', 'השורה התחתונה, מסומנת בצהוב. בדיוק מה שצריך כדי לפתור.'],
];

const FAQ: [string, string][] = [
  ['למי זה מתאים?', 'לסטודנטים בפיזיקה 3 (תנודות וגלים). החומר מסודר לפי סדר הנושאים בקורס בבן־גוריון, אבל מתאים לכל קורס תנודות וגלים ברמה הזאת.'],
  ['זה מחליף את ההרצאות?', 'לא. זה המקום לעבור על החומר בקצב שלך, להבין למה דברים עובדים, ולתרגל עם פתרונות מלאים.'],
  ['איך משלמים?', `תשלום אחד של ${PRICE_ILS} ₪ בכרטיס אשראי, בדף התשלום המאובטח של Morning. קבלה מגיעה למייל, והגישה נפתחת אוטומטית מיד אחרי התשלום.`],
  ['עד מתי יש גישה?', `עד ${ACCESS_UNTIL}, כלומר כל הסמסטר ותקופת המבחנים. כל מה שנוסיף עד אז כלול.`],
  ['ואם זה לא בשבילי?', `בתוך ${REFUND_DAYS} יום מהרכישה מקבלים החזר מלא, בלי לנמק. שולחים מייל וזהו.`],
  ['זה אתר רשמי של האוניברסיטה?', 'לא. זה פרויקט עצמאי של סטודנט, ואין לו קשר רשמי לאוניברסיטת בן־גוריון.'],
];

export default async function Landing() {
  const viewer = await getViewer();
  const startHref = viewer.userId ? '/course/map' : '/login?next=/course/map';
  return (
    <>
      <div className="topbar home">
        <Brand />
        <div className="spacer" />
        <div className="acct">
          {viewer.userId ? <Link className="btn small" href="/course/map">לקורס</Link> : <Link className="btn ghost small" href="/login">כניסה</Link>}
        </div>
      </div>

      <div className="landing">
        <section className="scope" aria-labelledby="hero-h">
          <span className="scope-side" aria-hidden="true">CH1 + CH2 · 203.1.2121</span>
          <div className="scope-copy">
            <p className="kicker rise" style={{ '--d': '0ms' } as React.CSSProperties}>סביבת למידה · תנודות וגלים</p>
            <h1 id="hero-h" className="rise" style={{ '--d': '90ms' } as React.CSSProperties}>
              <span className="h-big">פיזיקה 3</span>
              <span className="h-line">בלי שהחומר יפחיד.</span>
            </h1>
            <p className="lead rise" style={{ '--d': '180ms' } as React.CSSProperties}>
              כל נושא נפתח באותו סדר: מה הבעיה ולמה זה מעניין, אינטואיציה, ורק אז הוכחה צעד אחר צעד.
              הכל מקופל, אז רואים רק את מה שצריך עכשיו.
            </p>
            <div className="l-cta rise" style={{ '--d': '270ms' } as React.CSSProperties}>
              <Link className="btn accent big" href={startHref}>להתחיל בחינם <IconArrow /></Link>
              <a className="btn ghost-light big" href="#plans">מה בגישה המלאה</a>
            </div>
            <p className="l-note rise" style={{ '--d': '340ms' } as React.CSSProperties}>שיעורים 1–4 ותרגילים נבחרים פתוחים בחינם. בלי כרטיס אשראי.</p>
          </div>
          <figure className="scope-screen rise" style={{ '--d': '200ms' } as React.CSSProperties}>
            <ScopeTrace className="scope-canvas" />
            <figcaption>
              <span className="chip c-a">CH1 · גל א׳</span>
              <span className="chip c-b">CH2 · גל ב׳</span>
              <span className="chip c-s">Σ · הסכום</span>
              <span className="scope-cap">על המסך: פעימות. שני תדרים קרובים, והעוצמה של הסכום עולה ויורדת. זה כרטיס אמיתי מפרק ב׳.</span>
            </figcaption>
          </figure>
        </section>

        <section className="readouts reveal" aria-label="מה יש בפנים">
          <div><b>{STATS.cards}</b><span>כרטיסי לימוד: קונספטים, משפטים וכלים</span></div>
          <div><b>{STATS.exercises}</b><span>שאלות מתרגולים ושיעורי בית, עם פתרון מלא</span></div>
          <div><b>{CHAPTERS.length}</b><span>פרקים, מאוסילטור בודד ועד כוח מאלץ</span></div>
        </section>

        <section className="l-sec anat-sec reveal">
          <div className="anat-text">
            <p className="kicker">איך בנוי כל כרטיס</p>
            <h2>חמש שכבות. רואים רק את הראשונה.</h2>
            <p className="subline">אותו מבנה בכל נושא, כדי שהמוח יתרגל ולא יצטרך לנחש איפה הדבר החשוב.</p>
            <ol className="anat">
              {ANATOMY.map(([b, s]) => (<li key={b}><b>{b}</b><span>{s}</span></li>))}
            </ol>
          </div>
          <div className="mock" aria-hidden="true">
            <span className="tape" />
            <details className="card cat-concept" open>
              <summary>
                <span className="badge b-concept"><IconConcept size={14} /> קונספט</span>
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
          </div>
        </section>

        <section className="l-sec reveal">
          <p className="kicker">שלושה ערוצים</p>
          <h2>כל סוג ידע בלשונית משלו</h2>
          <div className="channels">
            <div className="channel ch-concept"><span className="ch-tag">CH1</span><IconConcept size={30} /><h3>קונספטים</h3><p>מה התופעה ואיך לחשוב עליה.</p></div>
            <div className="channel ch-theorem"><span className="ch-tag">CH2</span><IconTheorem size={30} /><h3>משפטים והוכחות</h3><p>טענה מדויקת והוכחה מלאה, צעד אחר צעד.</p></div>
            <div className="channel ch-tool"><span className="ch-tag">CH3</span><IconTool size={30} /><h3>כלים ודרכי פתרון</h3><p>מתכון: איך מזהים, הצעדים, דוגמה ומלכודות.</p></div>
          </div>
        </section>

        <section className="l-sec reveal" id="plans">
          <p className="kicker">מחיר</p>
          <h2>מתחילים בחינם. משלמים רק אם זה עוזר.</h2>
          <div className="plans">
            <div className="plan">
              <h3>חינם</h3>
              <div className="price">0 ₪</div>
              <ul>
                <li><IconCheck size={16} />{STATS.freeCards} כרטיסים: כל מה שנלמד בשיעורים 1–4</li>
                <li><IconCheck size={16} />{STATS.freeExercises} שאלות פתורות: תרגול 2 ושיעורי בית 1–2</li>
                <li><IconCheck size={16} />החלק הראשון של דף הנוסחאות</li>
                <li><IconCheck size={16} />שמירת התקדמות בטלפון ובמחשב</li>
              </ul>
              <Link className="btn ghost" href={startHref}>להתחיל בחינם</Link>
            </div>
            <div className="plan best">
              <span className="plan-flag">הכי משתלם לפני מבחן</span>
              <h3>גישה מלאה</h3>
              <div className="price">{PRICE_ILS} ₪ <small>תשלום אחד, עד {ACCESS_UNTIL}</small></div>
              <ul>
                <li><IconCheck size={16} />כל {STATS.cards} הכרטיסים, כולל שיעור 5 והלאה</li>
                <li><IconCheck size={16} />כל {STATS.exercises} השאלות עם פתרון מלא, צעד אחר צעד</li>
                <li><IconCheck size={16} />דף הנוסחאות המלא ורשימת הטעויות שעולות נקודות</li>
                <li><IconCheck size={16} />כל החומר שיתווסף במהלך הסמסטר</li>
                <li className="soon"><IconCheck size={16} />בקרוב: שאלות ממבחנים קודמים, מתויגות לפי נושא ולפי &quot;אפשר לפתור כבר&quot;</li>
              </ul>
              {viewer.userId ? <BuyButton className="btn accent" /> : <Link className="btn accent" href="/login?next=/checkout">להירשם ולקנות</Link>}
              <p className="plan-fine">לא מתווסף מע״מ · קבלה למייל · החזר מלא בתוך {REFUND_DAYS} יום</p>
            </div>
          </div>
        </section>

        <section className="l-sec faq reveal">
          <p className="kicker">שאלות</p>
          <h2>מה שבדרך כלל שואלים</h2>
          {FAQ.map(([q, a]) => (<details key={q}><summary>{q}</summary><div>{a}</div></details>))}
        </section>

        <Wave className="foot-wave" periods={14} />
        <SiteFooter />
      </div>
    </>
  );
}
