import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  CARDS, CHAPTERS, EXERCISES, CHEAT_FREE, CHEAT_PAID, CAT_LABEL, CAT_TITLE, TAB_CAT, SUBS, type Cat,
} from '@/lib/content';
import { getViewer, type Viewer } from '@/lib/access';
import { CardView, ExerciseView, LockedView, LockCta } from '@/components/Items';

export const dynamic = 'force-dynamic';

const TAB_INTRO: Record<Cat, string> = {
  concept: 'מה התופעה, למה היא מעניינת, ואיך לחשוב עליה. כל כרטיס סגור, ופותחים רק את מה שצריך.',
  theorem: 'כל משפט: הניסוח, למה הוא חשוב, האינטואיציה, ואז הוכחה שבה כל צעד אומר מה עושים ולמה.',
  tool: 'מתכונים לפתרון תרגילים: איך מזהים שצריך את הכלי, הצעדים, דוגמה פתורה ומלכודות.',
};

function hrefOf(id: string) {
  const c = CARDS.find((x) => x.id === id);
  if (c) return `/course/${c.cat}s#${id}`;
  const e = EXERCISES.find((x) => x.id === id);
  return e ? `/course/exercises?sub=${e.group}#${id}` : '/course/map';
}

export default async function TabPage({
  params, searchParams,
}: {
  params: Promise<{ tab: string }>;
  searchParams: Promise<{ sub?: string; payment?: string }>;
}) {
  const { tab } = await params;
  const sp = await searchParams;
  const viewer = await getViewer();

  if (tab === 'map') return <MapTab viewer={viewer} payment={sp.payment} />;
  if (tab in TAB_CAT) return <CardsTab cat={TAB_CAT[tab]} viewer={viewer} />;
  if (tab === 'exercises') return <ExercisesTab viewer={viewer} sub={sp.sub ?? 'tut'} />;
  if (tab === 'cheat') return <CheatTab viewer={viewer} />;
  notFound();
}

function MapTab({ viewer, payment }: { viewer: Viewer; payment?: string }) {
  const visible = [...CARDS.map((c) => ({ id: c.id, free: c.free })), ...EXERCISES.map((e) => ({ id: e.id, free: e.free }))]
    .filter((x) => x.free || viewer.hasAccess);
  const doneCount = visible.filter((x) => viewer.done.has(x.id)).length;
  return (
    <>
      {payment === 'failed' || payment === 'error' ? (
        <div className="banner warn">התשלום לא הושלם. אפשר לנסות שוב, ואם נחייבת בלי לקבל גישה, כתוב לנו ונסדר.</div>
      ) : null}
      <header className="hero">
        <p className="kicker">פיזיקה 3 · תנודות וגלים</p>
        <h1>{viewer.hasAccess ? 'הקורס המלא שלך' : 'סביבת הלמידה'}</h1>
        <p className="lead">
          החומר מסודר לפי נושאים. כל כרטיס סגור כברירת מחדל: רואים רק כותרת ומשפט אחד, ופותחים כשמוכנים.
          {viewer.hasAccess ? '' : ' שיעורים 1–4, תרגול 2 ושיעורי בית 1–2 פתוחים בחינם.'}
        </p>
        <div className="progress-wrap">
          <div className="progress-label">ההתקדמות שלך: {doneCount} מתוך {visible.length}</div>
          <div className="progress"><div className="progress-bar" style={{ width: `${visible.length ? (100 * doneCount) / visible.length : 0}%` }} /></div>
        </div>
      </header>
      <section className="howto">
        <h2>איך משתמשים</h2>
        <div className="howgrid">
          <div className="how"><span className="badge b-concept">קונספט</span><p>מה התופעה ואיך לחשוב עליה. מתחילים כאן כשנושא חדש.</p></div>
          <div className="how"><span className="badge b-theorem">משפט</span><p>טענה מדויקת והוכחה, כשכל צעד מסביר מה עושים ולמה.</p></div>
          <div className="how"><span className="badge b-tool">כלי</span><p>מתכון לפתרון תרגילים: איך מזהים, הצעדים, דוגמה ומלכודות.</p></div>
        </div>
        <p className="anatomy">בתוך כל כרטיס: <b>הכותרת</b> ← <span className="tog">למה בכלל?</span> (מקופל) ← <b>האינטואיציה</b> ← <span className="tog">ההוכחה</span> (מקופל, צעד אחר צעד) ← <b className="hl">מה לזכור לתרגילים</b>.</p>
      </section>
      <section className="chapters">
        <h2>הפרקים</h2>
        {CHAPTERS.map((ch) => {
          const exs = EXERCISES.filter((e) => e.ch === ch.id);
          return (
            <article className="chcard" key={ch.id}>
              <div className="chtop">
                <span className="chletter big">{ch.letter}</span>
                <div><h3>{ch.title}</h3><p className="chstory">{ch.story}</p></div>
              </div>
              <div className="chcols">
                {(['concept', 'theorem', 'tool'] as Cat[]).map((cat) => {
                  const cards = CARDS.filter((c) => c.cat === cat && c.ch === ch.id);
                  if (!cards.length) return null;
                  return (
                    <div className="chcol" key={cat}>
                      <div className={`chcol-h b-${cat}-t`}>{CAT_TITLE[cat]}</div>
                      <ul>
                        {cards.map((c) => (
                          <li key={c.id}>
                            <Link className={`maplink${viewer.done.has(c.id) ? ' done' : ''}`} href={hrefOf(c.id)}>
                              {c.title}{!c.free && !viewer.hasAccess ? ' 🔒' : ''}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  );
                })}
              </div>
              {exs.length ? (
                <div className="chex">
                  <span className="chcol-h b-exercise-t">תרגילים בנושא</span>
                  {exs.map((e) => (
                    <Link key={e.id} className={`maplink exlink${viewer.done.has(e.id) ? ' done' : ''}`} href={hrefOf(e.id)}>
                      {e.src} · {e.q}{!e.free && !viewer.hasAccess ? ' 🔒' : ''}
                    </Link>
                  ))}
                </div>
              ) : null}
              <p className="chwhere"><b>איפה בחומר:</b> {ch.where}</p>
            </article>
          );
        })}
      </section>
    </>
  );
}

function CardsTab({ cat, viewer }: { cat: Cat; viewer: Viewer }) {
  const anyLocked = !viewer.hasAccess && CARDS.some((c) => c.cat === cat && !c.free);
  return (
    <>
      <header className="tabhead"><h2>{CAT_TITLE[cat]}</h2><p>{TAB_INTRO[cat]}</p></header>
      {CHAPTERS.map((ch) => {
        const cards = CARDS.filter((c) => c.cat === cat && c.ch === ch.id);
        if (!cards.length) return null;
        return (
          <div className="chgroup" key={ch.id}>
            <h3 className="chhead"><span className="chletter">{ch.letter}</span>{ch.title}</h3>
            {cards.map((c) =>
              c.free || viewer.hasAccess ? (
                <CardView key={c.id} card={c} done={viewer.done.has(c.id)} />
              ) : (
                <LockedView key={c.id} id={c.id} badge={CAT_LABEL[c.cat]} badgeClass={`b-${c.cat}`} title={c.title} one={c.one} />
              ),
            )}
          </div>
        );
      })}
      {anyLocked ? <LockCta text="הכרטיסים הנעולים שייכים לשיעור 5 ואילך. הגישה המלאה פותחת אותם, וגם כל חומר שיתווסף במהלך הסמסטר." /> : null}
    </>
  );
}

function ExercisesTab({ viewer, sub }: { viewer: Viewer; sub: string }) {
  const current = SUBS.some((s) => s.slug === sub) ? sub : 'tut';
  const items = EXERCISES.filter((e) => e.group === current);
  const sources = [...new Set(items.map((e) => e.src))];
  const anyLocked = !viewer.hasAccess && items.some((e) => !e.free);
  return (
    <>
      <header className="tabhead">
        <h2>תרגילים</h2>
        <p>נסה קודם לבד, פתח את הרמז אם נתקעת, ורק אז את הפתרון. כל צעד בפתרון אומר מה עושים ולמה.</p>
      </header>
      <div className="subtabs" role="tablist">
        {SUBS.map((s) => (
          <Link key={s.slug} href={`/course/exercises?sub=${s.slug}`} className="subtab" role="tab" aria-selected={s.slug === current}>
            {s.label} <span className="cnt">{EXERCISES.filter((e) => e.group === s.slug).length || ''}</span>
          </Link>
        ))}
      </div>
      {items.length === 0 ? (
        <div className="empty">
          <p><b>שאלות המבחנים בדרך.</b> כל שאלה תתויג לפי נושא ולפי מוכנות:</p>
          <p><span className="pill ok">אפשר לפתור כבר</span> <span className="pill mid">חלקית</span> <span className="pill no">עוד לא</span></p>
        </div>
      ) : (
        sources.map((src) => (
          <div className="chgroup" key={src}>
            <h3 className="chhead">{src}</h3>
            {items.filter((e) => e.src === src).map((e) =>
              e.free || viewer.hasAccess ? (
                <ExerciseView key={e.id} ex={e} done={viewer.done.has(e.id)} />
              ) : (
                <LockedView key={e.id} id={e.id} badge={`${e.src} · ${e.q}`} badgeClass="b-exercise" title={e.title} one={`נושא: ${e.topics}`} />
              ),
            )}
          </div>
        ))
      )}
      {anyLocked ? <LockCta text="הפתרונות המלאים לכל התרגולים, שיעורי הבית והמבחנים נפתחים בגישה המלאה." /> : null}
    </>
  );
}

function CheatTab({ viewer }: { viewer: Viewer }) {
  return (
    <>
      <div dangerouslySetInnerHTML={{ __html: CHEAT_FREE }} />
      {viewer.hasAccess ? (
        <div dangerouslySetInnerHTML={{ __html: CHEAT_PAID }} />
      ) : (
        <LockCta text="שאר דף הנוסחאות (פרקים ב–ה) ורשימת הטעויות שעולות נקודות נפתחים בגישה המלאה." />
      )}
    </>
  );
}
