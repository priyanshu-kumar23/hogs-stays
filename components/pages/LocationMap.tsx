import { panoramaLocation } from '@/lib/content';
// Defaults to the HOGS Panorama location; /cafe passes the cafe's own embed (it is a different pin).
export default function LocationMap({ warm = false, caption = panoramaLocation.displayAddress, embedUrl = panoramaLocation.embedUrl, title = 'HOGS Panorama location in Manali' }: { warm?: boolean; caption?: string; embedUrl?: string; title?: string }) {
  return <figure className={`location-map${warm ? ' location-map-warm' : ''}`}><iframe src={embedUrl} title={title} loading="lazy" allowFullScreen referrerPolicy="no-referrer-when-downgrade" /><figcaption>{caption}</figcaption></figure>;
}
