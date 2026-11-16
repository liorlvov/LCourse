'use client';
import { useState } from 'react';

export default function MarkButton({ id, initial, on, off }: { id: string; initial: boolean; on: string; off: string }) {
  const [done, setDone] = useState(initial);
  const [busy, setBusy] = useState(false);
  async function toggle() {
    const next = !done;
    setDone(next);
    setBusy(true);
    try {
      const res = await fetch('/api/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, on: next }),
      });
      if (!res.ok) setDone(!next);
      else document.getElementById(id)?.classList.toggle('done', next);
    } catch {
      setDone(!next);
    } finally {
      setBusy(false);
    }
  }
  return (
    <button type="button" className="markbtn" aria-pressed={done} onClick={toggle} disabled={busy}>
      {done ? on : off}
    </button>
  );
}
