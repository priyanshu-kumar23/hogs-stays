'use client';
import { useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import PanoramaBookCta from '@/components/stays/PanoramaBookCta';
import '@/app/room-page.css';

export type RoomHeroImage = { src: string; alt: string; blur: string; position: string };

// Full-bleed room hero: cover photo with a slow parallax (off for reduced motion), a left-weighted gradient, breadcrumb, name, italic tagline,
// quick-facts chips and the two calls to action (Book this room on Aiosell, secondary WhatsApp enquiry with the room preselected).
export default function RoomHero({ roomId, roomName, tagline, chips, image }: { roomId: string; roomName: string; tagline: string; chips: string[]; image: RoomHeroImage }) {
  const layer = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let frame = 0;
    const update = () => { frame = 0; const y = Math.min(window.scrollY, 900); if (layer.current) layer.current.style.transform = `translate3d(0, ${y * 0.22}px, 0) scale(1.1)`; };
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(update); };
    update(); addEventListener('scroll', onScroll, { passive: true });
    return () => { removeEventListener('scroll', onScroll); if (frame) cancelAnimationFrame(frame); };
  }, []);
  return <header className="page-hero rh">
    <div className="rh-parallax" ref={layer}>
      <Image className="page-hero-photo" src={image.src} alt={image.alt} fill priority sizes="100vw" placeholder="blur" blurDataURL={image.blur} style={{ objectPosition: image.position }} />
    </div>
    <div className="page-hero-scrim page-hero-scrim--left" aria-hidden="true" />
    <div className="page-hero-content rh-content">
      <nav className="rh-crumbs" aria-label="Breadcrumb"><ol><li><Link href="/stays">Our Stays</Link></li><li><Link href="/stays/panorama">HOGS Panorama</Link></li><li aria-current="page">{roomName}</li></ol></nav>
      <p className="eyebrow">HOGS PANORAMA · MANALI</p>
      <h1>{roomName}</h1>
      <p className="rh-tagline">{tagline}</p>
      <ul className="rh-chips" aria-label="Room facts">{chips.map(chip => <li key={chip}>{chip}</li>)}</ul>
      <PanoramaBookCta room={roomId} label="Book this room" forName={`${roomName} at HOGS Panorama`} />
    </div>
  </header>;
}
