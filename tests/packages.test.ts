import { test } from 'node:test';
import assert from 'node:assert/strict';
import { packages, packageTitle } from '../lib/packages';
import { packageMeta } from '../lib/packageMeta';
import { enquirySchema, enquiryWhatsappMessage, enquiryMailto } from '../lib/enquiry';
import { POST } from '../app/api/package-enquiry/route';
const valid = { name: 'Asha Singh', phone: '+91 98765 43210', email: 'asha@example.com', flexible: false, from: '2099-01-01', to: '2099-01-05', adults: 2, children: 1, packageSlug: 'hidden-manali-with-hogs', message: 'Travelling with a toddler.', contactMethod: 'WhatsApp' as const, website: '' };
test('light package index matches the full package data', () => {
  assert.equal(packageMeta.length, packages.length);
  packages.forEach((pkg, i) => { const meta = packageMeta[i]; assert.equal(meta.slug, pkg.slug); assert.equal(meta.name, packageTitle(pkg).replace(/\.$/, '')); assert.equal(meta.nights, pkg.nights); assert.equal(meta.days, pkg.days); assert.equal(meta.tagline, pkg.tagline); assert.equal(meta.preview, pkg.cardImage.src); });
});
test('every package has one itinerary day per day, numbered in order, and price on request', () => {
  assert.deepEqual(packages.map(pkg => `${pkg.nights}N/${pkg.days}D`), ['3N/4D', '4N/5D', '5N/6D', '4N/5D', '6N/7D']);
  for (const pkg of packages) { assert.equal(pkg.price, 'on-request'); assert.equal(pkg.itinerary.length, pkg.days); pkg.itinerary.forEach((day, i) => assert.equal(day.dayNumber, i + 1)); assert.ok(pkg.highlights.length >= 3 && pkg.highlights.length <= 4); }
});
test('the cafe is spelled the way the site spells it', () => {
  const text = JSON.stringify(packages);
  assert.ok(!/Do Nthng|Café|Himalayan Brew/.test(text));
  assert.ok(text.includes('Cafe DO NTHNG'));
});
test('Roerich hours are never promised', () => { for (const pkg of packages) for (const day of pkg.itinerary) for (const callout of day.callouts ?? []) if (callout.text.includes('10 AM')) assert.match(callout.text, /vary|check/i); });
test('enquiry accepts a valid enquiry and includes every field in the WhatsApp text and mailto', () => {
  const parsed = enquirySchema.safeParse(valid); assert.equal(parsed.success, true);
  const data = parsed.data!; const text = enquiryWhatsappMessage(data);
  for (const value of ['Hidden Manali with HOGS', 'Asha Singh', '+919876543210', 'asha@example.com', '2099-01-01 to 2099-01-05', '2 adults, 1 child', 'WhatsApp', 'toddler']) assert.ok(text.includes(value), value);
  assert.match(enquiryMailto(data, 'info@hogsstays.com'), /^mailto:info@hogsstays\.com\?subject=/);
});
test('enquiry accepts flexible dates and rejects bad dates, phones, packages and honeypot', () => {
  assert.equal(enquirySchema.safeParse({ ...valid, flexible: true, from: '', to: '' }).success, true);
  for (const change of [{ from: '' }, { to: '2098-12-31' }, { from: '2000-01-01' }, { phone: '12345' }, { email: 'nope' }, { adults: 0 }, { packageSlug: 'unknown' }, { website: 'spam' }, { contactMethod: 'Pigeon' }]) assert.equal(enquirySchema.safeParse({ ...valid, ...change }).success, false, JSON.stringify(change));
});
test('package enquiry endpoint validates transport and reports an honest unconfigured state', async () => {
  delete process.env.RESEND_API_KEY; process.env.NEXT_PUBLIC_SITE_URL = 'https://hogsstays.example';
  const request = (body: string, headers: Record<string, string> = {}) => new Request('https://hogsstays.example/api/package-enquiry', { method: 'POST', headers: { 'Content-Type': 'application/json', ...headers }, body });
  assert.equal((await POST(request('not-json'))).status, 400);
  assert.equal((await POST(request('{}'))).status, 400);
  assert.equal((await POST(request('{}', { 'Content-Type': 'text/plain' }))).status, 415);
  assert.equal((await POST(request('{}', { Origin: 'https://other.example' }))).status, 403);
  assert.equal((await POST(request('x'.repeat(9000)))).status, 413);
  const response = await POST(request(JSON.stringify(valid), { Origin: 'https://hogsstays.example' }));
  assert.equal(response.status, 503); assert.match((await response.json()).error, /WhatsApp/);
});
