'use client';
import { useEffect, useRef, useState } from 'react';
import { createSpotifyPlayer, SPOTIFY_EMBED_URL, SPOTIFY_PLAYLIST_ID, SPOTIFY_PLAYLIST_URL } from '@/lib/spotifyPlayer';
import './spotify-playlist.css';
// The playlist ID lives in lib/spotifyPlayer.ts (single constant, shared with the floating player).
export { SPOTIFY_PLAYLIST_ID };
const MusicIcon = () => <svg viewBox="0 0 24 24" width="40" height="40" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M9 18V5l12-2v13" /><circle cx="6" cy="18" r="3" /><circle cx="18" cy="16" r="3" /></svg>;
const SpotifyIcon = () => <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><circle cx="12" cy="12" r="12" fill="#1DB954" /><path d="M5.8 8.6c4.2-1.2 8.8-.9 12.4 1.2M6.4 12c3.6-1 7.2-.7 10.4 1M7 15.3c3-.8 5.6-.5 8.2.9" fill="none" stroke="#0b0f0c" strokeWidth="1.6" strokeLinecap="round" /></svg>;
export default function SpotifyPlaylist() {
  const ref = useRef<HTMLDivElement>(null);
  const host = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || !('IntersectionObserver' in window)) { setVisible(true); return; }
    // Fallback: if the observer never fires, load anyway after 3s.
    const timer = setTimeout(() => setVisible(true), 3000);
    const io = new IntersectionObserver(entries => { if (entries.some(e => e.isIntersecting)) { setVisible(true); clearTimeout(timer); io.disconnect(); } }, { rootMargin: '200px', threshold: 0 });
    io.observe(el);
    return () => { clearTimeout(timer); io.disconnect(); };
  }, []);
  // Uses the shared iFrame API so this player and the floating one never play at the same time (see lib/spotifyPlayer.ts).
  useEffect(() => {
    if (!visible || !host.current) return;
    let cancelled = false;
    let dispose: (() => void) | undefined;
    const height = matchMedia('(max-width:860px)').matches ? 380 : 452;
    createSpotifyPlayer(host.current, 'cafe', height, () => {})
      .then(player => { if (cancelled) player.dispose(); else { dispose = player.dispose; setReady(true); } })
      .catch(() => { if (!cancelled) setFailed(true); });
    return () => { cancelled = true; dispose?.(); setReady(false); };
  }, [visible]);
  return <section className="cs-section sp" id="cafe-playlist" aria-labelledby="sp-title">
    <div className="sp-copy">
      <p className="eyebrow">NOW PLAYING AT DO NTHNG</p>
      <h2 id="sp-title">Sip slow. <em>Listen slower.</em></h2>
      <p className="sp-line">The songs that play at our café — press play and bring the mountains home.</p>
      <a className="button is-secondary sp-follow" href={SPOTIFY_PLAYLIST_URL} target="_blank" rel="noopener noreferrer"><SpotifyIcon />Follow on Spotify ↗</a>
    </div>
    <div className="sp-player" ref={ref}>
      <div className="sp-frame">
        {failed
          ? <iframe src={SPOTIFY_EMBED_URL} width="100%" style={{ borderRadius: 12 }} frameBorder={0} allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy" title="DO NTHNG Café playlist on Spotify" />
          : <>
            <div ref={host} className="sp-host" />
            {!ready && <div className="sp-placeholder"><MusicIcon /><span>Loading playlist…</span></div>}
          </>}
      </div>
      <p className="sp-note">Log in to Spotify for full songs.</p>
    </div>
  </section>;
}
