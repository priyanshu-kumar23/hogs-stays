import { test } from 'node:test';
import assert from 'node:assert/strict';
import { cafeStatusLabel, isCafeOpen, minutesInCafeZone } from '../lib/cafeHours';
import { cafeGeo, cafeHours, cafeMapEmbed, cafeMapLink, cafeMenu, cafeOpeningHoursSpec } from '../lib/content';

// Times are given in UTC; Asia/Kolkata is UTC+5:30 with no daylight saving.
const ist = (hh: number, mm: number) => new Date(Date.UTC(2026, 10, 12, hh, mm) - 5.5 * 3600e3);

test('open/closed is decided in Asia/Kolkata time', () => {
  assert.equal(isCafeOpen(ist(9, 30)), false);   // 9:30 AM
  assert.equal(isCafeOpen(ist(9, 59)), false);
  assert.equal(isCafeOpen(ist(10, 0)), true);    // opens 10:00
  assert.equal(isCafeOpen(ist(15, 0)), true);    // 3 PM
  assert.equal(isCafeOpen(ist(21, 59)), true);
  assert.equal(isCafeOpen(ist(22, 0)), false);   // closes 22:00
  assert.equal(isCafeOpen(ist(23, 30)), false);
  assert.equal(isCafeOpen(ist(0, 15)), false);   // just after midnight
  assert.equal(minutesInCafeZone(ist(15, 0)), 900);
});
test('the answer does not depend on the machine time zone (same instant, same result)', () => {
  const instant = new Date('2026-11-12T09:30:00Z'); // 3:00 PM IST
  assert.equal(isCafeOpen(instant), true);
  assert.equal(isCafeOpen(new Date('2026-11-12T04:00:00Z')), false); // 9:30 AM IST
});
test('labels', () => {
  assert.equal(cafeStatusLabel(true), 'Open now');
  assert.equal(cafeStatusLabel(false), 'Closed — opens at 10 AM');
});
test('cafe details live in lib/content.ts', () => {
  assert.equal(cafeHours.text, 'Open daily · 10 AM – 10 PM');
  assert.deepEqual(cafeOpeningHoursSpec.dayOfWeek, ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']);
  assert.equal(cafeOpeningHoursSpec.opens, '10:00'); assert.equal(cafeOpeningHoursSpec.closes, '22:00');
  assert.equal(cafeMapLink, 'https://maps.app.goo.gl/7RuArhr2pFA4V6Wj9');
  assert.equal(cafeMapEmbed, `https://www.google.com/maps?q=${cafeGeo.latitude},${cafeGeo.longitude}&z=17&output=embed`);
  assert.equal(cafeMenu.url, 'https://dinein.petpooja.com/qr/fkjin5o9m8/Lobby');
});
