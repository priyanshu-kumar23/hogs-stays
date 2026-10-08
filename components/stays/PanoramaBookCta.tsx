import Link from 'next/link';
import Icon from '@/components/ui/Icon';
import EnquireButton from '@/components/enquiry/EnquireButton';
import { panoramaBooking } from '@/lib/content';
import '@/app/panorama-book.css';

// Primary: "Book now" opens the Aiosell booking engine in a new tab (optionally next to a "View room →" link to the room's own page). Under it a
// small "Secure booking ↗" hint, then a secondary text link that opens the WhatsApp enquiry drawer (room preselected when `room` is set).
export default function PanoramaBookCta({ room, label = panoramaBooking.label, forName = 'HOGS Panorama', viewHref }: { room?: string; label?: string; forName?: string; viewHref?: string }) {
  return <div className="pb-cta">
    <div className="pb-row">
      <a className="button pb-book" href={panoramaBooking.url} target="_blank" rel="noopener noreferrer" aria-label={`${label}: ${forName}, opens the secure booking site in a new tab`}>{label} <Icon /></a>
      {viewHref && <Link className="pb-view" href={viewHref} aria-label={`View room: ${forName}`}>View room <span aria-hidden="true">→</span></Link>}
    </div>
    <small className="pb-hint">{panoramaBooking.hint}</small>
    <EnquireButton room={room} className="pb-enquire">{panoramaBooking.questions}</EnquireButton>
  </div>;
}
