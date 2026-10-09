'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import type { Review } from '@/data/reviews';
import ReviewCard from './ReviewCard';
import ReviewModal from './ReviewModal';

const AUTO_MS = 5000;
// Single-row scroll-snap scroller: arrows, edge fades, drag-to-scroll, keyboard arrows, optional auto-advance and a progress bar.
export default function ReviewsCarousel({ reviews }: { reviews: Review[] }) {
  const scroller = useRef<HTMLDivElement>(null);
  const drag = useRef({ active: false, moved: false, startX: 0, startLeft: 0 });
  const [edge, setEdge] = useState({ start: true, end: false });
  const [progress, setProgress] = useState(0);
  const [paused, setPaused] = useState(false);
  const [open, setOpen] = useState<Review | null>(null);
  const close = useCallback(() => setOpen(null), []);

  const update = useCallback(() => {
    const el = scroller.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    setEdge({ start: el.scrollLeft <= 2, end: el.scrollLeft >= max - 2 });
    setProgress(max > 0 ? Math.min(1, el.scrollLeft / max) : 1);
  }, []);
  useEffect(() => {
    const el = scroller.current;
    if (!el) return;
    update();
    const observer = new ResizeObserver(update);
    observer.observe(el);
    return () => observer.disconnect();
  }, [update]);

  const step = useCallback((dir: 1 | -1) => {
    const el = scroller.current;
    const card = el?.firstElementChild as HTMLElement | null;
    if (!el || !card) return;
    const gap = parseFloat(getComputedStyle(el).columnGap) || 0;
    el.scrollBy({ left: dir * (card.offsetWidth + gap), behavior: matchMedia('(prefers-reduced-motion:reduce)').matches ? 'auto' : 'smooth' });
  }, []);

  // Auto-advance every 5s; pauses on hover/touch/focus/modal, never runs with reduced motion. Wraps to the start at the end.
  useEffect(() => {
    if (paused || open || matchMedia('(prefers-reduced-motion:reduce)').matches) return;
    const id = setInterval(() => {
      const el = scroller.current;
      if (!el) return;
      if (el.scrollLeft >= el.scrollWidth - el.clientWidth - 2) el.scrollTo({ left: 0, behavior: 'smooth' }); else step(1);
    }, AUTO_MS);
    return () => clearInterval(id);
  }, [paused, open, step]);

  // Mouse drag-to-scroll (touch and trackpad use native scrolling). Snap is switched off while dragging.
  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== 'mouse' || e.button !== 0) return;
    const el = e.currentTarget;
    drag.current = { active: true, moved: false, startX: e.clientX, startLeft: el.scrollLeft };
  };
  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const d = drag.current;
    if (!d.active) return;
    const dx = e.clientX - d.startX;
    if (!d.moved && Math.abs(dx) > 5) { d.moved = true; e.currentTarget.classList.add('is-dragging'); e.currentTarget.setPointerCapture(e.pointerId); }
    if (d.moved) e.currentTarget.scrollLeft = d.startLeft - dx;
  };
  const endDrag = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!drag.current.active) return;
    drag.current.active = false;
    e.currentTarget.classList.remove('is-dragging');
    if (drag.current.moved) setTimeout(() => { drag.current.moved = false; }, 0);
  };
  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.target !== e.currentTarget) return;
    if (e.key === 'ArrowRight') { e.preventDefault(); step(1); } else if (e.key === 'ArrowLeft') { e.preventDefault(); step(-1); }
  };

  return <div className="rv-carousel" data-start={edge.start} data-end={edge.end}
    onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)} onTouchStart={() => setPaused(true)} onFocus={() => setPaused(true)} onBlur={() => setPaused(false)}>
    <div className="rv-viewport">
      <div ref={scroller} className="rv-scroller" tabIndex={0} role="region" aria-roledescription="carousel" aria-label="Guest reviews (use the left and right arrow keys to scroll)"
        onScroll={update} onKeyDown={onKeyDown} onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={endDrag} onPointerCancel={endDrag} onPointerLeave={endDrag}
        onClickCapture={e => { if (drag.current.moved) { e.preventDefault(); e.stopPropagation(); } }}>
        {reviews.map((review, i) => <ReviewCard key={review.name} review={review} index={i} onOpen={setOpen} />)}
      </div>
    </div>
    <button type="button" className="rv-arrow rv-prev" aria-label="Previous review" disabled={edge.start} onClick={() => step(-1)}><svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M15 5l-7 7 7 7" /></svg></button>
    <button type="button" className="rv-arrow rv-next" aria-label="Next review" disabled={edge.end} onClick={() => step(1)}><svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M9 5l7 7-7 7" /></svg></button>
    <div className="rv-progress" role="progressbar" aria-label="Reviews scroll position" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(progress * 100)}><span style={{ width: `${Math.max(8, progress * 100)}%` }} /></div>
    {open && <ReviewModal review={open} onClose={close} />}
  </div>;
}
