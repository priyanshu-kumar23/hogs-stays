'use client';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { Component, type ReactNode, useCallback, useEffect, useState } from 'react';

// The 3D scene is never allowed to block the site: the page content renders underneath, the intro
// overlay has a hard timeout (also enforced in CSS in case JS never runs), and any failure falls back to a still image.
const HimalayanScene = dynamic(() => import('./HimalayanScene'), { ssr: false });
const LOADER_TIMEOUT_MS = 4000;
const SEEN_KEY = 'hogs-intro-seen';

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

// Runs before first paint (inline in the server HTML) so a repeat visit in the same session never flashes the loader.
const seenScript = `try{if(sessionStorage.getItem('${SEEN_KEY}'))document.documentElement.classList.add('hogs-intro-seen')}catch(e){}`;

export default function SceneLoader() {
  const [enabled, setEnabled] = useState(false);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const [loaderDone, setLoaderDone] = useState(false);

  const dismissLoader = useCallback(() => {
    setLoaderDone(true);
    try { sessionStorage.setItem(SEEN_KEY, '1'); } catch { /* storage blocked: loader may show again, harmless */ }
  }, []);
  const failure = useCallback(() => {
    setEnabled(false); setReady(false); setFailed(true); setLoaderDone(true);
    document.documentElement.classList.remove('landscape-ready');
  }, []);
  const loaded = useCallback(() => {
    setReady(true); dismissLoader();
    document.documentElement.classList.add('landscape-ready');
  }, [dismissLoader]);

  useEffect(() => {
    const reduced = matchMedia('(prefers-reduced-motion:reduce)').matches;
    const forcedPhoto = new URLSearchParams(location.search).get('scene') === 'photo';
    const supported = !reduced && !forcedPhoto && webglAvailable();
    setEnabled(supported);
    setFailed(!supported);
    if (!supported || document.documentElement.classList.contains('hogs-intro-seen')) setLoaderDone(true);
    // Hard timeout: the overlay always goes away, whatever the scene is doing.
    const timer = setTimeout(dismissLoader, LOADER_TIMEOUT_MS);
    return () => { clearTimeout(timer); document.documentElement.classList.remove('landscape-ready'); };
  }, [dismissLoader]);

  // The still image sits under the 3D canvas until the first frames are drawn, so a slow or stalled scene is never a blank page.
  return <>
    <script dangerouslySetInnerHTML={{ __html: seenScript }} />
    {!ready && <div className="scene-fallback" aria-hidden="true" style={{ position: 'fixed' }}><Image src="/images/manali-valley-reference.png" alt="" fill priority sizes="100vw" /></div>}
    {!loaderDone && <div className="landscape-boot" role="status" aria-live="polite"><span>HOGS</span><small>Opening your mountain view…</small><i /></div>}
    <div className={ready ? 'landscape-world is-ready' : 'landscape-world'}>
      {enabled && <SceneBoundary onFailure={failure}><HimalayanScene onReady={loaded} onFailure={failure} /></SceneBoundary>}
    </div>
  </>;
}
