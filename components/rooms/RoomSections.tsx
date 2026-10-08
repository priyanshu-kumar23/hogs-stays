import Image from 'next/image';
import Link from 'next/link';
import AmenityIcon from '@/components/ui/AmenityIcon';
import LocationMap from '@/components/pages/LocationMap';
import Icon from '@/components/ui/Icon';
import { panoramaBookingUrl, panoramaLocation } from '@/lib/content';
import { stayTerms } from '@/lib/policies';
import { amenityLabels, guestsLine, mealPlans, roomHref, type Room } from '@/lib/rooms';
import type { StayMenuItem } from '@/lib/roomsMenu';
import '@/app/room-page.css';

const Head = ({ label, title, id }: { label: string; title: React.ReactNode; id: string }) => <header className="rp-head" data-reveal><p className="eyebrow">{label}</p><h2 id={id}>{title}</h2></header>;

export function AboutRoom({ room }: { room: Room }) {
  return <section className="section rp-about" aria-labelledby="rp-about-t">
    <div data-reveal><p className="eyebrow">ABOUT THIS ROOM</p><h2 id="rp-about-t">{room.name.replace(/ Room$/, '')}<br /><em>Room.</em></h2><p className="rp-desc">{room.description}</p><p className="rp-guests">{guestsLine(room)}</p></div>
    <ul className="rp-amenities" aria-label="Amenities" data-reveal>{room.amenities.map(id => <li key={id}><AmenityIcon name={id} size={26} /><span>{amenityLabels[id]}</span></li>)}</ul>
  </section>;
}

export function MealPlans() {
  return <section className="section rp-meals" aria-labelledby="rp-meals-t">
    <Head id="rp-meals-t" label="MEAL PLANS" title={<>Choose how<br /><em>you’d like to eat.</em></>} />
    <ul className="rp-meal-grid">{mealPlans.map((plan, index) => <li key={plan.id} className="rp-meal" data-reveal>
      <span className="rp-fig">FIG. {String(index + 1).padStart(2, '0')} —</span>
      <h3>{plan.title}</h3>
      <a className="rp-link" href={panoramaBookingUrl} target="_blank" rel="noopener noreferrer">Live rates on the booking page <span aria-hidden="true">→</span></a>
    </li>)}</ul>
  </section>;
}

export function GoodToKnow() {
  const t = stayTerms;
  return <section className="section rp-know" aria-labelledby="rp-know-t">
    <Head id="rp-know-t" label="GOOD TO KNOW" title={<>The simple<br /><em>details.</em></>} />
    <div className="rp-know-grid">
      <article className="rp-card" data-reveal><h3>Check-in &amp; check-out</h3><p className="rp-big">Check-in {t.checkIn} · Check-out {t.checkOut}</p><p>Early check-in or late check-out subject to availability and may be chargeable.</p></article>
      <article className="rp-card" data-reveal><h3>Payment</h3><p className="rp-big">{t.payment.map(step => step.pct).join(' · ')}</p><ul className="rp-mini">{t.payment.map(step => <li key={step.when}><b>{step.pct}</b> {step.when.toLowerCase()}</li>)}</ul><Link className="rp-link" href="/terms-conditions#payment-policy">Payment terms <span aria-hidden="true">→</span></Link></article>
      <article className="rp-card" data-reveal><h3>Cancellation</h3><ul className="rp-mini">{t.cancellation.map(rule => <li key={rule.id}><b>{rule.bar}:</b> {rule.short.toLowerCase()}</li>)}</ul><p className="rp-peak">{t.peakShort}</p><Link className="rp-link" href="/cancellation-refund-policy">Read full policy <span aria-hidden="true">→</span></Link></article>
      <article className="rp-card" data-reveal><h3>On arrival</h3><p className="rp-big">Valid government ID required at check-in</p><p>Quiet hours after 10:30 PM.</p><Link className="rp-link" href="/house-rules-guest-guidelines">House rules <span aria-hidden="true">→</span></Link></article>
    </div>
  </section>;
}

export function OtherRooms({ items }: { items: StayMenuItem[] }) {
  return <section className="section rp-others" aria-labelledby="rp-others-t">
    <Head id="rp-others-t" label="MORE ROOMS" title={<>Other ways to<br /><em>wake up here.</em></>} />
    <ul className="rp-other-grid">{items.map(item => <li key={item.id} data-reveal><Link className="rp-other" href={roomHref(item.id)}>
      <span className="rp-other-thumb"><Image src={item.thumb} alt="" fill sizes="(max-width: 700px) 92vw, 30vw" loading="lazy" placeholder="blur" blurDataURL={item.blur} />{item.photoSoon && <em>Photos soon</em>}</span>
      <span className="rp-other-name">{item.name}</span><span className="rp-other-guests">{item.guests}</span><span className="rp-other-tag">{item.tagline}</span><span className="rp-link">View room <span aria-hidden="true">→</span></span>
    </Link></li>)}</ul>
  </section>;
}

export function RoomLocation() {
  return <section className="section rp-location" aria-labelledby="rp-loc-t">
    <Head id="rp-loc-t" label="FIND US" title={<>Find us<br /><em>in Manali.</em></>} />
    <LocationMap />
    <a className="text-link" href={panoramaLocation.directionsUrl} target="_blank" rel="noopener noreferrer">Get directions <Icon name="pin" /></a>
  </section>;
}
