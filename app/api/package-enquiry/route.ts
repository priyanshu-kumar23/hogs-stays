import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { bookingEmailText, bookingRequestSchema, packageNameFor } from '@/lib/enquiry';
export const runtime = 'nodejs';
// Journey booking requests ("Request to book" sheet on /packages/[slug]) reuse the same Resend credentials as /api/booking
// (RESEND_API_KEY, BOOKING_FROM_EMAIL, BOOKING_EMAIL), the same origin check, size cap and honeypot. When email is not configured it
// answers 503 and the sheet falls back to a prefilled WhatsApp message / mailto, so a request is never shown as "received" unless the
// server accepted it. Nothing is booked or charged here.
// TODO(owner): to also store requests or notify a CRM / sheet / Slack, add the call after validation below (before the email send).
export async function POST(request: Request) {
  if (!(request.headers.get('content-type') || '').includes('application/json')) return NextResponse.json({ error: 'Send a JSON request.' }, { status: 415 });
  const origin = request.headers.get('origin');
  const allowed = new URL(process.env.NEXT_PUBLIC_SITE_URL || request.url).origin;
  if (origin && origin !== allowed) return NextResponse.json({ error: 'Please submit from the HOGS website.' }, { status: 403 });
  if (Number(request.headers.get('content-length')) > 12288) return NextResponse.json({ error: 'This request is too large.' }, { status: 413 });
  let body: unknown;
  try { const raw = await request.text(); if (raw.length > 12288) return NextResponse.json({ error: 'This request is too large.' }, { status: 413 }); body = JSON.parse(raw); } catch { return NextResponse.json({ error: 'Invalid request. Please check your details.' }, { status: 400 }); }
  const parsed = bookingRequestSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: 'Please check your contact details and travel dates.', fields: parsed.error.flatten().fieldErrors }, { status: 400 });
  const recipient = process.env.BOOKING_EMAIL || process.env.BOOKING_TO_EMAIL;
  if (!process.env.RESEND_API_KEY || !process.env.BOOKING_FROM_EMAIL || !recipient) return NextResponse.json({ error: 'Email requests are not available yet. Please continue on WhatsApp or call +91 92511 15478.' }, { status: 503 });
  const { requestId, ...data } = parsed.data;
  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    const { error } = await resend.emails.send({ from: process.env.BOOKING_FROM_EMAIL, to: recipient, replyTo: data.email, subject: `Booking request ${requestId}: ${packageNameFor(data.packageSlug)}`, text: bookingEmailText(data, requestId) });
    if (error) return NextResponse.json({ error: 'We could not deliver your request. Please use WhatsApp or call us.' }, { status: 502 });
    return NextResponse.json({ success: true, requestId }, { headers: { 'Cache-Control': 'no-store' } });
  } catch { return NextResponse.json({ error: 'Our email service is temporarily unavailable. Please try WhatsApp.' }, { status: 502 }); }
}
