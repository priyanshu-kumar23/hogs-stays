'use client';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Icon from './Icon';
import { motion, useReducedMotion } from 'framer-motion';
import { navLinks } from '@/lib/content';
import { packageMeta } from '@/lib/packageMeta';
import PackagesMenu from './PackagesMenu';
import { openBooking } from '@/components/booking/BookButton';
// /stays/panorama belongs to "Our Stays"; /cafe and /book highlight their own entry (or none).
const isActive = (pathname:string, href:string) => pathname === href || pathname.startsWith(`${href}/`) || (href === '/stays' && pathname === '/cafe');
export default function Navigation() {
  const reduced=useReducedMotion(); const pathname=usePathname();
  const [paper,setPaper]=useState(false);const [scrolled,setScrolled]=useState(false);
  const [pkOpen, setPkOpen] = useState(false); const [hidden, setHidden] = useState(false); const [open, setOpen] = useState(false); const dialog = useRef<HTMLDialogElement>(null); const menu = useRef<HTMLButtonElement>(null);
  useEffect(() => { let last = window.scrollY; const scroll = () => { setHidden(window.scrollY > last && window.scrollY > 120); last = window.scrollY; setScrolled(window.scrollY>24);setPaper(['manifesto','features'].some(id=>{const el=document.getElementById(id);if(!el)return false;const r=el.getBoundingClientRect();return r.top<90&&r.bottom>90;})); }; scroll(); addEventListener('scroll',scroll,{ passive:true }); return () => removeEventListener('scroll',scroll); }, [pathname]);
  useEffect(() => { document.body.style.overflow = open ? 'hidden' : ''; return () => { document.body.style.overflow = ''; }; }, [open]);
  // Any navigation closes the full-screen menu and reveals the bar again.
  useEffect(() => { if (dialog.current?.open) dialog.current.close(); setOpen(false); setHidden(false); }, [pathname]);
  const close = () => { dialog.current?.close(); setOpen(false); menu.current?.focus(); };
  const current = (href:string) => isActive(pathname, href) ? 'page' as const : undefined;
  const bookSlug = pathname.match(/^\/packages\/([^/]+)\/?$/)?.[1];
  const mobileLinks: { title: string; href: string; menu?: boolean }[] = [...navLinks, { title: 'Packages', href: '/packages', menu: true }, { title: 'Book Your Stay', href: '/book' }];
  return <><a className="skip-link" href="#main">Skip to content</a><motion.header className={paper?'navbar on-paper':scrolled?'navbar is-scrolled':'navbar'} animate={{y:hidden&&!open?'-110%':'0%'}} transition={{duration:reduced?0:.45,ease:'easeInOut'}}><Link className="brand" href="/" aria-label="HOGS home">HOGS<span>OF HIMALAYAN HOMES</span></Link><nav className="desktop-nav" aria-label="Main navigation">{navLinks.map(({title,href})=><Link key={href} href={href} aria-current={current(href)} className={isActive(pathname,href)?'is-active':undefined}>{title}</Link>)}<PackagesMenu active={isActive(pathname,'/packages')} /></nav><Link className={`button nav-book${pathname==='/book'?' is-active':''}`} href={bookSlug?`/packages/${bookSlug}#book`:'/book'} aria-current={current('/book')} onClick={bookSlug?event=>{event.preventDefault();openBooking(event.currentTarget);}:undefined}>Book Now <Icon /></Link><button ref={menu} className="menu-toggle" aria-label="Open navigation" aria-expanded={open} onClick={()=>{ dialog.current?.showModal(); setOpen(true); }}>☰</button></motion.header><dialog data-lenis-prevent ref={dialog} className="mobile-menu" onCancel={close}><button className="icon-button menu-close" onClick={close} aria-label="Close navigation"><Icon name="close" /></button><span className="eyebrow">A little closer to the mountains</span><nav aria-label="Mobile navigation">{mobileLinks.map(({title,href,menu},index)=><motion.div key={href} initial={false} animate={{opacity:open?1:0,x:open?0:20}} transition={{duration:reduced?0:.5,delay:open?index*.07:0}}>{menu?<div className="mobile-accordion"><button type="button" className={isActive(pathname,href)?'is-active':undefined} aria-expanded={pkOpen} aria-controls="mobile-packages" onClick={()=>setPkOpen(value=>!value)}>{title}<span aria-hidden="true">{pkOpen?'−':'+'}</span></button><ul id="mobile-packages" hidden={!pkOpen}>{packageMeta.map(item=><li key={item.slug}><Link href={`/packages/${item.slug}`} onClick={close} aria-current={pathname===`/packages/${item.slug}`?'page':undefined}>{item.name}<span>{item.nights}N / {item.days}D · {item.tagline}</span></Link></li>)}<li><Link href="/packages" onClick={close}>View all packages →</Link></li></ul></div>:<Link href={href} onClick={close} aria-current={current(href)} className={isActive(pathname,href)?'is-active':undefined}>{title}</Link>}</motion.div>)}</nav></dialog></>;
}
