'use client';
import { useEffect, useState } from 'react';
// Single source of truth for how much of the prayer-flags hero scene a device gets.
// 'static' covers no-WebGL2, prefers-reduced-motion, and low-end hardware alike.
export type DeviceTier = 'desktop' | 'tablet' | 'mobile' | 'static';
export interface TierConfig {
  tier: DeviceTier;
  dpr: [number, number];
  ridgeLayers: number;
  flagStrings: number;
  particleCount: number;
  postFx: boolean;
  parallax: 'mouse' | 'gyro' | 'none';
}
const STATIC: TierConfig = { tier: 'static', dpr: [1, 1], ridgeLayers: 0, flagStrings: 0, particleCount: 0, postFx: false, parallax: 'none' };

function supportsWebGL2() {
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl2');
    gl?.getExtension('WEBGL_lose_context')?.loseContext();
    return Boolean(gl);
  } catch { return false; }
}

function computeTier(): TierConfig {
  if (typeof window === 'undefined') return STATIC;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const cores = navigator.hardwareConcurrency || 4;
  if (reduced || cores <= 2 || !supportsWebGL2()) return STATIC;
  const width = window.innerWidth;
  if (width >= 1024 && cores >= 4) return { tier: 'desktop', dpr: [1, 2], ridgeLayers: 7, flagStrings: 3, particleCount: 1500, postFx: true, parallax: 'mouse' };
  if (width >= 768) return { tier: 'tablet', dpr: [1, 1.5], ridgeLayers: 5, flagStrings: 2, particleCount: 600, postFx: false, parallax: 'mouse' };
  return { tier: 'mobile', dpr: [1, 1.25], ridgeLayers: 4, flagStrings: 1, particleCount: 250, postFx: false, parallax: 'gyro' };
}

export function useDeviceTier(): TierConfig {
  const [config, setConfig] = useState<TierConfig>(STATIC);
  useEffect(() => {
    const update = () => setConfig(computeTier());
    update();
    const media = matchMedia('(prefers-reduced-motion: reduce)');
    let resizeFrame = 0;
    const onResize = () => { cancelAnimationFrame(resizeFrame); resizeFrame = requestAnimationFrame(update); };
    window.addEventListener('resize', onResize);
    media.addEventListener('change', update);
    return () => { window.removeEventListener('resize', onResize); media.removeEventListener('change', update); cancelAnimationFrame(resizeFrame); };
  }, []);
  return config;
}
