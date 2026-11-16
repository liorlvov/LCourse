import 'server-only';
import { createClient } from '@/lib/supabase/server';

export type Viewer = {
  userId: string | null;
  email: string | null;
  hasAccess: boolean;
  done: Set<string>;
};

/** Who is looking, whether they paid, and which items they marked as done. */
export async function getViewer(): Promise<Viewer> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { userId: null, email: null, hasAccess: false, done: new Set() };
  const [{ data: profile }, { data: progress }] = await Promise.all([
    supabase.from('profiles').select('has_access').eq('id', user.id).maybeSingle(),
    supabase.from('progress').select('item_id').eq('user_id', user.id),
  ]);
  return {
    userId: user.id,
    email: user.email ?? null,
    hasAccess: Boolean(profile?.has_access),
    done: new Set((progress ?? []).map((r: { item_id: string }) => r.item_id)),
  };
}
