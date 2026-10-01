'use client';
import Image from 'next/image';
import { useEffect, useRef } from 'react';
import type { GalleryImage } from '@/lib/gallery';
// Modal lightbox: arrow keys, Esc, swipe on touch, counter, caption from the photo's alt text. Uses <dialog> for focus trapping.
export default function Lightbox({ items, index, onIndex, onClose }: { items: readonly GalleryImage[]; index: number; onIndex: (i: number) => void; onClose: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const swipe = useRef<number | null>(null);
  const total = items.length;
  const go = (delta: number) => onIndex((index + delta + total) % total);
  useEffect(() => {
    const element = dialog.current!;
    element.showModal();
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = previous; if (element.open) element.close(); };
  }, []);
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'ArrowRight') { event.preventDefault(); go(1); }
      else if (event.key === 'ArrowLeft') { event.preventDefault(); go(-1); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });
  const image = items[index];
  const neighbours = total > 1 ? [items[(index + 1) % total], items[(index - 1 + total) % total]] : [];
  return <dialog ref={dialog} className="lb" aria-label="Photo viewer" onCancel={event => { event.preventDefault(); onClose(); }} onClick={event => { if (event.target === dialog.current) onClose(); }}>
    <div className="lb-top"><p className="lb-count" aria-live="polite">{index + 1} / {total}</p><button type="button" className="lb-btn" onClick={onClose} aria-label="Close photo viewer">×</button></div>
    <div className="lb-stage" onPointerDown={event => { swipe.current = event.pointerType === 'mouse' ? null : event.clientX; }} onPointerUp={event => { if (swipe.current === null) return; const dx = event.clientX - swipe.current; swipe.current = null; if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1); }}>
      {total > 1 && <button type="button" className="lb-btn lb-prev" onClick={() => go(-1)} aria-label="Previous photo">‹</button>}
      <figure className="lb-figure">
        <Image key={image.id} src={image.src} alt={image.alt} width={image.width} height={image.height} sizes="100vw" priority placeholder="blur" blurDataURL={image.blurDataURL} className="lb-img" />
        <figcaption aria-hidden="true">{image.alt}</figcaption>
      </figure>
      {total > 1 && <button type="button" className="lb-btn lb-next" onClick={() => go(1)} aria-label="Next photo">›</button>}
    </div>
    {neighbours.map(next => <Image key={next.id} src={next.src} alt="" width={next.width} height={next.height} sizes="100vw" className="lb-preload" aria-hidden="true" />)}
  </dialog>;
}
