'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Icon from './Icon';
import { content } from '@/lib/content';
import { openBooking } from '@/components/booking/BookButton';
// Mobile-only sticky CTA (see .sticky-book-bar, hidden ≥701px) that appears once the visitor has scrolled past the hero, since BOOK NOW is
// removed from the mobile navbar. On a journey page (/packages/<slug>) Book Now opens that journey's "Request to book" sheet instead of
// the general booking page. It also carries the WhatsApp button, so the floating chat bubble is hidden while this bar is showing.
export default function StickyBookBar() {
  const [visible, setVisible] = useState(false); const pathname = usePathname();
  const slug = pathname.match(/^\/packages\/([^/]+)\/?$/)?.[1];
  useEffect(() => {
    setVisible(false);
    const hero = document.getElementById('home');
    if (hero) { const observer = new IntersectionObserver(([entry]) => setVisible(!entry.isIntersecting), { rootMargin: '0px' }); observer.observe(hero); return () => observer.disconnect(); }
    const scroll = () => setVisible(window.scrollY > 420); scroll(); addEventListener('scroll', scroll, { passive: true }); return () => removeEventListener('scroll', scroll);
  }, [pathname]);
  if (pathname === '/book') return null;
  const tab = visible ? 0 : -1;
  return <div className={`sticky-book-bar${visible ? ' is-visible' : ''}`} aria-hidden={!visible}>
    <Link href={slug ? `/packages/${slug}#book` : '/book'} className="sticky-book-main" tabIndex={tab} onClick={slug ? event => { event.preventDefault(); openBooking(event.currentTarget); } : undefined}>Book Now <span aria-hidden="true">↗</span></Link>
    <a className="sticky-book-wa" href={`https://wa.me/${content.whatsapp}`} target="_blank" rel="noopener noreferrer" aria-label="Chat with HOGS on WhatsApp" tabIndex={tab}><Icon name="chat" size={20} /></a>
  </div>;
}
