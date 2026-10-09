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
import FloatingMusicPlayer from '@/components/FloatingMusicPlayer';
import { panoramaCoverImage, panoramaOgImage } from '@/lib/gallery';
const origin = process.env.NEXT_PUBLIC_SITE_URL || 'https://hogsstays.com';
const defaultOg = { og: panoramaOgImage.src, alt: panoramaCoverImage.alt };
export const metadata: Metadata = { metadataBase: new URL(origin), title: { default: 'HOGS — Of Himalayan Homes | Mountain Stays & Cafe in Manali', template: '%s | HOGS' }, description: 'Find your Vaataavaran. Discover HOGS Panorama and Cafe DO NTHNG — a soulful mountain stay and cafe in Manali, Himachal Pradesh.', openGraph: { title: 'HOGS — Of Himalayan Homes', description: 'A mountain stay and a cafe. One beautiful feeling. Find your place in Manali.', images: [{ url: defaultOg.og!, width: 1200, height: 630, alt: defaultOg.alt }], locale: 'en_IN', type: 'website' }, twitter: { card: 'summary_large_image', images: [defaultOg.og!] }, icons: { icon: '/icon.svg' } };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="en"><body><noscript><style>{'.page-transition{opacity:1!important}'}</style></noscript><Navigation stays={stayMenuItems()} /><StickyBookBar /><Cursor />{children}<Footer /><FloatingMusicPlayer /></body></html>; }

