import Link from 'next/link';
import Brand from '@/components/Brand';
import { createClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

export default async function Thanks({ searchParams }: { searchParams: Promise<{ pid?: string }> }) {
  const { pid } = await searchParams;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const { data: profile } = user
    ? await supabase.from('profiles').select('has_access').eq('id', user.id).maybeSingle()
    : { data: null };
  const paid = Boolean(profile?.has_access);
  return (
    <>
      {!paid ? <meta httpEquiv="refresh" content="4" /> : null}
      <div className="topbar"><Brand /></div>
      <div className="auth" style={{ textAlign: 'center' }}>
        {paid ? (
          <>
            <h1>תודה, הגישה פתוחה</h1>
            <p className="muted">כל הכרטיסים, הפתרונות ודף הנוסחאות המלא מחכים לך. קבלה נשלחה למייל.</p>
            <Link className="btn" href="/course/map">לקורס</Link>
          </>
        ) : (
          <>
            <h1>מאשרים את התשלום…</h1>
            <p className="muted">זה לוקח בדרך כלל כמה שניות. הדף מתרענן לבד.</p>
            {pid ? <p className="muted" style={{ fontSize: 13 }}>מספר הזמנה: <span dir="ltr">{pid.slice(0, 8)}</span></p> : null}
          </>
        )}
      </div>
    </>
  );
}
