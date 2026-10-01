import { findImage, type GalleryImage } from './gallery';
// TODO(owner): replace all illustrative photographs with licensed HOGS photography.
// No prices, room counts, or unconfirmed amenities are published.
// Central registry of real photography. Components reference these, never raw paths.
export const images = {
  hogs1: { src: '/images/hogsstays1.jpeg', alt: 'Sunlit attic lounge at HOGS Panorama with a timber ceiling, rocking chair and armchairs facing a valley window', position: 'center 55%' },
  hogs2: { src: '/images/hogsstays2.jpeg', alt: 'A HOGS bedroom with a large window looking out over the Manali valley and wooded slopes', position: 'center 50%' },
  hogs3: { src: '/images/hogsstays3.jpeg', alt: 'Through a glass door at HOGS, snow-capped Himalayan peaks glow blue at dusk above a pine forest', position: 'center 62%' },
  cafe: { src: '/images/cafe.jpeg', alt: 'Cafe Do Nthng at night, its neon sign glowing above a stone entrance with terrace seating and potted plants', position: 'center 46%' },
  mountains: { src: '/images/mountains.jpg', alt: 'Layers of Himalayan mountain ridges in soft light', position: 'center 40%' },
  valley: { src: '/images/valley.jpg', alt: 'A green mountain valley with forest and distant peaks', position: 'center 55%' },
};
// Real HOGS Panorama photography (generated data in lib/gallery.generated.ts). Cards use the 1000px variant; hero/slider use full size.
const photo = (subject: string, full = false) => { const g: GalleryImage = findImage(subject); return { src: full ? g.src : g.srcMd, full: g.src, alt: g.alt, position: g.position, blur: g.blurDataURL, landscape: g.orientation === 'landscape' }; };
export const site = { origin: process.env.NEXT_PUBLIC_SITE_URL || 'https://hogsstays.com' };
// Primary navigation. Every href here is a real App Router route (see app/).
export const navLinks = [
  { title: 'Gallery', href: '/gallery' },
  { title: 'Features', href: '/features' },
  { title: 'About Us', href: '/about' },
  { title: 'Our Stays', href: '/stays' },
] as const;
export const footerLinks = [
  { title: 'Home', href: '/' }, { title: 'Our Stays', href: '/stays' }, { title: 'HOGS Panorama', href: '/stays/panorama' },
  { title: 'Cafe Do Nthng', href: '/cafe' }, { title: 'Gallery', href: '/gallery' }, { title: 'Features', href: '/features' },
  { title: 'About Us', href: '/about' }, { title: 'Book Now', href: '/book' },
] as const;
export const content = {
  ui: {
    heroLines: ['Experience the', 'Himalayas', 'the HOGS Way'], heroShort: ['A little closer to nature.', 'A little closer to yourself.'],
    heroCta: 'Book Your Stay', heroFooter: 'Rooted in Manali. Made for belonging.', scrollPrompt: 'SCROLL TO FIND YOUR VAATAAVARAN',
    intro: { eyebrow: 'WELCOME TO OUR WORLD', heading: ['Not just a place.', 'A state of being.'], definition: 'VAATAAVARAN / वातावरण / THE FEELING OF A PLACE' },
    stays: { eyebrow: 'THE STAYS', index: '01 — TWO WAYS TO BELONG', heading: ['A stay, and a cafe.', 'Two ways to belong.'], cardEyebrow: 'YOUR MOUNTAIN ADDRESS', cafeLabel: 'THE CAFE', cta: 'Book this stay', cafeCta: 'Visit the Cafe', cafeDirections: 'Get directions' },
    features: { eyebrow: 'THE HOGS WAY', heading: ['Less rush.', 'More vaataavaran.'], description: ['It’s the feeling that stays with you.', 'The small things. The open-hearted moments.'],
      // Home-page horizontal story (components/sections/Features.tsx).
      story: { index: '03 / THE HOGS WAY', label: 'THE ART OF BEING HERE', more: 'Explore the HOGS way →', intro: ['Come for the', 'mountains.', 'Stay for the', 'feeling.'], scroll: 'Scroll', outroCta: 'Explore the HOGS way', progress: 'Experience progress', region: 'The art of being here' } },
    panorama: { eyebrow: 'PHOTOGRAPHS', seeAll: 'See all photos →', sections: { rooms: 'Rooms', views: 'Views', outdoor: 'Outdoor', common: 'Common Room' } },
    gallery: { eyebrow: 'POSTCARDS FROM THE MOUNTAINS', index: '03 — STAY A LITTLE LONGER', heading: ['Some places are felt.', 'Not just seen.'], description: 'A glimpse of the world we call home.', note: 'A moodboard of mountain life, photographed at HOGS Panorama in Manali.' },
    about: { eyebrow: 'THE SOUL BEHIND THE STAYS', heading: ['Open roads.', 'Open hearts.', 'A place to belong.'], byline: 'HOUSE OF GS · EST. IN THE MOUNTAINS', founders: 'GAZAL & SALONI / THE HEART OF HOGS' },
    booking: { eyebrow: 'THE MOUNTAINS ARE CALLING', heading: ['Let the mountains', 'welcome you.'], contact: 'A CONVERSATION IS A GOOD START', submit: 'Enquire About Your Stay', whatsapp: 'Continue on WhatsApp' },
    footer: { heading: ['Come for the mountains.', 'Stay for the feeling.'], credit: 'Made of mountains, stories & a little chai.' },
  },
  landscape: { credit: 'Manali elevation: Mapzen / Tilezen · SRTM data courtesy of the U.S. Geological Survey.', textures: 'Contains modified Copernicus Sentinel data 2024. PBR detail: Amal Kumar / Poly Haven (CC0).', note: 'Terrain and surface imagery depict the Manali region. Additional snow, trees, river and property markers are artistic interpretations.' },
  brand: 'HOGS', tagline: 'Of Himalayan Homes', location: 'Manali, Himachal Pradesh',
  hero: { title: 'Experience the Himalayas the HOGS Way', description: 'Welcome to HOGS – Of Himalayan Homes, a collection of thoughtfully crafted mountain stays in Manali. From scenic valley views to peaceful mountain retreats, every property is designed to bring you closer to the beauty of the Himalayas.', image: '/images/mountains.jpg' },
  staysIntro: 'Discover two unique experiences curated by HOGS: a mountain stay with panoramic valley views, and Cafe Do Nthng, a slow-morning cafe surrounded by nature.',
  // TODO(owner): Cafe Do Nthng is new — confirm type/description/highlights/bookable below before launch.
  properties: [
    { id: 'panorama', path: '/stays/panorama', name: 'HOGS Panorama', type: 'stay' as const, bookable: true, subtitle: 'A front-row seat to the Himalayas.', description: 'Open your curtains to a different perspective. A mountain stay with panoramic valley views, and space to take it all in.', images: [images.hogs1, images.hogs2, images.hogs3, photo('balcony-with-prayer-flags-valley-view', true), photo('modern-room-with-large-window-and-teal-armchairs', true), photo('lounge-sofas-and-wooden-coffee-table', true), photo('garden-and-wooden-building-with-mountain-view', true)], highlights: ['Valley views', 'Manali', 'Himalayan hospitality'], price: null, roomCount: null, amenities: [], mapUrl: null as string | null },
    { id: 'cafe', path: '/cafe', name: 'Cafe Do Nthng', type: 'cafe' as const, bookable: false, subtitle: 'Slow mornings, good coffee, zero agenda.', description: 'TODO(owner): describe Cafe Do Nthng — the vibe, the food philosophy, what makes it worth the detour. Placeholder copy only; confirm before launch.', images: [images.cafe], highlights: ['TODO: signature brew', 'TODO: seating & vibe', 'TODO: opening hours'], price: null, roomCount: null, amenities: [], mapUrl: null as string | null },
  ],
  intro: { image: images.hogs3 },
  // Layered collage for the "Make room for what matters" moment (depth 1 = nearest).
  manifesto: {
    label: 'Make room for what matters', headline: ['Where the road', 'slows down.'], support: 'Leave the noise at the bend. Here, mornings are long, chai is always warm, and nobody is in a hurry.', marquee: 'VAATAAVARAN · MANALI · SLOW LIVING · ',
    collage: [{ ...photo('lounge-sofas-and-wooden-coffee-table'), depth: 1 }, { ...photo('garden-seating-with-himalayan-valley-view'), depth: 3 }, { ...photo('balcony-view-over-orchards-and-mountains'), depth: 2 }],
  },
  // TODO(owner): confirm these experience descriptions before launch; not an amenities list.
  features: [
    { number: '01', title: 'Views worth pausing for', text: 'Mountains that remind you to look up, breathe deep, and take your time.', icon: 'mountain', image: photo('balcony-with-prayer-flags-and-wicker-chair').src, imageAlt: photo('balcony-with-prayer-flags-and-wicker-chair').alt, position: photo('balcony-with-prayer-flags-and-wicker-chair').position, blur: photo('balcony-with-prayer-flags-and-wicker-chair').blur },
    { number: '02', title: 'A rider’s kind of place', text: 'Born from a love of open roads and the people we meet along the way.', icon: 'road', image: '/images/valley.jpg', imageAlt: 'Illustrative valley on a mountain journey', position: images.valley.position },
    { number: '03', title: 'Room for connection', text: 'Shared stories, new friendships, and conversations without a clock.', icon: 'home', image: photo('wooden-lounge-sofa-seating').src, imageAlt: photo('wooden-lounge-sofa-seating').alt, position: photo('wooden-lounge-sofa-seating').position, blur: photo('wooden-lounge-sofa-seating').blur },
    { number: '04', title: 'The little rituals', text: 'A warm cup, a mountain morning, and nowhere else you need to be.', icon: 'cup', image: images.cafe.src, imageAlt: images.cafe.alt, position: images.cafe.position },
    { number: '05', title: 'Permission to slow down', text: 'Less on the itinerary. More in the moment.', icon: 'sun', image: '/images/stays/retreat.jpg', imageAlt: 'Illustrative forest retreat', position: 'center 50%' },
  ],
  // Home curved rail: real HOGS Panorama photos only (md variant for the cards, full size for the lightbox). Keep exactly four, in this
  // order: the card tilt in app/cinematic.css is defined per :nth-child(1-4). Cards are ~3:4, so portraits are preferred; landscapes are
  // cropped with a subject-aware object-position.
  gallery: [
    { id: 'perspective', caption: 'A different kind of perspective', ...photo('balcony-with-two-wicker-chairs-and-prayer-flags') },
    { id: 'settle-in', caption: 'Somewhere to settle in', ...photo('patterned-sofa-lounge-with-white-cushions') },
    { id: 'long-way-home', caption: 'Take the long way home', ...photo('stone-building-with-balconies-and-garden-seating') },
    { id: 'mornings', caption: 'Mornings, unhurried', ...photo('balcony-wicker-chair-with-mountain-view'), position: '72% 60%' },
  ],
  about: "HOGS (House of GS) was born from two souls who found freedom on open roads and comfort in conversations with strangers who soon became friends. Gazal and Saloni are riders at heart, always chasing mountains, stories, and moments that don't fit into plans. Somewhere between bike rides, shared sunsets, and chai conversations, they realised that travel isn't just about places, it's about people and vaataavaran.",
  storyLines: ['House of GS is not just a homestay.', "It's a feeling.", 'A place where riders rest without questions, travellers feel understood, and conversations flow as easily as mountain air.', "Here, you don't just stay. You arrive, you belong, and you carry the vaataavaran with you when you leave."],
  booking: "Whether you're planning a romantic getaway, family vacation, or peaceful retreat in the Himalayas, HOGS offers the perfect place to stay in Manali. Choose your property, pick your dates, and let the mountains welcome you.",
  email: 'info@hogsstays.com', phone: '+91 92511 15478', whatsapp: '919251115478', instagram: null as string | null,
  policies: [ { slug: 'privacy-policy', title: 'Privacy Policy' }, { slug: 'terms-and-conditions', title: 'Terms & Conditions' }, { slug: 'cancellation-refund-policy', title: 'Cancellation & Refund Policy' }, { slug: 'house-rules', title: 'House Rules / Guest Guidelines' }, { slug: 'faqs', title: 'FAQs' } ],
};

