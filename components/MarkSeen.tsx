'use client';
import { useEffect } from 'react';

/** Marks course updates as seen once the updates tab has been opened. */
export default function MarkSeen({ ids }: { ids: string[] }) {
  useEffect(() => {
    ids.forEach((id) => {
      fetch('/api/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, on: true }),
      }).catch(() => {});
    });
  }, [ids]);
  return null;
}
