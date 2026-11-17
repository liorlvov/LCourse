import 'server-only';
import { cache } from 'react';
import { createClient } from '@/lib/supabase/server';
import { accessOpen, courseByKey } from '@/lib/courses';
import { isOwner } from '@/lib/owner';

export type Viewer = {
  userId: string | null;
  email: string | null;
  owner: boolean;
  courses: Set<string>; // course keys the user paid for
  done: Set<string>;
};

/** Who is looking, which courses they own, and which items they marked as done. Cached per request. */
export const getViewer = cache(async (): Promise<Viewer> => {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { userId: null, email: null, owner: false, courses: new Set(), done: new Set() };
  const [{ data: profile }, { data: progress }, access] = await Promise.all([
    supabase.from('profiles').select('has_access').eq('id', user.id).maybeSingle(),
    supabase.from('progress').select('item_id').eq('user_id', user.id),
    supabase.from('course_access').select('course_key').eq('user_id', user.id), // errors until migration 0003 runs
  ]);
  const courses = new Set<string>((access.data ?? []).map((r: { course_key: string }) => r.course_key));
  if (profile?.has_access) courses.add('bgu-physics-3'); // purchases made before per-course access
  return {
    userId: user.id,
    email: user.email ?? null,
    owner: isOwner(user.email),
    courses,
    done: new Set((progress ?? []).map((r: { item_id: string }) => r.item_id)),
  };
});

/** Full access to one course: owner, or paid and the access period is still open. */
export function hasCourse(viewer: Viewer, courseKey: string) {
  if (viewer.owner) return true;
  const c = courseByKey(courseKey);
  return !!c && viewer.courses.has(courseKey) && accessOpen(c);
}
