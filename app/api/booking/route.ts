import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { bookingSchema } from '@/lib/booking';
export const runtime = 'nodejs';
export async function POST(request: Request) {
  if (!(request.headers.get('content-type') || '').includes('application/json')) return NextResponse.json({error:'Send a JSON enquiry.'},{status:415});
  // Reject cross-origin browser submissions without assuming any forwarded proxy headers.
  const origin = request.headers.get('origin');
  const allowed = new URL(process.env.NEXT_PUBLIC_SITE_URL || request.url).origin;
  if (origin && origin !== allowed) return NextResponse.json({error:'Please submit from the HOGS website.'},{status:403});
  if (Number(request.headers.get('content-length')) > 8192) return NextResponse.json({error:'This enquiry is too large.'},{status:413});
  let body: unknown;
  try { const raw=await request.text(); if(raw.length>8192) return NextResponse.json({error:'This enquiry is too large.'},{status:413}); body=JSON.parse(raw); } catch { return NextResponse.json({error:'Invalid enquiry. Please check your details.'},{status:400}); }
  const parsed=bookingSchema.safeParse(body);
  if(!parsed.success) return NextResponse.json({error:'Please check your contact details and travel dates.',fields:parsed.error.flatten().fieldErrors},{status:400});
  const recipient = process.env.BOOKING_EMAIL || process.env.BOOKING_TO_EMAIL;
  if(!process.env.RESEND_API_KEY || !process.env.BOOKING_FROM_EMAIL || !recipient) return NextResponse.json({error:'Email enquiries are not available yet. Please continue on WhatsApp or call +91 92511 15478.'},{status:503});
  const data=parsed.data;
  try {
    const resend=new Resend(process.env.RESEND_API_KEY);
    const {error}=await resend.emails.send({from:process.env.BOOKING_FROM_EMAIL,to:recipient,replyTo:data.email,subject:`Stay enquiry: ${data.property} | ${data.checkIn}`,text:`New HOGS stay enquiry\n\nProperty: ${data.property}\nGuest: ${data.firstName} ${data.lastName}\nPhone: ${data.phone}\nEmail: ${data.email}\nCheck-in: ${data.checkIn}\nCheck-out: ${data.checkOut}\nGuests: ${data.guests}\n\nThis is an enquiry, not a confirmed reservation.`});
    if(error) return NextResponse.json({error:'We could not deliver your enquiry. Please use WhatsApp or call us.'},{status:502});
    return NextResponse.json({success:true},{headers:{'Cache-Control':'no-store'}});
  } catch { return NextResponse.json({error:'Our email service is temporarily unavailable. Please try WhatsApp.'},{status:502}); }
}
