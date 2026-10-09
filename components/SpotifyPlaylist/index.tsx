'use client';
import { SPOTIFY_EMBED_URL, SPOTIFY_PLAYLIST_ID, SPOTIFY_PLAYLIST_URL } from '@/lib/spotifyPlayer';
import { useMusic } from '@/components/music/musicContext';
import './spotify-playlist.css';
// The playlist ID lives in lib/spotifyPlayer.ts (single constant).
export { SPOTIFY_PLAYLIST_ID };
const MusicIcon = () => <svg viewBox="0 0 24 24" width="40" height="40" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M9 18V5l12-2v13" /><circle cx="6" cy="18" r="3" /><circle cx="18" cy="16" r="3" /></svg>;
const SpotifyIcon = () => <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><circle cx="12" cy="12" r="12" fill="#1DB954" /><path d="M5.8 8.6c4.2-1.2 8.8-.9 12.4 1.2M6.4 12c3.6-1 7.2-.7 10.4 1M7 15.3c3-.8 5.6-.5 8.2.9" fill="none" stroke="#0b0f0c" strokeWidth="1.6" strokeLinecap="round" /></svg>;

// Only an empty box of the right size lives here. The one global Spotify iframe (components/music/MusicProvider.tsx) is laid over it
// with CSS, so it looks like part of this section but never gets re-created when the visitor navigates (that would stop the music).
export default function SpotifyPlaylist() {
  const music = useMusic();
  return <section className="cs-section sp" id="playlist" aria-labelledby="sp-title">
    <div className="sp-copy">
      <p className="eyebrow">NOW PLAYING AT DO NTHNG</p>
      <h2 id="sp-title">Sip slow. <em>Listen slower.</em></h2>
      <p className="sp-line">The songs that play at our café — press play and bring the mountains home.</p>
      <a className="button is-secondary sp-follow" href={SPOTIFY_PLAYLIST_URL} target="_blank" rel="noopener noreferrer"><SpotifyIcon />Follow on Spotify ↗</a>
    </div>
    <div className="sp-player">
      <div className="sp-frame" ref={music.registerSlot}>
        {music.failed
          ? <iframe src={SPOTIFY_EMBED_URL} width="100%" height="100%" style={{ borderRadius: 12, position: 'absolute', inset: 0, border: 0 }} allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy" title="DO NTHNG Café playlist on Spotify" />
          : !music.ready && <div className="sp-placeholder"><MusicIcon /><span>Loading playlist…</span></div>}
      </div>
      <p className="sp-note">Log in to Spotify for full songs.</p>
      <a className="sp-app" href={SPOTIFY_PLAYLIST_URL} target="_blank" rel="noopener noreferrer">Play full songs in the Spotify app →</a>
    </div>
  </section>;
}
