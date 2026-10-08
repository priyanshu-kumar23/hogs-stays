'use client';
import { useState } from 'react';
import Image from 'next/image';
import Icon from '@/components/ui/Icon';
import EnquireButton from '@/components/enquiry/EnquireButton';

export type RoomPhoto = { id: string; hero: string; thumb: string; alt: string; blur: string; position: string };
type Props = { id: string; name: string; photos: RoomPhoto[]; description: string | null; amenities: string[]; facts: [string, string][] };

// One room category: hero photo, thumbnails that swap the hero (a light slider), details, and an Enquire button that opens the enquiry panel with this room preselected.
export default function RoomCard({ id, name, photos, description, amenities, facts }: Props) {
  const [active, setActive] = useState(0);
  const current = photos[active];
  return <article className="room-card" id={id} data-reveal aria-labelledby={`${id}-title`}>
    <div className="room-media">
      {current
        ? <div className="room-hero" style={{ backgroundImage: `url(${current.blur})` }}><Image key={current.id} src={current.hero} alt={current.alt} fill sizes="(max-width: 860px) 92vw, 46vw" loading="lazy" style={{ objectFit: 'cover', objectPosition: current.position }} /></div>
        : <div className="room-hero room-placeholder"><span>Photos coming soon</span></div>}
      {photos.length > 1 && <ul className="room-thumbs" aria-label={`${name} photos`}>
        {photos.map((photo, index) => <li key={photo.id}><button type="button" className={index === active ? 'is-active' : undefined} onClick={() => setActive(index)} aria-label={`Show photo ${index + 1} of ${photos.length}`} aria-current={index === active}><Image src={photo.thumb} alt="" width={160} height={120} sizes="80px" loading="lazy" style={{ objectPosition: photo.position }} /></button></li>)}
      </ul>}
    </div>
    <div className="room-body">
      <h3 id={`${id}-title`}>{name}</h3>
      <p className="room-desc">{description ?? 'Room details and rates are shared directly by the HOGS team when you enquire.'}</p>
      {facts.length > 0 && <dl className="room-facts">{facts.map(([term, value]) => <div key={term}><dt>{term}</dt><dd>{value}</dd></div>)}</dl>}
      {amenities.length > 0 && <ul className="room-amenities">{amenities.map(item => <li className="chip" key={item}>{item}</li>)}</ul>}
      <EnquireButton room={id} className="button room-cta">Enquire <Icon /></EnquireButton>
    </div>
  </article>;
}
