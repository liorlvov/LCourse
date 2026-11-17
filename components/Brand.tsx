import Link from 'next/link';
import Logo from './Logo';
import { PLATFORM } from '@/lib/courses';

/** Platform wordmark; inside a course it shows the course name with the platform underneath. */
export default function Brand({ course }: { course?: { title: string; sub: string } }) {
  return (
    <Link href="/" className="brand" aria-label={`${PLATFORM.name}, לדף הבית`}>
      <Logo size={36} className="brand-logo" />
      <span className="brand-text">
        <span className="brand-name">{course ? course.title : PLATFORM.name}</span>
        <span className="brand-sub">{course ? `${PLATFORM.name} · ${course.sub}` : 'קורסים לתואר'}</span>
      </span>
    </Link>
  );
}
