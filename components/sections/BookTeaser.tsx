import Link from 'next/link';
import { content } from '@/lib/content';
import Icon from '@/components/ui/Icon';
import InstagramLink from '@/components/ui/InstagramLink';
// Home-page teaser for the booking form (id="form" keeps the final scroll chapter of the scene in place).
export default function BookTeaser() {
  return <section id="form" className="section booking booking-teaser"><div className="booking-copy"><p className="eyebrow">{content.ui.booking.eyebrow}</p><h2>{content.ui.booking.heading[0]}<br /><em>{content.ui.booking.heading[1]}</em></h2><p>{content.booking}</p></div><div className="booking-card booking-teaser-card"><span className="eyebrow">{content.ui.booking.contact}</span><Link className="button" href="/book">Plan your stay <Icon /></Link><a className="button outline" href={`https://wa.me/${content.whatsapp}`} target="_blank" rel="noopener noreferrer"><Icon name="chat" size={17} /> {content.ui.booking.whatsapp}</a><div className="booking-contact"><a href={`tel:+${content.whatsapp}`}>{content.phone}</a><a href={`mailto:${content.email}`}>{content.email}</a><InstagramLink href={content.instagram} label="HOGS on Instagram" /></div></div></section>;
}
