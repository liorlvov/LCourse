import { LOGO_WAVE, LOGO_ENV_TOP, LOGO_ENV_BOTTOM } from '@/lib/logo-path';

/** The mark: a released oscillator (yellow mass) ringing down inside its envelope. */
export default function Logo({ size = 34, className }: { size?: number; className?: string }) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 64 64" aria-hidden="true" focusable="false">
      <rect width="64" height="64" rx="15" fill="#16181d" />
      <path d="M6 32H58" stroke="#565a63" strokeWidth="1.4" strokeDasharray="1.4 3.2" strokeLinecap="round" />
      <path d={LOGO_ENV_TOP} fill="none" stroke="#ff5a1f" strokeOpacity=".38" strokeWidth="1.4" strokeDasharray="2 2.6" />
      <path d={LOGO_ENV_BOTTOM} fill="none" stroke="#ff5a1f" strokeOpacity=".38" strokeWidth="1.4" strokeDasharray="2 2.6" />
      <path className="logo-wave" d={LOGO_WAVE} fill="none" stroke="#ff5a1f" strokeWidth="4.6" strokeLinecap="round" strokeLinejoin="round" pathLength={1} />
      <circle cx="12" cy="16" r="4.6" fill="#ffd23f" />
    </svg>
  );
}
