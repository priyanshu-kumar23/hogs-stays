import type { Metadata } from 'next';
import './globals.css';
import './fonts.css';
import './cinematic.css';
const origin = process.env.NEXT_PUBLIC_SITE_URL || 'https://hogsstays.com';
export const metadata: Metadata = { metadataBase: new URL(origin), title: 'HOGS — Of Himalayan Homes | Mountain Stays & Cafe in Manali', description: 'Find your vaataavaran. Discover HOGS Panorama and Cafe Do Nthng — a soulful mountain stay and cafe in Manali, Himachal Pradesh.', openGraph: { title: 'HOGS — Of Himalayan Homes', description: 'A mountain stay and a cafe. One beautiful feeling. Find your place in Manali.', images: ['/opengraph-image'], locale: 'en_IN', type: 'website' }, twitter: { card: 'summary_large_image' }, icons: { icon: '/icon.svg' } };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="en"><body>{children}</body></html>; }

