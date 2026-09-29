'use client';
import { useEffect,useMemo,useRef } from 'react';
import * as THREE from 'three';
import { elevation,seeded,type HeightField } from '@/lib/terrain';
export default function PineForest({field,low}:{field:HeightField;low:boolean}) {
 const mesh=useRef<THREE.InstancedMesh>(null);const count=low?4500:16000;
 // Irregular radial branch skirts, not one cone per tree.
 const geometry=useMemo(()=>{const vertices:number[]=[];const rng=seeded(84);
  for(let layer=0;layer<9;layer++){const h=.12+layer*.095,r=(1-layer/10)*.2;
   for(let j=0;j<9;j++){const a=j/9*Math.PI*2+layer*.55,b=(j+1)/9*Math.PI*2+layer*.55;
    const ra=r*(.7+rng()*.5),rb=r*(.7+rng()*.5);vertices.push(Math.cos(a)*ra,h,Math.sin(a)*ra,0,h+.24,0,Math.cos(b)*rb,h-.03,Math.sin(b)*rb);}}
  const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(vertices,3));g.computeVertexNormals();return g;
 },[]);
 useEffect(()=>{if(!mesh.current)return;const rng=seeded(497),object=new THREE.Object3D();let n=0;
  for(let tries=0;n<count&&tries<count*50;tries++){const x=-95+rng()*90,z=65+rng()*110,h=elevation(field,x,z);const slope=Math.abs(elevation(field,x+.6,z)-h)+Math.abs(elevation(field,x,z+.6)-h);if(h>19||h<4||slope>.7||rng()>.72)continue;const scale=.15+rng()*.28;object.position.set(x,h,z);object.scale.set(scale,scale*(1+rng()*.4),scale);object.rotation.y=rng()*Math.PI*2;object.updateMatrix();mesh.current.setMatrixAt(n,object.matrix);mesh.current.setColorAt(n,new THREE.Color().setHSL(.36+rng()*.035,.17+rng()*.12,.055+rng()*.04));n++;}
  mesh.current.count=n;mesh.current.instanceMatrix.needsUpdate=true;if(mesh.current.instanceColor)mesh.current.instanceColor.needsUpdate=true;
 },[field,count]);
 return <instancedMesh ref={mesh} args={[geometry,undefined,count]}><meshStandardMaterial color="#73785e" roughness={1} side={THREE.DoubleSide}/></instancedMesh>;
}
