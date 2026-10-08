import { notFound } from 'next/navigation';
import PolicyLayout from '@/components/policy/PolicyLayout';
import PolicyBlocks from '@/components/policy/PolicyBlocks';
import RichText from '@/components/policy/RichText';
import HouseRulesGrid from '@/components/policy/HouseRulesGrid';
import FaqAccordion from '@/components/policy/FaqAccordion';
import { CancellationTimeline, PaymentTimeline, PeakNotice } from '@/components/policy/Timelines';
import { guestFaqGroups, guestFaqJsonLdFor } from '@/lib/faqs';
import { policyBySlug, policyPages, type PolicySection } from '@/lib/policies';
import { site } from '@/lib/content';
import { pageMetadata } from '@/lib/seo';

// The five guest-information pages. Slugs match the live site (see lib/policies.ts); the old /terms-and-conditions and /house-rules URLs
// redirect here from next.config.ts. All five are indexable and listed in the sitemap.
export const dynamicParams = false;
export const generateStaticParams = () => policyPages.map(page => ({ policy: page.slug }));
type Props = { params: Promise<{ policy: string }> };
export async function generateMetadata({ params }: Props) {
  const page = policyBySlug((await params).policy); if (!page) return {};
  return pageMetadata({ title: page.title, description: page.description, path: `/${page.slug}` });
}

const sectionExtras = (slug: string, section: PolicySection) => {
  if (slug === 'terms-conditions' && section.id === 'payment-policy') return <PaymentTimeline />;
  if (slug === 'cancellation-refund-policy' && section.id === 'standard-payment-terms') return <PaymentTimeline />;
  if (slug === 'cancellation-refund-policy' && section.id === 'cancellation-policy') return <><CancellationTimeline /><PeakNotice /></>;
  return null;
};

export default async function PolicyPage({ params }: Props) {
  const { policy } = await params;
  const page = policyBySlug(policy); if (!page) notFound();
  const toc = page.slug === 'faqs' ? guestFaqGroups.map(group => ({ id: `group-${group.id}`, title: group.title })) : page.sections.map(section => ({ id: section.id, title: section.title }));
  const url = `${site.origin}/${page.slug}`;
  const breadcrumbs = { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Home', item: site.origin }, { '@type': 'ListItem', position: 2, name: page.title, item: url }] };
  const ld = [breadcrumbs, ...(page.slug === 'faqs' ? [guestFaqJsonLdFor()] : [])];
  return <>
    {ld.map((entry, index) => <script key={index} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(entry).replace(/</g, '\\u003c') }} />)}
    <PolicyLayout page={page} toc={toc}>
      {page.slug === 'faqs' ? <FaqAccordion groups={guestFaqGroups} />
        : page.slug === 'house-rules-guest-guidelines' ? <HouseRulesGrid sections={page.sections} />
        : <>
          {page.sections.map(section => <section key={section.id} id={section.id} className="pl-sec" aria-labelledby={`${section.id}-t`}>
            <h2 id={`${section.id}-t`}>{section.title}</h2>
            <PolicyBlocks blocks={page.slug === 'cancellation-refund-policy' && section.id === 'cancellation-policy' ? section.blocks.filter(block => block.type !== 'note') : section.blocks} />
            {sectionExtras(page.slug, section)}
          </section>)}
          {page.closing && <p className="pl-closing"><RichText text={`**${page.closing}**`} /></p>}
        </>}
    </PolicyLayout>
  </>;
}
