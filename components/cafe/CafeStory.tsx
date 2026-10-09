import Image from 'next/image';
import { cafeStory as copy, content } from '@/lib/content';
import { findCafeImage, type CafeImage } from '@/lib/cafeImages';
import CafeEffects from './CafeEffects';
import LocationMap from '@/components/pages/LocationMap';
import { cafeMapLink, cafeLocation } from '@/lib/content';
import CafeMenuButton from './CafeMenuButton';
import MenuQrCard from './MenuQrCard';
import CafeOpenStatus from './CafeOpenStatus';
import CoffeeMoment from './CoffeeMoment';
import SpotifyPlaylist from '@/components/SpotifyPlaylist';
const cover=findCafeImage('cafe-do-nthng-manali-mountain-terrace-prayer-flags-cover');
function Photo({photo,priority=false,sizes='(max-width:767px) 90vw, 45vw'}:{photo:CafeImage;priority?:boolean;sizes?:string}){return <Image src={photo.src} alt={photo.alt} fill sizes={sizes} priority={priority} placeholder="blur" blurDataURL={photo.blurDataURL} style={{objectFit:'cover',objectPosition:photo.position}}/>;}
function Title({label,title,accent}:{label:string;title:string;accent:string}){return <header className="cs-heading"><p className="eyebrow">{label}</p><h2>{title}<br/><em>{accent}</em></h2></header>;}
export default function CafeStory(){
 const cafe=content.properties.find(p=>p.id==='cafe')!;
 const moments=copy.moments.images.map(findCafeImage);
 return <><CafeEffects/>
 <section className="cs-arrival" aria-labelledby="cs-title">
   <div className="cs-depth" aria-hidden="true">{['sky','terrace','foreground'].map((layer,i)=><div className={`cs-layer cs-layer-${layer}`} data-depth={i+1} key={layer}><Photo photo={cover} priority={i===0} sizes="100vw"/></div>)}</div>
   <div className="cs-arrival-wash"/><div className="cs-chaos" aria-hidden="true">{copy.chaos.map(word=><span key={word}>{word}</span>)}</div>
   <svg className="cs-flags" viewBox="0 0 600 90" aria-hidden="true"><path d="M0 5 Q300 90 600 5" fill="none" stroke="#ecd4a578"/>{['#c87453','#c8ae65','#709394','#ebe3c7','#798764'].map((color,i)=><path key={color} className="cs-flag" style={{animationDelay:`${i*.5}s`}} d={`M${80+i*100} ${25+Math.sin(i)*10} l36 7 -7 38 -36 -7Z`} fill={color}/>)}</svg>
   <i className="cs-lantern cs-lantern-one"/><i className="cs-lantern cs-lantern-two"/><i className="cs-lantern cs-lantern-three"/>
   <div className="cs-hero-copy"><p className="eyebrow">{copy.location}</p><p className="cs-arrival-line">{copy.arrival}</p><h1 id="cs-title">{copy.name.split(' ')[0]} <em>{copy.name.split(' ').slice(1).join(' ')}</em></h1><p className="cs-subtitle">{copy.subtitle}</p><div className="cs-actions"><CafeMenuButton/><a className="button is-secondary" href="#cafe-visit">{copy.visitCta} ↘</a><a className="text-link" href={content.cafeInstagram} target="_blank" rel="noopener noreferrer">{copy.instagramCta} ↗</a></div></div>
   <p className="cs-scroll">{copy.scroll} <span>↓</span></p>
 </section>
 <section className="cs-section cs-ritual" id="cafe-ritual"><div><Title {...copy.ritual}/><div className="cs-ritual-lines">{copy.ritual.lines.map((line,i)=><p key={line} data-cafe-reveal><span>0{i+1}</span>{line}</p>)}</div><p className="cs-note">{copy.ritual.note}</p></div><CoffeeMoment/></section>
 <section className="cs-section cs-bar" id="cafe-bar" aria-labelledby="cs-bar-title"><header className="cs-heading"><p className="eyebrow">{copy.bar.label}</p><h2 id="cs-bar-title">{copy.bar.title}<br/><em>{copy.bar.accent}</em></h2></header><div className="cs-bar-row">{copy.bar.images.map(id=>{const photo=findCafeImage(id);return <figure className="cs-bar-shot" key={id} tabIndex={0} style={{flexGrow:photo.width/photo.height,aspectRatio:`${photo.width}/${photo.height}`}}><Photo photo={photo} sizes="(max-width:767px) 80vw, 40vw"/></figure>;})}</div></section>
 <section className="cs-section cs-menu"><Title {...copy.menu}/><p className="cs-note">{copy.menu.note}</p><div className="cs-menu-grid">{copy.menu.items.map((item,i)=><article className="cs-menu-card" data-cafe-tilt key={item.image}><div className="cs-menu-photo"><Photo photo={findCafeImage(item.image)} sizes="(max-width:767px) 90vw, 30vw"/><i className="cs-sheen"/></div><div className="cs-menu-caption"><span className="eyebrow">0{i+1}</span><h3>{item.name}</h3><p>{item.description}</p></div></article>)}</div><div className="cs-menu-order"><MenuQrCard/></div></section>
 <section className="cs-terrace cs-section" id="cafe-terrace"><Title {...copy.terrace}/><p className="cs-swipe">{copy.terrace.swipe} →</p><div className="cs-terrace-viewport" tabIndex={0} role="region" aria-label={copy.terrace.caption}><div className="cs-terrace-track">{copy.terrace.images.map((id,i)=><figure className="cs-terrace-card" key={id}><div className="cs-terrace-photo"><Photo photo={findCafeImage(id)} sizes="(max-width:767px) 85vw, 65vw"/></div><figcaption><span>0{i+1} / 0{copy.terrace.images.length}</span><em>{copy.terrace.caption}</em></figcaption></figure>)}</div></div></section>
 <section className="cs-section cs-dusk" id="cafe-dusk"><div><Title {...copy.dusk}/><p className="cs-dusk-copy">{copy.dusk.text}</p><p className="cs-note">{copy.dusk.note}</p><div className="cs-day-labels">{copy.dusk.stages.map(label=><span key={label}>{label}</span>)}</div></div><div className="cs-dusk-stack">{copy.dusk.images.map((id,i)=><figure className={`cs-dusk-frame cs-dusk-frame-${i}`} key={id}><Photo photo={findCafeImage(id)} sizes="(max-width:767px) 90vw, 50vw"/></figure>)}</div></section>
 <section className="cs-section cs-people"><div className="cs-people-photos"><figure className="cs-polaroid"><div><Photo photo={findCafeImage(copy.people.image)}/></div><figcaption>{copy.people.caption}</figcaption></figure><figure className="cs-polaroid cs-polaroid-second"><div><Photo photo={findCafeImage(copy.people.baristaImage)}/></div><figcaption>{copy.people.baristaCaption}</figcaption></figure></div><div data-cafe-reveal><Title {...copy.people}/><p className="cs-note">{copy.people.text}</p></div></section>
 <section className="cs-section cs-moments"><Title {...copy.moments}/><div className="cs-masonry">{moments.map((photo,i)=><figure className="cs-polaroid" key={photo.id} style={{'--photo-angle':`${[-3,2,-1,3,-2,1][i%6]}deg`} as React.CSSProperties}><div style={{aspectRatio:`${photo.width}/${photo.height}`}}><Photo photo={photo} sizes="(max-width:767px) 43vw, 27vw"/></div><figcaption>{photo.caption}</figcaption></figure>)}</div></section>
 <SpotifyPlaylist/>
 <section className="cs-section cs-visit" id="cafe-visit"><div><Title {...copy.visit}/><p className="cs-offer">{copy.visit.offer}</p><dl><div><dt>{copy.visit.hoursLabel}</dt><dd>{copy.visit.hours} <CafeOpenStatus/></dd></div><div><dt>{copy.visit.addressLabel}</dt><dd>{copy.visit.address}</dd></div></dl><MenuQrCard compact/><div className="cs-actions"><a className="button is-secondary" href={`https://wa.me/${content.whatsapp}?text=${encodeURIComponent(copy.visit.message)}`} target="_blank" rel="noopener noreferrer">{copy.visit.reserve} ↗</a><a className="text-link" href={cafeMapLink} target="_blank" rel="noopener noreferrer">{copy.visit.directions} ↗</a><a className="text-link" href={content.cafeInstagram} target="_blank" rel="noopener noreferrer">{copy.instagramCta} ↗</a></div><p className="cs-note">{copy.visit.note}</p></div><LocationMap warm embedUrl={copy.visit.mapEmbedUrl} title={`${copy.name} location in Manali`} caption={cafeLocation.label}/></section>
 </>;
}
