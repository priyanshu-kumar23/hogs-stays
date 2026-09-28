'use client';
import { useRef, type ReactNode } from 'react';
export default function MagneticButton({ href, children }: { href: string; children: ReactNode }) {
  const ref = useRef<HTMLAnchorElement>(null);
  return <a ref={ref} className="button magnetic" href={href} onPointerMove={event => {
    if (!matchMedia('(pointer:fine) and (prefers-reduced-motion:no-preference)').matches) return;
    const box = event.currentTarget.getBoundingClientRect();
    event.currentTarget.style.transform = 'translate('+(event.clientX-box.left-box.width/2)*.13+'px,'+(event.clientY-box.top-box.height/2)*.2+'px)';
  }} onPointerLeave={()=>{if(ref.current) ref.current.style.transform='';}}>{children}</a>;
}
