import Image from 'next/image';
import { content } from '@/lib/content';
export default function Intro() { return <section id="intro" className="intro section">
  <div className="section-topline"><p className="eyebrow">01 / THE FEELING OF A PLACE</p><span className="eyebrow">बेसब्री से सुकून तक</span></div>
  <div className="intro-composition"><figure className="intro-photo image-reveal"><Image src="/images/valley.jpg" alt="A mountain valley, an illustrative glimpse of Himalayan life" fill sizes="(max-width:700px) 85vw, 55vw" /><figcaption>FIG. 01 — A LITTLE CLOSER TO YOURSELF</figcaption></figure><h2 data-reveal>{content.ui.intro.heading[0]}<br /><em>{content.ui.intro.heading[1]}</em></h2><div className="intro-caption"><span className="eyebrow">VAATAAVARAN / वातावरण</span><p>{content.hero.description}</p><a href="#our-stay" className="text-link">Find your mountain home <span>↗</span></a></div><span className="intro-seal" aria-hidden="true">SLOW DOWN<br /><span>✳</span><br />YOU’RE HERE</span></div>
  <div className="valley-window"><span className="eyebrow">BREATHE IN. LOOK AROUND.</span><p>Some journeys<br /><em>bring you home.</em></p><span className="eyebrow">↓ &nbsp; YOUR MOUNTAIN ADDRESS AWAITS</span></div>
  </section>; }
