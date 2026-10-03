import { z } from 'zod';
import { indianPhone, todayInIndia } from './booking';
import { packageLabel, packageMeta, packageSlugs } from './packageMeta';
// "Request to book" for a journey: shared by the multi-step sheet (client) and /api/package-enquiry (server). Nothing here confirms or
// charges anything: it is a request that HOGS answers with availability and a personalised quote (price is always "on request").
export const paces = [{ id: 'as-planned', label: 'Keep it as planned' }, { id: 'slower', label: 'Even slower: fewer stops' }, { id: 'customise', label: 'Customise with us' }] as const;
export const addons = [
  { id: 'bonfire', label: 'Bonfire & Community Table', note: 'Subject to schedule & availability' },
  { id: 'coffee-hosts', label: 'Coffee with the Hosts', note: 'Subject to schedule & availability' },
  { id: 'extra-night', label: 'Extra night at HOGS Panorama', note: 'Subject to availability' },
] as const;
export const arrivals = [{ id: 'bus', label: 'Volvo / bus to Manali' }, { id: 'vehicle', label: 'Own vehicle' }, { id: 'bike', label: 'Riding in on bikes' }, { id: 'flight', label: 'Flight to Bhuntar' }, { id: 'unsure', label: 'Not sure yet' }] as const;
export const occasions = ['None', 'Honeymoon', 'Anniversary', 'Birthday', 'Other'] as const;
export const contactMethods = ['WhatsApp', 'Call', 'Email'] as const;
const ids = <T extends readonly { id: string }[]>(list: T) => list.map(item => item.id) as unknown as [T[number]['id'], ...T[number]['id'][]];

const date = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Choose a valid date').refine(value => { const parsed = new Date(`${value}T00:00:00Z`); return !Number.isNaN(parsed.getTime()) && parsed.toISOString().slice(0, 10) === value; }, 'Choose a valid date');
const month = z.string().regex(/^\d{4}-(0[1-9]|1[0-2])$/, 'Choose a month');
/** ISO date + n days (UTC, so no timezone drift). */
export const addDays = (iso: string, days: number) => { const d = new Date(`${iso}T12:00:00Z`); d.setUTCDate(d.getUTCDate() + days); return d.toISOString().slice(0, 10); };
/** Rooms we suggest for a party: two adults per room. Children share. The guest can change it. */
export const suggestRooms = (adults: number) => Math.max(1, Math.ceil(adults / 2));
export const requestId = (slug: string, now = Date.now()) => {
  const initials = slug.split('-').filter(word => !['the', 'by', 'with', 'and'].includes(word)).slice(0, 3).map(word => word[0].toUpperCase()).join('');
  return `HOGS-${initials}-${String(now % 10000).padStart(4, '0')}`;
};

const step1 = { packageSlug: z.enum(packageSlugs, { error: 'Please choose a journey' }), pace: z.enum(ids(paces)), addons: z.array(z.enum(ids(addons))).max(3), note: z.string().trim().max(600, 'Keep this under 600 characters') };
const step2 = { flexible: z.boolean(), checkIn: z.union([date, z.literal('')]), month: z.union([month, z.literal('')]) };
const step3 = { adults: z.number().int().min(1, 'At least one adult is needed').max(20, 'For larger groups, please contact us directly'), children: z.number().int().min(0).max(10), childAges: z.array(z.number().int().min(0).max(17).nullable()).max(10), rooms: z.number().int().min(1, 'At least one room').max(10, 'For more rooms, please contact us directly'), arrival: z.enum(ids(arrivals), { error: 'Choose how you expect to arrive' }) };
const step4 = {
  name: z.string().trim().min(1, 'Please tell us your name').max(80, 'Keep your name under 80 characters'), phone: indianPhone, email: z.email('Enter a valid email address').max(254),
  contactMethod: z.enum(contactMethods, { error: 'Choose how we should reach you' }), occasion: z.enum(occasions), dietary: z.string().trim().max(300, 'Keep this under 300 characters'), requests: z.string().trim().max(600, 'Keep this under 600 characters'),
  consent: z.literal(true, { error: 'Please tick to continue' }), website: z.string().max(0).optional(), // Hidden honeypot; never included in email.
};
type Dates = { flexible: boolean; checkIn: string; month: string };
const datesCheck = (data: Dates, ctx: z.RefinementCtx) => {
  if (data.flexible) { if (!data.month) ctx.addIssue({ code: 'custom', message: 'Pick the month you have in mind', path: ['month'] }); else if (data.month < todayInIndia().slice(0, 7)) ctx.addIssue({ code: 'custom', message: 'That month has already passed', path: ['month'] }); return; }
  if (!data.checkIn) ctx.addIssue({ code: 'custom', message: 'Choose your check-in date, or mark your dates as flexible', path: ['checkIn'] });
  else if (data.checkIn < todayInIndia()) ctx.addIssue({ code: 'custom', message: 'Check-in cannot be in the past', path: ['checkIn'] });
};
const agesCheck = (data: { children: number; childAges: unknown[] }, ctx: z.RefinementCtx) => { if (data.childAges.length > data.children) ctx.addIssue({ code: 'custom', message: 'Too many ages', path: ['childAges'] }); };
export const stepSchemas = [z.object(step1), z.object(step2).superRefine(datesCheck), z.object(step3).superRefine(agesCheck), z.object(step4)] as const;
export const bookingRequestSchema = z.object({ ...step1, ...step2, ...step3, ...step4, requestId: z.string().regex(/^HOGS-[A-Z]{1,4}-\d{4}$/, 'Missing request ID') }).superRefine((data, ctx) => { datesCheck(data, ctx); agesCheck(data, ctx); });
export type BookingDraft = z.infer<typeof bookingRequestSchema>;
export type BookingForm = Omit<BookingDraft, 'requestId'>;
export const defaultBooking = (slug: string): BookingForm => ({ packageSlug: slug, pace: 'as-planned', addons: [], note: '', flexible: false, checkIn: '', month: '', adults: 2, children: 0, childAges: [], rooms: 1, arrival: 'unsure', name: '', phone: '+91 ', email: '', contactMethod: 'WhatsApp', occasion: 'None', dietary: '', requests: '', consent: false as unknown as true, website: '' });
/** Friendly per-field messages for one step (0-3), or {} when the step is valid. */
export const validateStep = (step: number, data: BookingForm) => {
  const result = stepSchemas[step].safeParse(data); const errors: Record<string, string> = {};
  if (!result.success) for (const issue of result.error.issues) { const key = String(issue.path[0] ?? 'form'); if (!(key in errors)) errors[key] = issue.message; }
  return errors;
};

// ---- Wording shared by the WhatsApp message, the email fallback and the server email
export const packageNameFor = packageLabel;
const nightsOf = (slug: string) => packageMeta.find(item => item.slug === slug)?.nights ?? 0;
const long = (iso: string) => new Date(`${iso}T12:00:00Z`).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' });
export const monthLabel = (value: string) => new Date(`${value}-01T12:00:00Z`).toLocaleDateString('en-IN', { month: 'long', year: 'numeric', timeZone: 'UTC' });
export const datesText = (data: BookingForm) => data.flexible ? `Flexible, preferred month: ${data.month ? monthLabel(data.month) : 'not chosen'}` : `${long(data.checkIn)} to ${long(addDays(data.checkIn, nightsOf(data.packageSlug)))} (${nightsOf(data.packageSlug)} nights)`;
export const travellersText = (data: BookingForm) => {
  const ages = data.childAges.filter((age): age is number => age !== null);
  return `${data.adults} adult${data.adults === 1 ? '' : 's'}${data.children ? `, ${data.children} child${data.children === 1 ? '' : 'ren'}${ages.length ? ` (ages ${ages.join(', ')})` : ''}` : ''}`;
};
export const addonsText = (data: BookingForm) => data.addons.map(id => { const item = addons.find(entry => entry.id === id)!; return `${item.label} (${item.note.toLowerCase()})`; }).join('; ');
const lookup = <T extends readonly { id: string; label: string }[]>(list: T, id: string) => list.find(item => item.id === id)?.label ?? id;
const rows = (data: BookingForm, id: string): [string, string][] => [
  ['Request ID', id], ['Journey', packageNameFor(data.packageSlug)], ['Pace', lookup(paces, data.pace)], ...(data.addons.length ? [['Add-ons', addonsText(data)] as [string, string]] : []),
  ...(data.note ? [['Add or skip', data.note] as [string, string]] : []), ['Dates', datesText(data)], ['Travellers', travellersText(data)], ['Rooms', String(data.rooms)], ['Arriving', lookup(arrivals, data.arrival)],
  ['Name', data.name], ['Phone', data.phone], ['Email', data.email], ['Preferred contact', data.contactMethod], ...(data.occasion !== 'None' ? [['Occasion', data.occasion] as [string, string]] : []),
  ...(data.dietary ? [['Dietary notes', data.dietary] as [string, string]] : []), ...(data.requests ? [['Special requests', data.requests] as [string, string]] : []),
];
const lines = (data: BookingForm, id: string) => rows(data, id).map(([label, value]) => `${label}: ${value}`).join('\n');
export const bookingWhatsappMessage = (data: BookingForm, id: string) => `Hello HOGS! I'd like to request a booking.\n${lines(data, id)}\nPlease send availability and a personalised quote (price on request). I understand nothing is booked until HOGS confirms.`;
export const bookingMailto = (data: BookingForm, id: string, email: string) => `mailto:${email}?subject=${encodeURIComponent(`Booking request ${id}: ${packageNameFor(data.packageSlug)}`)}&body=${encodeURIComponent(`Hello HOGS,\n\nI'd like to request a booking.\n\n${lines(data, id)}\n\nPlease send availability and a personalised quote.\n`)}`;
export const bookingEmailText = (data: BookingForm, id: string) => `New HOGS booking request\n\n${lines(data, id)}\n\nThis is a request, not a confirmed booking. Nothing has been charged. Price is on request.`;
export const bookingRows = rows;
