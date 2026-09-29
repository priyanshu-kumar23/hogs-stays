'use client';
import { useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sky as DreiSky, Environment, useTexture } from '@react-three/drei';
import * as THREE from 'three';
import { sceneState } from '@/lib/cameraPath';
export default function Sky() {
 const texture=useTexture('/textures/himalayan-sky.webp');
 const uniforms=useMemo(()=>({phase:{value:0},skyMap:{value:texture}}),[texture]);
 useFrame(()=>{uniforms.phase.value=sceneState.phase;});
 return <><mesh><sphereGeometry args={[1700,32,16]}/><shaderMaterial side={THREE.BackSide} depthWrite={false} toneMapped={false} uniforms={uniforms}
 vertexShader={`varying vec3 direction;void main(){direction=position;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`}
 fragmentShader={`varying vec3 direction;uniform float phase;uniform sampler2D skyMap;void main(){vec3 d=normalize(direction);float h=max(d.y,0.);vec2 uv=vec2(atan(d.x,-d.z)/2.0+.5,clamp(asin(h)/.78,0.,1.));uv.x=1.-abs(mod(uv.x,2.)-1.);vec3 morning=texture2D(skyMap,uv).rgb;float gradient=pow(clamp(h*2.,0.,1.),.55);vec3 dusk=morning*vec3(.83,.65,.60);vec3 night=mix(vec3(.055,.085,.14),vec3(.008,.019,.045),gradient);vec3 color=mix(morning,dusk,smoothstep(.28,.65,phase));color=mix(color,night,smoothstep(.65,1.,phase));gl_FragColor=vec4(color,1.);}`}/></mesh>
 <Environment resolution={64} frames={1}><DreiSky sunPosition={[180,60,100]} turbidity={2} rayleigh={1.5}/></Environment></>;
}
