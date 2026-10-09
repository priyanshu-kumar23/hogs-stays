// Spotify iFrame API helper (client only). The one global player lives in components/music/MusicProvider.tsx.
// Docs: https://developer.spotify.com/documentation/embeds/references/iframe-api (no next/previous methods: skipping happens inside the embed).
// Nothing here loads on pages that don't render the Cafe player: the script is only injected by createSpotifyPlayer().
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
function loadSpotifyApi(): Promise<SpotifyApi> {
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
  return apiPromise;
}

/** Creates the embed inside `host` and reports play/pause through `onPlayingChange` ('playback_update'). */
export async function createSpotifyPlayer(host: HTMLElement, height: number, onPlayingChange: (playing: boolean) => void): Promise<{ controller: SpotifyController; dispose: () => void }> {
  const api = await loadSpotifyApi();
  const mount = document.createElement('div');
  host.appendChild(mount);
  return new Promise(resolve => api.createController(mount, { uri: SPOTIFY_PLAYLIST_URI, width: '100%', height }, controller => {
    controller.addListener('playback_update', event => onPlayingChange(!event.data.isPaused));
    resolve({ controller, dispose: () => { try { controller.destroy(); } catch { /* already gone */ } mount.remove(); } });
  }));
}
