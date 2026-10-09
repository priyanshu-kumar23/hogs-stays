'use client';
import { useEffect, useRef, useState } from 'react';
import type { Review } from '@/data/reviews';
import GoogleLogo, { Stars } from './GoogleLogo';

// One equal-height card in the reviews scroller. Long text is clamped; "Read more" opens the full review in a modal (so the row stays even).
export default function ReviewCard({ review, index, onOpen }: { review: Review; index: number; onOpen: (review: Review) => void }) {
  const body = useRef<HTMLParagraphElement>(null);
  const [clamped, setClamped] = useState(false);

  // Only offer "Read more" when the text really is cut off at this width.
  useEffect(() => {
    const el = body.current;
    if (!el) return;
    const measure = () => setClamped(el.scrollHeight > el.clientHeight + 1);
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const initial = review.name.trim().charAt(0).toUpperCase();
  return <article className="rv-card" role="group" aria-roledescription="slide" aria-label={`Review by ${review.name}`}>
    <header className="rv-head">
      <span className={`rv-avatar tone-${index % 4}`} aria-hidden="true">{initial}</span>
      <div className="rv-who"><strong>{review.name}</strong><time>{review.date}</time></div>
      <GoogleLogo size={20} />
    </header>
    <div className="rv-meta"><Stars rating={review.rating} /><span className="rv-score">{review.rating}/5</span><span className="rv-source">Posted on Google</span></div>
    <p ref={body} className="rv-text">{review.text}</p>
    {clamped && <button type="button" className="rv-more" aria-haspopup="dialog" onClick={() => onOpen(review)}>Read more</button>}
    {(review.tripType || review.highlights?.length) ? <footer className="rv-tags">{review.tripType && <span className="rv-tag">{review.tripType}</span>}{review.highlights?.map(h => <span className="rv-tag soft" key={h}>{h}</span>)}</footer> : null}
  </article>;
}
