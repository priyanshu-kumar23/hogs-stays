import Motion from '@/components/ui/Motion';
import SceneLoader from '@/components/three/SceneLoader';
import Hero from '@/components/sections/Hero';
import Intro from '@/components/sections/Intro';
import Stays from '@/components/sections/Stays';
import Manifesto from '@/components/sections/Manifesto';
import Features from '@/components/sections/Features';
import Gallery from '@/components/sections/Gallery';
import About from '@/components/sections/About';
import BookTeaser from '@/components/sections/BookTeaser';
import { content, site } from '@/lib/content';
import { galleryFeatured } from '@/lib/gallery';
// The home page is the only route that mounts the persistent WebGL scene (SceneLoader) and its scroll choreography (Motion).
// Its sections are short teasers that link to the dedicated pages.
export default function Home() {
  const schema = content.properties.map(property=>({'@context':'https://schema.org','@type':property.type==='cafe'?'CafeOrCoffeeShop':'LodgingBusiness',name:property.name,url:`${site.origin}${property.path}`,description:property.description,...(property.id==='panorama'?{image:galleryFeatured.map(photo=>`${site.origin}${photo.src}`)}:{}),telephone:content.phone,email:content.email,address:{'@type':'PostalAddress',addressLocality:'Manali',addressRegion:'Himachal Pradesh',addressCountry:'IN'}}));
  return <><link rel="preload" href="/terrain/manali-dem.bin" as="fetch" crossOrigin="anonymous"/><link rel="preload" href="/textures/manali-satellite-mobile.webp" as="image" media="(max-width: 1023px)"/><link rel="preload" href="/textures/manali-satellite.webp" as="image" media="(min-width: 1024px)"/><link rel="preload" href="/textures/alpine-canopy.webp" as="image"/><link rel="preload" href="/textures/himalayan-sky.webp" as="image"/><script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(schema).replace(/</g,'\u003c')}} /><SceneLoader /><Motion /><main id="main"><Hero /><Intro /><Stays /><Manifesto /><Features /><Gallery /><About /><BookTeaser /></main></>;
}
