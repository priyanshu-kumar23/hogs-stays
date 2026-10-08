import type { Metadata } from 'next';
import { panoramaCoverImage, panoramaOgImage } from './gallery';
const fallback = { og: panoramaOgImage.src, alt: panoramaCoverImage.alt };
// Per-page metadata. Next shallow-merges `openGraph`, so each page restates its own image/title.
export function pageMetadata({ title, description, path, image, imageMeta, moreImages = [] }: { title: string; description: string; path: string; image?: string; imageMeta?: { width: number; height: number; alt: string }; moreImages?: { url: string; width: number; height: number; alt: string }[] }): Metadata {
  return {
    title, description, alternates: { canonical: path },
    openGraph: { title: `${title} | HOGS`, description, url: path, siteName: 'HOGS — Of Himalayan Homes', locale: 'en_IN', type: 'website', images: [image ? { url: image, ...imageMeta } : { url: fallback.og!, width: 1200, height: 630, alt: fallback.alt }, ...moreImages] },
    twitter: { card: 'summary_large_image', title: `${title} | HOGS`, description, images: [image || fallback.og!] },
  };
}
