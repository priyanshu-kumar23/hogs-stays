'use client';
import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Icon from './Icon';
import { LazyMotion, m, useReducedMotion } from 'framer-motion';
import { SITE, navLinks, panoramaBookingUrl } from '@/lib/content';
import { packageMeta } from '@/lib/packageMeta';
import type { StayMenuItem } from '@/lib/roomsMenu';
import PackagesMenu from './PackagesMenu';
import StaysMenu from './StaysMenu';

// Order: Our Stays (mega-menu) · Cafe · Packages (mega-menu) · Gallery · Features · About Us · BOOK NOW (Aiosell, new tab).
// framer-motion's animation features load after first paint, so they are not part of the shared bundle.
const loadMotionFeatures = () => import('@/lib/motionFeatures').then(module => module.default);
const isActive = (pathname: string, href: string) => pathname === href || pathname.startsWith(`${href}/`);
export default function Navigation({ stays }: { stays: StayMenuItem[] }) {
  const reduced = useReducedMotion(); const pathname = usePathname();
  const [paper, setPaper] = useState(false); const [scrolled, setScrolled] = useState(false);
  const [pkOpen, setPkOpen] = useState(false); const [stOpen, setStOpen] = useState(false);
  const [hidden, setHidden] = useState(false); const [open, setOpen] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null); const menu = useRef<HTMLButtonElement>(null);
  useEffect(() => { let last = window.scrollY; const scroll = () => { setHidden(window.scrollY > last && window.scrollY > 120); last = window.scrollY; setScrolled(window.scrollY > 24); setPaper(['manifesto', 'features'].some(id => { const el = document.getElementById(id); if (!el) return false; const r = el.getBoundingClientRect(); return r.top < 90 && r.bottom > 90; })); }; scroll(); addEventListener('scroll', scroll, { passive: true }); return () => removeEventListener('scroll', scroll); }, [pathname]);
  useEffect(() => { document.body.style.overflow = open ? 'hidden' : ''; return () => { document.body.style.overflow = ''; }; }, [open]);
  // Any navigation closes the full-screen menu and reveals the bar again.
  useEffect(() => { if (dialog.current?.open) dialog.current.close(); setOpen(false); setHidden(false); }, [pathname]);
  const close = () => { dialog.current?.close(); setOpen(false); menu.current?.focus(); };
  const current = (href: string) => isActive(pathname, href) ? 'page' as const : undefined;
  const flat = (href: string) => navLinks.find(link => link.href === href)!;
  const simple = (href: string, title: string, mobile = false) => <Link key={href} href={href} aria-current={current(href)} className={isActive(pathname, href) ? 'is-active' : undefined} onClick={mobile ? close : undefined}>{title}</Link>;
  const mobileItems: { key: string; node: React.ReactNode }[] = [
    { key: 'stays', node: <div className="mobile-accordion"><button type="button" className={isActive(pathname, '/stays') ? 'is-active' : undefined} aria-expanded={stOpen} aria-controls="mobile-stays" onClick={() => setStOpen(value => !value)}>Our Stays<span aria-hidden="true">{stOpen ? '−' : '+'}</span></button>
      <ul id="mobile-stays" hidden={!stOpen}>
        <li><Link href="/stays/panorama" onClick={close} aria-current={pathname === '/stays/panorama' ? 'page' : undefined}>HOGS Panorama<span>Explore the property →</span></Link></li>
        {stays.map(item => <li key={item.id} className="mobile-room"><Link href={item.href} onClick={close} aria-current={pathname === item.href ? 'page' : undefined}><span className="mobile-room-thumb"><Image src={item.thumb} alt="" fill sizes="64px" placeholder="blur" blurDataURL={item.blur} /></span><span><b>{item.name}</b><span>{item.guests}</span></span></Link></li>)}
      </ul></div> },
    { key: 'cafe', node: simple('/cafe', 'Cafe', true) },
    { key: 'packages', node: <div className="mobile-accordion"><button type="button" className={isActive(pathname, '/packages') ? 'is-active' : undefined} aria-expanded={pkOpen} aria-controls="mobile-packages" onClick={() => setPkOpen(value => !value)}>Packages<span aria-hidden="true">{pkOpen ? '−' : '+'}</span></button><ul id="mobile-packages" hidden={!pkOpen}>{packageMeta.map(item => <li key={item.slug}><Link href={`/packages/${item.slug}`} onClick={close} aria-current={pathname === `/packages/${item.slug}` ? 'page' : undefined}>{item.name}<span>{item.nights}N / {item.days}D · {item.tagline}</span></Link></li>)}<li><Link href="/packages" onClick={close}>View all packages →</Link></li></ul></div> },
    { key: 'gallery', node: simple('/gallery', 'Gallery', true) },
    { key: 'features', node: simple('/features', 'Features', true) },
    { key: 'about', node: simple('/about', 'About Us', true) },
    { key: 'book', node: <a href={panoramaBookingUrl} target="_blank" rel="noopener noreferrer" onClick={close}>Book Your Stay</a> },
  ];
  return <LazyMotion features={loadMotionFeatures}><a className="skip-link" href="#main">Skip to content</a>
    <m.header className={paper ? 'navbar on-paper' : scrolled ? 'navbar is-scrolled' : 'navbar'} animate={{ y: hidden && !open ? '-110%' : '0%' }} transition={{ duration: reduced ? 0 : .45, ease: 'easeInOut' }}>
      <Link className="brand" href="/" prefetch={false}><Image className="brand-logo" src={SITE.logo.src} alt={SITE.logo.alt} width={SITE.logo.width} height={SITE.logo.height} priority unoptimized /></Link>
      <nav className="desktop-nav" aria-label="Main navigation">
        <StaysMenu items={stays} active={isActive(pathname, '/stays')} />
        {simple('/cafe', 'Cafe')}
        <PackagesMenu active={isActive(pathname, '/packages')} />
        {simple(flat('/gallery').href, flat('/gallery').title)}{simple(flat('/features').href, flat('/features').title)}{simple(flat('/about').href, flat('/about').title)}
      </nav>
      <a className="button nav-book" href={panoramaBookingUrl} target="_blank" rel="noopener noreferrer" aria-label="Book now: HOGS Panorama, opens the secure booking site in a new tab">Book Now <Icon /></a>
      <button ref={menu} className="menu-toggle" aria-label="Open navigation" aria-expanded={open} onClick={() => { dialog.current?.showModal(); setOpen(true); }}>☰</button>
    </m.header>
    <dialog data-lenis-prevent ref={dialog} className="mobile-menu" onCancel={close}>
      <button className="icon-button menu-close" onClick={close} aria-label="Close navigation"><Icon name="close" /></button>
      <span className="eyebrow">A little closer to the mountains</span>
      <nav aria-label="Mobile navigation">{mobileItems.map(({ key, node }, index) => <m.div key={key} initial={false} animate={{ opacity: open ? 1 : 0, x: open ? 0 : 20 }} transition={{ duration: reduced ? 0 : .5, delay: open ? index * .07 : 0 }}>{node}</m.div>)}</nav>
    </dialog></LazyMotion>;
}
