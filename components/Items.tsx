import { CAT_LABEL, type Card, type Exercise } from '@/lib/content';
import MarkButton from './MarkButton';
import BuyButton from './BuyButton';
import { CAT_ICON, IconExercise, IconLock } from './Icons';
import type { Course } from '@/lib/courses';

export function CardView({ card, done }: { card: Card; done: boolean }) {
  const Icon = CAT_ICON[card.cat as keyof typeof CAT_ICON] ?? IconExercise;
  return (
    <details className={`card cat-${card.cat}${done ? ' done' : ''}`} id={card.id}>
      <summary>
        <span className={`badge b-${card.cat}`}><Icon size={14} /> {CAT_LABEL[card.cat]}</span>
        <span className="ctitle">{card.title}{card.source === 'last' ? <span className="src-tag" title="נכתב לפי ההרצאות של שנה שעברה. יתעדכן כשההרצאה של השנה תעלה.">לפי שנה שעברה</span> : null}</span>
        <span className="cone" dangerouslySetInnerHTML={{ __html: card.one }} />
        <span className="done-mark" aria-hidden="true">✓</span>
      </summary>
      <div className="cbody">
        <div dangerouslySetInnerHTML={{ __html: card.body }} />
        <div className="cfoot">
          <span className="where">איפה בחומר: {card.where}</span>
          <MarkButton id={card.id} initial={done} on="הבנתי ✓" off="סמן: הבנתי" />
        </div>
      </div>
    </details>
  );
}

export function ExerciseView({ ex, done }: { ex: Exercise; done: boolean }) {
  return (
    <details className={`card cat-exercise${done ? ' done' : ''}`} id={ex.id}>
      <summary>
        <span className="badge b-exercise"><IconExercise size={14} /> {ex.src} · {ex.q}</span>
        <span className="ctitle">{ex.title}</span>
        <span className="cone">נושא: {ex.topics}</span>
        <span className="done-mark" aria-hidden="true">✓</span>
      </summary>
      <div className="cbody">
        <div dangerouslySetInnerHTML={{ __html: ex.body }} />
        <div className="cfoot">
          <span className="where">פתרון נבדק נומרית</span>
          <MarkButton id={ex.id} initial={done} on="פתרתי ✓" off="סמן: פתרתי" />
        </div>
      </div>
    </details>
  );
}

export function LockedView({ id, badge, badgeClass, title, one }: { id: string; badge: string; badgeClass: string; title: string; one?: string }) {
  return (
    <div className="locked" id={id}>
      <span className={`badge ${badgeClass}`}>{badge}</span>
      <span className="ctitle">{title}</span>
      <span className="lock"><IconLock size={15} /> בגישה המלאה</span>
      {one ? <span className="cone" dangerouslySetInnerHTML={{ __html: one }} /> : null}
    </div>
  );
}

export function LockCta({ text, course, title }: { text: string; course: Course; title?: string }) {
  return (
    <div className="lockcta">
      {title ? <h3>{title}</h3> : null}
      <p>{text}</p>
      <BuyButton course={course} />
    </div>
  );
}
