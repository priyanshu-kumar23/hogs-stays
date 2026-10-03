import Image from 'next/image';
import { calloutLabels, type PackageDay } from '@/lib/packages';
import { placeForStop } from '@/lib/attractions';
import PlaceLink from './PlaceLink';
// One day of a journey, laid out like a page of a mountain journal: outlined numeral, title, the route as "Place → Place", a figure,
// the story, then callouts. `data-reveal` is picked up by SubpageEffects (IntersectionObserver reveal, off for reduced motion).
export default function DayArticle({ day, total, priority = false, places }: { day: PackageDay; total: number; priority?: boolean; places?: Set<string> }) {
  const num = String(day.dayNumber).padStart(2, '0'); const image = day.image;
  return <article id={`day-${day.dayNumber}`} className="pk-day" data-reveal aria-labelledby={`day-${day.dayNumber}-title`}>
    <header className="pk-day-head">
      <span className="pk-day-num" aria-hidden="true">{num}</span>
      <div><p className="eyebrow">DAY {num} / {String(total).padStart(2, '0')}</p><h2 id={`day-${day.dayNumber}-title`}>{day.title}</h2></div>
    </header>
    <ol className="pk-route-line" aria-label="Route for the day">{day.stops.map(stop => { const slug = placeForStop(stop); return <li key={stop}>{slug && places?.has(slug) ? <PlaceLink slug={slug} label={stop} /> : stop}</li>; })}</ol>
    <figure className="pk-day-fig">
      <div className="pk-day-img"><Image src={image.src} alt={image.alt} fill sizes="(max-width: 1100px) 92vw, 640px" priority={priority} loading={priority ? undefined : 'lazy'} style={{ objectPosition: image.position }} placeholder="blur" blurDataURL={image.blur} /></div>
      <figcaption><span>FIG. {num} — {image.caption}</span>{image.credit && <small>Photo: {image.credit.author} · <a href={image.credit.source} target="_blank" rel="noopener noreferrer">{image.credit.license}</a></small>}</figcaption>
    </figure>
    <div className="pk-day-copy">
      {day.narrative.map((text, i) => <p key={i}>{text}</p>)}
      {day.places && <ul className="pk-day-places">{day.places.map(place => <li key={place.name}><strong>{place.name}</strong>{place.text && <span>{place.text}</span>}</li>)}</ul>}
      {day.closing?.map((text, i) => <p key={`c${i}`}>{text}</p>)}
      {day.callouts?.map((callout, i) => <aside key={i} className={`pk-callout is-${callout.kind}`}><p className="eyebrow">{calloutLabels[callout.kind]}</p><p>{callout.text}</p></aside>)}
      {day.overnight && <p className="pk-overnight"><span aria-hidden="true">☾</span> Overnight: {day.overnight}</p>}
    </div>
  </article>;
}
