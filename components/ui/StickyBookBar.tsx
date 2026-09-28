'use client';
import { useEffect, useState } from 'react';
// Mobile-only sticky CTA (see .sticky-book-bar, hidden ≥701px) that appears once the
// visitor has scrolled past the hero, since BOOK NOW is removed from the mobile navbar.
export default function StickyBookBar() {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const hero = document.getElementById('home');
    if (!hero) return;
    const observer = new IntersectionObserver(([entry]) => setVisible(!entry.isIntersecting), { rootMargin: '0px' });
    observer.observe(hero);
    return () => observer.disconnect();
  }, []);
  return <a href="#form" className={`sticky-book-bar${visible ? ' is-visible' : ''}`} aria-hidden={!visible}>Book Now <span aria-hidden="true">↗</span></a>;
}
