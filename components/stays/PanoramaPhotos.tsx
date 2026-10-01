import Image from 'next/image';
import Link from 'next/link';
import { content } from '@/lib/content';
import { findImage, type GalleryImage } from '@/lib/gallery';
import '@/app/panorama-photos.css';
// Photo strips for /stays/panorama. Each photo is rendered at its real aspect ratio (landscapes in wide slots, portraits in tall
// ones, never cropped); the flex row distributes width by aspect ratio so every photo in a row shares one height.
const { panorama } = content.ui;
const sections: { key: keyof typeof panorama.sections; subjects: string[] }[] = [
  { key: 'rooms', subjects: ['wooden-double-bedroom-with-curtained-window', 'double-bedroom-with-pink-curtains', 'bedroom-with-carved-wooden-wardrobe', 'modern-room-with-large-window-and-teal-armchairs', 'modern-room-double-bed-with-wall-lamps'] },
  { key: 'views', subjects: ['balcony-with-prayer-flags-and-wicker-chair', 'balcony-view-over-orchards-and-mountains', 'balcony-with-two-wicker-chairs-and-prayer-flags', 'balcony-wicker-chair-with-mountain-view'] },
  { key: 'outdoor', subjects: ['garden-and-wooden-building-with-mountain-view', 'garden-seating-with-himalayan-valley-view', 'stone-building-with-balconies-and-garden-seating'] },
  { key: 'common', subjects: ['lounge-sofas-and-wooden-coffee-table', 'wooden-lounge-sofa-seating', 'wooden-dining-table-beside-staircase', 'sofa-lounge-with-timber-staircase', 'open-lounge-and-dining-area'] },
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
