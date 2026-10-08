import type { NextConfig } from 'next';
export default function config(phase:string):NextConfig { return {
  distDir: phase === 'phase-development-server' ? '.next-cinema' : '.next',
  images: { formats: ['image/avif', 'image/webp'], deviceSizes:[360,640,750,1080,1440,1920] },
  poweredByHeader: false, devIndicators:false,
  // Old policy URLs keep working (permanent). Trailing slashes (/faqs/) are redirected to the canonical no-slash URL by Next (trailingSlash is off).
  async redirects() { return [
    { source: '/terms-and-conditions', destination: '/terms-conditions', permanent: true },
    { source: '/house-rules', destination: '/house-rules-guest-guidelines', permanent: true },
    // Old room deep links (?room=...) go to the room's own page; the #book fragment survives the redirect and opens the enquiry panel there.
    { source: '/stays/panorama', has: [{ type: 'query', key: 'room', value: 'jacuzzi-suite' }], destination: '/stays/panorama/jacuzzi-room', permanent: true },
    { source: '/stays/panorama', has: [{ type: 'query', key: 'room', value: '(?<room>valley-view|signature-view|premium|jacuzzi-room)' }], destination: '/stays/panorama/:room', permanent: true },
  ]; },
  // Preserve explicit client boundaries; Next 15's concatenation can omit the form
  // from the client-reference manifest in Windows production builds.
  webpack(config) { config.optimization.concatenateModules = false; return config; },
}; }
