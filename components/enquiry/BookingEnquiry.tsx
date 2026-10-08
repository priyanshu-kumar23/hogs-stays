'use client';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { todayInIndia } from '@/lib/booking';
import {
  MAX_ADULTS, MAX_CHILDREN, NOTE_MAX, OCCASIONS, UNSURE, addDay, buildEnquiryText, cleanPhone, datesLabel, emptyEnquiry, firstInvalidStep, guestsLabel, mailtoUrl,
  nightsBetween, roomLabel, validateStep, whatsappUrl, type EnquiryState, type Errors,
} from '@/lib/panoramaEnquiry';
import { canonicalRoomId } from '@/lib/rooms';
import { ENQUIRE_EVENT, type EnquireDetail } from './enquiryEvents';
import '@/app/enquiry.css';

// Reusable "enquire about a stay" panel. Mount once per stay page and fire openEnquiry() / <EnquireButton /> from anywhere on it.
// Desktop: a slide-over drawer from the right. Phones: a bottom sheet with a drag handle. 3 steps (room, when & who, details), then the
// enquiry opens in WhatsApp (or email) with a prefilled message. Nothing is stored on a server; progress lives in sessionStorage only.
export type EnquiryRoomOption = { id: string; name: string; tagline: string | null; thumb: string | null; blur: string | null };
type Props = { property: { name: string; whatsapp: string; email: string }; rooms: EnquiryRoomOption[]; storageKey?: string; /** Show the floating mobile "Enquire" pill (default). Turn off where another sticky booking button already exists. */ pill?: boolean };

const STEPS = ['Room', 'When & who', 'Your details'] as const;
const TITLES = ['Choose your room.', 'When & who.', 'Your details.'];
const CLOSE_MS = 240;
const reduced = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled])';

type Saved = { state: EnquiryState; step: number };
const readSaved = (key: string): Saved | null => { try { const raw = sessionStorage.getItem(key); return raw ? (JSON.parse(raw) as Saved) : null; } catch { return null; } };
const writeSaved = (key: string, saved: Saved) => { try { sessionStorage.setItem(key, JSON.stringify(saved)); } catch { /* storage unavailable: progress just isn't kept */ } };
const clearSaved = (key: string) => { try { sessionStorage.removeItem(key); } catch { /* ignore */ } };

export default function BookingEnquiry({ property, rooms, storageKey = 'hogs-enquiry-panorama-v1', pill = true }: Props) {
  const [open, setOpen] = useState(false); const [closing, setClosing] = useState(false);
  const [state, setState] = useState<EnquiryState>(() => emptyEnquiry());
  const [step, setStep] = useState(0); const [dir, setDir] = useState<'fwd' | 'back'>('fwd');
  const [errors, setErrors] = useState<Errors>({}); const [done, setDone] = useState(false);
  const [heroVisible, setHeroVisible] = useState(true);
  const dialog = useRef<HTMLDialogElement>(null); const body = useRef<HTMLDivElement>(null); const heading = useRef<HTMLHeadingElement>(null);
  const trigger = useRef<Element | null>(null); const restoreFocus = useRef(false); const openRef = useRef(false); const drag = useRef<{ y: number; dy: number } | null>(null);
  const today = todayInIndia();
  const roomList = useMemo(() => rooms.map(({ id, name }) => ({ id, name })), [rooms]);
  const textFor = useCallback((value: EnquiryState) => buildEnquiryText(value, roomList, property.name), [roomList, property.name]);

  // ---- open / close ----------------------------------------------------------------------------------------------------------------
  const show = useCallback((detail: EnquireDetail = {}) => {
    if (openRef.current) return;
    openRef.current = true; trigger.current = detail.trigger ?? document.activeElement;
    const saved = readSaved(storageKey);
    const next = { ...emptyEnquiry(), ...(saved?.state ?? {}) };
    next.room = canonicalRoomId(next.room); // a room saved under an old id (jacuzzi-suite) still resolves
    const wanted = canonicalRoomId(detail.room);
    if (wanted && rooms.some(room => room.id === wanted)) next.room = wanted;
    setState(next); setStep(Math.min(Math.max(saved?.step ?? 0, 0), 2)); setDir('fwd'); setErrors({}); setDone(false); setClosing(false); setOpen(true);
  }, [rooms, storageKey]);
  const finishClose = useCallback(() => {
    openRef.current = false; setOpen(false); setClosing(false);
    if (location.hash === '#book') history.replaceState(history.state, '', location.pathname + location.search);
    restoreFocus.current = true;
  }, []);
  // Return focus to whatever opened the panel, once the modal dialog is gone (while it is open the rest of the page is inert).
  useEffect(() => {
    if (open || !restoreFocus.current) return;
    restoreFocus.current = false;
    const el = trigger.current; if (el instanceof HTMLElement && el.isConnected) el.focus();
  }, [open]);
  const close = useCallback(() => { if (!openRef.current || closing) return; if (reduced()) { finishClose(); return; } setClosing(true); window.setTimeout(finishClose, CLOSE_MS); }, [closing, finishClose]);

  // Events from buttons, plus the #book deep link: /stays/panorama?room=jacuzzi-room#book (the old ?room=jacuzzi-suite still works)
  useEffect(() => {
    const fromUrl = () => { if (location.hash === '#book') show({ room: new URLSearchParams(location.search).get('room') ?? undefined }); };
    const onEvent = (event: Event) => show((event as CustomEvent<EnquireDetail>).detail);
    fromUrl(); addEventListener(ENQUIRE_EVENT, onEvent); addEventListener('hashchange', fromUrl);
    return () => { removeEventListener(ENQUIRE_EVENT, onEvent); removeEventListener('hashchange', fromUrl); };
  }, [show]);

  // Native modal (inert page, Esc), scroll lock, and keep a focused field visible above the phone keyboard.
  useEffect(() => {
    if (!open) return;
    const el = dialog.current; if (el && !el.open) el.showModal();
    const html = document.documentElement.style.overflow; const bodyOverflow = document.body.style.overflow;
    document.documentElement.style.overflow = 'hidden'; document.body.style.overflow = 'hidden';
    let timer: ReturnType<typeof setTimeout>;
    const onFocus = (event: FocusEvent) => { const target = event.target as HTMLElement; if (/^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName)) { clearTimeout(timer); timer = setTimeout(() => target.scrollIntoView({ block: 'center', behavior: reduced() ? 'auto' : 'smooth' }), 320); } };
    el?.addEventListener('focusin', onFocus);
    return () => { document.documentElement.style.overflow = html; document.body.style.overflow = bodyOverflow; el?.removeEventListener('focusin', onFocus); clearTimeout(timer); };
  }, [open]);

  // Keep progress for the visit (cleared on success); each step change moves focus to the step title and resets the scroll.
  useEffect(() => { if (open && !done) writeSaved(storageKey, { state, step }); }, [open, done, state, step, storageKey]);
  useEffect(() => { if (!open) return; body.current?.scrollTo({ top: 0 }); heading.current?.focus({ preventScroll: true }); }, [open, step, done]);

  // The mobile "Enquire" pill is hidden while the page hero is on screen.
  useEffect(() => {
    const hero = document.querySelector('.page-hero'); if (!hero || !('IntersectionObserver' in window)) { setHeroVisible(false); return; }
    const observer = new IntersectionObserver(([entry]) => setHeroVisible(entry.isIntersecting), { threshold: 0.15 }); observer.observe(hero);
    return () => observer.disconnect();
  }, []);

  // ---- form ------------------------------------------------------------------------------------------------------------------------
  const set = (patch: Partial<EnquiryState>) => { setState(current => ({ ...current, ...patch })); setErrors(current => { const next = { ...current }; for (const key of Object.keys(patch)) delete next[key as keyof Errors]; return next; }); };
  const setCheckIn = (checkIn: string) => set({ checkIn, ...(checkIn && (!state.checkOut || state.checkOut <= checkIn) ? { checkOut: addDay(checkIn, 1) } : {}) });
  const go = (target: number) => { setDir(target >= step ? 'fwd' : 'back'); setStep(target); };
  const focusError = () => setTimeout(() => body.current?.querySelector<HTMLElement>('[aria-invalid="true"], .enq-room-group[data-invalid="true"] input')?.focus(), 80);
  const next = () => { const found = validateStep(step, state, roomList, today); if (Object.keys(found).length) { setErrors(found); focusError(); return; } setErrors({}); go(step + 1); };
  const nights = nightsBetween(state.checkIn, state.checkOut);
  const invalidStep = firstInvalidStep(state, roomList, today);
  const valid = invalidStep === -1;
  const text = valid ? textFor(state) : '';
  const waHref = valid ? whatsappUrl(property.whatsapp, text) : '';
  const mailHref = valid ? mailtoUrl(property.email, `Enquiry: ${property.name}`, text) : '';
  const reveal = () => { const bad = invalidStep; setErrors(validateStep(bad, state, roomList, today)); go(bad); focusError(); };
  const submit = () => {
    if (!valid) { reveal(); return; }
    window.open(waHref, '_blank', 'noopener,noreferrer'); clearSaved(storageKey); setDone(true);
  };
  const onSubmit = (event: React.FormEvent) => { event.preventDefault(); if (step < 2) next(); else submit(); };
  const restart = () => { clearSaved(storageKey); setState(emptyEnquiry()); setErrors({}); setDone(false); setDir('back'); setStep(0); };

  // Tab wraps inside the panel (the native modal alone lets focus reach the browser chrome).
  const trap = (event: React.KeyboardEvent<HTMLDialogElement>) => {
    if (event.key !== 'Tab' || !dialog.current) return;
    const items = Array.from(dialog.current.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(el => el.offsetParent !== null);
    if (!items.length) return; const first = items[0]; const last = items[items.length - 1];
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); } else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  };
  // Phones: drag the handle / header down to close.
  const panel = useRef<HTMLDivElement>(null);
  const down = (event: React.PointerEvent<HTMLElement>) => { if (matchMedia('(min-width: 768px)').matches || (event.target as HTMLElement).closest('button')) return; drag.current = { y: event.clientY, dy: 0 }; event.currentTarget.setPointerCapture(event.pointerId); panel.current?.style.setProperty('transition', 'none'); };
  const move = (event: React.PointerEvent<HTMLElement>) => { if (!drag.current) return; drag.current.dy = Math.max(0, event.clientY - drag.current.y); panel.current?.style.setProperty('transform', `translateY(${drag.current.dy}px)`); };
  const up = () => { if (!drag.current) return; const { dy } = drag.current; drag.current = null; const el = panel.current; if (!el) return; if (dy > 110) { close(); return; } el.style.setProperty('transition', 'transform .25s ease'); el.style.setProperty('transform', 'none'); };

  const err = (key: keyof Errors) => errors[key] ? <span className="enq-error" id={`enq-${key}-e`} role="alert">{errors[key]}</span> : null;
  const inv = (key: keyof Errors) => ({ 'aria-invalid': Boolean(errors[key]), 'aria-describedby': errors[key] ? `enq-${key}-e` : undefined });
  const progress = done ? 100 : ((step + 1) / STEPS.length) * 100;

  const stepper = (id: string, label: string, value: number, min: number, max: number, onChange: (value: number) => void) =>
    <div className="enq-field"><span className="enq-label" id={`${id}-l`}>{label}</span>
      <div className="enq-stepper" role="group" aria-labelledby={`${id}-l`}>
        <button type="button" aria-label={`Fewer ${label.toLowerCase()}`} disabled={value <= min} onClick={() => onChange(value - 1)}>−</button>
        <output id={id} aria-live="polite">{value}</output>
        <button type="button" aria-label={`More ${label.toLowerCase()}`} disabled={value >= max} onClick={() => onChange(value + 1)}>+</button>
      </div>{err(label === 'Adults' ? 'adults' : 'children')}</div>;

  const stepBody = () => {
    if (step === 0) return <fieldset className="enq-room-group" data-invalid={Boolean(errors.room)} aria-describedby={errors.room ? 'enq-room-e' : undefined}>
      <legend className="enq-sr">Choose your room</legend>
      {rooms.map(room => <label key={room.id} className={`enq-room${state.room === room.id ? ' is-on' : ''}`}>
        <input type="radio" name="enq-room" value={room.id} checked={state.room === room.id} onChange={() => set({ room: room.id })} />
        <span className="enq-room-thumb" style={room.blur ? { backgroundImage: `url(${room.blur})` } : undefined}>{room.thumb ? <Image src={room.thumb} alt="" fill sizes="88px" /> : <span aria-hidden="true">HOGS</span>}</span>
        <span className="enq-room-text"><strong>{room.name}</strong><small>{room.tagline ?? 'Details shared by the team on enquiry'}</small></span>
        <span className="enq-tick" aria-hidden="true">✓</span>
      </label>)}
      <label className={`enq-room enq-room-unsure${state.room === UNSURE ? ' is-on' : ''}`}>
        <input type="radio" name="enq-room" value={UNSURE} checked={state.room === UNSURE} onChange={() => set({ room: UNSURE })} />
        <span className="enq-room-text"><strong>Not sure yet — help me choose</strong><small>We’ll suggest what suits your trip</small></span>
        <span className="enq-tick" aria-hidden="true">✓</span>
      </label>
      {err('room')}
      <p className="enq-hint">Rates and availability are shared by the HOGS team when you enquire.</p>
    </fieldset>;
    if (step === 1) return <>
      <div className="enq-two">
        <div className="enq-field"><label className="enq-label" htmlFor="enq-in">Check-in</label><input id="enq-in" type="date" min={today} value={state.checkIn} onChange={event => setCheckIn(event.target.value)} {...inv('checkIn')} />{err('checkIn')}</div>
        <div className="enq-field"><label className="enq-label" htmlFor="enq-out">Check-out</label><input id="enq-out" type="date" min={state.checkIn ? addDay(state.checkIn) : addDay(today)} value={state.checkOut} onChange={event => set({ checkOut: event.target.value })} {...inv('checkOut')} />{err('checkOut')}</div>
      </div>
      <p className="enq-nights" aria-live="polite">{nights > 0 ? <><strong>{nights}</strong> night{nights === 1 ? '' : 's'}</> : 'Pick your dates to see the nights'}</p>
      <div className="enq-two">{stepper('enq-adults', 'Adults', state.adults, 1, MAX_ADULTS, value => set({ adults: value }))}{stepper('enq-children', 'Children', state.children, 0, MAX_CHILDREN, value => set({ children: value }))}</div>
      <fieldset className="enq-field"><legend className="enq-label">Occasion <span className="enq-opt">(optional)</span></legend>
        <div className="enq-chips">{OCCASIONS.map(item => { const on = state.occasions.includes(item); return <button key={item} type="button" className={`enq-chip${on ? ' is-on' : ''}`} aria-pressed={on} onClick={() => set({ occasions: on ? state.occasions.filter(entry => entry !== item) : [...state.occasions, item] })}>{item}</button>; })}</div></fieldset>
    </>;
    return <>
      <div className="enq-field"><label className="enq-label" htmlFor="enq-name">Name</label><input id="enq-name" type="text" autoComplete="name" value={state.name} onChange={event => set({ name: event.target.value })} {...inv('name')} />{err('name')}</div>
      <div className="enq-field"><label className="enq-label" htmlFor="enq-phone">Phone</label>
        <div className="enq-phone"><span aria-hidden="true">+91</span><input id="enq-phone" type="tel" inputMode="numeric" autoComplete="tel-national" placeholder="98765 43210" maxLength={16} value={state.phone} onChange={event => set({ phone: cleanPhone(event.target.value) })} {...inv('phone')} /></div>{err('phone')}</div>
      <div className="enq-field"><label className="enq-label" htmlFor="enq-email">Email <span className="enq-opt">(optional)</span></label><input id="enq-email" type="email" inputMode="email" autoComplete="email" value={state.email} onChange={event => set({ email: event.target.value })} {...inv('email')} />{err('email')}</div>
      <div className="enq-field"><label className="enq-label" htmlFor="enq-msg">Message <span className="enq-opt">(optional)</span></label><textarea id="enq-msg" rows={3} maxLength={NOTE_MAX} placeholder="Anything we should know? Early check-in, bike parking, dietary needs…" value={state.message} onChange={event => set({ message: event.target.value })} {...inv('message')} />{err('message')}</div>
      <section className="enq-summary" aria-label="Your enquiry">
        <dl>
          {([['Room', roomLabel(state, roomList) || 'Not chosen', 0], ['Dates', state.checkIn && state.checkOut ? datesLabel(state) : 'Not chosen', 1], ['Guests', guestsLabel(state), 1]] as [string, string, number][]).map(([label, value, target]) =>
            <div key={label}><dt>{label}</dt><dd>{value}</dd><button type="button" className="enq-link" onClick={() => go(target)} aria-label={`Edit ${label.toLowerCase()}`}>Edit</button></div>)}
        </dl>
      </section>
    </>;
  };

  const doneBody = () => <div className="enq-done" role="status">
    <svg className="enq-check" viewBox="0 0 120 120" aria-hidden="true"><circle cx="60" cy="60" r="54" /><path d="m38 62 16 16 30-34" /></svg>
    <h3>Enquiry ready <span aria-hidden="true">✓</span></h3>
    <p className="enq-lede">See you in the mountains{state.name.trim() ? `, ${state.name.trim().split(' ')[0]}` : ''}.</p>
    <p className="enq-hint">WhatsApp should have opened with your message. If it didn’t, use the button below. We’ll reply within a few hours.</p>
    <a className="enq-primary" href={waHref} target="_blank" rel="noopener noreferrer">Open WhatsApp again <span aria-hidden="true">→</span></a>
    <button type="button" className="enq-secondary" onClick={restart}>Start a new enquiry</button>
  </div>;

  return <>
    {pill && !open && <button type="button" className={`enq-pill${heroVisible ? ' is-hidden' : ''}`} aria-haspopup="dialog" tabIndex={heroVisible ? -1 : 0} onClick={event => show({ trigger: event.currentTarget })}>Enquire <span aria-hidden="true">→</span></button>}
    {open && <dialog ref={dialog} className={`enq${closing ? ' is-closing' : ''}`} aria-labelledby="enq-title" data-lenis-prevent onKeyDown={trap}
      onCancel={event => { event.preventDefault(); close(); }} onClick={event => { if (event.target === dialog.current) close(); }}>
      <div className="enq-panel" ref={panel}>
        <header className="enq-top" onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={up}>
          <span className="enq-handle" aria-hidden="true" />
          <div className="enq-top-row"><p className="enq-eyebrow">BOOK YOUR STAY</p><button type="button" className="enq-close" aria-label="Close enquiry" onClick={close}><span aria-hidden="true">✕</span></button></div>
          <p className="enq-property">{property.name}</p>
          <div className="enq-progress" role="progressbar" aria-label="Enquiry progress" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(progress)}><i style={{ width: `${progress}%` }} /></div>
          {!done && <p className="enq-stepname"><span>Step {step + 1} of {STEPS.length}</span> · {STEPS[step]}</p>}
        </header>
        <form className="enq-form" onSubmit={onSubmit} noValidate>
          <div className="enq-body" ref={body}>
            {done ? <h2 id="enq-title" ref={heading} tabIndex={-1} className="enq-title">Thank you<em>.</em></h2>
              : <h2 id="enq-title" ref={heading} tabIndex={-1} className="enq-title">{TITLES[step].replace('.', '')}<em>.</em></h2>}
            <div className={`enq-step enq-dir-${dir}`} key={done ? 'done' : step}>{done ? doneBody() : stepBody()}</div>
          </div>
          {!done && <footer className="enq-foot">
            {step === 2 && <p className="enq-reply">We’ll reply on WhatsApp within a few hours. <Link href="/privacy-policy" target="_blank">Privacy Policy</Link></p>}
            {step === 2 && <p className="enq-reply enq-consent">By enquiring you agree to our <Link href="/terms-conditions" target="_blank">Terms</Link> &amp; <Link href="/cancellation-refund-policy" target="_blank">Cancellation Policy</Link></p>}
            <div className="enq-actions">
              {step > 0 && <button type="button" className="enq-back" onClick={() => go(step - 1)}><span aria-hidden="true">←</span> Back</button>}
              {step < 2 ? <button type="submit" className="enq-primary">Next <span aria-hidden="true">→</span></button>
                : <button type="submit" className="enq-primary">Send enquiry on WhatsApp <span aria-hidden="true">→</span></button>}
            </div>
            {step === 2 && <p className="enq-mail">Prefer email? <a href={mailHref || '#'} onClick={event => { if (!valid) { event.preventDefault(); reveal(); } }}>{property.email}</a></p>}
          </footer>}
        </form>
      </div>
    </dialog>}
  </>;
}
