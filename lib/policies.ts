// Guest-information pages: privacy, terms, cancellation & refund, house rules, FAQs. The wording is the client's own, used verbatim
// (only obvious typos fixed). Do not add or remove rules here without the client's say-so.
//
// Rich text: a string may contain **bold** and [label](/path-or-url) links; components/policy/RichText.tsx renders both.
// Slugs match the client's live site (hogsstays.com), so existing Google rankings and links keep working.
export type PolicyBlock =
  | { type: 'p'; text: string }
  | { type: 'ul'; items: string[] }
  | { type: 'note'; text: string }
  | { type: 'contact'; title?: string }
  | { type: 'cta'; label: string; href: string };
export type PolicySection = { id: string; title: string; blocks: PolicyBlock[]; /** house-rules icon */ icon?: string };
export type PolicySlug = 'privacy-policy' | 'terms-conditions' | 'cancellation-refund-policy' | 'house-rules-guest-guidelines' | 'faqs';
export type PolicyPage = {
  slug: PolicySlug; title: string; short: string; description: string; intro: string;
  /** Shown as "Last updated". TODO(client): confirm the date each page's wording was last reviewed. */
  lastUpdated: string;
  sections: PolicySection[]; closing?: string;
};

export const cafeFullName = 'DO NTHNG – Himalayan Brew';
export const policyContact = {
  name: 'HOGS Stays', phone: '+91 92511 15478', phoneHref: 'tel:+919251115478', whatsapp: '919251115478', whatsappHref: 'https://wa.me/919251115478',
  email: 'info@hogsstays.com', emailHref: 'mailto:info@hogsstays.com', instagram: 'instagram.com/hogsstays', instagramHandle: '@hogsstays', instagramHref: 'https://www.instagram.com/hogsstays/',
};

/** Facts shared by the Terms, Cancellation page, FAQ and every room page ("Good to know"). */
export const stayTerms = {
  checkIn: '2:00 PM', checkOut: '10:00 AM',
  earlyLate: 'Early check-in or late check-out may be available subject to availability and may incur additional charges.',
  quietHours: 'Quiet hours are observed after 10:30 PM.',
  idRule: 'All guests are required to present valid government-issued identification during check-in.',
  payment: [
    { pct: '40%', when: 'At booking', text: '40% advance payment at the time of booking' },
    { pct: '30%', when: '15 days before', text: '30% payment to be made 15 days prior to check-in' },
    { pct: '30%', when: '24 hrs before', text: 'Remaining 30% payment to be cleared 24 hours before check-in' },
  ],
  cancellation: [
    { id: 'early', label: 'Cancellation more than 20 days before check-in', bar: 'More than 20 days', short: 'Partial refund', text: 'Partial refund may be applicable after deducting processing charges.' },
    { id: 'late', label: 'Cancellation within 15 days of check-in', bar: 'Within 15 days', short: 'Advance non-refundable', text: 'Advance amount is non-refundable.' },
    { id: 'noshow', label: 'No-show or early departure', bar: 'No-show or early departure', short: 'No refund', text: 'No refund will be provided.' },
  ],
  refundTime: 'Refunds, if applicable, will be processed within 7–10 working days through the original payment method.',
  peakNotice: 'A non-refundable cancellation policy will be applicable for all bookings from 23rd December to 1st January.',
  peakShort: 'Non-refundable for all bookings from 23 Dec – 1 Jan',
};

const contactBlock = (title?: string): PolicyBlock => ({ type: 'contact', title });
// TODO(client): confirm the "last updated" date for each page.
const UPDATED = '2026-10-08';

export const policyPages: PolicyPage[] = [
  {
    slug: 'privacy-policy', title: 'Privacy Policy', short: 'Privacy', lastUpdated: UPDATED,
    description: 'How HOGS Stays collects, uses and protects your personal information when you use our website or make a reservation.',
    intro: 'At HOGS Stays, we respect your privacy and are committed to protecting the personal information you share with us while using our website or services. This Privacy Policy explains how we collect, use, and safeguard your information.',
    sections: [
      { id: 'information-we-collect', title: 'Information We Collect', blocks: [
        { type: 'p', text: 'When you interact with our website or make a reservation, we may collect the following information:' },
        { type: 'ul', items: ['Full name', 'Contact number', 'Email address', 'Identification details required for check-in', 'Booking details and preferences', 'Payment information (processed through secure payment providers)', 'Marketing preferences (feedback, reviews, and communication preferences shared with us)'] },
        { type: 'p', text: 'We may also collect non-personal information such as browser type, device information, and website usage patterns.' } ] },
      { id: 'how-we-use-your-information', title: 'How We Use Your Information', blocks: [
        { type: 'p', text: 'The information we collect is used to:' },
        { type: 'ul', items: ['Confirm and manage reservations', 'Communicate booking updates and confirmations', 'Improve our services and guest experience', 'Respond to inquiries and customer support requests', 'Send updates or promotional information (only when permitted)'] },
        { type: 'p', text: 'Your information helps us provide a smooth and personalized hospitality experience.' } ] },
      { id: 'payment-security', title: 'Payment Security', blocks: [{ type: 'p', text: 'All online payments are processed through secure third-party payment gateways. HOGS Stays does not store sensitive payment information such as credit or debit card details.' }] },
      { id: 'sharing-of-information', title: 'Sharing of Information', blocks: [
        { type: 'p', text: 'We respect your privacy and do not sell or rent your personal information. Information may only be shared when necessary with:' },
        { type: 'ul', items: ['Payment processing providers', 'Legal or regulatory authorities when required by law', 'Hospitality service partners assisting with bookings or experiences'] } ] },
      { id: 'data-protection', title: 'Data Protection', blocks: [{ type: 'p', text: 'We take appropriate security measures to protect your personal information from unauthorized access, disclosure, or misuse. However, no digital system can guarantee absolute security.' }] },
      { id: 'cookies-and-analytics', title: 'Cookies & Website Analytics', blocks: [{ type: 'p', text: 'Our website may use cookies or analytics tools to understand visitor behavior and improve website performance. Cookies help us enhance your browsing experience but do not store sensitive personal data.' }] },
      { id: 'your-rights', title: 'Your Rights', blocks: [
        { type: 'p', text: 'You have the right to request:' },
        { type: 'ul', items: ['Access to your personal information', 'Correction of inaccurate information', 'Removal of your personal data where applicable'] },
        { type: 'p', text: 'Requests can be made by contacting us directly.' } ] },
      { id: 'policy-updates', title: 'Policy Updates', blocks: [{ type: 'p', text: 'This Privacy Policy may be updated occasionally to reflect changes in services or legal requirements. Users are encouraged to review this page periodically.' }] },
      { id: 'contact-information', title: 'Contact Information', blocks: [contactBlock()] },
    ],
  },
  {
    slug: 'terms-conditions', title: 'Terms & Conditions', short: 'Terms', lastUpdated: UPDATED,
    description: `The terms that apply to stays, bookings and café services at HOGS Stays and ${cafeFullName}: reservations, payments, check-in, cancellations and house rules.`,
    intro: `Welcome to HOGS Stays. By accessing our website, making a reservation, or using our services, you agree to comply with the following Terms & Conditions. These terms govern the use of our website and services including stays, experiences, and café services at ${cafeFullName}.`,
    sections: [
      { id: 'reservations', title: 'Reservations & Booking Confirmation', blocks: [{ type: 'ul', items: [
        'All reservations made through our website, phone, or third-party platforms are subject to availability and confirmation.',
        'A booking is confirmed only after the required advance payment is received and a confirmation message/email is shared by our team.',
        'Guests must provide accurate personal details including name, contact number, and identification information during booking.',
        'HOGS reserves the right to decline or cancel reservations in case of incomplete or incorrect information.'] }] },
      { id: 'payment-policy', title: 'Payment Policy', blocks: [
        { type: 'p', text: 'To secure a booking, the following payment structure applies unless stated otherwise:' },
        { type: 'ul', items: stayTerms.payment.map(step => step.text) },
        { type: 'p', text: 'Failure to complete payments within the required timeline may result in automatic cancellation of the reservation. Payments can be made through approved payment methods including UPI, bank transfer, or payment gateway links provided by HOGS.' } ] },
      { id: 'check-in-check-out', title: 'Check-In & Check-Out', blocks: [
        { type: 'p', text: `**Check-in:** ${stayTerms.checkIn} · **Check-out:** ${stayTerms.checkOut}` },
        { type: 'p', text: `${stayTerms.earlyLate} ${stayTerms.idRule}` } ] },
      { id: 'cancellation-refund', title: 'Cancellation & Refund Policy', blocks: [
        { type: 'p', text: 'Cancellation policies may vary depending on the season, special packages, or promotional bookings. General cancellation terms:' },
        { type: 'ul', items: stayTerms.cancellation.map(rule => `${rule.label} – ${rule.text}`) },
        { type: 'p', text: stayTerms.refundTime },
        { type: 'note', text: `**Note:** ${stayTerms.peakNotice}` },
        { type: 'p', text: 'Read the [full Cancellation & Refund Policy](/cancellation-refund-policy).' } ] },
      { id: 'guest-conduct', title: 'Guest Conduct & Responsibility', blocks: [{ type: 'p', text: 'Guests are expected to behave responsibly and respect other guests, staff members, and the property. Any damage caused to the property, furniture, equipment, or décor will be chargeable to the guest responsible. HOGS reserves the right to refuse service or request guests to vacate the premises in cases of misconduct, illegal activities, or behavior that disrupts other guests.' }] },
      { id: 'house-rules', title: 'House Rules', blocks: [
        { type: 'ul', items: [stayTerms.quietHours, 'Illegal substances and unlawful activities are strictly prohibited.', 'Outside visitors are not allowed without prior approval.', 'Guests must comply with all safety and property guidelines provided during their stay.'] },
        { type: 'p', text: 'See the full [House Rules & Guest Guidelines](/house-rules-guest-guidelines).' } ] },
      { id: 'food-and-cafe', title: 'Food & Café Services', blocks: [{ type: 'p', text: `Food and beverages are served at ${cafeFullName}, our in-house café. While we strive to maintain consistency, menu items may vary depending on seasonal ingredient availability. Guests with allergies or dietary restrictions are advised to inform staff before placing orders. Outside food may be restricted in designated dining areas.` }] },
      { id: 'liability', title: 'Liability & Personal Belongings', blocks: [{ type: 'p', text: 'While we maintain strict safety and security standards, HOGS Stays shall not be held responsible for loss, damage, or theft of personal belongings. Guests are advised to keep valuables secured at all times.' }] },
      { id: 'force-majeure', title: 'Force Majeure', blocks: [
        { type: 'p', text: 'HOGS shall not be liable for failure or delay in providing services due to circumstances beyond our control including but not limited to:' },
        { type: 'ul', items: ['Natural disasters', 'Extreme weather conditions', 'Landslides or road closures', 'Government restrictions', 'Pandemics or public health emergencies'] },
        { type: 'p', text: 'In such situations, bookings may be rescheduled or adjusted upon mutual discussion.' } ] },
      { id: 'website-usage', title: 'Website Usage', blocks: [{ type: 'p', text: 'All content on this website including text, photographs, branding elements, and design is the property of HOGS Stays. Users may not reproduce, distribute, or modify website content without written permission. Any misuse of the website or fraudulent activity may result in restricted access.' }] },
      { id: 'modification-of-terms', title: 'Modification of Terms', blocks: [{ type: 'p', text: 'HOGS reserves the right to update or modify these Terms & Conditions at any time without prior notice. By continuing to use the website or services after changes are made, you agree to the revised terms.' }] },
      { id: 'contact-information', title: 'Contact Information', blocks: [contactBlock()] },
    ],
    closing: 'By booking with HOGS Stays, you acknowledge that you have read, understood, and agreed to these Terms and Conditions.',
  },
  {
    slug: 'cancellation-refund-policy', title: 'Cancellation & Refund Policy', short: 'Cancellation', lastUpdated: UPDATED,
    description: 'HOGS Stays cancellation and refund terms: payment schedule, cancellation windows, refund timelines, peak-season rules and booking changes.',
    intro: 'At HOGS Stays, we aim to provide a smooth and transparent booking experience. The following cancellation and refund terms apply to all reservations unless specified otherwise.',
    sections: [
      { id: 'booking-confirmation', title: 'Booking Confirmation', blocks: [{ type: 'p', text: 'Reservations are confirmed only after receiving the required advance payment. Booking confirmation will be shared through WhatsApp, email, or official communication channels.' }] },
      { id: 'standard-payment-terms', title: 'Standard Payment Terms', blocks: [
        { type: 'ul', items: ['40% advance payment at the time of booking', '30% payment to be made 15 days before check-in', 'Remaining 30% payment to be completed 24 hours before check-in'] },
        { type: 'p', text: 'Failure to complete payments may result in automatic cancellation of the booking.' } ] },
      { id: 'cancellation-policy', title: 'Cancellation Policy', blocks: [
        { type: 'p', text: 'Cancellation requests must be made in writing via email or WhatsApp.' },
        { type: 'ul', items: stayTerms.cancellation.map(rule => `${rule.label} – ${rule.text}`) },
        { type: 'note', text: `**Notice:** ${stayTerms.peakNotice}` } ] },
      { id: 'refund-processing', title: 'Refund Processing', blocks: [{ type: 'p', text: 'Where applicable, refunds will be processed within 7–10 working days through the original payment method. Processing timelines may vary depending on banking procedures.' }] },
      { id: 'booking-modifications', title: 'Booking Modifications', blocks: [{ type: 'p', text: 'Guests may request date changes or booking modifications subject to availability. Such requests must be made at least 7 days before the check-in date. Price differences may apply depending on seasonal rates.' }] },
      { id: 'force-majeure', title: 'Force Majeure', blocks: [{ type: 'p', text: 'In cases of unavoidable circumstances including natural disasters, landslides or road closures, government restrictions, or public health emergencies, HOGS may offer rescheduling options or credit vouchers, depending on the situation.' }] },
      { id: 'packages-and-groups', title: 'Special Packages & Group Bookings', blocks: [{ type: 'p', text: 'Certain packages, events, or group bookings may have separate cancellation policies which will be communicated at the time of booking.' }] },
      { id: 'contact-for-cancellations', title: 'Contact for Cancellation Requests', blocks: [contactBlock()] },
    ],
  },
  {
    slug: 'house-rules-guest-guidelines', title: 'House Rules & Guest Guidelines', short: 'House rules', lastUpdated: UPDATED,
    description: `Simple house rules for a comfortable stay at HOGS Panorama in Manali: quiet hours, visitors, fire safety, café etiquette at ${cafeFullName}, and respect for the mountains.`,
    intro: 'To ensure a pleasant and comfortable stay for all guests, we request everyone to follow these simple guidelines.',
    sections: [
      { id: 'quiet-hours', title: 'Quiet Hours', icon: 'moon', blocks: [{ type: 'p', text: 'Please maintain quiet hours after 10:30 PM to respect other guests staying at the property.' }] },
      { id: 'respect-the-property', title: 'Respect the Property', icon: 'home', blocks: [{ type: 'p', text: 'Guests are requested to treat the property and its surroundings with care. Any damage to furniture, décor, or property will be chargeable to the responsible guest.' }] },
      { id: 'visitor-policy', title: 'Visitor Policy', icon: 'users', blocks: [{ type: 'p', text: 'For security and privacy reasons, outside visitors are not allowed in guest rooms without prior approval from management.' }] },
      { id: 'illegal-activities', title: 'Illegal Activities', icon: 'ban', blocks: [{ type: 'p', text: 'The use or possession of illegal substances or unlawful activities is strictly prohibited on the property. Violation of this rule may result in **immediate eviction without refund**.' }] },
      { id: 'fire-safety', title: 'Fire Safety', icon: 'flame', blocks: [{ type: 'p', text: 'Open flames, fireworks, or hazardous materials are not permitted within the property premises.' }] },
      { id: 'cafe-etiquette', title: 'Café Etiquette', icon: 'cup', blocks: [
        { type: 'p', text: `Guests visiting **${cafeFullName}** are requested to:` },
        { type: 'ul', items: ['Respect café seating arrangements', 'Avoid food wastage', 'Inform staff about food allergies before ordering'] } ] },
      { id: 'environmental-responsibility', title: 'Environmental Responsibility', icon: 'leaf', blocks: [
        { type: 'p', text: 'As we are located in the mountains, we encourage guests to:' },
        { type: 'ul', items: ['Avoid littering', 'Use water responsibly', 'Respect nature and local surroundings'] } ] },
      { id: 'management-rights', title: 'Management Rights', icon: 'shield', blocks: [{ type: 'p', text: 'Management reserves the right to deny service or request guests to leave if house rules are violated.' }] },
      { id: 'emergency-contact', title: 'Emergency Contact', icon: 'phone', blocks: [{ type: 'p', text: 'For any assistance during your stay, please contact the property team: **+91 92511-15478**' }, { type: 'contact' }] },
    ],
  },
  {
    slug: 'faqs', title: 'FAQs', short: 'FAQs', lastUpdated: UPDATED,
    description: 'Answers to common questions about booking, payments, check-in, parking, pets, Wi-Fi, the in-house café and group stays at HOGS Stays in Manali.',
    intro: 'Below are answers to some common questions regarding bookings and stays at HOGS Stays.',
    sections: [], // the FAQs themselves live in lib/faqs.ts (guestFaqGroups)
  },
];

export const policyBySlug = (slug: string) => policyPages.find(page => page.slug === slug);
export const policyHref = (slug: PolicySlug) => `/${slug}`;
/** Old slugs that must keep working (301 in next.config.ts). */
export const legacyPolicySlugs: Record<string, PolicySlug> = { 'terms-and-conditions': 'terms-conditions', 'house-rules': 'house-rules-guest-guidelines' };
export const formatUpdated = (iso: string) => new Date(`${iso}T12:00:00Z`).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });
