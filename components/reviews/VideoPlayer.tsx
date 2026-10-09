'use client';
import { useCallback, useEffect, useRef, useState, type MouseEvent } from 'react';
import type { GuestVideo } from '@/data/videos';

// Only one testimonial plays at a time.
let active: (() => void) | null = null;

const Icon = ({ name }: { name: 'play' | 'pause' | 'sound' | 'mute' }) => <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
  {name === 'play' && <path d="M8 5v14l11-7z" />}
  {name === 'pause' && <path d="M7 5h4v14H7zM13 5h4v14h-4z" />}
  {name === 'sound' && <path d="M3 9v6h4l5 4V5L7 9zm13.5 3A4.5 4.5 0 0 0 14 8v8a4.5 4.5 0 0 0 2.5-4zM14 3.2v2.1a7 7 0 0 1 0 13.4v2.1a9 9 0 0 0 0-17.6z" />}
  {name === 'mute' && <path d="M16.5 12A4.5 4.5 0 0 0 14 8v2.2l2.4 2.4c.1-.2.1-.4.1-.6zM19 12c0 .9-.2 1.8-.6 2.6l1.5 1.5A9 9 0 0 0 21 12a9 9 0 0 0-7-8.8v2.1A7 7 0 0 1 19 12zM4.3 3 3 4.3 7.7 9H3v6h4l5 4v-6.7l4.3 4.3c-.7.5-1.4.9-2.3 1.1v2.1a9 9 0 0 0 3.6-1.8l2.1 2.1 1.3-1.3L4.3 3zM12 5 9.9 7.1 12 9.2z" />}
</svg>;

/**
 * variant "card": plays on hover (mouse) or tap (touch); one at a time.
 * variant "feature": muted autoplay while in view, tap the video to unmute.
 * The file is only requested once the player gets near the viewport.
 */
export default function VideoPlayer({ video, variant = 'card' }: { video: GuestVideo; variant?: 'card' | 'feature' }) {
  const frame = useRef<HTMLDivElement>(null);
  const el = useRef<HTMLVideoElement>(null);
  const pinned = useRef(false);
  const visible = useRef(false);
  const [loaded, setLoaded] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(true);
  const [failed, setFailed] = useState(false);
  const feature = variant === 'feature';

  const pause = useCallback(() => { el.current?.pause(); }, []);
  const play = useCallback(() => {
    const v = el.current;
    if (!v) return;
    if (!feature) { if (active && active !== pause) active(); active = pause; }
    v.play().catch(() => { /* blocked or unsupported codec: stay paused, the play button remains */ });
  }, [feature, pause]);

  useEffect(() => { if (el.current) el.current.muted = muted; }, [muted, loaded]);
  useEffect(() => { if (loaded) el.current?.load(); }, [loaded]);
  useEffect(() => () => { if (active === pause) active = null; }, [pause]);

  useEffect(() => {
    const node = frame.current;
    if (!node || !('IntersectionObserver' in window)) { setLoaded(true); return; }
    const reduced = matchMedia('(prefers-reduced-motion:reduce)').matches;
    const near = new IntersectionObserver(entries => { if (entries.some(e => e.isIntersecting)) { setLoaded(true); near.disconnect(); } }, { rootMargin: '300px' });
    const view = new IntersectionObserver(entries => {
      visible.current = entries.some(e => e.isIntersecting);
      if (!visible.current) { pause(); pinned.current = false; }
      else if (feature && !reduced) play();
    }, { threshold: feature ? .5 : .15 });
    near.observe(node); view.observe(node);
    return () => { near.disconnect(); view.disconnect(); };
  }, [feature, pause, play]);

  const toggle = (e?: MouseEvent) => { e?.stopPropagation(); pinned.current = true; const v = el.current; if (v?.paused) play(); else pause(); };
  const toggleMute = (e?: MouseEvent) => { e?.stopPropagation(); setMuted(m => !m); };
  const onFrameClick = () => { if (feature) { setMuted(m => !m); if (el.current?.paused) play(); } else toggle(); };

  return <div ref={frame} className={`vp vp-${variant}${playing ? ' is-playing' : ''}${failed ? ' is-failed' : ''}`}
    onPointerEnter={e => { if (!feature && e.pointerType === 'mouse' && !matchMedia('(prefers-reduced-motion:reduce)').matches) { pinned.current = false; play(); } }}
    onPointerLeave={e => { if (!feature && e.pointerType === 'mouse' && !pinned.current) pause(); }}
    onClick={onFrameClick}>
    <video ref={el} muted playsInline loop preload="metadata" aria-label={video.label}
      onLoadedData={() => { if (feature && visible.current && !matchMedia('(prefers-reduced-motion:reduce)').matches) play(); }}
      onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)} onError={() => setFailed(true)}>
      {loaded && <source src={`${video.src}#t=0.1`} type={video.type} onError={() => setFailed(true)} />}
    </video>
    {failed ? <p className="vp-error">Video unavailable</p> : <>
      {!playing && <span className="vp-bigplay" aria-hidden="true"><Icon name="play" /></span>}
      <div className="vp-controls">
        <button type="button" onClick={toggle} aria-label={playing ? 'Pause video' : 'Play video'}><Icon name={playing ? 'pause' : 'play'} /></button>
        <button type="button" onClick={toggleMute} aria-label={muted ? 'Unmute video' : 'Mute video'}><Icon name={muted ? 'mute' : 'sound'} /></button>
      </div>
      {feature && <span className="vp-caption">{video.label}</span>}
    </>}
  </div>;
}
