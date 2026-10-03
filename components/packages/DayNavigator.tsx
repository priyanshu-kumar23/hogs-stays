'use client';
import { useEffect, useRef, useState } from 'react';
// Sticky day navigator: a vertical list on desktop, a horizontal pill bar on phones (layout is CSS). It highlights the day in view,
// and keeps the sticky offsets (--pk-top on .pk-layout) just below the site navbar, which slides away while scrolling down.
export default function DayNavigator({ days }: { days: { n: number; title: string }[] }) {
  const root = useRef<HTMLElement>(null); const [active, setActive] = useState(1); const [done, setDone] = useState(false);
  useEffect(() => {
    const sections = days.map(day => document.getElementById(`day-${day.n}`)).filter((el): el is HTMLElement => Boolean(el));
    const observer = new IntersectionObserver(entries => { const visible = entries.filter(entry => entry.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0]; if (visible) setActive(Number(visible.target.id.replace('day-', ''))); }, { rootMargin: '-30% 0px -60% 0px' });
    sections.forEach(section => observer.observe(section));
    return () => observer.disconnect();
  }, [days]);
  // Fade the navigator out once the itinerary has scrolled past (the sections below are not part of the days).
  useEffect(() => {
    const itinerary = document.querySelector('.pk-itinerary'); if (!itinerary) return;
    const observer = new IntersectionObserver(([entry]) => setDone(!entry.isIntersecting && entry.boundingClientRect.top < 0), { threshold: 0, rootMargin: '-150px 0px 0px 0px' });
    observer.observe(itinerary); return () => observer.disconnect();
  }, []);
  useEffect(() => {
    const layout = root.current?.closest<HTMLElement>('.pk-layout'); if (!layout) return;
    let frame = 0; let until = 0;
    const apply = () => { const bar = document.querySelector('.navbar'); layout.style.setProperty('--pk-top', `${Math.max(0, Math.round(bar ? bar.getBoundingClientRect().bottom : 0))}px`); if (performance.now() < until) frame = requestAnimationFrame(apply); };
    const onScroll = () => { until = performance.now() + 700; cancelAnimationFrame(frame); frame = requestAnimationFrame(apply); };
    apply(); addEventListener('scroll', onScroll, { passive: true });
    return () => { cancelAnimationFrame(frame); removeEventListener('scroll', onScroll); };
  }, []);
  useEffect(() => { const pill = root.current?.querySelector<HTMLElement>('[aria-current="true"]'); const list = pill?.parentElement?.parentElement; if (pill && list && list.scrollWidth > list.clientWidth) list.scrollTo({ left: pill.offsetLeft - list.clientWidth / 2 + pill.offsetWidth / 2, behavior: 'smooth' }); }, [active]);
  return <nav ref={root} className={`pk-daynav${done ? ' is-done' : ''}`} aria-label="Itinerary days">
    <p className="eyebrow pk-daynav-title">THE DAYS</p>
    <ol>{days.map(day => <li key={day.n}><a href={`#day-${day.n}`} aria-current={active === day.n ? 'true' : undefined} title={day.title}><span>Day</span> {String(day.n).padStart(2, '0')}</a></li>)}</ol>
  </nav>;
}
