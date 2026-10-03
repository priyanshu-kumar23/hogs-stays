import Icon from '@/components/ui/Icon';
import { content } from '@/lib/content';
import { packageCopy, packageTitle, type TourPackage } from '@/lib/packages';
import BookButton from './BookButton';
// Sidebar card on a journey page: replaces the old inline enquiry form so there is only ONE booking form (the "Request to book" sheet).
export default function BookingCard({ pkg }: { pkg: TourPackage }) {
  const name = packageTitle(pkg).replace(/\.$/, '');
  return <div className="pk-form-card booking-card pk-bookcard">
    <p className="eyebrow pk-form-eyebrow">REQUEST TO BOOK</p>
    <h3>Start your booking <em>request.</em></h3>
    <p className="pk-bookcard-text">Choose dates, travellers and a few preferences for {name}. It takes about two minutes, and we reply with availability and a personalised quote.</p>
    <p className="pk-bookcard-price">{packageCopy.priceLabel}</p>
    <BookButton className="button form-submit">Start your booking request <Icon /></BookButton>
    <a className="button outline whatsapp-continue" href={`https://wa.me/${content.whatsapp}?text=${encodeURIComponent(`Hello HOGS! I have a question about the journey: ${name} (${pkg.nights}N/${pkg.days}D).`)}`} target="_blank" rel="noopener noreferrer"><Icon name="chat" size={17} /> Ask on WhatsApp</a>
    <p className="form-note">A request, not a confirmed booking. Nothing is charged until HOGS confirms.</p>
  </div>;
}
