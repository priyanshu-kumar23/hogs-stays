import { content } from '@/lib/content';
import MagneticButton from '@/components/ui/MagneticButton';

export default function Hero() {
  return <section id="home" className="hero">

    <div className="hero-scrim" /><div className="hero-contours" aria-hidden="true" />
    <div className="hero-content">
      <p className="eyebrow hero-kicker"><span className="live-dot" /> MANALI · HIMACHAL PRADESH</p>
      <h1 className="hero-headline" aria-label="Experience the Himalayas, the HOGS way.">
        <span className="hero-line hero-line-1"><span className="hero-word">Experience</span></span>
        <span className="hero-line hero-line-2"><span className="hero-the">the</span><span className="hero-word">Himalayas</span><span className="hero-star" aria-hidden="true">✳</span></span>
        <span className="hero-line hero-line-3"><em className="hero-word">the HOGS way.</em></span>
      </h1>
      <div className="hero-aside"><span className="eyebrow">A DIFFERENT KIND OF ARRIVAL</span><p>A little closer to nature.<br />A little closer to yourself.</p><MagneticButton href="#form">Book your stay <span>↗</span></MagneticButton></div>
    </div>
    <div className="hero-bottom"><a href="#intro" className="journey-link"><span className="round-arrow">↓</span><span>LEAVE THE EVERYDAY BEHIND<br /><b>SCROLL INTO THE MOUNTAINS</b></span></a><span className="hero-coordinate">32.2396° N &nbsp; 77.1887° E<br />OF HIMALAYAN HOMES</span><a href="#our-stay" className="hero-explore">Explore HOGS <span>↗</span></a></div>
    <span className="hero-side-label">HOUSE OF GS — A MOUNTAIN JOURNAL</span>
  </section>;
}
