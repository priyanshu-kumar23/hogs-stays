import Image from 'next/image';
import Link from 'next/link';
import { aboutImages, type AboutImage } from '@/lib/aboutImages.generated';
import { findCafeImage } from '@/lib/cafeImages';
import { findImage, findPanoramaView } from '@/lib/gallery';
import { content } from '@/lib/content';
import '@/app/about.css';

const widest = (image: { srcSet: readonly { width: number; src: string }[] }) => image.srcSet[image.srcSet.length - 1].src;
const fig = (n: number) => String(n).padStart(2, '0');

const teamImage = findCafeImage('cafe-do-nthng-manali-team-neon-sign-entrance');
const terraceImage = findCafeImage('cafe-do-nthng-manali-mountain-terrace-prayer-flags-cover');

// Every photo on the About page appears once. The hero (attic lounge), the Vaataavaran pair, the team and the friends photo are not
// in this list, and it holds no near-duplicates: one terrace, two different drinks, one room, one view, one live set, one night shot.
const moments = [
  findCafeImage('cafe-do-nthng-manali-terrace-motorbike-mural-wicker-seating'),
  findCafeImage('cafe-do-nthng-manali-latte-art-coffee'),
  findImage('bedroom-floor-to-ceiling-valley-view'),
  findCafeImage('cafe-do-nthng-manali-live-acoustic-guitar-session'),
  findPanoramaView('hogs-panorama-manali-snow-peaks-valley-village-perspective'),
  findCafeImage('cafe-do-nthng-manali-orange-citrus-cooler-mountains'),
  findCafeImage('cafe-do-nthng-manali-night-terrace-fairy-lights'),
];

function Photo({ image, sizes }: { image: AboutImage; sizes: string }) {
  return <Image src={widest(image)} alt={image.alt} width={image.width} height={image.height} sizes={sizes} loading="lazy" placeholder="blur" blurDataURL={image.blurDataURL} style={{ objectPosition: image.position }} />;
}

/** FIG. 01 / FIG. 02 portraits (1200x1600 originals in public/images/about/). object-position keeps each face and her motorcycle in the 4:5 card. */
export const founderPhotos = {
  gazal: { src: '/images/about/gazal.jpg', position: '50% 40%', alt: 'Gazal, co-founder of HOGS, with her motorcycle' },
  saloni: { src: '/images/about/saloni.jpg', position: '50% 60%', alt: 'Saloni, co-founder of HOGS, on her motorcycle' },
};

/** Right-hand column of the founders story: two staggered portrait cards, then the wide group photo. */
export function FounderCards() {
  const { friends } = aboutImages;
  const cards = [{ photo: founderPhotos.gazal, name: 'GAZAL', tagline: content.founderTaglines.gazal }, { photo: founderPhotos.saloni, name: 'SALONI', tagline: content.founderTaglines.saloni }];
  return <div className="founders-aside">
    <div className="founder-cards">
      {cards.map(({ photo, name, tagline }, index) => <figure className="founder-card" key={name} data-reveal>
        <div className="founder-photo"><Image src={photo.src} alt={photo.alt} fill sizes="(max-width: 860px) 44vw, 22vw" loading="lazy" style={{ objectFit: 'cover', objectPosition: photo.position }} /></div>
        <figcaption>FIG. {fig(index + 1)} — {name}<em>{tagline}</em></figcaption>
      </figure>)}
    </div>
    <figure className="founders-group" data-reveal>
      <div className="about-photo" style={{ aspectRatio: `${friends.width} / ${friends.height}` }}><Photo image={friends} sizes="(max-width: 860px) 92vw, 46vw" /></div>
      <figcaption>FIG. {fig(3)} — {friends.caption}</figcaption>
    </figure>
  </div>;
}

/** "Vaataavaran" staggered two-image collage: tall building first, terrace second. The copy column stays in the page file. */
export function VaataavaranPhotos() {
  const building = aboutImages.building;
  return <div className="vaataavaran-collage">
    <figure className="vc-tall"><div className="vc-frame"><Image src={widest(building)} alt={building.alt} fill sizes="(max-width: 860px) 52vw, 28vw" placeholder="blur" blurDataURL={building.blurDataURL} style={{ objectPosition: '62% 50%' }} /></div><figcaption>FIG. {fig(4)} — THE HOUSE</figcaption></figure>
    <figure className="vc-short"><div className="vc-frame"><Image src={terraceImage.src} alt={terraceImage.alt} fill sizes="(max-width: 860px) 42vw, 22vw" placeholder="blur" blurDataURL={terraceImage.blurDataURL} style={{ objectPosition: terraceImage.position }} /></div><figcaption>FIG. {fig(5)} — THE TERRACE</figcaption></figure>
  </div>;
}

export function TeamPhoto() {
  return <section className="section about-pair" aria-labelledby="about-team-title">
    <div className="about-pair-copy" data-reveal><p className="eyebrow">THE TEAM</p><h2 id="about-team-title">The people<br /><em>behind HOGS.</em></h2></div>
    <figure className="about-fig" data-reveal>
      <div className="about-photo" style={{ aspectRatio: `${teamImage.width} / ${teamImage.height}` }}><Image src={teamImage.src} alt={teamImage.alt} width={teamImage.width} height={teamImage.height} sizes="(max-width: 860px) 90vw, 36vw" loading="lazy" placeholder="blur" blurDataURL={teamImage.blurDataURL} style={{ objectPosition: teamImage.position }} /></div>
      <figcaption>FIG. {fig(6)} — The faces behind every cup of chai and every warm welcome.</figcaption>
    </figure>
  </section>;
}

export function MomentsGrid() {
  return <section className="section about-moments" aria-labelledby="about-moments-title">
    <div className="about-pair-copy" data-reveal><p className="eyebrow">MOMENTS</p><h2 id="about-moments-title">Moments<br /><em>from HOGS.</em></h2></div>
    <div className="moments-grid">
      {moments.map(image => <figure key={image.id}><Image src={image.src} alt={image.alt} width={image.width} height={image.height} sizes="(max-width: 700px) 46vw, 31vw" loading="lazy" placeholder="blur" blurDataURL={image.blurDataURL} style={{ objectPosition: image.position }} /></figure>)}
    </div>
    <Link className="text-link" href="/gallery">View the full gallery →</Link>
  </section>;
}
