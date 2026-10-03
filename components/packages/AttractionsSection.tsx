'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import type { PackageImageCredit } from '@/lib/packageImages.generated';
// The drawer is only needed once someone opens a place, so it is split out and loaded on demand (keeps the page and the home page light).
const AttractionDrawer = dynamic(() => import('./AttractionDrawer'), { ssr: false });
export type PlaceCard = { slug: string; name: string; type: string; line: string; description: string; doBullets: string[]; season: string; tip: string; image: { src: string; alt: string; caption: string; position: string; blur: string; credit?: PackageImageCredit }; days: { n: number; title: string }[] };
export type ActivityChip = { slug: string; label: string; note?: string; tag?: string; days: number[] };

// Cards shown per breakpoint while collapsed, and how many each "Load more" adds: desktop >=1024px, tablet 768-1023px, mobile <768px.
// Visibility is driven by CSS classes (hd / ht / hm, see app/package-extras.css) computed from the same state on server and client, so the
// first paint already matches the viewport: no hydration mismatch, no flicker, no count decided in an effect.
const STEP = { d: 8, t: 6, m: 4 } as const;
type Bp = keyof typeof STEP;
const BPS = Object.keys(STEP) as Bp[];
const currentBp = (): Bp => matchMedia('(min-width: 1024px)').matches ? 'd' : matchMedia('(min-width: 768px)').matches ? 't' : 'm';
const dayBadge = (days: { n: number }[]) => `${days.slice(0, 2).map(day => `Day ${day.n}`).join(' · ')}${days.length > 2 ? ` +${days.length - 2}` : ''}`;

// Card photo. Native lazy loading can leave a card stuck on its blur placeholder (images in a clipped, hidden or off-screen container never
// intersect), so once the section is near the viewport the parent switches every card to eager. The ref/onLoad pair also clears the blur for
// an image that finished loading before React attached its load handler (cached reloads).
function CardImage({ image, preload }: { image: PlaceCard['image']; preload: boolean }) {
  const settle = useCallback((img: HTMLImageElement | null) => { if (img && img.complete && img.naturalWidth > 0) img.style.backgroundImage = 'none'; }, []);
  return <Image ref={settle} onLoad={event => settle(event.currentTarget)} src={image.src} alt="" fill loading={preload ? 'eager' : 'lazy'} sizes="(max-width: 767px) 50vw, (max-width: 1023px) 33vw, (max-width: 1500px) 22vw, 340px" style={{ objectPosition: image.position }} placeholder="blur" blurDataURL={image.blur} />;
}

export default function AttractionsSection({ places, activities, types, eyebrow, heading, intro }: { places: PlaceCard[]; activities: ActivityChip[]; types: string[]; eyebrow: string; heading: [string, string, string]; intro: string }) {
  const [filter, setFilter] = useState('all'); const [batches, setBatches] = useState(0); const [open, setOpen] = useState<string | null>(null); const [preload, setPreload] = useState(false);
  const section = useRef<HTMLElement>(null);
  const openRef = useRef<string | null>(null); const trigger = useRef<HTMLElement | null>(null); const pending = useRef<string | null>(null);
  const filtered = places.filter(place => filter === 'all' || place.type === filter); const total = filtered.length;
  const count = (bp: Bp) => STEP[bp] * (1 + batches);
  const current = places.find(place => place.slug === open) ?? null;

  useEffect(() => {
    const el = section.current; if (!el || !('IntersectionObserver' in window)) { setPreload(true); return; }
    const observer = new IntersectionObserver(entries => { if (entries.some(entry => entry.isIntersecting)) { setPreload(true); observer.disconnect(); } }, { rootMargin: '900px 0px' });
    observer.observe(el); return () => observer.disconnect();
  }, []);
  const scrollTo = (id: string) => { const el = document.getElementById(id); if (el) el.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' }); };
  const toggleMore = () => {
    if (count(currentBp()) >= total) { setBatches(0); requestAnimationFrame(() => scrollTo('attractions')); } else setBatches(value => value + 1);
  };
  const finish = useCallback(() => {
    openRef.current = null; setOpen(null);
    const target = pending.current; pending.current = null;
    if (target) requestAnimationFrame(() => scrollTo(target)); else if (trigger.current?.isConnected) trigger.current.focus();
  }, []);
  // Back-button safe: opening pushes a history entry, so Back closes the drawer instead of leaving the page.
  const openPlace = useCallback((slug: string, from?: HTMLElement | null) => {
    if (openRef.current) return;
    trigger.current = from ?? (document.activeElement as HTMLElement | null); openRef.current = slug;
    try { history.pushState({ ...history.state, pkPlace: slug }, ''); } catch { /* history unavailable: the drawer still works */ }
    setOpen(slug);
  }, []);
  const closePlace = useCallback(() => { if (history.state?.pkPlace) history.back(); else finish(); }, [finish]);
  useEffect(() => {
    const onPop = () => { if (openRef.current && !history.state?.pkPlace) finish(); };
    const onPlace = (event: Event) => { const detail = (event as CustomEvent<{ slug: string; trigger?: HTMLElement }>).detail; if (places.some(place => place.slug === detail.slug)) openPlace(detail.slug, detail.trigger); };
    addEventListener('popstate', onPop); addEventListener('hogs:place', onPlace);
    return () => { removeEventListener('popstate', onPop); removeEventListener('hogs:place', onPlace); };
  }, [finish, openPlace, places]);
  const goTo = (id: string) => { pending.current = id; closePlace(); };

  // Per-breakpoint helpers: "hidden at this breakpoint" (h*), "newly revealed here" (n*, animated), "nothing more to load here" (x*).
  const itemClass = (index: number) => BPS.map(bp => { const shown = count(bp); return `${index >= shown ? `h${bp}` : ''} ${batches > 0 && index < shown && index >= shown - STEP[bp] ? `n${bp}` : ''}`; }).join(' ').replace(/\s+/g, ' ').trim();
  const itemStyle = (index: number) => Object.fromEntries(BPS.map(bp => [`--d${bp}`, `${Math.max(0, index - (count(bp) - STEP[bp])) * 45}ms`]));
  const moreClass = BPS.filter(bp => total <= STEP[bp]).map(bp => `x${bp}`).join(' ');
  const label = (bp: Bp) => count(bp) >= total ? <>Show fewer <span aria-hidden="true">↑</span></> : <>Load more places <span aria-hidden="true">→</span></>;
  const status = (bp: Bp) => `Showing ${Math.min(count(bp), total)} of ${total}`;

  return <section id="attractions" ref={section} className="pk-att" aria-labelledby="pk-att-title">
    <div className="section-topline"><p className="eyebrow">{eyebrow}</p><span className="section-index" aria-live="polite">{filter === 'all' ? `${places.length} places` : `${filtered.length} of ${places.length} places`} · {activities.length} experiences</span></div>
    <div className="pk-att-head" data-reveal><h2 id="pk-att-title">{heading[0]} <em>{heading[1]}</em> {heading[2]}</h2><p>{intro}</p></div>
    {types.length > 1 && <div className="pk-filter-chips pk-att-filters" role="group" aria-label="Filter places by type">{['all', ...types].map(type => <button key={type} type="button" className="pk-chip-btn" aria-pressed={filter === type} onClick={() => { setFilter(type); setBatches(0); }}>{type === 'all' ? 'All' : type}</button>)}</div>}
    <ul className="pk-att-grid">
      {filtered.map((place, index) => <li key={place.slug} className={itemClass(index)} style={itemStyle(index)}>
        <button type="button" className="pk-att-card" aria-haspopup="dialog" onClick={event => openPlace(place.slug, event.currentTarget)}>
          <span className="pk-att-img"><CardImage image={place.image} preload={preload} /><span className="pk-badge">{dayBadge(place.days)}</span><span className="pk-att-view" aria-hidden="true">View details ↗</span></span>
          <span className="pk-att-type eyebrow">{place.type}</span>
          <span className="pk-att-name">{place.name}</span>
          <span className="pk-att-line">{place.line}</span>
        </button>
      </li>)}
    </ul>
    <div className={`pk-att-more ${moreClass}`}>
      <button type="button" className="pk-btn" onClick={toggleMore}><span className="bd">{label('d')}</span><span className="bt">{label('t')}</span><span className="bm">{label('m')}</span></button>
      <p className="pk-att-count" aria-live="polite"><span className="bd">{status('d')}</span><span className="bt">{status('t')}</span><span className="bm">{status('m')}</span></p>
    </div>
    {activities.length > 0 && <div className="pk-acts-wrap">
      <p className="eyebrow">WHILE YOU’RE THERE</p>
      <ul className="pk-acts">{activities.map(activity => <li key={activity.slug} className="pk-act" title={activity.note}><span className="pk-act-label">{activity.label}</span>{activity.tag && <span className="pk-act-tag">{activity.tag}</span>}<span className="pk-act-days">{activity.days.map(n => <a key={n} href={`#day-${n}`}>Day {n}</a>)}</span></li>)}</ul>
    </div>}
    {current && <AttractionDrawer place={current} onClose={closePlace} onGoTo={goTo} />}
  </section>;
}
