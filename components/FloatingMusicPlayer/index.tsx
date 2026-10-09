'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { createSpotifyPlayer, onSpotifyApiRequested, SPOTIFY_PLAYLIST_URL, type SpotifyController } from '@/lib/spotifyPlayer';
import './floating-music-player.css';

const HIDE_KEY = 'hogs-music-hidden';
const NoteIcon = () => <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M9 18V5l12-2v13" /><circle cx="6" cy="18" r="3" /><circle cx="18" cy="16" r="3" /></svg>;
const PlayIcon = () => <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true"><path d="M8 5.5v13l11-6.5z" /></svg>;
const PauseIcon = () => <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true"><path d="M7 5h4v14H7zM13 5h4v14h-4z" /></svg>;

// Mounted once in app/layout.tsx so the music keeps playing across page navigation. Only the lightweight pill exists until the first tap
// (or until the Cafe section starts loading the Spotify API). The embed iframe is created once and then never unmounted: minimizing only moves it off-screen.
export default function FloatingMusicPlayer() {
  const [hidden, setHidden] = useState(true); // true until sessionStorage has been read, so nothing flashes
  useEffect(() => { try { setHidden(sessionStorage.getItem(HIDE_KEY) === '1'); } catch { setHidden(false); } }, []);
  if (hidden) return null;
  return <Player onHide={() => { try { sessionStorage.setItem(HIDE_KEY, '1'); } catch { /* storage blocked */ } setHidden(true); }} />;
}

function Player({ onHide }: { onHide: () => void }) {
  const pathname = usePathname();
  const root = useRef<HTMLDivElement>(null);
  const host = useRef<HTMLDivElement>(null);
  const toggleBtn = useRef<HTMLButtonElement>(null);
  const controller = useRef<SpotifyController | null>(null);
  const playOnReady = useRef(false);
  const [wanted, setWanted] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [playing, setPlaying] = useState(false);

  // Load the embed only after the first tap, or once the Cafe section has asked for the Spotify API.
  useEffect(() => onSpotifyApiRequested(() => setWanted(true)), []);
  useEffect(() => {
    if (!wanted || !host.current) return;
    let cancelled = false;
    let dispose: (() => void) | undefined;
    createSpotifyPlayer(host.current, 'floating', 152, setPlaying).then(player => {
      if (cancelled) { player.dispose(); return; }
      dispose = player.dispose; controller.current = player.controller;
      if (playOnReady.current) { playOnReady.current = false; player.controller.togglePlay(); }
    }).catch(() => { /* script blocked: the pill simply stays a link to the playlist */ });
    return () => { cancelled = true; controller.current = null; dispose?.(); };
  }, [wanted]);

  const toggle = () => {
    if (controller.current) { controller.current.togglePlay(); return; }
    // First tap: load the API and open the panel, so the visitor can also press play inside the embed if the browser blocks autoplay.
    playOnReady.current = true; setWanted(true); setExpanded(true);
  };
  const expand = () => { setWanted(true); setExpanded(true); };
  const minimize = useCallback(() => { setExpanded(false); toggleBtn.current?.focus(); }, []);

  useEffect(() => {
    if (!expanded) return;
    const onKey = (event: KeyboardEvent) => { if (event.key === 'Escape') minimize(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [expanded, minimize]);

  // Sit above the mobile BOOK NOW bar and the floating WhatsApp button: measure whichever is actually on screen and set --fmp-bottom.
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const measure = () => {
      let offset = 0;
      document.querySelectorAll<HTMLElement>('.sticky-book-bar, .mobile-whatsapp').forEach(node => {
        if (getComputedStyle(node).display === 'none') return;
        const rect = node.getBoundingClientRect();
        if (rect.height > 0 && rect.top < innerHeight) offset = Math.max(offset, innerHeight - rect.top);
      });
      if (offset > 0) el.style.setProperty('--fmp-bottom', `${Math.ceil(offset) + 12}px`); else el.style.removeProperty('--fmp-bottom');
    };
    const schedule = () => { measure(); clearTimeout(timer); timer = setTimeout(measure, 450); }; // second pass after the bar's slide transition
    schedule();
    addEventListener('resize', schedule); addEventListener('scroll', schedule, { passive: true });
    const observer = new MutationObserver(schedule);
    document.querySelectorAll('.sticky-book-bar, .mobile-whatsapp').forEach(node => observer.observe(node, { attributes: true, attributeFilter: ['class', 'style'] }));
    observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });
    return () => { clearTimeout(timer); removeEventListener('resize', schedule); removeEventListener('scroll', schedule); observer.disconnect(); };
  }, [pathname]);

  return <div ref={root} className={`fmp${expanded ? ' is-expanded' : ''}${playing ? ' is-playing' : ''}`}>
    <div id="fmp-panel" className="fmp-panel" role="region" aria-label="Café music player" aria-hidden={!expanded} inert={!expanded}>
      <div className="fmp-panel-head">
        <span>Now playing at DO NTHNG</span>
        <button type="button" className="fmp-icon-btn" aria-label="Minimize player" onClick={minimize}><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><path d="M5 12h14" /></svg></button>
      </div>
      <div ref={host} className="fmp-embed" />
      <a className="fmp-follow" href={SPOTIFY_PLAYLIST_URL} target="_blank" rel="noopener noreferrer"><svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><circle cx="12" cy="12" r="12" fill="#1DB954" /><path d="M5.8 8.6c4.2-1.2 8.8-.9 12.4 1.2M6.4 12c3.6-1 7.2-.7 10.4 1M7 15.3c3-.8 5.6-.5 8.2.9" fill="none" stroke="#0b0f0c" strokeWidth="1.6" strokeLinecap="round" /></svg>Follow on Spotify ↗</a>
    </div>
    <div className="fmp-pill">
      <button type="button" className="fmp-main" aria-label={expanded ? 'Minimize player' : 'Expand player'} aria-expanded={expanded} aria-controls="fmp-panel" onClick={() => (expanded ? minimize() : expand())}>
        <span className="fmp-note"><NoteIcon /></span>
        <span className="fmp-name">DO NTHNG</span>
        <span className="fmp-eq" aria-hidden="true"><i /><i /><i /><i /></span>
      </button>
      <button ref={toggleBtn} type="button" className="fmp-play" aria-label={playing ? 'Pause' : 'Play café music'} onClick={toggle}>{playing ? <PauseIcon /> : <PlayIcon />}</button>
      <button type="button" className="fmp-icon-btn fmp-chevron" aria-label={expanded ? 'Minimize player' : 'Expand player'} onClick={() => (expanded ? minimize() : expand())}><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M6 15l6-6 6 6" /></svg></button>
      <button type="button" className="fmp-icon-btn fmp-close" aria-label="Hide music player" onClick={() => { controller.current?.pause(); onHide(); }}><svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" /></svg></button>
    </div>
  </div>;
}
