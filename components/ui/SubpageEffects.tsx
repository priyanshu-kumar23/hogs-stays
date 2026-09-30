'use client';
import { useEffect } from 'react';
import Lenis from 'lenis';
// Lightweight motion for inner pages: Lenis smooth scroll + IntersectionObserver reveals.
// No WebGL, GSAP or ScrollTrigger here; the home page keeps its own Motion controller.
export default function SubpageEffects() {
  useEffect(()=>{
    const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
    // Every navigation starts at the top; a fresh Lenis instance is built per page and destroyed on leave.
    if(!location.hash) window.scrollTo(0,0);
    let lenis:Lenis|null=null;let frame=0;
    if(!reduce){lenis=new Lenis({duration:1.2,anchors:true,smoothWheel:true});lenis.scrollTo(location.hash||0,{immediate:true,force:true});const raf=(time:number)=>{lenis?.raf(time);frame=requestAnimationFrame(raf);};frame=requestAnimationFrame(raf);}
    const items=Array.from(document.querySelectorAll<HTMLElement>('[data-reveal]'));
    let observer:IntersectionObserver|null=null;
    if(!reduce&&'IntersectionObserver' in window){
      document.documentElement.classList.add('reveal-ready');
      observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('is-in');observer?.unobserve(entry.target);}}),{rootMargin:'0px 0px -8% 0px',threshold:.08});
      items.forEach(el=>observer!.observe(el));
    }
    return()=>{cancelAnimationFrame(frame);lenis?.destroy();observer?.disconnect();document.documentElement.classList.remove('reveal-ready');};
  },[]);
  return null;
}
