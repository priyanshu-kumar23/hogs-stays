import { findImage, findPanoramaView } from '@/lib/gallery';
import { amenityLabels, guestsLine, rooms } from '@/lib/rooms';
import type { EnquiryRoomOption } from '@/components/enquiry/BookingEnquiry';
import RoomAnchorAlias from './RoomAnchorAlias';
import RoomCard, { type RoomPhoto } from './RoomCard';
import '@/app/rooms.css';

const photoFor = (id: string): RoomPhoto => { const v = findPanoramaView(id); return { id: v.id, src: v.src, alt: v.alt, width: v.width, height: v.height, blur: v.blurDataURL, position: v.position }; };
const fallbackFor = (subject: string): RoomPhoto => { const g = findImage(subject); return { id: g.id, src: g.srcMd, alt: g.alt, width: g.width, height: g.height, blur: g.blurDataURL, position: g.position }; };

// "Rooms" on /stays/panorama: one card per category (data in lib/rooms.ts, copied from the Aiosell booking engine).
export default function RoomsSection() {
  return <section className="section rooms" id="rooms" aria-labelledby="rooms-title">
    <RoomAnchorAlias />
    <div className="rooms-head" data-reveal><p className="eyebrow">ROOMS</p><h2 id="rooms-title">Four ways to<br /><em>wake up to the valley.</em></h2></div>
    <div className="rooms-grid">
      {rooms.map(room => <RoomCard key={room.id} id={room.id} name={room.name} description={room.description} guests={guestsLine(room)}
        amenities={room.amenities.map(id => ({ id, label: amenityLabels[id] }))}
        photos={room.photos.map(photoFor)} fallback={room.fallbackCover ? fallbackFor(room.fallbackCover) : null} />)}
    </div>
  </section>;
}

/** The same rooms for the enquiry panel's room picker: the cover photo as a thumbnail (640px) and the guests / bed line. */
export const enquiryRoomOptions = (): EnquiryRoomOption[] => rooms.map(room => {
  const cover = room.photos[0] ? findPanoramaView(room.photos[0]) : null;
  const fallback = !cover && room.fallbackCover ? findImage(room.fallbackCover) : null;
  const thumb = cover ? (cover.srcSet.find(item => item.width === 640) ?? cover.srcSet[0]).src : fallback ? fallback.srcSm : null;
  return { id: room.id, name: room.name, tagline: guestsLine(room), thumb, blur: cover?.blurDataURL ?? fallback?.blurDataURL ?? null };
});
