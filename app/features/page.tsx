import Image from 'next/image';
import PageHero from '@/components/pages/PageHero';
import CtaBand from '@/components/pages/CtaBand';
import Icon from '@/components/ui/Icon';
import { content, images } from '@/lib/content';
import { pageMetadata } from '@/lib/seo';
export const metadata = pageMetadata({ title: 'Features & Experiences', description: 'Come for the mountains, stay for the feeling. Views worth pausing for, little rituals and room to slow down at HOGS in Manali.', path: '/features', image: images.valley.src });
export default function FeaturesPage() {
  const { features, ui } = content;
  return <main id="main" className="subpage"><PageHero eyebrow={ui.features.eyebrow} title={<>Come for the <em>mountains.</em><br />Stay for the feeling.</>} lede={ui.features.description.join(' ')} image={images.valley.src} alt={images.valley.alt} position={images.valley.position} />
    <section className="section feature-intro" data-reveal><p className="eyebrow">{ui.features.eyebrow}</p><h2>{ui.features.heading[0]}<br /><em>{ui.features.heading[1]}</em></h2><p>Illustrative mountain journal · experiences and photography to be confirmed by HOGS.</p></section>
    <section id="features" className="feature-rows" aria-label="Experiences at HOGS">{features.map((feature, index) => <article className={`feature-row${index % 2 ? ' is-flipped' : ''}`} key={feature.number} data-reveal><div className="feature-row-photo"><Image src={feature.image} alt={feature.imageAlt} fill sizes="(max-width:900px) 100vw, 50vw" /><span className="feature-number">{feature.number}</span></div><div className="feature-row-copy"><span className="feature-row-icon"><Icon name={feature.icon} size={28} /></span><span className="eyebrow">THE ART OF BEING HERE / {feature.number}</span><h2>{feature.title}</h2><p>{feature.text}</p></div></article>)}</section>
    <CtaBand eyebrow="LESS ITINERARY. MORE INSTINCT." title={['Ready for', 'the feeling?']} href="/stays" label="Find your mountain home" secondary={{ href: '/book', label: 'Book now' }} /></main>;
}
