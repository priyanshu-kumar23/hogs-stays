import Motion from '@/components/ui/Motion';
import SceneLoader from '@/components/three/SceneLoader';
import Hero from '@/components/sections/Hero';
import Intro from '@/components/sections/Intro';
import Stays from '@/components/sections/Stays';
import Manifesto from '@/components/sections/Manifesto';
import Features from '@/components/sections/Features';
import Journeys from '@/components/sections/Journeys';
import Gallery from '@/components/sections/Gallery';
import About from '@/components/sections/About';
import BookTeaser from '@/components/sections/BookTeaser';
import ReviewsSection from '@/components/reviews/ReviewsSection';
import { content, site, cafeGeo, cafeMapLink, cafeMenu, cafeOpeningHoursSpec, panoramaBookingUrl } from '@/lib/content';
import { galleryFeatured } from '@/lib/gallery';
// The home page is the only route that mounts the persistent WebGL scene (SceneLoader) and its scroll choreography (Motion).
// Its sections are short teasers that link to the dedicated pages.
export default function Home() {
  const schema = content.properties.map(property=>({'@context':'https://schema.org','@type':property.type==='cafe'?'CafeOrCoffeeShop':'LodgingBusiness',name:property.name,url:`${site.origin}${property.path}`,description:property.description,...(property.id==='panorama'?{image:galleryFeatured.map(photo=>`${site.origin}${photo.src}`)}:{}),sameAs:[property.id==='panorama'?content.instagram:content.cafeInstagram],telephone:content.phone,email:content.email,address:{'@type':'PostalAddress',addressLocality:'Manali',addressRegion:'Himachal Pradesh',addressCountry:'IN'},...(property.id==='panorama'?{potentialAction:{'@type':'ReserveAction',name:'Book HOGS Panorama',target:{'@type':'EntryPoint',urlTemplate:panoramaBookingUrl,actionPlatform:['http://schema.org/DesktopWebPlatform','http://schema.org/MobileWebPlatform']},result:{'@type':'LodgingReservation',name:'HOGS Panorama booking'}}}:{}),...(property.type==='cafe'?{geo:cafeGeo,hasMap:cafeMapLink,hasMenu:cafeMenu.url,openingHoursSpecification:[cafeOpeningHoursSpec]}:{})}));
  return <><link rel="preload" href="/terrain/manali-dem.bin" as="fetch" crossOrigin="anonymous"/><link rel="preload" href="/images/hero/hero-3d-poster-mobile.webp" as="image" type="image/webp" media="(max-width: 700px)" fetchPriority="high"/><link rel="preload" href="/images/hero/hero-3d-poster.webp" as="image" type="image/webp" media="(min-width: 701px)" fetchPriority="high"/>{/* the textures are fetched by three.js in CORS mode, so the preloads must be crossOrigin too or the browser downloads each file twice */}<link rel="preload" href="/textures/manali-satellite-mobile.webp" as="image" crossOrigin="anonymous" media="(max-width: 1023px)"/><link rel="preload" href="/textures/manali-satellite.webp" as="image" crossOrigin="anonymous" media="(min-width: 1024px)"/><link rel="preload" href="/textures/alpine-canopy.webp" as="image" crossOrigin="anonymous"/><link rel="preload" href="/textures/himalayan-sky.webp" as="image" crossOrigin="anonymous"/><script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(schema).replace(/</g,'\u003c')}} /><SceneLoader /><Motion /><main id="main"><Hero /><Intro /><Stays /><Journeys /><Manifesto /><Features /><Gallery /><About /><BookTeaser /><ReviewsSection /></main></>;
}
