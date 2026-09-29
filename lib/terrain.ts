import * as THREE from 'three';
import metadata from './terrain-data.json';
export const terrainMetadata = metadata;
export interface HeightField { values: Uint16Array; }
export function elevation(field:HeightField,x:number,z:number) {
 const {width,depth,size,baseElevation,metresPerUnit}=metadata;
 const u=THREE.MathUtils.clamp((x/width+.5)*(size-1),0,size-1.001);
 const v=THREE.MathUtils.clamp((z/depth+.5)*(size-1),0,size-1.001);
 const ix=Math.floor(u),iz=Math.floor(v),fx=u-ix,fz=v-iz;
 const at=(a:number,b:number)=>field.values[b*size+a];
 return (THREE.MathUtils.lerp(THREE.MathUtils.lerp(at(ix,iz),at(ix+1,iz),fx),THREE.MathUtils.lerp(at(ix,iz+1),at(ix+1,iz+1),fx),fz)-baseElevation)/metresPerUnit;
}
export function geoPosition(lon:number,lat:number):[number,number] {
 return [((lon-metadata.west)/(metadata.east-metadata.west)-.5)*metadata.width,((metadata.north-lat)/(metadata.north-metadata.south)-.5)*metadata.depth];
}
export function seeded(seed:number){return ()=>{seed|=0;seed=seed+0x6D2B79F5|0;let t=Math.imul(seed^seed>>>15,1|seed);t=t+Math.imul(t^t>>>7,61|t)^t;return ((t^t>>>14)>>>0)/4294967296;};}
