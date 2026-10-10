import Link from 'next/link';
import PageHero from '@/components/pages/PageHero';
import FooterMap from '@/components/sections/FooterMap';
import Icon from '@/components/ui/Icon';
import { SITE, cafeHours, content, pic } from '@/lib/content';
import { pageMetadata } from '@/lib/seo';
import '../contact.css';
const hero = pic('bedroom-with-balcony-door-and-mountain-view');
export const metadata = pageMetadata({ title: 'Contact', description: `Contact HOGS Stays in Manali: ${SITE.address.text}. Call, WhatsApp or email us, or find us on the map.`, path: '/contact', image: hero.og });
export default function ContactPage() {
  return <main id="main" className="subpage"><PageHero eyebrow="SAY HELLO" title={<>We’d love to<br /><em>hear from you.</em></>} lede="Questions about a stay, a journey or the cafe? Reach us any way you like." image={hero.src} alt={hero.alt} position={hero.position} />
    <section className="section contact-grid">
      <div className="contact-details" data-reveal>
        <h2>{SITE.name}</h2>
        <address className="contact-address"><Icon name="pin" size={20} /><span>{SITE.address.text}</span></address>
        <ul className="contact-list">
          <li><span className="eyebrow">CALL</span><a href={`tel:+${content.whatsapp}`}>{content.phone}</a></li>
          <li><span className="eyebrow">WHATSAPP</span><a href={`https://wa.me/${content.whatsapp}`} target="_blank" rel="noopener noreferrer">Chat with us</a></li>
          <li><span className="eyebrow">EMAIL</span><a href={`mailto:${content.email}`}>{content.email}</a></li>
          <li><span className="eyebrow">CAFE DO NTHNG</span><span>{cafeHours.text}</span></li>
        </ul>
        <p className="contact-links"><Link href="/book">Enquire about a stay</Link> · <Link href="/cancellation-refund-policy">Cancellation &amp; Refund Policy</Link> · <Link href="/terms-conditions">Terms &amp; Conditions</Link> · <Link href="/privacy-policy">Privacy Policy</Link></p>
      </div>
      <div className="contact-map" data-reveal><FooterMap /></div>
    </section></main>;
}
