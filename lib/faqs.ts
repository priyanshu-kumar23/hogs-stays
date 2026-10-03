import { packageHref, packageTitle, packages, type TourPackage } from './packages';
import { content } from './content';
// FAQs for the Manali journeys. Answers come only from the itineraries (lib/packages.ts) or existing site pages. Anything not known is
// a `todo` item written as "TODO(owner): confirm ...": it is HIDDEN in production builds (and left out of the FAQPage JSON-LD) until the
// owner replaces the todo with a real answer in `a`. `pending` marks a published answer that still needs one extra detail from the owner.
export type FaqCategory = 'About this journey' | 'Planning & seasons' | 'Stay & DO NTHNG' | 'Booking & policies';
export const faqCategories: FaqCategory[] = ['About this journey', 'Planning & seasons', 'Stay & DO NTHNG', 'Booking & policies'];
export type FaqItem = { id: string; category: FaqCategory; q: string; a: string[]; link?: { label: string; href: string }; todo?: string; pending?: string; tag?: string; shared: boolean };
const ask = 'Ask us for current details.';
const list = (items: string[]) => items.length < 2 ? items.join('') : `${items.slice(0, -1).join(', ')} and ${items[items.length - 1]}`;
const lower = (items: string[]) => items.map(item => item.toLowerCase());
const hasText = (pkg: TourPackage, re: RegExp) => pkg.itinerary.some(day => re.test(JSON.stringify(day).toLowerCase()));
const todo = (id: string, category: FaqCategory, q: string, note: string, tag?: string): FaqItem => ({ id, category, q, a: [], todo: `TODO(owner): confirm ${note}`, tag, shared: true });
const hasHigh = (pkg: TourPackage) => hasText(pkg, /atal tunnel|sethan|hamta/);

/** Every FAQ for one journey, in display order, including TODO items (hidden in production by `visibleFaqs`). */
export function faqsFor(pkg: TourPackage): FaqItem[] {
  const tag = packageTitle(pkg).replace(/\.$/, ''); const id = (key: string) => `${pkg.slug}:${key}`;
  const items: FaqItem[] = [
    { id: id('who'), category: 'About this journey', q: 'Who is this journey best for?', shared: false, tag,
      a: [`${tag} is best for ${list(lower(pkg.perfectFor))}. Its style: ${pkg.style}.`, pkg.summary] },
    { id: id('pace'), category: 'About this journey', q: 'How packed is each day?', shared: true, tag,
      a: ['Not very. Every HOGS journey opens with a slow arrival and closes with a slow morning, so the days in between are not stacked back to back. Some days are deliberately kept light, and the higher-mountain days stay flexible with the weather.', 'If you would like more or less on your days, say so in your enquiry and we will talk it through.'] },
    todo(id('customise'), 'About this journey', 'Can we customise the itinerary, skip a day, or combine packages?', 'whether guests can change days, skip a day or combine journeys, and how.', tag),
    todo(id('included'), 'About this journey', 'What is included: stay, meals, transport, guide?', 'what the journey price includes (stay, meals, transport, guide, entry fees).', tag),
  ];
  if (pkg.slug === 'manali-the-hogs-way') items.push({ id: id('offbeat'), category: 'About this journey', q: 'Which day is the offbeat day?', shared: false, tag, a: ['Day 3: Soyal Village, Sajla Waterfall and Hidden Manali, where you experience Manali beyond the usual checklist. Day 2 is the classic high-mountain circuit of Solang Valley, the Atal Tunnel and Sissu.'] });
  if (pkg.slug === 'hidden-manali-with-hogs') items.push({ id: id('done'), category: 'About this journey', q: 'We have already done the touristy Manali. Is this for us?', shared: false, tag, a: ['This is exactly the journey we recommend when a guest says, “We’ve already done the touristy Manali. Show us something different.” It stays with villages, waterfalls, forests and local experiences.'] });
  if (pkg.slug === 'waterfalls-forests-hidden-villages') items.push({ id: id('evening'), category: 'About this journey', q: 'Is there an optional evening with the hosts?', shared: false, tag, a: ['On Day 4, you can have an optional HOGS evening: a Bonfire & Community Table, or Coffee with the Hosts, subject to schedule and availability.'] });
  if (pkg.slug === 'complete-hogs-manali-experience') items.push({ id: id('everything'), category: 'About this journey', q: 'Is this the right pick for a first visit that covers everything?', shared: false, tag, a: ['Yes, that is what it is for. Over seven days it moves from the Manali classics to the high-mountain circuit, and then to Soyal, Sajla, Sethan, Hamta Valley, Naggar, Rumsu and Jana, with HOGS at both ends.'] });
  if (pkg.slug === 'slow-manali-by-hogs') items.push(todo(id('workation'), 'Stay & DO NTHNG', 'Is there Wi-Fi or a work-friendly space for a workation?', 'Wi-Fi and work-friendly spaces at HOGS Panorama for workation guests.', tag));
  // Planning & seasons
  const seasonal: string[] = [];
  if (hasText(pkg, /sethan|hamta/)) seasonal.push('In warmer months Sethan and Hamta Valley suit meadow and village walks; in winter the experience changes dramatically with snow, and Sethan is particularly known for winter snow activities.');
  if (hasText(pkg, /solang/)) seasonal.push('At Solang Valley, snow or adventure activities depend on the season.');
  seasonal.push('High-mountain days depend on weather and road conditions, so we keep them flexible. Share your travel dates and we will tell you what to expect.');
  items.push({ id: id('season'), category: 'Planning & seasons', q: 'What is the best time of year for this journey?', shared: true, tag, a: seasonal });
  if (hasHigh(pkg)) items.push({ id: id('roads'), category: 'Planning & seasons', q: 'What if the roads to the Atal Tunnel, Sissu or Sethan are closed?', shared: true, tag,
    a: ['These days are planned around road and weather conditions and are kept deliberately flexible: the itineraries describe the “accessible” sections and say the day depends on conditions.', `For what happens if a road is closed on your dates, ${ask.toLowerCase()}`], pending: 'TODO(owner): confirm the backup plan when roads to Atal Tunnel / Sissu / Sethan are closed (alternative day, refund, etc.).' });
  if (hasText(pkg, /hamta/)) items.push({ id: id('trek'), category: 'Planning & seasons', q: 'Is the Hamta day a trek?', shared: true, tag, a: ['No. You take short walks in the lower valley, with a short guided nature walk if you want more activity. It is not the full Hampta Pass trek.'] });
  if (hasText(pkg, /atal tunnel/)) items.push(todo(id('permits'), 'Planning & seasons', 'Do we need permits for the Atal Tunnel or Lahaul?', 'whether any permits or paperwork are needed for the Atal Tunnel / Lahaul day (do not state permit rules until checked).', tag));
  items.push(
    todo(id('kids'), 'Planning & seasons', 'Is this suitable for children and older travellers?', 'suitability for children and older travellers (comfort, walking effort, altitude).', tag),
    todo(id('pickup'), 'Planning & seasons', 'Do you arrange pickup from Bhuntar airport or the Volvo stand?', 'airport / bus-stand pickup arrangements and how to request them.', tag),
    { id: id('pack'), category: 'Planning & seasons', q: 'What should we pack?', shared: true, tag, a: ['Think layers. Comfortable walking shoes for village and forest paths, a light rain jacket, and warm layers for mornings, evenings and the higher days. In winter, add proper woollens and waterproof footwear for snow.'] },
  );
  // Stay & DO NTHNG
  items.push(
    { id: id('stay'), category: 'Stay & DO NTHNG', q: 'Where do we stay?', shared: true, tag, a: [`At HOGS Panorama, a mountain stay with panoramic valley views. Every night of the journey is spent there (${pkg.nights} nights), and the journey starts and ends at HOGS.`], link: { label: 'About HOGS Panorama', href: '/stays/panorama' } },
    { id: id('cafe'), category: 'Stay & DO NTHNG', q: 'What is DO NTHNG, and is it on the property?', shared: true, tag, a: ['Cafe DO NTHNG is the HOGS cafe: slow mornings, good coffee and zero agenda, surrounded by nature. These journeys use it to start and end the day, and the itineraries describe heading downstairs from HOGS Panorama to reach it.', `Opening details can change. ${ask}`], link: { label: 'Visit Cafe DO NTHNG', href: '/cafe' } },
  );
  // Booking & policies
  items.push(
    { id: id('price'), category: 'Booking & policies', q: 'What is the price?', shared: true, tag, a: ['Price on request. Share your dates and group size through the enquiry form, and we will send a quote.'], link: { label: 'Enquire about this journey', href: `${packageHref(pkg)}#enquire` } },
    { id: id('enquiry'), category: 'Booking & policies', q: 'Is an enquiry a confirmed booking?', shared: true, tag, a: ['No. Sending an enquiry does not confirm availability or a reservation. The team will share the applicable booking details and policies directly with you.'] },
    { id: id('cancel'), category: 'Booking & policies', q: 'What about cancellations and refunds?', shared: true, tag, a: ['Our Cancellation & Refund Policy is being finalised. Please contact us for the current terms before you book.'], link: { label: 'Cancellation & Refund Policy', href: '/cancellation-refund-policy' } },
  );
  const order = (item: FaqItem) => faqCategories.indexOf(item.category);
  return items.map((item, i) => ({ item, i })).sort((a, b) => order(a.item) - order(b.item) || a.i - b.i).map(entry => entry.item);
}

/** TODO items are shown only outside production, so the owner can see what is pending. */
export const visibleFaqs = (items: FaqItem[]) => items.filter(item => !item.todo || process.env.NODE_ENV !== 'production');
export const publishedFaqs = (items: FaqItem[]) => items.filter(item => !item.todo);
export const faqPending = (items: FaqItem[]) => items.flatMap(item => item.todo ? [`${item.q} — ${item.todo}`] : item.pending ? [`${item.q} — ${item.pending}`] : []);

/** Package-neutral version for /packages and /faqs: each shared question once, with generic answers. */
export function generalFaqs(): FaqItem[] {
  const id = (key: string) => `general:${key}`;
  const items: FaqItem[] = [
    { id: id('pace'), category: 'About this journey', q: 'How packed are the days?', shared: true, a: ['Not very. Every HOGS journey opens with a slow arrival and closes with a slow morning, and some days are deliberately kept light. Tell us in your enquiry how you would like the pace to feel.'] },
    todo(id('customise'), 'About this journey', 'Can we customise an itinerary, skip a day, or combine journeys?', 'whether guests can change days, skip a day or combine journeys, and how.'),
    todo(id('included'), 'About this journey', 'What is included: stay, meals, transport, guide?', 'what the journey prices include (stay, meals, transport, guide, entry fees).'),
    { id: id('season'), category: 'Planning & seasons', q: 'What is the best time of year?', shared: true, a: ['It depends on the journey. In warmer months Sethan and Hamta Valley suit meadow and village walks; in winter they change dramatically with snow. Solang’s snow and adventure activities depend on the season, and high-mountain days depend on weather and road conditions. Share your dates and we will tell you what to expect.'] },
    { id: id('roads'), category: 'Planning & seasons', q: 'What if a road to the Atal Tunnel, Sissu or Sethan is closed?', shared: true, a: ['Those days are planned around road and weather conditions and kept deliberately flexible.', `For what happens if a road is closed on your dates, ${ask.toLowerCase()}`], pending: 'TODO(owner): confirm the backup plan when roads to Atal Tunnel / Sissu / Sethan are closed.' },
    { id: id('trek'), category: 'Planning & seasons', q: 'Is the Hamta day a trek?', shared: true, a: ['No. You take short walks in the lower valley, with a short guided nature walk if you want more activity. It is not the full Hampta Pass trek.'] },
    todo(id('permits'), 'Planning & seasons', 'Do we need permits for the Atal Tunnel or Lahaul?', 'whether any permits or paperwork are needed for the Atal Tunnel / Lahaul day.'),
    todo(id('kids'), 'Planning & seasons', 'Are the journeys suitable for children and older travellers?', 'suitability for children and older travellers.'),
    todo(id('pickup'), 'Planning & seasons', 'Do you arrange pickup from Bhuntar airport or the Volvo stand?', 'airport / bus-stand pickup arrangements.'),
    { id: id('pack'), category: 'Planning & seasons', q: 'What should we pack?', shared: true, a: ['Think layers: comfortable walking shoes, a light rain jacket, and warm layers for mornings, evenings and the higher days. In winter, add proper woollens and waterproof footwear for snow.'] },
    { id: id('stay'), category: 'Stay & DO NTHNG', q: 'Where do we stay?', shared: true, a: ['At HOGS Panorama, every night. Each journey starts and ends at HOGS.'], link: { label: 'About HOGS Panorama', href: '/stays/panorama' } },
    { id: id('cafe'), category: 'Stay & DO NTHNG', q: 'What is DO NTHNG, and is it on the property?', shared: true, a: ['Cafe DO NTHNG is the HOGS cafe: slow mornings, good coffee and zero agenda, surrounded by nature. The journeys use it to start and end the day, and the itineraries describe heading downstairs from HOGS Panorama to reach it.'], link: { label: 'Visit Cafe DO NTHNG', href: '/cafe' } },
    { id: id('price'), category: 'Booking & policies', q: 'What do the journeys cost?', shared: true, a: ['Price on request. Share your dates and group size through the enquiry form on any journey, and we will send a quote.'], link: { label: 'See all journeys', href: '/packages' } },
    { id: id('enquiry'), category: 'Booking & policies', q: 'Is an enquiry a confirmed booking?', shared: true, a: ['No. Sending an enquiry does not confirm availability or a reservation. The team will share the applicable booking details and policies directly with you.'] },
    { id: id('cancel'), category: 'Booking & policies', q: 'What about cancellations and refunds?', shared: true, a: ['Our Cancellation & Refund Policy is being finalised. Please contact us for the current terms before you book.'], link: { label: 'Cancellation & Refund Policy', href: '/cancellation-refund-policy' } },
  ];
  const order = (item: FaqItem) => faqCategories.indexOf(item.category);
  return items.map((item, i) => ({ item, i })).sort((a, b) => order(a.item) - order(b.item) || a.i - b.i).map(entry => entry.item);
}
/** The /faqs page: the general answers, then each journey's own questions (tagged with its name). */
export const siteFaqs = (): FaqItem[] => [...generalFaqs(), ...packages.flatMap(pkg => faqsFor(pkg).filter(item => !item.shared))];
export const whatsappHref = (pkg?: TourPackage) => `https://wa.me/${content.whatsapp}?text=${encodeURIComponent(pkg ? `Hello HOGS! I have a question about the journey: ${packageTitle(pkg).replace(/\.$/, '')} (${pkg.nights}N/${pkg.days}D).` : 'Hello HOGS! I have a question about your Manali journeys.')}`;
export const faqJsonLd = (items: FaqItem[]) => ({ '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: publishedFaqs(items).map(item => ({ '@type': 'Question', name: item.q, acceptedAnswer: { '@type': 'Answer', text: item.a.join(' ') } })) });
