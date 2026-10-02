import Image from 'next/image';
import Link from 'next/link';
import { content } from '@/lib/content';
import { findImage, type GalleryImage } from '@/lib/gallery';
import '@/app/panorama-photos.css';
// Photo strips for /stays/panorama. Each photo is rendered at its real aspect ratio (landscapes in wide slots, portraits in tall
// ones, never cropped); the flex row distributes width by aspect ratio so every photo in a row shares one height.
const { panorama } = content.ui;
const sections: { key: keyof typeof panorama.sections; subjects: string[] }[] = [
  { key: 'signature', subjects: ['window-seats-with-mountain-view', 'bedroom-with-balcony-door-and-mountain-view', 'bedroom-with-balcony-and-wall-lights', 'bedroom-with-valley-view'] },
  { key: 'valley', subjects: ['room-with-large-window-and-hillside-view', 'room-with-mountain-window', 'room-with-corner-windows-and-green-armchairs', 'room-with-balcony-door-and-bedside-table'] },
  { key: 'outdoor', subjects: ['entrance-arch-lit-at-night', 'terrace-walkway-with-fairy-lights', 'entrance-night-lights', 'terrace-seating-at-night', 'terrace-seating-by-glass-doors'] },
  { key: 'common', subjects: ['lounge-sofa-seating', 'attic-lounge-with-timber-ceiling', 'dining-nook-with-table-and-chairs', 'lounge-sofas-and-orange-armchairs', 'lounge-with-wooden-slat-partition'] },
];
const sizesFor = (image: GalleryImage) => (image.orientation === 'portrait' ? '(max-width: 768px) 70vw, 28vw' : '(max-width: 768px) 100vw, 50vw');
export default function PanoramaPhotos() {
  return <div className="ps">
    {sections.map(({ key, subjects }) => {
      const copy = panorama.sections[key];
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
