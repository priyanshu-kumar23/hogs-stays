import Image from 'next/image';
import { cafeCategories, cafeImagesByCategory } from '@/lib/cafeImages';
import '@/app/cafe-gallery.css';
// Cafe DO NTHNG photos grouped by category in a CSS-column masonry. Every photo reserves its real aspect ratio (no layout shift)
// and lazy-loads with a blur placeholder; nothing here is above the fold, so nothing is `priority`.
export default function CafeGallery({ eyebrow = 'THE CAFE, IN PICTURES', heading = ['A few corners', 'of Cafe DO NTHNG.'], id = 'cafe-photos', exclude = [] }: { eyebrow?: string; heading?: [string, string]; id?: string; /** Image ids shown elsewhere on the page. */ exclude?: string[] }) {
  let fig = 0;
  return <section className="section cg" id={id} aria-labelledby={`${id}-title`}>
    <header className="cg-head" data-reveal><p className="eyebrow">{eyebrow}</p><h2 id={`${id}-title`}>{heading[0]}<br /><em>{heading[1]}</em></h2></header>
    {cafeCategories.map(group => {
      const items = cafeImagesByCategory(group.id).filter(image => !exclude.includes(image.id));
      if (!items.length) return null;
      return <div className="cg-group" key={group.id} data-reveal>
        <div className="cg-group-head"><h3>{group.label}</h3><p>{group.blurb}</p></div>
        <ul className="cg-grid">
          {items.map(image => { fig += 1; return <li key={image.id}>
            <figure className="cg-fig">
              <div className="cg-photo" style={{ aspectRatio: `${image.width} / ${image.height}` }}>
                <Image src={image.src} alt={image.alt} width={image.width} height={image.height} sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" loading="lazy" placeholder="blur" blurDataURL={image.blurDataURL} />
              </div>
              <figcaption>FIG. {String(fig).padStart(2, '0')} — {image.caption}</figcaption>
            </figure>
          </li>; })}
        </ul>
      </div>;
    })}
  </section>;
}
