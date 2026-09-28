'use client';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { PerformanceMonitor } from '@react-three/drei';
import { Bloom, EffectComposer, Noise } from '@react-three/postprocessing';
import { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import type { TierConfig } from '@/lib/useDeviceTier';

const NEAR = new THREE.Color(0.086, 0.149, 0.114); // deodar-green
const FAR = new THREE.Color(0.663, 0.694, 0.714); // pale snow-blue

function ridgeHeight(x: number, seed: number, jaggedness: number) {
  const n = Math.sin(x * 0.15 + seed) * 0.5 + Math.sin(x * 0.37 + seed * 1.7) * 0.25 + Math.sin(x * 0.06 + seed * 3.1) * 0.7;
  return n * jaggedness;
}
function buildRidgeGeometry(seed: number, baseHeight: number, jaggedness: number) {
  const width = 74, segments = 56, bottom = -13;
  const positions: number[] = []; const uvs: number[] = []; const indices: number[] = [];
  for (let i = 0; i <= segments; i++) {
    const x = -width / 2 + (width * i) / segments;
    const top = baseHeight + ridgeHeight(x, seed, jaggedness);
    positions.push(x, top, 0, x, bottom, 0);
    uvs.push(i / segments, 1, i / segments, 0);
    if (i < segments) { const a = i * 2, b = a + 1, c = a + 2, d = a + 3; indices.push(a, b, c, b, d, c); }
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
  geometry.setIndex(indices);
  return geometry;
}
const ridgeVertex = `varying vec2 vUv; void main(){ vUv=uv; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0); }`;
const ridgeFragment = `uniform vec3 uColor; uniform float uSnow; varying vec2 vUv;
void main(){
  vec3 color = uColor;
  float snow = uSnow>0.5 ? smoothstep(0.8,0.95,vUv.y) : 0.0;
  color = mix(color, vec3(0.88,0.91,0.93), snow);
  float warm = uSnow>0.5 ? smoothstep(0.55,0.95,vUv.y)*smoothstep(0.1,0.7,vUv.x)*(1.0-smoothstep(0.72,1.0,vUv.x)) : 0.0;
  color += warm*vec3(0.85,0.51,0.17)*0.55;
  gl_FragColor = vec4(color,1.0);
}`;

function RidgeLayer({ geometry, color, isFar }: { geometry: THREE.BufferGeometry; color: THREE.Color; isFar: boolean }) {
  const uniforms = useMemo(() => ({ uColor: { value: color }, uSnow: { value: isFar ? 1 : 0 } }), [color, isFar]);
  return <mesh geometry={geometry}><shaderMaterial uniforms={uniforms} vertexShader={ridgeVertex} fragmentShader={ridgeFragment} /></mesh>;
}
function Ridges({ config, gyro }: { config: TierConfig; gyro: React.RefObject<{ x: number; y: number }> }) {
  const groups = useRef<(THREE.Group | null)[]>([]);
  const { pointer } = useThree();
  const layers = useMemo(() => Array.from({ length: config.ridgeLayers }, (_, i) => {
    const t = i / Math.max(1, config.ridgeLayers - 1);
    return {
      geometry: buildRidgeGeometry(i * 13.7 + 4.1, 5.5 + i * 1.5, 3.6 - i * 0.32),
      color: NEAR.clone().lerp(FAR, t * 0.92),
      isFar: i === config.ridgeLayers - 1,
      z: -4 - i * 6.6,
    };
  }), [config.ridgeLayers]);
  useFrame(() => {
    layers.forEach((layer, i) => {
      const group = groups.current[i]; if (!group) return;
      const depth = (i + 1) / layers.length;
      const tx = config.parallax === 'mouse' ? pointer.x * depth * 1.5 : config.parallax === 'gyro' ? gyro.current.x * depth * 1.5 : 0;
      const ty = config.parallax === 'mouse' ? pointer.y * depth * 0.7 : config.parallax === 'gyro' ? gyro.current.y * depth * 0.7 : 0;
      group.position.x += (tx - group.position.x) * 0.05;
      group.position.y += (ty - group.position.y) * 0.05;
    });
  });
  return <>{layers.map((layer, i) => <group key={i} ref={el => { groups.current[i] = el; }} position={[0, 0, layer.z]}>
    <RidgeLayer geometry={layer.geometry} color={layer.color} isFar={layer.isFar} />
  </group>)}</>;
}

const fogFragment = `uniform float uTime; uniform float uOpacity; varying vec2 vUv;
float hash(vec2 p){ return fract(sin(dot(p,vec2(41.3,289.1)))*43758.5); }
void main(){
  vec2 uv=vUv; uv.x+=uTime*0.012;
  float n=hash(floor(uv*vec2(9.0,3.0)));
  float band=smoothstep(0.0,0.5,vUv.y)*smoothstep(1.0,0.55,vUv.y);
  float alpha=band*(0.3+n*0.18)*uOpacity;
  gl_FragColor=vec4(vec3(0.75,0.78,0.8),alpha);
}`;
function FogBand({ z, opacity }: { z: number; opacity: number }) {
  const uniforms = useMemo(() => ({ uTime: { value: 0 }, uOpacity: { value: opacity } }), [opacity]);
  useFrame(({ clock }) => { uniforms.uTime.value = clock.elapsedTime; });
  return <mesh position={[0, 1, z]}><planeGeometry args={[76, 7]} /><shaderMaterial transparent depthWrite={false} uniforms={uniforms} vertexShader={ridgeVertex} fragmentShader={fogFragment} /></mesh>;
}

const FLAG_COLORS = ['#9c4a3c', '#c9a24a', '#4a6b52', '#3d5a73', '#d8cdb8'];
const flagVertex = `attribute float phase; attribute vec3 flagColor; uniform float uTime; varying vec3 vColor; varying vec2 vUv;
void main(){
  vUv=uv; vColor=flagColor;
  vec3 pos=position;
  float t=clamp(-pos.y/0.34,0.0,1.0);
  float wind=sin(uTime*1.6+phase+pos.x*3.0)*0.16*t + sin(uTime*0.7+phase*1.3)*0.05*t;
  pos.x+=wind; pos.z+=wind*0.4;
  #ifdef USE_INSTANCING
    vec4 world = instanceMatrix*vec4(pos,1.0);
  #else
    vec4 world = vec4(pos,1.0);
  #endif
  gl_Position=projectionMatrix*modelViewMatrix*world;
}`;
const flagFragment = `varying vec3 vColor; varying vec2 vUv;
void main(){
  float edge=smoothstep(0.0,0.14,min(vUv.x,1.0-vUv.x))*smoothstep(0.0,0.14,min(vUv.y,1.0-vUv.y));
  vec3 color=vColor+(1.0-edge)*0.35;
  gl_FragColor=vec4(color,1.0);
}`;
function PrayerFlags({ strings }: { strings: number }) {
  const mesh = useRef<THREE.InstancedMesh>(null);
  const perString = 13;
  const count = Math.max(1, strings) * perString;
  const uniforms = useMemo(() => ({ uTime: { value: 0 } }), []);
  useFrame(({ clock }) => { uniforms.uTime.value = clock.elapsedTime; });
  const geometry = useMemo(() => {
    const base = new THREE.PlaneGeometry(0.46, 0.34, 3, 3);
    base.translate(0, -0.17, 0);
    const phase = new Float32Array(count); const color = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) { phase[i] = i * 1.7 + Math.floor(i / perString) * 3.1; const c = new THREE.Color(FLAG_COLORS[i % FLAG_COLORS.length]); color.set([c.r, c.g, c.b], i * 3); }
    base.setAttribute('phase', new THREE.InstancedBufferAttribute(phase, 1));
    base.setAttribute('flagColor', new THREE.InstancedBufferAttribute(color, 3));
    return base;
  }, [count]);
  useEffect(() => {
    if (!mesh.current) return;
    const object = new THREE.Object3D();
    for (let s = 0; s < strings; s++) {
      const stringZ = -1.4 - s * 1.15; const xStart = -9 + s * 1.4; const xEnd = 9 - s * 1.4; const yTop = 2.5 - s * 0.45; const sag = 1.5 + s * 0.35;
      for (let f = 0; f < perString; f++) {
        const idx = s * perString + f; const t = f / (perString - 1);
        const x = THREE.MathUtils.lerp(xStart, xEnd, t); const y = yTop - sag * 4 * t * (1 - t);
        object.position.set(x, y, stringZ + Math.sin(t * Math.PI) * 0.15);
        object.rotation.set(0, Math.sin(idx * 12.9) * 0.15, 0);
        object.scale.setScalar(0.85 + (idx % 5) * 0.03);
        object.updateMatrix(); mesh.current.setMatrixAt(idx, object.matrix);
      }
    }
    mesh.current.instanceMatrix.needsUpdate = true;
  }, [strings]);
  return <instancedMesh ref={mesh} args={[geometry, undefined, count]}><shaderMaterial uniforms={uniforms} vertexShader={flagVertex} fragmentShader={flagFragment} side={THREE.DoubleSide} /></instancedMesh>;
}

function Deodars({ count }: { count: number }) {
  const mesh = useRef<THREE.InstancedMesh>(null);
  useEffect(() => {
    if (!mesh.current) return;
    const object = new THREE.Object3D();
    for (let i = 0; i < count; i++) {
      const side = i % 2 === 0 ? -1 : 1; const x = side * (9.5 + (i * 1.3) % 7); const z = -2 - (i * 2.6) % 13; const h = 2.2 + (i * 0.37) % 1.7;
      object.position.set(x, h / 2 - 1.6, z); object.scale.set(h * 0.36, h, h * 0.36); object.updateMatrix();
      mesh.current.setMatrixAt(i, object.matrix);
    }
    mesh.current.instanceMatrix.needsUpdate = true;
  }, [count]);
  return <instancedMesh ref={mesh} args={[undefined, undefined, count]}><coneGeometry args={[1, 1, 6]} /><meshBasicMaterial color="#0d1712" /></instancedMesh>;
}

function Motes({ count }: { count: number }) {
  const ref = useRef<THREE.Points>(null);
  const positions = useMemo(() => Float32Array.from(Array.from({ length: count * 3 }, (_, i) => {
    const axis = i % 3;
    if (axis === 0) return (Math.sin(i * 12.9) * 0.5 + 0.5) * 30 - 15;
    if (axis === 1) return (Math.sin(i * 7.3) * 0.5 + 0.5) * 9 - 1;
    return -((Math.sin(i * 3.7) * 0.5 + 0.5) * 32) - 1;
  })), [count]);
  useFrame((_, delta) => { if (ref.current) { ref.current.rotation.y += delta * 0.01; ref.current.position.y = Math.sin(performance.now() * 0.0002) * 0.3; } });
  return <points ref={ref}><bufferGeometry><bufferAttribute attach="attributes-position" args={[positions, 3]} /></bufferGeometry><pointsMaterial size={0.045} color="#f7dfb0" transparent opacity={0.5} depthWrite={false} /></points>;
}

function DawnSun() {
  return <group position={[4, 3.6, -41]}>
    <mesh><circleGeometry args={[3.4, 32]} /><meshBasicMaterial color="#f2c98a" transparent opacity={0.5} blending={THREE.AdditiveBlending} depthWrite={false} /></mesh>
    <mesh><circleGeometry args={[1.5, 32]} /><meshBasicMaterial color="#ffe6b0" transparent opacity={0.85} blending={THREE.AdditiveBlending} depthWrite={false} /></mesh>
  </group>;
}
const rayFragment = `varying vec2 vUv; void main(){ float a=(1.0-vUv.y)*smoothstep(0.0,0.5,1.0-abs(vUv.x-0.5)*2.0)*0.14; gl_FragColor=vec4(vec3(1.0,0.82,0.55),a); }`;
function GodRays() {
  const rays = useMemo(() => Array.from({ length: 6 }, (_, i) => ({ angle: -0.5 + i * 0.18, len: 22 + (i % 3) * 4 })), []);
  return <group position={[4, 3.6, -40]}>{rays.map((r, i) => <mesh key={i} rotation={[0, 0, r.angle]} position={[0, -r.len / 2 + 1, 0.2]}>
    <planeGeometry args={[1.1, r.len]} />
    <shaderMaterial transparent depthWrite={false} blending={THREE.AdditiveBlending} vertexShader={ridgeVertex} fragmentShader={rayFragment} />
  </mesh>)}</group>;
}

function Rig({ paused }: { paused: boolean }) {
  const { camera } = useThree();
  const base = useMemo(() => new THREE.Vector3(0, 2.1, 9), []);
  useEffect(() => { camera.position.copy(base); camera.lookAt(0, 1.6, -20); }, [camera, base]);
  useFrame(() => {
    if (paused) return;
    const hero = document.getElementById('home'); if (!hero) return;
    const rect = hero.getBoundingClientRect();
    const progress = THREE.MathUtils.clamp(-rect.top / Math.max(1, rect.height), 0, 1);
    camera.position.z = base.z - progress * 6.5;
    camera.position.y = base.y + progress * 1.2;
    camera.lookAt(0, 1.6 + progress * 0.6, -20);
  });
  return null;
}

export default function PrayerFlagsScene({ config, gyro }: { config: TierConfig; gyro: React.RefObject<{ x: number; y: number }> }) {
  const [hidden, setHidden] = useState(false);
  const [degraded, setDegraded] = useState(false);
  useEffect(() => {
    const hero = document.getElementById('home');
    const visibility = () => setHidden(document.hidden);
    document.addEventListener('visibilitychange', visibility);
    let observer: IntersectionObserver | undefined;
    if (hero) { observer = new IntersectionObserver(([entry]) => setHidden(document.hidden || !entry.isIntersecting), { threshold: 0.01 }); observer.observe(hero); }
    return () => { document.removeEventListener('visibilitychange', visibility); observer?.disconnect(); };
  }, []);
  const postFx = config.postFx && !degraded;
  return <Canvas camera={{ position: [0, 2.1, 9], fov: 46 }} dpr={degraded ? [1, 1] : config.dpr} frameloop={hidden ? 'never' : 'always'} gl={{ antialias: config.tier === 'desktop', alpha: false, powerPreference: 'low-power' }}>
    <color attach="background" args={['#101c17']} />
    <fogExp2 attach="fog" args={['#1a2620', 0.02]} />
    <Suspense fallback={null}>
      <Rig paused={hidden} />
      <ambientLight intensity={0.6} />
      <DawnSun />
      {postFx && <GodRays />}
      <Ridges config={config} gyro={gyro} />
      <FogBand z={-14} opacity={0.55} />
      <FogBand z={-30} opacity={0.4} />
      <PrayerFlags strings={config.flagStrings} />
      <Deodars count={config.tier === 'desktop' ? 22 : 14} />
      <Motes count={config.particleCount} />
      {postFx && <EffectComposer multisampling={0}><Bloom luminanceThreshold={0.9} intensity={0.3} mipmapBlur /><Noise opacity={0.02} /></EffectComposer>}
      <PerformanceMonitor onDecline={() => setDegraded(true)} />
    </Suspense>
  </Canvas>;
}
