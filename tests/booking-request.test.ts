import { test } from 'node:test';
import assert from 'node:assert/strict';
import { addDays, bookingEmailText, bookingMailto, bookingRequestSchema, bookingWhatsappMessage, defaultBooking, requestId, suggestRooms, validateStep, type BookingForm } from '../lib/enquiry';
import { packages } from '../lib/packages';
import { seasonNotes } from '../lib/faqs';
import { POST } from '../app/api/package-enquiry/route';
const form = (change: Partial<BookingForm> = {}): BookingForm => ({ ...defaultBooking('hidden-manali-with-hogs'), pace: 'slower', addons: ['bonfire', 'extra-night'], note: 'Skip Mall Road.', checkIn: '2099-11-12', adults: 2, children: 1, childAges: [6], rooms: 1, arrival: 'bike', name: 'Asha Singh', phone: '+91 98765 43210', email: 'asha@example.com', contactMethod: 'WhatsApp', occasion: 'Anniversary', dietary: 'Vegetarian', requests: 'Window room', consent: true, ...change });
const valid = { ...form(), requestId: 'HOGS-HMH-1234' };
test('check-out is worked out from the package length and request IDs follow the slug', () => {
  assert.equal(addDays('2099-11-12', 3), '2099-11-15'); assert.equal(addDays('2099-12-30', 4), '2100-01-03');
  assert.match(requestId('manali-the-hogs-way', 1234), /^HOGS-MHW-1234$/); assert.match(requestId('complete-hogs-manali-experience', 98765), /^HOGS-CHM-8765$/);
  assert.equal(suggestRooms(1), 1); assert.equal(suggestRooms(2), 1); assert.equal(suggestRooms(3), 2); assert.equal(suggestRooms(5), 3);
});
test('each step validates with friendly messages', () => {
  assert.deepEqual(validateStep(0, form()), {}); assert.deepEqual(validateStep(1, form()), {}); assert.deepEqual(validateStep(2, form()), {}); assert.deepEqual(validateStep(3, form()), {});
  assert.match(validateStep(1, form({ checkIn: '' })).checkIn, /check-in date/); assert.match(validateStep(1, form({ checkIn: '2000-01-01' })).checkIn, /past/);
  assert.deepEqual(validateStep(1, form({ flexible: true, checkIn: '', month: '2099-03' })), {}); assert.match(validateStep(1, form({ flexible: true, checkIn: '', month: '' })).month, /month/); assert.match(validateStep(1, form({ flexible: true, month: '2000-01' })).month, /passed/);
  assert.match(validateStep(2, form({ adults: 0 })).adults, /adult/); assert.ok(validateStep(2, form({ rooms: 0 })).rooms);
  const details = validateStep(3, form({ name: '', phone: '12345', email: 'nope', consent: false as unknown as true }));
  assert.ok(details.name && details.phone && details.email && details.consent);
});
test('the full request accepts a valid booking request and rejects bad ones, including the honeypot', () => {
  assert.equal(bookingRequestSchema.safeParse(valid).success, true);
  for (const change of [{ requestId: 'nope' }, { packageSlug: 'unknown' }, { pace: 'fast' }, { addons: ['spa'] }, { arrival: 'teleport' }, { website: 'spam' }, { consent: false }, { phone: '12345' }, { email: 'x' }, { children: 1, childAges: [1, 2] }, { checkIn: '' }, { contactMethod: 'Pigeon' }])
    assert.equal(bookingRequestSchema.safeParse({ ...valid, ...change }).success, false, JSON.stringify(change));
});
test('WhatsApp, mailto and email text carry every field and never claim a confirmed booking', () => {
  const data = form(); const text = bookingWhatsappMessage(data, 'HOGS-HMH-1234');
  for (const value of ['HOGS-HMH-1234', 'Hidden Manali with HOGS', 'Even slower', 'Bonfire & Community Table (subject to schedule & availability)', 'Extra night at HOGS Panorama', 'Skip Mall Road.', '12 Nov 2099 to 16 Nov 2099 (4 nights)', '2 adults, 1 child (ages 6)', 'Rooms: 1', 'Riding in on bikes', 'Asha Singh', '+91 98765 43210', 'asha@example.com', 'WhatsApp', 'Anniversary', 'Vegetarian', 'Window room', 'price on request']) assert.ok(text.includes(value), value);
  assert.match(bookingMailto(data, 'HOGS-HMH-1234', 'info@hogsstays.com'), /^mailto:info@hogsstays\.com\?subject=Booking%20request%20HOGS-HMH-1234/);
  assert.match(bookingEmailText(data, 'HOGS-HMH-1234'), /not a confirmed booking/i); assert.ok(!/confirmed!|you are booked/i.test(text));
  assert.match(bookingWhatsappMessage(form({ flexible: true, checkIn: '', month: '2099-03' }), 'HOGS-HMH-1234'), /Flexible, preferred month: March 2099/);
});
test('seasonal notes come from the itinerary and invent no dates', () => {
  for (const p of packages) { const notes = seasonNotes(p); assert.ok(notes.length > 0); assert.ok(!/\d{4}|january|february|closed from|closes/i.test(notes.join(' '))); }
  assert.ok(seasonNotes(packages.find(p => p.slug === 'manali-the-hogs-way')!).some(line => /Solang/.test(line)));
  assert.ok(seasonNotes(packages.find(p => p.slug === 'hidden-manali-with-hogs')!).some(line => /Sethan/.test(line)));
});
test('booking request endpoint validates transport and reports an honest unconfigured state', async () => {
  delete process.env.RESEND_API_KEY; process.env.NEXT_PUBLIC_SITE_URL = 'https://hogsstays.example';
  const request = (body: string, headers: Record<string, string> = {}) => new Request('https://hogsstays.example/api/package-enquiry', { method: 'POST', headers: { 'Content-Type': 'application/json', ...headers }, body });
  assert.equal((await POST(request('not-json'))).status, 400); assert.equal((await POST(request('{}'))).status, 400);
  assert.equal((await POST(request('{}', { 'Content-Type': 'text/plain' }))).status, 415); assert.equal((await POST(request('{}', { Origin: 'https://other.example' }))).status, 403);
  assert.equal((await POST(request('x'.repeat(13000)))).status, 413);
  const response = await POST(request(JSON.stringify(valid), { Origin: 'https://hogsstays.example' }));
  assert.equal(response.status, 503); assert.match((await response.json()).error, /WhatsApp/);
});
