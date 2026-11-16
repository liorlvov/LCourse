import Link from 'next/link';

export default function Brand() {
  return (
    <Link href="/" className="brand" style={{ textDecoration: 'none', color: 'inherit' }}>
      <span className="brand-mark" aria-hidden="true" />
      פיזיקה 3
    </Link>
  );
}
