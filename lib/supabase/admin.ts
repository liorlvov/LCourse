import 'server-only';
import { createClient } from '@supabase/supabase-js';
import { SUPABASE_URL } from '@/lib/supabase/env';

// Service-role client: bypasses RLS. Use only in trusted server code (the payment webhook).
export function createAdminClient() {
  return createClient(SUPABASE_URL, (process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.SUPABASE_SECRET_KEY)!, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
