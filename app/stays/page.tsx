import Image from 'next/image';
import Link from 'next/link';
import PageHero from '@/components/pages/PageHero';
import CtaBand from '@/components/pages/CtaBand';
import Icon from '@/components/ui/Icon';
import { content, images } from '@/lib/content';
import { pageMetadata } from '@/lib/seo';
export const metadata = pageMetadata({ title: 'Our Stays', description: 'Two ways to belong in Manali: HOGS Panorama, a mountain stay with panoramic valley views, and Cafe Do Nthng, a slow-morning cafe surrounded by nature.', path: '/stays', image: images.hogs2.src });
export default function StaysPage() {
  const { ui, properties } = content;
  return <main id="main" className="subpage"><PageHero eyebrow={ui.stays.eyebrow} title={<>{ui.stays.heading[0]}<br /><em>{ui.stays.heading[1]}</em></>} lede={content.staysIntro} image={images.hogs2.src} alt={images.hogs2.alt} position={images.hogs2.position} />
    <section className="stay-list" aria-label="HOGS properties">{properties.map((property, index) => { const cafe = property.type === 'cafe'; return <article className={`stay-row${index % 2 ? ' is-flipped' : ''}`} key={property.id} data-reveal><Link className="stay-row-photo" href={property.path} aria-label={`${property.name} — ${cafe ? 'visit the cafe' : 'explore the stay'}`}><Image src={property.images[0].src} alt={property.images[0].alt} fill sizes="(max-width:900px) 100vw, 55vw" style={{ objectPosition: property.images[0].position }} /></Link><div className="stay-row-copy"><p className="eyebrow">0{index + 1} / {cafe ? ui.stays.cafeLabel : ui.stays.cardEyebrow}</p><h2>{property.name}</h2><p className="subtitle">{property.subtitle}</p><p>{cafe ? 'A slow-morning cafe surrounded by nature.' : property.description}</p>{!cafe && <div className="chips">{property.highlights.map(chip => <span className="chip" key={chip}>{chip}</span>)}</div>}<div className="stay-row-actions"><Link className="button" href={property.path}>{cafe ? ui.stays.cafeCta : 'Explore the stay'} <Icon /></Link>{!cafe && <Link className="text-link" href={`/book?property=${property.id}`}>{ui.stays.cta} <Icon /></Link>}</div></div></article>; })}</section>
    <CtaBand eyebrow="THE MOUNTAINS ARE CALLING" title={['Let the mountains', 'welcome you.']} href="/book" label="Book your stay" /></main>;
}
