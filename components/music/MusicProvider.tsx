'use client';
import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { createSpotifyPlayer, type SpotifyController } from '@/lib/spotifyPlayer';
import FloatingMusicPlayer from '@/components/FloatingMusicPlayer';
import { Ctx, type MusicContext } from './musicContext';

// The ONE Spotify player for the whole site, mounted in the root layout so music keeps playing while visitors browse.
// - Nothing loads (no script, no iframe) until the visitor has opened /cafe in this session ("unlocked").
// - The iframe lives in `.mp-host`, which is never unmounted or re-parented (that would reload it and stop the music). It only
//   moves by CSS: over the Cafe page's playlist placeholder (absolute, document coordinates), or over the floating widget's panel (fixed).
// - sessionStorage flags: hogs_music_unlocked / hogs_music_dismissed. If storage is unavailable the widget only shows on /cafe.
const UNLOCK_KEY = 'hogs_music_unlocked';
const DISMISS_KEY = 'hogs_music_dismissed';

const flag = (key: string) => { try { return sessionStorage.getItem(key) === '1'; } catch { return false; } };
const setFlag = (key: string) => { try { sessionStorage.setItem(key, '1'); } catch { /* storage blocked */ } };
const storageWorks = () => { try { sessionStorage.setItem('hogs_music_probe', '1'); sessionStorage.removeItem('hogs_music_probe'); return true; } catch { return false; } };

export default function MusicProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const onCafe = pathname === '/cafe' || pathname === '/cafe/';
  const host = useRef<HTMLDivElement>(null);
  const controller = useRef<SpotifyController | null>(null);
  const dispose = useRef<(() => void) | null>(null);
  const creating = useRef(false);
  const playOnReady = useRef(false);
  const [hydrated, setHydrated] = useState(false);
  const [storageOk, setStorageOk] = useState(true);
  const [unlocked, setUnlocked] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [entering, setEntering] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [slot, setSlot] = useState<HTMLElement | null>(null);
  const [panel, setPanel] = useState<HTMLElement | null>(null);

  useEffect(() => { setStorageOk(storageWorks()); setUnlocked(flag(UNLOCK_KEY)); setDismissed(flag(DISMISS_KEY)); setHydrated(true); }, []);
  // Visiting /cafe unlocks the widget for the rest of the session (and slides it in once, there).
  useEffect(() => {
    if (!hydrated || !onCafe || dismissed || unlocked) return;
    setUnlocked(true); setEntering(true); setFlag(UNLOCK_KEY);
  }, [hydrated, onCafe, dismissed, unlocked]);

  const visible = hydrated && !dismissed && (onCafe || (unlocked && storageOk));
  const shouldExist = onCafe || visible;
  const shouldExistRef = useRef(shouldExist);
  shouldExistRef.current = shouldExist;

  const ensure = useCallback(() => {
    if (controller.current || creating.current || !host.current || !shouldExistRef.current) return;
    creating.current = true;
    createSpotifyPlayer(host.current, 152, setPlaying).then(player => {
      creating.current = false;
      if (!shouldExistRef.current) { player.dispose(); return; }
      controller.current = player.controller; dispose.current = player.dispose;
      setReady(true); setFailed(false);
      if (playOnReady.current) { playOnReady.current = false; player.controller.play(); }
    }).catch(() => { creating.current = false; setFailed(true); });
  }, []);

  // Not allowed to exist any more (dismissed and left /cafe): stop and remove the iframe.
  useEffect(() => {
    if (shouldExist || !controller.current) return;
    dispose.current?.(); dispose.current = null; controller.current = null; setReady(false); setPlaying(false); setExpanded(false);
  }, [shouldExist]);
  useEffect(() => () => { dispose.current?.(); dispose.current = null; controller.current = null; }, []);

  // On /cafe the player loads when the playlist placeholder is near the viewport (or after 3s, or when the widget asks).
  useEffect(() => {
    if (!onCafe || !slot) return;
    if (!('IntersectionObserver' in window)) { ensure(); return; }
    const timer = setTimeout(ensure, 3000);
    const io = new IntersectionObserver(entries => { if (entries.some(e => e.isIntersecting)) { ensure(); clearTimeout(timer); io.disconnect(); } }, { rootMargin: '200px', threshold: 0 });
    io.observe(slot);
    return () => { clearTimeout(timer); io.disconnect(); };
  }, [onCafe, slot, ensure]);

  const play = useCallback(() => { if (controller.current) controller.current.play(); else { playOnReady.current = true; ensure(); } }, [ensure]);
  const toggle = useCallback(() => {
    if (controller.current) { controller.current.togglePlay(); return; }
    playOnReady.current = true; ensure();
    if (!onCafe) setExpanded(true); // first tap away from /cafe also opens the panel, in case the browser blocks scripted playback
  }, [ensure, onCafe]);
  const dismiss = useCallback(() => { setFlag(DISMISS_KEY); setDismissed(true); setExpanded(false); controller.current?.pause(); }, []);

  // Position the host (CSS only; never touches the iframe's place in the DOM).
  useEffect(() => {
    const el = host.current;
    if (!el) return;
    const apply = (style: Partial<CSSStyleDeclaration>) => Object.assign(el.style, style);
    const sync = () => {
      if (onCafe && slot) { // over the Cafe page's placeholder, in document coordinates
        const r = slot.getBoundingClientRect();
        apply({ position: 'absolute', left: `${r.left + slot.clientLeft + scrollX}px`, top: `${r.top + slot.clientTop + scrollY}px`, width: `${slot.clientWidth}px`, height: `${slot.clientHeight}px`, opacity: '1', pointerEvents: 'auto', zIndex: '6' });
      } else if (visible && panel) { // over the widget's panel; collapsed = invisible and click-through, but still mounted and playing
        const r = panel.getBoundingClientRect();
        apply({ position: 'fixed', left: `${r.left}px`, top: `${r.top}px`, width: `${r.width}px`, height: `${r.height}px`, opacity: expanded ? '1' : '0', pointerEvents: expanded ? 'auto' : 'none', zIndex: '31' });
      } else {
        apply({ position: 'fixed', opacity: '0', pointerEvents: 'none' });
      }
    };
    sync();
    const observer = new ResizeObserver(sync);
    observer.observe(document.body);
    if (slot) observer.observe(slot);
    addEventListener('resize', sync);
    const slotTimer = onCafe && slot ? setInterval(sync, 400) : undefined; // safety net for layout shifts above the placeholder
    let raf = 0;
    const loop = () => { sync(); raf = requestAnimationFrame(loop); };
    if (!onCafe && visible && panel) { addEventListener('scroll', sync, { passive: true }); if (expanded) raf = requestAnimationFrame(loop); } // panel slides/moves with the BOOK NOW bar
    const settle = !onCafe && visible && !expanded ? setTimeout(sync, 400) : undefined;
    return () => { observer.disconnect(); removeEventListener('resize', sync); removeEventListener('scroll', sync); clearInterval(slotTimer); clearTimeout(settle); cancelAnimationFrame(raf); };
  }, [onCafe, slot, panel, visible, expanded, pathname, ready]);

  const value = useMemo<MusicContext>(() => ({ onCafe, visible, entering, playing, ready, failed, expanded, setExpanded, play, toggle, dismiss, registerSlot: setSlot, registerPanel: setPanel }),
    [onCafe, visible, entering, playing, ready, failed, expanded, play, toggle, dismiss]);
  return <Ctx.Provider value={value}>
    {children}
    <div ref={host} className="mp-host" />
    <FloatingMusicPlayer />
  </Ctx.Provider>;
}
