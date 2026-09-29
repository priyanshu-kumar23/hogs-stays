'use client';
import HimalayanScene from './HimalayanScene';
import Image from 'next/image';
import { Component,type ReactNode,useCallback,useEffect,useState } from 'react';
class SceneBoundary extends Component<{children:ReactNode;onFailure:()=>void},{failed:boolean}> {
 state={failed:false};static getDerivedStateFromError(){return {failed:true};}
 componentDidCatch(){this.props.onFailure();}
 render(){return this.state.failed?null:this.props.children;}
}
export default function SceneLoader(){
 const [enabled,setEnabled]=useState(false),[ready,setReady]=useState(false),[failed,setFailed]=useState(false);
 const failure=useCallback(()=>{setEnabled(false);setReady(false);setFailed(true);document.documentElement.classList.remove('landscape-ready');},[]);
 const loaded=useCallback(()=>{setReady(true);document.documentElement.classList.add('landscape-ready');},[]);
 useEffect(()=>{try{const canvas=document.createElement('canvas');const gl=canvas.getContext('webgl2');const supported=Boolean(gl)&&new URLSearchParams(location.search).get('scene')!=='photo';setEnabled(supported);setFailed(!supported);gl?.getExtension('WEBGL_lose_context')?.loseContext();}catch{setEnabled(false);setFailed(true);}return()=>document.documentElement.classList.remove('landscape-ready');},[]);
 return <>{failed&&<div className="scene-fallback" aria-hidden="true" style={{position:'fixed'}}><Image src="/images/manali-valley-reference.png" alt="" fill sizes="100vw"/></div>}{!ready&&!failed&&<div className="landscape-boot" role="status" aria-live="polite"><span>HOGS</span><small>Opening your mountain view…</small><i/></div>}<div className={ready?'landscape-world is-ready':'landscape-world'}>{enabled&&<SceneBoundary onFailure={failure}><HimalayanScene onReady={loaded} onFailure={failure}/></SceneBoundary>}</div></>;
}
