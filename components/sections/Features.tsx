import Image from 'next/image';
import Link from 'next/link';
import { content } from '@/lib/content';
import '@/app/features-story.css';
// Home-page "art of being here" story. Static markup only: lib/featuresStory.ts (started from Motion.tsx) pins the section and
// moves the track sideways as the page scrolls down. With prefers-reduced-motion it stays a plain vertical stack (see features-story.css).
const { features, ui } = content;
const story = ui.features.story;
const total = String(features.length).padStart(2, '0');
// Italic accent on the longest word of a title (last one wins a tie), e.g. "Views worth <em>pausing</em> for".
function accent(title: string) {
  const words = title.split(' ');
  let pick = 0;
  words.forEach((word, i) => { if (word.length >= words[pick].length) pick = i; });
  return words.map((word, i) => <span key={i}>{i > 0 && ' '}{i === pick ? <em>{word}</em> : word}</span>);
}
export default function Features() {
  return <section id="features" className="fs" aria-label={story.region}>
    <div className="fs-top"><p className="fs-eyebrow">{story.index}</p><Link className="fs-more" href="/features">{story.more}</Link></div>
    <div className="fs-head">
      <h2>{story.intro[0]} <em>{story.intro[1]}</em><br />{story.intro[2]} {story.intro[3]}</h2>
    </div>
    <div className="fs-viewport">
      <div className="fs-track" data-fs-track tabIndex={0} role="group" aria-roledescription="carousel" aria-label={story.region}>
        <div className="fs-panel fs-intro">
          <h2>{story.intro[0]}<br /><em>{story.intro[1]}</em><br />{story.intro[2]}<br />{story.intro[3]}</h2>
          <p className="fs-scroll">{story.scroll} <span>→</span></p>
        </div>
        {features.map((feature, i) => <article className={`fs-panel fs-item ${i % 2 ? 'is-down' : 'is-up'}`} key={feature.number} data-fs-item role="group" aria-roledescription="slide" aria-label={`${i + 1} of ${features.length}: ${feature.title}`}>
          <figure className="fs-media">
            <span className="fs-num" aria-hidden="true">{feature.number}</span>
            <div className="fs-mask">
              <Image className="fs-img" src={feature.image} alt={feature.imageAlt} fill sizes="(min-width:1024px) 26vw, (min-width:768px) 40vw, 68vw" style={{ objectFit: 'cover', objectPosition: feature.position }} {...(feature.blur ? { placeholder: 'blur' as const, blurDataURL: feature.blur } : {})} />
              <span className="fs-scrim" aria-hidden="true" />
              <span className="fs-chip">{feature.number} / {total}</span>
            </div>
          </figure>
          <div className="fs-copy">
            <p className="fs-label">{story.label} / {feature.number}</p>
            <h3>{accent(feature.title)}</h3>
            <p className="fs-text">{feature.text}</p>
          </div>
        </article>)}
        <div className="fs-panel fs-outro">
          <h2>{ui.features.heading[0]}<br /><em>{ui.features.heading[1]}</em></h2>
          <Link className="fs-cta" href="/features">{story.outroCta} <span aria-hidden="true">→</span></Link>
        </div>
      </div>
    </div>
    <div className="fs-bottom">
      <p className="fs-counter" aria-live="polite" aria-atomic="true"><span data-fs-cur>01</span> / {total}</p>
      <div className="fs-bar" role="presentation" aria-hidden="true"><i data-fs-fill /></div>
    </div>
  </section>;
}
