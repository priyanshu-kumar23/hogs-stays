'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { panoramaBookingUrl } from '@/lib/content';

// The footer's "Book Now" sitemap link: the general booking page everywhere, but the Aiosell booking engine (new tab) on the HOGS Panorama pages.
export default function FooterBookLink({ href, title }: { href: string; title: string }) {
  const onPanorama = usePathname().startsWith('/stays/panorama');
  return onPanorama
    ? <a href={panoramaBookingUrl} target="_blank" rel="noopener noreferrer" aria-label={`${title}: HOGS Panorama, opens the secure booking site in a new tab`}>{title}</a>
    : <Link href={href}>{title}</Link>;
}
