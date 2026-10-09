'use client';
import { Component, Suspense, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { ContactShadows } from '@react-three/drei/core/ContactShadows';
import { Environment } from '@react-three/drei/core/Environment';
import { useTexture } from '@react-three/drei/core/Texture';
import { Bloom, EffectComposer } from '@react-three/postprocessing';
import * as THREE from 'three';
import { COFFEE_Y, cupInnerRadiusAt, makeCoffeeTexture, makeCupBody, makeGlazeTextures, makeHandle, makeSaucer, makeSpoonBowl, makeSpoonHandle, SAUCER_WELL_Y, type LatteArt } from './coffeeCupParts';

/** Latte art on the coffee: 'rosetta' (default) or 'mountains' (three Himalayan peaks in milk foam). */
const LATTE_ART: LatteArt = 'rosetta';

class Boundary extends Component<{ children: ReactNode; onFailure: () => void }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch() { this.props.onFailure(); }
  render() { return this.state.failed ? null : this.props.children; }
}

// Steam: a few soft, translucent ribbons that widen and fade as they rise (noise-masked, no hard edges).
const steamVertex = `varying vec2 vUv;uniform float time;uniform float seed;
void main(){vUv=uv;vec3 p=position;float h=uv.y;p.x+=sin(h*4.2+time*.35+seed)*.11*h+sin(h*9.+time*.5+seed*2.)*.03*h;gl_Position=projectionMatrix*modelViewMatrix*vec4(p,1.);}`;
const steamFragment = `varying vec2 vUv;uniform float time;uniform float seed;
float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float noise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(hash(i),hash(i+vec2(1,0)),f.x),mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),f.x),f.y);}
float fbm(vec2 p){float v=0.,a=.5;for(int i=0;i<4;i++){v+=a*noise(p);p=p*2.03+3.1;a*=.5;}return v;}
void main(){float y=vUv.y;float x=(vUv.x-.5)*2.;float width=mix(.28,.95,y);float edge=smoothstep(width,0.,abs(x));
float fadeIn=smoothstep(0.,.2,y);float fadeOut=1.-smoothstep(.5,1.,y);
float n=fbm(vec2(vUv.x*3.+seed,y*3.8-time*.16));float mask=smoothstep(.32,.78,n);
float alpha=edge*fadeIn*fadeOut*mask*.22;gl_FragColor=vec4(1.,.97,.93,alpha);}`;
function Steam({ reduced }: { reduced: boolean }) {
  const group = useRef<THREE.Group>(null);
  const materials = useMemo(() => Array.from({ length: 4 }, (_, i) => new THREE.ShaderMaterial({
    vertexShader: steamVertex, fragmentShader: steamFragment, uniforms: { time: { value: 4 }, seed: { value: i * 3.7 } }, transparent: true, depthWrite: false, side: THREE.DoubleSide,
  })), []);
  useEffect(() => () => materials.forEach(m => m.dispose()), [materials]);
  useFrame(({ clock, camera }) => {
    group.current?.children.forEach(mesh => mesh.quaternion.copy(camera.quaternion)); // face the camera
    if (!reduced) materials.forEach(m => { m.uniforms.time.value = clock.elapsedTime; }); // reduced motion: steam stays as a still frame
  });
  return <group ref={group} position={[0, COFFEE_Y + 0.05, 0]}>
    {materials.map((material, i) => <mesh key={i} position={[(i - 1.5) * 0.12, 0.9, (i - 1.5) * 0.08]} material={material} renderOrder={5}><planeGeometry args={[0.75, 1.9, 1, 24]} /></mesh>)}
  </group>;
}

function World({ reduced, mobile, onReady }: { reduced: boolean; mobile: boolean; onReady: () => void }) {
  const group = useRef<THREE.Group>(null);
  const ready = useRef(false);
  const tilt = useRef({ x: 0, y: 0 }); // device tilt on phones (only when the browser allows it without a permission prompt)
  const source = useTexture(['/textures/cafe/wood-color.webp', '/textures/cafe/wood-normal.webp', '/textures/cafe/wood-roughness.webp']);
  const wood = useMemo(() => source.map((texture, i) => {
    const t = texture.clone();
    t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(2.5, 2.5); t.anisotropy = 4;
    t.colorSpace = i === 0 ? THREE.SRGBColorSpace : THREE.NoColorSpace; t.needsUpdate = true;
    return t;
  }), [source]);
  const glaze = useMemo(makeGlazeTextures, []);
  const coffee = useMemo(() => makeCoffeeTexture(LATTE_ART), []);
  const parts = useMemo(() => ({ body: makeCupBody(), saucer: makeSaucer(), handle: makeHandle(), bowl: makeSpoonBowl(), spoonHandle: makeSpoonHandle() }), []);
  const coffeeRadius = useMemo(() => cupInnerRadiusAt(COFFEE_Y) + 0.004, []);
  useEffect(() => () => {
    wood.forEach(t => t.dispose()); glaze.color.dispose(); glaze.roughness.dispose(); coffee.dispose();
    Object.values(parts).forEach(g => g.dispose());
  }, [wood, glaze, coffee, parts]);

  useEffect(() => {
    if (reduced || !mobile) return;
    const DeviceOrientation = window.DeviceOrientationEvent as unknown as { requestPermission?: unknown } | undefined;
    if (!DeviceOrientation || typeof DeviceOrientation.requestPermission === 'function') return; // iOS needs a permission prompt: skip, the idle float still plays
    const onTilt = (event: DeviceOrientationEvent) => {
      tilt.current.x = THREE.MathUtils.clamp((event.gamma ?? 0) / 40, -1, 1);
      tilt.current.y = THREE.MathUtils.clamp(((event.beta ?? 45) - 45) / 40, -1, 1);
    };
    window.addEventListener('deviceorientation', onTilt);
    return () => window.removeEventListener('deviceorientation', onTilt);
  }, [reduced, mobile]);

  useFrame(({ clock, pointer }, delta) => {
    if (!ready.current) { ready.current = true; onReady(); }
    const g = group.current;
    if (!g || reduced) return;
    const t = clock.elapsedTime;
    const px = mobile ? tilt.current.x : pointer.x, py = mobile ? tilt.current.y : pointer.y;
    g.rotation.y = THREE.MathUtils.damp(g.rotation.y, Math.sin(t * 0.12) * 0.07 + px * 0.09, 2.5, delta); // slow idle turn plus parallax; the handle stays on the right
    g.rotation.x = THREE.MathUtils.damp(g.rotation.x, -py * 0.025, 2.5, delta);
    g.rotation.z = THREE.MathUtils.damp(g.rotation.z, -px * 0.02, 2.5, delta);
    g.position.y = Math.sin(t * 0.5) * 0.01;
  });

  const ceramic = <meshPhysicalMaterial color="#ffffff" map={glaze.color} roughnessMap={glaze.roughness} roughness={0.5} clearcoat={1} clearcoatRoughness={0.1} metalness={0} ior={1.48} envMapIntensity={0.6} />;
  const steel = <meshPhysicalMaterial color="#d3d5d8" metalness={1} roughness={0.3} envMapIntensity={1.1} />;
  return <>
    <Environment files="/hdri/comfy_cafe_1k.hdr" environmentIntensity={0.55} />
    <hemisphereLight args={["#fff1dc", "#6a4e38", 1.35]} />
    {/* warm key from the upper left (window light), soft cool fill from the right, rim from behind to lift the cup off the dark background */}
    <directionalLight position={[-3.6, 5.6, 3.2]} color="#ffdcae" intensity={3.3} castShadow shadow-mapSize={[1024, 1024]} shadow-camera-left={-2.6} shadow-camera-right={2.6} shadow-camera-top={2.6} shadow-camera-bottom={-2.6} shadow-camera-near={0.5} shadow-camera-far={14} shadow-bias={-0.0012} shadow-normalBias={0.06} shadow-radius={5} />
    <directionalLight position={[3.4, 2.4, 3.8]} color="#dbe5f2" intensity={1.0} />
    <directionalLight position={[1.2, 1.6, 6]} color="#ffeccf" intensity={1.1} />
    <directionalLight position={[2.6, 3.2, -4.2]} color="#fff0d8" intensity={1.7} />
    <mesh position={[0, -0.09, 0]} receiveShadow>
      <cylinderGeometry args={[5, 5, 0.16, 96]} />
      <meshStandardMaterial map={wood[0]} normalMap={wood[1]} roughnessMap={wood[2]} normalScale={new THREE.Vector2(0.7, 0.7)} roughness={1} color="#8f7a66" />
    </mesh>
    <group ref={group}>
      <mesh geometry={parts.saucer} castShadow receiveShadow>{ceramic}</mesh>
      <group position={[0, SAUCER_WELL_Y, 0]}>
        <mesh geometry={parts.body} castShadow>{ceramic}</mesh>
        <mesh geometry={parts.handle} castShadow>{ceramic}</mesh>
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, COFFEE_Y, 0]}>
          <circleGeometry args={[coffeeRadius, 128]} />
          <meshPhysicalMaterial map={coffee} roughness={0.3} clearcoat={0.6} clearcoatRoughness={0.14} ior={1.333} envMapIntensity={0.6} />
        </mesh>
      </group>
      <group position={[0.38, 0.21, 1.2]} rotation={[0, -0.12, 0]}> {/* teaspoon resting on the saucer rim */}
        <mesh geometry={parts.bowl} position={[0.22, 0.045, 0]} castShadow receiveShadow><meshPhysicalMaterial color="#d3d5d8" metalness={1} roughness={0.28} side={THREE.DoubleSide} envMapIntensity={1.1} /></mesh>
        <mesh geometry={parts.spoonHandle} position={[0.02, 0.02, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>{steel}</mesh>
      </group>
      <Steam reduced={reduced} />
    </group>
    <ContactShadows position={[0, 0.002, 0]} opacity={0.55} scale={7} blur={2.2} far={1.4} resolution={512} frames={1} />
    {!reduced && !mobile && <EffectComposer multisampling={0}><Bloom luminanceThreshold={1.4} intensity={0.1} mipmapBlur /></EffectComposer>}
  </>;
}

export default function CoffeeCup({ visible, reduced }: { visible: boolean; reduced: boolean }) {
  const [ready, setReady] = useState(false), [failed, setFailed] = useState(false);
  const mobile = useMemo(() => matchMedia('(max-width:767px)').matches, []);
  return <Boundary onFailure={() => setFailed(true)}>
    {!failed && <div className="cs-cup-canvas" aria-hidden="true" style={{ opacity: ready ? 1 : 0 }}>
      <Canvas shadows frameloop={!visible ? 'never' : reduced ? 'demand' : 'always'} dpr={mobile ? [1, 1.5] : [1, 2]} camera={{ position: [3.0, 4.5, 5.1], fov: 38 }}
        gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping, outputColorSpace: THREE.SRGBColorSpace }}
        onCreated={({ gl }) => { gl.toneMappingExposure = 1.2; gl.domElement.addEventListener('webglcontextlost', () => setFailed(true), { once: true }); }}>
        <color attach="background" args={['#25180f']} />
        <Suspense fallback={null}><World reduced={reduced} mobile={mobile} onReady={() => setReady(true)} /></Suspense>
      </Canvas>
    </div>}
  </Boundary>;
}
