import CafeStory from '@/components/cafe/CafeStory';
import './cafe-story.css';
import { cafeHours, cafeLocation, cafeMapLink, cafeMenu, cafeOpeningHoursSpec, content, images, site } from '@/lib/content';
import { cafeOgImage, featuredCafeImages } from '@/lib/cafeImages';
import { pageMetadata } from '@/lib/seo';
const cafe = content.properties.find(item => item.id === 'cafe')!;
export const metadata = pageMetadata({ title: 'Cafe DO NTHNG — Slow-Morning Cafe in Manali', description: `Cafe DO NTHNG by HOGS: a slow-morning cafe surrounded by nature in Manali, ${cafeHours.seo}. Good coffee, zero agenda.`, path: cafe.path, image: cafeOgImage.src, imageMeta: { width: cafeOgImage.width, height: cafeOgImage.height, alt: images.cafe.alt }, moreImages: [images.cafe, ...featuredCafeImages.filter(photo => photo.src !== images.cafe.src).slice(0, 3)].map(photo => ({ url: photo.src, width: photo.width, height: photo.height, alt: photo.alt })) });
export default function CafePage() {
  const schema = { '@context': 'https://schema.org', '@type': 'CafeOrCoffeeShop', name: cafe.name, url: `${site.origin}${cafe.path}`, image: [images.cafe.src, ...featuredCafeImages.map(photo => photo.src)].map(src => `${site.origin}${src}`), sameAs: [content.cafeInstagram], telephone: content.phone, email: content.email, address: cafeLocation.address, geo: cafeLocation.geo, hasMap: cafeMapLink, hasMenu: cafeMenu.url, openingHoursSpecification: [cafeOpeningHoursSpec] };
  return <main id="main" className="subpage cafe-story"><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, '\\u003c') }} /><CafeStory /></main>;
}
