import { test } from 'node:test';
import assert from 'node:assert/strict';
import { amenityLabels, canonicalRoomId, guestsLine, rooms } from '../lib/rooms';
import { findPanoramaView } from '../lib/gallery';

const room = (id: string) => rooms.find(item => item.id === id)!;
const standard = ['Balcony', 'Closet', 'Electric Kettle', 'TV', 'Complimentary Wi-Fi', 'Free parking'];

test('four rooms, named as in the booking engine', () => {
  assert.deepEqual(rooms.map(item => item.bookingName), ['HOGS Valley View Room', 'HOGS Signature View Room', 'HOGS Premium Room', 'HOGS Jacuzzi Room']);
  assert.deepEqual(rooms.map(item => item.id), ['valley-view', 'signature-view', 'premium', 'jacuzzi-room']);
});
test('guests, bed and amenities match the booking engine', () => {
  for (const id of ['valley-view', 'signature-view', 'premium']) {
    assert.equal(room(id).maxGuests, 3); assert.equal(room(id).bed, 'King');
    assert.deepEqual(room(id).amenities.map(a => amenityLabels[a]), standard);
  }
  const jacuzzi = room('jacuzzi-room');
  assert.equal(jacuzzi.maxGuests, 2); assert.equal(jacuzzi.bed, 'King');
  assert.deepEqual(jacuzzi.amenities.map(a => amenityLabels[a]), ['Jacuzzi', 'Balcony', 'Private bathroom', 'Electric Kettle', 'TV', 'Complimentary Wi-Fi', 'Free parking']);
  assert.equal(guestsLine(room('valley-view')), 'Up to 3 guests · King bed');
  assert.equal(guestsLine(jacuzzi), 'Up to 2 guests · King bed');
});
test('each photographed room has 4 real, processed photos with alt text; the Jacuzzi Room has none and a fallback cover', () => {
  for (const id of ['valley-view', 'signature-view', 'premium']) {
    assert.equal(room(id).photos.length, 4, id);
    for (const photo of room(id).photos) { const image = findPanoramaView(photo); assert.ok(image.alt.length > 40 && image.blurDataURL.startsWith('data:image/webp'), photo); assert.ok(image.src.includes(`/rooms/${id}/`), image.src); }
    assert.equal(new Set(room(id).photos).size, 4);
  }
  assert.deepEqual(room('jacuzzi-room').photos, []); assert.ok(room('jacuzzi-room').fallbackCover);
});
test('no prices and no leftover TODO text in anything shown to guests', () => {
  for (const item of rooms) assert.ok(!/TODO|₹|rs\.|price/i.test(`${item.name} ${item.description} ${item.amenities.join(' ')}`), item.id);
});
test('the old Jacuzzi Suite id still resolves', () => {
  assert.equal(canonicalRoomId('jacuzzi-suite'), 'jacuzzi-room');
  assert.equal(canonicalRoomId('jacuzzi-room'), 'jacuzzi-room'); assert.equal(canonicalRoomId('valley-view'), 'valley-view'); assert.equal(canonicalRoomId(null), '');
});
