import { findImage } from '@/lib/gallery';
import { isTodo, rooms } from '@/lib/rooms';
import type { EnquiryRoomOption } from '@/components/enquiry/BookingEnquiry';
import RoomCard, { type RoomPhoto } from './RoomCard';
import '@/app/rooms.css';

const photoFor = (subject: string): RoomPhoto => { const g = findImage(subject); return { id: g.id, hero: g.srcMd, thumb: g.srcSm, alt: g.alt, blur: g.blurDataURL, position: g.position }; };

// "Rooms" on /stays/panorama: one card per category (data in lib/rooms.ts). Unfilled (TODO) fields are hidden, never shown to guests.
export default function RoomsSection() {
  return <section className="section rooms" id="rooms" aria-labelledby="rooms-title">
    <div className="rooms-head" data-reveal><p className="eyebrow">ROOMS</p><h2 id="rooms-title">Four ways to<br /><em>wake up to the valley.</em></h2></div>
    <div className="rooms-grid">
      {rooms.map(room => <RoomCard key={room.id} id={room.id} name={room.name} photos={room.photos.map(photoFor)}
        description={isTodo(room.description) ? null : room.description}
        amenities={room.amenities.filter(item => !isTodo(item))}
        facts={([['Sleeps', room.occupancy], ['Bed', room.bedType], ['Rate', room.price]] as [string, string][]).filter(([, value]) => !isTodo(value))} />)}
    </div>
  </section>;
}

/** The same rooms, shaped for the enquiry panel's room picker (thumbnail = the room's first photo; none for rooms without photos yet). */
export const enquiryRoomOptions = (): EnquiryRoomOption[] => rooms.map(room => {
  const first = room.photos[0] ? findImage(room.photos[0]) : null;
  return { id: room.id, name: room.name, tagline: isTodo(room.tagline) ? null : room.tagline, thumb: first?.srcSm ?? null, blur: first?.blurDataURL ?? null };
});
