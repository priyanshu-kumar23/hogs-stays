import PageHero from '@/components/pages/PageHero';
import BookingForm from '@/components/sections/BookingForm';
import { content, images } from '@/lib/content';
import { pageMetadata } from '@/lib/seo';
export const metadata = pageMetadata({ title: 'Book Your Stay', description: 'Enquire about a stay at HOGS Panorama in Manali. Choose your dates and we’ll be in touch — or continue the conversation on WhatsApp.', path: '/book', image: images.hogs2.src });
// `?property=panorama` pre-selects the property; unknown values fall back to the default.
export default async function BookPage({ searchParams }: { searchParams: Promise<{ property?: string | string[] }> }) {
  const { property } = await searchParams;
  return <main id="main" className="subpage"><PageHero eyebrow={content.ui.booking.eyebrow} title={<>Your Himalayan<br /><em>chapter starts here.</em></>} lede="An enquiry, not a confirmed reservation. We’ll be in touch to plan your stay." image={images.hogs2.src} alt={images.hogs2.alt} position={images.hogs2.position} /><BookingForm property={Array.isArray(property) ? property[0] : property} /></main>;
}
