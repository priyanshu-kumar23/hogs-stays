// HOGS Panorama room categories. EDIT THIS FILE to fill in the real details.
// Any text starting with "TODO" is treated as "not filled in yet": the card hides it and shows a neutral line instead (see RoomsSection).
// `photos` are gallery subjects (public/images/hogs-panorama/<folder>/, see scripts/gallery-manifest.json); the first one is the hero.
// A room with no photos renders a "photos coming soon" placeholder card. Premium and Jacuzzi Suite have no photo folder yet:
// add public/images/hogs-panorama/premium/ and /jacuzzi-suite/ (via scripts/gallery-manifest.json + `npm run images`), then list them here.
export type Room = {
  id: string; name: string; tagline: string; photos: string[];
  description: string; amenities: string[]; occupancy: string; bedType: string; price: string;
};
const placeholders = (what: string) => ({ tagline: `TODO: one-line tagline for the ${what}`, description: `TODO: describe the ${what}`, amenities: ['TODO: amenity'], occupancy: 'TODO: occupancy', bedType: 'TODO: bed type', price: 'TODO: price' });
export const rooms: Room[] = [
  { id: 'valley-view', name: 'Valley View', photos: ['room-with-large-window-and-hillside-view', 'room-with-mountain-window', 'room-with-corner-windows-and-green-armchairs', 'room-with-balcony-door-and-bedside-table'], ...placeholders('Valley View room') },
  { id: 'signature-view', name: 'Signature View', photos: ['bedroom-floor-to-ceiling-valley-view', 'bedroom-with-valley-view', 'bedroom-with-balcony-door-and-mountain-view', 'bedroom-with-wardrobe-and-writing-table'], ...placeholders('Signature View room') },
  { id: 'premium', name: 'Premium', photos: [], ...placeholders('Premium room') },
  { id: 'jacuzzi-suite', name: 'Jacuzzi Suite', photos: [], ...placeholders('Jacuzzi Suite') },
];
export const isTodo = (value: string) => value.startsWith('TODO');
