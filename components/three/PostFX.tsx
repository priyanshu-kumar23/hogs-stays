'use client';
import { Bloom,EffectComposer,Noise,Vignette } from '@react-three/postprocessing';
export default function PostFX(){return <EffectComposer multisampling={0}><Bloom luminanceThreshold={1.5} intensity={.1} mipmapBlur/><Vignette offset={.4} darkness={.18}/><Noise opacity={.009}/></EffectComposer>;}
