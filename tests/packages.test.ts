import { test } from 'node:test';
import assert from 'node:assert/strict';
import { packages, packageTitle } from '../lib/packages';
import { packageMeta } from '../lib/packageMeta';
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
