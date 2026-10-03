import { hogs, web, type PackageDay, type PkgImage, type TourPackage } from './packages';
// Places and activities along the Manali journeys. Each is defined ONCE here. Which packages and days it appears on is derived from the
// itinerary text in lib/packages.ts (see `test` on each entry), so editing an itinerary updates the Attractions section automatically.
// Facts come only from docs/HOGS itineraries.pdf or well-established general knowledge. No prices, distances, timings, fees, permit rules
// or operators are given: where a detail matters but is unknown the copy says "Ask us for current details".
export type AttractionType = 'Heritage & Temples' | 'Forests & Nature' | 'Villages' | 'Waterfalls' | 'High Mountains & Snow' | 'Adventure' | 'Town & Shopping' | 'Food & Coffee' | 'HOGS Experiences';
export const attractionTypes: AttractionType[] = ['Heritage & Temples', 'Forests & Nature', 'Villages', 'Waterfalls', 'High Mountains & Snow', 'Adventure', 'Town & Shopping', 'Food & Coffee', 'HOGS Experiences'];
/** Lower-cased text of one itinerary day (title, route, story, places, callouts), which entries are matched against. */
export type DayText = { text: string; stops: string };
export type Attraction = { slug: string; name: string; type: AttractionType; line: string; description: string; doBullets: string[]; season: string; tip: string; image: PkgImage; test: (day: DayText) => boolean };
export type Activity = { slug: string; label: string; note?: string; tag?: 'Seasonal' | 'Optional'; test: (day: DayText) => boolean };
const has = (re: RegExp) => (day: DayText) => re.test(day.text);
const ask = 'Ask us for current details.';

export const attractions: Attraction[] = [
  // ---- Heritage & Temples
  { slug: 'hadimba-devi-temple', name: 'Hadimba Devi Temple', type: 'Heritage & Temples', image: web('hadimba'), test: has(/hadimba/),
    line: 'A historic temple among tall deodars, best met on foot.',
    description: 'Hadimba Devi Temple stands in the tall deodar forest at Dhungri. On a HOGS journey it is never a quick photo stop: you walk through the forest around it, let the trees set the pace, and begin your Manali days slowly.',
    doBullets: ['Walk through the deodar forest around the temple', 'Spend time at Dhungri instead of rushing on', 'Begin your Manali days here, at an easy pace'],
    season: `The forest looks different in every season. ${ask}`, tip: 'Leave time to wander the forest, not just the temple steps.' },
  { slug: 'vashisht-temple-hot-spring', name: 'Vashisht Temple & hot-water spring area', type: 'Heritage & Temples', image: web('vashishtTemple'), test: has(/vashisht temple|hot[- ](water )?spring|vashisht: visit the temple/),
    line: 'A village temple beside a hot-water spring, on the way back to town.',
    description: 'In Vashisht village, the temple and the hot-water spring area are visited together before you head back towards town. It is a gentle stop, with a very different feel from the busy lanes of central Manali.',
    doBullets: ['Visit Vashisht Temple', 'See the hot-water spring area', 'Walk through the traditional village around it'],
    season: 'Warm water feels especially welcome on a cool day. Ask us for current details.', tip: 'Pair it with Old Manali and finish with a slow stroll on Mall Road.' },
  { slug: 'manu-temple-side', name: 'Manu Temple side', type: 'Heritage & Temples', image: web('manuTemple'), test: has(/manu temple/),
    line: 'The temple side of Old Manali, between lanes, cafes and small shops.',
    description: 'On the Slow Manali journey, the Old Manali wander includes the Manu Temple side. It is one stop in an unhurried afternoon of lanes, cafes and small shops, not a box to tick.',
    doBullets: ['Wander the lanes on the Manu Temple side', 'Stop at a cafe or a small shop', 'Keep it unhurried'], season: `A year-round stop; the mood shifts with the weather. ${ask}`, tip: 'Let it be one pause in a slow Old Manali afternoon.' },
  { slug: 'naggar-heritage-area', name: 'Naggar heritage area', type: 'Heritage & Temples', image: web('naggarCourtyard'), test: has(/naggar/),
    line: 'Once an important historic centre of the valley.',
    description: 'Naggar was once an important historic centre of the Kullu Valley. The journeys take the quieter road there and explore the heritage and art side of the village, depending on current access.',
    doBullets: ['Explore the heritage area, depending on current access', 'Visit the Roerich side of the village', 'Continue uphill to Rumsu village'], season: `Access to heritage areas can change. ${ask}`, tip: 'Naggar pairs naturally with Rumsu, so give them one slow day together.' },
  { slug: 'roerich-art-gallery', name: 'Nicholas Roerich Art Gallery', type: 'Heritage & Temples', image: web('roerich'), test: has(/roerich/),
    line: 'An art gallery on the heritage side of Naggar.',
    description: 'The Nicholas Roerich Art Gallery sits on the art side of Naggar village and is visited as part of the heritage day. It is a quiet stop between the old buildings and the walk up to Rumsu.',
    doBullets: ['Visit the gallery on the Roerich side of Naggar', 'Explore the heritage area around it', 'Walk on towards Rumsu'], season: 'Timings vary — check before visiting. The gallery has listed 10 AM–5 PM on its operating days.', tip: 'Check the day it is open before you plan the rest of the route.' },
  // ---- Forests & Nature
  { slug: 'dhungri-forest', name: 'Dhungri Forest', type: 'Forests & Nature', image: web('dhungri'), test: has(/dhungri/),
    line: 'Walk among the deodars instead of covering the whole town.',
    description: 'Dhungri is the deodar forest around Hadimba Devi Temple. The slow itineraries treat it as a walk, not a photo stop: wander among the tall trees, then return to HOGS for a relaxed evening.',
    doBullets: ['Walk among the deodars', 'Take your time instead of covering the entire town', 'Pair it with Hadimba Devi Temple'], season: `Pleasant to walk in every season. ${ask}`, tip: 'On a quieter day, let the forest be the whole plan.' },
  { slug: 'hamta-valley', name: 'Hamta Valley (lower valley walks)', type: 'Forests & Nature', image: web('hamta'), test: has(/hamta|hampta/),
    line: 'A short nature walk in the lower valley, not the Hampta Pass trek.',
    description: 'Above Prini the road climbs towards Hamta Valley, and Manali gradually disappears below. The journeys take a short nature walk around the lower valley. This is not the full Hampta Pass trek.',
    doBullets: ['Take a short nature walk around the lower valley', 'Add a short guided walk if you want more activity', 'Find a scenic spot for tea or a picnic-style break'], season: 'Warmer months suit meadow walks; in winter, snow changes everything. Access depends on road and weather conditions.', tip: 'Start a little earlier, and keep the day flexible.' },
  // ---- Villages
  { slug: 'old-manali', name: 'Old Manali', type: 'Villages', image: web('oldManali'), test: has(/old manali/),
    line: 'Little lanes, cafes, shops and a laid-back mountain mood.',
    description: 'Old Manali is the easy-walk side of town: little lanes, cafes, shops and a laid-back mountain atmosphere. On the HOGS journeys it is wandered, not rushed.',
    doBullets: ['Walk the lanes', 'Stop at the cafes and small shops', 'On the Slow Manali journey, add the Manu Temple side'], season: `A year-round stop. ${ask}`, tip: 'Keep it for the afternoon, and head back to HOGS before you are tired of it.' },
  { slug: 'vashisht-village', name: 'Vashisht Village', type: 'Villages', image: web('hotSpring', 'THE VASHISHT HOT-WATER SPRING BATHS'), test: has(/vashisht/),
    line: 'A traditional village with its temple and hot-water spring.',
    description: 'Vashisht is a traditional village visited alongside its temple and the hot-water spring area, before you head back towards town. It rounds off a day of Manali classics.',
    doBullets: ['Walk through the traditional village', 'Visit Vashisht Temple', 'See the hot-water spring area'], season: `A year-round stop. ${ask}`, tip: 'Go after Old Manali, and let it be the last stop before town.' },
  { slug: 'soyal-village', name: 'Soyal (Soil) Village', type: 'Villages', image: web('beas'), test: has(/soyal/),
    line: 'Forests, streams and orchards, with established walking routes.',
    description: 'Soyal (Soil) is surrounded by forests, streams, orchards and traditional village landscapes. It has established walking routes, which is why it fits so well into an offbeat Manali itinerary.',
    doBullets: ['Walk along the village paths', 'Sit beside the water or stroll through the forest', 'Take photographs on foot, not from the vehicle'], season: `Lovely to walk in the warmer months. ${ask}`, tip: 'Keep the day light: the charm is in spending time there.' },
  { slug: 'sajla-village', name: 'Sajla Village', type: 'Villages', image: web('sajla'), test: has(/sajla village/),
    line: 'The quiet village on the way to Sajla Waterfall.',
    description: 'On the Hidden Manali journey, Sajla Village comes between Soyal and the waterfall. The Soyal and Sajla belt suits travellers who want a peaceful short excursion rather than the heavily commercial sightseeing circuit.',
    doBullets: ['Stroll through the village', 'Continue on foot towards the waterfall', 'Stop for chai or a simple local meal'], season: `${ask}`, tip: 'Do not add more stops; keep this one slow.' },
  { slug: 'sethan-village', name: 'Sethan (~2,700 m)', type: 'Villages', image: web('sethan'), test: has(/sethan/),
    line: 'A small mountain settlement at roughly 2,700 metres.',
    description: 'Sethan is a small mountain settlement at roughly 2,700 metres, reached by climbing from Prini. In warmer months it lends itself to meadow and village walks, and the whole place changes with snow in winter.',
    doBullets: ['Walk around the village rather than only stopping for photographs', 'Enjoy the road as it climbs and Manali falls away', 'Have tea or a picnic-style break with the mountains around you'], season: 'Meadows and walks in warmer months; snow in winter. Access depends on road and weather conditions.', tip: 'Start a little earlier, and keep the day flexible.' },
  { slug: 'rumsu-village', name: 'Rumsu Village', type: 'Villages', image: web('naggarBalcony', 'CARVED TIMBER AT NAGGAR, WHICH RUMSU IS PAIRED WITH'), test: has(/rumsu/),
    line: 'One of the quieter traditional settlements above Naggar.',
    description: 'Rumsu is a traditional settlement above Naggar, and is naturally paired with Naggar in slow-travel itineraries. You walk through it and take in the old architecture, a very different side of the valley.',
    doBullets: ['Walk through the traditional settlement', 'Admire the old architecture', 'Pair it with a Naggar visit'], season: `A year-round stop. ${ask}`, tip: 'Take the uphill road slowly and leave time to simply walk.' },
  { slug: 'jana-village', name: 'Jana Village', type: 'Villages', image: web('beas', 'FOREST AND ORCHARD COUNTRY, KULLU VALLEY'), test: has(/\bjana\b/),
    line: 'Pine forests and orchards on the drive, waterfall at the end.',
    description: 'You reach Jana through pine and deodar forests and orchards. The village is also well known for its local Himachali food, which is part of why the day is a slow circuit and not just a waterfall visit.',
    doBullets: ['Enjoy the drive through forest and orchard landscapes', 'Walk down to Jana Waterfall', 'Keep enough time for a Himachali-style lunch'], season: `${ask}`, tip: 'Leave lunch time unhurried; it is half the reason to come.' },
  // ---- Waterfalls
  { slug: 'sajla-waterfall', name: 'Sajla Waterfall', type: 'Waterfalls', image: web('sajla'), test: has(/sajla/),
    line: 'A forest approach to the water, less a sight than a slow-down.',
    description: 'You take the forest approach towards Sajla Waterfall and spend some time by the water. It is less about ticking off a tourist attraction and more about slowing down among the trees.',
    doBullets: ['Take the forest walk to the waterfall', 'Sit by the water and listen', 'Have chai on the way back'], season: `Waterfalls look different through the year. ${ask}`, tip: 'Take photographs, find a quiet spot, and listen to the water.' },
  { slug: 'jana-waterfall', name: 'Jana Waterfall', type: 'Waterfalls', image: web('jana'), test: has(/jana waterfall|waterfall.*jana/),
    line: 'A short walk from the road, with local food nearby.',
    description: 'Jana Waterfall is reached through a short walk from the road area, among pine, deodar and orchard landscapes. Local Himachali food is a big part of the stop.',
    doBullets: ['Walk the short path from the road', 'Spend time by the waterfall', 'Have a traditional-style lunch before returning'], season: `${ask}`, tip: 'Keep enough time for lunch; it is part of the visit.' },
  { slug: 'sissu-waterfall', name: 'Sissu waterfall', type: 'Waterfalls', image: web('sissuFalls'), test: has(/waterfall from the valley/),
    line: 'Admired from the valley, one stop on the Lahaul side.',
    description: 'On the other side of the Atal Tunnel, you spend time around Sissu village and admire the waterfall from the valley. It is a stop to linger at, not rush past.',
    doBullets: ['Admire the waterfall from the valley', 'Spend time around the village', 'Stop at scenic points along the way'], season: 'Conditions on the Lahaul side depend on season and weather. Ask us for current details.', tip: 'Stop at scenic points instead of racing from one attraction to the next.' },
  // ---- High Mountains & Snow
  { slug: 'solang-valley', name: 'Solang Valley', type: 'High Mountains & Snow', image: web('solang'), test: has(/solang/),
    line: 'Dramatic mountain scenery, with seasonal snow and adventure activities.',
    description: 'Solang Valley is surrounded by dramatic mountain scenery and is the first stop on the classic high-mountain circuit. Depending on the season, guests can opt for available snow or adventure activities.',
    doBullets: ['Take in the landscape', 'Try seasonal snow or adventure activities, if you like', 'Continue towards the Atal Tunnel'], season: 'Snow and adventure activities depend on the season. Ask us for current details.', tip: 'Treat activities as optional; the view is enough on its own.' },
  { slug: 'atal-tunnel', name: 'Atal Tunnel', type: 'High Mountains & Snow', image: web('atal'), test: has(/atal tunnel/),
    line: 'The gateway from Manali into the contrasting landscapes of Lahaul.',
    description: 'You cross the Atal Tunnel to move from the Manali side into the contrasting landscapes of Lahaul. It is part of the classic high-mountain circuit.',
    doBullets: ['Cross into the landscapes of Lahaul', 'Notice how the scenery changes on the other side', 'Continue towards Sissu'], season: 'The high mountains depend on weather and road conditions. Ask us for current details.', tip: 'Do not rush the other side; the stops are the point.' },
  { slug: 'sissu-lahaul', name: 'Sissu & Lahaul', type: 'High Mountains & Snow', image: web('sissu'), test: has(/sissu/),
    line: 'A Lahaul village to wander, with scenic points and a slow lunch.',
    description: 'Beyond the Atal Tunnel you head towards Sissu and spend time around the village. You stop at scenic viewpoints and enjoy lunch before the return journey.',
    doBullets: ['Spend time around the village', 'Stop at scenic viewpoints', 'Enjoy lunch before the return journey'], season: 'Conditions vary with season, road and weather. Ask us for current details.', tip: 'Plan to be back at HOGS by evening, and keep the rest unhurried.' },
  { slug: 'pandu-ropa', name: 'Pandu Ropa', type: 'High Mountains & Snow', image: web('hamta'), test: has(/pandu ropa/),
    line: 'Open landscapes and viewpoints, as conditions allow.',
    description: 'Pandu Ropa is visited on the Sethan and Hamta day, around its open landscapes and viewpoints, depending on prevailing conditions. Whether you reach it depends on the season, the road and the weather.',
    doBullets: ['Spend time around the open landscapes', 'Enjoy the viewpoints accessible on the day', 'Take a short nature walk if conditions allow'], season: 'Depending on the season and road conditions. Ask us for current details.', tip: 'Keep the day flexible, because the higher mountains change with the weather.' },
  { slug: 'sethan-winter', name: 'Sethan in winter', type: 'High Mountains & Snow', image: web('sethan'), test: d => /sethan/.test(d.text) && /winter|snow/.test(d.text),
    line: 'The same road in winter becomes a snow day.',
    description: 'In winter, Sethan becomes an entirely different, snow-filled experience, and it is particularly known for winter snow activities. The climb from Prini is part of the story.',
    doBullets: ['Enjoy winter snow at Sethan', 'Try winter snow activities, if you like', 'Come back for hot coffee afterwards'], season: 'Winter and the snow season only. Access depends on road and weather conditions. Ask us for current details.', tip: 'Hot coffee afterwards is strongly recommended.' },
  // ---- Town & Shopping
  { slug: 'mall-road', name: 'Mall Road', type: 'Town & Shopping', image: web('mallRoad'), test: has(/mall road/),
    line: 'An evening stroll through central Manali.',
    description: 'Mall Road is the leisurely, central-Manali stop: a stroll, some local shopping, and a chance to see the town in the evening. It is kept free and optional, never a first-day obligation.',
    doBullets: ['Take a leisurely evening stroll', 'Browse local shops', 'Skip it entirely if you would rather rest'], season: `A year-round stop. ${ask}`, tip: 'Go if you feel like it; there is no rule that Day 1 has to be used up.' },
  // ---- Food & Coffee
  { slug: 'himachali-lunch-jana', name: 'Himachali lunch at Jana', type: 'Food & Coffee', image: web('jana', 'AROUND JANA WATERFALL, WHERE THE FOOD IS'), test: has(/himachali|traditional-style lunch/),
    line: 'Local Himachali food around the waterfall.',
    description: 'Jana is well known for local Himachali food around the waterfall. The journeys keep time for a traditional-style lunch before the drive back towards Manali.',
    doBullets: ['Sit down to a traditional-style lunch', 'Taste local Himachali food', 'Keep it unhurried before the drive back'], season: `${ask}`, tip: 'Leave enough time for lunch; do not squeeze it in.' },
  { slug: 'chai-soyal-sajla', name: 'Chai stops, Soyal & Sajla', type: 'Food & Coffee', image: web('sajla', 'ALONG THE TRAIL TOWARDS SAJLA'), test: d => /chai/.test(d.text) && /soyal|sajla/.test(d.text),
    line: 'Chai or a simple local meal along the forest route.',
    description: 'The Soyal and Sajla belt is made for chai and simple local meals along the way. They are stops to linger at, a warm cup and a quiet spot rather than a restaurant to find.',
    doBullets: ['Stop for chai', 'Have a simple local meal', 'Talk to locals where appropriate'], season: `${ask}`, tip: 'Find a quiet spot, and take your time over the cup.' },
  { slug: 'cafe-do-nthng', name: 'Cafe DO NTHNG', type: 'Food & Coffee', image: web('cafe'), test: has(/cafe do nthng/),
    line: 'Slow mornings, good coffee, zero agenda.',
    description: 'Cafe DO NTHNG is the HOGS cafe: slow mornings, good coffee and zero agenda, surrounded by nature. On these journeys it starts and ends the day, with coffee on arrival, sunset views and a last cup before you leave.',
    doBullets: ['Start a slow morning with coffee', 'Watch the mountains change colour at sunset', 'Take one last specialty coffee before you leave'], season: `Opening details can change. ${ask}`, tip: 'End an offbeat day here, with coffee and the sunset.' },
  // ---- HOGS Experiences
  { slug: 'hogs-panorama', name: 'HOGS Panorama', type: 'HOGS Experiences', image: hogs('bedroom-with-valley-view', 'HOGS PANORAMA, YOUR MOUNTAIN ADDRESS'), test: has(/hogs panorama/),
    line: 'Where every journey starts and ends.',
    description: 'HOGS Panorama is a mountain stay with panoramic valley views, and it is where every one of these journeys begins and ends. You come back to it each evening, to the views and the common spaces.',
    doBullets: ['Settle in and enjoy the property', 'Take in the mountain views', 'Spend evenings in the common spaces'], season: `${ask}`, tip: 'Give the first afternoon to the property before you head out.' },
  { slug: 'bonfire-community-table', name: 'Bonfire & Community Table / Coffee with the Hosts', type: 'HOGS Experiences', image: hogs('terrace-seating-at-night', 'THE TERRACE AT HOGS PANORAMA, AFTER DARK'), test: has(/bonfire/),
    line: 'An optional evening with the hosts, subject to availability.',
    description: 'On the Waterfalls, Forests & Hidden Villages journey, the last evening can include a Bonfire & Community Table or Coffee with the Hosts. It is optional, and subject to schedule and availability.',
    doBullets: ['Join the Bonfire & Community Table, or', 'Have Coffee with the Hosts', 'Spend the last evening in good company'], season: 'Optional, and subject to schedule and availability. Ask us for current details.', tip: 'Tell us in your enquiry if you would like this evening.' },
  { slug: 'slow-mornings', name: 'Slow mornings', type: 'HOGS Experiences', image: hogs('terrace-seating-by-glass-doors', 'MORNINGS, UNHURRIED'), test: has(/slow morning|wake up (slowly|without)|no sightseeing alarm|last morning/),
    line: 'No sightseeing alarm. Breakfast with mountain views.',
    description: 'Every journey ends with a slow morning: no sightseeing alarm, breakfast with mountain views and coffee before you check out. It is the day for last photographs and a reason to come back.',
    doBullets: ['Wake up without an itinerary', 'Enjoy breakfast with the mountain views', 'Take one final coffee and your last photographs'], season: `${ask}`, tip: 'Leave this morning empty on purpose.' },
];

export const activities: Activity[] = [
  { slug: 'solang-snow-adventure', label: 'Snow & adventure at Solang', tag: 'Seasonal', note: `Depending on the season. ${ask}`, test: d => /solang/.test(d.text) && /season|snow|adventure/.test(d.text) },
  { slug: 'village-forest-walks', label: 'Village & forest walks', test: has(/village paths|walking routes|walk(ing)? (around|through|beside|among|along)|on foot|walk around rather/) },
  { slug: 'waterfall-walks', label: 'Waterfall forest walks', test: d => /sajla|jana/.test(d.text) && /waterfall/.test(d.text) },
  { slug: 'photography', label: 'Photography', test: has(/photograph/) },
  { slug: 'hamta-guided-walks', label: 'Short guided nature walks, Hamta Valley', tag: 'Optional', note: `Optional. ${ask}`, test: has(/guided/) },
  { slug: 'picnic-tea-breaks', label: 'Picnic & tea breaks with mountain views', test: has(/picnic|tea break|scenic spot for tea/) },
  { slug: 'sethan-winter-snow', label: 'Winter snow at Sethan', tag: 'Seasonal', note: `Winter only. ${ask}`, test: d => /sethan/.test(d.text) && /winter|snow/.test(d.text) },
  { slug: 'summer-meadow-walks', label: 'Summer meadow walks', tag: 'Seasonal', note: 'Warmer months. Depends on conditions.', test: has(/meadow/) },
  { slug: 'local-food-chai', label: 'Local food & chai stops', test: has(/local (lunch|meal|food)|himachali|chai|traditional-style lunch/) },
  { slug: 'jana-lunch', label: 'Himachali lunch at Jana', test: d => /\bjana\b/.test(d.text) && /himachali|traditional-style lunch/.test(d.text) },
  { slug: 'sunset-coffee', label: 'Sunset coffee at DO NTHNG', test: d => /sunset/.test(d.text) && /cafe do nthng/.test(d.text) },
  { slug: 'bonfire-hosts', label: 'Bonfire with the hosts', tag: 'Optional', note: 'Optional, subject to schedule and availability.', test: has(/bonfire/) },
];

// ---- Derivation from the itineraries
export const dayText = (day: PackageDay): DayText => {
  const parts = [day.title, ...day.stops, ...day.narrative, ...(day.places ?? []).flatMap(p => [p.name, p.text ?? '']), ...(day.closing ?? []), ...(day.callouts ?? []).map(c => c.text), day.overnight ?? ''];
  return { text: parts.join(' ').toLowerCase(), stops: day.stops.join(' ').toLowerCase() };
};
export type DayRef = { n: number; title: string };
export type Placed<T> = { item: T; days: DayRef[] };
const place = <T extends { test: (d: DayText) => boolean }>(list: T[], pkg: TourPackage): Placed<T>[] => list
  .map(item => ({ item, days: pkg.itinerary.filter(day => item.test(dayText(day))).map(day => ({ n: day.dayNumber, title: day.title })) }))
  .filter(entry => entry.days.length > 0)
  .sort((a, b) => a.days[0].n - b.days[0].n || list.indexOf(a.item) - list.indexOf(b.item));
export const attractionsFor = (pkg: TourPackage) => place(attractions, pkg);
export const activitiesFor = (pkg: TourPackage) => place(activities, pkg);
export const attractionBySlug = (slug: string) => attractions.find(item => item.slug === slug);

/** Maps one stop in a day's route ("Hadimba Devi Temple") to the attraction it opens, if any. */
const stopRules: [RegExp, string][] = [
  [/^hogs panorama$/, 'hogs-panorama'], [/cafe do nthng/, 'cafe-do-nthng'], [/hadimba/, 'hadimba-devi-temple'], [/dhungri/, 'dhungri-forest'], [/old manali/, 'old-manali'],
  [/^vashisht( village)?$/, 'vashisht-village'], [/mall road/, 'mall-road'], [/solang/, 'solang-valley'], [/atal tunnel/, 'atal-tunnel'], [/sissu/, 'sissu-lahaul'],
  [/soyal/, 'soyal-village'], [/sajla waterfall|^sajla$/, 'sajla-waterfall'], [/sajla village/, 'sajla-village'], [/^sethan( village)?$/, 'sethan-village'], [/pandu ropa/, 'pandu-ropa'],
  [/hamta/, 'hamta-valley'], [/^naggar$/, 'naggar-heritage-area'], [/roerich/, 'roerich-art-gallery'], [/rumsu/, 'rumsu-village'], [/jana waterfall/, 'jana-waterfall'], [/jana/, 'jana-village'],
];
export const placeForStop = (stop: string) => { const text = stop.toLowerCase(); return stopRules.find(([re]) => re.test(text))?.[1]; };
