'use client';
import { useMemo,useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { elevation,geoPosition,type HeightField } from '@/lib/terrain';
import { sceneState } from '@/lib/cameraPath';
export default function River({field}:{field:HeightField}) {
 const mat=useRef<THREE.MeshPhysicalMaterial>(null);
 const geometry=useMemo(()=>{
  // An illustrative Beas ribbon following the sampled valley floor; not navigation data.
  const points:THREE.Vector3[]=[];
  for(let i=0;i<=75;i++){const lat=32.17+i*.00195;const [guess,z]=geoPosition(77.185,lat);let x=guess,h=Infinity;
   for(let offset=-12;offset<=12;offset+=.4){const e=elevation(field,guess+offset,z);if(e<h){h=e;x=guess+offset;}}
   points.push(new THREE.Vector3(x,h+.09,z));
  }
  const curve=new THREE.CatmullRomCurve3(points);const vertices:number[]=[],uv:number[]=[],indices:number[]=[];
  for(let i=0;i<=300;i++){const t=i/300,p=curve.getPoint(t),d=curve.getTangent(t),side=new THREE.Vector3(-d.z,0,d.x).normalize().multiplyScalar(.26+.12*(1-t));vertices.push(p.x-side.x,p.y,p.z-side.z,p.x+side.x,p.y,p.z+side.z);uv.push(0,t*60,1,t*60);if(i<300){let j=i*2;indices.push(j,j+2,j+1,j+1,j+2,j+3);}}
  const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(vertices,3));g.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));g.setIndex(indices);g.computeVertexNormals();return g;
 },[field]);
 const normal=useMemo(()=>{const n=64,data=new Uint8Array(n*n*4);for(let y=0;y<n;y++)for(let x=0;x<n;x++){const i=(y*n+x)*4;data[i]=128+Math.sin(x*.7+y*.3)*28;data[i+1]=128+Math.cos(y*.8+x*.2)*28;data[i+2]=248;data[i+3]=255;}const t=new THREE.DataTexture(data,n,n);t.wrapS=t.wrapT=THREE.RepeatWrapping;t.needsUpdate=true;return t;},[]);
 useFrame((_,delta)=>{normal.offset.y+=delta*.018;if(mat.current)mat.current.color.set(sceneState.phase>.8?'#8fa5c2':sceneState.phase>.4?'#b7ae90':'#abc4c7');});
 return <mesh geometry={geometry}><meshPhysicalMaterial ref={mat} color="#abc4c7" roughness={.2} metalness={.35} clearcoat={1} normalMap={normal} normalScale={[.15,.15]} envMapIntensity={1.2} side={THREE.DoubleSide}/></mesh>;
}
