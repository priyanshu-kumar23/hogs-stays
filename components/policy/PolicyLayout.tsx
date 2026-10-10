import Link from 'next/link';
import type { ReactNode } from 'react';
import { formatUpdated, policyContact, policyHref, policyPages, type PolicyPage } from '@/lib/policies';
import PolicyToc, { type TocItem } from './PolicyToc';
import { ContactList } from './PolicyBlocks';
import '@/app/policy.css';

// One layout for all five guest-information pages: compact hero (label, title, intro, breadcrumb, last updated), a sticky table of contents with
// scroll-spy beside a readable column, then "Still have questions?" and related links. Paper-toned body, print-friendly.
export default function PolicyLayout({ page, toc, children }: { page: PolicyPage; toc: TocItem[]; children: ReactNode }) {
  const related = policyPages.filter(item => item.slug !== page.slug);
  return <main id="main" className="subpage policy">
    <header className="pl-hero">
      <div className="pl-hero-inner">
        <nav className="pl-crumbs" aria-label="Breadcrumb"><ol><li><Link href="/" prefetch={false}>Home</Link></li><li aria-current="page">{page.title}</li></ol></nav>
        <p className="eyebrow">GUEST INFORMATION</p>
        <h1>{page.title}</h1>
        <p className="pl-intro">{page.intro}</p>
        <p className="pl-updated">Last updated: <time dateTime={page.lastUpdated}>{formatUpdated(page.lastUpdated)}</time></p>
      </div>
    </header>
    <div className="pl-wrap">
      <aside className="pl-aside"><PolicyToc items={toc} label={page.slug === 'faqs' ? 'Topics' : 'On this page'} /></aside>
      <article className="pl-body">{children}</article>
    </div>
    <section className="pl-after" aria-label="More help">
      <div className="pl-help">
        <p className="eyebrow">STILL HAVE QUESTIONS?</p>
        <h2>We’re happy to help.</h2>
        <ContactList compact />
        <p className="pl-help-actions">
          <a className="pl-button" href={policyContact.whatsappHref} target="_blank" rel="noopener noreferrer">WhatsApp us <span aria-hidden="true">↗</span></a>
          <a className="pl-button is-outline" href={policyContact.emailHref}>Email</a>
        </p>
      </div>
      <nav className="pl-related" aria-label="Related pages">
        <p className="eyebrow">RELATED</p>
        <ul>{related.map(item => <li key={item.slug}><Link href={policyHref(item.slug)}>{item.title} <span aria-hidden="true">→</span></Link></li>)}</ul>
      </nav>
    </section>
  </main>;
}
