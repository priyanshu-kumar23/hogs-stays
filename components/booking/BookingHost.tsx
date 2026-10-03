'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { BOOK_EVENT } from './BookButton';
import type { BookPackage } from './BookingSheet';
// The sheet is large and only needed once someone asks to book, so it is loaded on demand.
const BookingSheet = dynamic(() => import('./BookingSheet'), { ssr: false });
// Mounted once on each /packages/[slug] page. Opens the "Request to book" sheet for that package from: the sticky bar, the navbar Book Now,
// any BookButton, and the #book / #enquire deep links. Opening pushes a history entry so the Back button closes the sheet.
export default function BookingHost({ packages, currentSlug }: { packages: BookPackage[]; currentSlug: string }) {
  const [open, setOpen] = useState(false);
  const openRef = useRef(false); const pushed = useRef(false); const trigger = useRef<Element | null>(null);
  const finish = useCallback(() => {
    if (!openRef.current) return;
    openRef.current = false; pushed.current = false; setOpen(false); document.body.classList.remove('booking-open');
    if (/^#(book|enquire)$/.test(location.hash)) history.replaceState(history.state, '', location.pathname + location.search);
    const el = trigger.current; if (el instanceof HTMLElement && el.isConnected) el.focus();
  }, []);
  const show = useCallback((from?: Element | null, viaHash = false) => {
    if (openRef.current) return;
    openRef.current = true; trigger.current = from ?? document.activeElement; document.body.classList.add('booking-open');
    if (!viaHash) { try { history.pushState({ ...history.state, pkBook: true }, ''); pushed.current = true; } catch { /* the sheet still works without history */ } }
    setOpen(true);
  }, []);
  const close = useCallback(() => { if (pushed.current && history.state?.pkBook) history.back(); else finish(); }, [finish]);
  useEffect(() => {
    const onBook = (event: Event) => show((event as CustomEvent<{ trigger?: Element | null }>).detail?.trigger);
    const onHash = () => { if (/^#(book|enquire)$/.test(location.hash)) show(null, true); };
    const onPop = () => { if (openRef.current && !history.state?.pkBook) finish(); };
    onHash(); addEventListener(BOOK_EVENT, onBook); addEventListener('hashchange', onHash); addEventListener('popstate', onPop);
    return () => { removeEventListener(BOOK_EVENT, onBook); removeEventListener('hashchange', onHash); removeEventListener('popstate', onPop); document.body.classList.remove('booking-open'); };
  }, [show, finish]);
  return open ? <BookingSheet packages={packages} initialSlug={currentSlug} onClose={close} /> : null;
}
