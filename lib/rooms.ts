// HOGS Panorama room categories. EDIT THIS FILE to change room details.
// Guests, bed and amenities are copied from the official Aiosell booking engine (https://be.aiosell.com/book/5b1f04b124): keep them in sync with it.
// `photos` are image ids from lib/cafeImages.generated.ts (scripts/cafe-images.json, category "rooms/<room-id>"); the first one is the cover.
// No prices are published here: rates and availability live in the booking engine.
export type Amenity = 'balcony' | 'closet' | 'kettle' | 'tv' | 'wifi' | 'parking' | 'jacuzzi' | 'bathroom';
/** Labels exactly as the booking engine shows them. */
export const amenityLabels: Record<Amenity, string> = {
  balcony: 'Balcony', closet: 'Closet', kettle: 'Electric Kettle', tv: 'TV', wifi: 'Complimentary Wi-Fi', parking: 'Free parking', jacuzzi: 'Jacuzzi', bathroom: 'Private bathroom',
};
export type Room = {
  id: string; name: string;
  /** The room's name in the booking engine (used in structured data). */
  bookingName: string;
  /** One short line for the menu and cards. */
  tagline: string;
  description: string; maxGuests: number; bed: string; amenities: Amenity[];
  /** Subtle per-room accent (CSS variable --room-accent on the room page and cards): chips, lines and hovers only. */
  accent: { name: string; color: string };
  /** object-position for the hero crop. */
  heroPosition?: string;
  photos: string[];
  /** Used only while a room has no photos of its own: a gallery subject shown with a "Photos coming soon" label. */
  fallbackCover?: string;
};
const standard: Amenity[] = ['balcony', 'closet', 'kettle', 'tv', 'wifi', 'parking'];
export const rooms: Room[] = [
  {
    id: 'valley-view', name: 'Valley View Room', bookingName: 'HOGS Valley View Room', tagline: 'Misty mountains beyond a wide window.', accent: { name: 'misty green', color: '#8fb8a0' }, maxGuests: 3, bed: 'King', amenities: standard,
    // TODO(owner): confirm the tagline and description wording (written from the photos only).
    description: 'A calm king-bed room with a wide window onto the misty mountains and a balcony just beyond the glass.',
    photos: [
      'hogs-panorama-manali-valley-view-room-bed-teal-armchairs-mountain-window', 'hogs-panorama-manali-valley-view-room-grey-headboard-wall-lights-balcony',
      'hogs-panorama-manali-valley-view-room-tv-armchairs-valley-window', 'hogs-panorama-manali-valley-view-room-wardrobe-tv-bed',
    ],
  },
  {
    id: 'signature-view', name: 'Signature View Room', bookingName: 'HOGS Signature View Room', tagline: 'Floor-to-ceiling glass onto the valley.', accent: { name: 'sky blue-grey', color: '#93abc2' }, maxGuests: 3, bed: 'King', amenities: standard,
    // TODO(owner): confirm this wording (written from the photos only).
    description: 'Wake up to the valley through floor-to-ceiling glass, with a balcony door and a cosy corner by the window.',
    photos: [
      'hogs-panorama-manali-signature-view-room-floor-to-ceiling-window-balcony-mountains', 'hogs-panorama-manali-signature-view-room-bed-wall-tv-valley-window',
      'hogs-panorama-manali-signature-view-room-bed-wall-lights-tray-ceiling', 'hogs-panorama-manali-signature-view-room-teal-armchairs-desk-mountain-window',
    ],
  },
  {
    id: 'premium', name: 'Premium Room', bookingName: 'HOGS Premium Room', tagline: 'Under a warm pitched timber ceiling.', accent: { name: 'warm timber amber', color: '#d29a52' }, maxGuests: 3, bed: 'King', amenities: standard,
    // TODO(owner): confirm this wording (written from the photos only).
    description: 'A king-bed room under a warm pitched timber ceiling, with a big window onto the town and the mountains.',
    photos: [
      'hogs-panorama-manali-premium-room-timber-ceiling-bed-window-armchairs', 'hogs-panorama-manali-premium-room-timber-ceiling-bed-wall-lights',
      'hogs-panorama-manali-premium-room-balcony-door-valley-view-armchairs', 'hogs-panorama-manali-premium-room-tv-armchairs-valley-window',
    ],
  },
  {
    id: 'jacuzzi-room', name: 'Jacuzzi Room', bookingName: 'HOGS Jacuzzi Room', tagline: 'A private jacuzzi, with the mountains beyond the glass.', accent: { name: 'deep wine plum', color: '#c0719b' }, maxGuests: 2, bed: 'King',
    amenities: ['jacuzzi', 'balcony', 'bathroom', 'kettle', 'tv', 'wifi', 'parking'],
    // TODO(owner): price. This site shows no prices: rates and availability are live in the booking engine (see the note at the top of this file).
    // If you want a "from ₹…" line on the Jacuzzi Room card and page, add a `priceFrom` field to the Room type and fill it in here.
    // TODO(owner): confirm this wording (written from the photos and your feature list).
    description: 'A king-bed room for two with an in-room jacuzzi, wooden interiors under a pitched timber ceiling, and a glass door to a private balcony with views of the mountains.',
    // The first photo is the cover (wide shot: jacuzzi with the mountain view). Jacuzzi shots first, then the bedroom and view shots.
    photos: [
      'hogs-panorama-manali-jacuzzi-lit-tub-mountain-view-window',
      'hogs-panorama-manali-jacuzzi-bubbling-lit-tub-bed-mountain-door',
      'hogs-panorama-manali-jacuzzi-king-bed-gable-window-mountains',
      'hogs-panorama-manali-jacuzzi-tub-timber-ceiling-mountain-view',
      'hogs-panorama-manali-jacuzzi-beside-king-bed-wood-panelled-wall',
      'hogs-panorama-manali-jacuzzi-and-king-bed-striped-throw-oval-mirror',
      'hogs-panorama-manali-jacuzzi-room-bed-tub-timber-wall',
      'hogs-panorama-manali-jacuzzi-room-foot-of-bed-tub-mirror',
      'hogs-panorama-manali-jacuzzi-room-tv-wall-green-armchairs-tub',
      'hogs-panorama-manali-jacuzzi-room-king-bed-tv-armchairs-valley-door',
      'hogs-panorama-manali-jacuzzi-room-king-bed-balcony-door-mountains',
      'hogs-panorama-manali-jacuzzi-room-green-armchairs-balcony-door-dusk',
      'hogs-panorama-manali-jacuzzi-room-armchair-balcony-door-himalayas',
    ],
    heroPosition: 'center 62%',
  },
];
export const guestsLine = (room: Room) => `Up to ${room.maxGuests} guests · ${room.bed} bed`;

/** Old ids that must keep working (deep links such as ?room=jacuzzi-suite#book and the #jacuzzi-suite anchor). */
export const roomAliases: Record<string, string> = { 'jacuzzi-suite': 'jacuzzi-room' };
export const canonicalRoomId = (id: string | null | undefined) => (id ? roomAliases[id] ?? id : '');
export const isTodo = (value: string) => value.startsWith('TODO');

export const roomHref = (id: string) => `/stays/panorama/${id}`;
export const roomById = (id: string) => rooms.find(room => room.id === id);
export const otherRooms = (id: string) => rooms.filter(room => room.id !== id);
/** Meal plans offered with a stay (names as in the booking engine). No prices are shown on this site: rates are live on the booking page. */
export const mealPlans = [
  { id: 'breakfast', title: 'Breakfast included' },
  { id: 'breakfast-dinner', title: 'Breakfast + Dinner included' },
] as const;
