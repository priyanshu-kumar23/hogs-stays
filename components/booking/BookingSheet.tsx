'use client';
import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import DatePicker from '@/components/ui/DatePicker';
import Icon from '@/components/ui/Icon';
import { addDays, addons, arrivals, bookingMailto, bookingRows, bookingRequestSchema, bookingWhatsappMessage, contactMethods, defaultBooking, monthLabel, occasions, paces, requestId, suggestRooms, validateStep, type BookingForm } from '@/lib/enquiry';
import { todayInIndia } from '@/lib/booking';
import { content } from '@/lib/content';
// "Request to book" for one journey: 4 short steps, a review slip, then success. It only ever sends a REQUEST: nothing is booked or charged
// until HOGS confirms. Rendered in a native <dialog> (focus trap, Esc, inert page) that is a right-hand drawer on desktop and a full-height
// bottom sheet on phones (drag handle, swipe down to close). Progress is kept in sessionStorage for the visit.
export type BookPackage = { slug: string; name: string; nights: number; days: number; thumb: string; season: string[] };
const STEPS = ['Journey', 'Dates', 'Travellers', 'Details'] as const;
const REVIEW = 4, SUCCESS = 5, FALLBACK = 6;
const KEY = 'hogs-booking-v1';
type Saved = { slug: string; data: BookingForm; view: number; roomsTouched: boolean };
const longDate = (iso: string) => new Date(`${iso}T12:00:00Z`).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' });
const reduced = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
function load(slug: string): Saved | null { try { const raw = sessionStorage.getItem(KEY); if (!raw) return null; const saved = JSON.parse(raw) as Saved; return saved.slug === slug && saved.data && saved.view < SUCCESS ? saved : null; } catch { return null; } }
function save(saved: Saved) { try { sessionStorage.setItem(KEY, JSON.stringify(saved)); } catch { /* storage unavailable: progress simply is not kept */ } }
function clear() { try { sessionStorage.removeItem(KEY); } catch { /* ignore */ } }
const monthOptions = () => { const [y, m] = todayInIndia().slice(0, 7).split('-').map(Number); return Array.from({ length: 12 }, (_, i) => { const d = new Date(Date.UTC(y, m - 1 + i, 1)); const value = d.toISOString().slice(0, 7); return { value, label: monthLabel(value) }; }); };

function Choice({ type, name, checked, onChange, label, note }: { type: 'radio' | 'checkbox'; name: string; checked: boolean; onChange: () => void; label: ReactNode; note?: string }) {
  return <label className={`bk-choice${checked ? ' is-on' : ''}`}><input type={type} name={name} checked={checked} onChange={onChange} /><span className="bk-choice-tick" aria-hidden="true" /><span><strong>{label}</strong>{note && <small>{note}</small>}</span></label>;
}
function Stepper({ id, label, value, min, max, onChange, error }: { id: string; label: string; value: number; min: number; max: number; onChange: (value: number) => void; error?: string }) {
  return <div className="bk-field"><span className="bk-label" id={`${id}-l`}>{label}</span><div className="bk-stepper" role="group" aria-labelledby={`${id}-l`}><button type="button" aria-label={`Remove one: ${label}`} disabled={value <= min} onClick={() => onChange(value - 1)}>−</button><output aria-live="polite">{value}</output><button type="button" aria-label={`Add one: ${label}`} disabled={value >= max} onClick={() => onChange(value + 1)}>+</button></div>{error && <span className="bk-error" role="alert">{error}</span>}</div>;
}

export default function BookingSheet({ packages, initialSlug, onClose }: { packages: BookPackage[]; initialSlug: string; onClose: () => void }) {
  const restored = useMemo(() => load(initialSlug), [initialSlug]);
  const [data, setData] = useState<BookingForm>(() => restored?.data ?? defaultBooking(initialSlug));
  const [view, setView] = useState(restored?.view ?? 0); const [furthest, setFurthest] = useState(restored?.view ?? 0); const [roomsTouched, setRoomsTouched] = useState(restored?.roomsTouched ?? false);
  const [errors, setErrors] = useState<Record<string, string>>({}); const [changing, setChanging] = useState(false); const [sending, setSending] = useState(false);
  const [id, setId] = useState(''); const [notice, setNotice] = useState('');
  const dialog = useRef<HTMLDialogElement>(null); const body = useRef<HTMLDivElement>(null); const heading = useRef<HTMLHeadingElement>(null); const drag = useRef<{ y: number; dy: number } | null>(null);
  const pkg = packages.find(item => item.slug === data.packageSlug) ?? packages[0];
  const months = useMemo(monthOptions, []);

  // Native modal behaviour, scroll lock, and a layout that follows the visual viewport so the mobile keyboard never covers an input.
  useEffect(() => {
    const el = dialog.current; if (el && !el.open) el.showModal();
    const overflow = document.body.style.overflow; document.body.style.overflow = 'hidden';
    const vv = window.visualViewport; const fit = () => { if (el && vv) { el.style.setProperty('--bk-h', `${vv.height}px`); el.style.setProperty('--bk-top', `${vv.offsetTop}px`); } };
    fit(); vv?.addEventListener('resize', fit); vv?.addEventListener('scroll', fit);
    let timer: ReturnType<typeof setTimeout>; const onFocus = (event: FocusEvent) => { const target = event.target as HTMLElement; if (/^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName)) { clearTimeout(timer); timer = setTimeout(() => target.scrollIntoView({ block: 'center', behavior: reduced() ? 'auto' : 'smooth' }), 280); } };
    el?.addEventListener('focusin', onFocus);
    return () => { document.body.style.overflow = overflow; vv?.removeEventListener('resize', fit); vv?.removeEventListener('scroll', fit); el?.removeEventListener('focusin', onFocus); clearTimeout(timer); };
  }, []);
  useEffect(() => { if (view < SUCCESS) save({ slug: initialSlug, data, view, roomsTouched }); }, [data, view, roomsTouched, initialSlug]);
  useEffect(() => { body.current?.scrollTo({ top: 0 }); heading.current?.focus({ preventScroll: true }); }, [view]);

  const set = (patch: Partial<BookingForm>) => { setData(current => ({ ...current, ...patch })); setErrors(current => { const next = { ...current }; for (const key of Object.keys(patch)) delete next[key]; return next; }); };
  const setAdults = (adults: number) => set({ adults, ...(roomsTouched ? {} : { rooms: suggestRooms(adults) }) });
  const setChildren = (children: number) => set({ children, childAges: Array.from({ length: children }, (_, i) => data.childAges[i] ?? null) });
  const focusFirstError = () => setTimeout(() => body.current?.querySelector<HTMLElement>('[aria-invalid="true"], .bk-error')?.closest('.bk-field, .bk-group')?.querySelector<HTMLElement>('input, select, textarea, button')?.focus(), 60);
  const go = (next: number) => { setView(next); setFurthest(f => Math.max(f, next)); setNotice(''); };
  const next = () => { const found = validateStep(view, data); if (Object.keys(found).length) { setErrors(found); focusFirstError(); return; } setErrors({}); go(view + 1); };
  const edit = (step: number) => { setErrors({}); go(step); };

  const build = (requestIdValue: string) => ({ ...data, requestId: requestIdValue });
  const whatsappHref = (idValue: string) => `https://wa.me/${content.whatsapp}?text=${encodeURIComponent(bookingWhatsappMessage(data, idValue))}`;
  const submit = async () => {
    for (let step = 0; step < 4; step++) { const found = validateStep(step, data); if (Object.keys(found).length) { setErrors(found); go(step); focusFirstError(); return; } }
    const newId = requestId(data.packageSlug); setId(newId); setSending(true); setNotice('');
    try {
      const payload = build(newId); if (!bookingRequestSchema.safeParse(payload).success) throw new Error('Please check your details.');
      const response = await fetch('/api/package-enquiry', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.error || 'We could not send your request just now.');
      clear(); go(SUCCESS);
    } catch (error) { go(FALLBACK); setNotice(error instanceof Error ? error.message : 'We could not send your request just now.'); }
    finally { setSending(false); }
  };

  // Wrap Tab / Shift+Tab inside the sheet (the native modal alone lets focus reach the browser chrome).
  const trap = (event: React.KeyboardEvent<HTMLDialogElement>) => {
    if (event.key !== 'Tab' || (event.target as HTMLElement).closest('.calendar') || !dialog.current) return;
    const items = Array.from(dialog.current.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled])')).filter(el => el.tabIndex >= 0 && el.offsetParent !== null && !el.closest('.honeypot, [inert], .calendar'));
    if (!items.length) return; const first = items[0]; const last = items[items.length - 1];
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); } else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  };

  // Swipe down on the handle / header (phones) to close.
  const down = (event: React.PointerEvent<HTMLElement>) => { if (matchMedia('(min-width: 768px)').matches || (event.target as HTMLElement).closest('button')) return; drag.current = { y: event.clientY, dy: 0 }; event.currentTarget.setPointerCapture(event.pointerId); dialog.current?.style.setProperty('transition', 'none'); };
  const move = (event: React.PointerEvent<HTMLElement>) => { if (!drag.current) return; drag.current.dy = Math.max(0, event.clientY - drag.current.y); dialog.current?.style.setProperty('transform', `translateY(${drag.current.dy}px)`); };
  const up = () => { if (!drag.current) return; const { dy } = drag.current; drag.current = null; const el = dialog.current; if (!el) return; if (dy > 110) { onClose(); return; } el.style.setProperty('transition', 'transform .25s ease'); el.style.setProperty('transform', 'none'); };

  const err = (key: string) => errors[key] ? <span className="bk-error" id={`bk-${key}-e`} role="alert">{errors[key]}</span> : null;
  const inv = (key: string) => ({ 'aria-invalid': Boolean(errors[key]), 'aria-describedby': errors[key] ? `bk-${key}-e` : undefined });
  const checkOut = !data.flexible && data.checkIn ? addDays(data.checkIn, pkg.nights) : '';
  const lookupLabel = (list: readonly { id: string; label: string }[], value: string) => list.find(item => item.id === value)?.label ?? value;
  const titles = ['Your journey.', 'Your dates.', 'Your travellers.', 'Your details.', 'Review your request.', 'Request received.', 'One tap left.'];

  const stepBody = () => {
    if (view === 0) return <>
      <div className="bk-pkg"><div className="bk-pkg-thumb"><Image src={pkg.thumb} alt="" fill sizes="64px" /></div><div><p className="bk-pkg-name">{pkg.name}</p><p className="bk-meta">{pkg.nights}N / {pkg.days}D · Price on request</p></div><button type="button" className="bk-link" aria-expanded={changing} onClick={() => setChanging(value => !value)}>{changing ? 'Done' : 'Change'}</button></div>
      {changing && <div className="bk-group" role="radiogroup" aria-label="Choose a journey">{packages.filter(item => item.slug !== data.packageSlug).map(item => <Choice key={item.slug} type="radio" name="bk-package" checked={false} onChange={() => { set({ packageSlug: item.slug }); setChanging(false); }} label={item.name} note={`${item.nights}N / ${item.days}D`} />)}</div>}
      <fieldset className="bk-group"><legend className="bk-label">How would you like the pace?</legend>{paces.map(item => <Choice key={item.id} type="radio" name="bk-pace" checked={data.pace === item.id} onChange={() => set({ pace: item.id })} label={item.label} />)}</fieldset>
      <fieldset className="bk-group"><legend className="bk-label">Optional add-ons</legend>{addons.map(item => <Choice key={item.id} type="checkbox" name="bk-addon" checked={data.addons.includes(item.id)} onChange={() => set({ addons: data.addons.includes(item.id) ? data.addons.filter(entry => entry !== item.id) : [...data.addons, item.id] })} label={item.label} note={item.note} />)}</fieldset>
      <div className="bk-field"><label className="bk-label" htmlFor="bk-note">Anything you’d like to add or skip? <span className="bk-opt">(optional)</span></label><textarea id="bk-note" rows={3} value={data.note} onChange={event => set({ note: event.target.value })} {...inv('note')} />{err('note')}</div>
    </>;
    if (view === 1) return <>
      <label className="bk-switch"><input type="checkbox" checked={data.flexible} onChange={event => set({ flexible: event.target.checked })} /><span className="bk-switch-track" aria-hidden="true" /><span>My dates are flexible</span></label>
      {data.flexible
        ? <div className="bk-field"><label className="bk-label" htmlFor="bk-month">Preferred month</label><select id="bk-month" value={data.month} onChange={event => set({ month: event.target.value })} {...inv('month')}><option value="">Choose a month</option>{months.map(item => <option key={item.value} value={item.value}>{item.label}</option>)}</select>{err('month')}</div>
        : <><div className="bk-dates"><DatePicker id="bk-checkin" label="Check-in" value={data.checkIn} min={todayInIndia()} onChange={value => set({ checkIn: value })} error={errors.checkIn} />
          <div className="bk-checkout"><span className="bk-label">Check-out</span><p>{checkOut ? longDate(checkOut) : 'Pick a check-in date'}</p><small>{pkg.nights} nights, worked out for you</small></div></div></>}
      {pkg.season.length > 0 && <aside className="bk-note"><p className="eyebrow">Good to know · seasons</p><ul>{pkg.season.map(line => <li key={line}>{line}</li>)}</ul></aside>}
    </>;
    if (view === 2) return <>
      <div className="bk-two"><Stepper id="bk-adults" label="Adults" value={data.adults} min={1} max={20} onChange={setAdults} error={errors.adults} /><Stepper id="bk-children" label="Children" value={data.children} min={0} max={10} onChange={setChildren} /></div>
      {data.children > 0 && <div className="bk-group"><span className="bk-label">Children’s ages <span className="bk-opt">(optional)</span></span><div className="bk-ages">{data.childAges.map((age, i) => <label key={i} className="bk-age"><span>Child {i + 1}</span><select aria-label={`Age of child ${i + 1}`} value={age ?? ''} onChange={event => set({ childAges: data.childAges.map((value, j) => j === i ? (event.target.value === '' ? null : Number(event.target.value)) : value) })}><option value="">Age</option>{Array.from({ length: 18 }, (_, n) => <option key={n} value={n}>{n}</option>)}</select></label>)}</div></div>}
      <Stepper id="bk-rooms" label="Rooms needed" value={data.rooms} min={1} max={10} onChange={value => { setRoomsTouched(true); set({ rooms: value }); }} error={errors.rooms} />
      <p className="bk-hint">We suggest {suggestRooms(data.adults)} room{suggestRooms(data.adults) === 1 ? '' : 's'} for {data.adults} adult{data.adults === 1 ? '' : 's'}; children share. {roomsTouched && data.rooms !== suggestRooms(data.adults) && <button type="button" className="bk-link" onClick={() => { setRoomsTouched(false); set({ rooms: suggestRooms(data.adults) }); }}>Use suggestion</button>} Room types and rates come with your quote.</p>
      <fieldset className="bk-group"><legend className="bk-label">Arriving by</legend>{arrivals.map(item => <Choice key={item.id} type="radio" name="bk-arrival" checked={data.arrival === item.id} onChange={() => set({ arrival: item.id })} label={item.label} />)}{err('arrival')}<p className="bk-hint">We’ll share options for getting to us. Pickup isn’t promised here.</p></fieldset>
    </>;
    if (view === 3) return <>
      <div className="bk-field"><label className="bk-label" htmlFor="bk-name">Your name</label><input id="bk-name" autoComplete="name" value={data.name} onChange={event => set({ name: event.target.value })} {...inv('name')} />{err('name')}</div>
      <div className="bk-two bk-stack"><div className="bk-field"><label className="bk-label" htmlFor="bk-phone">Phone</label><input id="bk-phone" type="tel" inputMode="tel" autoComplete="tel" placeholder="+91 98765 43210" value={data.phone} onChange={event => set({ phone: event.target.value })} {...inv('phone')} />{err('phone')}</div>
        <div className="bk-field"><label className="bk-label" htmlFor="bk-email">Email</label><input id="bk-email" type="email" inputMode="email" autoComplete="email" value={data.email} onChange={event => set({ email: event.target.value })} {...inv('email')} />{err('email')}</div></div>
      <fieldset className="bk-group"><legend className="bk-label">Best way to reach you</legend><div className="bk-pills">{contactMethods.map(method => <label key={method} className={`bk-pill${data.contactMethod === method ? ' is-on' : ''}`}><input type="radio" name="bk-contact" checked={data.contactMethod === method} onChange={() => set({ contactMethod: method })} />{method}</label>)}</div></fieldset>
      <div className="bk-field"><label className="bk-label" htmlFor="bk-occasion">Occasion <span className="bk-opt">(optional)</span></label><select id="bk-occasion" value={data.occasion} onChange={event => set({ occasion: event.target.value as BookingForm['occasion'] })}>{occasions.map(item => <option key={item} value={item}>{item === 'None' ? 'None in particular' : item}</option>)}</select></div>
      <div className="bk-field"><label className="bk-label" htmlFor="bk-diet">Dietary notes <span className="bk-opt">(optional)</span></label><textarea id="bk-diet" rows={2} value={data.dietary} onChange={event => set({ dietary: event.target.value })} {...inv('dietary')} />{err('dietary')}</div>
      <div className="bk-field"><label className="bk-label" htmlFor="bk-req">Special requests <span className="bk-opt">(optional)</span></label><textarea id="bk-req" rows={3} value={data.requests} onChange={event => set({ requests: event.target.value })} {...inv('requests')} />{err('requests')}</div>
      <div className="bk-field"><label className="bk-consent"><input type="checkbox" checked={Boolean(data.consent)} onChange={event => set({ consent: event.target.checked as unknown as true })} {...inv('consent')} /><span>I agree to be contacted about this request, and have read the <Link href="/privacy-policy" target="_blank">Privacy Policy</Link> and the <Link href="/cancellation-refund-policy" target="_blank">Cancellation &amp; Refund Policy</Link>.</span></label>{err('consent')}</div>
      <div className="honeypot" aria-hidden="true"><label htmlFor="bk-website">Website</label><input id="bk-website" tabIndex={-1} autoComplete="off" value={data.website ?? ''} onChange={event => set({ website: event.target.value })} /></div>
    </>;
    if (view === REVIEW) {
      const slipRows: [string, ReactNode, number][] = [
        ['Journey', <>{pkg.name}<small>{pkg.nights}N / {pkg.days}D · {lookupLabel(paces, data.pace)}</small></>, 0],
        ...(data.addons.length || data.note ? [['Add-ons & notes', <>{data.addons.map(a => lookupLabel(addons, a)).join(', ') || 'No add-ons'}{data.note && <small>{data.note}</small>}</>, 0] as [string, ReactNode, number]] : []),
        ['Dates', data.flexible ? <>Flexible<small>Preferred month: {monthLabel(data.month)}</small></> : <>Arrive {longDate(data.checkIn)} → Depart {longDate(checkOut)}<small>{pkg.nights} nights</small></>, 1],
        ['Travellers', <>{bookingRows(data, 'x').find(([label]) => label === 'Travellers')![1]}<small>{data.rooms} room{data.rooms === 1 ? '' : 's'} · {lookupLabel(arrivals, data.arrival)}</small></>, 2],
        ['Contact', <>{data.name}<small>{data.phone} · {data.email} · via {data.contactMethod}</small></>, 3],
        ...(data.occasion !== 'None' || data.dietary || data.requests ? [['Also', <>{[data.occasion !== 'None' ? data.occasion : '', data.dietary, data.requests].filter(Boolean).join(' · ')}</>, 3] as [string, ReactNode, number]] : []),
      ];
      return <>
        <article className="bk-slip" aria-label="Your booking request"><header><span className="eyebrow">HOGS · Request to book</span><span className="bk-slip-stamp" aria-hidden="true">Manali</span></header>
          <dl>{slipRows.map(([label, value, step]) => <div key={label}><dt>{label}</dt><dd>{value}</dd><button type="button" className="bk-link" onClick={() => edit(step)} aria-label={`Edit ${label}`}>Edit</button></div>)}</dl>
          <footer><p className="bk-price">Price on request</p><p>We’ll send a personalised quote. Nothing is booked or charged until HOGS confirms.</p></footer></article>
        {notice && <p className="bk-error" role="alert">{notice}</p>}
      </>;
    }
    if (view === SUCCESS) return <div className="bk-success" role="status">
      <svg className="bk-stamp" viewBox="0 0 120 120" aria-hidden="true"><circle cx="60" cy="60" r="54" fill="none" stroke="currentColor" strokeWidth="2.5" /><circle cx="60" cy="60" r="46" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="3 4" /><path d="m38 62 16 16 30-34" fill="none" stroke="currentColor" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" /></svg>
      <p className="bk-id">{id}</p><p className="bk-lede">The mountains will wait a little longer. Thank you, {data.name.split(' ')[0]}.</p>
      <ol className="bk-next"><li>We’ll reply on {data.contactMethod === 'Call' ? 'a call' : data.contactMethod} with availability and a personalised quote.</li><li>Nothing is booked or charged until HOGS confirms.</li><li>Keep your request ID handy: {id}.</li></ol>
    </div>;
    return <div className="bk-success"><p className="bk-id">{id}</p><p className="bk-lede">{notice || 'We could not send your request just now.'}</p><p className="bk-hint">Your request is ready. Send it on WhatsApp or by email and we’ll reply with availability and a personalised quote.</p>
      <div className="bk-fallback"><a className="pk-btn pk-btn-lg" href={whatsappHref(id)} target="_blank" rel="noopener noreferrer"><Icon name="chat" size={17} /> Continue on WhatsApp</a><a className="bk-link" href={bookingMailto(data, id, content.email)}>Email it to {content.email}</a><button type="button" className="bk-link" onClick={() => go(REVIEW)}>← Back to review</button></div></div>;
  };

  const showNav = view < SUCCESS;
  return <dialog ref={dialog} className="bk" aria-labelledby="bk-title" data-lenis-prevent onKeyDown={trap} onCancel={event => { event.preventDefault(); onClose(); }} onClick={event => { if (event.target === dialog.current) onClose(); }}>
    <div className="bk-sheet">
      <header className="bk-top" onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={up}>
        <span className="bk-handle" aria-hidden="true" />
        <div className="bk-top-row"><p className="eyebrow">Request to book</p><button type="button" className="icon-button bk-close" aria-label="Close booking request" onClick={onClose}><span aria-hidden="true">×</span></button></div>
        <div className="bk-pkg-compact"><div className="bk-pkg-thumb"><Image src={pkg.thumb} alt="" fill sizes="48px" /></div><div><p className="bk-pkg-name">{pkg.name}</p><p className="bk-meta">{pkg.nights}N / {pkg.days}D · Price on request</p></div></div>
        {showNav && <ol className="bk-steps" aria-label="Booking steps">{STEPS.map((label, i) => <li key={label}><button type="button" aria-current={view === i ? 'step' : undefined} disabled={i > furthest || sending} onClick={() => edit(i)} className={view > i || (view >= REVIEW) ? 'is-done' : ''}><span>{String(i + 1).padStart(2, '0')}</span>{label}</button></li>)}</ol>}
      </header>
      <div className="bk-body" ref={body}>
        <h2 id="bk-title" ref={heading} tabIndex={-1} className="bk-title">{view < 4 ? <><span className="bk-title-n">{String(view + 1).padStart(2, '0')} / 04</span>{titles[view].replace('.', '')}<em>.</em></> : titles[view]}</h2>
        {stepBody()}
      </div>
      {showNav && <footer className="bk-foot">
        {view > 0 && view !== FALLBACK && <button type="button" className="bk-back" onClick={() => go(view - 1)} disabled={sending}><span aria-hidden="true">←</span> Back</button>}
        {view < REVIEW ? <button type="button" className="pk-btn" onClick={next}>{view === 3 ? 'Review your request' : 'Continue'} <span aria-hidden="true">→</span></button>
          : <button type="button" className="pk-btn bk-send" onClick={() => void submit()} disabled={sending}>{sending ? 'Sending your request…' : 'Send booking request'} <span aria-hidden="true">↗</span></button>}
        <p className="bk-foot-note">{view === REVIEW ? 'A request, not a booking. Nothing is charged.' : 'Price on request. We’ll send a personalised quote.'}</p>
      </footer>}
      {view >= SUCCESS && <footer className="bk-foot">{view === SUCCESS && <><button type="button" className="pk-btn" onClick={onClose}>Back to the itinerary <span aria-hidden="true">→</span></button><Link className="bk-link" href="/cafe">Explore DO NTHNG <span aria-hidden="true">↗</span></Link></>}{view === FALLBACK && <button type="button" className="bk-back" onClick={onClose}>Close</button>}</footer>}
    </div>
  </dialog>;
}
