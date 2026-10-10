'use client';
import dynamic from 'next/dynamic';
import { Component, type ReactNode, useCallback, useEffect, useState } from 'react';

// The 3D scene never blocks the site: the page renders underneath, a sharp still of the same 3D terrain (same camera, no blur)
// shows instantly, and the live canvas crossfades over it as soon as its first frames are drawn. No intro overlay, no timers.
// The still is also the fallback when WebGL is unavailable, the scene fails, or reduced motion is on.
const HimalayanScene = dynamic(() => import('./HimalayanScene'), { ssr: false });

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
    if (reduced || forcedPhoto) return;
    // The poster is the LCP: start the 3D chunk and WebGL only once the page has loaded and the browser is idle.
    let cancelled = false; let idle = 0; let timer = 0;
    const start = () => { if (!cancelled) setEnabled(webglAvailable()); };
    const hasIdle = typeof window.requestIdleCallback === 'function' && typeof window.cancelIdleCallback === 'function';
    const schedule = () => { if (hasIdle) idle = window.requestIdleCallback(start, { timeout: 2500 }); else timer = window.setTimeout(start, 800); };
    if (document.readyState === 'complete') schedule(); else window.addEventListener('load', schedule, { once: true });
    return () => {
      cancelled = true; window.removeEventListener('load', schedule);
      if (idle) window.cancelIdleCallback(idle); window.clearTimeout(timer);
      document.documentElement.classList.remove('landscape-ready');
    };
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
