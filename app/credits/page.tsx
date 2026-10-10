import Link from 'next/link';
import { content } from '@/lib/content';
import { pageMetadata } from '@/lib/seo';
export const metadata = pageMetadata({ title: 'Credits', description: 'Photo, terrain and data credits for the HOGS website.', path: '/credits' });
// Attribution that used to sit in the footer. Required credit for Wikimedia Commons (CC BY / CC BY-SA) images and the terrain/satellite data:
// keep it reachable from the footer ("Credits") even though it no longer renders on every page.
export default function CreditsPage() {
  return <main id="main" className="policy-page"><article>
    <p className="eyebrow">THANK YOU</p>
    <h1>Credits</h1>
    <h2>Image credits</h2>
    <p>{content.journeyCredit} <a href="/images/packages/CREDITS.md">Full image credits</a></p>
    <h2>Café scene</h2>
    <p>Tabletop: <a href="https://polyhaven.com/a/wood_table_001">Wood Table 001</a> by Dimitrios Savva and Rico Cilliers, Poly Haven, <a href="https://polyhaven.com/license">CC0</a>. Cup, latte art and steam are generated for this website. <a href="/textures/cafe/LICENSE.md">Asset notes</a></p>
    <h2>Landscape credits</h2>
    <p>{content.landscape.credit}</p>
    <p>{content.landscape.textures} <a href="/terrain/ATTRIBUTION.md">Landscape credits</a></p>
    <p>{content.landscape.note}</p>
    <p><Link href="/" prefetch={false}>Back to home</Link></p>
  </article></main>;
}
