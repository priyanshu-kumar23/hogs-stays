import Image from 'next/image';
import PageHero from '@/components/pages/PageHero';
import CtaBand from '@/components/pages/CtaBand';
import About from '@/components/sections/About';
import { content, images } from '@/lib/content';
import { pageMetadata } from '@/lib/seo';
export const metadata = pageMetadata({ title: 'About HOGS', description: 'HOGS — House of GS — was born from open roads and strangers who became friends. Meet Gazal and Saloni and the vaataavaran behind our Manali stays.', path: '/about', image: images.hogs1.src });
export default function AboutPage() {
  return <main id="main" className="subpage"><PageHero eyebrow={content.ui.about.byline} title={<>Open roads.<br /><em>Open hearts.</em></>} lede="A place to belong." image={images.hogs1.src} alt={images.hogs1.alt} position={images.hogs1.position} />
    <About full />
    <section className="section vaataavaran" data-reveal><div><p className="eyebrow">VAATAAVARAN / वातावरण</p><h2>The feeling<br /><em>of a place.</em></h2><p>{content.hero.description}</p></div><div className="vaataavaran-photos"><figure><Image src={images.hogs2.src} alt={images.hogs2.alt} fill sizes="(max-width:900px) 50vw, 25vw" style={{ objectPosition: images.hogs2.position }} /></figure><figure><Image src={images.hogs3.src} alt={images.hogs3.alt} fill sizes="(max-width:900px) 50vw, 25vw" style={{ objectPosition: images.hogs3.position }} /></figure></div></section>
    <CtaBand eyebrow="YOU'RE INVITED" title={['Come and', 'find your vaataavaran.']} href="/stays" label="Our stays" secondary={{ href: '/book', label: 'Book now' }} /></main>;
}
