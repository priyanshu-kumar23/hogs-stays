import Image from 'next/image';
import Link from 'next/link';
import { duration, packageHref, packageCopy, type TourPackage } from '@/lib/packages';
// One compact journey card, shared by the home rail, the /packages grid and the "Other journeys" rail. Static markup: the hover behaviour
// (image zoom, arrow nudge, route reveal) is pure CSS in app/packages.css, never changes the card's height, and is off for prefers-reduced-motion.
// Photo credits live in the (i) tooltip on the image (keyboard and touch accessible), on the detail pages, in the footer link and CREDITS.md.
export default function PackageCard({ pkg, sizes = '(max-width: 700px) 82vw, (max-width: 1100px) 45vw, 420px', priority = false }: { pkg: TourPackage; sizes?: string; priority?: boolean }) {
  const href = packageHref(pkg); const image = pkg.cardImage; const num = String(pkg.index).padStart(2, '0'); const title = pkg.title;
  const chips = pkg.perfectFor.slice(0, 2); const more = pkg.perfectFor.slice(2); const creditId = `pk-credit-${pkg.slug}`;
  return <article className="pk-card">
    <figure className="pk-card-media">
      <div className="pk-card-visual">
        <Link href={href} tabIndex={-1} aria-hidden="true" className="pk-card-img"><Image src={image.md} alt="" fill sizes={sizes} priority={priority} style={{ objectPosition: image.position }} placeholder="blur" blurDataURL={image.blur} /></Link>
        <span className="pk-badge">{duration(pkg)}</span>
        <p className="pk-route" aria-label={`Route: ${pkg.route.join(' to ')}`}><span aria-hidden="true">{pkg.route.join(' → ')}</span></p>
        {image.credit && <span className="pk-credit"><button type="button" aria-label="Photo credit" aria-describedby={creditId}>i</button><span role="tooltip" id={creditId}>Photo: {image.credit.author} · <a href={image.credit.source} target="_blank" rel="noopener noreferrer">{image.credit.license}</a></span></span>}
      </div>
      <figcaption>FIG. {num} — {image.caption}</figcaption>
    </figure>
    <div className="pk-card-body">
      <h3><Link href={href}>{title[0]} <em>{title[1]}</em></Link></h3>
      <p className="pk-tagline">{pkg.tagline}</p>
      <ul className="chips pk-chips" aria-label="Perfect for">{chips.map(label => <li className="chip" key={label}>{label}</li>)}{more.length > 0 && <li className="chip pk-chip-more" title={more.join(', ')} aria-label={`and ${more.join(', ')}`}>+{more.length}</li>}</ul>
      <p className="pk-places" aria-label="Highlights">{pkg.highlights.slice(0, 3).join(' · ')}</p>
      <div className="pk-foot">
        <p className="pk-price">{packageCopy.priceLabel}</p>
        <div className="pk-actions">
          <Link className="pk-btn" href={href}>View itinerary <span aria-hidden="true">→</span></Link>
          <Link className="pk-link" href={`${href}#enquire`}>Enquire <span aria-hidden="true">↗</span></Link>
        </div>
      </div>
    </div>
  </article>;
}
