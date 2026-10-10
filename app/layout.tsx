import type { Metadata } from 'next';
import './globals.css';
import './fonts.css';
import './cinematic.css';
import './pages.css';
import './reviews.css';
import './packages.css';
import './package-extras.css';
import './booking-flow.css';
import Navigation from '@/components/ui/Navigation';
import { stayMenuItems } from '@/lib/roomsMenu';
import StickyBookBar from '@/components/ui/StickyBookBar';
import Cursor from '@/components/ui/Cursor';
import Footer from '@/components/sections/Footer';
import MusicProvider from '@/components/music/MusicProvider';
import { panoramaCoverImage, panoramaOgImage } from '@/lib/gallery';
import { SITE, content } from '@/lib/content';
const origin = process.env.NEXT_PUBLIC_SITE_URL || 'https://hogsstays.com';
const defaultOg = { og: panoramaOgImage.src, alt: panoramaCoverImage.alt };
export const metadata: Metadata = { metadataBase: new URL(origin), title: { default: 'HOGS — Of Himalayan Homes | Mountain Stays & Cafe in Manali', template: '%s | HOGS' }, description: 'Find your Vaataavaran. Discover HOGS Panorama and Cafe DO NTHNG — a soulful mountain stay and cafe in Manali, Himachal Pradesh.', openGraph: { title: 'HOGS — Of Himalayan Homes', description: 'A mountain stay and a cafe. One beautiful feeling. Find your place in Manali.', images: [{ url: defaultOg.og!, width: 1200, height: 630, alt: defaultOg.alt }], locale: 'en_IN', type: 'website' }, twitter: { card: 'summary_large_image', images: [defaultOg.og!] }, icons: { icon: '/icon.svg', apple: '/images/brand/apple-touch-icon.png' } };
// Local-business structured data for Google (name, logo, address, map). `geo` is added once SITE.geo is confirmed.
const businessSchema = { '@context': 'https://schema.org', '@type': ['LodgingBusiness', 'LocalBusiness'], '@id': `${origin}/#business`, name: SITE.name, url: origin, logo: `${origin}${SITE.logo.src}`, image: `${origin}${SITE.logo.src}`, telephone: content.phone, email: content.email, address: { '@type': 'PostalAddress', streetAddress: `${SITE.address.plusCode}, ${SITE.address.street}`, addressRegion: SITE.address.region, postalCode: SITE.address.postalCode, addressCountry: SITE.address.countryCode }, ...(SITE.geo ? { geo: { '@type': 'GeoCoordinates', latitude: SITE.geo.latitude, longitude: SITE.geo.longitude } } : {}), hasMap: SITE.mapShortUrl, sameAs: [content.instagram] };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="en"><body><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(businessSchema).replace(/</g, '\\u003c') }} /><noscript><style>{'.page-transition{opacity:1!important}'}</style></noscript><Navigation stays={stayMenuItems()} /><StickyBookBar /><Cursor /><MusicProvider>{children}</MusicProvider><Footer /></body></html>; }

