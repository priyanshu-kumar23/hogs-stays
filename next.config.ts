import type { NextConfig } from 'next';
export default function config(phase:string):NextConfig { return {
  distDir: phase === 'phase-development-server' ? '.next-cinema' : '.next-production',
  images: { formats: ['image/avif', 'image/webp'], deviceSizes:[360,640,750,1080,1440,1920] },
  poweredByHeader: false, devIndicators:false,
  // Preserve explicit client boundaries; Next 15's concatenation can omit the form
  // from the client-reference manifest in Windows production builds.
  webpack(config) { config.optimization.concatenateModules = false; return config; },
}; }
