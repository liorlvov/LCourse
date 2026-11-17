import Link from 'next/link';
import { notFound } from 'next/navigation';
import Brand from '@/components/Brand';
import CourseNav from '@/components/CourseNav';
import BuyButton from '@/components/BuyButton';
import HashOpener from '@/components/HashOpener';
import SiteFooter from '@/components/SiteFooter';
import { getViewer, hasCourse } from '@/lib/access';
import { getCourse, getUni } from '@/lib/courses';
import { getContent, seenId } from '@/lib/content';

export const dynamic = 'force-dynamic';

export default async function CourseLayout({
  children, params,
}: { children: React.ReactNode; params: Promise<{ uni: string; course: string }> }) {
  const { uni, course: slug } = await params;
  const course = getCourse(uni, slug);
  const k = course ? getContent(course.key) : undefined;
  if (!course || !k || course.status !== 'live') notFound();
  const viewer = await getViewer();
  const paid = hasCourse(viewer, course.key);
  const unseen = viewer.userId ? k.updates.filter((u) => !viewer.done.has(seenId(u.id))).length : 0;
  return (
    <>
      <div className="topbar">
        <Brand course={{ title: course.title, sub: getUni(uni)?.short ?? '' }} />
        <CourseNav base={k.base} unseen={unseen} />
        <div className="spacer" />
        <div className="acct">
          {viewer.owner ? <Link className="btn small ghost" href="/admin">ניהול</Link> : null}
          {!paid && viewer.userId ? <BuyButton course={course} className="btn accent small" /> : null}
          <span className="muted" style={{ direction: 'ltr' }}>{viewer.email}</span>
          <form action="/auth/signout" method="post">
            <button className="linkbtn" type="submit">התנתק</button>
          </form>
        </div>
      </div>
      <main className="course">{children}<SiteFooter /></main>
      <HashOpener />
    </>
  );
}
