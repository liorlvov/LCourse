import Link from 'next/link';
import { SELLER } from '@/lib/legal';
import { PLATFORM } from '@/lib/courses';

export default function SiteFooter() {
  return (
    <footer className="sitefoot">
      <nav aria-label="מסמכים">
        <Link href="/terms">תנאי שימוש ורכישה</Link>
        <Link href="/refunds">ביטול והחזר כספי</Link>
        <Link href="/privacy">מדיניות פרטיות</Link>
        <Link href="/accessibility">הצהרת נגישות</Link>
      </nav>
      <p>
        {PLATFORM.name} מופעל על ידי {SELLER.brand} · <a href={`mailto:${SELLER.email}`} dir="ltr">{SELLER.email}</a>
      </p>
      <p>פרויקט עצמאי. אין לו קשר רשמי לאוניברסיטאות שהקורסים שלהן מופיעים באתר.</p>
    </footer>
  );
}
