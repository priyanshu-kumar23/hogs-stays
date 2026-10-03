'use client';
import { useState, type ReactNode } from 'react';
// Client-side filter for /packages. The cards are rendered on the server and passed in as nodes, so this component only
// holds the two filters (duration, perfect for) and never imports the photo data.
export type BrowserItem = { slug: string; nights: number; perfectFor: string[]; card: ReactNode };
export default function PackagesBrowser({ items, nights, audiences }: { items: BrowserItem[]; nights: number[]; audiences: string[] }) {
  const [night, setNight] = useState<number | 'all'>('all'); const [audience, setAudience] = useState<string>('all');
  const shown = items.filter(item => (night === 'all' || item.nights === night) && (audience === 'all' || item.perfectFor.includes(audience)));
  const reset = () => { setNight('all'); setAudience('all'); };
  const group = (label: string, id: string, options: { value: number | string; text: string }[], current: number | string, set: (value: never) => void) =>
    <div className="pk-filter" role="group" aria-labelledby={id}>
      <p className="eyebrow" id={id}>{label}</p>
      <div className="pk-filter-chips">{[{ value: 'all', text: 'All' }, ...options].map(option => <button type="button" key={option.value} className="pk-chip-btn" aria-pressed={current === option.value} onClick={() => set(option.value as never)}>{option.text}</button>)}</div>
    </div>;
  return <>
    <div className="pk-filters">
      {group('DURATION', 'pk-f-duration', nights.map(value => ({ value, text: `${value} nights` })), night, setNight)}
      {group('PERFECT FOR', 'pk-f-for', audiences.map(value => ({ value, text: value })), audience, setAudience)}
    </div>
    <p className="pk-count" role="status" aria-live="polite">{shown.length === items.length ? `All ${items.length} journeys` : `${shown.length} of ${items.length} journeys`}</p>
    {shown.length ? <div className="pk-grid">{shown.map(item => <div key={item.slug} className="pk-grid-item">{item.card}</div>)}</div>
      : <div className="pk-empty"><p>No journey matches that mix just yet.</p><button type="button" className="pk-link" onClick={reset}>Show every journey <span aria-hidden="true">→</span></button></div>}
  </>;
}
