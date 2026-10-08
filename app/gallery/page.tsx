import PageHero from '@/components/pages/PageHero';
import CtaBand from '@/components/pages/CtaBand';
import GalleryBrowser from '@/components/gallery/GalleryBrowser';
import { content, pic } from '@/lib/content';
import { findImage } from '@/lib/gallery';
import CafeGallery from '@/components/cafe/CafeGallery';
import { pageMetadata } from '@/lib/seo';
const ogPhoto = findImage('bedroom-with-valley-view'); const hero = pic('terrace-walkway-with-fairy-lights');
export const metadata = pageMetadata({ title: 'Gallery', description: 'Photos of HOGS Panorama in Manali, Himachal Pradesh: signature and valley view rooms, balcony views, the common area and the outdoor spaces.', path: '/gallery', image: ogPhoto.og, imageMeta: { width: 1200, height: 630, alt: ogPhoto.alt } });
export default function GalleryPage() {
  return <main id="main" className="subpage"><PageHero eyebrow={content.ui.gallery.eyebrow} title={<>{content.ui.gallery.heading[0]}<br /><em>{content.ui.gallery.heading[1]}</em></>} lede={content.ui.gallery.description} image={hero.src} alt={hero.alt} position={hero.position} /><GalleryBrowser /><CafeGallery id="cafe-do-nthng" eyebrow="AND DOWNSTAIRS, THE CAFE" heading={['Cafe DO NTHNG,', 'in pictures.']} /><CtaBand eyebrow="STAY A LITTLE LONGER" title={['Seen enough?', 'Come feel it.']} href="/book" label="Book your stay" secondary={{ href: '/stays', label: 'Our stays' }} /></main>;
}
