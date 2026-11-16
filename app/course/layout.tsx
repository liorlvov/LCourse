import Brand from '@/components/Brand';
import CourseNav from '@/components/CourseNav';
import BuyButton from '@/components/BuyButton';
import HashOpener from '@/components/HashOpener';
import { getViewer } from '@/lib/access';

export const dynamic = 'force-dynamic';

export default async function CourseLayout({ children }: { children: React.ReactNode }) {
  const viewer = await getViewer();
  return (
    <>
      <div className="topbar">
        <Brand />
        <CourseNav />
        <div className="spacer" />
        <div className="acct">
          {!viewer.hasAccess && viewer.userId ? <BuyButton className="btn accent small" /> : null}
          <span className="muted" style={{ direction: 'ltr' }}>{viewer.email}</span>
          <form action="/auth/signout" method="post">
            <button className="linkbtn" type="submit">התנתק</button>
          </form>
        </div>
      </div>
      <main className="course">{children}</main>
      <HashOpener />
    </>
  );
}
