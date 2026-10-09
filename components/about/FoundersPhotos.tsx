import Image from 'next/image';
import './founders-photos.css';

// Two portrait cards under the "GAZAL & SALONI / THE HEART OF HOGS" label (home About section). Photos: public/images/about/{gazal,saloni}.jpg (1200x1600).
// object-position keeps Gazal's face and Saloni + her bike in frame in the 4:5 crop.
const founders = [
  { name: 'Gazal', src: '/images/about/gazal.jpg', position: '50% 28%', alt: 'Gazal, co-founder of HOGS, with her motorcycle' },
  { name: 'Saloni', src: '/images/about/saloni.jpg', position: '50% 62%', alt: 'Saloni, co-founder of HOGS, on her motorcycle in the mountains' },
];
export default function FoundersPhotos() {
  return <div className="fp">
    <ul className="fp-row" aria-label="The founders of HOGS">
      {founders.map(({ name, src, position, alt }) => <li key={name} className="fp-card" data-reveal>
        <figure>
          <div className="fp-photo"><Image src={src} alt={alt} width={1200} height={1600} sizes="(max-width: 700px) 72vw, 300px" loading="lazy" style={{ objectPosition: position }} /></div>
          <figcaption><strong>{name}</strong><span>RIDER · CO-FOUNDER</span></figcaption>
        </figure>
      </li>)}
    </ul>
    <p className="fp-line">Two friends, two bikes, and one idea — a home in the mountains.</p>
  </div>;
}
