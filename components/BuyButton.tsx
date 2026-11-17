import Link from 'next/link';
import type { Course } from '@/lib/courses';

/** Goes to the checkout page, where the deal is laid out and the terms are accepted before paying. */
export default function BuyButton({ course, label, className = 'btn accent' }: { course: Course; label?: string; className?: string }) {
  return <Link className={className} href={`/checkout?course=${course.key}`}>{label ?? `גישה מלאה ב־${course.price} ₪`}</Link>;
}
