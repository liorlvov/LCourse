import { NextResponse, type NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ ok: false }, { status: 401 });
  const { id, on } = (await req.json().catch(() => ({}))) as { id?: string; on?: boolean };
  if (!id || typeof id !== 'string' || id.length > 40) return NextResponse.json({ ok: false }, { status: 400 });
  const q = on
    ? supabase.from('progress').upsert({ user_id: user.id, item_id: id })
    : supabase.from('progress').delete().eq('user_id', user.id).eq('item_id', id);
  const { error } = await q;
  return NextResponse.json({ ok: !error }, { status: error ? 500 : 200 });
}
