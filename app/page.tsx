import Navigation from '@/components/ui/Navigation';
import StickyBookBar from '@/components/ui/StickyBookBar';
import Motion from '@/components/ui/Motion';
import SceneLoader from '@/components/three/SceneLoader';
import Hero from '@/components/sections/Hero';
import Intro from '@/components/sections/Intro';
import Stays from '@/components/sections/Stays';
import Features from '@/components/sections/Features';
import Gallery from '@/components/sections/Gallery';
import About from '@/components/sections/About';
import dynamic from 'next/dynamic';
// Keep the below-fold form in its own client chunk while preserving server rendering.
const BookingForm = dynamic(() => import('@/components/sections/BookingForm'));
import Footer from '@/components/sections/Footer';
import { content } from '@/lib/content';
export default function Home() {
  const schema = content.properties.map(property=>({'@context':'https://schema.org','@type':property.type==='cafe'?'CafeOrCoffeeShop':'LodgingBusiness',name:property.name,url:`${process.env.NEXT_PUBLIC_SITE_URL||'https://hogsstays.com'}/#${property.id}`,description:property.description,telephone:content.phone,email:content.email,address:{'@type':'PostalAddress',addressLocality:'Manali',addressRegion:'Himachal Pradesh',addressCountry:'IN'}}));
  return <><script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(schema).replace(/</g,'\\u003c')}} /><SceneLoader /><Navigation /><StickyBookBar /><Motion /><main id="main"><Hero /><Intro /><Stays /><Features /><Gallery /><About /><BookingForm /></main><Footer /></>;
}

