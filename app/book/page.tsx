import PageHero from '@/components/pages/PageHero';
import BookingForm from '@/components/sections/BookingForm';
import { content, pic } from '@/lib/content';
import { pageMetadata } from '@/lib/seo';
const hero = pic('bedroom-with-balcony-door-and-mountain-view');
export const metadata = pageMetadata({ title: 'Book Your Stay', description: 'Enquire about a stay at HOGS Panorama in Manali. Choose your dates and we’ll be in touch — or continue the conversation on WhatsApp.', path: '/book', image: hero.og });
// `?property=panorama` pre-selects the property; unknown values fall back to the default.
export default async function BookPage({ searchParams }: { searchParams: Promise<{ property?: string | string[] }> }) {
  const { property } = await searchParams;
  return <main id="main" className="subpage"><PageHero eyebrow={content.ui.booking.eyebrow} title={<>Your Himalayan<br /><em>chapter starts here.</em></>} lede="An enquiry, not a confirmed reservation. We’ll be in touch to plan your stay." image={hero.src} alt={hero.alt} position={hero.position} /><BookingForm property={Array.isArray(property) ? property[0] : property} /></main>;
}
