import Image from 'next/image';
import Link from 'next/link';
import PageHero from '@/components/pages/PageHero';
import CtaBand from '@/components/pages/CtaBand';
import Icon from '@/components/ui/Icon';
import { content, images, site } from '@/lib/content';
import { pageMetadata } from '@/lib/seo';
const property = content.properties.find(item => item.id === 'panorama')!;
export const metadata = pageMetadata({ title: 'HOGS Panorama — Mountain Stay in Manali', description: 'HOGS Panorama is a mountain stay in Manali with panoramic valley views and Himalayan hospitality — a front-row seat to the Himalayas.', path: property.path, image: images.hogs3.src });
export default function PanoramaPage() {
  const schema = { '@context': 'https://schema.org', '@type': 'LodgingBusiness', name: property.name, url: `${site.origin}${property.path}`, description: property.description, image: property.images.map(image => `${site.origin}${image.src}`), telephone: content.phone, email: content.email, address: { '@type': 'PostalAddress', addressLocality: 'Manali', addressRegion: 'Himachal Pradesh', addressCountry: 'IN' } };
  return <main id="main" className="subpage"><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, '\\u003c') }} />
    <PageHero eyebrow={`${content.ui.stays.cardEyebrow} · MANALI`} title={<>HOGS<br /><em>Panorama</em></>} lede={property.subtitle} image={images.hogs3.src} alt={images.hogs3.alt} position={images.hogs3.position}><Link className="button" href="/book?property=panorama">{content.ui.stays.cta} <Icon /></Link></PageHero>
    <section className="section detail-intro" data-reveal><div><p className="eyebrow">ABOUT THE STAY</p><h2>A front-row seat<br /><em>to the Himalayas.</em></h2></div><div><p>{property.description}</p><div className="chips">{property.highlights.map(chip => <span className="chip" key={chip}>{chip}</span>)}</div><p className="detail-note">Rates, room details and amenities are shared directly by the HOGS team when you enquire.</p></div></section>
    <section className="detail-photos" aria-label="HOGS Panorama photographs">{property.images.map((image, index) => <figure key={image.src} className={`detail-photo detail-photo-${index + 1}`} data-reveal><Image src={image.src} alt={image.alt} fill sizes={index === 0 ? '(max-width:900px) 100vw, 60vw' : '(max-width:900px) 100vw, 40vw'} style={{ objectPosition: image.position }} /></figure>)}</section>
    <CtaBand eyebrow="YOUR MOUNTAIN ADDRESS" title={['Your view is', 'waiting.']} href="/book?property=panorama" label={content.ui.stays.cta} secondary={{ href: '/stays', label: 'All stays' }} /></main>;
}
