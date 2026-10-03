import { packageCopy } from '@/lib/packages';
// "What makes this a HOGS journey": a marquee line (same idea as the home manifesto strip) over four numbered notes.
export default function HogsStrip() {
  const { strip } = packageCopy;
  return <section className="pk-strip" aria-labelledby="pk-strip-title">
    <div className="pk-marquee" aria-hidden="true"><div className="pk-marquee-track"><span>{strip.marquee.repeat(4)}</span><span>{strip.marquee.repeat(4)}</span></div></div>
    <div className="section pk-strip-inner">
      <div className="section-topline"><p className="eyebrow">{strip.eyebrow}</p><span className="eyebrow">VAATAAVARAN / {strip.hindi}</span></div>
      <h2 id="pk-strip-title" data-reveal>{strip.heading[0]}<br /><em>{strip.heading[1]}</em></h2>
      <ol className="pk-strip-list">{strip.items.map(item => <li key={item.n} data-reveal><span className="pk-strip-n" aria-hidden="true">{item.n}</span><h3>{item.title}</h3><p>{item.text}</p></li>)}</ol>
    </div>
  </section>;
}
