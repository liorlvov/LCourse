import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import CourseLanding from '@/components/landing/CourseLanding';
import ComingSoon from '@/components/landing/ComingSoon';
import { getCourse, getUni, PLATFORM } from '@/lib/courses';
import { getContent } from '@/lib/content';
import { getViewer } from '@/lib/access';

export const dynamic = 'force-dynamic';

type Params = Promise<{ uni: string; course: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { uni, course: slug } = await params;
  const c = getCourse(uni, slug);
  if (!c) return {};
  const title = `${c.title} · ${c.subtitle} · ${getUni(uni)?.short} | ${PLATFORM.name}`;
  return { title, description: c.blurb, openGraph: { title, description: c.blurb } };
}

export default async function CoursePage({ params, searchParams }: { params: Params; searchParams: Promise<{ joined?: string; error?: string }> }) {
  const { uni, course: slug } = await params;
  const sp = await searchParams;
  const course = getCourse(uni, slug);
  if (!course) notFound();
  const k = getContent(course.key);
  if (course.status !== 'live' || !k) return <ComingSoon course={course} joined={sp.joined === '1'} error={sp.error === '1'} />;
  return <CourseLanding course={course} k={k} viewer={await getViewer()} />;
}
