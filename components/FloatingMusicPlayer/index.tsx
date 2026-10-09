'use client';
import { useEffect, useRef, useState } from 'react';
import { useMusic } from '@/components/music/musicContext';
import { SPOTIFY_PLAYLIST_URL } from '@/lib/spotifyPlayer';
import './floating-music-player.css';

const NoteIcon = () => <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M9 18V5l12-2v13" /><circle cx="6" cy="18" r="3" /><circle cx="18" cy="16" r="3" /></svg>;
const PlayIcon = () => <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true"><path d="M8 5.5v13l11-6.5z" /></svg>;
const PauseIcon = () => <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true"><path d="M7 5h4v14H7zM13 5h4v14h-4z" /></svg>;

// The floating pill. It owns no player: the single global Spotify iframe (components/music/MusicProvider.tsx) is shown
// - over the Cafe page's "NOW PLAYING" box (there the pill is a remote: tap = scroll to the playlist and play), or
// - over this widget's expandable panel on every other page.
export default function FloatingMusicPlayer() {
  const music = useMusic();
  const { visible, onCafe, playing, expanded, setExpanded } = music;
  const root = useRef<HTMLDivElement>(null);
  const toggleBtn = useRef<HTMLButtonElement>(null);
  const [playlistInView, setPlaylistInView] = useState(false);

  // On /cafe, fade out while the playlist section itself is on screen.
  useEffect(() => {
    if (!visible || !onCafe) { setPlaylistInView(false); return; }
    const section = document.getElementById('playlist');
    if (!section || !('IntersectionObserver' in window)) return;
    const io = new IntersectionObserver(entries => setPlaylistInView(entries.some(e => e.isIntersecting)), { threshold: 0.2 });
    io.observe(section);
    return () => io.disconnect();
  }, [visible, onCafe]);

  useEffect(() => { if (onCafe) setExpanded(false); }, [onCafe, setExpanded]);
  useEffect(() => {
    if (!expanded) return;
    const onKey = (event: KeyboardEvent) => { if (event.key === 'Escape') { setExpanded(false); toggleBtn.current?.focus(); } };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [expanded, setExpanded]);

  // Sit above the mobile BOOK NOW bar and the floating WhatsApp button: measure whichever is actually on screen and set --fmp-bottom.
  useEffect(() => {
    const el = root.current;
    if (!visible || !el) return;
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
  }, [visible]);

  if (!visible) return null;
  const away = onCafe && playlistInView;
  // Tap the pill on /cafe: scroll to the playlist and start the music in the same gesture (mobile browsers need that).
  const goToPlaylist = () => {
    music.play();
    document.getElementById('playlist')?.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion:reduce)').matches ? 'auto' : 'smooth', block: 'start' });
  };
  return <div ref={root} className={`fmp${playing ? ' is-playing' : ''}${away ? ' is-away' : ''}${expanded && !onCafe ? ' is-expanded' : ''}${music.entering ? ' is-entering' : ''}`} aria-hidden={away} inert={away}>
    {!onCafe && <div id="fmp-panel" className="fmp-panel" role="region" aria-label="Café music player" aria-hidden={!expanded} inert={!expanded}>
      <div className="fmp-panel-head">
        <span>Now playing at DO NTHNG</span>
        <button type="button" className="fmp-icon-btn" aria-label="Minimize player" onClick={() => { setExpanded(false); toggleBtn.current?.focus(); }}><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><path d="M5 12h14" /></svg></button>
      </div>
      <div ref={music.registerPanel} className="fmp-embed" />
      <a className="fmp-follow" href={SPOTIFY_PLAYLIST_URL} target="_blank" rel="noopener noreferrer">Play full songs in the Spotify app →</a>
    </div>}
    <div className="fmp-pill">
      <button type="button" className="fmp-main" aria-label={onCafe ? 'Go to the café playlist and play' : expanded ? 'Minimize player' : 'Expand player'} aria-expanded={onCafe ? undefined : expanded} aria-controls={onCafe ? undefined : 'fmp-panel'}
        onClick={() => (onCafe ? goToPlaylist() : setExpanded(!expanded))}>
        <span className="fmp-note"><NoteIcon /></span>
        <span className="fmp-name">DO NTHNG</span>
        <span className="fmp-eq" aria-hidden="true"><i /><i /><i /><i /></span>
      </button>
      <button ref={toggleBtn} type="button" className="fmp-play" aria-label={playing ? 'Pause' : 'Play café music'} onClick={music.toggle}>{playing ? <PauseIcon /> : <PlayIcon />}</button>
      {!onCafe && <button type="button" className="fmp-icon-btn fmp-chevron" aria-label={expanded ? 'Minimize player' : 'Expand player'} onClick={() => setExpanded(!expanded)}><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M6 15l6-6 6 6" /></svg></button>}
      <button type="button" className="fmp-icon-btn fmp-close" aria-label="Hide music player" onClick={music.dismiss}><svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" /></svg></button>
    </div>
  </div>;
}
