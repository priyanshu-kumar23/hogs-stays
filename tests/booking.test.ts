import { test } from 'node:test';
import assert from 'node:assert/strict';
import { bookingSchema, todayInIndia, whatsappMessage } from '../lib/booking';
const valid={firstName:'Asha',lastName:'Singh',phone:'+919876543210',email:'asha@example.com',checkIn:'2099-01-01',checkOut:'2099-01-03',guests:2,property:'HOGS Panorama' as const,website:''};
test('accepts valid Indian enquiry and includes all details in WhatsApp',()=>{assert.equal(bookingSchema.safeParse(valid).success,true); const text=whatsappMessage(valid); for(const value of ['Asha Singh','2099-01-01','2099-01-03','HOGS Panorama','asha@example.com','+919876543210','Guests: 2']) assert.ok(text.includes(value));});
test('rejects impossible, reversed, same-day and past dates',()=>{for(const change of [{checkIn:'2099-02-30'},{checkOut:'2099-01-01'},{checkOut:'2098-12-31'},{checkIn:'2000-01-01'}]) assert.equal(bookingSchema.safeParse({...valid,...change}).success,false);});
test('rejects invalid contact, guest, property and honeypot values',()=>{for(const change of [{phone:'1234567890'},{email:'not-email'},{guests:0},{guests:1.5},{property:'unknown'},{website:'spam'}]) assert.equal(bookingSchema.safeParse({...valid,...change}).success,false);});
test('date boundaries use India timezone',()=>{assert.equal(todayInIndia(new Date('2026-09-27T20:00:00Z')),'2026-09-28');});
test('normalizes commonly formatted Indian numbers',()=>{const result=bookingSchema.parse({...valid,phone:'+91 98765 43210'});assert.equal(result.phone,'+919876543210');});
