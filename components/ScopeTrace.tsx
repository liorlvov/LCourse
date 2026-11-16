'use client';
import { useEffect, useRef } from 'react';

/**
 * Oscilloscope trace of beats: two nearby frequencies (thin traces) and their sum (bright trace)
 * whose loudness rises and falls inside a dashed envelope. Pauses when off screen; static for reduced motion.
 */
export default function ScopeTrace({ className }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let w = 0, h = 0, raf = 0, visible = true, t0 = performance.now();

    const css = getComputedStyle(canvas);
    const col = (name: string, fb: string) => css.getPropertyValue(name).trim() || fb;
    const C = {
      grid: col('--scope-grid', 'rgba(243,238,228,.07)'),
      axis: col('--scope-axis', 'rgba(243,238,228,.18)'),
      a: col('--scope-a', '#2fc4b2'),
      b: col('--scope-b', '#7f95ff'),
      sum: col('--scope-sum', '#ff5a1f'),
      env: col('--scope-env', '#ffd23f'),
    };

    function size() {
      const r = canvas!.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = r.width; h = r.height;
      canvas!.width = Math.round(w * dpr); canvas!.height = Math.round(h * dpr);
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function draw(time: number) {
      const s = (time - t0) / 1000;
      ctx!.clearRect(0, 0, w, h);
      // graticule
      ctx!.lineWidth = 1;
      ctx!.strokeStyle = C.grid;
      const cols = 12, rows = 6;
      for (let i = 1; i < cols; i++) { const x = (w * i) / cols; ctx!.beginPath(); ctx!.moveTo(x, 0); ctx!.lineTo(x, h); ctx!.stroke(); }
      for (let j = 1; j < rows; j++) { const y = (h * j) / rows; ctx!.beginPath(); ctx!.moveTo(0, y); ctx!.lineTo(w, y); ctx!.stroke(); }
      ctx!.strokeStyle = C.axis;
      ctx!.beginPath(); ctx!.moveTo(0, h / 2); ctx!.lineTo(w, h / 2); ctx!.stroke();

      const mid = h / 2, amp = h * 0.19;
      const c1 = Math.max(5, Math.min(10, w / 110)), c2 = c1 + 1.6; // cycles across the screen: two close wavenumbers
      const k1 = (2 * Math.PI * c1) / w, k2 = (2 * Math.PI * c2) / w;
      const w1 = 3.1, w2 = 3.5; // two close frequencies
      const trace = (f: (x: number) => number, color: string, lw: number, dash: number[] = [], glow = 0) => {
        ctx!.save();
        ctx!.beginPath();
        for (let x = 0; x <= w; x += 2) { const y = mid - f(x); if (x === 0) ctx!.moveTo(x, y); else ctx!.lineTo(x, y); }
        ctx!.strokeStyle = color; ctx!.lineWidth = lw; ctx!.setLineDash(dash);
        if (glow) { ctx!.shadowColor = color; ctx!.shadowBlur = glow; }
        ctx!.stroke();
        ctx!.restore();
      };
      const A = (x: number) => amp * Math.sin(k1 * x - w1 * s);
      const B = (x: number) => amp * Math.sin(k2 * x - w2 * s);
      const E = (x: number) => 2 * amp * Math.cos(((k2 - k1) * x - (w2 - w1) * s) / 2);
      trace(A, C.a, 1.2, [], 0);
      trace(B, C.b, 1.2, [], 0);
      trace(E, C.env, 1.2, [5, 6]);
      trace((x) => -E(x), C.env, 1.2, [5, 6]);
      trace((x) => A(x) + B(x), C.sum, 2.6, [], 14);
    }

    function loop(time: number) {
      if (visible) draw(time);
      raf = requestAnimationFrame(loop);
    }

    size();
    const ro = new ResizeObserver(() => { size(); if (reduce) draw(t0 + 1800); });
    ro.observe(canvas);
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; });
    io.observe(canvas);
    if (reduce) draw(t0 + 1800); else raf = requestAnimationFrame(loop);
    return () => { cancelAnimationFrame(raf); ro.disconnect(); io.disconnect(); };
  }, []);

  return <canvas ref={ref} className={className} aria-hidden="true" />;
}
