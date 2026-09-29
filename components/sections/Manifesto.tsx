import Image from 'next/image';
import { content } from '@/lib/content';
const { label, marquee, collage } = content.manifesto;
export default function Manifesto() {
  return <section id="manifesto" className="manifesto" aria-labelledby="manifesto-title">
    <div className="manifesto-marquee" aria-hidden="true"><div className="manifesto-marquee-track"><span>{marquee.repeat(4)}</span><span>{marquee.repeat(4)}</span></div></div>
    <div className="manifesto-inner">
      <div className="manifesto-copy">
        <p className="manifesto-label">{label}</p>
        <h2 id="manifesto-title"><span className="m-a">Come for<br />the <em>mountains.</em></span><br /><span className="m-b">Stay for<br />the feeling.</span></h2>
        <a className="manifesto-cue" href="#features">Follow the feeling <span aria-hidden="true">↓</span></a>
      </div>
      <div className="manifesto-collage">
        {collage.map((image, index) => <figure key={image.src} className={`mc mc-${index + 1}`} data-depth={image.depth}><div className="mc-mask"><Image src={image.src} alt={image.alt} fill sizes="(max-width:700px) 78vw, (max-width:1099px) 44vw, 30vw" style={{ objectPosition: image.position }} /></div></figure>)}
      </div>
    </div>
  </section>;
}
