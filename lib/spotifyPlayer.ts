// Shared Spotify iFrame API helper (client only). One script load, and one place that makes sure only one player plays at a time.
// Docs: https://developer.spotify.com/documentation/embeds/references/iframe-api (no next/previous methods exist: skipping happens inside the embed).
export const SPOTIFY_PLAYLIST_ID = '6BAVDWhL0uvcq0lA3AtevP';
export const SPOTIFY_PLAYLIST_URI = `spotify:playlist:${SPOTIFY_PLAYLIST_ID}`;
export const SPOTIFY_PLAYLIST_URL = `https://open.spotify.com/playlist/${SPOTIFY_PLAYLIST_ID}`;
export const SPOTIFY_EMBED_URL = `https://open.spotify.com/embed/playlist/${SPOTIFY_PLAYLIST_ID}?utm_source=generator&theme=0`;

export type SpotifyController = {
  togglePlay(): void; play(): void; pause(): void; destroy(): void;
  addListener(event: string, callback: (event: { data: { isPaused: boolean } }) => void): void;
};
type SpotifyApi = { createController(element: HTMLElement, options: Record<string, unknown>, callback: (controller: SpotifyController) => void): void };

let apiPromise: Promise<SpotifyApi> | null = null;
const requestListeners = new Set<() => void>();
const players = new Map<string, SpotifyController>();

/** Loads the Spotify iFrame API script once. */
export function loadSpotifyApi(): Promise<SpotifyApi> {
  if (apiPromise) return apiPromise;
  apiPromise = new Promise<SpotifyApi>((resolve, reject) => {
    const w = window as unknown as { onSpotifyIframeApiReady?: (api: SpotifyApi) => void };
    const previous = w.onSpotifyIframeApiReady;
    w.onSpotifyIframeApiReady = api => { previous?.(api); resolve(api); };
    const script = document.createElement('script');
    script.src = 'https://open.spotify.com/embed/iframe-api/v1';
    script.async = true;
    script.onerror = () => { apiPromise = null; script.remove(); reject(new Error('Spotify iFrame API failed to load')); };
    document.body.appendChild(script);
  });
  requestListeners.forEach(listener => listener());
  return apiPromise;
}
/** Calls back when anything (the Cafe section or a tap on the floating pill) starts loading the API; immediately if it already has. */
export function onSpotifyApiRequested(listener: () => void) {
  requestListeners.add(listener);
  if (apiPromise) listener();
  return () => { requestListeners.delete(listener); };
}

/** Creates an embed inside `host`. Whenever this player starts playing, every other registered player is paused. */
export async function createSpotifyPlayer(host: HTMLElement, id: string, height: number, onPlayingChange: (playing: boolean) => void): Promise<{ controller: SpotifyController; dispose: () => void }> {
  const api = await loadSpotifyApi();
  const mount = document.createElement('div');
  host.appendChild(mount);
  return new Promise(resolve => api.createController(mount, { uri: SPOTIFY_PLAYLIST_URI, width: '100%', height }, controller => {
    players.set(id, controller);
    controller.addListener('playback_update', event => {
      const playing = !event.data.isPaused;
      if (playing) players.forEach((other, otherId) => { if (otherId !== id) other.pause(); });
      onPlayingChange(playing);
    });
    resolve({ controller, dispose: () => { if (players.get(id) === controller) players.delete(id); try { controller.destroy(); } catch { /* already gone */ } mount.remove(); } });
  }));
}
