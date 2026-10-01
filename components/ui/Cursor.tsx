'use client';
import { useEffect } from 'react';
// Ember cursor shared by every page (extracted from the home Motion controller unchanged).
export default function Cursor() {
  useEffect(()=>{
    if(!matchMedia('(pointer:fine) and (prefers-reduced-motion:no-preference)').matches)return;
    document.querySelectorAll('.ember-cursor').forEach(el=>el.remove());const cursor=document.createElement('div');cursor.className='ember-cursor';cursor.style.opacity='0';cursor.setAttribute('aria-hidden','true');document.body.append(cursor);
    const move=(event:MouseEvent)=>{const target=event.target as Element;const view=Boolean(target.closest('.gallery-item'));const drag=Boolean(target.closest('[data-drag="true"]'));cursor.style.opacity='';cursor.style.transform='translate('+event.clientX+'px,'+event.clientY+'px)';cursor.classList.toggle('active',Boolean(target.closest('a,button,input,select')));cursor.classList.toggle('view',view||drag);cursor.textContent=view?'VIEW':drag?'DRAG':'';};
    document.addEventListener('mousemove',move);return()=>{document.removeEventListener('mousemove',move);cursor.remove();};
  },[]);
  return null;
}
