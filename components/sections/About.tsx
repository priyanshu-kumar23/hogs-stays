import type { ReactNode } from 'react';
import Link from 'next/link';
import { content } from '@/lib/content';
import FounderVideo from '@/components/reviews/FounderVideo';
import FoundersPhotos from '@/components/about/FoundersPhotos';
// `aside` (used by /about) puts a photo column beside the story: heading + copy stack on the left, `aside` on the right.
export default function About({ full = false, aside }: { full?: boolean; aside?: ReactNode }) {
  const heading = <div className="about-heading"><p className="eyebrow">{content.ui.about.eyebrow}</p><h2>{content.ui.about.heading[0]}<br />{content.ui.about.heading[1]}<br /><em>{content.ui.about.heading[2]}</em></h2><span className="section-index">{content.ui.about.byline}</span></div>;
  const copy = <div className="about-copy"><p>{content.about}</p><div className="founders">{content.ui.about.founders}</div>{!aside && <FoundersPhotos />}<FounderVideo />{full?<div>{content.storyLines.map(line=><p className="story-line" key={line}>{line}</p>)}</div>:<><p className="story-line">{content.storyLines[0]}</p><Link className="text-link" href="/about">Read the HOGS story →</Link></>}</div>;
  if (aside) return <section id="about-us" className="section about about-with-aside"><div className="about-left">{heading}{copy}</div>{aside}</section>;
  return <section id="about-us" className="section about">{heading}{copy}</section>;
}
