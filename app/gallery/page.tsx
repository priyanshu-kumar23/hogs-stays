import PageHero from '@/components/pages/PageHero';
import CtaBand from '@/components/pages/CtaBand';
import GalleryBrowser from '@/components/gallery/GalleryBrowser';
import { content, images } from '@/lib/content';
import { findImage } from '@/lib/gallery';
import { pageMetadata } from '@/lib/seo';
const ogPhoto = findImage('balcony-view-over-orchards-and-mountains');
export const metadata = pageMetadata({ title: 'Gallery', description: 'Photos of HOGS Panorama in Manali, Himachal Pradesh: wooden rooms, balcony and valley views, the garden and the common room.', path: '/gallery', image: ogPhoto.og, imageMeta: { width: 1200, height: 630, alt: ogPhoto.alt } });
export default function GalleryPage() {
  return <main id="main" className="subpage"><PageHero eyebrow={content.ui.gallery.eyebrow} title={<>{content.ui.gallery.heading[0]}<br /><em>{content.ui.gallery.heading[1]}</em></>} lede={content.ui.gallery.description} image={images.hogs3.src} alt={images.hogs3.alt} position={images.hogs3.position} /><GalleryBrowser /><CtaBand eyebrow="STAY A LITTLE LONGER" title={['Seen enough?', 'Come feel it.']} href="/book" label="Book your stay" secondary={{ href: '/stays', label: 'Our stays' }} /></main>;
}
