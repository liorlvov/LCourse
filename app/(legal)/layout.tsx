import Link from 'next/link';
import Brand from '@/components/Brand';
import SiteFooter from '@/components/SiteFooter';

export default function LegalLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="topbar">
        <Brand />
        <div className="spacer" />
        <div className="acct"><Link className="btn ghost small" href="/">לדף הבית</Link></div>
      </div>
      <main className="legal">
        {children}
        <SiteFooter />
      </main>
    </>
  );
}
