'use client';
import { useEffect,useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import * as THREE from 'three';
export default function MountainTerrain({low}:{low:boolean}) {
 const maps=useTexture([low?'/textures/manali-satellite-mobile.webp':'/textures/manali-satellite.webp','/textures/rock-normal.webp','/textures/rock-roughness.webp','/textures/rock-ao.webp','/textures/alpine-canopy.webp','/textures/rock-color.webp']);
 const material=useMemo(()=>{
  const textures=maps.map((map,index)=>{const t=map.clone();t.wrapS=t.wrapT=THREE.RepeatWrapping;t.repeat.set(index>0&&index<4?90:1,index>0&&index<4?100:1);t.anisotropy=low?2:8;t.needsUpdate=true;return t;});
  textures[0].colorSpace=THREE.SRGBColorSpace;textures[4].colorSpace=THREE.SRGBColorSpace;textures[5].colorSpace=THREE.SRGBColorSpace;
  const m=new THREE.MeshStandardMaterial({map:textures[0],normalMap:textures[1],normalScale:new THREE.Vector2(.16,.16),roughnessMap:textures[2],aoMap:low?null:textures[3],aoMapIntensity:.18,roughness:.96,metalness:0});
  m.customProgramCacheKey=()=>'himalayan-canopy-v5-'+low;
  const time={value:0};m.userData.time=time;
  m.onBeforeCompile=shader=>{
   shader.uniforms.uWeatherTime=time;shader.uniforms.uCanopy={value:textures[4]};shader.uniforms.uRockDetail={value:textures[5]};
   shader.vertexShader=shader.vertexShader.replace('#include <common>','#include <common>\nvarying vec3 vTerrain; varying float vSlope;');
   shader.vertexShader=shader.vertexShader.replace('#include <begin_vertex>','#include <begin_vertex>\nvTerrain=(modelMatrix*vec4(position,1.)).xyz;vSlope=normalize(mat3(modelMatrix)*normal).y;');
   shader.fragmentShader=shader.fragmentShader.replace('#include <common>',`#include <common>
    varying vec3 vTerrain; varying float vSlope;
    uniform float uWeatherTime;uniform sampler2D uCanopy;uniform sampler2D uRockDetail;
    float snowHash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
    float snowNoise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(snowHash(i),snowHash(i+vec2(1,0)),f.x),mix(snowHash(i+vec2(0,1)),snowHash(i+vec2(1,1)),f.x),f.y);}
   `);
   // The color map is registered Sentinel-2 imagery: real rock strata, forest and snow.
   // Seasonal snow accumulates by altitude, slope and wind-drift noise.
   shader.fragmentShader=shader.fragmentShader.replace('#include <map_fragment>',`#include <map_fragment>
    float drift=snowNoise(vTerrain.xz*.22)*${low?'1.':' .65'}${low?'':'+snowNoise(vTerrain.xz*.91)*.35'};
    float snowline=30.+(drift-.5)*5.;
    float altitude=smoothstep(snowline,snowline+9.,vTerrain.y);
    float slope=smoothstep(.27,.73,vSlope);
    float summit=smoothstep(32.,44.,vTerrain.y);
    float snow=clamp(altitude*mix(slope,1.,summit*.72),0.,1.);
    float luminance=dot(diffuseColor.rgb,vec3(.2126,.7152,.0722));
    vec3 rock=mix(diffuseColor.rgb,vec3(luminance)*vec3(.94,.98,1.02),.18);
    float treeLine=1.-smoothstep(17.,27.,vTerrain.y);
    float vegetation=treeLine*smoothstep(.28,.65,vSlope);
    float canopy=snowNoise(vTerrain.xz*6.);
    vec3 forest=mix(vec3(.022,.043,.017),vec3(.095,.135,.048),drift*.6+canopy*.4);
    forest*=mix(.6,1.55,smoothstep(.015,.23,luminance));
    vec3 canopyDetail=texture2D(uCanopy,vTerrain.xz*.12).rgb;
    vec3 canopyVariation=texture2D(uCanopy,vTerrain.xz*.071+vec2(.37,.61)).rgb;
    vec3 organic=mix(canopyDetail,canopyVariation,.27);
    organic*=mix(.75,1.3,smoothstep(.015,.2,luminance));
    vec3 stone=texture2D(uRockDetail,vTerrain.xz*.17+vTerrain.yy*.12).rgb;
    rock=mix(rock,stone*vec3(.86,.89,.91),.12*(1.-vegetation));
    // Keep the registered satellite color dominant: detail must not hide real geology.
    rock=mix(rock,organic,vegetation*.28);
    rock*=mix(.92,1.07,canopy*vegetation+(1.-vegetation)*.65);
    float ice=smoothstep(.58,.83,drift)*smoothstep(26.,40.,vTerrain.y)*(1.-smoothstep(.72,.95,vSlope));
    vec3 snowColor=mix(vec3(.65,.74,.82),vec3(.94,.96,.98),drift);
    snowColor=mix(snowColor,vec3(.44,.64,.75),ice*.45);
    snowColor*=mix(.87,1.04,smoothstep(.02,.42,luminance));
    diffuseColor.rgb=mix(rock,snowColor,snow*.92);
    float cloudShade=smoothstep(.4,.8,snowNoise(vTerrain.xz*.024+vec2(uWeatherTime*.0015,0.)));
    diffuseColor.rgb*=1.-cloudShade*.045;
   `);
   shader.fragmentShader=shader.fragmentShader.replace('#include <roughnessmap_fragment>', '#include <roughnessmap_fragment>\nroughnessFactor=mix(roughnessFactor,mix(.92,.56,ice),snow);');
   shader.fragmentShader=shader.fragmentShader.replace('#include <fog_fragment>',`#include <fog_fragment>
    #ifdef USE_FOG
    float valleyMist=(1.-smoothstep(5.,30.,vTerrain.y))*(1.-exp(-vFogDepth*.0014));
    gl_FragColor.rgb=mix(gl_FragColor.rgb,fogColor,valleyMist*.28);
    #endif
   `);
  };
  m.userData.ownedTextures=textures;return m;
 },[maps,low]);
 useEffect(()=>()=>{material.dispose();material.userData.ownedTextures.forEach((texture:THREE.Texture)=>texture.dispose());},[material]);
 useFrame(({clock})=>{material.userData.time.value=low?0:clock.elapsedTime;});
 return <primitive object={material} attach="material"/>;
}
