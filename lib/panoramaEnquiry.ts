// Pure logic for the HOGS Panorama enquiry panel (components/enquiry/BookingEnquiry.tsx): state, validation and the WhatsApp / email text.
// No React and no DOM in here so it can be unit-tested (tests/panorama-enquiry.test.ts).
export const OCCASIONS = ['Honeymoon', 'Family trip', 'Riders', 'Workation', 'Celebration'] as const;
export const UNSURE = 'unsure';
export const MAX_ADULTS = 10, MAX_CHILDREN = 6;
export const NOTE_MAX = 600;

export type EnquiryState = {
  room: string; // a room id, UNSURE, or '' (not chosen yet)
  checkIn: string; checkOut: string; // ISO yyyy-mm-dd, '' when empty
  adults: number; children: number; occasions: string[];
  name: string; phone: string; email: string; message: string;
};
export type EnquiryRoom = { id: string; name: string };
export type Errors = Partial<Record<'room' | 'checkIn' | 'checkOut' | 'adults' | 'children' | 'name' | 'phone' | 'email' | 'message', string>>;

export const emptyEnquiry = (room = ''): EnquiryState => ({ room, checkIn: '', checkOut: '', adults: 2, children: 0, occasions: [], name: '', phone: '', email: '', message: '' });

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const isIso = (value: string) => /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(Date.parse(`${value}T00:00:00Z`)) && new Date(`${value}T00:00:00Z`).toISOString().slice(0, 10) === value;
export const formatDate = (iso: string) => { const [y, m, d] = iso.split('-').map(Number); return `${d} ${MONTHS[m - 1]} ${y}`; };
export const nightsBetween = (from: string, to: string) => (isIso(from) && isIso(to) ? Math.round((Date.parse(`${to}T00:00:00Z`) - Date.parse(`${from}T00:00:00Z`)) / 86400000) : 0);
export const addDay = (iso: string, days = 1) => { const d = new Date(`${iso}T12:00:00Z`); d.setUTCDate(d.getUTCDate() + days); return d.toISOString().slice(0, 10); };

/** Keep digits only; drop a leading +91 / 91 / 0 when the number is longer than 10 digits, then cap at 10. */
export const cleanPhone = (raw: string) => {
  let digits = raw.replace(/\D/g, '');
  if (digits.length > 10 && digits.startsWith('91')) digits = digits.slice(2);
  else if (digits.length > 10 && digits.startsWith('0')) digits = digits.slice(1);
  return digits.slice(0, 10);
};

/** Errors for one step (0 room, 1 dates & guests, 2 details). `today` is an ISO date in India time. */
export function validateStep(step: number, state: EnquiryState, rooms: EnquiryRoom[], today: string): Errors {
  const errors: Errors = {};
  if (step === 0 && !(state.room === UNSURE || rooms.some(room => room.id === state.room))) errors.room = 'Choose a room, or tell us you’re not sure yet.';
  if (step === 1) {
    if (!isIso(state.checkIn)) errors.checkIn = 'Choose your check-in date.';
    else if (state.checkIn < today) errors.checkIn = 'Check-in can’t be in the past.';
    if (!isIso(state.checkOut)) errors.checkOut = 'Choose your check-out date.';
    else if (isIso(state.checkIn) && state.checkOut <= state.checkIn) errors.checkOut = 'Check-out must be after check-in.';
    if (!Number.isInteger(state.adults) || state.adults < 1 || state.adults > MAX_ADULTS) errors.adults = `Adults: 1 to ${MAX_ADULTS}.`;
    if (!Number.isInteger(state.children) || state.children < 0 || state.children > MAX_CHILDREN) errors.children = `Children: 0 to ${MAX_CHILDREN}.`;
  }
  if (step === 2) {
    if (state.name.trim().length < 2) errors.name = 'Please enter your name.';
    if (cleanPhone(state.phone).length !== 10) errors.phone = 'Enter a 10-digit mobile number.';
    if (state.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(state.email.trim())) errors.email = 'That email doesn’t look right.';
    if (state.message.length > NOTE_MAX) errors.message = `Keep it under ${NOTE_MAX} characters.`;
  }
  return errors;
}
export const validateAll = (state: EnquiryState, rooms: EnquiryRoom[], today: string) => [0, 1, 2].map(step => validateStep(step, state, rooms, today));
/** First step that has an error, or -1. */
export const firstInvalidStep = (state: EnquiryState, rooms: EnquiryRoom[], today: string) => validateAll(state, rooms, today).findIndex(errors => Object.keys(errors).length > 0);

const plural = (n: number, one: string, many = `${one}s`) => `${n} ${n === 1 ? one : many}`;
export const roomLabel = (state: EnquiryState, rooms: EnquiryRoom[]) => (state.room === UNSURE ? 'Not sure yet, would love your help choosing' : rooms.find(room => room.id === state.room)?.name ?? '');
export const datesLabel = (state: EnquiryState) => { const nights = nightsBetween(state.checkIn, state.checkOut); return `${formatDate(state.checkIn)} → ${formatDate(state.checkOut)} (${plural(nights, 'night')})`; };
export const guestsLabel = (state: EnquiryState) => `${plural(state.adults, 'adult')}, ${plural(state.children, 'child', 'children')}`;

/** The text sent on WhatsApp / email. Optional lines (occasion, email, note) are left out when empty. */
export function buildEnquiryText(state: EnquiryState, rooms: EnquiryRoom[], propertyName: string) {
  const lines = [
    `Hi HOGS! I'd like to enquire about ${propertyName}.`,
    `Room: ${roomLabel(state, rooms)}`,
    `Dates: ${datesLabel(state)}`,
    `Guests: ${guestsLabel(state)}`,
    ...(state.occasions.length ? [`Occasion: ${state.occasions.join(', ')}`] : []),
    `Name: ${state.name.trim()}`,
    `Phone: +91 ${cleanPhone(state.phone)}`,
    ...(state.email.trim() ? [`Email: ${state.email.trim()}`] : []),
    ...(state.message.trim() ? [`Note: ${state.message.trim()}`] : []),
  ];
  return lines.join('\n');
}
export const whatsappUrl = (number: string, text: string) => `https://wa.me/${number}?text=${encodeURIComponent(text)}`;
export const mailtoUrl = (email: string, subject: string, text: string) => `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(text)}`;
