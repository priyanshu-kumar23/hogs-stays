'use client';
import type { ReactNode } from 'react';
import { openEnquiry } from './enquiryEvents';

/** Opens the enquiry panel (optionally with a room preselected). The panel returns focus here when it closes. */
export default function EnquireButton({ room, className, children }: { room?: string; className?: string; children: ReactNode }) {
  return <button type="button" className={className} aria-haspopup="dialog" onClick={event => openEnquiry({ room, trigger: event.currentTarget })}>{children}</button>;
}
