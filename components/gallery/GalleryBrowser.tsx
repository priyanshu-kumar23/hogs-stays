'use client';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { useEffect, useRef, useState } from 'react';
import { gallery, galleryFilters, type GalleryFilter } from '@/lib/gallery';
import '@/app/gallery-page.css';
// The lightbox is only fetched when a photo is opened.
const Lightbox = dynamic(() => import('./Lightbox'), { ssr: false });
// Responsive masonry (CSS columns) that reserves every photo's real aspect ratio, so portraits stay tall, landscapes stay wide,
// nothing is cropped and nothing shifts while images load. The tiny blurDataURL is painted as a plain CSS background behind each photo
// (next/image's own blur placeholder wraps every image in an SVG blur filter, which is costly on mobile for 33 images). The first four photos are `priority`; the rest lazy-load with blur placeholders.
export default function GalleryBrowser() {
  const [filter, setFilter] = useState<GalleryFilter>('all');
  const [shown, setShown] = useState<GalleryFilter>('all');
  const [switching, setSwitching] = useState(false);
  const [open, setOpen] = useState<number | null>(null);
  const trigger = useRef<HTMLElement | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  useEffect(() => () => clearTimeout(timer.current), []);
  const items = shown === 'all' ? gallery : gallery.filter(image => image.category === shown);
  const count = (id: GalleryFilter) => (id === 'all' ? gallery.length : gallery.filter(image => image.category === id).length);
  const choose = (id: GalleryFilter) => {
    if (id === filter) return;
    setFilter(id);
    setSwitching(true);
    clearTimeout(timer.current);
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
    timer.current = setTimeout(() => { setShown(id); setSwitching(false); }, reduced ? 0 : 180);
  };
  const close = () => { setOpen(null); requestAnimationFrame(() => trigger.current?.focus()); };
  return <section className="section mg-wrap" aria-label="HOGS Panorama photo gallery">
    <div className="mg-chips" role="group" aria-label="Filter photos by category">
      {galleryFilters.map(item => <button type="button" key={item.id} className="mg-chip" aria-pressed={filter === item.id} onClick={() => choose(item.id)}>{item.label} <span aria-hidden="true">{count(item.id)}</span></button>)}
    </div>
    <p className="mg-count" aria-live="polite">Showing {items.length} photo{items.length === 1 ? '' : 's'}</p>
    <ul className={switching ? 'mg is-switching' : 'mg'} key={shown}>
      {items.map((image, index) => <li key={image.id} style={{ ['--i' as string]: index }}>
        <button type="button" className="mg-item" style={{ aspectRatio: `${image.width} / ${image.height}`, backgroundImage: `url(${image.blurDataURL})` }} aria-label={`Open photo: ${image.alt}`} onClick={event => { trigger.current = event.currentTarget; setOpen(index); }}>
          <Image src={image.srcMd} alt={image.alt} width={image.width} height={image.height} sizes="(max-width: 560px) 100vw, (max-width: 1024px) 50vw, 33vw" priority={index < 4} />
        </button>
      </li>)}
    </ul>
    {open !== null && <Lightbox items={items} index={open} onIndex={setOpen} onClose={close} />}
  </section>;
}
