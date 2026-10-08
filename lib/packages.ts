import { findImage } from './gallery';
import { packageImages, type PackageImageCredit, type PackageImageKey } from './packageImages.generated';
// Manali journeys. Itinerary text follows docs/HOGS itineraries.pdf (lightly edited for flow). No prices, distances, timings or
// activities are added beyond what that document says. Price is "on-request" everywhere until the owner decides otherwise.
export type PkgImage = { src: string; md: string; alt: string; caption: string; position: string; blur: string; ratio: number; og?: string; credit?: PackageImageCredit };
// A photo from public/images (local folders or downloaded, freely licensed web images); see public/images/packages/CREDITS.md.
export const web = (key: PackageImageKey, caption?: string): PkgImage => { const d = packageImages[key]; return { src: d.src, md: d.src, alt: d.alt, caption: caption ?? d.caption, position: d.position, blur: d.blur, ratio: d.width / d.height, credit: d.credit }; };
// A real HOGS Panorama photo from the gallery.
export const hogs = (subject: string, caption: string): PkgImage => { const g = findImage(subject); return { src: g.src, md: g.srcMd, alt: g.alt, caption, position: g.position, blur: g.blurDataURL, ratio: g.width / g.height, og: g.og }; };

export type CalloutKind = 'recommendation' | 'season' | 'addon' | 'note';
export type Callout = { kind: CalloutKind; text: string };
export const calloutLabels: Record<CalloutKind, string> = { recommendation: 'HOGS recommendation', season: 'Seasonal note', addon: 'Optional add-on', note: 'Good to know' };
export type PackageDay = {
  dayNumber: number; title: string;
  /** The day's route, in order, shown as "Place → Place → Place". */
  stops: string[]; narrative: string[];
  /** Named places on the day, each with a line of detail. */
  places?: { name: string; text?: string }[];
  /** Paragraphs after the places list. */
  closing?: string[]; callouts?: Callout[]; overnight?: string; image: PkgImage;
};
export type TourPackage = {
  slug: string; index: number; title: [string, string]; tagline: string; nights: number; days: number;
  perfectFor: string[]; style: string; summary: string; description: string;
  heroImage: PkgImage; cardImage: PkgImage; gallery: PkgImage[];
  /** 3-4 places for the card, and the full route revealed on hover. */
  highlights: string[]; route: string[];
  price: 'on-request'; startsEndsAt: string; itinerary: PackageDay[];
};
export const packageTitle = (pkg: TourPackage) => `${pkg.title[0]} ${pkg.title[1]}`.trim();
export const duration = (pkg: TourPackage) => `${pkg.nights}N / ${pkg.days}D`;
export const durationLong = (pkg: TourPackage) => `${pkg.nights} Nights / ${pkg.days} Days`;

const HOGS = 'HOGS Panorama';
const roerich: Callout = { kind: 'note', text: 'Timings vary. The Nicholas Roerich Art Gallery has listed visiting hours of 10 AM–5 PM on its operating days, so please check before visiting.' };
const winterSnow: Callout = { kind: 'season', text: 'In winter this becomes an entirely different snow experience. Sethan is particularly known for winter snow activities, while summer lends itself more to walks and meadows.' };

export const packages: TourPackage[] = [
  {
    slug: 'manali-the-hogs-way', index: 1, title: ['Manali,', 'the HOGS way.'], tagline: 'Manali’s classics, plus one proper offbeat day.', nights: 3, days: 4,
    perfectFor: ['First-time visitors', 'Couples', 'Short getaways'], style: 'Manali classics + one proper offbeat HOGS day',
    summary: 'A slow arrival, the classic high-mountain circuit, and one day that takes you beyond the usual checklist.',
    description: 'Three nights from HOGS Panorama: Manali’s classics without the rush, the Solang, Atal Tunnel and Sissu circuit, and one proper offbeat day among the forests and streams of Soyal and Sajla.',
    heroImage: hogs('balcony-with-mountain-and-orchard-view', 'FROM THE BALCONY AT HOGS PANORAMA'), cardImage: web('hadimba'),
    gallery: [web('hadimba'), web('solang'), web('sajla'), hogs('terrace-seating-by-glass-doors', 'MORNINGS, UNHURRIED')],
    highlights: ['Hadimba Devi Temple', 'Solang Valley', 'Atal Tunnel & Sissu', 'Soyal & Sajla'], route: ['Hadimba', 'Solang', 'Sissu', 'Soyal', 'Sajla'],
    price: 'on-request', startsEndsAt: HOGS,
    itinerary: [
      { dayNumber: 1, title: 'Arrival · Slow Manali · HOGS Experience', stops: [HOGS, 'Hadimba Devi Temple', 'Old Manali', 'Vashisht', 'Mall Road', 'Cafe DO NTHNG'], image: web('hadimba'),
        narrative: ['Arrive in Manali and check in at HOGS Panorama. Instead of immediately rushing out for sightseeing, settle into your room, take in the mountain views and begin the holiday at an easy pace.', 'Once refreshed, head out to explore some of Manali’s classics.'],
        places: [
          { name: 'Hadimba Devi Temple', text: 'Begin amidst the tall deodar forest surrounding the historic temple. Spend some time walking through Dhungri rather than treating it as just a quick photo stop.' },
          { name: 'Old Manali', text: 'Continue towards Old Manali for its little lanes, cafes, shops and laid-back mountain atmosphere.' },
          { name: 'Vashisht Village', text: 'Visit the traditional village, Vashisht Temple and the hot-water spring area before heading back towards town.' },
          { name: 'Mall Road', text: 'Keep the evening free for a leisurely stroll, local shopping and exploring central Manali.' },
        ],
        closing: ['Return to HOGS and unwind over dinner or coffee at Cafe DO NTHNG.'], overnight: HOGS },
      { dayNumber: 2, title: 'Solang Valley · Atal Tunnel · Sissu', stops: ['Solang Valley', 'Atal Tunnel', 'Sissu'], image: web('solang'),
        narrative: ['After breakfast, leave for the classic high-mountain circuit.', 'Drive towards Solang Valley, surrounded by dramatic mountain scenery. Continue towards the Atal Tunnel and cross into the contrasting landscapes of Lahaul.', 'On the other side, proceed towards Sissu. Spend time around the village, admire the waterfall from the valley and stop at scenic points rather than rushing from attraction to attraction.', 'Enjoy lunch during the excursion and gradually make your way back to Manali by evening. Spend the night relaxing at HOGS.'],
        callouts: [{ kind: 'season', text: 'Depending on the season, guests can opt for available snow or adventure activities at Solang.' }], overnight: HOGS },
      { dayNumber: 3, title: 'Soyal Village · Sajla Waterfall · Hidden Manali', stops: ['Soyal Village', 'Sajla Waterfall', 'Cafe DO NTHNG'], image: web('beas'),
        narrative: ['This is where guests get to experience Manali beyond the usual checklist.', 'After a relaxed breakfast, leave for Soyal (Soil) Village, surrounded by forests, streams, orchards and traditional village landscapes. Soyal has established walking routes and fits particularly well into an offbeat Manali itinerary. Spend some time walking around the village and enjoying the quieter surroundings.', 'Continue towards Sajla Waterfall. Take the forest approach towards the waterfall and spend some time by the water. This is less about ticking off a tourist attraction and more about slowing down among the trees.', 'Stop for a local lunch or chai before heading back. Instead of immediately returning to the room, end the day at Cafe DO NTHNG with coffee and sunset views.'], overnight: HOGS },
      { dayNumber: 4, title: 'Slow Morning at HOGS · Departure', stops: [HOGS, 'Cafe DO NTHNG'], image: hogs('terrace-seating-by-glass-doors', 'MORNINGS, UNHURRIED'),
        narrative: ['No sightseeing alarm today.', 'Wake up slowly, enjoy breakfast with mountain views and spend some time over coffee at Cafe DO NTHNG.', 'Check out with plenty of memories, and hopefully a reason to come back for the places you couldn’t fit into this trip.'] },
    ],
  },
  {
    slug: 'hidden-manali-with-hogs', index: 2, title: ['Hidden Manali', 'with HOGS.'], tagline: 'Villages, waterfalls and forests, away from the checklist.', nights: 4, days: 5,
    perfectFor: ['Repeat visitors', 'Offbeat travellers', 'Couples', 'Photographers'], style: 'Villages + waterfalls + forests + local experiences',
    summary: 'For guests who say, “We’ve already done the touristy Manali. Show us something different.”',
    description: 'Four nights of villages, waterfalls, forests and local experiences: Soyal and Sajla, Sethan and Hamta Valley, and the heritage side of the Kullu Valley at Naggar, Rumsu and Jana.',
    heroImage: web('beas'), cardImage: web('sethan'),
    gallery: [web('sajla'), web('sethan'), web('naggarCourtyard'), web('jana')],
    highlights: ['Soyal & Sajla', 'Sethan & Hamta Valley', 'Naggar & Roerich', 'Jana Waterfall'], route: ['Soyal', 'Sajla', 'Sethan', 'Naggar', 'Jana'],
    price: 'on-request', startsEndsAt: HOGS,
    itinerary: [
      { dayNumber: 1, title: 'Arrival · HOGS · Local Manali', stops: [HOGS, 'Hadimba Temple', 'Dhungri Forest', 'Old Manali', 'Cafe DO NTHNG'], image: web('hadimba'),
        narrative: ['Arrive and check in at HOGS Panorama.', 'After resting, explore Hadimba Temple and Dhungri Forest. Continue towards Old Manali for an easy walk through its lanes.', 'Rather than trying to cover everything on the first day, return to HOGS early. Spend your first mountain evening at Cafe DO NTHNG over coffee, food and views.'], overnight: HOGS },
      { dayNumber: 2, title: 'Soyal Village · Sajla Waterfall · Village Life', stops: ['Soyal Village', 'Sajla Village', 'Sajla Waterfall'], image: web('sajla'),
        narrative: ['After breakfast, leave the busier parts of Manali behind.', 'Begin at Soyal Village. Walk along village paths surrounded by orchards, forests and mountain streams. Take time for photography and explore the area on foot rather than remaining inside the vehicle.', 'Continue towards Sajla Village and then Sajla Waterfall. The Soyal and Sajla belt is particularly suitable for travellers wanting a peaceful short excursion rather than Manali’s heavily commercial sightseeing circuit.', 'Enjoy chai or a simple local meal along the way. Return to HOGS by evening.'],
        callouts: [{ kind: 'recommendation', text: 'Keep this day intentionally light. The charm is in spending time there rather than adding another five sightseeing points.' }] },
      { dayNumber: 3, title: 'Sethan · Hamta Valley · Pandu Ropa', stops: ['Prini', 'Sethan', 'Pandu Ropa', 'Hamta Valley'], image: web('hamta'),
        narrative: ['After breakfast, leave from Prini and begin climbing towards Hamta Valley. The road itself becomes part of the experience as Manali gradually disappears below.', 'Reach Sethan, a small mountain settlement at roughly 2,700 metres.'],
        places: [
          { name: 'Sethan Village', text: 'Walk around rather than simply stopping for photographs.' },
          { name: 'Pandu Ropa', text: 'Spend some time around the open landscapes and viewpoints accessible according to prevailing conditions.' },
          { name: 'Hamta Valley', text: 'Take a short nature walk around the lower valley instead of treating this as the full Hampta Pass trek.' },
        ],
        closing: ['Find a scenic spot for tea or a picnic-style break. Return to HOGS before dark.'],
        callouts: [{ kind: 'season', text: 'In warmer months, the surroundings lend themselves to meadow and village walks; in winter, the experience changes dramatically with snow.' }], overnight: HOGS },
      { dayNumber: 4, title: 'Naggar · Rumsu · Jana Village & Waterfall', stops: ['Naggar', 'Roerich Art Gallery', 'Rumsu Village', 'Jana Village', 'Jana Waterfall'], image: web('naggarCourtyard'),
        narrative: ['After breakfast, head towards the heritage side of the Kullu Valley.', 'Start around Naggar, once an important historic centre of the valley. Depending on current access, explore the heritage area and then visit the Nicholas Roerich Art Gallery.', 'Continue uphill towards Rumsu Village. Walk through the traditional settlement, admire the old architecture and experience a very different side of the valley. Rumsu is also naturally paired with Naggar in slow-travel itineraries.', 'Then drive towards Jana Village through pine forests and orchards. Visit Jana Waterfall, Jana Gaon. The waterfall is reached through a short walk from the road area, and Jana is also well known for local Himachali food around the waterfall.', 'Have a traditional-style lunch before returning towards Manali.'],
        callouts: [roerich], overnight: HOGS },
      { dayNumber: 5, title: 'Breakfast · Coffee · Departure', stops: [HOGS], image: hogs('window-seats-with-mountain-view', 'ONE LAST LOOK AT THE VALLEY'),
        narrative: ['Wake up without an itinerary.', 'Breakfast. Coffee. Views. Check-out.'],
        callouts: [{ kind: 'recommendation', text: 'This is the itinerary we’d recommend when a guest says: “We’ve already done the touristy Manali. Show us something different.”' }] },
    ],
  },
  {
    slug: 'slow-manali-by-hogs', index: 3, title: ['Slow Manali', 'by HOGS.'], tagline: 'Maximum experience, minimum rushing.', nights: 5, days: 6,
    perfectFor: ['Honeymooners', 'Couples', 'Workation guests', 'Slow travellers'], style: 'Maximum experience, minimum rushing',
    summary: 'A first day with one rule (do less), the classics taken slowly, and three quiet days into the forests, higher mountains and heritage villages.',
    description: 'Five nights built around not rushing: a first day that asks nothing of you, Manali’s classics at an easy pace, then Soyal and Sajla, Sethan and Hamta Valley, and Naggar, Rumsu and Jana.',
    heroImage: hogs('lounge-sofas-facing-valley-window', 'A SEAT FACING THE VALLEY'), cardImage: web('naggarBalcony'),
    gallery: [web('oldManali'), web('sajla'), web('hamta'), web('naggarBalcony')],
    highlights: ['Old Manali & Vashisht', 'Soyal & Sajla', 'Sethan & Hamta Valley', 'Naggar, Rumsu & Jana'], route: ['Hadimba', 'Soyal', 'Sethan', 'Naggar', 'Jana'],
    price: 'on-request', startsEndsAt: HOGS,
    itinerary: [
      { dayNumber: 1, title: 'Arrival · Cafe DO NTHNG', stops: [HOGS, 'Cafe DO NTHNG'], image: hogs('terrace-walkway-with-fairy-lights', 'ARRIVING AT HOGS PANORAMA'),
        narrative: ['This day has one rule: do less.', 'Check into HOGS Panorama, settle into your room and enjoy the property. Head downstairs to Cafe DO NTHNG for coffee and something to eat. Watch the mountains change colour as evening approaches.', 'No mandatory sightseeing. No rushing to Mall Road because “Day 1 needs to be utilised.”', 'Welcome to HOGS.'] },
      { dayNumber: 2, title: 'Manali Classics, Slowly', stops: ['Hadimba Devi Temple', 'Dhungri Forest', 'Old Manali', 'Vashisht', 'Mall Road'], image: web('oldManali'),
        narrative: ['After breakfast, begin with Hadimba Devi Temple. Walk through Dhungri Forest before continuing towards Old Manali.', 'Explore:'],
        places: [{ name: 'Old Manali lanes' }, { name: 'Manu Temple side' }, { name: 'Cafes and small shops' }, { name: 'Vashisht Village' }, { name: 'Vashisht Temple and hot-spring area' }],
        closing: ['End at Mall Road if you feel like shopping. Return to HOGS.'] },
      { dayNumber: 3, title: 'Soyal · Sajla · Forests & Waterfalls', stops: ['Soyal Village', 'Sajla'], image: web('beas'),
        narrative: ['Leave after breakfast for one of our favourite quieter Manali days.', 'First stop: Soyal Village. Walk beside streams and through the village surroundings. Spend some time simply sitting beside the water or walking through the forest.', 'Continue to Sajla and explore the waterfall area.', 'This isn’t meant to be a packed sightseeing day. Take photographs. Have chai. Find a quiet spot. Talk to locals where appropriate. Listen to the water.', 'Return by late afternoon. Spend sunset at HOGS.'] },
      { dayNumber: 4, title: 'Sethan & Hamta Valley', stops: ['Prini', 'Sethan', 'Hamta-side landscapes', 'Pandu Ropa'], image: web('sethan'),
        narrative: ['Today is for higher mountains.', 'Drive from Prini towards Sethan and Hamta Valley. Spend time exploring Sethan before moving towards the accessible Hamta-side landscapes and Pandu Ropa, depending on road and weather conditions.', 'Return to HOGS. Hot coffee afterwards is strongly recommended.'],
        callouts: [{ kind: 'addon', text: 'Guests wanting more activity can take a short guided walk; guests wanting a slow day can simply enjoy the scenery.' }, winterSnow] },
      { dayNumber: 5, title: 'Naggar · Rumsu · Jana', stops: ['Naggar', 'Roerich side', 'Rumsu Village', 'Jana Waterfall'], image: web('naggarCourtyard'),
        narrative: ['After breakfast, take the quieter road towards Naggar.', 'Explore the Naggar heritage area and Roerich side before heading towards Rumsu Village. Walk through Rumsu and then continue towards Jana.', 'At Jana, walk towards the waterfall and keep enough time for lunch. The drive itself passes through forest and orchard landscapes, making this a good full-day slow-travel circuit rather than simply a waterfall visit.', 'Return to Manali by evening.'], callouts: [roerich] },
      { dayNumber: 6, title: 'One Last Coffee', stops: [HOGS, 'Cafe DO NTHNG'], image: hogs('terrace-seating-by-glass-doors', 'MORNINGS, UNHURRIED'),
        narrative: ['Breakfast at HOGS. One last specialty coffee at Cafe DO NTHNG.', 'Take in the views you’ve probably started taking for granted. Check out and depart.'] },
    ],
  },
  {
    slug: 'waterfalls-forests-hidden-villages', index: 4, title: ['Waterfalls, Forests', '& Hidden Villages.'], tagline: 'Minimal mainstream sightseeing, maximum forest.', nights: 4, days: 5,
    perfectFor: ['Nature lovers', 'Photographers', 'Young travellers'], style: 'Minimal mainstream sightseeing',
    summary: 'Deodar walks, forest-trail waterfalls and village paths, with the town sightseeing left out on purpose.',
    description: 'Four nights for people who want trees, water and quiet: Dhungri Forest, Soyal and Sajla, Sethan and Hamta, and Naggar, Rumsu and Jana Waterfall.',
    heroImage: web('hamta'), cardImage: web('jana'),
    gallery: [web('jana'), web('sajla'), web('hamta'), web('naggarBalcony')],
    highlights: ['Dhungri Forest', 'Sajla Waterfall', 'Pandu Ropa', 'Jana Waterfall'], route: ['Soyal', 'Sajla', 'Sethan', 'Rumsu', 'Jana'],
    price: 'on-request', startsEndsAt: HOGS,
    itinerary: [
      { dayNumber: 1, title: 'Arrival · Dhungri Forest · HOGS', stops: [HOGS, 'Hadimba', 'Dhungri Forest'], image: web('hadimba'),
        narrative: ['Check in and rest.', 'Later, head towards Hadimba and Dhungri Forest. Instead of covering the entire town, spend time walking among the deodars.', 'Return to HOGS for a relaxed evening.'] },
      { dayNumber: 2, title: 'Soyal · Sajla Waterfall · Hidden Village Trails', stops: ['Soyal Village', 'Sajla Waterfall'], image: web('sajla'),
        narrative: ['Start after breakfast. Head first towards Soyal Village. Explore its quiet village paths, streams and surrounding forest.', 'Continue towards Sajla Waterfall. Take the forest walk, spend some time around the waterfall and enjoy a leisurely lunch or chai break.', 'Return to HOGS before evening.'] },
      { dayNumber: 3, title: 'Sethan · Hamta · Pandu Ropa', stops: ['Prini', 'Sethan', 'Hamta Valley', 'Pandu Ropa'], image: web('hamta'),
        narrative: ['Start a little earlier today.', 'Drive up from Prini towards Sethan. Explore the village and continue through the accessible sections of Hamta Valley.', 'Depending on the season and road conditions, spend time around Pandu Ropa or take a short guided nature walk. Have a picnic or tea break with the mountains around you.', 'Head back to HOGS.'] },
      { dayNumber: 4, title: 'Naggar · Rumsu · Jana Waterfall', stops: ['Naggar', 'Rumsu', 'Jana Waterfall'], image: web('jana'),
        narrative: ['After breakfast, leave for Naggar. Explore the heritage and art side of the village before proceeding towards Rumsu. Spend some time walking through the village before driving towards Jana.', 'At Jana, visit the waterfall and stop for local Himachali food. The waterfall lies roughly 11–12 km from Naggar and is surrounded by pine, deodar and orchard landscapes.', 'Return to HOGS for your final evening.'],
        callouts: [roerich, { kind: 'addon', text: 'Optional HOGS evening: Bonfire & Community Table, or Coffee with the Hosts, subject to schedule and availability.' }] },
      { dayNumber: 5, title: 'Slow Morning · Departure', stops: [HOGS], image: hogs('window-seats-with-mountain-view', 'ONE LAST LOOK AT THE VALLEY'),
        narrative: ['Enjoy breakfast and spend your last morning around HOGS.', 'No final-day sightseeing race. Check out and depart.'] },
    ],
  },
  {
    slug: 'complete-hogs-manali-experience', index: 5, title: ['The Complete', 'HOGS Manali Experience.'], tagline: 'Classics, offbeat, villages, mountains, and HOGS.', nights: 6, days: 7,
    perfectFor: ['Honeymooners', 'Families', 'First-time visitors'], style: 'Classics + offbeat + villages + mountains + HOGS',
    summary: 'For first-time Manali guests who want everything: the local classics, the high-mountain circuit, and the quieter valleys, with HOGS at both ends.',
    description: 'Six nights that cover Manali from famous to local: the town classics, Solang, Atal Tunnel and Sissu, Soyal and Sajla, Sethan and Hamta Valley, and Naggar, Rumsu and Jana.',
    heroImage: hogs('window-seats-with-mountain-view', 'WINDOW SEATS, MOUNTAIN VIEW'), cardImage: web('solang'),
    gallery: [web('solang'), web('mallRoad'), web('sajla'), web('naggarCourtyard'), web('sissu')],
    highlights: ['Solang & Sissu', 'Soyal & Sajla', 'Sethan & Hamta Valley', 'Naggar, Rumsu & Jana'], route: ['Hadimba', 'Solang', 'Sissu', 'Soyal', 'Sethan', 'Jana'],
    price: 'on-request', startsEndsAt: HOGS,
    itinerary: [
      { dayNumber: 1, title: 'Welcome to HOGS', stops: [HOGS, 'Cafe DO NTHNG'], image: hogs('terrace-walkway-with-fairy-lights', 'ARRIVING AT HOGS PANORAMA'),
        narrative: ['Arrive in Manali and check into HOGS Panorama. Freshen up and spend the rest of the afternoon around the property.', 'Coffee at Cafe DO NTHNG. Common spaces. Mountain views. A relaxed dinner.', 'The holiday starts slowly.'] },
      { dayNumber: 2, title: 'Manali Local', stops: ['Hadimba Devi Temple', 'Old Manali', 'Vashisht', 'Mall Road'], image: web('mallRoad'),
        narrative: ['After breakfast, explore:'],
        places: [
          { name: 'Hadimba Devi Temple', text: 'Visit the temple and walk through Dhungri Forest.' },
          { name: 'Old Manali', text: 'Explore the lanes, cafes and shops.' },
          { name: 'Vashisht', text: 'Visit the temple and hot-water spring area.' },
          { name: 'Mall Road', text: 'End the evening with shopping and a leisurely walk.' },
        ],
        closing: ['Return to HOGS.'] },
      { dayNumber: 3, title: 'Solang · Atal Tunnel · Sissu', stops: ['Solang Valley', 'Atal Tunnel', 'Sissu'], image: web('atal'),
        narrative: ['Leave after an early breakfast.', 'Head towards Solang Valley and enjoy the landscape and seasonal activities. Proceed through the Atal Tunnel towards Lahaul.', 'Explore Sissu, stop at scenic viewpoints and enjoy lunch before beginning the return journey. Reach HOGS by evening and rest.'] },
      { dayNumber: 4, title: 'Hidden Manali: Soyal & Sajla', stops: ['Soyal Village', 'Sajla Waterfall'], image: web('sajla'),
        narrative: ['Today, switch from famous Manali to local Manali.', 'Begin with Soyal Village. Walk around its streams, orchards and forest surroundings before continuing towards Sajla. Visit Sajla Waterfall and spend the afternoon enjoying the forest landscape.', 'Return to HOGS early enough for a relaxed evening.'] },
      { dayNumber: 5, title: 'Sethan & Hamta Valley', stops: ['Prini', 'Sethan Village', 'Hamta Valley', 'Pandu Ropa'], image: web('sethan'),
        narrative: ['After breakfast, drive up from Prini towards Sethan.', 'Explore:'],
        places: [{ name: 'Sethan Village' }, { name: 'Hamta Valley landscapes' }, { name: 'Pandu Ropa' }, { name: 'Accessible short trails and viewpoints, according to season' }],
        closing: ['Return to HOGS.'],
        callouts: [{ kind: 'season', text: 'This day should remain flexible, because the higher mountain experience changes significantly with snow, rain, road conditions and season.' }] },
      { dayNumber: 6, title: 'Naggar · Rumsu · Jana', stops: ['Naggar', 'Rumsu', 'Jana Village', 'Jana Waterfall', HOGS], image: web('naggarCourtyard'),
        narrative: ['Your final exploration day combines heritage, village life and nature.', 'Start around Naggar and visit the heritage and art side of the village. Continue to Rumsu, one of the quieter traditional settlements above Naggar.', 'Later, drive through forest and orchard landscapes towards Jana Village. Take the short walk towards Jana Waterfall and enjoy a Himachali-style lunch before beginning the drive back.', 'End the final evening where the trip began, at HOGS. Grab a coffee at Cafe DO NTHNG, sit in the common spaces or spend the evening talking to your hosts and fellow travellers.'], callouts: [roerich] },
      { dayNumber: 7, title: 'A HOGS Goodbye', stops: [HOGS], image: hogs('terrace-seating-by-glass-doors', 'MORNINGS, UNHURRIED'),
        narrative: ['Wake up slowly. Enjoy breakfast. Take those last mountain photographs. Grab one final coffee.', 'Check out and depart with a different picture of Manali than the one you arrived with.'] },
    ],
  },
];

export const getPackage = (slug: string) => packages.find(pkg => pkg.slug === slug);
export const otherPackages = (slug: string) => packages.filter(pkg => pkg.slug !== slug);
export const packageHref = (pkg: TourPackage) => `/packages/${pkg.slug}`;
export const allPerfectFor = Array.from(new Set(packages.flatMap(pkg => pkg.perfectFor)));
export const allNights = Array.from(new Set(packages.map(pkg => pkg.nights))).sort((a, b) => a - b);
// Journey copy in the site's voice (home section, listing, detail strip).
export const packageCopy = {
  eyebrow: 'JOURNEYS FROM HOGS', index: '03 — MANALI, BEYOND THE CHECKLIST', heading: ['Leave the checklist.', 'Keep the mountains.'] as const,
  intro: 'Five slow itineraries, each one starting and ending at HOGS Panorama. Fewer boxes ticked, more time by the water, in the villages, and over coffee.',
  allCta: 'View all journeys →', priceLabel: 'Price on request',
  strip: { eyebrow: 'WHAT MAKES THIS A HOGS JOURNEY', heading: ['Not a tour.', 'A way of travelling.'] as const, hindi: 'वातावरण', marquee: 'SLOW MORNINGS · OFFBEAT VILLAGES · COFFEE AT THE CAFE · TIME WITH THE HOSTS · ',
    items: [
      { n: '01', title: 'Slow mornings', text: 'No sightseeing alarm. Breakfast with mountain views comes before anything else.' },
      { n: '02', title: 'Offbeat villages', text: 'Orchards, forest paths and streams, explored on foot rather than from the window of a car.' },
      { n: '03', title: 'Coffee at the cafe', text: 'Days begin and end at Cafe DO NTHNG, right downstairs from your room.' },
      { n: '04', title: 'Time with the hosts', text: 'Evenings with the people of HOGS, over a warm cup and good conversation.' },
    ] },
};
