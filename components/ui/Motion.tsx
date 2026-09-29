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
    media.add({ desktop:'(min-width: 701px)', mobile:'(max-width: 700px)', featurePin:'(min-width: 1100px) and (min-height: 800px)', manifestoPin:'(min-width: 1100px) and (min-height: 640px)', manifestoTablet:'(min-width: 701px) and (max-width: 1099px)', reduce:'(prefers-reduced-motion: reduce)' }, context => {
      const { desktop, reduce, featurePin, manifestoPin, manifestoTablet } = context.conditions!;
      const lenis = reduce ? null : new Lenis({ duration:1.35, anchors:true, smoothWheel:true });
      const tick=(time:number)=>lenis?.raf(time*1000);
      lenis?.on('scroll',ScrollTrigger.update); gsap.ticker.add(tick);
      if (!reduce) {
        gsap.from('.hero-word',{yPercent:40,filter:'blur(12px)',opacity:0,stagger:.14,duration:1.7,ease:'power3.out'});
        gsap.to('.scene-fallback img',{yPercent:5,scale:1.07,ease:'none',scrollTrigger:{trigger:'.hero',start:'top top',end:'bottom top',scrub:true}});
        gsap.utils.toArray<HTMLElement>('[data-reveal]').forEach(el=>gsap.from(el,{clipPath:'inset(0 0 100% 0)',y:45,duration:1.3,clearProps:'clipPath',scrollTrigger:{trigger:el,start:'top 92%',once:true}}));
        gsap.from('.intro-photo',{clipPath:'inset(18% 12% 18% 12%)',y:desktop?80:30,ease:'none',scrollTrigger:{trigger:'.intro-composition',start:'top 95%',end:'center center',scrub:1}});
        gsap.to('.intro-photo img',{scale:1.12,yPercent:-5,ease:'none',scrollTrigger:{trigger:'.intro-composition',start:'top bottom',end:'bottom top',scrub:1}});
        gsap.utils.toArray<HTMLElement>('.story-line').forEach(el=>gsap.fromTo(el,{opacity:.15,filter:'blur(5px)',y:45,scale:.95,clipPath:'inset(0 0 30% 0)'},{opacity:1,filter:'blur(0px)',y:0,scale:1,clipPath:'inset(0)',scrollTrigger:{trigger:el,start:'top 90%',end:'top 48%',scrub:1}}));
        if(desktop){
          const track=document.querySelector<HTMLElement>('.stay-track')!;
          gsap.to(track,{x:()=>-innerWidth,ease:'none',scrollTrigger:{trigger:track,start:'top top',end:()=>'+='+innerWidth*1.4,pin:true,scrub:1,invalidateOnRefresh:true,onUpdate:self=>{
            const t=self.progress;
            const a=cameraPath[2],b=cameraPath[3];sceneState.x=a.position[0]+(b.position[0]-a.position[0])*t;sceneState.y=a.position[1]+(b.position[1]-a.position[1])*t;sceneState.z=a.position[2]+(b.position[2]-a.position[2])*t;sceneState.tx=a.target[0]+(b.target[0]-a.target[0])*t;sceneState.ty=a.target[1]+(b.target[1]-a.target[1])*t;sceneState.tz=a.target[2]+(b.target[2]-a.target[2])*t;sceneState.phase=a.phase+(b.phase-a.phase)*t;
          }}});
          if(manifestoPin){
            // Pinned editorial moment: collage reveals through clip-path masks at different depths, headline swaps emphasis.
            const tl=gsap.timeline({defaults:{ease:'none'},scrollTrigger:{trigger:'.manifesto',start:'top top',end:()=>'+='+Math.round(innerHeight*1.7),pin:true,scrub:1,anticipatePin:1,invalidateOnRefresh:true}});
            const rot=[-6,7,-9];
            gsap.utils.toArray<HTMLElement>('.manifesto .mc').forEach((fig,i)=>{
              const depth=Number(fig.dataset.depth||1);
              tl.fromTo(fig.querySelector('.mc-mask'),{clipPath:'inset(100% 0% 0% 0%)'},{clipPath:'inset(0% 0% 0% 0%)',duration:.32,ease:'power2.out'},i*.1)
                .fromTo(fig,{rotate:rot[i%3]},{rotate:0,duration:.5,ease:'power2.out'},i*.1)
                .fromTo(fig.querySelector('img'),{scale:1.3},{scale:1,duration:.7},i*.1)
                .fromTo(fig,{yPercent:9*depth},{yPercent:-4*depth,duration:1.4},0);
            });
            tl.fromTo('.manifesto .m-a',{opacity:1,color:'#1f2a24'},{opacity:.62,color:'#2b3830',duration:.4,ease:'power1.inOut'},.62)
              .fromTo('.manifesto .m-b',{opacity:.6,color:'#1f2a24'},{opacity:1,color:'#a4612e',duration:.4,ease:'power1.inOut'},.62);
          }
          if(manifestoTablet){
            const speeds=[-6,10,-4];
            gsap.utils.toArray<HTMLElement>('.manifesto .mc').forEach((fig,i)=>{
              gsap.from(fig.querySelector('.mc-mask'),{clipPath:'inset(100% 0% 0% 0%)',duration:1.1,ease:'power2.out',scrollTrigger:{trigger:fig,start:'top 88%',once:true}});
              gsap.fromTo(fig,{yPercent:-speeds[i%3]},{yPercent:speeds[i%3],ease:'none',scrollTrigger:{trigger:fig,start:'top bottom',end:'bottom top',scrub:1}});
            });
          }
          if(featurePin){
          const strip=document.querySelector<HTMLElement>('.feature-track')!;
          gsap.to(strip,{x:()=>-(strip.scrollWidth-innerWidth+innerWidth*.1),ease:'none',scrollTrigger:{trigger:'.features',start:'top top',end:()=>'+='+(strip.scrollWidth-innerWidth),pin:true,scrub:1,invalidateOnRefresh:true}});
          }
          gsap.fromTo('.gallery-grid',{xPercent:3},{xPercent:-5,ease:'none',scrollTrigger:{trigger:'.gallery',start:'top bottom',end:'bottom top',scrub:1}});
        }
      }
      cameraPath.slice(1).forEach((frame,index)=>{
        if(desktop && frame.section==='cafe') return;
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
    document.querySelectorAll('.ember-cursor').forEach(el=>el.remove());const cursor=document.createElement('div');cursor.className='ember-cursor';cursor.style.opacity='0';cursor.setAttribute('aria-hidden','true');document.body.append(cursor);
    const move=(event:MouseEvent)=>{const target=event.target as Element;const view=Boolean(target.closest('.gallery-item'));const drag=Boolean(target.closest('.feature-track'));cursor.style.opacity='';cursor.style.transform='translate('+event.clientX+'px,'+event.clientY+'px)';cursor.classList.toggle('active',Boolean(target.closest('a,button,input,select')));cursor.classList.toggle('view',view||drag);cursor.textContent=view?'VIEW':drag?'SCROLL':'';};
    document.addEventListener('mousemove',move);return()=>{document.removeEventListener('mousemove',move);cursor.remove();};
  },[]);
  return null;
}
