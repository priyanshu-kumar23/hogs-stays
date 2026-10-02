import type { Metadata } from 'next';
import './globals.css';
import './fonts.css';
import './cinematic.css';
import './pages.css';
import Navigation from '@/components/ui/Navigation';
import StickyBookBar from '@/components/ui/StickyBookBar';
import Cursor from '@/components/ui/Cursor';
import Footer from '@/components/sections/Footer';
import { findImage } from '@/lib/gallery';
const origin = process.env.NEXT_PUBLIC_SITE_URL || 'https://hogsstays.com';
const defaultOg = findImage('entrance-arch-lit-at-night');
export const metadata: Metadata = { metadataBase: new URL(origin), title: { default: 'HOGS — Of Himalayan Homes | Mountain Stays & Cafe in Manali', template: '%s | HOGS' }, description: 'Find your vaataavaran. Discover HOGS Panorama and Cafe Do Nthng — a soulful mountain stay and cafe in Manali, Himachal Pradesh.', openGraph: { title: 'HOGS — Of Himalayan Homes', description: 'A mountain stay and a cafe. One beautiful feeling. Find your place in Manali.', images: [{ url: defaultOg.og!, width: 1200, height: 630, alt: defaultOg.alt }], locale: 'en_IN', type: 'website' }, twitter: { card: 'summary_large_image', images: [defaultOg.og!] }, icons: { icon: '/icon.svg' } };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="en"><body><noscript><style>{'.page-transition{opacity:1!important}'}</style></noscript><Navigation /><StickyBookBar /><Cursor />{children}<Footer /></body></html>; }

