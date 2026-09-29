'use client';
import { useMemo,useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { sceneState } from '@/lib/cameraPath';
import { seeded } from '@/lib/terrain';
export default function Stars({low}:{low:boolean}) {
 const material=useRef<THREE.PointsMaterial>(null);
 const positions=useMemo(()=>{const rng=seeded(117),v:number[]=[];for(let i=0;i<(low?450:1200);i++){const a=rng()*Math.PI*2,el=.1+rng()*1.4;v.push(Math.cos(a)*Math.cos(el)*800,Math.sin(el)*800,Math.sin(a)*Math.cos(el)*800);}return new Float32Array(v);},[low]);
 useFrame(()=>{if(material.current)material.current.opacity=THREE.MathUtils.smoothstep(sceneState.phase,.65,1)*.8;});
 return <points><bufferGeometry><bufferAttribute attach="attributes-position" args={[positions,3]}/></bufferGeometry><pointsMaterial ref={material} transparent opacity={0} color="#d7e2f1" size={.55} sizeAttenuation depthWrite={false} fog={false}/></points>;
}
