import 'server-only';
import data from '@/content/rendered.json';

export type Cat = 'concept' | 'theorem' | 'tool';
export type Chapter = { id: string; letter: string; title: string; story: string; where: string };
export type Card = {
  id: string; cat: Cat; ch: string; title: string; one: string; lessons: number[];
  free: boolean; where: string; body: string;
};
export type Exercise = {
  id: string; group: 'tut' | 'hw' | 'exam'; src: string; q: number; ch: string; title: string;
  topics: string; free: boolean; body: string;
};

export const CHAPTERS = data.chapters as Chapter[];
export const CARDS = data.cards as Card[];
export const EXERCISES = data.exercises as Exercise[];
export const CHEAT_FREE = data.cheatFree as string;
export const CHEAT_PAID = data.cheatPaid as string;

export const CAT_LABEL: Record<Cat, string> = { concept: 'קונספט', theorem: 'משפט', tool: 'כלי' };
export const CAT_TITLE: Record<Cat, string> = { concept: 'קונספטים', theorem: 'משפטים והוכחות', tool: 'כלים ודרכי פתרון' };
export const TAB_CAT: Record<string, Cat> = { concepts: 'concept', theorems: 'theorem', tools: 'tool' };

export const TABS = [
  { slug: 'map', label: 'מפה' },
  { slug: 'concepts', label: 'קונספטים' },
  { slug: 'theorems', label: 'משפטים והוכחות' },
  { slug: 'tools', label: 'כלים ודרכי פתרון' },
  { slug: 'exercises', label: 'תרגילים' },
  { slug: 'cheat', label: 'מה לזכור בתכלס' },
] as const;

export const SUBS = [
  { slug: 'tut', label: 'תרגולים' },
  { slug: 'hw', label: 'שיעורי בית' },
  { slug: 'exam', label: 'מבחנים' },
] as const;

export function hrefFor(id: string) {
  const card = CARDS.find((c) => c.id === id);
  if (card) return `/course/${card.cat}s#${id}`;
  const ex = EXERCISES.find((e) => e.id === id);
  if (ex) return `/course/exercises?sub=${ex.group}#${id}`;
  return '/course';
}

export const STATS = {
  cards: CARDS.length,
  exercises: EXERCISES.length,
  freeCards: CARDS.filter((c) => c.free).length,
  freeExercises: EXERCISES.filter((e) => e.free).length,
};
