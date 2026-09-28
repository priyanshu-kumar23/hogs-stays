import { test } from 'node:test';
import assert from 'node:assert/strict';
import { POST } from '../app/api/booking/route';
const valid={firstName:'Test',lastName:'Guest',phone:'+91 98765 43210',email:'test@example.com',checkIn:'2099-01-01',checkOut:'2099-01-02',guests:2,property:'HOGS Panorama'};
test('booking endpoint validates transport and returns honest unconfigured state',async()=>{
  // Test process only: no email may be sent by this suite.
  delete process.env.RESEND_API_KEY;
  process.env.NEXT_PUBLIC_SITE_URL='https://hogsstays.example';
  const request=(body:string,headers:Record<string,string>={})=>new Request('https://hogsstays.example/api/booking',{method:'POST',headers:{'Content-Type':'application/json',...headers},body});
  assert.equal((await POST(request('not-json'))).status,400);
  assert.equal((await POST(request('{}'))).status,400);
  assert.equal((await POST(request('{}',{'Content-Type':'text/plain'}))).status,415);
  assert.equal((await POST(request('{}',{Origin:'https://other.example'}))).status,403);
  assert.equal((await POST(request('x'.repeat(9000)))).status,413);
  const response=await POST(request(JSON.stringify(valid),{Origin:'https://hogsstays.example'}));
  assert.equal(response.status,503);
  assert.match((await response.json()).error,/WhatsApp/);
});
