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
export const content = {
  ui: {
    heroLines: ['Experience the', 'Himalayas', 'the HOGS Way'], heroShort: ['A little closer to nature.', 'A little closer to yourself.'],
    heroCta: 'Book Your Stay', heroFooter: 'Rooted in Manali. Made for belonging.', scrollPrompt: 'SCROLL TO FIND YOUR VAATAAVARAN',
    intro: { eyebrow: 'WELCOME TO OUR WORLD', heading: ['Not just a place.', 'A state of being.'], definition: 'VAATAAVARAN / वातावरण / THE FEELING OF A PLACE' },
    stays: { eyebrow: 'THE STAYS', index: '01 — TWO WAYS TO BELONG', heading: ['A stay, and a cafe.', 'Two ways to belong.'], cardEyebrow: 'YOUR MOUNTAIN ADDRESS', cafeLabel: 'THE CAFE', cta: 'Book this stay', cafeCta: 'Visit the Cafe', cafeDirections: 'Get directions' },
    features: { eyebrow: 'THE HOGS WAY', heading: ['Less rush.', 'More vaataavaran.'], description: ['It’s the feeling that stays with you.', 'The small things. The open-hearted moments.'] },
    gallery: { eyebrow: 'POSTCARDS FROM THE MOUNTAINS', index: '03 — STAY A LITTLE LONGER', heading: ['Some places are felt.', 'Not just seen.'], description: 'A glimpse of the world we call home.', note: 'A moodboard of mountain life. Photographs are illustrative; HOGS property photography is coming soon.' },
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
    { id: 'panorama', name: 'HOGS Panorama', type: 'stay' as const, bookable: true, subtitle: 'A front-row seat to the Himalayas.', description: 'Open your curtains to a different perspective. A mountain stay with panoramic valley views, and space to take it all in.', images: [images.hogs1, images.hogs2, images.hogs3], highlights: ['Valley views', 'Manali', 'Himalayan hospitality'], price: null, roomCount: null, amenities: [], mapUrl: null as string | null },
    { id: 'cafe', name: 'Cafe Do Nthng', type: 'cafe' as const, bookable: false, subtitle: 'Slow mornings, good coffee, zero agenda.', description: 'TODO(owner): describe Cafe Do Nthng — the vibe, the food philosophy, what makes it worth the detour. Placeholder copy only; confirm before launch.', images: [images.cafe], highlights: ['TODO: signature brew', 'TODO: seating & vibe', 'TODO: opening hours'], price: null, roomCount: null, amenities: [], mapUrl: null as string | null },
  ],
  intro: { image: images.hogs3 },
  // Layered collage for the "Come for the mountains" moment (depth 1 = nearest).
  manifesto: {
    label: 'Make room for what matters', marquee: 'VAATAAVARAN · MANALI · SLOW LIVING · ',
    collage: [{ ...images.hogs2, depth: 1 }, { ...images.mountains, depth: 3 }, { ...images.valley, depth: 2 }],
  },
  // TODO(owner): confirm these experience descriptions before launch; not an amenities list.
  features: [
    { number: '01', title: 'Views worth pausing for', text: 'Mountains that remind you to look up, breathe deep, and take your time.', icon: 'mountain', image: '/images/mountains.jpg', imageAlt: 'Illustrative snow-covered mountain peaks' },
    { number: '02', title: 'A rider’s kind of place', text: 'Born from a love of open roads and the people we meet along the way.', icon: 'road', image: '/images/valley.jpg', imageAlt: 'Illustrative valley on a mountain journey' },
    { number: '03', title: 'Room for connection', text: 'Shared stories, new friendships, and conversations without a clock.', icon: 'home', image: '/images/stays/retreat.jpg', imageAlt: 'Illustrative forest retreat' },
    { number: '04', title: 'The little rituals', text: 'A warm cup, a mountain morning, and nowhere else you need to be.', icon: 'cup', image: '/images/stays/panorama.jpg', imageAlt: 'Illustrative peaceful mountain morning' },
    { number: '05', title: 'Permission to slow down', text: 'Less on the itinerary. More in the moment.', icon: 'sun', image: '/images/valley.jpg', imageAlt: 'Illustrative quiet green valley' },
  ],
  gallery: [
    { src: '/images/mountains.jpg', alt: 'Layers of mountain ridges in soft Himalayan light', caption: 'A different kind of perspective' },
    { src: '/images/stays/retreat.jpg', alt: 'An illustrative woodland mountain retreat', caption: 'Somewhere to settle in' },
    { src: '/images/valley.jpg', alt: 'A mountain valley with forest and distant peaks', caption: 'Take the long way home' },
    { src: '/images/stays/panorama.jpg', alt: 'An illustrative peaceful mountain landscape', caption: 'Mornings, unhurried' },
  ],
  about: "HOGS (House of GS) was born from two souls who found freedom on open roads and comfort in conversations with strangers who soon became friends. Gazal and Saloni are riders at heart, always chasing mountains, stories, and moments that don't fit into plans. Somewhere between bike rides, shared sunsets, and chai conversations, they realised that travel isn't just about places, it's about people and vaataavaran.",
  storyLines: ['House of GS is not just a homestay.', "It's a feeling.", 'A place where riders rest without questions, travellers feel understood, and conversations flow as easily as mountain air.', "Here, you don't just stay. You arrive, you belong, and you carry the vaataavaran with you when you leave."],
  booking: "Whether you're planning a romantic getaway, family vacation, or peaceful retreat in the Himalayas, HOGS offers the perfect place to stay in Manali. Choose your property, pick your dates, and let the mountains welcome you.",
  email: 'info@hogsstays.com', phone: '+91 92511 15478', whatsapp: '919251115478', instagram: null as string | null,
  policies: [ { slug: 'privacy-policy', title: 'Privacy Policy' }, { slug: 'terms-and-conditions', title: 'Terms & Conditions' }, { slug: 'cancellation-refund-policy', title: 'Cancellation & Refund Policy' }, { slug: 'house-rules', title: 'House Rules / Guest Guidelines' }, { slug: 'faqs', title: 'FAQs' } ],
};

