// Pre-renders every $...$ / $$...$$ in content/content.json with KaTeX -> content/rendered.json
// Run after updating content.json:  npm run content
import fs from 'node:fs';
import katex from 'katex';

const src = JSON.parse(fs.readFileSync(new URL('../content/content.json', import.meta.url), 'utf8'));
const errors = [];
const unescape = (s) => s.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>');

function renderMath(html) {
  if (typeof html !== 'string') return html;
  return html.replace(/\$\$([\s\S]+?)\$\$|\$([^$]+?)\$/g, (m, disp, inl) => {
    const tex = unescape(disp ?? inl);
    try {
      return katex.renderToString(tex, { displayMode: disp !== undefined, throwOnError: true, strict: false, output: 'html' });
    } catch (e) {
      errors.push(`${e.message.slice(0, 120)} :: ${tex.slice(0, 80)}`);
      return katex.renderToString(tex, { displayMode: disp !== undefined, throwOnError: false, strict: false, output: 'html' });
    }
  });
}

const out = {
  chapters: src.chapters,
  cheatFree: renderMath(src.cheatFree),
  cheatPaid: renderMath(src.cheatPaid),
  cards: src.cards.map((c) => ({ ...c, one: renderMath(c.one), body: renderMath(c.body) })),
  exercises: src.exercises.map((e) => ({ ...e, body: renderMath(e.body) })),
};
fs.writeFileSync(new URL('../content/rendered.json', import.meta.url), JSON.stringify(out));
console.log(`rendered: ${out.cards.length} cards, ${out.exercises.length} exercises, ${errors.length} math errors`);
if (errors.length) { console.log(errors.join('\n')); process.exit(1); }
