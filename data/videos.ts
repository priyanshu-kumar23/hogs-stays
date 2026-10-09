// Guest video testimonials ("Guest moments") and the About-page feature video. Files live in public/images.
// vid1 and vid4 have no file extension (they are QuickTime/H.264); rename them to .mp4 and update the paths here when convenient.
export interface GuestVideo { src: string; type: string; label: string }

export const guestVideos: GuestVideo[] = [
  { src: '/images/vid1', type: 'video/mp4', label: 'Guest moment 1' },
  { src: '/images/vid2.MP4', type: 'video/mp4', label: 'Guest moment 2' },
  { src: '/images/vid4', type: 'video/mp4', label: 'Guest moment 3' },
  { src: '/images/vid5.mp4', type: 'video/mp4', label: 'Guest moment 4' },
];

export const founderVideo: GuestVideo = { src: '/images/vid3.MP4', type: 'video/mp4', label: 'Gazal & Saloni — the heart of HOGS' };
