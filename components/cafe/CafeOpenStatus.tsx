'use client';
import { useEffect, useState } from 'react';
import { cafeStatusLabel, isCafeOpen } from '@/lib/cafeHours';
import '@/app/cafe-status.css';

// Live "Open now" / "Closed" chip. Rendered only after mount (the server and the first client render both output the same empty placeholder),
// so there is no hydration mismatch, and it is recalculated every 30 seconds in Asia/Kolkata time.
export default function CafeOpenStatus({ className = '' }: { className?: string }) {
  const [open, setOpen] = useState<boolean | null>(null);
  useEffect(() => {
    const tick = () => setOpen(isCafeOpen());
    tick(); const timer = window.setInterval(tick, 30000);
    return () => window.clearInterval(timer);
  }, []);
  if (open === null) return <span className={`cafe-status is-pending ${className}`.trim()} aria-hidden="true" />;
  return <span className={`cafe-status ${open ? 'is-open' : 'is-closed'} ${className}`.trim()}><i aria-hidden="true" />{cafeStatusLabel(open)}</span>;
}
