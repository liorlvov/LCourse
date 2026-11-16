import { CAT_LABEL, type Card, type Exercise } from '@/lib/content';
import MarkButton from './MarkButton';
import BuyButton from './BuyButton';

export function CardView({ card, done }: { card: Card; done: boolean }) {
  return (
    <details className={`card cat-${card.cat}${done ? ' done' : ''}`} id={card.id}>
      <summary>
        <span className={`badge b-${card.cat}`}>{CAT_LABEL[card.cat]}</span>
        <span className="ctitle">{card.title}</span>
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
        <span className="badge b-exercise">{ex.src} · {ex.q}</span>
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
      <span className="lock" aria-label="נעול">🔒 בגישה המלאה</span>
      {one ? <span className="cone" dangerouslySetInnerHTML={{ __html: one }} /> : null}
    </div>
  );
}

export function LockCta({ text }: { text: string }) {
  return (
    <div className="lockcta">
      <p>{text}</p>
      <BuyButton />
    </div>
  );
}
