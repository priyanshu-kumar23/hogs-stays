import { findImage, findPanoramaView, panoramaCoverImage, type GalleryImage } from './gallery';
import { SHOW_GUEST_PHOTOS, findCafeImage } from './cafeImages';
import { rooms } from './rooms';
import { policyPages } from './policies';
// No prices, room counts, or unconfirmed amenities are published.
// HOGS Panorama photography comes from lib/gallery.generated.ts (see `photo`/`pic` below); only the Cafe DO NTHNG photo lives here.
// Cafe DO NTHNG photos come from lib/cafeImages.generated.ts (run `npm run images:cafe`).
const cafeHero = findCafeImage('cafe-do-nthng-manali-mountain-terrace-prayer-flags-cover');
const cafeCup = findCafeImage('cafe-do-nthng-manali-latte-art-coffee');
const cafeMural = findCafeImage('cafe-do-nthng-manali-terrace-motorbike-mural-wicker-seating');
// Card 04 shows guests; if SHOW_GUEST_PHOTOS is switched off it falls back to the latte-art photo.
const cafeMeal = SHOW_GUEST_PHOTOS ? findCafeImage('cafe-do-nthng-manali-guests-sharing-a-meal') : cafeCup;
const cafeLantern = findCafeImage('cafe-do-nthng-manali-lantern-fairy-lights-dusk');
const cafeDusk = findCafeImage('cafe-do-nthng-manali-terrace-lanterns-prayer-flags-dusk');
const viewShot = (id: string, position?: string) => { const v = findPanoramaView(id); const src = v.srcSet[v.srcSet.length - 1].src; return { src, full: src, alt: v.alt, position: position ?? v.position, blur: v.blurDataURL, landscape: v.width > v.height, ratio: v.width / v.height }; };
const widest = (image: { srcSet: { src: string }[] }) => image.srcSet[image.srcSet.length - 1].src;
export const images = {
  cafe: { src: cafeHero.srcSet[cafeHero.srcSet.length - 1].src, alt: cafeHero.alt, position: cafeHero.position, blur: cafeHero.blurDataURL, width: cafeHero.width, height: cafeHero.height },
};
// HOGS Panorama cover (lib/cafeImages.generated.ts too, see lib/gallery.ts): same shape as `photo()` so it can lead the stays slider.
const panoramaCover = { src: panoramaCoverImage.srcSet[panoramaCoverImage.srcSet.length - 1].src, full: panoramaCoverImage.srcSet[panoramaCoverImage.srcSet.length - 1].src, alt: panoramaCoverImage.alt, position: panoramaCoverImage.position, blur: panoramaCoverImage.blurDataURL, landscape: true, ratio: panoramaCoverImage.width / panoramaCoverImage.height };
// Real HOGS Panorama photography (generated data in lib/gallery.generated.ts). Cards use the 1000px variant; hero/slider use full size.
const photo = (subject: string, full = false) => { const g: GalleryImage = findImage(subject); return { src: full ? g.src : g.srcMd, full: g.src, alt: g.alt, position: g.position, blur: g.blurDataURL, landscape: g.orientation === 'landscape', ratio: g.width / g.height }; };
/** Full-size photo for a page hero / OG: `og` is the 1200x630 crop when the photo is featured, otherwise the full image. */
export const pic = (subject: string) => { const g: GalleryImage = findImage(subject); return { src: g.src, md: g.srcMd, og: g.og ?? g.src, alt: g.alt, position: g.position }; };
// Image fields for a home "art of being here" panel (width/height ratio drives the next/image `sizes` hint when a landscape photo is cropped to 4:5).
type Shot = { src: string; alt: string; position: string; blur?: string; ratio: number };
const panelImage = (shot: Shot) => ({ image: shot.src, imageAlt: shot.alt, position: shot.position, blur: shot.blur, ratio: shot.ratio });
export const site = { origin: process.env.NEXT_PUBLIC_SITE_URL || 'https://hogsstays.com' };
// Primary navigation. Every href here is a real App Router route (see app/).
export const navLinks = [
  { title: 'Gallery', href: '/gallery' },
  { title: 'Features', href: '/features' },
  { title: 'About Us', href: '/about' },
] as const;
export const footerLinks = [
  { title: 'Home', href: '/' }, { title: 'Our Stays', href: '/stays' }, { title: 'HOGS Panorama', href: '/stays/panorama' },
  { title: 'Cafe DO NTHNG', href: '/cafe' }, { title: 'Gallery', href: '/gallery' }, { title: 'Features', href: '/features' },
  { title: 'About Us', href: '/about' }, { title: 'Manali Packages', href: '/packages' }, { title: 'Book Now', href: '/book' }, { title: 'Contact', href: '/contact' },
] as const;
// One location for the stay and its in-house cafe. Verified coordinates can be supplied here.
export const panoramaLocation = {
  directionsUrl: 'https://maps.app.goo.gl/WT7Xnq1hsoJjRCs48',
  embedUrl: 'https://maps.google.com/maps?q=HOGS%20Panorama%2C%20Shuru%20Road%2C%20Prini%2C%20Manali&t=&z=16&ie=UTF8&iwloc=&output=embed',
  label: 'Inside HOGS Panorama, Manali',
  displayAddress: 'HOGS Panorama, Shuru Road, Prini, near Mata Sharvari Temple, Manali, Himachal Pradesh 175143',
  address: { '@type': 'PostalAddress', streetAddress: 'Shuru Road, Prini, near Mata Sharvari Temple', addressLocality: 'Manali', addressRegion: 'Himachal Pradesh', postalCode: '175143', addressCountry: 'IN' },
  geo: null as { '@type': 'GeoCoordinates'; latitude:number; longitude:number } | null,
};
// Cafe DO NTHNG has its OWN location. Its pin (resolved from the share link) is ~177 m from the HOGS Panorama pin, so the cafe is NOT described as
// "inside the Panorama premises" and the cafe JSON-LD has no containedInPlace. Panorama values above are unchanged.
export const cafeMapLink = 'https://maps.app.goo.gl/7RuArhr2pFA4V6Wj9';
export const cafeGeo = { '@type': 'GeoCoordinates' as const, latitude: 32.21389, longitude: 77.203417 };
export const cafeMapEmbed = `https://www.google.com/maps?q=${cafeGeo.latitude},${cafeGeo.longitude}&z=17&output=embed`;
export const cafeLocation = {
  mapLink: cafeMapLink, embedUrl: cafeMapEmbed, geo: cafeGeo,
  label: 'Cafe DO NTHNG, Manali',
  // TODO(owner): add the cafe's full street address here (the share link only holds coordinates).
  displayAddress: 'Cafe DO NTHNG, Manali, Himachal Pradesh',
  address: { '@type': 'PostalAddress' as const, addressLocality: 'Manali', addressRegion: 'Himachal Pradesh', addressCountry: 'IN' },
};
export const cafeMenu = { url: 'https://dinein.petpooja.com/qr/fkjin5o9m8/Lobby', label: 'View menu & order', ariaLabel: 'View Cafe DO NTHNG menu and order' };
/** The order-menu QR (lossless PNG, 29x29 modules + 4-module white quiet zone = 37 modules, 16 px each). It encodes cafeMenu.url. Show it at a multiple of 37 CSS px (148 / 185 / 222) with image-rendering: pixelated. */
export const cafeMenuQr = { src: '/images/cafe-do-nthng/cafe-do-nthng-manali-order-menu-qr.png', width: 592, height: 592, alt: 'QR code to view the Cafe DO NTHNG menu and order', heading: 'Scan. Order. Do nothing.', text: 'Scan with your phone camera to see the menu and order.', share: 'Or share this code with a friend' };
/** Open every day, 10:00 to 22:00 Asia/Kolkata. The live open/closed chip and the JSON-LD both read this. */
export const cafeHours = {
  timeZone: 'Asia/Kolkata', opens: '10:00', closes: '22:00', opensLabel: '10 AM', closesLabel: '10 PM',
  text: 'Open daily · 10 AM – 10 PM', short: 'Open daily 10 AM – 10 PM', seo: 'open daily 10 AM to 10 PM',
  days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'] as string[],
};
export const cafeOpeningHoursSpec = { '@type': 'OpeningHoursSpecification' as const, dayOfWeek: cafeHours.days, opens: cafeHours.opens, closes: cafeHours.closes };
/** HOGS Panorama online booking (Aiosell booking engine). Every Book now / Book this stay on the Panorama side opens this in a new tab. */
export const panoramaBookingUrl = 'https://be.aiosell.com/book/5b1f04b124';
export const panoramaBooking = { url: panoramaBookingUrl, label: 'Book now', hint: 'Secure booking ↗', questions: 'Questions? Enquire on WhatsApp' };
/** One place for the business address, map and logo. Footer, /contact and the structured data all read this.
 *  TODO(owner): the short link below could not be resolved from the build machine, so the map is built from the address (no key needed).
 *  Open the link in a browser, copy the latitude/longitude from the address bar (@lat,lng) and set `geo`: the embed, the directions link
 *  and the JSON-LD `geo` then all switch to the exact pin automatically. */
const mapAddress = '6672+9M8, Shuru Rd, Himachal Pradesh 175143';
const mapGeo = null as { latitude: number; longitude: number } | null;
const mapShortUrl = 'https://maps.app.goo.gl/pNJ92bjCdLYYSmGm9';
export const SITE = {
  name: 'HOGS Stays',
  address: {
    plusCode: '6672+9M8', street: 'Shuru Rd', region: 'Himachal Pradesh', postalCode: '175143', country: 'India', countryCode: 'IN',
    /** The one-line address shown to guests. */
    text: `${mapAddress}, India`,
  },
  geo: mapGeo,
  mapShortUrl,
  mapEmbedUrl: mapGeo ? `https://www.google.com/maps?q=${mapGeo.latitude},${mapGeo.longitude}&z=15&output=embed` : `https://www.google.com/maps?q=${encodeURIComponent(mapAddress)}&output=embed`,
  directionsUrl: mapGeo ? `https://www.google.com/maps/dir/?api=1&destination=${mapGeo.latitude},${mapGeo.longitude}` : mapShortUrl,
  logo: { src: '/images/brand/hogs-logo.webp', width: 543, height: 241, alt: 'HOGS – A Himalayan Home' },
};
// TODO(owner): paste the Razorpay support / payment link here. While empty, the footer badge renders without a link.
export const RAZORPAY_SUPPORT_URL = '';
export const cafeAmbienceEnabled = false;
export const content = {
  ui: {
    heroLines: ['Experience the', 'Himalayas', 'the HOGS Way'], heroShort: ['A little closer to nature.', 'A little closer to yourself.'],
    heroCta: 'Book Your Stay', heroFooter: 'Rooted in Manali. Made for belonging.', scrollPrompt: 'SCROLL TO FIND YOUR VAATAAVARAN',
    intro: { eyebrow: 'WELCOME TO OUR WORLD', heading: ['Not just a place.', 'A state of being.'], definition: 'VAATAAVARAN / वातावरण / THE FEELING OF A PLACE' },
    stays: { eyebrow: 'THE STAYS', index: '02 — TWO WAYS TO BELONG', heading: ['A stay, and a cafe.', 'Two ways to belong.'], cardEyebrow: 'YOUR MOUNTAIN ADDRESS', cafeLabel: 'THE CAFE', cta: 'Book this stay', cafeCta: 'Visit the Cafe', cafeDirections: 'Get directions' },
    features: { eyebrow: 'THE HOGS WAY', heading: ['Less rush.', 'More Vaataavaran.'], description: ['It’s the feeling that stays with you.', 'The small things. The open-hearted moments.'],
      // Home-page horizontal story (components/sections/Features.tsx).
      story: { index: '04 / THE HOGS WAY', label: 'THE ART OF BEING HERE', more: 'Explore the HOGS way →', intro: ['Come for the', 'mountains.', 'Stay for the', 'feeling.'], scroll: 'Scroll', outroCta: 'Explore the HOGS way', progress: 'Experience progress', region: 'The art of being here' } },
    panorama: { eyebrow: 'PHOTOGRAPHS', seeAll: 'See all photos →', sections: { signature: 'Signature View', valley: 'Valley View', outdoor: 'Outdoor', common: 'Common Area' } },
    gallery: { eyebrow: 'POSTCARDS FROM THE MOUNTAINS', index: '05 — STAY A LITTLE LONGER', heading: ['Some places are felt.', 'Not just seen.'], description: 'A glimpse of the world we call home.', note: 'A moodboard of mountain life, photographed at HOGS Panorama in Manali.' },
    about: { eyebrow: 'THE SOUL BEHIND THE STAYS', heading: ['Open roads.', 'Open hearts.', 'A place to belong.'], byline: 'HOUSE OF GS · EST. IN THE MOUNTAINS', founders: 'GAZAL & SALONI / THE HEART OF HOGS' },
    booking: { eyebrow: 'THE MOUNTAINS ARE CALLING', heading: ['Let the mountains', 'welcome you.'], contact: 'A CONVERSATION IS A GOOD START', submit: 'Enquire About Your Stay', whatsapp: 'Continue on WhatsApp' },
    footer: { heading: ['Come for the mountains.', 'Stay for the feeling.'], credit: 'Made of mountains, stories & a little chai.' },
  },
  journeyCredit: 'Journey photography: HOGS, plus freely licensed images from Wikimedia Commons (CC BY / CC BY-SA).',
  landscape: { credit: 'Manali elevation: Mapzen / Tilezen · SRTM data courtesy of the U.S. Geological Survey.', textures: 'Contains modified Copernicus Sentinel data 2024. PBR detail: Amal Kumar / Poly Haven (CC0).', note: 'Terrain and surface imagery depict the Manali region. Additional snow, trees, river and property markers are artistic interpretations.' },
  brand: 'HOGS', tagline: 'Of Himalayan Homes', location: 'Manali, Himachal Pradesh',
  hero: { title: 'Experience the Himalayas the HOGS Way', description: 'Welcome to HOGS – Of Himalayan Homes, a collection of thoughtfully crafted mountain stays in Manali. From scenic valley views to peaceful mountain retreats, every property is designed to bring you closer to the beauty of the Himalayas.' },
  staysIntro: 'Discover two unique experiences curated by HOGS: a mountain stay with panoramic valley views, and Cafe DO NTHNG, a slow-morning cafe surrounded by nature.',
  // TODO(owner): Cafe DO NTHNG is new — confirm type/description/highlights/bookable below before launch.
  properties: [
    { id: 'panorama', path: '/stays/panorama', name: 'HOGS Panorama', type: 'stay' as const, bookable: true, subtitle: 'A front-row seat to the Himalayas.', description: 'Open your curtains to a different perspective. A mountain stay with panoramic valley views, and space to take it all in.', images: [panoramaCover, photo('window-seats-with-mountain-view', true), photo('attic-lounge-with-timber-ceiling', true), photo('room-with-corner-windows-and-green-armchairs', true), photo('room-with-large-window-and-hillside-view', true)], highlights: ['Valley views', 'Manali', 'Himalayan hospitality'], price: null, roomCount: null, amenities: [], mapUrl: panoramaLocation.directionsUrl },
    { id: 'cafe', path: '/cafe', name: 'Cafe DO NTHNG', type: 'cafe' as const, bookable: false, subtitle: 'Slow mornings, good coffee, zero agenda.', description: 'Artisan coffee, signature shakes, Mediterranean & comfort food and weekend brunch, with mountain and orchard views.', images: [images.cafe], highlights: ['Artisan coffee', 'Mountain & orchard views', cafeHours.text], price: null, roomCount: null, amenities: [], mapUrl: cafeMapLink },
  ],
  intro: { image: { src: widest(cafeLantern), alt: cafeLantern.alt, position: '50% 30%', blur: cafeLantern.blurDataURL } },
  // Layered collage for the "Make room for what matters" moment (depth 1 = nearest).
  manifesto: {
    label: 'Make room for what matters', headline: ['Where the road', 'slows down.'], support: 'Leave the noise at the bend. Here, mornings are long, chai is always warm, and nobody is in a hurry.', marquee: 'VAATAAVARAN · MANALI · SLOW LIVING · ',
    collage: [{ ...photo('lounge-sofas-and-orange-armchairs'), depth: 1 }, { ...photo('lounge-with-wooden-slat-partition'), depth: 3 }, { ...photo('room-with-mountain-window'), depth: 2 }],
  },
  // TODO(owner): confirm these experience descriptions before launch; not an amenities list.
  features: [
    { number: '01', title: 'Views worth pausing for', text: 'Mountains that remind you to look up, breathe deep, and take your time.', icon: 'mountain', ...panelImage({ ...photo('balcony-with-mountain-and-orchard-view', true), position: '30% 50%' }) },
    { number: '02', title: 'A rider’s kind of place', text: 'Born from a love of open roads and the people we meet along the way.', icon: 'road', ...panelImage({ src: widest(cafeMural), alt: cafeMural.alt, position: '18% 50%', blur: cafeMural.blurDataURL, ratio: cafeMural.width / cafeMural.height }) },
    { number: '03', title: 'Room for connection', text: 'Shared stories, new friendships, and conversations without a clock.', icon: 'home', ...panelImage({ ...photo('bedroom-with-balcony-door-and-mountain-view', true), position: '50% 55%' }) },
    { number: '04', title: 'The little rituals', text: 'A warm cup, a mountain morning, and nowhere else you need to be.', icon: 'cup', ...panelImage({ src: widest(cafeMeal), alt: cafeMeal.alt, position: cafeMeal === cafeCup ? cafeCup.position : '45% 75%', blur: cafeMeal.blurDataURL, ratio: cafeMeal.width / cafeMeal.height }) },
    { number: '05', title: 'Permission to slow down', text: 'Less on the itinerary. More in the moment.', icon: 'sun', ...panelImage({ ...photo('attic-lounge-with-timber-ceiling', true), position: '55% 55%' }) },
    { number: '06', title: 'Private Jacuzzi', text: 'Soak in a jacuzzi of your own, with the mountains right beyond the glass.', icon: 'home', ...panelImage({ ...photo('jacuzzi-lit-tub-with-mountain-view', true), position: '45% 62%' }) },
  ],
  // Home curved rail: real HOGS Panorama photos only (md variant for the cards, full size for the lightbox). Keep exactly four, in this
  // order: the card tilt in app/cinematic.css is defined per :nth-child(1-4). Cards are ~3:4, so portraits are preferred; landscapes are
  // cropped with a subject-aware object-position.
  gallery: [
    { id: 'perspective', caption: 'A different kind of perspective', ...viewShot('hogs-panorama-manali-snow-peaks-valley-village-perspective') },
    { id: 'settle-in', caption: 'Somewhere to settle in', ...photo('lounge-sofa-seating') },
    { id: 'long-way-home', caption: 'Take the long way home', src: widest(cafeDusk), full: widest(cafeDusk), alt: cafeDusk.alt, position: '50% 45%', blur: cafeDusk.blurDataURL, landscape: false, ratio: cafeDusk.width / cafeDusk.height },
    { id: 'mornings', caption: 'Mornings, unhurried', ...viewShot('hogs-panorama-manali-sunrise-over-mountains') },
  ],
  about: "HOGS (House of GS) was born from two souls who found freedom on open roads and comfort in conversations with strangers who soon became friends. Gazal and Saloni are riders at heart, always chasing mountains, stories, and moments that don't fit into plans. Somewhere between bike rides, shared sunsets, and chai conversations, they realised that travel isn't just about places, it's about people and Vaataavaran.",
  // TODO(owner): placeholder one-liners for the /about founder cards. Edit freely.
  founderTaglines: { gazal: 'Rider. Storyteller. Chai enthusiast.', saloni: 'Rider. Host. Collector of sunsets.' },
  storyLines: ['House of GS is not just a homestay.', "It's a feeling.", 'A place where riders rest without questions, travellers feel understood, and conversations flow as easily as mountain air.', "Here, you don't just stay. You arrive, you belong, and you carry the Vaataavaran with you when you leave."],
  booking: "Whether you're planning a romantic getaway, family vacation, or peaceful retreat in the Himalayas, HOGS offers the perfect place to stay in Manali. Choose your property, pick your dates, and let the mountains welcome you.",
  email: 'info@hogsstays.com', phone: '+91 92511 15478', whatsapp: '919251115478', instagram: 'https://www.instagram.com/hogsstays/', cafeInstagram: 'https://www.instagram.com/cafedonthng.manali/',
  policies: policyPages.map(page => ({ slug: page.slug, title: page.title })),
};

/** Everything the HOGS Panorama enquiry panel needs: the WhatsApp number / email (above) and the room list (edit rooms in lib/rooms.ts). */
export const panoramaEnquiry = { propertyName: 'HOGS Panorama', whatsapp: content.whatsapp, email: content.email, rooms };

/** Cafe scroll story. Owner-editable copy and location; no menu items or hours assumed. */
export const cafeStory = {
  arrival: 'Leave the noise at the door.', name: 'Cafe DO NTHNG', subtitle: 'Slow mornings, good coffee, zero agenda.',
  location: 'MANALI · OF HIMALAYAN HOMES', visitCta: 'Visit the cafe', instagramCta: 'Follow on Instagram', scroll: 'TAKE YOUR TIME · SCROLL SLOWLY',
  chaos: ['traffic', 'deadlines', 'notifications', 'honking'],
  ritual: {label:'01 / THE RITUAL',title:'A little less doing.',accent:'A little more being.',lines:['Order slow.', 'Sit longer.', 'Do nothing — properly.'],note:'A warm cup. A mountain breeze. Permission to pause.',cupLabel:'A slowly turning ceramic coffee cup with rising steam'},
  bar: {label:'BEHIND THE BAR',line:'Every cup, pulled by hand.',title:'Every cup,',accent:'pulled by hand.',images:['cafe-do-nthng-manali-espresso-machine-black-and-white','cafe-do-nthng-manali-barista-pulling-espresso-shot','cafe-do-nthng-manali-barista-at-espresso-machine-black-and-white']},
  menu: {label:'02 / ON THE MENU',title:'Something to',accent:'linger over.',note:'A glimpse from our counter. The full menu is coming soon.',items:[
    {image:'cafe-do-nthng-manali-berry-mocktail',name:'TODO: mocktail name',description:'TODO: mocktail description'},
    {image:'cafe-do-nthng-manali-green-mocktail-prayer-flags',name:'TODO: mocktail name',description:'TODO: mocktail description'},
    {image:'cafe-do-nthng-manali-orange-citrus-cooler-mountains',name:'TODO: cooler name',description:'TODO: citrus cooler description'}]},
  terrace: {label:'03 / THE TERRACE',title:'Nowhere else',accent:'to be.',caption:'Pick a chair. Any chair.',swipe:'Swipe to find your corner',images:['cafe-do-nthng-manali-terrace-mural-swing','cafe-do-nthng-manali-terrace-mountain-view','cafe-do-nthng-manali-terrace-walkway-prayer-flags-tables','cafe-do-nthng-manali-terrace-chai-prayer-flags','cafe-do-nthng-manali-guests-terrace-prayer-flags','cafe-do-nthng-manali-terrace-motorbike-mural-wicker-seating']},
  dusk: {label:'04 / DAY TO DUSK',title:'Let the evening',accent:'take its time.',text:'By evening, the lanterns come on and the guitars come out.',note:'A glimpse of evenings at DO NTHNG. Ask us about upcoming music sessions.',stages:['Daylight','Lantern glow','After dark'],images:['cafe-do-nthng-manali-egg-chair-forest-view','cafe-do-nthng-manali-lantern-fairy-lights-dusk','cafe-do-nthng-manali-live-acoustic-guitar-session','cafe-do-nthng-manali-candlelit-dinner-couple']},
  people: {label:'05 / THE PEOPLE',image:'cafe-do-nthng-manali-team-neon-sign-entrance',baristaImage:'cafe-do-nthng-manali-barista-at-work',baristaCaption:'The first cup of the day.',title:'The people',accent:'behind the cups.',text:'The hands behind every cup, every quiet morning and every evening session at Cafe DO NTHNG.',caption:'Good company. Warm cups. Our kind of place.'},
  moments: {label:'06 / LITTLE MOMENTS',title:'Stay for',accent:'the feeling.',images:['hogs-panorama-manali-guests-friends-laughing','cafe-do-nthng-manali-building-exterior-hogs-gate','hogs-panorama-manali-guests-friends-snow-peaks','cafe-do-nthng-manali-guests-chatting-terrace-dusk','hogs-panorama-manali-guests-older-couple-at-sign','cafe-do-nthng-manali-neon-sign-night-entrance','cafe-do-nthng-manali-guests-sharing-a-meal','hogs-panorama-manali-guests-couple-at-hogs-sign']},
  visit: {offer:'Artisan coffee · Signature shakes · Mediterranean & comfort food · Weekend brunch',label:'07 / FIND YOUR WAY HERE',title:'Your chair',accent:'is waiting.',hoursLabel:'Opening hours',hours:cafeHours.text,addressLabel:'Find us',address:cafeLocation.displayAddress,mapPlaceholder:'Our map is coming soon. Message us for the exact location.',directions:'Get directions',directionsMessage:'Hi! Could you share directions to Cafe DO NTHNG in Manali?',reserve:'Reserve a table',message:"Hi! I'd like to reserve a table at Cafe DO NTHNG",note:'A table request, subject to availability. We’ll confirm with you on WhatsApp.',mapEmbedUrl:cafeMapEmbed,mapLabel:cafeLocation.label},
  ambience: {off:'♪ Cafe sounds',on:'♫ Sounds on',missing:'Cafe sounds will be available soon.',path:'/audio/cafe-ambience.mp3',available:false},
};
