'use client';
import { useMemo } from 'react';
import * as THREE from 'three';
import { elevation,terrainMetadata,type HeightField } from '@/lib/terrain';
import MountainTerrain from './MountainTerrain';
export default function Terrain({field,low}:{field:HeightField;low:boolean}) {
 const geometry=useMemo(()=>{
  const segments=low?256:512;
  const g=new THREE.PlaneGeometry(terrainMetadata.width,terrainMetadata.depth,segments,segments);
  g.rotateX(-Math.PI/2);const p=g.attributes.position;
  for(let i=0;i<p.count;i++)p.setY(i,elevation(field,p.getX(i),p.getZ(i)));
  g.computeVertexNormals();return g;
 },[field,low]);
 const distant=useMemo(()=>{
  const g=new THREE.PlaneGeometry(terrainMetadata.width,terrainMetadata.depth,low?64:128,low?64:128);g.rotateX(-Math.PI/2);
  const p=g.attributes.position;for(let i=0;i<p.count;i++)p.setY(i,elevation(field,p.getX(i),p.getZ(i)));g.computeVertexNormals();return g;
 },[field,low]);
 return <group><mesh geometry={geometry} receiveShadow><MountainTerrain low={low}/></mesh>
  {/* Distant scenic continuation reuses real ridge geometry, with varied elevation. */}
  <mesh geometry={distant} position={[-500,-8,-670]} scale={[1.35,1.4,1.35]}><MountainTerrain low={low}/></mesh>
  <mesh geometry={distant} position={[70,-10,-830]} scale={[1.6,1.5,1.45]} rotation={[0,.38,0]}><MountainTerrain low={low}/></mesh>
 </group>;
}
