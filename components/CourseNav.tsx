'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { IconMap, IconConcept, IconTheorem, IconTool, IconExercise, IconCheat, IconBell } from './Icons';

const TABS = [
  { slug: 'map', label: 'מפה', Icon: IconMap },
  { slug: 'concepts', label: 'קונספטים', Icon: IconConcept },
  { slug: 'theorems', label: 'משפטים', Icon: IconTheorem },
  { slug: 'tools', label: 'כלים', Icon: IconTool },
  { slug: 'exercises', label: 'תרגילים', Icon: IconExercise },
  { slug: 'cheat', label: 'מה לזכור', Icon: IconCheat },
  { slug: 'updates', label: 'מה חדש', Icon: IconBell },
];

export default function CourseNav({ base, unseen = 0 }: { base: string; unseen?: number }) {
  const path = usePathname();
  return (
    <nav className="tabs" aria-label="לשוניות">
      {TABS.map((t) => {
        const href = `${base}/${t.slug}`;
        return (
          <Link key={t.slug} href={href} className={`tab-${t.slug}${path === href ? ' active' : ''}`}>
            <t.Icon size={17} />
            <span>{t.label}</span>
            {t.slug === 'updates' && unseen > 0 ? <span className="dot" aria-label={`${unseen} עדכונים חדשים`}>{unseen}</span> : null}
          </Link>
        );
      })}
    </nav>
  );
}
