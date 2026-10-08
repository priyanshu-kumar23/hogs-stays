'use client';
import { useEffect, useRef, useState } from 'react';

export type TocItem = { id: string; title: string };

// Table of contents with scroll-spy. Desktop: a sticky list beside the text. Mobile: a collapsible "On this page" dropdown above it.
//
// Which item is current: the last heading that has scrolled up under the sticky header. Refinements:
//  - the LAST item is current as soon as it is well on screen (it sits above the contact card and footer, so the page bottom is far away), and
//    always at the very bottom of the page;
//  - side-by-side cards (house rules) share a row: take the one that was navigated to, else the first;
//  - after a TOC click the clicked item stays current until the reader scrolls away (short sections would otherwise let the next heading win).
// A clicked heading lands just below the sticky header: html has scroll-padding-top:100px and the sections add a small scroll-margin-top.
export default function PolicyToc({ items, label = 'On this page' }: { items: TocItem[]; label?: string }) {
  const [active, setActive] = useState(items[0]?.id ?? '');
  const [open, setOpen] = useState(false);
  const lock = useRef<{ id: string; at: number; y: number } | null>(null);
  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const line = 190; // a heading counts once it is under the sticky header (anchored headings land at ~112px)
      const y = window.scrollY;
      // Keep a clicked item current while the page settles on it and until the reader scrolls a little away.
      const held = lock.current;
      if (held) {
        if (Date.now() - held.at < 1200) { held.y = y; setActive(held.id); return; }
        if (Math.abs(y - held.y) < 80) { setActive(held.id); return; }
        lock.current = null;
      }
      const above = items.map(item => ({ id: item.id, top: document.getElementById(item.id)?.getBoundingClientRect().top ?? Infinity })).filter(entry => entry.top <= line);
      const rowTop = Math.max(...above.map(entry => entry.top), -Infinity);
      const row = above.filter(entry => Math.abs(entry.top - rowTop) < 4);
      const hash = decodeURIComponent(location.hash.slice(1));
      let current = row.find(entry => entry.id === hash)?.id ?? row[0]?.id ?? items[0]?.id ?? '';
      // The last section is current as soon as it is well on screen (it sits above the contact card and footer, so the page bottom is far away).
      const lastEl = document.getElementById(items[items.length - 1]?.id ?? '');
      if (lastEl) { const r = lastEl.getBoundingClientRect(); if (r.top < window.innerHeight * 0.85 && r.bottom > 0) current = items[items.length - 1].id; }
      if (window.innerHeight + y >= document.documentElement.scrollHeight - 4 && items.length) current = items[items.length - 1].id;
      setActive(current);
    };
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(update); };
    update(); addEventListener('scroll', onScroll, { passive: true }); addEventListener('resize', onScroll);
    // Opening a page at /page#section highlights that section too.
    const hashId = decodeURIComponent(location.hash.slice(1));
    if (hashId && items.some(item => item.id === hashId)) lock.current = { id: hashId, at: Date.now(), y: window.scrollY };
    const settle = window.setTimeout(update, 1300);
    return () => { removeEventListener('scroll', onScroll); removeEventListener('resize', onScroll); window.clearTimeout(settle); if (frame) cancelAnimationFrame(frame); };
  }, [items]);
  const choose = (id: string) => { lock.current = { id, at: Date.now(), y: window.scrollY }; setActive(id); setOpen(false); };
  const current = items.find(item => item.id === active);
  return <nav className="pl-toc" aria-label={label}>
    <button type="button" className="pl-toc-toggle" aria-expanded={open} aria-controls="pl-toc-list" onClick={() => setOpen(value => !value)}>
      <span>{label}</span><em>{current?.title}</em><span className="pl-toc-caret" aria-hidden="true">▾</span>
    </button>
    <ol id="pl-toc-list" className={open ? 'is-open' : undefined}>
      {items.map((item, index) => <li key={item.id}><a href={`#${item.id}`} aria-current={item.id === active ? 'location' : undefined} className={item.id === active ? 'is-active' : undefined} onClick={() => choose(item.id)}><span>{String(index + 1).padStart(2, '0')}</span>{item.title}</a></li>)}
    </ol>
  </nav>;
}
