'use client';
import dynamic from 'next/dynamic';
import { Component, type ReactNode, useCallback, useEffect, useState } from 'react';

// The 3D scene never blocks the site: the page renders underneath, a sharp still of the same 3D terrain (same camera, no blur)
// shows instantly, and the live canvas crossfades over it as soon as its first frames are drawn. No intro overlay, no timers.
// The still is also the fallback when WebGL is unavailable, the scene fails, or reduced motion is on.
const HimalayanScene = dynamic(() => import('./HimalayanScene'), { ssr: false });
if (typeof window !== 'undefined' && !new URLSearchParams(location.search).has('scene')) void import('./HimalayanScene'); // start the chunk download before hydration finishes

class SceneBoundary extends Component<{ children: ReactNode; onFailure: () => void }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch() { this.props.onFailure(); }
  render() { return this.state.failed ? null : this.props.children; }
}

function webglAvailable() {
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl2');
    gl?.getExtension('WEBGL_lose_context')?.loseContext();
    return Boolean(gl);
  } catch { return false; }
}

export default function SceneLoader() {
  const [enabled, setEnabled] = useState(false);
  const [ready, setReady] = useState(false);
  const [posterGone, setPosterGone] = useState(false);

  const failure = useCallback(() => {
    setEnabled(false); setReady(false); setPosterGone(false);
    document.documentElement.classList.remove('landscape-ready');
  }, []);
  const loaded = useCallback(() => {
    setReady(true);
    document.documentElement.classList.add('landscape-ready');
  }, []);

  useEffect(() => {
    const reduced = matchMedia('(prefers-reduced-motion:reduce)').matches;
    const forcedPhoto = new URLSearchParams(location.search).get('scene') === 'photo';
    setEnabled(!reduced && !forcedPhoto && webglAvailable());
    return () => { document.documentElement.classList.remove('landscape-ready'); };
  }, []);
  // Remove the still once the canvas has finished fading in over it.
  useEffect(() => {
    if (!ready) return;
    const timer = setTimeout(() => setPosterGone(true), 600);
    return () => clearTimeout(timer);
  }, [ready]);

  return <>
    {!posterGone && <div className="scene-fallback" aria-hidden="true">
      <picture>
        <source media="(max-width: 700px)" srcSet="/images/hero/hero-3d-poster-mobile.webp" type="image/webp" />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/images/hero/hero-3d-poster.webp" alt="" width={1920} height={1080} fetchPriority="high" decoding="async" />
      </picture>
    </div>}
    <div className={ready ? 'landscape-world is-ready' : 'landscape-world'}>
      {enabled && <SceneBoundary onFailure={failure}><HimalayanScene onReady={loaded} onFailure={failure} /></SceneBoundary>}
    </div>
  </>;
}
