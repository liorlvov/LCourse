/** A thin travelling sine wave (CSS-animated, seamless loop). Decorative. */
export default function Wave({ className = '', periods = 6 }: { className?: string; periods?: number }) {
  // one period = 40 units wide; the path holds periods+1 so a one-period shift loops seamlessly
  const n = periods + 1;
  let d = 'M0 10';
  for (let i = 0; i < n; i++) {
    const x = i * 40;
    d += ` C${x + 10} 0 ${x + 10} 0 ${x + 20} 10 S${x + 30} 20 ${x + 40} 10`;
  }
  return (
    <svg className={`wave ${className}`} viewBox={`0 0 ${periods * 40} 20`} preserveAspectRatio="none" aria-hidden="true" focusable="false">
      <path d={d} />
    </svg>
  );
}
