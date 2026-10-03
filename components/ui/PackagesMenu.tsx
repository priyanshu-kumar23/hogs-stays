'use client';
import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { packageMeta } from '@/lib/packageMeta';
// Desktop "Packages" mega-menu. Opens on hover and on click/Enter/Space, closes on Esc (focus returns to the button), on outside click,
// when focus leaves, and on navigation. It has its own dark panel so it reads the same over the transparent hero nav and the scrolled nav.
export default function PackagesMenu({ active }: { active: boolean }) {
  const [open, setOpen] = useState(false); const [preview, setPreview] = useState(0); const root = useRef<HTMLDivElement>(null); const button = useRef<HTMLButtonElement>(null);
  const hoverAt = useRef(0); const timer = useRef<ReturnType<typeof setTimeout>>(undefined); const pathname = usePathname();
  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    if (!open) return;
    const outside = (event: PointerEvent) => { if (!root.current?.contains(event.target as Node)) setOpen(false); };
    const key = (event: KeyboardEvent) => { if (event.key === 'Escape') { setOpen(false); button.current?.focus(); } };
    document.addEventListener('pointerdown', outside); document.addEventListener('keydown', key);
    return () => { document.removeEventListener('pointerdown', outside); document.removeEventListener('keydown', key); };
  }, [open]);
  const enter = () => { clearTimeout(timer.current); hoverAt.current = Date.now(); setOpen(true); };
  const leave = () => { clearTimeout(timer.current); timer.current = setTimeout(() => setOpen(false), 160); };
  return <div ref={root} className={`nav-menu${open ? ' is-open' : ''}`} onMouseEnter={enter} onMouseLeave={leave} onBlur={event => { if (!root.current?.contains(event.relatedTarget as Node)) setOpen(false); }}>
    <button ref={button} type="button" className={`nav-menu-button${active ? ' is-active' : ''}`} aria-expanded={open} aria-controls="packages-menu" onClick={() => { if (Date.now() - hoverAt.current < 350 && open) return; setOpen(value => !value); }}>Packages <span className="nav-menu-caret" aria-hidden="true">▾</span></button>
    <div id="packages-menu" className="nav-menu-panel" hidden={!open}>
      <ul>{packageMeta.map((item, index) => <li key={item.slug}><Link href={`/packages/${item.slug}`} onFocus={() => setPreview(index)} onMouseEnter={() => setPreview(index)}><span className="nav-menu-title">{item.name}</span><span className="nav-menu-meta">{item.nights}N / {item.days}D</span><span className="nav-menu-tag">{item.tagline}</span></Link></li>)}</ul>
      <div className="nav-menu-side"><div className="nav-menu-photo" aria-hidden="true">{open && <Image src={packageMeta[preview].preview} alt="" fill sizes="260px" />}</div><Link className="nav-menu-all" href="/packages">View all packages <span aria-hidden="true">→</span></Link></div>
    </div>
  </div>;
}
