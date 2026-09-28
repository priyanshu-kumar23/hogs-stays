import type { NextConfig } from 'next';
import { PHASE_DEVELOPMENT_SERVER } from 'next/constants';

export default function config(phase: string): NextConfig {
  return {
    // Dev server uses its own folder; production builds MUST use the default `.next` for Vercel
    distDir: phase === PHASE_DEVELOPMENT_SERVER ? '.next-cinema' : '.next',
    images: {
      formats: ['image/avif', 'image/webp'],
      deviceSizes: [360, 640, 750, 1080, 1440, 1920],
    },
    poweredByHeader: false,
    devIndicators: false,
    // Preserve explicit client boundaries; Next 15's concatenation can omit the form
    // from the client-reference manifest in Windows production builds.
    webpack(config) {
      config.optimization.concatenateModules = false;
      return config;
    },
  };
}
