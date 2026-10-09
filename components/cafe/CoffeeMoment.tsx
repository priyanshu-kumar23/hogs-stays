 'use client';
import { useEffect,useRef,useState } from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { cafeStory } from '@/lib/content';
const Cup=dynamic(()=>import('./CoffeeCup'),{ssr:false});
export default function CoffeeMoment(){const root=useRef<HTMLDivElement>(null);const [loaded,setLoaded]=useState(false),[visible,setVisible]=useState(false),[eligible,setEligible]=useState(false),[reduced,setReduced]=useState(false);
 useEffect(()=>{let supported=false;try{const probe=document.createElement('canvas');const gl=probe.getContext('webgl2');supported=Boolean(gl);gl?.getExtension('WEBGL_lose_context')?.loseContext();}catch{}const motion=matchMedia('(prefers-reduced-motion:reduce)');let near=false;
 const update=()=>{const allowed=supported&&(navigator.hardwareConcurrency||4)>=4;setEligible(allowed);setReduced(motion.matches);if(near&&allowed)setLoaded(true);};update();const preload=new IntersectionObserver(([entry])=>{near=entry.isIntersecting;update();},{rootMargin:'180px'});const observer=new IntersectionObserver(([entry])=>setVisible(entry.isIntersecting));if(root.current){preload.observe(root.current);observer.observe(root.current);}motion.addEventListener('change',update);return()=>{preload.disconnect();observer.disconnect();motion.removeEventListener('change',update);};},[]);
 return <div className="cs-coffee" ref={root} role="img" aria-label={cafeStory.ritual.cupLabel}><div className="cs-coffee-fallback"><Image src="/images/cafe/cup-3d-poster.webp" priority alt="" fill sizes="(max-width:767px) 90vw, 45vw" style={{objectFit:'cover'}}/></div>{loaded&&eligible&&<Cup visible={visible} reduced={reduced}/>}</div>;
}
