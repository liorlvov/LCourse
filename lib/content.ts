import 'server-only';
import physics3 from '@/content/rendered.json';
import physics3Updates from '@/content/updates/bgu-physics-3.json';

export type Cat = 'concept' | 'definition' | 'theorem' | 'tool';
export type Chapter = { id: string; letter: string; title: string; story: string; where: string };
export type Card = {
  id: string; cat: Cat; ch: string; title: string; one: string; lessons: number[];
  free: boolean; where: string; body: string; source?: 'this' | 'last';
};
export type Exercise = {
  id: string; group: 'tut' | 'hw' | 'exam'; src: string; q: number; ch: string; title: string;
  topics: string; free: boolean; body: string;
};
export type UpdateItem = { kind: 'new' | 'changed' | 'removed' | 'same'; text: string; ref?: string };
export type CourseUpdate = { id: string; date: string; title: string; summary: string; items: UpdateItem[] };

export type CourseContent = {
  base: string;
  chapters: Chapter[];
  cards: Card[];
  exercises: Exercise[];
  cheatFree: string;
  cheatPaid: string;
  updates: CourseUpdate[]; // newest first
  stats: { cards: number; exercises: number; freeCards: number; freeExercises: number };
  hrefFor: (id: string) => string;
};

export const CAT_LABEL: Record<Cat, string> = { concept: 'קונספט', definition: 'הגדרה', theorem: 'משפט', tool: 'כלי' };
export const CAT_TITLE: Record<Cat, string> = { concept: 'קונספטים', definition: 'הגדרות', theorem: 'משפטים והגדרות', tool: 'כלים ודרכי פתרון' };
/** Which card types each tab shows, in order. Definitions come before theorems in every chapter. */
export const TAB_CATS: Record<string, Cat[]> = { concepts: ['concept'], theorems: ['definition', 'theorem'], tools: ['tool'] };
export const TAB_OF_CAT: Record<Cat, string> = { concept: 'concepts', definition: 'theorems', theorem: 'theorems', tool: 'tools' };

export const SUBS = [
  { slug: 'tut', label: 'תרגולים' },
  { slug: 'hw', label: 'שיעורי בית' },
  { slug: 'exam', label: 'מבחנים' },
] as const;

type Raw = { chapters: unknown; cards: unknown; exercises: unknown; cheatFree: string; cheatPaid: string };

function build(raw: Raw, base: string, updates: CourseUpdate[]): CourseContent {
  // the content export links to /course/...; point those links at this course
  const data = JSON.parse(JSON.stringify(raw).replaceAll('/course/', `${base}/`)) as Raw;
  const cards = data.cards as Card[];
  const exercises = data.exercises as Exercise[];
  return {
    base,
    chapters: data.chapters as Chapter[],
    cards,
    exercises,
    cheatFree: data.cheatFree,
    cheatPaid: data.cheatPaid,
    updates: [...updates].sort((a, b) => b.date.localeCompare(a.date)),
    stats: {
      cards: cards.length,
      exercises: exercises.length,
      freeCards: cards.filter((c) => c.free).length,
      freeExercises: exercises.filter((e) => e.free).length,
    },
    hrefFor(id: string) {
      const c = cards.find((x) => x.id === id);
      if (c) return `${base}/${TAB_OF_CAT[c.cat]}#${id}`;
      const e = exercises.find((x) => x.id === id);
      return e ? `${base}/exercises?sub=${e.group}#${id}` : `${base}/map`;
    },
  };
}

const CONTENT: Record<string, CourseContent> = {
  'bgu-physics-3': build(physics3 as Raw, '/bgu/physics-3', physics3Updates as CourseUpdate[]),
};

export function getContent(courseKey: string): CourseContent | undefined {
  return CONTENT[courseKey];
}

/** Progress row used to remember that a user saw an update. */
export const seenId = (updateId: string) => `upd:${updateId}`.slice(0, 40);
