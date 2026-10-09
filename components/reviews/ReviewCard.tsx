'use client';
import type { Review } from '@/data/reviews';
import GoogleLogo, { Stars } from './GoogleLogo';

// One equal-height card in the reviews marquee. Clicking the card (or READ MORE) opens the full review in the modal.
// `hidden` marks the duplicate copy that makes the loop seamless: hidden from assistive tech and out of the tab order.
export default function ReviewCard({ review, index, onOpen, hidden = false }: { review: Review; index: number; onOpen: (review: Review) => void; hidden?: boolean }) {
  const initial = review.name.trim().charAt(0).toUpperCase();
  return <article className="rv-card" role={hidden ? undefined : 'listitem'} onClick={() => onOpen(review)}>
    <span className="rv-quote" aria-hidden="true">“</span>
    <header className="rv-head">
      <span className={`rv-avatar tone-${index % 4}`} aria-hidden="true"><span>{initial}</span></span>
      <div className="rv-who"><strong>{review.name}</strong><time>{review.date}</time></div>
      <GoogleLogo size={20} />
    </header>
    <div className="rv-meta"><Stars rating={review.rating} /><span className="rv-score">{review.rating}/5 · Posted on Google</span></div>
    <p className="rv-text">{review.text}</p>
    <footer className="rv-foot">
      <button type="button" className="rv-more" aria-haspopup="dialog" tabIndex={hidden ? -1 : undefined} onClick={e => { e.stopPropagation(); onOpen(review); }}>Read more <span aria-hidden="true">→</span></button>
      {review.tripType && <span className="rv-tag">{review.tripType}</span>}
    </footer>
  </article>;
}
