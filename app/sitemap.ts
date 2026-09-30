import type { MetadataRoute } from 'next';
import { site } from '@/lib/content';
// Indexable routes only (legal pages are noindex). Keep in sync with app/.
const routes: [string, number][] = [['/',1],['/stays',.9],['/stays/panorama',.9],['/cafe',.8],['/book',.9],['/gallery',.7],['/features',.7],['/about',.7]];
export default function sitemap():MetadataRoute.Sitemap { return routes.map(([path,priority])=>({url:`${site.origin}${path==='/'?'':path}`,changeFrequency:'monthly',priority})); }
