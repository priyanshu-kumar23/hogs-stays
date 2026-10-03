// Light-weight index of the journeys, safe to import from client components (navbar menu, enquiry form) without pulling in the photo
// data in lib/packages.ts. tests/packages.test.ts keeps this in sync with lib/packages.ts.
export const packageMeta = [
  { slug: 'manali-the-hogs-way', name: 'Manali, the HOGS way', nights: 3, days: 4, tagline: 'Manali’s classics, plus one proper offbeat day.', preview: '/images/manali/Hadimba-Temple-1.png' },
  { slug: 'hidden-manali-with-hogs', name: 'Hidden Manali with HOGS', nights: 4, days: 5, tagline: 'Villages, waterfalls and forests, away from the checklist.', preview: '/images/packages/sethan/sethan-snow-valley.webp' },
  { slug: 'slow-manali-by-hogs', name: 'Slow Manali by HOGS', nights: 5, days: 6, tagline: 'Maximum experience, minimum rushing.', preview: '/images/packages/naggar/naggar-castle-balcony.webp' },
  { slug: 'waterfalls-forests-hidden-villages', name: 'Waterfalls, Forests & Hidden Villages', nights: 4, days: 5, tagline: 'Minimal mainstream sightseeing, maximum forest.', preview: '/images/packages/jana/jana-waterfall.webp' },
  { slug: 'complete-hogs-manali-experience', name: 'The Complete HOGS Manali Experience', nights: 6, days: 7, tagline: 'Classics, offbeat, villages, mountains, and HOGS.', preview: '/images/manali/Solang-Valley.png' },
] as const;
export const packageSlugs = packageMeta.map(item => item.slug) as unknown as [string, ...string[]];
export const packageLabel = (slug: string) => { const item = packageMeta.find(entry => entry.slug === slug); return item ? `${item.name} (${item.nights}N/${item.days}D)` : slug; };
