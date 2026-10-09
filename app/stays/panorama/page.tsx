import LocationMap from '@/components/pages/LocationMap';
import Image from 'next/image';
import PageHero from '@/components/pages/PageHero';
import CtaBand from '@/components/pages/CtaBand';
import Icon from '@/components/ui/Icon';
import PanoramaPhotos from '@/components/stays/PanoramaPhotos';
import RoomsSection, { enquiryRoomOptions } from '@/components/stays/RoomsSection';
import BookingEnquiry from '@/components/enquiry/BookingEnquiry';
import PanoramaBookCta from '@/components/stays/PanoramaBookCta';
import { amenityLabels, rooms } from '@/lib/rooms';
import { findPanoramaView, galleryFeatured, panoramaCoverImage, panoramaOgImage } from '@/lib/gallery';
import { content, panoramaBookingUrl, panoramaEnquiry, site, panoramaLocation } from '@/lib/content';
import { pageMetadata } from '@/lib/seo';
const property = content.properties.find(item => item.id === 'panorama')!;
// Hero = the bedroom with the floor-to-ceiling valley view (same photo as the home stays slider).
const cover = panoramaCoverImage.srcSet[panoramaCoverImage.srcSet.length - 1];
const hero = { src: cover.src, alt: panoramaCoverImage.alt, position: panoramaCoverImage.position, blur: panoramaCoverImage.blurDataURL };
export const metadata = pageMetadata({ title: 'HOGS Panorama — Mountain Stay in Manali', description: 'HOGS Panorama is a mountain stay in Manali with panoramic valley views and Himalayan hospitality — a front-row seat to the Himalayas.', path: property.path, image: panoramaOgImage.src, imageMeta: { width: panoramaOgImage.width, height: panoramaOgImage.height, alt: hero.alt } });
export default function PanoramaPage() {
  const schema = { '@context': 'https://schema.org', '@type': 'LodgingBusiness', '@id':`${site.origin}${property.path}#property`, name: property.name, url: `${site.origin}${property.path}`, description: property.description, image: galleryFeatured.map(image => `${site.origin}${image.src}`), sameAs: [content.instagram], telephone: content.phone, email: content.email, address: panoramaLocation.address, ...(panoramaLocation.geo ? {geo:panoramaLocation.geo}:{}),
    potentialAction: { '@type': 'ReserveAction', name: 'Book HOGS Panorama', target: { '@type': 'EntryPoint', urlTemplate: panoramaBookingUrl, actionPlatform: ['http://schema.org/DesktopWebPlatform', 'http://schema.org/MobileWebPlatform'] }, result: { '@type': 'LodgingReservation', name: 'HOGS Panorama booking' } },
    containsPlace: rooms.map(room => ({
      '@type': 'HotelRoom', '@id': `${site.origin}${property.path}#${room.id}`, name: room.bookingName, description: room.description, url: `${site.origin}${property.path}#${room.id}`,
      occupancy: { '@type': 'QuantitativeValue', maxValue: room.maxGuests, unitText: 'guests' }, bed: { '@type': 'BedDetails', typeOfBed: `${room.bed} bed` },
      amenityFeature: room.amenities.map(amenity => ({ '@type': 'LocationFeatureSpecification', name: amenityLabels[amenity], value: true })),
      // Only a room's own photos are listed.
      ...(room.photos.length ? { image: room.photos.map(id => `${site.origin}${findPanoramaView(id).src}`) } : {}),
      containedInPlace: { '@type': 'LodgingBusiness', name: property.name, url: `${site.origin}${property.path}` },
    })) };
  return <main id="main" className="subpage"><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, '\\u003c') }} />
    <PageHero eyebrow={`${content.ui.stays.cardEyebrow} · MANALI`} title={<>HOGS<br /><em>Panorama</em></>} lede={property.subtitle} image={hero.src} alt={hero.alt} position={hero.position} blur={hero.blur} scrim="left"><PanoramaBookCta label={content.ui.stays.cta} /></PageHero>
    <section className="section detail-intro" data-reveal><div><p className="eyebrow">ABOUT THE STAY</p><h2>A front-row seat<br /><em>to the Himalayas.</em></h2></div><div><p>{property.description}</p><div className="chips">{property.highlights.map(chip => <span className="chip" key={chip}>{chip}</span>)}</div><p className="detail-note">Rates, room details and amenities are shared directly by the HOGS team when you enquire.</p></div></section>
    <RoomsSection />
    <PanoramaPhotos />
    <BookingEnquiry property={{ name: panoramaEnquiry.propertyName, whatsapp: panoramaEnquiry.whatsapp, email: panoramaEnquiry.email }} rooms={enquiryRoomOptions()} pill={false} />
    <section className="section"><LocationMap/><a className="text-link" href={panoramaLocation.directionsUrl} target="_blank" rel="noopener noreferrer">Get directions <Icon name="pin"/></a></section>
    <CtaBand eyebrow="YOUR MOUNTAIN ADDRESS" title={['Your view is', 'waiting.']} href={panoramaBookingUrl} label={content.ui.stays.cta} secondary={{ href: '/stays', label: 'All stays' }} /></main>;
}
