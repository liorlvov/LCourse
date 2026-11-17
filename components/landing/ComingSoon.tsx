import Link from 'next/link';
import Brand from '@/components/Brand';
import SiteFooter from '@/components/SiteFooter';
import Wave from '@/components/Wave';
import { IconCheck } from '@/components/Icons';
import { COURSES, courseBase, getUni, type Course } from '@/lib/courses';

export default function ComingSoon({ course, joined, error }: { course: Course; joined?: boolean; error?: boolean }) {
  const uni = getUni(course.uni);
  const others = COURSES.filter((c) => c.key !== course.key);
  return (
    <>
      <div className="topbar home">
        <Brand />
        <div className="spacer" />
        <div className="acct"><Link className="btn ghost small" href="/">כל הקורסים</Link></div>
      </div>
      <div className="landing">
        <section className="soon-hero">
          <span className="stamp" aria-hidden="true">בקרוב</span>
          <p className="kicker">{uni?.name}</p>
          <h1><span className="h-big">{course.title}</span><span className="h-line">{course.subtitle}</span></h1>
          <p className="lead">{course.blurb}</p>
          <Wave className="soon-wave" periods={10} />
          {course.topics?.length ? (
            <ul className="soon-topics">
              {course.topics.map((t) => (<li key={t}><IconCheck size={16} />{t}</li>))}
            </ul>
          ) : null}
          {joined ? (
            <p className="banner ok">רשמנו אותך. נשלח לך מייל אחד כשהקורס נפתח.</p>
          ) : (
            <form className="waitform" action="/api/waitlist" method="post">
              <input type="hidden" name="course" value={course.key} />
              <label htmlFor="wl-email">רוצה לדעת כשהקורס נפתח?</label>
              <div className="waitrow">
                <input id="wl-email" type="email" name="email" required placeholder="name@example.com" dir="ltr" autoComplete="email" />
                <button className="btn accent" type="submit">עדכנו אותי</button>
              </div>
              {error ? <p className="banner warn">משהו לא עבד. בדוק את כתובת המייל ונסה שוב.</p> : null}
              <p className="notice">נשתמש במייל רק כדי להודיע לך כשהקורס הזה נפתח, הודעה אחת. אפשר לבקש הסרה בכל רגע. פרטים ב<Link href="/privacy">מדיניות הפרטיות</Link>.</p>
            </form>
          )}
        </section>
        <section className="l-sec">
          <p className="kicker">בינתיים באתר</p>
          <div className="catalog">
            {others.map((c) => (
              <Link key={c.key} href={courseBase(c)} className={`ccard ${c.status}`}>
                <span className="ccard-uni">{getUni(c.uni)?.short}</span>
                <span className="ccard-title">{c.title}</span>
                <span className="ccard-sub">{c.subtitle}</span>
                <span className="ccard-tag">{c.status === 'live' ? 'פתוח עכשיו' : 'בקרוב'}</span>
              </Link>
            ))}
          </div>
        </section>
        <SiteFooter />
      </div>
    </>
  );
}
