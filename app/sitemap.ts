import type { MetadataRoute } from 'next';
import { site } from '@/lib/content';
import { gallery, galleryFeatured } from '@/lib/gallery';
import { packages } from '@/lib/packages';
import { cafeOgImage, cafeSitemapImages } from '@/lib/cafeImages';
// Indexable routes only (legal pages are noindex). Keep in sync with app/.
const routes: [string, number][] = [['/',1],['/stays',.9],['/stays/panorama',.9],['/cafe',.8],['/book',.9],['/gallery',.7],['/features',.7],['/about',.7],['/packages',.9],...packages.map((pkg):[string,number]=>[`/packages/${pkg.slug}`,.8])];
// Photo entries (Google image sitemap extension) for the pages that show the HOGS Panorama photography.
const abs = (src: string) => `${site.origin}${src}`;
const images: Record<string, string[]> = { '/gallery': [...gallery.map(image => abs(image.src)), ...cafeSitemapImages.filter(image => image.category !== 'guests').map(image => abs(image.src))], '/stays/panorama': galleryFeatured.map(image => abs(image.src)), '/cafe': [cafeOgImage.src, ...cafeSitemapImages.map(image => image.src)].map(abs) };
export default function sitemap():MetadataRoute.Sitemap { return routes.map(([path,priority])=>({url:`${site.origin}${path==='/'?'':path}`,changeFrequency:'monthly',priority,...(images[path]?{images:images[path]}:{})})); }
