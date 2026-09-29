'use client';
import { useEffect,useMemo,useRef } from 'react';
import { useFrame,useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { elevation,type HeightField } from '@/lib/terrain';
import { sceneState,cameraPath } from '@/lib/cameraPath';
export default function CameraRig({field,low,reduced}:{field:HeightField;low:boolean;reduced:boolean}) {
 const {camera,scene,gl,invalidate}=useThree();
 const light=useRef<THREE.DirectionalLight>(null),ambient=useRef<THREE.HemisphereLight>(null);
 const mouse=useRef({x:0,y:0}),look=useMemo(()=>new THREE.Vector3(...cameraPath[0].target),[]),position=useMemo(()=>new THREE.Vector3(),[]);
 const colors=useMemo(()=>({dawn:new THREE.Color('#9abbd6'),gold:new THREE.Color('#b5aba0'),night:new THREE.Color('#131f32'),fog:new THREE.Color()}),[]);
 useEffect(()=>{const move=(e:MouseEvent)=>{mouse.current={x:e.clientX/innerWidth*2-1,y:e.clientY/innerHeight*2-1};};
  const redraw=()=>invalidate();window.addEventListener('mousemove',move,{passive:true});window.addEventListener('scroll',redraw,{passive:true});
  return()=>{window.removeEventListener('mousemove',move);window.removeEventListener('scroll',redraw);};
 },[invalidate]);
 useFrame((_,delta)=>{
  const s=sceneState,p=THREE.MathUtils.clamp(s.phase,0,1),alpha=reduced?1:1-Math.exp(-Math.min(delta,.05)*1.5);
  const amount=low?.45:1;const hero=cameraPath[0].position;
  const x=THREE.MathUtils.lerp(hero[0],s.x,amount),z=THREE.MathUtils.lerp(hero[2],s.z,amount);
  position.set(x,Math.max(s.y,elevation(field,x,z)+3),z);camera.position.lerp(position,alpha);
  position.set(s.tx+(low||reduced?0:mouse.current.x*1.3),s.ty-(low?3:0)+(low||reduced?0:-mouse.current.y*.6),s.tz);look.lerp(position,alpha);camera.lookAt(look);
  const fog=p<.55?colors.fog.copy(colors.dawn).lerp(colors.gold,p/.55):colors.fog.copy(colors.gold).lerp(colors.night,(p-.55)/.45);
  if(scene.fog instanceof THREE.FogExp2){scene.fog.color.copy(fog);scene.fog.density=.0013+Math.sin(p*Math.PI)*.0008;}
  scene.environmentIntensity=.32-p*.23;gl.toneMappingExposure=.95-p*.10;
  if(light.current){light.current.position.set(-130+200*p,135*(1-p)+15,65);light.current.color.set(p>.8?'#92add9':p>.35?'#ffd7a3':'#edf4ff');light.current.intensity=2.45*(1-p)+.28;}
  if(ambient.current){ambient.current.intensity=1.0*(1-p)+.17;ambient.current.color.copy(fog);}
 });
 return <><hemisphereLight ref={ambient} args={['#b9d4f0','#263344',.85]}/><directionalLight ref={light} position={[-130,80,-120]} intensity={2.8} color="#fff0d9" castShadow={!low} shadow-mapSize={[1024,1024]} shadow-camera-left={-80} shadow-camera-right={80} shadow-camera-top={80} shadow-camera-bottom={-80} shadow-camera-far={500} shadow-bias={-.001}/></>;
}
