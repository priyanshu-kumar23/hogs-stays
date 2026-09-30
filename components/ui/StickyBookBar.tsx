'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
// Mobile-only sticky CTA (see .sticky-book-bar, hidden ≥701px) that appears once the
// visitor has scrolled past the hero, since BOOK NOW is removed from the mobile navbar.
export default function StickyBookBar() {
  const [visible, setVisible] = useState(false); const pathname = usePathname();
  useEffect(() => {
    setVisible(false);
    const hero = document.getElementById('home');
    if (hero) { const observer = new IntersectionObserver(([entry]) => setVisible(!entry.isIntersecting), { rootMargin: '0px' }); observer.observe(hero); return () => observer.disconnect(); }
    const scroll = () => setVisible(window.scrollY > 420); scroll(); addEventListener('scroll', scroll, { passive: true }); return () => removeEventListener('scroll', scroll);
  }, [pathname]);
  if (pathname === '/book') return null;
  return <Link href="/book" className={`sticky-book-bar${visible ? ' is-visible' : ''}`} aria-hidden={!visible} tabIndex={visible ? 0 : -1}>Book Now <span aria-hidden="true">↗</span></Link>;
}
