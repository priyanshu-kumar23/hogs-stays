import type { MetadataRoute } from 'next';
import { site } from '@/lib/content';
import { gallery, galleryFeatured } from '@/lib/gallery';
// Indexable routes only (legal pages are noindex). Keep in sync with app/.
const routes: [string, number][] = [['/',1],['/stays',.9],['/stays/panorama',.9],['/cafe',.8],['/book',.9],['/gallery',.7],['/features',.7],['/about',.7]];
// Photo entries (Google image sitemap extension) for the pages that show the HOGS Panorama photography.
const abs = (src: string) => `${site.origin}${src}`;
const images: Record<string, string[]> = { '/gallery': gallery.map(image => abs(image.src)), '/stays/panorama': galleryFeatured.map(image => abs(image.src)) };
export default function sitemap():MetadataRoute.Sitemap { return routes.map(([path,priority])=>({url:`${site.origin}${path==='/'?'':path}`,changeFrequency:'monthly',priority,...(images[path]?{images:images[path]}:{})})); }
