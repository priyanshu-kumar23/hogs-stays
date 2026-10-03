'use client';
import { Children, useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
// Horizontal, scroll-snapping rail with previous / next buttons and a "01 / 05" counter. Native overflow scrolling (drag, touch, trackpad,
// keyboard once focused), so it never fights the home page's pinned GSAP sections or Lenis.
export default function Rail({ children, label }: { children: ReactNode; label: string }) {
  const track = useRef<HTMLDivElement>(null); const [index, setIndex] = useState(0); const [edge, setEdge] = useState({ start: true, end: false });
  const count = Children.count(children);
  const measure = useCallback(() => {
    const el = track.current; if (!el || !el.children.length) return;
    const first = el.children[0] as HTMLElement; const step = (el.children[1] as HTMLElement | undefined)?.offsetLeft ? (el.children[1] as HTMLElement).offsetLeft - first.offsetLeft : first.offsetWidth;
    setIndex(Math.min(count - 1, Math.max(0, Math.round(el.scrollLeft / (step || 1)))));
    setEdge({ start: el.scrollLeft < 4, end: el.scrollLeft + el.clientWidth >= el.scrollWidth - 4 });
  }, [count]);
  useEffect(() => { measure(); const el = track.current; if (!el) return; el.addEventListener('scroll', measure, { passive: true }); addEventListener('resize', measure); return () => { el.removeEventListener('scroll', measure); removeEventListener('resize', measure); }; }, [measure]);
  const go = (direction: number) => { const el = track.current; if (!el) return; const first = el.children[0] as HTMLElement; const second = el.children[1] as HTMLElement | undefined; const step = second ? second.offsetLeft - first.offsetLeft : first.offsetWidth; el.scrollBy({ left: direction * step, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' }); };
  return <div className="pk-rail">
    <div className="pk-rail-track" ref={track} tabIndex={0} role="group" aria-roledescription="carousel" aria-label={label}>{children}</div>
    <div className="pk-rail-controls">
      <button type="button" className="icon-button" aria-label="Previous journeys" disabled={edge.start} onClick={() => go(-1)}><span aria-hidden="true">←</span></button>
      <span className="pk-rail-count" aria-live="polite">{String(index + 1).padStart(2, '0')} / {String(count).padStart(2, '0')}</span>
      <button type="button" className="icon-button" aria-label="Next journeys" disabled={edge.end} onClick={() => go(1)}><span aria-hidden="true">→</span></button>
    </div>
  </div>;
}
