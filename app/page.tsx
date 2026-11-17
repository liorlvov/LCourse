import Link from 'next/link';
import Brand from '@/components/Brand';
import ScopeTrace from '@/components/ScopeTrace';
import SiteFooter from '@/components/SiteFooter';
import Wave from '@/components/Wave';
import { IconArrow, IconUni } from '@/components/Icons';
import { getViewer, hasCourse } from '@/lib/access';
import { COURSES, PLATFORM, UNIS, courseBase } from '@/lib/courses';

export const dynamic = 'force-dynamic';

const STEPS = [
  ['מתחילים בחינם', 'ארבעת השיעורים הראשונים של כל קורס פתוחים. בלי כרטיס אשראי.'],
  ['כל נושא באותו סדר', 'מה הבעיה ולמה זה מעניין, אינטואיציה, הוכחה צעד אחר צעד, ומה לזכור לתרגילים.'],
  ['הכל מקופל', 'רואים רק כותרת ומשפט אחד. פותחים כשמוכנים, אז העין לא נבהלת.'],
  ['מתעדכן עם הסמסטר', 'עולה הרצאה חדשה? החומר מתעדכן, ומקבלים הודעה מה השתנה לעומת שנה שעברה.'],
];

export default async function Home() {
  const viewer = await getViewer();
  const live = COURSES.find((c) => c.status === 'live');
  return (
    <>
      <div className="topbar home">
        <Brand />
        <div className="spacer" />
        <div className="acct">
          {viewer.owner ? <Link className="btn small ghost" href="/admin">ניהול</Link> : null}
          {viewer.userId ? <span className="muted" dir="ltr">{viewer.email}</span> : <Link className="btn ghost small" href="/login">כניסה</Link>}
        </div>
      </div>

      <div className="landing">
        <section className="scope" aria-labelledby="hero-h">
          <span className="scope-side" aria-hidden="true">{PLATFORM.name} · {COURSES.length} COURSES</span>
          <div className="scope-copy">
            <p className="kicker rise" style={{ '--d': '0ms' } as React.CSSProperties}>{PLATFORM.name} · קורסים לתואר במדעים</p>
            <h1 id="hero-h" className="rise" style={{ '--d': '90ms' } as React.CSSProperties}>
              <span className="h-big h-mid">החומר של הקורס,</span>
              <span className="h-line">בלי שהוא יפחיד.</span>
            </h1>
            <p className="lead rise" style={{ '--d': '180ms' } as React.CSSProperties}>
              סביבות למידה לפי הקורס באוניברסיטה שלך: אותו סדר נושאים, אותם תרגילים, ופתרונות מלאים שבהם כל צעד אומר מה עושים ולמה.
            </p>
            <div className="l-cta rise" style={{ '--d': '270ms' } as React.CSSProperties}>
              {live ? <Link className="btn accent big" href={courseBase(live)}>{live.title} פתוח עכשיו <IconArrow /></Link> : null}
              <a className="btn ghost-light big" href="#catalog">כל הקורסים</a>
            </div>
          </div>
          <figure className="scope-screen rise" style={{ '--d': '200ms' } as React.CSSProperties}>
            <ScopeTrace className="scope-canvas" />
          </figure>
        </section>

        <section className="l-sec reveal" id="catalog">
          <p className="kicker">הקורסים</p>
          <h2>בחר אוניברסיטה וקורס</h2>
          {UNIS.map((u) => {
            const list = COURSES.filter((c) => c.uni === u.slug);
            if (!list.length) return null;
            return (
              <div className="uni" key={u.slug}>
                <h3 className="uni-h"><IconUni size={22} /> {u.name}</h3>
                <div className="catalog">
                  {list.map((c) => (
                    <Link key={c.key} href={courseBase(c)} className={`ccard ${c.status}`}>
                      <span className="ccard-tag">{c.status === 'live' ? (hasCourse(viewer, c.key) ? 'הקורס שלך' : 'פתוח עכשיו') : 'בקרוב'}</span>
                      <span className="ccard-title">{c.title}</span>
                      <span className="ccard-sub">{c.subtitle}</span>
                      <span className="ccard-blurb">{c.blurb}</span>
                      <span className="ccard-go">{c.status === 'live' ? 'להתחיל בחינם' : 'לעדכון כשנפתח'} <IconArrow size={16} /></span>
                    </Link>
                  ))}
                </div>
              </div>
            );
          })}
          <p className="muted small">הקורס שלך לא ברשימה? כתוב לנו באיזו אוניברסיטה ובאיזה קורס, ונבדוק.</p>
        </section>

        <section className="l-sec reveal">
          <p className="kicker">איך זה עובד</p>
          <h2>אותה שיטה בכל קורס</h2>
          <ol className="anat steps4">
            {STEPS.map(([b, s]) => (<li key={b}><b>{b}</b><span>{s}</span></li>))}
          </ol>
        </section>

        <Wave className="foot-wave" periods={14} />
        <SiteFooter />
      </div>
    </>
  );
}
