import { notFound } from 'next/navigation';
import PageHero from '@/components/pages/PageHero';
import PackageCard from '@/components/packages/PackageCard';
import Rail from '@/components/packages/Rail';
import DayArticle from '@/components/packages/DayArticle';
import DayNavigator from '@/components/packages/DayNavigator';
import EnquiryForm from '@/components/packages/EnquiryForm';
import HogsStrip from '@/components/packages/HogsStrip';
import AttractionsSection, { type ActivityChip, type PlaceCard } from '@/components/packages/AttractionsSection';
import FaqSection from '@/components/packages/FaqSection';
import { duration, durationLong, getPackage, otherPackages, packageCopy, packageHref, packageTitle, packages } from '@/lib/packages';
import { site } from '@/lib/content';
import { activitiesFor, attractionTypes, attractionsFor } from '@/lib/attractions';
import { faqCategories, faqJsonLd, faqsFor, visibleFaqs, whatsappHref } from '@/lib/faqs';
import { pageMetadata } from '@/lib/seo';
type Props = { params: Promise<{ slug: string }> };
export const dynamicParams = false;
export function generateStaticParams() { return packages.map(pkg => ({ slug: pkg.slug })); }
export async function generateMetadata({ params }: Props) {
  const pkg = getPackage((await params).slug); if (!pkg) return {};
  const hero = pkg.heroImage;
  return pageMetadata({ title: `${packageTitle(pkg).replace(/\.$/, '')} — ${durationLong(pkg)}`, description: `${pkg.tagline} ${pkg.description} Price on request.`, path: packageHref(pkg), image: hero.og ?? hero.src, imageMeta: hero.og ? { width: 1200, height: 630, alt: hero.alt } : undefined });
}
export default async function PackagePage({ params }: Props) {
  const pkg = getPackage((await params).slug); if (!pkg) notFound();
  const hero = pkg.heroImage; const num = String(pkg.index).padStart(2, '0'); const total = String(packages.length).padStart(2, '0');
  const url = `${site.origin}${packageHref(pkg)}`;
  const schema = {
    '@context': 'https://schema.org', '@type': 'TouristTrip', name: packageTitle(pkg), description: `${pkg.tagline} ${pkg.description}`, url, image: `${site.origin}${hero.og ?? hero.src}`,
    touristType: pkg.perfectFor, provider: { '@type': 'LodgingBusiness', name: 'HOGS — Of Himalayan Homes', url: site.origin },
    itinerary: { '@type': 'ItemList', numberOfItems: pkg.itinerary.length, itemListElement: pkg.itinerary.map(day => ({ '@type': 'ListItem', position: day.dayNumber, name: `Day ${day.dayNumber}: ${day.title}`, description: day.narrative.join(' ') })) },
  };
  const placed = attractionsFor(pkg); const placeSlugs = new Set(placed.map(entry => entry.item.slug));
  const places: PlaceCard[] = placed.map(({ item, days }) => ({ slug: item.slug, name: item.name, type: item.type, line: item.line, description: item.description, doBullets: item.doBullets, season: item.season, tip: item.tip, image: { src: item.image.src, alt: item.image.alt, caption: item.image.caption, position: item.image.position, blur: item.image.blur, credit: item.image.credit }, days }));
  const chips: ActivityChip[] = activitiesFor(pkg).map(({ item, days }) => ({ slug: item.slug, label: item.label, note: item.note, tag: item.tag, days: days.map(day => day.n) }));
  const types = attractionTypes.filter(type => placed.some(entry => entry.item.type === type));
  const allFaqs = faqsFor(pkg);
  const glance: [string, React.ReactNode][] = [['Duration', durationLong(pkg)], ['Style', pkg.style], ['Best for', pkg.perfectFor.join(' · ')], ['Key places', pkg.highlights.join(' · ')], ['Starts and ends', `at ${pkg.startsEndsAt}`]];
  return <main id="main" className="subpage pk-page">
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, '\\u003c') }} />
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd(allFaqs)).replace(/</g, '\u003c') }} />
    <PageHero eyebrow={`JOURNEY ${num} / ${total} — ${durationLong(pkg).toUpperCase()}`} title={<>{pkg.title[0]}<br /><em>{pkg.title[1]}</em></>} lede={pkg.tagline} image={hero.src} alt={hero.alt} position={hero.position}>
      <div className="pk-hero-meta"><span className="pk-badge pk-badge-static">{duration(pkg)}</span><ul className="chips pk-chips" aria-label="Perfect for">{pkg.perfectFor.map(label => <li className="chip" key={label}>{label}</li>)}</ul><span className="pk-price">{packageCopy.priceLabel}</span></div>
      <a className="pk-btn pk-btn-lg" href="#enquire">Enquire about this journey <span aria-hidden="true">↗</span></a>
    </PageHero>
    <section className="section pk-glance" aria-label="At a glance">
      <div className="section-topline"><p className="eyebrow">AT A GLANCE</p><span className="section-index">{num} — THE SHAPE OF THE JOURNEY</span></div>
      <dl>{glance.map(([term, value]) => <div key={term} data-reveal><dt className="eyebrow">{term}</dt><dd>{value}</dd></div>)}</dl>
      <p className="pk-glance-note">{pkg.summary}</p>
    </section>
    <div className="pk-layout">
      <div className="pk-cols">
      <DayNavigator days={pkg.itinerary.map(day => ({ n: day.dayNumber, title: day.title }))} />
      <div className="pk-itinerary">
        <div className="section-topline"><p className="eyebrow">THE ITINERARY</p><span className="section-index">DAY BY DAY</span></div>
        {pkg.itinerary.map((day, i) => <DayArticle key={day.dayNumber} day={day} total={pkg.itinerary.length} priority={i === 0} places={placeSlugs} />)}
      </div>
      <aside id="enquire" className="pk-aside" aria-label="Enquire about this journey" data-lenis-prevent><EnquiryForm slug={pkg.slug} /></aside>
      </div>
      <div className="pk-wide">
        <AttractionsSection places={places} activities={chips} types={types} eyebrow="04 / ALONG THE WAY" heading={['Places you’ll', 'meet', 'on this journey.']} intro="Every place below appears in the itinerary. Open one to see what to do there, when it’s at its best, and a tip from your hosts." />
        <FaqSection items={visibleFaqs(allFaqs).map(item => ({ ...item, tag: undefined }))} categories={faqCategories} eyebrow="05 / BEFORE YOU ASK" heading={['Good questions,', 'slow answers.']} whatsapp={whatsappHref(pkg)} id="faqs" />
      </div>
    </div>
    <HogsStrip />
    <section className="section pk-more-journeys" aria-labelledby="pk-other-title">
      <div className="section-topline"><p className="eyebrow">OTHER JOURNEYS</p><span className="section-index">{packageCopy.index}</span></div>
      <h2 id="pk-other-title" data-reveal>Other roads,<br /><em>same mountains.</em></h2>
      <Rail label="Other Manali journeys">{otherPackages(pkg.slug).map(other => <PackageCard key={other.slug} pkg={other} />)}</Rail>
    </section>
  </main>;
}
