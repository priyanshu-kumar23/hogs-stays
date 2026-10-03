import Link from 'next/link';
import PackageCard from '@/components/packages/PackageCard';
import Rail from '@/components/packages/Rail';
import { packageCopy, packages } from '@/lib/packages';
// Home "Journeys from HOGS" section, between the horizontal "HOGS way" story and the postcards. Same topline / heading pattern as
// Stays and Gallery. The `data-reveal` heading is picked up by the GSAP reveal in Motion.tsx.
export default function Journeys() {
  const { eyebrow, index, heading, intro, allCta } = packageCopy;
  return <section id="journeys" className="section journeys" aria-labelledby="journeys-title">
    <div className="section-topline"><p className="eyebrow">{eyebrow}</p><span className="section-index">{index}</span></div>
    <div className="section-heading" data-reveal><h2 id="journeys-title">{heading[0]}<br /><em>{heading[1]}</em></h2><p>{intro}</p></div>
    <Rail label="Manali journeys from HOGS">{packages.map((pkg, i) => <PackageCard key={pkg.slug} pkg={pkg} priority={i === 0} />)}</Rail>
    <Link className="text-link pk-all" href="/packages">{allCta}</Link>
  </section>;
}
