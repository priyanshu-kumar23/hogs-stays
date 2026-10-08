'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import AmenityIcon from '@/components/ui/AmenityIcon';
import PanoramaBookCta from './PanoramaBookCta';
import { roomHref, type Amenity } from '@/lib/rooms';

export type RoomPhoto = { id: string; src: string; alt: string; width: number; height: number; blur: string; position: string };
type Props = {
  id: string; name: string; description: string; guests: string;
  amenities: { id: Amenity; label: string }[];
  photos: RoomPhoto[];
  /** A temporary cover for a room with no photos of its own; shown with a "Photos coming soon" label. */
  fallback: RoomPhoto | null;
};

// One room category: a photo slider (swipe on touch, arrows on desktop, dots), the name, guests and bed, a short description, amenity chips with
// icons, a primary "Book now" (Aiosell) and a secondary WhatsApp enquiry link that opens the panel with this room preselected.
export default function RoomCard({ id, name, description, guests, amenities, photos, fallback }: Props) {
  const track = useRef<HTMLUListElement>(null);
  const [index, setIndex] = useState(0);
  const slides = photos.length ? photos : fallback ? [fallback] : [];
  const many = photos.length > 1;

  // Keep the dots in step with swipes: the slide closest to the left edge of the track is the current one.
  useEffect(() => {
    const el = track.current; if (!el || !many) return;
    let frame = 0;
    const onScroll = () => { cancelAnimationFrame(frame); frame = requestAnimationFrame(() => setIndex(Math.round(el.scrollLeft / el.clientWidth))); };
    el.addEventListener('scroll', onScroll, { passive: true });
    return () => { el.removeEventListener('scroll', onScroll); cancelAnimationFrame(frame); };
  }, [many]);
  const goTo = useCallback((target: number) => {
    const el = track.current; if (!el) return;
    const next = (target + slides.length) % slides.length;
    el.scrollTo({ left: next * el.clientWidth, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
    setIndex(next);
  }, [slides.length]);
  const onKey = (event: React.KeyboardEvent) => { if (event.key === 'ArrowRight') { event.preventDefault(); goTo(index + 1); } else if (event.key === 'ArrowLeft') { event.preventDefault(); goTo(index - 1); } };

  return <article className="room-card" id={id} data-reveal aria-labelledby={`${id}-title`}>
    <div className="room-media rs" role="group" aria-roledescription="carousel" aria-label={`${name} photos`}>
      <ul className="rs-track" ref={track} tabIndex={many ? 0 : -1} onKeyDown={onKey}>
        {slides.map((photo, i) => <li className="rs-slide" key={photo.id} role="group" aria-roledescription="slide" aria-label={`${i + 1} of ${slides.length}`}>
          <Image src={photo.src} alt={photo.alt} fill sizes="(max-width: 860px) 92vw, 46vw" loading="lazy" placeholder="blur" blurDataURL={photo.blur} style={{ objectFit: 'cover', objectPosition: photo.position }} />
        </li>)}
      </ul>
      {!photos.length && <span className="rs-soon">Photos coming soon</span>}
      {many && <>
        <button type="button" className="rs-arrow rs-prev" aria-label={`Previous ${name} photo`} onClick={() => goTo(index - 1)}><span aria-hidden="true">←</span></button>
        <button type="button" className="rs-arrow rs-next" aria-label={`Next ${name} photo`} onClick={() => goTo(index + 1)}><span aria-hidden="true">→</span></button>
        <div className="rs-dots" role="group" aria-label={`${name}: photo ${index + 1} of ${photos.length}`}>
          {photos.map((photo, i) => <button key={photo.id} type="button" className={i === index ? 'is-active' : undefined} aria-label={`Show photo ${i + 1}`} aria-current={i === index} onClick={() => goTo(i)} />)}
        </div>
      </>}
    </div>
    <div className="room-body">
      <h3 id={`${id}-title`}>{name}</h3>
      <p className="room-guests">{guests}</p>
      <p className="room-desc">{description}</p>
      <ul className="room-amenities" aria-label={`${name} amenities`}>{amenities.map(item => <li className="room-amenity" key={item.id}><AmenityIcon name={item.id} /><span>{item.label}</span></li>)}</ul>
      <PanoramaBookCta room={id} forName={`${name} at HOGS Panorama`} viewHref={roomHref(id)} />
    </div>
  </article>;
}
