'use client';
import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { contactMethods, enquiryMailto, enquirySchema, enquiryWhatsappMessage, packageNameFor, type Enquiry } from '@/lib/enquiry';
import { packageMeta } from '@/lib/packageMeta';
import { todayInIndia } from '@/lib/booking';
import { content } from '@/lib/content';
import Icon from '@/components/ui/Icon';
import DatePicker from '@/components/ui/DatePicker';
// One enquiry form per journey (journey pre-selected, still changeable). It first posts to /api/package-enquiry, which reuses the site's
// Resend email setup. If email is not configured (503) or fails, the visitor gets their message ready on WhatsApp (wa.me) or by email.
// A honeypot field catches bots. No enquiry is ever shown as "sent" unless the server accepted it.
const nextDay = (value: string) => { const date = new Date(`${value}T12:00:00Z`); if (Number.isNaN(date.getTime())) return todayInIndia(); date.setUTCDate(date.getUTCDate() + 1); return date.toISOString().slice(0, 10); };
export default function EnquiryForm({ slug }: { slug: string }) {
  const [sent, setSent] = useState<Enquiry | null>(null); const [status, setStatus] = useState(''); const [fallback, setFallback] = useState<Enquiry | null>(null); const success = useRef<HTMLDivElement>(null);
  const { register, handleSubmit, setValue, watch, formState: { errors, isSubmitting } } = useForm<Enquiry>({ resolver: zodResolver(enquirySchema), defaultValues: { name: '', phone: '+91 ', email: '', flexible: false, from: '', to: '', adults: 2, children: 0, packageSlug: slug, message: '', contactMethod: 'WhatsApp', website: '' } });
  const adults = watch('adults'); const children = watch('children'); const from = watch('from'); const to = watch('to'); const flexible = watch('flexible');
  useEffect(() => { setValue('packageSlug', slug); }, [slug, setValue]);
  useEffect(() => { if (sent) success.current?.focus(); }, [sent]);
  const waLink = (data: Enquiry) => `https://wa.me/${content.whatsapp}?text=${encodeURIComponent(enquiryWhatsappMessage(data))}`;
  const submit = async (data: Enquiry) => {
    setStatus(''); setFallback(null);
    try {
      const response = await fetch('/api/package-enquiry', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.error || 'We could not send your enquiry just now.');
      setSent(data);
    } catch (error) { setFallback(data); setStatus(`${error instanceof Error ? error.message : 'We could not send your enquiry just now.'} Your details are ready to send on WhatsApp or by email instead.`); }
  };
  const whatsappNow = handleSubmit(data => { setFallback(data); setStatus('Your WhatsApp message is ready. Open it below to review and send.'); });
  const error = (name: keyof Enquiry) => errors[name] && <span className="field-error" id={`pk-${name}-error`} role="alert">{String(errors[name]?.message)}</span>;
  const described = (name: keyof Enquiry) => ({ 'aria-invalid': Boolean(errors[name]), 'aria-describedby': errors[name] ? `pk-${name}-error` : undefined });
  const stepper = (name: 'adults' | 'children', label: string, value: number, min: number, max: number) => <div className="field"><span className="field-label" id={`pk-${name}-label`}>{label}</span><div className="stepper" role="group" aria-labelledby={`pk-${name}-label`}><button type="button" aria-label={`Remove one ${name === 'adults' ? 'adult' : 'child'}`} disabled={value <= min} onClick={() => setValue(name, value - 1, { shouldValidate: true })}>−</button><output aria-live="polite">{value}</output><button type="button" aria-label={`Add one ${name === 'adults' ? 'adult' : 'child'}`} disabled={value >= max} onClick={() => setValue(name, value + 1, { shouldValidate: true })}>+</button></div>{error(name)}</div>;
  if (sent) return <div className="pk-form-card booking-card"><div className="success-state" ref={success} tabIndex={-1} role="status"><span className="success-orb"><Icon name="sun" size={30} /></span><h3>The mountains heard you.</h3><p>Thank you, {sent.name.split(' ')[0]}. We’ve received your enquiry for {packageNameFor(sent.packageSlug)}. HOGS will be in touch on {sent.contactMethod} shortly, with the details and what to expect.</p><button className="text-link" type="button" onClick={() => setSent(null)}>Send another enquiry <Icon /></button></div></div>;
  return <div className="pk-form-card booking-card">
    <p className="eyebrow pk-form-eyebrow">ENQUIRE ABOUT THIS JOURNEY</p>
    <form onSubmit={handleSubmit(submit)} noValidate>
      <div className="pk-form-grid">
        <div className="field"><label htmlFor="pk-name">Your name</label><input id="pk-name" autoComplete="name" {...register('name')} {...described('name')} />{error('name')}</div>
        <div className="field"><label htmlFor="pk-phone">Phone number</label><input id="pk-phone" type="tel" autoComplete="tel" placeholder="+91 98765 43210" {...register('phone')} {...described('phone')} />{error('phone')}</div>
        <div className="field"><label htmlFor="pk-email">Email address</label><input id="pk-email" type="email" autoComplete="email" {...register('email')} {...described('email')} />{error('email')}</div>
        <div className="field"><label htmlFor="pk-package">Journey</label><select id="pk-package" {...register('packageSlug')} {...described('packageSlug')}>{packageMeta.map(item => <option key={item.slug} value={item.slug}>{item.name} · {item.nights}N/{item.days}D</option>)}</select>{error('packageSlug')}</div>
        <fieldset className="pk-dates"><legend className="field-label">Travel dates</legend>
          {!flexible && <div className="pk-dates-pair"><DatePicker id="pk-from" label="From" value={from || ''} min={todayInIndia()} onChange={value => setValue('from', value, { shouldValidate: true })} error={errors.from?.message} /><DatePicker id="pk-to" label="To" value={to || ''} min={from ? nextDay(from) : todayInIndia()} onChange={value => setValue('to', value, { shouldValidate: true })} error={errors.to?.message} /></div>}
          <label className="pk-check"><input type="checkbox" {...register('flexible')} /> My dates are flexible</label>
        </fieldset>
        <div className="pk-guests">{stepper('adults', 'Adults', adults, 1, 20)}{stepper('children', 'Children', children, 0, 20)}</div>
        <fieldset className="pk-contact"><legend className="field-label">Best way to reach you</legend><div>{contactMethods.map(method => <label className="property-choice pk-contact-choice" key={method}><input type="radio" value={method} {...register('contactMethod')} />{method}</label>)}</div>{error('contactMethod')}</fieldset>
        <div className="field"><label htmlFor="pk-message">Anything we should know? <span className="pk-optional">(optional)</span></label><textarea id="pk-message" rows={3} {...register('message')} {...described('message')} />{error('message')}</div>
      </div>
      <div className="honeypot" aria-hidden="true"><label htmlFor="pk-website">Website</label><input id="pk-website" {...register('website')} tabIndex={-1} autoComplete="off" /></div>
      <button disabled={isSubmitting} type="submit" className="button form-submit">{isSubmitting ? 'Sending your enquiry…' : 'Send enquiry'} <Icon /></button>
      <button type="button" disabled={isSubmitting} className="button outline whatsapp-continue" onClick={() => void whatsappNow()}><Icon name="chat" size={17} /> {content.ui.booking.whatsapp}</button>
      {status && <p className="form-status" role="status">{status}</p>}
      {fallback && <div className="pk-fallback"><a className="text-link" href={waLink(fallback)} target="_blank" rel="noopener noreferrer">Open your message in WhatsApp <Icon /></a><a className="text-link" href={enquiryMailto(fallback, content.email)}>Email it to {content.email} <Icon /></a></div>}
      <p className="form-note">An enquiry, not a confirmed booking. Pricing is shared on request. By submitting, you agree to be contacted about this enquiry.</p>
    </form>
  </div>;
}
