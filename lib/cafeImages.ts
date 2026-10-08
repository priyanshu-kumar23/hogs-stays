import { cafeImageList, cafeOgImage, type CafeCategory, type CafeImage } from './cafeImages.generated';
export type { CafeCategory, CafeImage };
export { cafeOgImage };
/**
 * Guest photos (category `guests`) are real HOGS guests. Flip this to `false` to hide every guest photo on the site
 * (the "Guests at HOGS" strip and the guest block in the cafe gallery) if any guest has not given consent.
 * To remove a single photo permanently, delete its entry from scripts/cafe-images.json and run `npm run images:cafe`.
 */
export const SHOW_GUEST_PHOTOS = true;
/** Display order and labels of the cafe gallery sections (guests are shown separately, as their own strip). */
export const cafeCategories: { id: Exclude<CafeCategory, 'guests'>; label: string; blurb: string }[] = [
  { id: 'exterior', label: 'The Building', blurb: 'The HOGS gate and the neon-lit entrance.' },
  { id: 'terrace', label: 'The Terrace', blurb: 'Wicker chairs, prayer flags and the mountains beyond.' },
  { id: 'food-drinks', label: 'Coffee & Cold Drinks', blurb: 'Latte art, mocktails and coolers.' },
  { id: 'live-music', label: 'Live Music', blurb: 'Guitars and quiet evening sessions.' },
  { id: 'ambience-night', label: 'After Dark', blurb: 'Lanterns, fairy lights and candlelit tables.' },
  { id: 'behind-the-bar', label: 'Behind the Bar', blurb: 'Every cup, pulled by hand.' },
  { id: 'team', label: 'The Team', blurb: 'The people behind the counter.' },
];
const all = cafeImageList;
export const guestImages: CafeImage[] = SHOW_GUEST_PHOTOS ? all.filter(image => image.category === 'guests') : [];
/** Every cafe photo that is not a guest photo. */
export const cafeImages: CafeImage[] = all.filter(image => image.category !== 'guests');
export const featuredCafeImages: CafeImage[] = cafeImages.filter(image => image.featured);
export const cafeImagesByCategory = (id: CafeCategory): CafeImage[] => cafeImages.filter(image => image.category === id);
export function findCafeImage(id: string): CafeImage {
  const match = all.find(image => image.id === id);
  if (!match) throw new Error(`Unknown cafe image: ${id}`);
  return match;
}
/** Every photo shown publicly on the cafe pages (guest photos only while SHOW_GUEST_PHOTOS is on), for the image sitemap. */
export const cafeSitemapImages: CafeImage[] = [...cafeImages, ...guestImages];
