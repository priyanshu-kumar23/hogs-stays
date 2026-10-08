import { notFound } from 'next/navigation';
import BookingEnquiry from '@/components/enquiry/BookingEnquiry';
import CtaBand from '@/components/pages/CtaBand';
import RoomHero from '@/components/rooms/RoomHero';
import RoomGallery from '@/components/rooms/RoomGallery';
import { AboutRoom, GoodToKnow, MealPlans, OtherRooms, RoomLocation } from '@/components/rooms/RoomSections';
import { enquiryRoomOptions } from '@/components/stays/RoomsSection';
import { amenityLabels, guestsLine, roomById, roomHref, rooms } from '@/lib/rooms';
import { stayMenuItems } from '@/lib/roomsMenu';
import { findImage, findPanoramaView } from '@/lib/gallery';
import { panoramaBookingUrl, panoramaEnquiry, site } from '@/lib/content';
import { pageMetadata } from '@/lib/seo';

// One page per room category (routes come from lib/rooms.ts). Rate and availability live in the Aiosell booking engine; no prices here.
export const dynamicParams = false;
export const generateStaticParams = () => rooms.map(room => ({ room: room.id }));
type Props = { params: Promise<{ room: string }> };

const imagesFor = (id: string) => (roomById(id)?.photos ?? []).map(findPanoramaView);
export async function generateMetadata({ params }: Props) {
  const room = roomById((await params).room); if (!room) return {};
  const cover = imagesFor(room.id)[0];
  const amenities = room.amenities.map(a => amenityLabels[a]).join(', ');
  return pageMetadata({
    title: `${room.name} at HOGS Panorama, Manali`,
    description: `${room.name} at HOGS Panorama in Manali: ${guestsLine(room).toLowerCase()}. ${room.tagline} ${amenities}.`,
    path: roomHref(room.id), ...(cover ? { image: cover.src, imageMeta: { width: cover.width, height: cover.height, alt: cover.alt } } : {}),
  });
}

export default async function RoomPage({ params }: Props) {
  const room = roomById((await params).room); if (!room) notFound();
  const photos = imagesFor(room.id);
  const cover = photos[0] ?? (() => { const g = findImage(room.fallbackCover ?? 'bedroom-floor-to-ceiling-valley-view'); return { src: g.srcMd, alt: g.alt, blurDataURL: g.blurDataURL, position: g.position }; })();
  const url = `${site.origin}${roomHref(room.id)}`;
  const hotelRoom = {
    '@context': 'https://schema.org', '@type': 'HotelRoom', '@id': url, name: room.bookingName, description: room.description, url,
    occupancy: { '@type': 'QuantitativeValue', maxValue: room.maxGuests, unitText: 'guests' }, bed: { '@type': 'BedDetails', typeOfBed: `${room.bed} bed` },
    amenityFeature: room.amenities.map(a => ({ '@type': 'LocationFeatureSpecification', name: amenityLabels[a], value: true })),
    ...(photos.length ? { image: photos.map(p => `${site.origin}${p.src}`) } : {}),
    containedInPlace: { '@type': 'LodgingBusiness', name: 'HOGS Panorama', url: `${site.origin}/stays/panorama` },
    potentialAction: { '@type': 'ReserveAction', name: `Book ${room.bookingName}`, target: { '@type': 'EntryPoint', urlTemplate: panoramaBookingUrl } },
  };
  const crumbs = { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Our Stays', item: `${site.origin}/stays` }, { '@type': 'ListItem', position: 2, name: 'HOGS Panorama', item: `${site.origin}/stays/panorama` }, { '@type': 'ListItem', position: 3, name: room.name, item: url }] };
  const chips = [`Up to ${room.maxGuests} guests`, `${room.bed} bed`, ...(room.amenities.includes('balcony') ? ['Balcony'] : [])];
  const others = stayMenuItems().filter(item => item.id !== room.id);
  return <main id="main" className="subpage room-page" style={{ ['--room-accent' as string]: room.accent.color }}>
    {[hotelRoom, crumbs].map((entry, index) => <script key={index} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(entry).replace(/</g, '\\u003c') }} />)}
    <RoomHero roomId={room.id} roomName={room.name} tagline={room.tagline} chips={chips} image={{ src: cover.src, alt: cover.alt, blur: cover.blurDataURL, position: ('position' in cover && cover.position) || room.heroPosition || 'center 50%' }} />
    <section className="section rp-gallery" aria-labelledby="rp-gallery-t">
      <header className="rp-head" data-reveal><p className="eyebrow">THE ROOM</p><h2 id="rp-gallery-t">A closer<br /><em>look.</em></h2></header>
      <RoomGallery roomName={room.name} images={photos.map(p => ({ id: p.id, src: p.src, alt: p.alt, width: p.width, height: p.height, blurDataURL: p.blurDataURL, position: p.position }))} />
    </section>
    <AboutRoom room={room} />
    <MealPlans />
    <GoodToKnow />
    <OtherRooms items={others} />
    <RoomLocation />
    <BookingEnquiry property={{ name: panoramaEnquiry.propertyName, whatsapp: panoramaEnquiry.whatsapp, email: panoramaEnquiry.email }} rooms={enquiryRoomOptions()} pill={false} />
    <CtaBand eyebrow="YOUR MOUNTAIN ADDRESS" title={['Your view is', 'waiting.']} href={panoramaBookingUrl} label={`Book ${room.name}`} secondary={{ href: '/stays/panorama', label: 'All rooms' }} />
  </main>;
}
