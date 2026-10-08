 'use client';
import { useEffect,useRef,useState } from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { findCafeImage } from '@/lib/cafeImages';
import { cafeStory } from '@/lib/content';
const Cup=dynamic(()=>import('./CoffeeCup'),{ssr:false});
const photo=findCafeImage('cafe-do-nthng-manali-latte-art-coffee');
export default function CoffeeMoment(){const root=useRef<HTMLDivElement>(null);const [loaded,setLoaded]=useState(false),[visible,setVisible]=useState(false),[eligible,setEligible]=useState(false),[reduced,setReduced]=useState(false);
 useEffect(()=>{let supported=false;try{const probe=document.createElement('canvas');const gl=probe.getContext('webgl2');supported=Boolean(gl);gl?.getExtension('WEBGL_lose_context')?.loseContext();}catch{}const desktop=matchMedia('(min-width:768px)'),motion=matchMedia('(prefers-reduced-motion:reduce)');let near=false;
 const update=()=>{const allowed=supported&&desktop.matches&&(navigator.hardwareConcurrency||4)>=4;setEligible(allowed);setReduced(motion.matches);if(near&&allowed)setLoaded(true);};update();const preload=new IntersectionObserver(([entry])=>{near=entry.isIntersecting;update();},{rootMargin:'180px'});const observer=new IntersectionObserver(([entry])=>setVisible(entry.isIntersecting));if(root.current){preload.observe(root.current);observer.observe(root.current);}desktop.addEventListener('change',update);motion.addEventListener('change',update);return()=>{preload.disconnect();observer.disconnect();desktop.removeEventListener('change',update);motion.removeEventListener('change',update);};},[]);
 return <div className="cs-coffee" ref={root} role="img" aria-label={cafeStory.ritual.cupLabel}><div className="cs-coffee-fallback"><Image src={photo.src} alt={photo.alt} fill sizes="(max-width:767px) 90vw, 45vw" placeholder="blur" blurDataURL={photo.blurDataURL} style={{objectFit:'cover'}}/></div>{loaded&&eligible&&<Cup visible={visible} reduced={reduced}/>}</div>;
}
