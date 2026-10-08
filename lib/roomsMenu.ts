import { findImage, findPanoramaView } from './gallery';
import { guestsLine, roomHref, rooms } from './rooms';

// Server-side data for the "Our Stays" mega-menu (so the client navbar never imports the image manifests): cover thumbnail, name, guests line, tagline.
export type StayMenuItem = { id: string; name: string; guests: string; tagline: string; href: string; thumb: string; blur: string; photoSoon: boolean };
export const stayMenuItems = (): StayMenuItem[] => rooms.map(room => {
  const cover = room.photos[0] ? findPanoramaView(room.photos[0]) : null;
  const fallback = cover ? null : findImage(room.fallbackCover ?? 'bedroom-floor-to-ceiling-valley-view');
  const thumb = cover ? (cover.srcSet.find(item => item.width === 640) ?? cover.srcSet[0]).src : fallback!.srcSm;
  return { id: room.id, name: room.name, guests: guestsLine(room), tagline: room.tagline, href: roomHref(room.id), thumb, blur: cover?.blurDataURL ?? fallback!.blurDataURL, photoSoon: !cover };
});
