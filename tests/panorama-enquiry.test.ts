import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildEnquiryText, cleanPhone, emptyEnquiry, firstInvalidStep, mailtoUrl, nightsBetween, validateStep, whatsappUrl, type EnquiryState } from '../lib/panoramaEnquiry';

const rooms = [{ id: 'valley-view', name: 'Valley View' }, { id: 'jacuzzi-suite', name: 'Jacuzzi Suite' }];
const today = '2026-11-01';
const valid: EnquiryState = { ...emptyEnquiry('jacuzzi-suite'), checkIn: '2026-11-12', checkOut: '2026-11-15', adults: 2, children: 0, occasions: ['Honeymoon'], name: 'Asha Rao', phone: '+91 98765 43210', email: '', message: 'Early check-in if possible' };

test('step 0 needs a real room or "not sure"', () => {
  assert.ok(validateStep(0, emptyEnquiry(), rooms, today).room);
  assert.ok(validateStep(0, emptyEnquiry('nope'), rooms, today).room);
  assert.deepEqual(validateStep(0, emptyEnquiry('valley-view'), rooms, today), {});
  assert.deepEqual(validateStep(0, emptyEnquiry('unsure'), rooms, today), {});
});

test('step 1 rejects past dates, check-out not after check-in, and out-of-range guests', () => {
  assert.ok(validateStep(1, { ...valid, checkIn: '2026-10-31' }, rooms, today).checkIn);
  assert.ok(validateStep(1, { ...valid, checkOut: '2026-11-12' }, rooms, today).checkOut);
  assert.ok(validateStep(1, { ...valid, checkOut: '2026-11-10' }, rooms, today).checkOut);
  assert.ok(validateStep(1, { ...valid, checkIn: '' }, rooms, today).checkIn);
  assert.ok(validateStep(1, { ...valid, adults: 0 }, rooms, today).adults);
  assert.ok(validateStep(1, { ...valid, adults: 11 }, rooms, today).adults);
  assert.ok(validateStep(1, { ...valid, children: 7 }, rooms, today).children);
  assert.deepEqual(validateStep(1, valid, rooms, today), {});
  assert.equal(nightsBetween('2026-11-12', '2026-11-15'), 3);
});

test('step 2: name and a 10-digit phone are required, email is optional but checked', () => {
  assert.ok(validateStep(2, { ...valid, name: ' ' }, rooms, today).name);
  assert.ok(validateStep(2, { ...valid, phone: '12345' }, rooms, today).phone);
  assert.ok(validateStep(2, { ...valid, email: 'not-an-email' }, rooms, today).email);
  assert.deepEqual(validateStep(2, { ...valid, email: 'a@b.co' }, rooms, today), {});
  assert.deepEqual(validateStep(2, valid, rooms, today), {});
  assert.equal(firstInvalidStep(valid, rooms, today), -1);
  assert.equal(firstInvalidStep({ ...valid, checkOut: '' }, rooms, today), 1);
});

test('phone input is cleaned to 10 digits, with +91 / 91 / 0 prefixes removed', () => {
  for (const raw of ['9876543210', '+91 98765 43210', '919876543210', '09876543210', '98765-43210']) assert.equal(cleanPhone(raw), '9876543210', raw);
});

test('the WhatsApp message has the agreed shape and is URL-encoded', () => {
  const text = buildEnquiryText(valid, rooms, 'HOGS Panorama');
  assert.equal(text, [
    "Hi HOGS! I'd like to enquire about HOGS Panorama.", 'Room: Jacuzzi Suite', 'Dates: 12 Nov 2026 → 15 Nov 2026 (3 nights)', 'Guests: 2 adults, 0 children',
    'Occasion: Honeymoon', 'Name: Asha Rao', 'Phone: +91 9876543210', 'Note: Early check-in if possible',
  ].join('\n'));
  const url = whatsappUrl('919251115478', text);
  assert.ok(url.startsWith('https://wa.me/919251115478?text='));
  assert.equal(decodeURIComponent(url.split('?text=')[1]), text);
  assert.ok(!url.includes('\n') && !url.includes(' '));
  assert.ok(mailtoUrl('info@hogsstays.com', 'Enquiry', text).startsWith('mailto:info@hogsstays.com?subject=Enquiry&body='));
});

test('optional lines are omitted and singular forms are used', () => {
  const text = buildEnquiryText({ ...valid, room: 'unsure', occasions: [], message: '', adults: 1, children: 1, email: 'a@b.co', checkOut: '2026-11-13' }, rooms, 'HOGS Panorama');
  assert.ok(text.includes('Room: Not sure yet'));
  assert.ok(text.includes('(1 night)') && text.includes('1 adult, 1 child'));
  assert.ok(text.includes('Email: a@b.co') && !text.includes('Occasion:') && !text.includes('Note:'));
});
