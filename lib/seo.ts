import type { Metadata } from 'next';
// Per-page metadata. Next shallow-merges `openGraph`, so each page restates its own image/title.
export function pageMetadata({ title, description, path, image }: { title: string; description: string; path: string; image?: string }): Metadata {
  return {
    title, description, alternates: { canonical: path },
    openGraph: { title: `${title} | HOGS`, description, url: path, siteName: 'HOGS — Of Himalayan Homes', locale: 'en_IN', type: 'website', images: [image || '/opengraph-image'] },
    twitter: { card: 'summary_large_image', title: `${title} | HOGS`, description, images: [image || '/opengraph-image'] },
  };
}
