import Image from 'next/image';
import { findCafeImage } from '@/lib/cafeImages';
import '@/app/cafe-gallery.css';
export const teamImage = findCafeImage('cafe-do-nthng-manali-team-neon-sign-entrance');
// "The people behind the cups": portrait photo + copy, two columns on desktop, stacked on mobile. Below the fold, so lazy.
export default function TeamSection() {
  return <section className="section team" aria-labelledby="team-title">
    <figure className="team-fig" data-reveal>
      <div className="team-photo" style={{ aspectRatio: `${teamImage.width} / ${teamImage.height}` }}>
        <Image src={teamImage.src} alt={teamImage.alt} width={teamImage.width} height={teamImage.height} sizes="(max-width: 860px) 90vw, 40vw" loading="lazy" placeholder="blur" blurDataURL={teamImage.blurDataURL} style={{ objectPosition: teamImage.position }} />
      </div>
      <figcaption>FIG. 01 — {teamImage.caption}</figcaption>
    </figure>
    <div className="team-copy" data-reveal>
      <p className="eyebrow">THE TEAM</p>
      <h2 id="team-title">The people<br /><em>behind the cups.</em></h2>
      {/* TODO(owner): replace with your own words about the team. */}
      <p>The hands behind every cup, every quiet morning and every evening session at Cafe DO NTHNG.</p>
    </div>
  </section>;
}
