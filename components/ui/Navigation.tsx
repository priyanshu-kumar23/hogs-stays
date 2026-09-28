'use client';
import { useEffect, useRef, useState } from 'react';
import Icon from './Icon';
import { motion, useReducedMotion } from 'framer-motion';
const links = [['Gallery','#gallery'],['Features','#features'],['About Us','#about-us'],['Our Stays','#our-stay']];
export default function Navigation() {
  const reduced=useReducedMotion();
  const [hidden, setHidden] = useState(false); const [open, setOpen] = useState(false); const dialog = useRef<HTMLDialogElement>(null); const menu = useRef<HTMLButtonElement>(null);
  useEffect(() => { let last = window.scrollY; const scroll = () => { setHidden(window.scrollY > last && window.scrollY > 120); last = window.scrollY; }; addEventListener('scroll',scroll,{ passive:true }); return () => removeEventListener('scroll',scroll); }, []);
  useEffect(() => { document.body.style.overflow = open ? 'hidden' : ''; return () => { document.body.style.overflow = ''; }; }, [open]);
  const close = () => { dialog.current?.close(); setOpen(false); menu.current?.focus(); };
  return <><a className="skip-link" href="#main">Skip to content</a><motion.header className="navbar" animate={{y:hidden&&!open?'-110%':'0%'}} transition={{duration:reduced?0:.45,ease:'easeInOut'}}><a className="brand" href="#home" aria-label="HOGS home">HOGS<span>OF HIMALAYAN HOMES</span></a><nav className="desktop-nav" aria-label="Main navigation">{links.map(([title,href])=><a key={href} href={href}>{title}</a>)}</nav><a className="button nav-book" href="#form">Book Now <Icon /></a><button ref={menu} className="menu-toggle" aria-label="Open navigation" aria-expanded={open} onClick={()=>{ dialog.current?.showModal(); setOpen(true); }}>☰</button></motion.header><dialog data-lenis-prevent ref={dialog} className="mobile-menu" onCancel={close}><button className="icon-button menu-close" onClick={close} aria-label="Close navigation"><Icon name="close" /></button><span className="eyebrow">A little closer to the mountains</span><nav aria-label="Mobile navigation">{[...links,['Book Your Stay','#form']].map(([title,href])=><motion.a key={href} href={href} onClick={close} initial={false} animate={{opacity:open?1:0,x:open?0:20}} transition={{duration:reduced?0:.5,delay:open?links.findIndex(item=>item[1]===href)*.07:0}}>{title}</motion.a>)}</nav></dialog></>;
}

