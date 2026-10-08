import { test } from 'node:test';
import assert from 'node:assert/strict';
import { cafeFullName, legacyPolicySlugs, policyBySlug, policyPages, stayTerms, type PolicyBlock } from '../lib/policies';
import { allGuestFaqs, faqAnswerText, guestFaqGroups, guestFaqJsonLdFor } from '../lib/faqs';
import sitemap from '../app/sitemap';

const text = (blocks: PolicyBlock[]) => blocks.map(b => b.type === 'p' || b.type === 'note' ? b.text : b.type === 'ul' ? b.items.join(' ') : '').join(' ');
const all = (slug: string) => { const page = policyBySlug(slug)!; return `${page.intro} ${page.sections.map(s => `${s.title} ${text(s.blocks)}`).join(' ')} ${page.closing ?? ''}`; };

test('the five pages use the live-site slugs, each with a unique title and description', () => {
  assert.deepEqual(policyPages.map(p => p.slug), ['privacy-policy', 'terms-conditions', 'cancellation-refund-policy', 'house-rules-guest-guidelines', 'faqs']);
  assert.equal(new Set(policyPages.map(p => p.title)).size, 5); assert.equal(new Set(policyPages.map(p => p.description)).size, 5);
  for (const page of policyPages) { assert.ok(page.description.length > 80 && page.description.length < 200, page.slug); assert.match(page.lastUpdated, /^\d{4}-\d{2}-\d{2}$/); }
});
test('old slugs redirect to the new ones', () => assert.deepEqual(legacyPolicySlugs, { 'terms-and-conditions': 'terms-conditions', 'house-rules': 'house-rules-guest-guidelines' }));
test('payment, check-in and cancellation wording is the client\'s', () => {
  assert.deepEqual(stayTerms.payment.map(p => p.pct), ['40%', '30%', '30%']);
  assert.equal(stayTerms.checkIn, '2:00 PM'); assert.equal(stayTerms.checkOut, '10:00 AM');
  const terms = all('terms-conditions');
  for (const phrase of ['40% advance payment at the time of booking', '30% payment to be made 15 days prior to check-in', 'Remaining 30% payment to be cleared 24 hours before check-in', 'Cancellation more than 20 days before check-in – Partial refund may be applicable after deducting processing charges.', 'Cancellation within 15 days of check-in – Advance amount is non-refundable.', 'No-show or early departure – No refund will be provided.', 'from 23rd December to 1st January', 'within 7–10 working days', 'Quiet hours are observed after 10:30 PM.', `${cafeFullName}, our in-house café`, 'By booking with HOGS Stays, you acknowledge'])
    assert.ok(terms.includes(phrase), phrase);
  assert.equal(policyBySlug('terms-conditions')!.sections.length, 12);
  assert.equal(policyBySlug('privacy-policy')!.sections.length, 9);
  assert.equal(policyBySlug('cancellation-refund-policy')!.sections.length, 8);
});
test('house rules: nine rules, the emergency contact last, bold eviction phrase kept', () => {
  const rules = policyBySlug('house-rules-guest-guidelines')!.sections;
  assert.equal(rules.length, 9); assert.equal(rules[8].id, 'emergency-contact'); assert.ok(rules.every(r => r.icon));
  assert.ok(text(rules[3].blocks).includes('**immediate eviction without refund**'));
  assert.ok(text(rules[5].blocks).includes(`**${cafeFullName}**`));
});
test('FAQs: four groups, nine answers, ids usable as #deep-links, nothing from the house rules in "outside food"', () => {
  assert.deepEqual(guestFaqGroups.map(g => g.title), ['Booking & payments', 'Your stay', 'Café & food', 'Groups']);
  assert.deepEqual(allGuestFaqs.map(f => f.id), ['check-in', 'booking', 'payment', 'parking', 'pets', 'wifi', 'cafe', 'outside-food', 'groups']);
  assert.ok(allGuestFaqs.every(f => /^[a-z-]+$/.test(f.id)));
  const outside = allGuestFaqs.find(f => f.id === 'outside-food')!;
  assert.equal(faqAnswerText(outside.blocks), 'Outside food may be restricted in certain areas since we offer food services through our in-house café.');
  assert.ok(!/quiet|visitor|illegal|fire/i.test(faqAnswerText(outside.blocks)));
  const booking = text(allGuestFaqs.find(f => f.id === 'booking')!.blocks);
  assert.ok(booking.includes('(https://wa.me/919251115478)') && booking.includes('(/stays/panorama)'));
  assert.ok(text(allGuestFaqs.find(f => f.id === 'cafe')!.blocks).includes(`[${cafeFullName}](/cafe)`));
});
test('FAQPage JSON-LD has one question per FAQ with plain-text answers', () => {
  const ld = guestFaqJsonLdFor();
  assert.equal(ld.mainEntity.length, 9);
  assert.ok(ld.mainEntity.every(q => q.acceptedAnswer.text.length > 20 && !/\*\*|\]\(/.test(q.acceptedAnswer.text)));
});
test('the sitemap lists the five policy pages and the four room pages', () => {
  const urls = sitemap().map(e => e.url);
  for (const slug of policyPages.map(p => p.slug)) assert.ok(urls.some(u => u.endsWith(`/${slug}`)), slug);
  for (const id of ['valley-view', 'signature-view', 'premium', 'jacuzzi-room']) assert.ok(urls.some(u => u.endsWith(`/stays/panorama/${id}`)), id);
});
