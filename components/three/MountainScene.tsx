'use client';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Cloud, Clouds, PerformanceMonitor, Stars, useProgress } from '@react-three/drei';
import { Bloom, EffectComposer, Noise, Vignette } from '@react-three/postprocessing';
import { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { sceneState } from '@/lib/cameraPath';

function noise(x:number,z:number) {
  const hash=(a:number,b:number)=>{const n=Math.sin(a*127.1+b*311.7)*43758.5453;return n-Math.floor(n);};
  const ix=Math.floor(x), iz=Math.floor(z); let fx=x-ix,fz=z-iz; fx=fx*fx*(3-2*fx);fz=fz*fz*(3-2*fz);
  return THREE.MathUtils.lerp(THREE.MathUtils.lerp(hash(ix,iz),hash(ix+1,iz),fx),THREE.MathUtils.lerp(hash(ix,iz+1),hash(ix+1,iz+1),fx),fz);
}
function height(x: number, z: number) {
  let detail=0, amplitude=1, frequency=.09;
  for(let octave=0;octave<7;octave++){detail+=(1-Math.abs(noise(x*frequency,z*frequency)*2-1))*amplitude;amplitude*=.54;frequency*=2.15;}
  const ridge=Math.pow(1-Math.abs(noise(x*.036+3,z*.032)*2-1),2.8);
  const valley=Math.min(1,Math.abs(x-Math.sin(z*.1)*4)/12);
  return (ridge*17+detail*7)*valley*Math.min(1,Math.max(.03,-z/27));
}
function Terrain({low}:{low:boolean}) {
  const uniforms=useMemo(()=>({uPhase:{value:0}}),[]);
  useFrame(()=>{uniforms.uPhase.value=sceneState.phase;});
  const geometry = useMemo(() => {
    const g = new THREE.PlaneGeometry(160, 150, low ? 100 : 300, low ? 100 : 280); g.rotateX(-Math.PI / 2); g.translate(0, -2, -36);
    const p = g.attributes.position; for (let i = 0; i < p.count; i++) p.setY(i, height(p.getX(i), p.getZ(i)) - 2);
    g.computeVertexNormals(); return g;
  }, [low]);
  return <mesh geometry={geometry}><shaderMaterial uniforms={uniforms} vertexShader={`varying vec3 vPos; varying vec3 vNormal; void main(){vPos=position;vNormal=normal;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`} fragmentShader={`uniform float uPhase; varying vec3 vPos; varying vec3 vNormal; void main(){vec3 pine=vec3(.105,.17,.145);vec3 rock=vec3(.34,.38,.36);vec3 snow=vec3(.84,.87,.84);float grain=sin(vPos.x*24.+sin(vPos.z*17.))*sin(vPos.z*32.+vPos.y*19.)*.045;float steep=1.-vNormal.y;vec3 color=mix(pine,rock,smoothstep(2.,8.,vPos.y)+steep*.25);color=mix(color,snow,smoothstep(8.+grain*10.,14.,vPos.y)*smoothstep(.1,.7,vNormal.y));color+=grain;float light=.55+max(dot(normalize(vNormal),normalize(vec3(-1.,1.,.7))),0.)*.65;float fog=smoothstep(20.,110.,-vPos.z);vec3 sky=mix(vec3(.58,.66,.66),vec3(.065,.09,.14),uPhase);color=mix(color*light,color*vec3(.18,.23,.34),uPhase);gl_FragColor=vec4(mix(color,sky,fog*.8),1.);}`} /></mesh>;
}
function Forest({ count }: { count: number }) {
  const mesh = useRef<THREE.InstancedMesh>(null);
  useEffect(() => { if (!mesh.current) return; const object = new THREE.Object3D(); for (let i = 0; i < count; i++) { const x = Math.sin(i * 127.1) * 38; const z = -5 - ((i * 13.7) % 58); const h = height(x,z)>6 ? 0 : .5 + ((i * .71) % .8); object.position.set(x, height(x, z) - 2 + h / 2, z); object.scale.set(h * .4, h, h * .4); object.updateMatrix(); mesh.current.setMatrixAt(i, object.matrix); } mesh.current.instanceMatrix.needsUpdate = true; }, [count]);
  return <instancedMesh ref={mesh} args={[undefined, undefined, count]}><coneGeometry args={[1, 1, 5]} /><meshStandardMaterial color="#142e26" roughness={1} /></instancedMesh>;
}
function River() {
 const uniforms=useMemo(()=>({uTime:{value:0},uNight:{value:0}}),[]);
 useFrame(({clock})=>{uniforms.uTime.value=clock.elapsedTime;uniforms.uNight.value=sceneState.phase;});
 const geometry=useMemo(()=>{
  const g=new THREE.BufferGeometry();const vertices:number[]=[];const indices:number[]=[];
  for(let i=0;i<=120;i++){const z=12-i*.9;const x=Math.sin(z*.1)*4;const width=.35+.18*Math.sin(i*.05);vertices.push(x-width,-1.8,z,x+width,-1.8,z);if(i<120){const j=i*2;indices.push(j,j+1,j+2,j+1,j+3,j+2);}}
  g.setAttribute('position',new THREE.Float32BufferAttribute(vertices,3));g.setIndex(indices);g.computeVertexNormals();return g;
 },[]);
 return <mesh geometry={geometry}><shaderMaterial side={THREE.DoubleSide} uniforms={uniforms} vertexShader="varying vec3 vP;void main(){vP=position;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}" fragmentShader="uniform float uTime;uniform float uNight;varying vec3 vP;void main(){float ripple=sin(vP.z*8.+uTime*.6+sin(vP.x*22.))*.06;vec3 day=vec3(.48,.65,.66)+ripple;gl_FragColor=vec4(mix(day,vec3(.07,.13,.19)+ripple*.2,uNight),1.);}" /></mesh>;
}
function Cabin({ position }: { position: [number, number, number] }) {
 const light=useRef<THREE.PointLight>(null);const window=useRef<THREE.MeshBasicMaterial>(null);
 useFrame(()=>{if(light.current) light.current.intensity=3+sceneState.phase*5+sceneState.warmth*9;if(window.current)window.current.color.setRGB(2.5+sceneState.warmth*2,1.2,.3);});
 return <group position={position}><mesh><boxGeometry args={[1.5,1,1.2]}/><meshStandardMaterial color="#503c2d"/></mesh><mesh position={[0,.75,0]} rotation={[0,Math.PI/4,0]}><coneGeometry args={[1.35,.8,4]}/><meshStandardMaterial color="#26372f"/></mesh><mesh position={[0,0,.61]}><planeGeometry args={[.65,.55]}/><meshBasicMaterial ref={window} color={[2.5,1.2,.3]}/></mesh><pointLight ref={light} color="#ffad52" distance={10}/></group>;
}
function Road() {
 const geometry=useMemo(()=>{const curve=new THREE.CatmullRomCurve3(Array.from({length:60},(_,i)=>{const z=-i;const x=Math.sin(i*.16)*6+3;return new THREE.Vector3(x,height(x,z)-1.95,z);}));return new THREE.TubeGeometry(curve,90,.13,4,false);},[]);
 return <mesh geometry={geometry}><meshStandardMaterial color="#6e7266" roughness={1}/></mesh>;
}
function Snow({ count }: { count: number }) {
  const ref = useRef<THREE.Points>(null);
  const positions = useMemo(() => Float32Array.from(Array.from({ length: count * 3 }, (_, i) => Math.sin(i * 89.3) * (i % 3 === 1 ? 18 : 35))), [count]);
  useFrame((_, delta) => { if (ref.current) { ref.current.rotation.y += delta * .008; ref.current.position.y = -((performance.now() * .00015) % 5); } });
  return <points ref={ref}><bufferGeometry><bufferAttribute attach="attributes-position" args={[positions, 3]} /></bufferGeometry><pointsMaterial size={.035} color="#fff8e9" transparent opacity={.45} depthWrite={false} /></points>;
}
function Journey({ reduced }: { reduced: boolean }) {
  const { camera, pointer, scene, invalidate } = useThree();
  useEffect(()=>{const redraw=()=>requestAnimationFrame(()=>invalidate());window.addEventListener('scroll',redraw,{passive:true});return ()=>window.removeEventListener('scroll',redraw);},[invalidate]);
  const light = useRef<THREE.DirectionalLight>(null); const headlight = useRef<THREE.Mesh>(null);
  const target=useMemo(()=>new THREE.Vector3(),[]);const look=useMemo(()=>new THREE.Vector3(0,4,-15),[]);const sky=useMemo(()=>new THREE.Color(),[]);
  const dawn = useMemo(() => new THREE.Color('#c4d2cf'), []); const night = useMemo(() => new THREE.Color('#161d30'), []);
  useFrame(({ clock }, delta) => { const s = sceneState; const alpha = 1 - Math.exp(-delta * 2); camera.position.lerp(target.set(s.x + (reduced ? 0 : pointer.x * .7), s.y + (reduced ? 0 : pointer.y * .3), s.z), alpha); look.lerp(target.set(s.tx,s.ty,s.tz),alpha);camera.lookAt(look);scene.background = sky.copy(dawn).lerp(night,s.phase); if (scene.fog instanceof THREE.FogExp2) scene.fog.color.copy(scene.background); if (light.current) { light.current.color.set(s.phase < .6 ? '#ffe5bc' : '#a9b7e3'); light.current.intensity = 2 - s.phase * 1.35; } if (headlight.current) { const t = clock.elapsedTime * .3 % 45; headlight.current.position.set(Math.sin(t * .16) * 6 + 3, height(Math.sin(t*.16)*6+3,-t)-1.7, -t); } });
  return <><ambientLight intensity={.8} /><directionalLight ref={light} position={[-20,30,15]} /><mesh ref={headlight}><sphereGeometry args={[.07,8,8]} /><meshBasicMaterial color={[4,2.5,1]} /></mesh></>;
}
function Loading() { const { active, progress } = useProgress(); return active ? <div className="scene-loading" role="status"><svg viewBox="0 0 100 40" aria-hidden="true"><path d="M0 38 25 15 35 23 55 2 76 27 85 18 100 38" stroke="currentColor" fill="none"/></svg>Finding the mountains <small>{Math.round(progress)}%</small></div> : null; }
export default function MountainScene() {
  const [low, setLow] = useState(true); const [hidden, setHidden] = useState(false); const [reduced, setReduced] = useState(false);
  useEffect(() => { const query = matchMedia('(prefers-reduced-motion: reduce)'); const update = () => { setReduced(query.matches); setLow(query.matches || navigator.hardwareConcurrency <= 4 || innerWidth < 768); }; const visibility = () => setHidden(document.hidden); update(); query.addEventListener('change', update); document.addEventListener('visibilitychange', visibility); return () => { query.removeEventListener('change', update); document.removeEventListener('visibilitychange', visibility); }; }, []);
  return <><div className="mountain-canvas" aria-hidden="true"><Canvas camera={{ position: [0,10,27], fov: 48 }} dpr={low ? 1 : [1,1.5]} frameloop={hidden ? 'never' : reduced ? 'demand' : 'always'} gl={{ antialias: !low, alpha: false, powerPreference: 'low-power' }}><fogExp2 attach="fog" args={['#bdcac7',.016]} /><Suspense fallback={null}><Journey reduced={reduced} /><Terrain low={low} /><Forest count={low ? 130 : 420} /><River /><Road /><Cabin position={[-6,-.5,-3]} /><Cabin position={[7,-.2,-8]} />{!reduced && <Snow count={low ? 100 : 360} />}<Stars radius={90} depth={30} count={low ? 400 : 1400} factor={2} fade speed={reduced ? 0 : .1} />{!low && <Clouds texture="/images/cloud.png" material={THREE.MeshBasicMaterial}><Cloud position={[-12,5,-24]} bounds={[20,1,8]} volume={12} opacity={.16} speed={.08} segments={12} color="#e5ebe5" /><Cloud position={[15,7,-42]} bounds={[25,2,10]} volume={15} opacity={.2} speed={.05} segments={12} /></Clouds>}{!low && <EffectComposer multisampling={0}><Bloom luminanceThreshold={1} intensity={.25} mipmapBlur /><Vignette darkness={.3} offset={.4} /><Noise opacity={.018} /></EffectComposer>}<PerformanceMonitor onDecline={() => setLow(true)} /></Suspense></Canvas></div><Loading /></>;
}
