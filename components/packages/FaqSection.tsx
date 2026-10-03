'use client';
import { useId, useRef, useState, type KeyboardEvent } from 'react';
import Link from 'next/link';
import type { FaqCategory, FaqItem } from '@/lib/faqs';
// Journal-style FAQ accordion: category tabs, big serif numbers, one answer open at a time, smooth height animation
// (grid-rows 0fr to 1fr, see app/packages.css) and a "+" that turns into "×". TODO(owner) items never reach production (the server
// filters them), but are shown dimmed in development so the owner can see what still needs an answer.
export default function FaqSection({ items, categories, eyebrow, heading, whatsapp, id = 'faqs' }: { items: FaqItem[]; categories: FaqCategory[]; eyebrow: string; heading: [string, string]; whatsapp: string; id?: string }) {
  const present = categories.filter(category => items.some(item => item.category === category));
  const [tab, setTab] = useState<FaqCategory>(present[0]); const [open, setOpen] = useState<string | null>(null); const base = useId(); const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const shown = items.filter(item => item.category === tab);
  const select = (category: FaqCategory) => { setTab(category); setOpen(null); };
  const onKey = (event: KeyboardEvent, index: number) => {
    const next = event.key === 'ArrowRight' ? (index + 1) % present.length : event.key === 'ArrowLeft' ? (index + present.length - 1) % present.length : event.key === 'Home' ? 0 : event.key === 'End' ? present.length - 1 : -1;
    if (next < 0) return; event.preventDefault(); select(present[next]); tabs.current[next]?.focus();
  };
  return <section id={id} className="pk-faq" aria-labelledby={`${base}-title`}>
    <div className="section-topline"><p className="eyebrow">{eyebrow}</p><span className="section-index">{items.length} {items.length === 1 ? 'question' : 'questions'}</span></div>
    <h2 id={`${base}-title`} data-reveal>{heading[0]}<br /><em>{heading[1]}</em></h2>
    <div className="pk-faq-tabs" role="tablist" aria-label="FAQ categories">{present.map((category, index) => <button key={category} ref={element => { tabs.current[index] = element; }} type="button" role="tab" id={`${base}-tab-${index}`} aria-selected={tab === category} aria-controls={`${base}-panel`} tabIndex={tab === category ? 0 : -1} className="pk-chip-btn" onClick={() => select(category)} onKeyDown={event => onKey(event, index)}>{category}</button>)}</div>
    <ol className="pk-faq-list" role="tabpanel" id={`${base}-panel`} aria-labelledby={`${base}-tab-${present.indexOf(tab)}`}>
      {shown.map((item, index) => { const isOpen = open === item.id; const n = String(index + 1).padStart(2, '0');
        return <li key={item.id} className={`pk-faq-item${isOpen ? ' is-open' : ''}${item.todo ? ' is-todo' : ''}`}>
          <h3><button type="button" id={`${base}-q-${item.id}`} aria-expanded={isOpen} aria-controls={`${base}-a-${item.id}`} onClick={() => setOpen(isOpen ? null : item.id)}>
            <span className="pk-faq-n" aria-hidden="true">{n}</span><span className="pk-faq-q">{item.q}{item.tag && <small>{item.tag}</small>}</span><span className="pk-faq-icon" aria-hidden="true" />
          </button></h3>
          <div className="pk-faq-a" id={`${base}-a-${item.id}`} role="region" aria-labelledby={`${base}-q-${item.id}`} inert={!isOpen}>
            <div><div className="pk-faq-body">
              {item.todo ? <p className="pk-faq-todo">{item.todo}</p> : item.a.map((text, i) => <p key={i}>{text}</p>)}
              {item.pending && <p className="pk-faq-todo">{item.pending}</p>}
              {item.link && <Link className="pk-link" href={item.link.href}>{item.link.label} <span aria-hidden="true">→</span></Link>}
            </div></div>
          </div>
        </li>; })}
    </ol>
    <div className="pk-faq-cta"><p>Still wondering?</p><a className="pk-btn pk-btn-lg" href={whatsapp} target="_blank" rel="noopener noreferrer">Ask us on WhatsApp <span aria-hidden="true">↗</span></a></div>
  </section>;
}
