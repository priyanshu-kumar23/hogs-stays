'use client';
import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import { cameraPath, sceneState } from '@/lib/cameraPath';
export default function Motion() {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const media = gsap.matchMedia();
    media.add({ desktop:'(min-width: 701px)', reduce:'(prefers-reduced-motion: reduce)' }, context => {
      const { desktop, reduce } = context.conditions!;
      const lenis = reduce ? null : new Lenis({ duration:1.35, anchors:true, smoothWheel:true });
      const tick=(time:number)=>lenis?.raf(time*1000);
      lenis?.on('scroll',ScrollTrigger.update); gsap.ticker.add(tick);
      if (!reduce) {
        gsap.from('.hero-word',{yPercent:40,filter:'blur(12px)',opacity:0,stagger:.14,duration:1.7,ease:'power3.out'});
        gsap.to('.hero-photo',{yPercent:12,scale:1.07,opacity:.2,ease:'none',scrollTrigger:{trigger:'.hero',start:'top top',end:'bottom top',scrub:true}});
        gsap.utils.toArray<HTMLElement>('[data-reveal]').forEach(el=>gsap.from(el,{clipPath:'inset(0 0 100% 0)',y:45,duration:1.3,scrollTrigger:{trigger:el,start:'top 92%',once:true}}));
        gsap.from('.intro-photo',{clipPath:'inset(18% 12% 18% 12%)',y:80,ease:'none',scrollTrigger:{trigger:'.intro-composition',start:'top 95%',end:'center center',scrub:1}});
        gsap.to('.intro-photo img',{scale:1.12,yPercent:-5,ease:'none',scrollTrigger:{trigger:'.intro-composition',start:'top bottom',end:'bottom top',scrub:1}});
        gsap.utils.toArray<HTMLElement>('.story-line').forEach(el=>gsap.fromTo(el,{opacity:.15,filter:'blur(5px)',y:45,scale:.95,clipPath:'inset(0 0 30% 0)'},{opacity:1,filter:'blur(0px)',y:0,scale:1,clipPath:'inset(0)',scrollTrigger:{trigger:el,start:'top 90%',end:'top 48%',scrub:1}}));
        if(desktop){
          const track=document.querySelector<HTMLElement>('.stay-track')!;
          gsap.to(track,{x:()=>-innerWidth,ease:'none',scrollTrigger:{trigger:track,start:'top top',end:()=>'+='+innerWidth*1.4,pin:true,scrub:1,invalidateOnRefresh:true,onUpdate:self=>{
            const t=self.progress;
            sceneState.x=-10+20*t;sceneState.y=5-t;sceneState.z=13-3*t;sceneState.tx=-6+13*t;sceneState.ty=1.3;sceneState.tz=-3-5*t;sceneState.phase=.3+.15*t;
          }}});
          const strip=document.querySelector<HTMLElement>('.feature-track')!;
          gsap.to(strip,{x:()=>-(strip.scrollWidth-innerWidth+innerWidth*.1),ease:'none',scrollTrigger:{trigger:'.features',start:'top top',end:()=>'+='+(strip.scrollWidth-innerWidth),pin:true,scrub:1,invalidateOnRefresh:true}});
          gsap.fromTo('.gallery-grid',{xPercent:3},{xPercent:-5,ease:'none',scrollTrigger:{trigger:'.gallery',start:'top bottom',end:'bottom top',scrub:1}});
        }
      }
      cameraPath.slice(1).forEach((frame,index)=>{
        if(desktop && frame.section==='boutique') return;
        const previous=cameraPath[index];const target=document.getElementById(frame.section);if(!target)return;
        gsap.fromTo(sceneState,{x:previous.position[0],y:previous.position[1],z:previous.position[2],tx:previous.target[0],ty:previous.target[1],tz:previous.target[2],phase:previous.phase},{x:frame.position[0],y:frame.position[1],z:frame.position[2],tx:frame.target[0],ty:frame.target[1],tz:frame.target[2],phase:frame.phase,immediateRender:false,ease:'none',scrollTrigger:{trigger:target,start:'top bottom',end:'top top',scrub:reduce?true:1.5}});
      });
      return ()=>{lenis?.destroy();gsap.ticker.remove(tick);};
    });
    const refresh=()=>ScrollTrigger.refresh();window.addEventListener('load',refresh);document.fonts.ready.then(refresh);
    return ()=>{window.removeEventListener('load',refresh);media.revert();};
  },[]);
  useEffect(()=>{
    if(!matchMedia('(pointer:fine) and (prefers-reduced-motion:no-preference)').matches)return;
    const cursor=document.createElement('div');cursor.className='ember-cursor';cursor.setAttribute('aria-hidden','true');document.body.append(cursor);
    const move=(event:MouseEvent)=>{const target=event.target as Element;const view=Boolean(target.closest('.gallery-item'));const drag=Boolean(target.closest('.feature-track'));cursor.style.transform='translate('+event.clientX+'px,'+event.clientY+'px)';cursor.classList.toggle('active',Boolean(target.closest('a,button,input,select')));cursor.classList.toggle('view',view||drag);cursor.textContent=view?'VIEW':drag?'SCROLL':'';};
    document.addEventListener('mousemove',move);return()=>{document.removeEventListener('mousemove',move);cursor.remove();};
  },[]);
  return null;
}
