import Image from 'next/image';
import Link from 'next/link';
import PageHero from '@/components/pages/PageHero';
import Icon from '@/components/ui/Icon';
import InstagramLink from '@/components/ui/InstagramLink';
import BookButton from '@/components/booking/BookButton';
import BookingHost from '@/components/booking/BookingHost';
import { packages, packageTitle } from '@/lib/packages';
import { content, pic } from '@/lib/content';
import { pageMetadata } from '@/lib/seo';
const hero = pic('bedroom-with-valley-view');
export const metadata = pageMetadata({ title: 'Our Stays', description: 'Two ways to belong in Manali: HOGS Panorama, a mountain stay with panoramic valley views, and Cafe DO NTHNG, a slow-morning cafe surrounded by nature.', path: '/stays', image: hero.og });
export default function StaysPage() {
  const { ui, properties } = content;
  return <main id="main" className="subpage"><PageHero eyebrow={ui.stays.eyebrow} title={<>{ui.stays.heading[0]}<br /><em>{ui.stays.heading[1]}</em></>} lede={content.staysIntro} image={hero.src} alt={hero.alt} position={hero.position} />
    <section className="stay-list" aria-label="HOGS properties">{properties.map((property, index) => { const cafe = property.type === 'cafe'; return <article className={`stay-row${index % 2 ? ' is-flipped' : ''}`} key={property.id} data-reveal><Link className="stay-row-photo" href={property.path} aria-label={`${property.name} — ${cafe ? 'visit the cafe' : 'explore the stay'}`}><Image src={property.images[0].src} alt={property.images[0].alt} fill sizes="(max-width:900px) 100vw, 55vw" style={{ objectPosition: property.images[0].position }} /></Link><div className="stay-row-copy"><p className="eyebrow">0{index + 1} / {cafe ? ui.stays.cafeLabel : ui.stays.cardEyebrow}</p><h2>{property.name}</h2><p className="subtitle">{property.subtitle}</p><p>{cafe ? 'A slow-morning cafe surrounded by nature.' : property.description}</p>{!cafe && <div className="chips">{property.highlights.map(chip => <span className="chip" key={chip}>{chip}</span>)}</div>}<div className="stay-row-actions"><Link className="button" href={property.path}>{cafe ? ui.stays.cafeCta : 'Explore the stay'} <Icon /></Link>{!cafe && <BookButton className="text-link panorama-book-trigger">{ui.stays.cta} <Icon /></BookButton>}{cafe && <InstagramLink className="text-link" href={content.cafeInstagram} label="Cafe DO NTHNG on Instagram" />}</div></div></article>; })}</section>
    <section className="panorama-book-band"><p className="eyebrow">YOUR NEXT MOUNTAIN CHAPTER</p><h2>A few details.<br /><em>A whole new perspective.</em></h2><p>Choose your journey, bring your people, and let us plan your Panorama escape.</p><BookButton className="button">Plan my Panorama escape <Icon /></BookButton></section><BookingHost currentSlug={packages[0].slug} property={{ name: 'HOGS Panorama', image: hero.src }} packages={packages.map(item => ({slug:item.slug,name:packageTitle(item).replace(/\.$/,''),nights:item.nights,days:item.days,thumb:item.cardImage.src,season:item.itinerary.flatMap(day=>(day.callouts??[]).filter(note=>note.kind==='season').map(note=>note.text)).filter((note,index,all)=>all.indexOf(note)===index)}))} /></main>;
}
