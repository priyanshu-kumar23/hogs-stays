import Image from 'next/image';
import { cafeMenu, cafeMenuQr } from '@/lib/content';
import CafeMenuButton from './CafeMenuButton';
import '@/app/cafe-status.css';

// "Scan to order" card. The QR is a lossless PNG shown through next/image with `unoptimized`, so it is served byte-for-byte (no WebP/AVIF
// re-encode) and has no blur placeholder. It is sized to a multiple of its 37 modules and drawn with image-rendering: pixelated so every
// module stays a crisp square. Wrapped in a link to the same menu URL so tapping it works too (nobody can scan their own screen).
export default function MenuQrCard({ compact = false }: { compact?: boolean }) {
  return <aside className={`cafe-qr-card${compact ? ' is-compact' : ''}`} aria-labelledby={compact ? 'qr-title-visit' : 'qr-title-menu'}>
    <div className="cafe-qr-copy">
      <h3 id={compact ? 'qr-title-visit' : 'qr-title-menu'}>{cafeMenuQr.heading}</h3>
      <p className="cafe-qr-text">{cafeMenuQr.text}</p>
      <CafeMenuButton />
    </div>
    <div className="cafe-qr-code">
      <a href={cafeMenu.url} target="_blank" rel="noopener noreferrer" aria-label={cafeMenu.ariaLabel}>
        <Image src={cafeMenuQr.src} alt={cafeMenuQr.alt} width={cafeMenuQr.width} height={cafeMenuQr.height} unoptimized loading="lazy" />
      </a>
      <p className="cafe-qr-share">{cafeMenuQr.share}</p>
    </div>
  </aside>;
}
