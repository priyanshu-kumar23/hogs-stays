// Guest video testimonials ("Guest moments") and the About-page feature video. Files live in public/images.
// Compressed 720p H.264/AAC copies (faststart) live in public/images/videos; the uncompressed originals are kept in /video-originals (git-ignored).
export interface GuestVideo { src: string; type: string; label: string; /** still frame shown instantly while the video itself loads lazily */ poster: string }

export const guestVideos: GuestVideo[] = [
  { src: '/images/videos/vid1.mp4', type: 'video/mp4', label: 'Guest moment 1', poster: '/images/videos/posters/vid1.webp' },
  { src: '/images/videos/vid2.mp4', type: 'video/mp4', label: 'Guest moment 2', poster: '/images/videos/posters/vid2.webp' },
  { src: '/images/videos/vid4.mp4', type: 'video/mp4', label: 'Guest moment 3', poster: '/images/videos/posters/vid4.webp' },
  { src: '/images/videos/vid5.mp4', type: 'video/mp4', label: 'Guest moment 4', poster: '/images/videos/posters/vid5.webp' },
];

export const founderVideo: GuestVideo = { src: '/images/videos/vid3.mp4', type: 'video/mp4', label: 'Gazal & Saloni — the heart of HOGS', poster: '/images/videos/posters/vid3.webp' };
