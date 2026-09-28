// TODO(owner): replace all illustrative photographs with licensed HOGS photography.
// No prices, room counts, or unconfirmed amenities are published.
export const content = {
  ui: {
    heroLines: ['Experience the', 'Himalayas', 'the HOGS Way'], heroShort: ['A little closer to nature.', 'A little closer to yourself.'],
    heroCta: 'Book Your Stay', heroFooter: 'Rooted in Manali. Made for belonging.', scrollPrompt: 'SCROLL TO FIND YOUR VAATAAVARAN',
    intro: { eyebrow: 'WELCOME TO OUR WORLD', heading: ['Not just a place.', 'A state of being.'], definition: 'VAATAAVARAN / वातावरण / THE FEELING OF A PLACE' },
    stays: { eyebrow: 'THE STAYS', index: '01 — TWO WAYS TO BELONG', heading: ['Two mountain stays.', 'One beautiful feeling.'], cardEyebrow: 'YOUR MOUNTAIN ADDRESS', imageNote: 'An impression of the mountains · sample photo', cta: 'Book this stay' },
    features: { eyebrow: 'THE HOGS WAY', heading: ['Less rush.', 'More vaataavaran.'], description: ['It’s the feeling that stays with you.', 'The small things. The open-hearted moments.'] },
    gallery: { eyebrow: 'POSTCARDS FROM THE MOUNTAINS', index: '03 — STAY A LITTLE LONGER', heading: ['Some places are felt.', 'Not just seen.'], description: 'A glimpse of the world we call home.', note: 'A moodboard of mountain life. Photographs are illustrative; HOGS property photography is coming soon.' },
    about: { eyebrow: 'THE SOUL BEHIND THE STAYS', heading: ['Open roads.', 'Open hearts.', 'A place to belong.'], byline: 'HOUSE OF GS · EST. IN THE MOUNTAINS', founders: 'GAZAL & SALONI / THE HEART OF HOGS' },
    booking: { eyebrow: 'THE MOUNTAINS ARE CALLING', heading: ['Let the mountains', 'welcome you.'], contact: 'A CONVERSATION IS A GOOD START', submit: 'Enquire About Your Stay', whatsapp: 'Continue on WhatsApp' },
    footer: { heading: ['Come for the mountains.', 'Stay for the feeling.'], credit: 'Made of mountains, stories & a little chai.' },
  },
  brand: 'HOGS', tagline: 'Of Himalayan Homes', location: 'Manali, Himachal Pradesh',
  hero: { title: 'Experience the Himalayas the HOGS Way', description: 'Welcome to HOGS – Of Himalayan Homes, a collection of thoughtfully crafted mountain stays in Manali. From scenic valley views to peaceful boutique retreats, every property is designed to bring you closer to the beauty of the Himalayas.', image: '/images/mountains.jpg' },
  staysIntro: 'Discover two unique experiences curated by HOGS. Whether you prefer panoramic valley views or a peaceful boutique escape surrounded by nature, our properties offer comfort, elegance, and authentic Himalayan hospitality.',
  properties: [
    { id: 'panorama', name: 'HOGS Panorama', subtitle: 'A front-row seat to the Himalayas.', description: 'Open your curtains to a different perspective. A mountain stay with panoramic valley views, and space to take it all in.', images: ['/images/stays/panorama.jpg', '/images/mountains.jpg'], highlights: ['Valley views', 'Manali', 'Himalayan hospitality'], price: null, roomCount: null, amenities: [] },
    { id: 'boutique', name: 'Boutique Stay by HOGS', subtitle: 'A little closer to nature. A little closer to yourself.', description: 'For the days that ask for a slower pace. Discover a peaceful boutique escape, surrounded by the beauty of the mountains.', images: ['/images/stays/boutique.jpg', '/images/stays/panorama.jpg'], highlights: ['Boutique escape', 'Nature all around', 'Slow living'], price: null, roomCount: null, amenities: [] },
  ],
  // TODO(owner): confirm these experience descriptions before launch; not an amenities list.
  features: [
    { number: '01', title: 'Views worth pausing for', text: 'Mountains that remind you to look up, breathe deep, and take your time.', icon: 'mountain', image: '/images/mountains.jpg', imageAlt: 'Illustrative snow-covered mountain peaks' },
    { number: '02', title: 'A rider’s kind of place', text: 'Born from a love of open roads and the people we meet along the way.', icon: 'road', image: '/images/valley.jpg', imageAlt: 'Illustrative valley on a mountain journey' },
    { number: '03', title: 'Room for connection', text: 'Shared stories, new friendships, and conversations without a clock.', icon: 'home', image: '/images/stays/boutique.jpg', imageAlt: 'Illustrative forest retreat' },
    { number: '04', title: 'The little rituals', text: 'A warm cup, a mountain morning, and nowhere else you need to be.', icon: 'cup', image: '/images/stays/panorama.jpg', imageAlt: 'Illustrative peaceful mountain morning' },
    { number: '05', title: 'Permission to slow down', text: 'Less on the itinerary. More in the moment.', icon: 'sun', image: '/images/valley.jpg', imageAlt: 'Illustrative quiet green valley' },
  ],
  gallery: [
    { src: '/images/mountains.jpg', alt: 'Layers of mountain ridges in soft Himalayan light', caption: 'A different kind of perspective' },
    { src: '/images/stays/boutique.jpg', alt: 'An illustrative woodland mountain retreat', caption: 'Somewhere to settle in' },
    { src: '/images/valley.jpg', alt: 'A mountain valley with forest and distant peaks', caption: 'Take the long way home' },
    { src: '/images/stays/panorama.jpg', alt: 'An illustrative peaceful mountain landscape', caption: 'Mornings, unhurried' },
  ],
  about: "HOGS (House of GS) was born from two souls who found freedom on open roads and comfort in conversations with strangers who soon became friends. Gazal and Saloni are riders at heart, always chasing mountains, stories, and moments that don't fit into plans. Somewhere between bike rides, shared sunsets, and chai conversations, they realised that travel isn't just about places, it's about people and vaataavaran.",
  storyLines: ['House of GS is not just a homestay.', "It's a feeling.", 'A place where riders rest without questions, travellers feel understood, and conversations flow as easily as mountain air.', "Here, you don't just stay. You arrive, you belong, and you carry the vaataavaran with you when you leave."],
  booking: "Whether you're planning a romantic getaway, family vacation, or peaceful retreat in the Himalayas, HOGS offers the perfect place to stay in Manali. Choose your property, pick your dates, and let the mountains welcome you.",
  email: 'info@hogsstays.com', phone: '+91 92511 15478', whatsapp: '919251115478', instagram: null as string | null,
  policies: [ { slug: 'privacy-policy', title: 'Privacy Policy' }, { slug: 'terms-and-conditions', title: 'Terms & Conditions' }, { slug: 'cancellation-refund-policy', title: 'Cancellation & Refund Policy' }, { slug: 'house-rules', title: 'House Rules / Guest Guidelines' }, { slug: 'faqs', title: 'FAQs' } ],
};

