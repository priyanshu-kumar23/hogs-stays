'use client';
import { Suspense,useEffect,useMemo,useRef,useState } from 'react';
import { Canvas,useFrame,useLoader } from '@react-three/fiber';
import { PerformanceMonitor } from '@react-three/drei';
import * as THREE from 'three';
import Mountains from './Mountains';
import Sky from './Sky';
import Stars from './Stars';
import Snow from './Snow';
import River from './River';
import PineForest from './PineForest';
import LodgeMarkers from './LodgeMarkers';
import CameraRig from './CameraRig';
import PostFX from './PostFX';
import { cameraPath } from '@/lib/cameraPath';
function World({low,reduced,onReady}:{low:boolean;reduced:boolean;onReady:()=>void}) {
 const bytes=useLoader(THREE.FileLoader,'/terrain/manali-dem.bin',loader=>loader.setResponseType('arraybuffer')) as ArrayBuffer;
 const field=useMemo(()=>({values:new Uint16Array(bytes)}),[bytes]);const frames=useRef(0);
 useFrame(({invalidate})=>{if(frames.current<3){frames.current++;invalidate();if(frames.current===3)onReady();}});
 return <><CameraRig field={field} low={low} reduced={reduced}/><Sky/><Mountains field={field} low={low}/><River field={field}/><PineForest field={field} low={low}/><LodgeMarkers field={field}/><Stars low={low}/>{!low&&!reduced&&<Snow/>}{!low&&!reduced&&<PostFX/>}</>;
}
export default function HimalayanScene({onReady,onFailure}:{onReady:()=>void;onFailure:()=>void}) {
 const [low,setLow]=useState(true),[hidden,setHidden]=useState(false),[reduced,setReduced]=useState(false);const declined=useRef(false);
 useEffect(()=>{const query=matchMedia('(prefers-reduced-motion:reduce)');const update=()=>{setReduced(query.matches);setLow(declined.current||query.matches||innerWidth<1024||(navigator.hardwareConcurrency||4)<=4);};const visibility=()=>setHidden(document.hidden);update();visibility();window.addEventListener('resize',update);query.addEventListener('change',update);document.addEventListener('visibilitychange',visibility);return()=>{window.removeEventListener('resize',update);query.removeEventListener('change',update);document.removeEventListener('visibilitychange',visibility);};},[]);
 return <div className="mountain-canvas" aria-hidden="true"><Canvas camera={{position:[...cameraPath[0].position],fov:37,near:.1,far:2200}} shadows={!low} dpr={low?1:[1,1.5]} frameloop={hidden?'never':reduced?'demand':'always'} gl={{antialias:true,alpha:false,powerPreference:'default',toneMapping:THREE.ACESFilmicToneMapping}} onCreated={({gl})=>{gl.debug.onShaderError=()=>onFailure();gl.domElement.addEventListener('webglcontextlost',onFailure,{once:true});}}>
 <fogExp2 attach="fog" args={['#9eafb7',.0025]}/><Suspense fallback={null}><World low={low} reduced={reduced} onReady={onReady}/><PerformanceMonitor onDecline={()=>{declined.current=true;setLow(true);}}/></Suspense></Canvas></div>;
}
