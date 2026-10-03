import Image from 'next/image';
import PageHero from '@/components/pages/PageHero';
import CtaBand from '@/components/pages/CtaBand';
import Icon from '@/components/ui/Icon';
import { content, images, site } from '@/lib/content';
import { pageMetadata } from '@/lib/seo';
const cafe = content.properties.find(item => item.id === 'cafe')!;
const visitMessage = 'Hello HOGS! I would like to visit Cafe DO NTHNG.';
export const metadata = pageMetadata({ title: 'Cafe DO NTHNG — Slow-Morning Cafe in Manali', description: 'Cafe DO NTHNG by HOGS: a slow-morning cafe surrounded by nature in Manali. Good coffee, zero agenda.', path: cafe.path, image: images.cafe.src });
export default function CafePage() {
  const schema = { '@context': 'https://schema.org', '@type': 'CafeOrCoffeeShop', name: cafe.name, url: `${site.origin}${cafe.path}`, image: `${site.origin}${images.cafe.src}`, telephone: content.phone, email: content.email, address: { '@type': 'PostalAddress', addressLocality: 'Manali', addressRegion: 'Himachal Pradesh', addressCountry: 'IN' } };
  return <main id="main" className="subpage"><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, '\\u003c') }} />
    <PageHero eyebrow={`${content.ui.stays.cafeLabel} · MANALI`} title={<>Cafe<br /><em>DO NTHNG</em></>} lede={cafe.subtitle} image={images.cafe.src} alt={images.cafe.alt} position={images.cafe.position} />
    <section className="section detail-intro" data-reveal><div><p className="eyebrow">THE CAFE</p><h2>Slow mornings,<br /><em>zero agenda.</em></h2></div><div><p>Cafe DO NTHNG is the HOGS cafe — a slow-morning spot surrounded by nature, made for doing a little less and noticing a little more.</p><ul className="cafe-info"><li><span className="eyebrow">OPENING HOURS</span>Coming soon — message us and we’ll tell you when the kettle’s on.</li><li><span className="eyebrow">DIRECTIONS</span>{cafe.mapUrl ? <a className="text-link" href={cafe.mapUrl} target="_blank" rel="noopener noreferrer">{content.ui.stays.cafeDirections} <Icon name="pin" /></a> : 'Map link coming soon. Ask us on WhatsApp and we’ll guide you in.'}</li></ul><div className="stay-row-actions"><a className="button" href={`https://wa.me/${content.whatsapp}?text=${encodeURIComponent(visitMessage)}`} target="_blank" rel="noopener noreferrer"><Icon name="chat" size={17} /> Ask about a visit</a><a className="text-link" href={`tel:+${content.whatsapp}`}>{content.phone}</a></div></div></section>
    <section className="detail-photos detail-photos--single" aria-label="Cafe DO NTHNG photograph"><figure className="detail-photo detail-photo-1" data-reveal><Image src={images.cafe.src} alt={images.cafe.alt} fill sizes="(max-width:900px) 100vw, 80vw" style={{ objectPosition: images.cafe.position }} /></figure></section>
    <CtaBand eyebrow="STAY A LITTLE LONGER" title={['Coffee first.', 'Then the mountains.']} href="/stays/panorama" label="See HOGS Panorama" secondary={{ href: '/book', label: 'Book a stay' }} /></main>;
}
