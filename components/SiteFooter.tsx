import Link from 'next/link';
import { SELLER } from '@/lib/legal';

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
        {SELLER.name} ({SELLER.trade}) · {SELLER.status} {SELLER.id} · {SELLER.address} ·{' '}
        <a href={`tel:${SELLER.phone.replace(/-/g, '')}`} dir="ltr">{SELLER.phone}</a> ·{' '}
        <a href={`mailto:${SELLER.email}`} dir="ltr">{SELLER.email}</a>
      </p>
      <p>פרויקט עצמאי, ללא קשר רשמי לאוניברסיטת בן־גוריון בנגב.</p>
    </footer>
  );
}
