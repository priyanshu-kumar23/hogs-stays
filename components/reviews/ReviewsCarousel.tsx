'use client';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { Review } from '@/data/reviews';
import ReviewCard from './ReviewCard';
import ReviewModal from './ReviewModal';

// Endless "train" of review cards: the list is rendered twice in a flex track and a CSS keyframe slides the track by exactly one copy (-50%),
// so the loop point is invisible. Speed is constant in px/second: the duration is measured from the real track width.
function MarqueeRow({ reviews, speed, reverse = false, hideOnMobile = false, onOpen, paused }: { reviews: Review[]; speed: number; reverse?: boolean; hideOnMobile?: boolean; onOpen: (review: Review) => void; paused: boolean }) {
  const track = useRef<HTMLDivElement>(null);
  const firstSet = useRef<HTMLDivElement>(null);
  const drag = useRef({ active: false, moved: false, startX: 0, startTime: 0 });
  const [duration, setDuration] = useState(0);
  const [held, setHeld] = useState(false); // touch-and-hold pauses

  useEffect(() => {
    const set = firstSet.current;
    if (!set) return;
    const measure = () => { if (set.offsetWidth > 0) setDuration(set.offsetWidth / speed); };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(set);
    return () => observer.disconnect();
  }, [speed, reviews.length]);

  const reducedMotion = () => matchMedia('(prefers-reduced-motion:reduce)').matches;
  // Desktop drag-to-scrub: move the running CSS animation's clock, then let it carry on from there.
  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === 'touch') { setHeld(true); return; }
    if (e.pointerType !== 'mouse' || e.button !== 0 || reducedMotion()) return;
    const anim = track.current?.getAnimations()[0];
    drag.current = { active: true, moved: false, startX: e.clientX, startTime: Number(anim?.currentTime ?? 0) };
  };
  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const d = drag.current;
    if (!d.active) return;
    const dx = e.clientX - d.startX;
    if (!d.moved && Math.abs(dx) > 5) { d.moved = true; e.currentTarget.classList.add('is-dragging'); e.currentTarget.setPointerCapture(e.pointerId); }
    const anim = track.current?.getAnimations()[0];
    if (d.moved && anim && duration) {
      const total = duration * 1000;
      const next = d.startTime + (reverse ? 1 : -1) * (dx / speed) * 1000;
      anim.currentTime = ((next % total) + total) % total;
    }
  };
  const endPointer = (e: React.PointerEvent<HTMLDivElement>) => {
    setHeld(false);
    if (!drag.current.active) return;
    drag.current.active = false;
    e.currentTarget.classList.remove('is-dragging');
    if (drag.current.moved) setTimeout(() => { drag.current.moved = false; }, 0); // swallow the click that ends a drag
  };

  const cards = (hidden: boolean) => reviews.map((review, i) => <ReviewCard key={review.name} review={review} index={i} onOpen={onOpen} hidden={hidden} />);
  return <div className={`rv-row${hideOnMobile ? ' rv-row-2' : ''}${paused || held ? ' is-paused' : ''}${duration ? ' is-running' : ''}`} aria-hidden={hideOnMobile || undefined}
    onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={endPointer} onPointerCancel={endPointer} onPointerLeave={endPointer}
    onClickCapture={e => { if (drag.current.moved) { e.preventDefault(); e.stopPropagation(); } }}>
    <div ref={track} className={`rv-track${reverse ? ' is-reverse' : ''}`} style={duration ? { animationDuration: `${duration}s` } : undefined}>
      <div ref={firstSet} className="rv-set" role="list" aria-label={hideOnMobile ? undefined : 'Guest reviews'}>{cards(hideOnMobile)}</div>
      <div className="rv-set" aria-hidden="true">{cards(true)}</div>
    </div>
  </div>;
}

export default function ReviewsCarousel({ reviews }: { reviews: Review[] }) {
  const [open, setOpen] = useState<Review | null>(null);
  const close = useCallback(() => setOpen(null), []);
  // Second row (desktop only) runs the other way, slower, in a different order.
  const second = useMemo(() => { const half = Math.ceil(reviews.length / 2); return [...reviews.slice(half), ...reviews.slice(0, half)].reverse(); }, [reviews]);
  return <div className="rv-marquee">
    <MarqueeRow reviews={reviews} speed={50} onOpen={setOpen} paused={open !== null} />
    <MarqueeRow reviews={second} speed={40} reverse hideOnMobile onOpen={setOpen} paused={open !== null} />
    {open && <ReviewModal review={open} onClose={close} />}
  </div>;
}
