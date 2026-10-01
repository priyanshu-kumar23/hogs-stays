import Image from 'next/image';
import Link from 'next/link';
import { content } from '@/lib/content';
const { label, headline, support, marquee, collage } = content.manifesto;
export default function Manifesto() {
  return <section id="manifesto" className="manifesto" aria-labelledby="manifesto-title">
    <div className="manifesto-marquee" aria-hidden="true"><div className="manifesto-marquee-track"><span>{marquee.repeat(4)}</span><span>{marquee.repeat(4)}</span></div></div>
    <div className="manifesto-inner">
      <div className="manifesto-copy">
        <p className="manifesto-label">{label}</p>
        <h2 id="manifesto-title"><span className="m-a">{headline[0]}</span><br /><span className="m-b"><em>{headline[1]}</em></span></h2>
        <p className="manifesto-support">{support}</p>
        <Link className="manifesto-cue" href="/features">Follow the feeling <span aria-hidden="true">→</span></Link>
      </div>
      <div className="manifesto-collage">
        {collage.map((image, index) => <figure key={image.src} className={`mc mc-${index + 1}`} data-depth={image.depth}><div className="mc-mask"><Image src={image.src} alt={image.alt} fill sizes="(max-width:700px) 78vw, (max-width:1099px) 44vw, 30vw" style={{ objectPosition: image.position }} /></div></figure>)}
      </div>
    </div>
  </section>;
}
