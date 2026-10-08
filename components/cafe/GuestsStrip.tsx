import Image from 'next/image';
import { SHOW_GUEST_PHOTOS, guestImages } from '@/lib/cafeImages';
import '@/app/cafe-gallery.css';
// "Guests at HOGS": a horizontal, scroll-snapping strip. Renders nothing when SHOW_GUEST_PHOTOS is false (lib/cafeImages.ts).
export default function GuestsStrip() {
  if (!SHOW_GUEST_PHOTOS || !guestImages.length) return null;
  return <section className="section gs" aria-labelledby="guests-title">
    <header className="cg-head" data-reveal><p className="eyebrow">GUESTS AT HOGS</p><h2 id="guests-title">Faces we’re glad<br /><em>to have met.</em></h2></header>
    <ul className="gs-strip" aria-label="Guests at HOGS, Manali" tabIndex={0}>
      {guestImages.map((image, index) => <li key={image.id}>
        <figure className="cg-fig">
          <div className="cg-photo gs-photo" style={{ aspectRatio: `${image.width} / ${image.height}` }}>
            <Image src={image.src} alt={image.alt} width={image.width} height={image.height} sizes="(max-width: 640px) 80vw, 420px" loading="lazy" placeholder="blur" blurDataURL={image.blurDataURL} style={{ objectPosition: image.position }} />
          </div>
          <figcaption>FIG. {String(index + 1).padStart(2, '0')} — {image.caption}</figcaption>
        </figure>
      </li>)}
    </ul>
  </section>;
}
