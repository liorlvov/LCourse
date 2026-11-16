'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { IconMap, IconConcept, IconTheorem, IconTool, IconExercise, IconCheat } from './Icons';

const TABS = [
  { slug: 'map', label: 'מפה', Icon: IconMap },
  { slug: 'concepts', label: 'קונספטים', Icon: IconConcept },
  { slug: 'theorems', label: 'משפטים והוכחות', Icon: IconTheorem },
  { slug: 'tools', label: 'כלים ודרכי פתרון', Icon: IconTool },
  { slug: 'exercises', label: 'תרגילים', Icon: IconExercise },
  { slug: 'cheat', label: 'מה לזכור בתכלס', Icon: IconCheat },
];

export default function CourseNav() {
  const path = usePathname();
  return (
    <nav className="tabs" aria-label="לשוניות">
      {TABS.map((t) => (
        <Link key={t.slug} href={`/course/${t.slug}`} className={`tab-${t.slug}${path === `/course/${t.slug}` ? ' active' : ''}`}>
          <t.Icon size={17} />
          <span>{t.label}</span>
        </Link>
      ))}
    </nav>
  );
}
