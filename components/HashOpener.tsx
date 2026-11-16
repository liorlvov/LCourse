'use client';
import { useEffect } from 'react';

/** Opens and scrolls to the card named in the URL hash (#t-chain), on load and on every hash change. */
export default function HashOpener() {
  useEffect(() => {
    function open() {
      const id = decodeURIComponent(window.location.hash.slice(1));
      if (!id) return;
      const el = document.getElementById(id);
      if (el instanceof HTMLDetailsElement) {
        el.open = true;
        requestAnimationFrame(() => el.scrollIntoView({ block: 'start', behavior: 'smooth' }));
      }
    }
    open();
    window.addEventListener('hashchange', open);
    return () => window.removeEventListener('hashchange', open);
  }, []);
  return null;
}
