'use client';
import { useMemo,useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import * as THREE from 'three';
import { seeded } from '@/lib/terrain';
export default function Snow() {
 const group=useRef<THREE.Points>(null);const texture=useTexture('/images/cloud.png');
 const positions=useMemo(()=>{const rng=seeded(51);return Float32Array.from({length:150},(_,i)=>i%3===1?rng()*30:rng()*70-35);},[]);
 useFrame(({camera,clock})=>{if(group.current){group.current.position.copy(camera.position);group.current.position.y-=clock.elapsedTime*.035%10;}});
 return <points ref={group}><bufferGeometry><bufferAttribute attach="attributes-position" args={[positions,3]}/></bufferGeometry><pointsMaterial map={texture} color="#e5eaf0" size={.055} transparent opacity={.16} depthWrite={false}/></points>;
}
