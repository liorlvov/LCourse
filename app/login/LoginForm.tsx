'use client';
import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';

export default function LoginForm({ next }: { next: string }) {
  const [email, setEmail] = useState('');
  const [state, setState] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [err, setErr] = useState('');

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setState('sending');
    const supabase = createClient();
    const safeNext = next.startsWith('/') && !next.startsWith('//') ? next : '/course/map';
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(safeNext)}` },
    });
    if (error) { setErr(error.message); setState('error'); } else setState('sent');
  }

  if (state === 'sent') {
    return <p className="msg banner ok">שלחנו קישור ל־<b dir="ltr">{email}</b>. פתח את המייל ולחץ עליו (כדאי לבדוק גם בספאם).</p>;
  }
  return (
    <form onSubmit={submit}>
      <label htmlFor="email">כתובת מייל</label>
      <input id="email" type="email" required autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@example.com" />
      <button className="btn" type="submit" disabled={state === 'sending'}>{state === 'sending' ? 'שולח…' : 'שלחו לי קישור כניסה'}</button>
      {state === 'error' ? <p className="msg banner warn">לא הצלחנו לשלוח: {err}</p> : null}
    </form>
  );
}
