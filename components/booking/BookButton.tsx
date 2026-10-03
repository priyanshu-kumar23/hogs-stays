'use client';
import type { ReactNode } from 'react';
// Any "Book now / Enquire" button on a package page. The BookingHost (mounted once per page) listens for this event and opens the sheet.
export const BOOK_EVENT = 'hogs:book';
export const openBooking = (trigger?: Element | null) => window.dispatchEvent(new CustomEvent(BOOK_EVENT, { detail: { trigger } }));
export default function BookButton({ className, children }: { className?: string; children: ReactNode }) {
  return <button type="button" className={className} aria-haspopup="dialog" onClick={event => openBooking(event.currentTarget)}>{children}</button>;
}
