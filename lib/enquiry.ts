import { z } from 'zod';
import { indianPhone, todayInIndia } from './booking';
import { packageLabel, packageSlugs } from './packageMeta';
// Journey enquiry shared by the form (client) and /api/package-enquiry (server). Mirrors lib/booking.ts so both flows behave alike.
const date = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Choose a valid date').refine(value => { const parsed = new Date(`${value}T00:00:00Z`); return !Number.isNaN(parsed.getTime()) && parsed.toISOString().slice(0, 10) === value; }, 'Choose a valid date');
export const contactMethods = ['WhatsApp', 'Call', 'Email'] as const;
export const enquirySchema = z.object({
  name: z.string().trim().min(1, 'Enter your name').max(80, 'Keep your name under 80 characters'),
  phone: indianPhone,
  email: z.email('Enter a valid email address').max(254),
  flexible: z.boolean(),
  from: z.union([date, z.literal('')]),
  to: z.union([date, z.literal('')]),
  adults: z.number().int().min(1, 'At least one adult is needed').max(20, 'For larger groups, please contact us directly'),
  children: z.number().int().min(0).max(20),
  packageSlug: z.enum(packageSlugs, { error: 'Please choose a journey' }),
  message: z.string().trim().max(1000, 'Keep your message under 1000 characters'),
  contactMethod: z.enum(contactMethods, { error: 'Choose how we should reach you' }),
  website: z.string().max(0).optional(), // Hidden honeypot; never included in email.
}).superRefine((data, ctx) => {
  if (data.flexible) return;
  if (!data.from) ctx.addIssue({ code: 'custom', message: 'Choose a start date, or mark your dates as flexible', path: ['from'] });
  else if (data.from < todayInIndia()) ctx.addIssue({ code: 'custom', message: 'Start date cannot be in the past', path: ['from'] });
  if (!data.to) ctx.addIssue({ code: 'custom', message: 'Choose an end date, or mark your dates as flexible', path: ['to'] });
  else if (data.from && data.to <= data.from) ctx.addIssue({ code: 'custom', message: 'End date must be after the start date', path: ['to'] });
});
export type Enquiry = z.infer<typeof enquirySchema>;
export const packageNameFor = packageLabel;
const dates = (data: Enquiry) => data.flexible ? 'Flexible' : `${data.from} to ${data.to}`;
const lines = (data: Enquiry) => [
  `Journey: ${packageNameFor(data.packageSlug)}`, `Name: ${data.name}`, `Phone: ${data.phone}`, `Email: ${data.email}`, `Travel dates: ${dates(data)}`,
  `Guests: ${data.adults} adult${data.adults === 1 ? '' : 's'}${data.children ? `, ${data.children} child${data.children === 1 ? '' : 'ren'}` : ''}`,
  `Preferred contact: ${data.contactMethod}`, ...(data.message ? [`Message: ${data.message}`] : []),
];
export const enquiryWhatsappMessage = (data: Enquiry) => `Hello HOGS! I'd like to enquire about a Manali journey.\n${lines(data).join('\n')}\nPlease share the itinerary details and pricing.`;
export const enquiryMailto = (data: Enquiry, email: string) => `mailto:${email}?subject=${encodeURIComponent(`Journey enquiry: ${packageNameFor(data.packageSlug)}`)}&body=${encodeURIComponent(`Hello HOGS,\n\nI'd like to enquire about a Manali journey.\n\n${lines(data).join('\n')}\n`)}`;
export const enquiryEmailText = (data: Enquiry) => `New HOGS journey enquiry\n\n${lines(data).join('\n')}\n\nThis is an enquiry, not a confirmed booking. Price is on request.`;
