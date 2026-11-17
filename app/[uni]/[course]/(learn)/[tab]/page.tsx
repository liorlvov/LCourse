import Link from 'next/link';
import { notFound } from 'next/navigation';
import { CAT_LABEL, CAT_TITLE, TAB_CAT, SUBS, getContent, seenId, type Cat, type CourseContent } from '@/lib/content';
import { getViewer, hasCourse, type Viewer } from '@/lib/access';
import { getCourse, type Course } from '@/lib/courses';
import { CardView, ExerciseView, LockedView, LockCta } from '@/components/Items';
import { IconLock } from '@/components/Icons';
import MarkSeen from '@/components/MarkSeen';

type Ctx = { k: CourseContent; course: Course; viewer: Viewer; paid: boolean };

export const dynamic = 'force-dynamic';

const TAB_INTRO: Record<Cat, string> = {
  concept: 'מה התופעה, למה היא מעניינת, ואיך לחשוב עליה. כל כרטיס סגור, ופותחים רק את מה שצריך.',
  theorem: 'כל משפט: הניסוח, למה הוא חשוב, האינטואיציה, ואז הוכחה שבה כל צעד אומר מה עושים ולמה.',
  tool: 'מתכונים לפתרון תרגילים: איך מזהים שצריך את הכלי, הצעדים, דוגמה פתורה ומלכודות.',
};

export default async function TabPage({
  params, searchParams,
}: {
  params: Promise<{ uni: string; course: string; tab: string }>;
  searchParams: Promise<{ sub?: string; payment?: string }>;
}) {
  const { uni, course: slug, tab } = await params;
  const sp = await searchParams;
  const course = getCourse(uni, slug);
  const k = course ? getContent(course.key) : undefined;
  if (!course || !k) notFound();
  const viewer = await getViewer();
  const ctx: Ctx = { k, course, viewer, paid: hasCourse(viewer, course.key) };

  if (tab === 'map') return <MapTab ctx={ctx} payment={sp.payment} />;
  if (tab in TAB_CAT) return <CardsTab ctx={ctx} cat={TAB_CAT[tab]} />;
  if (tab === 'exercises') return <ExercisesTab ctx={ctx} sub={sp.sub ?? 'tut'} />;
  if (tab === 'cheat') return <CheatTab ctx={ctx} />;
  if (tab === 'updates') return <UpdatesTab ctx={ctx} />;
  notFound();
}

const FULL = 'הקורס המלא: כל השיעורים, מהשיעור החמישי ועד סוף הסמסטר, כל התרגילים עם פתרון מלא, דף הנוסחאות ושאלות ממבחנים. כל מה שיעלה בהמשך כלול.';

const KIND_LABEL = { new: 'חדש', changed: 'שונה', removed: 'ירד', same: 'כמו בשנה שעברה' } as const;

function UpdatesTab({ ctx: { k, viewer } }: { ctx: Ctx }) {
  const unseen = k.updates.filter((u) => !viewer.done.has(seenId(u.id))).map((u) => seenId(u.id));
  return (
    <>
      <header className="tabhead">
        <h2>מה חדש בקורס</h2>
        <p>בכל פעם שעולה הרצאה של השנה, החומר מתעדכן, וכאן כתוב מה השתנה לעומת שנה שעברה.</p>
      </header>
      {k.updates.length === 0 ? <div className="empty"><p>עוד אין עדכונים.</p></div> : null}
      <ol className="updates">
        {k.updates.map((u) => (
          <li key={u.id} className={`upd${unseen.includes(seenId(u.id)) ? ' fresh' : ''}`}>
            <div className="upd-head">
              <time dateTime={u.date}>{u.date.split('-').reverse().join('.')}</time>
              {unseen.includes(seenId(u.id)) ? <span className="upd-new">חדש</span> : null}
            </div>
            <h3>{u.title}</h3>
            <p className="muted">{u.summary}</p>
            {u.items.length ? (
              <ul className="upd-items">
                {u.items.map((it, i) => (
                  <li key={i} className={`k-${it.kind}`}>
                    <span className="k-tag">{KIND_LABEL[it.kind]}</span>
                    <span>{it.ref ? <Link href={k.hrefFor(it.ref)}>{it.text}</Link> : it.text}</span>
                  </li>
                ))}
              </ul>
            ) : null}
          </li>
        ))}
      </ol>
      <MarkSeen ids={unseen} />
    </>
  );
}

function MapTab({ ctx: { k, course, viewer, paid }, payment }: { ctx: Ctx; payment?: string }) {
  const visible = [...k.cards.map((c) => ({ id: c.id, free: c.free })), ...k.exercises.map((e) => ({ id: e.id, free: e.free }))]
    .filter((x) => x.free || paid);
  const doneCount = visible.filter((x) => viewer.done.has(x.id)).length;
  const fresh = k.updates.find((u) => !viewer.done.has(seenId(u.id)));
  return (
    <>
      {payment === 'failed' || payment === 'error' ? (
        <div className="banner warn">התשלום לא הושלם. אפשר לנסות שוב, ואם נחייבת בלי לקבל גישה, כתוב לנו ונסדר.</div>
      ) : null}
      {fresh ? (
        <Link className="banner upd-banner" href={`${k.base}/updates`}>
          <span className="upd-new">עדכון</span> {fresh.title} <span aria-hidden="true">←</span>
        </Link>
      ) : null}
      <header className="hero">
        <p className="kicker">{course.title} · {course.subtitle}</p>
        <h1>{paid ? 'הקורס המלא שלך' : 'סביבת הלמידה'}</h1>
        <p className="lead">
          החומר מסודר לפי נושאים. כל כרטיס סגור כברירת מחדל: רואים רק כותרת ומשפט אחד, ופותחים כשמוכנים.
          {paid ? '' : ' ארבעת השיעורים הראשונים פתוחים בחינם. בסוף השיעור הרביעי אפשר להמשיך עם הקורס המלא.'}
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
        {k.chapters.map((ch) => {
          const exs = k.exercises.filter((e) => e.ch === ch.id);
          return (
            <article className="chcard" key={ch.id}>
              <div className="chtop">
                <span className="chletter big">{ch.letter}</span>
                <div><h3>{ch.title}</h3><p className="chstory">{ch.story}</p></div>
              </div>
              <div className="chcols">
                {(['concept', 'theorem', 'tool'] as Cat[]).map((cat) => {
                  const cards = k.cards.filter((c) => c.cat === cat && c.ch === ch.id);
                  if (!cards.length) return null;
                  return (
                    <div className="chcol" key={cat}>
                      <div className={`chcol-h b-${cat}-t`}>{CAT_TITLE[cat]}</div>
                      <ul>
                        {cards.map((c) => (
                          <li key={c.id}>
                            <Link className={`maplink${viewer.done.has(c.id) ? ' done' : ''}`} href={k.hrefFor(c.id)}>
                              {c.title}{!c.free && !paid ? <IconLock size={13} className="maplock" /> : null}
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
                    <Link key={e.id} className={`maplink exlink${viewer.done.has(e.id) ? ' done' : ''}`} href={k.hrefFor(e.id)}>
                      {e.src} · {e.q}{!e.free && !paid ? <IconLock size={13} className="maplock" /> : null}
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

function CardsTab({ ctx: { k, course, viewer, paid }, cat }: { ctx: Ctx; cat: Cat }) {
  // Free users see the free part first, then where it ends, then what the full course adds.
  const group = (pick: (free: boolean) => boolean) =>
    k.chapters
      .map((ch) => ({ ch, cards: k.cards.filter((c) => c.cat === cat && c.ch === ch.id && pick(c.free)) }))
      .filter((g) => g.cards.length);
  const open = group((free) => paid || free);
  const locked = paid ? [] : group((free) => !free);
  return (
    <>
      <header className="tabhead"><h2>{CAT_TITLE[cat]}</h2><p>{TAB_INTRO[cat]}</p></header>
      {open.map(({ ch, cards }) => (
        <div className="chgroup" key={ch.id}>
          <h3 className="chhead"><span className="chletter">{ch.letter}</span>{ch.title}</h3>
          {cards.map((c) => <CardView key={c.id} card={c} done={viewer.done.has(c.id)} />)}
        </div>
      ))}
      {locked.length ? (
        <>
          <LockCta course={course} title="כאן נגמר החלק החינמי" text={FULL} />
          <h3 className="locked-h">בקורס המלא</h3>
          {locked.map(({ ch, cards }) => (
            <div className="chgroup" key={ch.id}>
              <h4 className="chhead small"><span className="chletter">{ch.letter}</span>{ch.title}</h4>
              {cards.map((c) => (
                <LockedView key={c.id} id={c.id} badge={CAT_LABEL[c.cat]} badgeClass={`b-${c.cat}`} title={c.title} one={c.one} />
              ))}
            </div>
          ))}
        </>
      ) : null}
    </>
  );
}

function ExercisesTab({ ctx: { k, course, viewer, paid }, sub }: { ctx: Ctx; sub: string }) {
  const current = SUBS.some((s) => s.slug === sub) ? sub : 'tut';
  const items = k.exercises.filter((e) => e.group === current);
  const sources = [...new Set(items.map((e) => e.src))];
  const anyLocked = !paid && items.some((e) => !e.free);
  return (
    <>
      <header className="tabhead">
        <h2>תרגילים</h2>
        <p>נסה קודם לבד, פתח את הרמז אם נתקעת, ורק אז את הפתרון. כל צעד בפתרון אומר מה עושים ולמה.</p>
      </header>
      <div className="subtabs" role="tablist">
        {SUBS.map((s) => (
          <Link key={s.slug} href={`${k.base}/exercises?sub=${s.slug}`} className="subtab" role="tab" aria-selected={s.slug === current}>
            {s.label} <span className="cnt">{k.exercises.filter((e) => e.group === s.slug).length || ''}</span>
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
              e.free || paid ? (
                <ExerciseView key={e.id} ex={e} done={viewer.done.has(e.id)} />
              ) : (
                <LockedView key={e.id} id={e.id} badge={`${e.src} · ${e.q}`} badgeClass="b-exercise" title={e.title} one={`נושא: ${e.topics}`} />
              ),
            )}
          </div>
        ))
      )}
      {anyLocked ? <LockCta course={course} title="שאר הפתרונות בקורס המלא" text={FULL} /> : null}
    </>
  );
}

function CheatTab({ ctx: { k, course, paid } }: { ctx: Ctx }) {
  return (
    <>
      <div dangerouslySetInnerHTML={{ __html: k.cheatFree }} />
      {paid ? (
        <div dangerouslySetInnerHTML={{ __html: k.cheatPaid }} />
      ) : (
        <LockCta course={course} title="שאר דף הנוסחאות בקורס המלא" text={FULL} />
      )}
    </>
  );
}
