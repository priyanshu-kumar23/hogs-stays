'use client';
import { useMemo,useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Billboard } from '@react-three/drei';
import * as THREE from 'three';
import { sceneState } from '@/lib/cameraPath';
const vertex=`varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`;
const fragment=`varying vec2 vUv;uniform float phase;uniform float opacity;uniform float seed;
float hash(vec3 p){return fract(sin(dot(p,vec3(127.1,311.7,74.7)))*43758.5453);}
float noise(vec3 p){vec3 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(mix(hash(i),hash(i+vec3(1,0,0)),f.x),mix(hash(i+vec3(0,1,0)),hash(i+vec3(1,1,0)),f.x),f.y),mix(mix(hash(i+vec3(0,0,1)),hash(i+vec3(1,0,1)),f.x),mix(hash(i+vec3(0,1,1)),hash(i+vec3(1,1,1)),f.x),f.y),f.z);}
float cloud(vec3 p){float n=noise(p*2.7+seed)*.58+noise(p*6.1+seed)*.28+noise(p*13.3+seed)*.14;float envelope=1.-smoothstep(.45,1.,length(p*vec3(1.15,1.2,.9)));return smoothstep(.28,.62,n)*envelope;}
void main(){vec2 p=vUv*2.-1.;vec4 sum=vec4(0.);for(int i=0;i<12;i++){vec3 q=vec3(p,-1.+float(i)/5.5);float d=cloud(q)*.3;float lit=clamp(.62+q.y*.25+(cloud(q)-cloud(q+vec3(-.12,.2,-.12)))*1.5,.32,1.);vec3 color=mix(vec3(.43,.54,.66),vec3(1.,.99,.96),lit);color=mix(color,vec3(.09,.13,.20),smoothstep(.58,1.,phase));sum.rgb+=(1.-sum.a)*color*d;sum.a+=(1.-sum.a)*d;}if(sum.a<.002)discard;gl_FragColor=vec4(sum.rgb/max(sum.a,.001),sum.a*opacity);}`;
export default function Clouds({low,reduced}:{low:boolean;reduced:boolean}) {
 const group=useRef<THREE.Group>(null);
 const layers=useMemo(()=>[[-210,100,-285,165,85,.95],[-40,85,-260,140,65,.85],[110,90,-380,195,85,.8],[-310,85,-440,220,75,.85],[170,65,-185,135,55,.65]],[]);
 useFrame(({clock})=>{if(!group.current)return;group.current.position.x=reduced?0:Math.sin(clock.elapsedTime*.006)*3;group.current.traverse(node=>{if(node instanceof THREE.Mesh)(node.material as THREE.ShaderMaterial).uniforms.phase.value=sceneState.phase;});});
 return <group ref={group}>{layers.slice(0,low?3:5).map(([x,y,z,w,h,opacity],i)=><Billboard key={i} position={[x,y,z]}><mesh><planeGeometry args={[w,h]}/><shaderMaterial vertexShader={vertex} fragmentShader={low?fragment.replace("i<12","i<7").replace("float(i)/5.5","float(i)/3.").replace("cloud(q)*.3","cloud(q)*.48"):fragment} uniforms={{phase:{value:0},opacity:{value:opacity},seed:{value:i*13.7}}} transparent depthWrite={false}/></mesh></Billboard>)}</group>;
}
