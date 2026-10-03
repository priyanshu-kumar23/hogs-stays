import PageHero from '@/components/pages/PageHero';
import CtaBand from '@/components/pages/CtaBand';
import PackageCard from '@/components/packages/PackageCard';
import PackagesBrowser from '@/components/packages/PackagesBrowser';
import HogsStrip from '@/components/packages/HogsStrip';
import FaqSection from '@/components/packages/FaqSection';
import { faqCategories, faqJsonLd, generalFaqs, visibleFaqs, whatsappHref } from '@/lib/faqs';
import { allNights, allPerfectFor, packageCopy, packageHref, packages } from '@/lib/packages';
import { content, site } from '@/lib/content';
import { pageMetadata } from '@/lib/seo';
const hero = packages[0].heroImage;
export const metadata = pageMetadata({ title: 'Manali Tour Packages', description: 'Five slow, day-by-day Manali journeys from HOGS Panorama, from 3 nights to 7 days: classics, offbeat villages, waterfalls and forests. Price on request.', path: '/packages', image: hero.og, imageMeta: hero.og ? { width: 1200, height: 630, alt: hero.alt } : undefined });
export default function PackagesPage() {
  const schema = { '@context': 'https://schema.org', '@type': 'ItemList', name: 'Manali journeys from HOGS', itemListElement: packages.map((pkg, i) => ({ '@type': 'ListItem', position: i + 1, url: `${site.origin}${packageHref(pkg)}`, name: pkg.title.join(' ') })) };
  return <main id="main" className="subpage pk-page">
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, '\\u003c') }} />
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd(generalFaqs())).replace(/</g, '\u003c') }} />
    <PageHero eyebrow={packageCopy.eyebrow} title={<>{packageCopy.heading[0]}<br /><em>{packageCopy.heading[1]}</em></>} lede={packageCopy.intro} image={hero.src} alt={hero.alt} position={hero.position} />
    <section className="section pk-list" aria-label="Manali journeys">
      <div className="section-topline"><p className="eyebrow">ALL JOURNEYS</p><span className="section-index">{packageCopy.index}</span></div>
      <PackagesBrowser nights={allNights} audiences={allPerfectFor} items={packages.map(pkg => ({ slug: pkg.slug, nights: pkg.nights, perfectFor: pkg.perfectFor, card: <PackageCard pkg={pkg} sizes="(max-width: 700px) 92vw, (max-width: 1100px) 46vw, 420px" /> }))} />
    </section>
    <div className="section pk-faq-wrap"><FaqSection items={visibleFaqs(generalFaqs())} categories={faqCategories} eyebrow="BEFORE YOU ASK" heading={['Good questions,', 'slow answers.']} whatsapp={whatsappHref()} /></div>
    <HogsStrip />
    <CtaBand eyebrow="NOT SURE WHICH ONE?" title={['Tell us how you', 'like to travel.']} href={`https://wa.me/${content.whatsapp}`} label="Chat on WhatsApp" secondary={{ href: '/book', label: 'Plan your stay' }} />
  </main>;
}
