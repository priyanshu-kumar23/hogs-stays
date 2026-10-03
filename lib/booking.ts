import { z } from 'zod';
export function todayInIndia(now = new Date()) { return new Intl.DateTimeFormat('en-CA', { timeZone:'Asia/Kolkata', year:'numeric',month:'2-digit',day:'2-digit' }).format(now); }
const date = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Choose a valid date').refine(value => { const parsed = new Date(`${value}T00:00:00Z`); return !Number.isNaN(parsed.getTime()) && parsed.toISOString().slice(0,10) === value; }, 'Choose a valid date');
export const indianPhone = z.string().trim().transform(value=>value.replace(/[\s-]/g,'')).pipe(z.string().regex(/^(?:\+91|91|0)?[6-9]\d{9}$/, 'Enter a valid Indian mobile number'));
export const bookingSchema = z.object({
  firstName: z.string().trim().min(1,'Enter your first name').max(60,'Keep your name under 60 characters'),
  lastName: z.string().trim().min(1,'Enter your last name').max(60,'Keep your name under 60 characters'),
  phone: indianPhone,
  email: z.email('Enter a valid email address').max(254),
  checkIn: date.refine(value=>value>=todayInIndia(),'Check-in cannot be in the past'),
  checkOut: date,
  guests: z.number().int().min(1,'At least one guest is required').max(30,'For larger groups, please contact us directly'),
  // TODO(owner): Cafe DO NTHNG is not bookable yet (see content.ts `bookable`). Add its name
  // here once the owner decides enquiries should route through this form.
  property: z.enum(['HOGS Panorama'], { error:'Please choose a property' }),
  website: z.string().max(0).optional(), // Hidden honeypot; never included in email.
}).refine(data=>data.checkOut>data.checkIn,{ message:'Check-out must be after check-in', path:['checkOut'] });
export type Booking = z.infer<typeof bookingSchema>;
export function whatsappMessage(data: Booking) { return `Hello HOGS! I'd like to enquire about a stay.\nProperty: ${data.property}\nName: ${data.firstName} ${data.lastName}\nCheck-in: ${data.checkIn}\nCheck-out: ${data.checkOut}\nGuests: ${data.guests}\nPhone: ${data.phone}\nEmail: ${data.email}\nPlease let me know availability and booking details.`; }
