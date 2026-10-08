'use client';
import { useEffect, useMemo, useState } from 'react';
import { faqAnswerText, type GuestFaqGroup } from '@/lib/faqs';
import PolicyBlocks from './PolicyBlocks';

// Grouped FAQ accordion: live search, one answer open at a time (smooth height animation via grid-template-rows), deep links (/faqs#pets).
// Every answer is in the server HTML (closed ones are `inert`), so the page stays fully indexable and works before hydration.
export default function FaqAccordion({ groups }: { groups: GuestFaqGroup[] }) {
  const [openId, setOpenId] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const known = useMemo(() => new Set(groups.flatMap(group => group.items.map(item => item.id))), [groups]);

  // Deep link: open and scroll to #id on load and when the hash changes.
  useEffect(() => {
    const fromHash = () => {
      const id = decodeURIComponent(location.hash.slice(1));
      if (!known.has(id)) return;
      setQuery(''); setOpenId(id);
      window.setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' }), 120);
    };
    fromHash(); addEventListener('hashchange', fromHash);
    return () => removeEventListener('hashchange', fromHash);
  }, [known]);

  const toggle = (id: string) => {
    const next = openId === id ? null : id; setOpenId(next);
    history.replaceState(history.state, '', next ? `#${id}` : location.pathname + location.search);
  };
  const needle = query.trim().toLowerCase();
  const shown = useMemo(() => groups.map(group => ({ ...group, items: group.items.filter(item => !needle || `${item.q} ${faqAnswerText(item.blocks)}`.toLowerCase().includes(needle)) })).filter(group => group.items.length), [groups, needle]);
  const count = shown.reduce((sum, group) => sum + group.items.length, 0);

  return <div className="faq">
    <div className="faq-search">
      <label htmlFor="faq-q">Search the questions</label>
      <input id="faq-q" type="search" inputMode="search" autoComplete="off" placeholder="Try “parking”, “pets” or “payment”" value={query} onChange={event => setQuery(event.target.value)} />
      <p className="faq-count" role="status" aria-live="polite">{needle ? (count ? `${count} question${count === 1 ? '' : 's'} found` : 'No questions match that. Ask us on WhatsApp and we’ll help.') : ''}</p>
    </div>
    {shown.map(group => <section key={group.id} id={`group-${group.id}`} className="faq-group" aria-labelledby={`group-${group.id}-t`}>
      <h2 id={`group-${group.id}-t`}>{group.title}</h2>
      {group.items.map(item => {
        const open = openId === item.id;
        return <div key={item.id} id={item.id} className={`faq-item${open ? ' is-open' : ''}`}>
          <h3><button type="button" aria-expanded={open} aria-controls={`${item.id}-panel`} id={`${item.id}-btn`} onClick={() => toggle(item.id)}><span>{item.q}</span><i aria-hidden="true" /></button></h3>
          <div className="faq-panel" id={`${item.id}-panel`} role="region" aria-labelledby={`${item.id}-btn`} inert={!open}><div className="faq-panel-inner"><PolicyBlocks blocks={item.blocks} /></div></div>
        </div>;
      })}
    </section>)}
  </div>;
}
