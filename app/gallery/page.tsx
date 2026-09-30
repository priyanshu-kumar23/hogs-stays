import PageHero from '@/components/pages/PageHero';
import CtaBand from '@/components/pages/CtaBand';
import Gallery from '@/components/sections/Gallery';
import { content, images } from '@/lib/content';
import { pageMetadata } from '@/lib/seo';
export const metadata = pageMetadata({ title: 'Gallery', description: 'Postcards from HOGS — mountain views, sunlit rooms and Cafe Do Nthng after dark, from our homes in Manali, Himachal Pradesh.', path: '/gallery', image: images.hogs3.src });
export default function GalleryPage() {
  return <main id="main" className="subpage"><PageHero eyebrow={content.ui.gallery.eyebrow} title={<>{content.ui.gallery.heading[0]}<br /><em>{content.ui.gallery.heading[1]}</em></>} lede={content.ui.gallery.description} image={images.hogs3.src} alt={images.hogs3.alt} position={images.hogs3.position} /><Gallery items={content.galleryAll} full /><CtaBand eyebrow="STAY A LITTLE LONGER" title={['Seen enough?', 'Come feel it.']} href="/book" label="Book your stay" secondary={{ href: '/stays', label: 'Our stays' }} /></main>;
}
