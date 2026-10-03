import { test } from 'node:test';
import assert from 'node:assert/strict';
import { packages } from '../lib/packages';
import { activities, activitiesFor, attractionBySlug, attractions, attractionsFor, placeForStop } from '../lib/attractions';
import { faqJsonLd, faqPending, faqsFor, generalFaqs, publishedFaqs, siteFaqs, visibleFaqs } from '../lib/faqs';
const pkg = (slug: string) => packages.find(item => item.slug === slug)!;
const daysOf = (slug: string, attraction: string) => attractionsFor(pkg(slug)).find(entry => entry.item.slug === attraction)?.days.map(day => day.n);
test('every attraction is defined once, fully written, and used by at least one itinerary day', () => {
  assert.equal(new Set(attractions.map(item => item.slug)).size, attractions.length);
  for (const item of attractions) {
    assert.ok(item.doBullets.length >= 2 && item.doBullets.length <= 4, `${item.slug} bullets`);
    const sentences = item.description.split(/(?<=[.!?])\s+/).length; assert.ok(sentences >= 2 && sentences <= 4, `${item.slug} sentences (${sentences})`);
    assert.ok(item.line && item.season && item.tip && item.image.alt && item.image.caption, `${item.slug} fields`);
    assert.ok(packages.some(p => attractionsFor(p).some(entry => entry.item.slug === item.slug)), `${item.slug} unused`);
  }
  for (const item of activities) assert.ok(packages.some(p => activitiesFor(p).some(entry => entry.item.slug === item.slug)), `${item.slug} unused`);
});
test('days are derived from the itineraries', () => {
  assert.deepEqual(daysOf('manali-the-hogs-way', 'hadimba-devi-temple'), [1]); assert.deepEqual(daysOf('manali-the-hogs-way', 'solang-valley'), [2]);
  assert.deepEqual(daysOf('manali-the-hogs-way', 'sissu-waterfall'), [2]); assert.deepEqual(daysOf('manali-the-hogs-way', 'cafe-do-nthng'), [1, 3, 4]);
  assert.equal(daysOf('manali-the-hogs-way', 'naggar-heritage-area'), undefined); assert.equal(daysOf('manali-the-hogs-way', 'hamta-valley'), undefined);
  assert.deepEqual(daysOf('hidden-manali-with-hogs', 'roerich-art-gallery'), [4]); assert.deepEqual(daysOf('hidden-manali-with-hogs', 'pandu-ropa'), [3]);
  assert.deepEqual(daysOf('slow-manali-by-hogs', 'manu-temple-side'), [2]); assert.deepEqual(daysOf('waterfalls-forests-hidden-villages', 'bonfire-community-table'), [4]);
  assert.equal(daysOf('hidden-manali-with-hogs', 'bonfire-community-table'), undefined);
  assert.deepEqual(daysOf('hidden-manali-with-hogs', 'sethan-winter'), [3]);
  assert.ok(activitiesFor(pkg('manali-the-hogs-way')).some(entry => entry.item.slug === 'solang-snow-adventure' && entry.days[0].n === 2));
  assert.ok(activitiesFor(pkg('waterfalls-forests-hidden-villages')).some(entry => entry.item.slug === 'bonfire-hosts'));
});
test('every linked route stop opens a place that is on that same day', () => {
  for (const p of packages) { const placed = attractionsFor(p); for (const day of p.itinerary) for (const stop of day.stops) { const slug = placeForStop(stop); if (!slug) continue; assert.ok(attractionBySlug(slug), `${stop} -> ${slug}`); assert.ok(placed.find(entry => entry.item.slug === slug)?.days.some(d => d.n === day.dayNumber), `${p.slug} day ${day.dayNumber}: ${stop} -> ${slug}`); } }
});
test('copy invents no prices, distances, fees or permit rules, and keeps the Roerich timings soft', () => {
  const text = JSON.stringify([attractions.map(({ test: _t, image: _i, ...rest }) => rest), activities.map(({ test: _t, ...rest }) => rest)]);
  assert.ok(!/₹|\brs\.?\s?\d|\$\d|\bkm\b|permit|\bfees?\b|ticket/i.test(text)); assert.ok(!/Do Nthng/.test(text));
  assert.match(attractionBySlug('roerich-art-gallery')!.season, /^Timings vary — check before visiting/);
  assert.match(attractionBySlug('hamta-valley')!.description, /not the full Hampta Pass trek/);
});
test('FAQ TODO items are hidden in production and never reach the FAQPage JSON-LD', () => {
  const all = [...packages.flatMap(faqsFor), ...generalFaqs()]; const before = process.env.NODE_ENV;
  assert.ok(all.some(item => item.todo));
  for (const item of all.filter(entry => entry.todo)) { assert.match(item.todo!, /^TODO\(owner\): confirm /); assert.deepEqual(item.a, []); }
  try {
    (process.env as Record<string, string>).NODE_ENV = 'production'; assert.ok(visibleFaqs(all).every(item => !item.todo));
    (process.env as Record<string, string>).NODE_ENV = 'development'; assert.ok(visibleFaqs(all).some(item => item.todo));
  } finally { (process.env as Record<string, string>).NODE_ENV = before as string; }
  for (const p of packages) { const ld = faqJsonLd(faqsFor(p)); assert.equal(ld['@type'], 'FAQPage'); assert.ok(ld.mainEntity.length >= 8); assert.ok(!JSON.stringify(ld).includes('TODO(owner)')); }
  assert.ok(faqPending(all).length > 0);
});
test('each journey has the expected FAQs, linked to existing pages, with price on request', () => {
  for (const p of packages) {
    const items = publishedFaqs(faqsFor(p)); const q = (re: RegExp) => items.find(item => re.test(item.q))!;
    assert.match(q(/price/).a.join(' '), /^Price on request/); assert.match(q(/DO NTHNG/).a.join(' '), /Cafe DO NTHNG/); assert.equal(q(/cancellations/).link?.href, '/cancellation-refund-policy');
    assert.match(q(/Where do we stay/).a.join(' '), new RegExp(`${p.nights} nights`));
  }
  assert.ok(!publishedFaqs(faqsFor(pkg('manali-the-hogs-way'))).some(item => /Hamta day/.test(item.q)));
  assert.match(publishedFaqs(faqsFor(pkg('hidden-manali-with-hogs'))).find(item => /Hamta day/.test(item.q))!.a.join(' '), /not the full Hampta Pass trek/);
  assert.ok(siteFaqs().length > generalFaqs().length);
});
