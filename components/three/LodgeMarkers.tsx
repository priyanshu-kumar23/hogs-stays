'use client';
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { elevation,type HeightField } from '@/lib/terrain';
import { sceneState } from '@/lib/cameraPath';
export const lodgeLocations=[[-50,100],[-61,62]] as const;
function Lodge({field,x,z}:{field:HeightField;x:number;z:number}) {
 const windows=useRef<THREE.MeshStandardMaterial>(null),light=useRef<THREE.PointLight>(null);
 const y=elevation(field,x,z);
 useFrame(()=>{const glow=THREE.MathUtils.smoothstep(sceneState.phase,.5,1);if(windows.current)windows.current.emissiveIntensity=.08+glow*3+sceneState.warmth*2;if(light.current)light.current.intensity=glow*2+sceneState.warmth*2;});
 return <group position={[x,y+.028,z]} scale={.2}><mesh castShadow><boxGeometry args={[.75,.28,.45]}/><meshStandardMaterial color="#554c40" roughness={.95}/></mesh><mesh position={[0,.2,0]} rotation={[0,Math.PI/4,0]} scale={[1,.45,.65]}><coneGeometry args={[.61,.4,4]}/><meshStandardMaterial color="#343c3b" roughness={.9}/></mesh><mesh position={[0,0,.23]}><planeGeometry args={[.48,.12]}/><meshStandardMaterial ref={windows} color="#b49b72" emissive="#ffa14b" emissiveIntensity={.1}/></mesh><pointLight ref={light} position={[0,.12,.4]} color="#ffa14b" distance={3} decay={2}/></group>;
}
export default function LodgeMarkers({field}:{field:HeightField}) {
 // Scenic markers only. These are not surveyed HOGS property locations.
 return <>{lodgeLocations.map(([x,z],i)=><Lodge key={i} field={field} x={x} z={z}/>)}</>;
}
