import Image from 'next/image';
import Link from 'next/link';
import { content } from '@/lib/content';
import { findImage, type GalleryImage } from '@/lib/gallery';
import { findCafeImage } from '@/lib/cafeImages';
import '@/app/panorama-photos.css';
// Photo strips for /stays/panorama. Each photo is rendered at its real aspect ratio (landscapes in wide slots, portraits in tall
// ones, never cropped); the flex row distributes width by aspect ratio so every photo in a row shares one height.
// The "Outdoor" section is a mosaic instead: one large lead photo plus a grid of day and night shots (cropped to fit the cells).
const { panorama } = content.ui;
const sections: { key: keyof typeof panorama.sections; subjects: string[] }[] = [
  { key: 'signature', subjects: ['window-seats-with-mountain-view', 'bedroom-with-balcony-door-and-mountain-view', 'bedroom-with-balcony-and-wall-lights', 'bedroom-with-valley-view'] },
  { key: 'valley', subjects: ['room-with-large-window-and-hillside-view', 'room-with-mountain-window', 'room-with-corner-windows-and-green-armchairs', 'room-with-balcony-door-and-bedside-table'] },
  { key: 'outdoor', subjects: [] },
  { key: 'common', subjects: ['lounge-sofa-seating', 'attic-lounge-with-timber-ceiling', 'dining-nook-with-table-and-chairs', 'lounge-sofas-and-orange-armchairs', 'lounge-with-wooden-slat-partition'] },
];
const sizesFor = (image: GalleryImage) => (image.orientation === 'portrait' ? '(max-width: 768px) 70vw, 28vw' : '(max-width: 768px) 100vw, 50vw');
type Tile = { id: string; src: string; alt: string; width: number; height: number; blur: string; position: string };
const panoramaTile = (subject: string, full = false): Tile => { const g = findImage(subject); return { id: g.id, src: full ? g.src : g.srcMd, alt: g.alt, width: g.width, height: g.height, blur: g.blurDataURL, position: g.position }; };
const cafeTile = (id: string): Tile => { const c = findCafeImage(id); return { id: c.id, src: c.src, alt: c.alt, width: c.width, height: c.height, blur: c.blurDataURL, position: c.position }; };
// Order matters (the CSS grid places by position): lead, wide terrace, tall walkway, two singles, wide building. The fairy-light walkway and the
// two night patio photos are intentionally not here; they stay in the files and in the full gallery.
const outdoor: (Tile & { slot: string })[] = [
  { ...panoramaTile('balcony-with-mountain-and-orchard-view', true), slot: 'is-lead' },
  { ...cafeTile('cafe-do-nthng-manali-terrace-motorbike-mural-wicker-seating'), slot: 'is-wide-a' },
  { ...cafeTile('cafe-do-nthng-manali-terrace-walkway-prayer-flags-tables'), slot: 'is-tall' },
  { ...cafeTile('cafe-do-nthng-manali-egg-chair-mural-terrace-seating'), slot: 'is-one-a' },
  { ...cafeTile('cafe-do-nthng-manali-egg-chair-forest-view'), slot: 'is-one-b' },
  { ...cafeTile('cafe-do-nthng-manali-building-exterior-hogs-gate'), slot: 'is-wide-b' },
];
export default function PanoramaPhotos() {
  return <div className="ps">
    {sections.map(({ key, subjects }) => {
      const copy = panorama.sections[key];
      if (key === 'outdoor') return <section className="section ps-section" key={key} aria-labelledby={`ps-${key}`}>
        <div className="ps-head"><p className="eyebrow">{panorama.eyebrow}</p><h2 id={`ps-${key}`}>{copy}</h2></div>
        <ul className="ps-mosaic">
          {outdoor.map((tile, index) => <li key={tile.id} className={`ps-tile ${tile.slot}`}>
            <figure style={{ backgroundImage: `url(${tile.blur})` }}>
              <Image src={tile.src} alt={tile.alt} fill sizes={index === 0 ? '(max-width: 700px) 100vw, 50vw' : '(max-width: 700px) 50vw, 25vw'} style={{ objectFit: 'cover', objectPosition: tile.position }} />
            </figure>
          </li>)}
        </ul>
      </section>;
      const images = subjects.map(findImage);
      return <section className="section ps-section" key={key} aria-labelledby={`ps-${key}`}>
        <div className="ps-head"><p className="eyebrow">{panorama.eyebrow}</p><h2 id={`ps-${key}`}>{copy}</h2></div>
        <ul className="ps-row">
          {images.map(image => <li key={image.id} className={`ps-item is-${image.orientation}`} style={{ ['--ar' as string]: image.width / image.height }}>
            <figure style={{ aspectRatio: `${image.width} / ${image.height}`, backgroundImage: `url(${image.blurDataURL})` }}>
              <Image src={image.srcMd} alt={image.alt} width={image.width} height={image.height} sizes={sizesFor(image)} />
            </figure>
          </li>)}
        </ul>
      </section>;
    })}
    <p className="ps-all"><Link className="text-link" href="/gallery">{panorama.seeAll}</Link></p>
  </div>;
}
