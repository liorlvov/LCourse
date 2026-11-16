import Link from 'next/link';
import Logo from './Logo';

export default function Brand() {
  return (
    <Link href="/" className="brand" aria-label="פיזיקה 3, לדף הבית">
      <Logo size={36} className="brand-logo" />
      <span className="brand-text">
        <span className="brand-name">פיזיקה 3</span>
        <span className="brand-sub">תנודות וגלים</span>
      </span>
    </Link>
  );
}
