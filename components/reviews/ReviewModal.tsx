'use client';
import { useEffect, useRef } from 'react';
import type { Review } from '@/data/reviews';
import GoogleLogo, { Stars } from './GoogleLogo';

// Full review in a dialog. Closes with Esc, a backdrop click or the X button; focus returns to the opener.
export default function ReviewModal({ review, onClose }: { review: Review; onClose: () => void }) {
  const closeBtn = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    const opener = document.activeElement as HTMLElement | null;
    closeBtn.current?.focus();
    const overflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    return () => { document.removeEventListener('keydown', onKey); document.documentElement.style.overflow = overflow; opener?.focus?.(); };
  }, [onClose]);
  return <div className="rv-modal" onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
    <div className="rv-modal-card" role="dialog" aria-modal="true" aria-labelledby="rv-modal-name">
      <button ref={closeBtn} type="button" className="rv-modal-close" aria-label="Close review" onClick={onClose}><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><path d="M5 5l14 14M19 5L5 19" /></svg></button>
      <header className="rv-head">
        <div className="rv-who"><strong id="rv-modal-name">{review.name}</strong><time>{review.date}</time></div>
        <GoogleLogo size={24} />
      </header>
      <div className="rv-meta"><Stars rating={review.rating} /><span className="rv-score">{review.rating}/5</span><span className="rv-source">Posted on Google</span></div>
      <p className="rv-modal-text">{review.text}</p>
    </div>
  </div>;
}
