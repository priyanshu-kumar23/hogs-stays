'use client';
import { useEffect, useRef, useState } from 'react';
import Icon from '@/components/ui/Icon';
import { SITE } from '@/lib/content';

// "Find us" map. Nothing from Google loads until the block is about to scroll into view (or the visitor taps "Load map"), so the map never
// slows the first paint of any page. The embed needs no API key.
export default function FooterMap({ className = '' }: { className?: string }) {
  const box = useRef<HTMLDivElement>(null);
  const [load, setLoad] = useState(false);
  useEffect(() => {
    const el = box.current;
    if (!el || load) return;
    if (!('IntersectionObserver' in window)) { setLoad(true); return; }
    const io = new IntersectionObserver(entries => { if (entries.some(entry => entry.isIntersecting)) { setLoad(true); io.disconnect(); } }, { rootMargin: '240px 0px' });
    io.observe(el);
    return () => io.disconnect();
  }, [load]);
  return <div className={`footer-map ${className}`.trim()}>
    <div className="footer-map-frame" ref={box}>
      {load
        ? <iframe src={SITE.mapEmbedUrl} title="HOGS Stays location on Google Maps" loading="lazy" referrerPolicy="no-referrer-when-downgrade" allowFullScreen />
        : <button type="button" className="footer-map-load" onClick={() => setLoad(true)}><Icon name="pin" size={26} /><span>Load map</span></button>}
    </div>
    <a className="footer-map-directions" href={SITE.directionsUrl} target="_blank" rel="noopener noreferrer">Get directions <span aria-hidden="true">→</span><span className="sr-only"> (opens Google Maps in a new tab)</span></a>
  </div>;
}
