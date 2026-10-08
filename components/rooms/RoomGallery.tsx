'use client';
import { useState } from 'react';
import Image from 'next/image';
import Lightbox, { type LightboxImage } from '@/components/gallery/Lightbox';
import '@/app/gallery-page.css';
import '@/app/room-page.css';

export type RoomGalleryImage = LightboxImage & { position: string };

// Masonry of the room's photos (natural aspect ratios, lazy, blur placeholders). A tile opens the lightbox: arrow keys, Esc, swipe on touch.
// A room with no photos shows a "Photos coming soon" panel instead.
export default function RoomGallery({ roomName, images }: { roomName: string; images: RoomGalleryImage[] }) {
  const [index, setIndex] = useState<number | null>(null);
  if (!images.length) return <div className="rg-soon" role="status"><p className="eyebrow">PHOTOS COMING SOON</p><p>We’re preparing photographs of the {roomName}. Ask the team on WhatsApp if you’d like to see more.</p></div>;
  return <>
    <ul className="rg-grid">
      {images.map((image, i) => <li key={image.id}>
        <figure>
          <button type="button" className="rg-tile" aria-label={`Open photo ${i + 1} of ${images.length}: ${image.alt}`} onClick={() => setIndex(i)}  >
            <Image src={image.src} alt="" fill sizes="(max-width: 700px) 92vw, (max-width: 1100px) 46vw, 30vw" loading="lazy" placeholder="blur" blurDataURL={image.blurDataURL} style={{ objectFit: 'cover', objectPosition: image.position }} />
          </button>
          <figcaption>FIG. {String(i + 1).padStart(2, '0')} — {roomName.toUpperCase()}</figcaption>
        </figure>
      </li>)}
    </ul>
    {index !== null && <Lightbox items={images} index={index} onIndex={setIndex} onClose={() => setIndex(null)} />}
  </>;
}
