'use client';
import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { StayMenuItem } from '@/lib/roomsMenu';

// Desktop "Our Stays" mega-menu: HOGS Panorama header + the four room cards. Opens on hover, click and keyboard focus (200ms fade/slide, short
// close delay); Esc closes and returns focus to the button; Arrow keys move between the cards; outside click and navigation close it.
export default function StaysMenu({ items, active }: { items: StayMenuItem[]; active: boolean }) {
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null); const button = useRef<HTMLButtonElement>(null); const panel = useRef<HTMLDivElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined); const hoverAt = useRef(0); const quiet = useRef(false); const pathname = usePathname();
  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    if (!open) return;
    const outside = (event: PointerEvent) => { if (!root.current?.contains(event.target as Node)) setOpen(false); };
    const key = (event: KeyboardEvent) => { if (event.key === 'Escape') { setOpen(false); quiet.current = true; button.current?.focus(); window.setTimeout(() => { quiet.current = false; }, 300); } };
    document.addEventListener('pointerdown', outside); document.addEventListener('keydown', key);
    return () => { document.removeEventListener('pointerdown', outside); document.removeEventListener('keydown', key); };
  }, [open]);
  const enter = () => { clearTimeout(timer.current); hoverAt.current = Date.now(); setOpen(true); };
  const leave = () => { clearTimeout(timer.current); timer.current = setTimeout(() => setOpen(false), 180); };
  const cards = () => Array.from(panel.current?.querySelectorAll<HTMLAnchorElement>('a.sm-card') ?? []);
  const onKey = (event: React.KeyboardEvent) => {
    const list = cards(); if (!list.length) return;
    const at = list.indexOf(document.activeElement as HTMLAnchorElement);
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') { event.preventDefault(); setOpen(true); (list[at < 0 ? 0 : (at + 1) % list.length]).focus(); }
    else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') { if (at >= 0) { event.preventDefault(); list[(at - 1 + list.length) % list.length].focus(); } }
    else if (event.key === 'Home' && at >= 0) { event.preventDefault(); list[0].focus(); }
    else if (event.key === 'End' && at >= 0) { event.preventDefault(); list[list.length - 1].focus(); }
  };
  return <div ref={root} className={`nav-menu nav-menu--stays${open ? ' is-open' : ''}`} onMouseEnter={enter} onMouseLeave={leave} onKeyDown={onKey}
    onBlur={event => { if (!root.current?.contains(event.relatedTarget as Node)) setOpen(false); }}>
    <button ref={button} type="button" className={`nav-menu-button${active ? ' is-active' : ''}`} aria-expanded={open} aria-controls="stays-menu" aria-haspopup="true"
      onFocus={() => { if (!quiet.current && button.current?.matches(':focus-visible')) setOpen(true); }}
      onClick={() => { if (Date.now() - hoverAt.current < 350 && open) return; setOpen(value => !value); }}>Our Stays <span className="nav-menu-caret" aria-hidden="true">▾</span></button>
    <div id="stays-menu" ref={panel} className="nav-menu-panel sm-panel" inert={!open} role="region" aria-label="HOGS Panorama rooms">
      <div className="sm-head"><p className="eyebrow">HOGS PANORAMA · MANALI</p><Link className="sm-explore" href="/stays/panorama">Explore the property <span aria-hidden="true">→</span></Link></div>
      <ul className="sm-grid">{items.map(item => <li key={item.id}><Link className="sm-card" href={item.href}>
        <span className="sm-thumb"><Image src={item.thumb} alt="" fill sizes="220px" placeholder="blur" blurDataURL={item.blur} />{item.photoSoon && <em>Photos soon</em>}</span>
        <span className="sm-name">{item.name}</span><span className="sm-guests">{item.guests}</span><span className="sm-tag">{item.tagline}</span>
      </Link></li>)}</ul>
    </div>
  </div>;
}
