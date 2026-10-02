import Image from 'next/image';
import PageHero from '@/components/pages/PageHero';
import CtaBand from '@/components/pages/CtaBand';
import About from '@/components/sections/About';
import { content, pic } from '@/lib/content';
import { pageMetadata } from '@/lib/seo';
const hero = pic('attic-lounge-with-timber-ceiling'); const photoA = pic('sofa-lounge-with-patterned-rug'); const photoB = pic('terrace-seating-by-glass-doors');
export const metadata = pageMetadata({ title: 'About HOGS', description: 'HOGS — House of GS — was born from open roads and strangers who became friends. Meet Gazal and Saloni and the vaataavaran behind our Manali stays.', path: '/about', image: hero.og });
export default function AboutPage() {
  return <main id="main" className="subpage"><PageHero eyebrow={content.ui.about.byline} title={<>Open roads.<br /><em>Open hearts.</em></>} lede="A place to belong." image={hero.src} alt={hero.alt} position={hero.position} />
    <About full />
    <section className="section vaataavaran" data-reveal><div><p className="eyebrow">VAATAAVARAN / वातावरण</p><h2>The feeling<br /><em>of a place.</em></h2><p>{content.hero.description}</p></div><div className="vaataavaran-photos"><figure><Image src={photoA.md} alt={photoA.alt} fill sizes="(max-width:900px) 50vw, 25vw" style={{ objectPosition: photoA.position }} /></figure><figure><Image src={photoB.md} alt={photoB.alt} fill sizes="(max-width:900px) 50vw, 25vw" style={{ objectPosition: photoB.position }} /></figure></div></section>
    <CtaBand eyebrow="YOU'RE INVITED" title={['Come and', 'find your vaataavaran.']} href="/stays" label="Our stays" secondary={{ href: '/book', label: 'Book now' }} /></main>;
}
