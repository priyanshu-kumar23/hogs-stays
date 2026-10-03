'use client';
import { useEffect, useRef } from 'react';
import Image from 'next/image';
import type { PlaceCard } from './AttractionsSection';
// Details view for one place. A native <dialog> opened with showModal(), so the browser traps focus, makes the page inert and closes on Esc.
// CSS makes it a side drawer on desktop and a bottom sheet on phones. Loaded lazily (next/dynamic) the first time a place is opened.
export default function AttractionDrawer({ place, onClose, onGoTo }: { place: PlaceCard; onClose: () => void; onGoTo: (id: string) => void }) {
  const dialog = useRef<HTMLDialogElement>(null);
  useEffect(() => { const el = dialog.current; if (el && !el.open) el.showModal(); const previous = document.body.style.overflow; document.body.style.overflow = 'hidden'; return () => { document.body.style.overflow = previous; }; }, []);
  const { image, days } = place; const titleId = `place-${place.slug}-title`;
  return <dialog ref={dialog} className="pk-drawer" data-lenis-prevent aria-labelledby={titleId} onCancel={event => { event.preventDefault(); onClose(); }} onClick={event => { if (event.target === dialog.current) onClose(); }}>
    <div className="pk-drawer-panel">
      <button type="button" className="icon-button pk-drawer-close" aria-label={`Close details for ${place.name}`} onClick={onClose} autoFocus><span aria-hidden="true">×</span></button>
      <figure className="pk-drawer-fig">
        <div className="pk-drawer-img"><Image src={image.src} alt={image.alt} fill sizes="(max-width: 700px) 100vw, 520px" style={{ objectPosition: image.position }} placeholder="blur" blurDataURL={image.blur} /></div>
        <figcaption><span>FIG. — {image.caption}</span>{image.credit && <small>Photo: {image.credit.author} · <a href={image.credit.source} target="_blank" rel="noopener noreferrer">{image.credit.license}</a></small>}</figcaption>
      </figure>
      <div className="pk-drawer-body">
        <p className="eyebrow">{place.type}</p>
        <h2 id={titleId}>{place.name}</h2>
        <p className="pk-drawer-desc">{place.description}</p>
        <h3 className="eyebrow">What to do</h3>
        <ul className="pk-drawer-do">{place.doBullets.map(item => <li key={item}>{item}</li>)}</ul>
        <aside className="pk-callout is-season"><p className="eyebrow">Best time</p><p>{place.season}</p></aside>
        <aside className="pk-callout is-recommendation"><p className="eyebrow">HOGS tip</p><p>{place.tip}</p></aside>
        <h3 className="eyebrow">Seen on</h3>
        <ul className="pk-drawer-days">{days.map(day => <li key={day.n}><a href={`#day-${day.n}`} onClick={event => { event.preventDefault(); onGoTo(`day-${day.n}`); }}><span>Day {String(day.n).padStart(2, '0')}</span> {day.title} <span aria-hidden="true">→</span></a></li>)}</ul>
        <a className="pk-btn pk-btn-lg" href="#enquire" onClick={event => { event.preventDefault(); onGoTo('enquire'); }}>Enquire about this journey <span aria-hidden="true">↗</span></a>
      </div>
    </div>
  </dialog>;
}
