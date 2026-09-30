'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { content } from '@/lib/content';
import Icon from '@/components/ui/Icon';
type Photo = { src: string; alt: string; caption: string };
// `full` renders the complete /gallery page grid (no teaser heading, all photos); the home page keeps the short teaser.
export default function Gallery({ items = content.gallery, full = false }: { items?: readonly Photo[]; full?: boolean }) {
  const [selected,setSelected] = useState(0); const [open,setOpen] = useState(false); const dialog = useRef<HTMLDialogElement>(null); const trigger = useRef<HTMLButtonElement | null>(null);
  const close = () => { dialog.current?.close(); setOpen(false); trigger.current?.focus(); };
  useEffect(()=>{ if (!open) return; const previous = document.body.style.overflow; document.body.style.overflow='hidden'; return ()=>{document.body.style.overflow=previous;}; },[open]);
  const move = (delta:number) => setSelected(value=>(value+delta+items.length)%items.length);
  return <section id={full?'gallery-grid':'gallery'} className={full?'section gallery gallery--full':'section gallery'}>{!full&&<><div className="section-topline"><p className="eyebrow">{content.ui.gallery.eyebrow}</p><span className="section-index">{content.ui.gallery.index}</span></div><div className="section-heading" data-reveal><h2>{content.ui.gallery.heading[0]}<br /><em>{content.ui.gallery.heading[1]}</em></h2><p>{content.ui.gallery.description}</p></div></>}<div className="gallery-grid">{items.map((image,index)=><button key={image.src} className="gallery-item" aria-label={`Open photo: ${image.caption}`} onClick={event=>{ trigger.current=event.currentTarget; setSelected(index); setOpen(true); dialog.current?.showModal(); }}><Image src={image.src} alt={image.alt} fill sizes="(max-width:700px) 44vw, 30vw" /><span>{image.caption}</span></button>)}</div>{full?<p className="gallery-note">{content.ui.gallery.note}</p>:<><p className="gallery-note">{content.ui.gallery.note}</p><Link className="text-link gallery-more" href="/gallery">View the full gallery <Icon /></Link></>}<dialog data-lenis-prevent ref={dialog} className="lightbox" aria-label="Mountain photo gallery" onCancel={close} onKeyDown={event=>{ if(event.key==='ArrowRight') move(1); if(event.key==='ArrowLeft') move(-1); }}><div className="lightbox-image">{open && <Image src={items[selected].src} alt={items[selected].alt} fill sizes="90vw" style={{objectFit:'contain'}} />}</div><div className="lightbox-controls"><button className="icon-button" onClick={()=>move(-1)} aria-label="Previous photo">←</button><span aria-live="polite">{items[selected].caption} · {selected+1}/{items.length}</span><button className="icon-button" onClick={()=>move(1)} aria-label="Next photo"><Icon /></button><button className="icon-button" onClick={close} aria-label="Close gallery"><Icon name="close" /></button></div></dialog></section>;
}

