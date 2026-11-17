// Hand-drawn icon set: 24×24, 1.8 stroke, round joins. Every icon is a small physics object.
type P = { size?: number; className?: string };
const base = (size: number) => ({
  width: size, height: size, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor',
  strokeWidth: 1.8, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const, 'aria-hidden': true, focusable: false,
});

/** Map: chapters as coupled masses on a spring chain. */
export const IconMap = ({ size = 20, className }: P) => (
  <svg {...base(size)} className={className}>
    <circle cx="4.5" cy="12" r="2.3" /><circle cx="12" cy="12" r="2.3" /><circle cx="19.5" cy="12" r="2.3" />
    <path d="M6.8 12l.7-1.6.9 3.2.9-3.2.7 1.6M14.3 12l.7-1.6.9 3.2.9-3.2.7 1.6" />
  </svg>
);

/** Concept: a wave packet under its envelope. */
export const IconConcept = ({ size = 20, className }: P) => (
  <svg {...base(size)} className={className}>
    <path d="M2.5 12c2 0 2.6-.4 3.5-1.6s1.4-3.4 2.4-3.4 1.4 9.6 2.6 9.6 1.4-9.6 2.6-9.6 1.4 2.2 2.4 3.4.8 1.6 3.5 1.6h2" />
    <path d="M3 9.5c4-.2 6-5 9-5s5 4.8 9 5" strokeDasharray="1.2 2.4" strokeWidth="1.4" />
  </svg>
);

/** Theorem: a proof page closed with the tombstone ∎. */
export const IconTheorem = ({ size = 20, className }: P) => (
  <svg {...base(size)} className={className}>
    <path d="M6 3h9l3 3v15H6z" /><path d="M9 9h6M9 12.5h6" />
    <rect x="12.6" y="15.6" width="2.8" height="2.8" fill="currentColor" stroke="none" />
  </svg>
);

/** Tool: a tuning fork. */
export const IconTool = ({ size = 20, className }: P) => (
  <svg {...base(size)} className={className}>
    <path d="M8.5 2.5v7a3.5 3.5 0 0 0 7 0v-7" /><path d="M12 13v8.5" /><path d="M4.5 5c-1 1.6-1 3.4 0 5M19.5 5c1 1.6 1 3.4 0 5" strokeWidth="1.4" />
  </svg>
);

/** Exercise: a pencil leaving a sine trace. */
export const IconExercise = ({ size = 20, className }: P) => (
  <svg {...base(size)} className={className}>
    <path d="M14.5 4.5l5 5L10 19H5v-5z" /><path d="M12.5 6.5l5 5" />
    <path d="M2.5 22c1.2 0 1.6-1.6 2.6-1.6S6.5 22 7.6 22s1.5-1.6 2.6-1.6" strokeWidth="1.4" />
  </svg>
);

/** Cheat sheet: a pinned note. */
export const IconCheat = ({ size = 20, className }: P) => (
  <svg {...base(size)} className={className}>
    <path d="M5 4h14v11l-5 5H5z" /><path d="M14 20v-5h5" /><path d="M8.5 9h7M8.5 12.5h4" />
  </svg>
);

/** Lock: a padlock whose shackle is half a wave. */
export const IconLock = ({ size = 16, className }: P) => (
  <svg {...base(size)} className={className}>
    <rect x="4.5" y="10.5" width="15" height="10" rx="2.5" /><path d="M8 10.5V8a4 4 0 0 1 8 0v2.5" /><path d="M12 14.5v2.5" />
  </svg>
);

/** Updates: a bell that rings (two arcs = vibration). */
export const IconBell = ({ size = 20, className }: P) => (
  <svg {...base(size)} className={className}>
    <path d="M6 16.5V11a6 6 0 0 1 12 0v5.5l1.5 2h-15z" /><path d="M10 20.5a2 2 0 0 0 4 0" /><path d="M2.5 9.5c.3-2 1.2-3.6 2.6-4.8M21.5 9.5c-.3-2-1.2-3.6-2.6-4.8" strokeWidth="1.4" />
  </svg>
);

/** University: a pediment on three columns. */
export const IconUni = ({ size = 20, className }: P) => (
  <svg {...base(size)} className={className}>
    <path d="M3 9.5L12 4l9 5.5z" /><path d="M5.5 10v7.5M10 10v7.5M14 10v7.5M18.5 10v7.5M3.5 20.5h17" />
  </svg>
);

export const IconArrow = ({ size = 18, className }: P) => (
  <svg {...base(size)} className={className}><path d="M19 12H5M11 6l-6 6 6 6" /></svg>
);

export const IconCheck = ({ size = 18, className }: P) => (
  <svg {...base(size)} className={className}><path d="M4.5 12.5l4.5 4.5L19.5 6.5" /></svg>
);

export const CAT_ICON = { concept: IconConcept, theorem: IconTheorem, tool: IconTool, exercise: IconExercise } as const;
