// The catalog: every course on the platform, per university.
// A course is "live" (content + checkout) or "soon" (landing page with a waitlist).

export const PLATFORM = { name: 'LCOURSE', tagline: 'קורסים לתואר, בלי שהחומר יפחיד' };

export type Uni = { slug: string; name: string; short: string };
export const UNIS: Uni[] = [
  { slug: 'bgu', name: 'אוניברסיטת בן־גוריון בנגב', short: 'בן־גוריון' },
  { slug: 'tau', name: 'אוניברסיטת תל אביב', short: 'תל אביב' },
];

export type Course = {
  key: string; // stable id, stored with purchases and access rows
  uni: string;
  slug: string;
  title: string;
  subtitle: string;
  code?: string;
  status: 'live' | 'soon';
  price?: number;
  accessUntil?: string; // YYYY-MM-DD, last day of full access
  blurb: string;
  topics?: string[]; // shown on coming-soon pages
};

export const COURSES: Course[] = [
  {
    key: 'bgu-physics-3', uni: 'bgu', slug: 'physics-3', title: 'פיזיקה 3', subtitle: 'תנודות וגלים', code: '203.1.2121',
    status: 'live',
    price: Number(process.env.COURSE_PRICE_ILS ?? 69),
    accessUntil: process.env.COURSE_ACCESS_UNTIL || '2027-04-30',
    blurb: 'מאוסילטור בודד, דרך מיתרים וגלי קול, ועד מערכות מרוסנות ומאולצות. שיעורים 1–4 בחינם.',
  },
  {
    key: 'bgu-analytical-mechanics', uni: 'bgu', slug: 'analytical-mechanics', title: 'מכניקה אנליטית', subtitle: 'לגרנז׳ והמילטון',
    status: 'soon',
    blurb: 'במקום לחשב כוחות, מחפשים את המסלול שהטבע בוחר. אותו מבנה: למה, אינטואיציה, הוכחה צעד אחר צעד.',
    topics: ['עקרון הפעולה המינימלית', 'משוואות אוילר–לגרנז׳ וקואורדינטות מוכללות', 'סימטריות וחוקי שימור (נתר)', 'ההמילטוניאן ומרחב הפאזה', 'סוגרי פואסון וטרנספורמציות קנוניות', 'תנודות קטנות'],
  },
  {
    key: 'bgu-fourier', uni: 'bgu', slug: 'fourier', title: 'פורייה', subtitle: 'טורים והתמרות',
    status: 'soon',
    blurb: 'כל אות הוא סכום של גלים. איך מפרקים אותו, למה זה עובד, ואיך זה פותר משוואות.',
    topics: ['טורי פורייה ומקדמים', 'התכנסות ותופעת גיבס', 'התמרת פורייה ותכונותיה', 'קונבולוציה ומשפט פרסבל', 'פונקציית הדלתא', 'פתרון משוואות דיפרנציאליות בעזרת פורייה'],
  },
  {
    key: 'tau-physics-3', uni: 'tau', slug: 'physics-3', title: 'פיזיקה 3', subtitle: 'תנודות וגלים',
    status: 'soon',
    blurb: 'אותו קורס, מותאם לסילבוס, לתרגילים ולמבחנים של תל אביב.',
    topics: ['אוסילטור הרמוני ומערכות מצומדות', 'מודים נורמליים ושרשראות', 'משוואת הגל ומיתרים', 'גלי קול ופיזור', 'ריסון וכוח מאלץ'],
  },
];

export const getUni = (slug: string) => UNIS.find((u) => u.slug === slug);
export const getCourse = (uni: string, slug: string) => COURSES.find((c) => c.uni === uni && c.slug === slug);
export const courseByKey = (key: string) => COURSES.find((c) => c.key === key);
export const courseBase = (c: Course) => `/${c.uni}/${c.slug}`;
export const DEFAULT_COURSE = COURSES[0];

export function formatDate(iso?: string) {
  if (!iso) return '';
  const [y, m, d] = iso.split('-');
  return `${Number(d)}.${Number(m)}.${y}`;
}

/** Is full access to this course still open today (Israel time)? */
export function accessOpen(c: Course, now = new Date()) {
  if (!c.accessUntil) return true;
  return now.getTime() <= new Date(`${c.accessUntil}T23:59:59+03:00`).getTime();
}
