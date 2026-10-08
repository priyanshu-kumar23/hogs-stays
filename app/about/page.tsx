import PageHero from '@/components/pages/PageHero';
import CtaBand from '@/components/pages/CtaBand';
import About from '@/components/sections/About';
import { FounderCards, VaataavaranPhotos, TeamPhoto, MomentsGrid } from '@/components/about/AboutSections';
import { aboutImages } from '@/lib/aboutImages.generated';
import { content, pic, site } from '@/lib/content';
import { pageMetadata } from '@/lib/seo';
const hero = pic('attic-lounge-with-timber-ceiling');
export const metadata = pageMetadata({ title: 'About HOGS', description: 'HOGS — House of GS — was born from open roads and strangers who became friends. Meet Gazal and Saloni and the Vaataavaran behind our Manali stays.', path: '/about', image: hero.og });
const organization = {
  '@context': 'https://schema.org', '@type': 'Organization', name: 'HOGS — Of Himalayan Homes', alternateName: 'House of GS', url: site.origin,
  sameAs: [content.instagram, content.cafeInstagram], email: content.email, telephone: content.phone,
  address: { '@type': 'PostalAddress', addressLocality: 'Manali', addressRegion: 'Himachal Pradesh', addressCountry: 'IN' },
  founder: [
    { '@type': 'Person', name: 'Gazal', jobTitle: 'Co-founder', image: `${site.origin}${aboutImages.gazal.src}`, url: `${site.origin}/about` },
    { '@type': 'Person', name: 'Saloni', jobTitle: 'Co-founder', image: `${site.origin}${aboutImages.saloni.src}`, url: `${site.origin}/about` },
  ],
};
export default function AboutPage() {
  return <main id="main" className="subpage"><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organization).replace(/</g, '\\u003c') }} /><PageHero eyebrow={content.ui.about.byline} title={<>Open roads.<br /><em>Open hearts.</em></>} lede="A place to belong." image={hero.src} alt={hero.alt} position={hero.position} />
    <About full aside={<FounderCards />} />
    <section className="section vaataavaran" data-reveal><div><p className="eyebrow">VAATAAVARAN / वातावरण</p><h2>The feeling<br /><em>of a place.</em></h2><p>{content.hero.description}</p></div><VaataavaranPhotos /></section>
    <TeamPhoto />
    <MomentsGrid />
    <CtaBand eyebrow="YOU'RE INVITED" title={['Come and', 'find your Vaataavaran.']} href="/stays" label="Our stays" secondary={{ href: '/book', label: 'Book now' }} /></main>;
}
