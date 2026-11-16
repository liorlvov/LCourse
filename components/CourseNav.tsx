'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const TABS = [
  { slug: 'map', label: 'מפה' },
  { slug: 'concepts', label: 'קונספטים' },
  { slug: 'theorems', label: 'משפטים והוכחות' },
  { slug: 'tools', label: 'כלים ודרכי פתרון' },
  { slug: 'exercises', label: 'תרגילים' },
  { slug: 'cheat', label: 'מה לזכור בתכלס' },
];

export default function CourseNav() {
  const path = usePathname();
  return (
    <nav className="tabs" aria-label="לשוניות">
      {TABS.map((t) => (
        <Link key={t.slug} href={`/course/${t.slug}`} className={path === `/course/${t.slug}` ? 'active' : undefined}>
          {t.label}
        </Link>
      ))}
    </nav>
  );
}
