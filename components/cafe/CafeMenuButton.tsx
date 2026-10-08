import { cafeMenu } from '@/lib/content';
import '@/app/cafe-status.css';

/** Primary "View menu & order" button: opens the Petpooja menu in a new tab. */
export default function CafeMenuButton({ className = 'button' }: { className?: string }) {
  return <div className="cafe-menu-cta">
    <a className={className} href={cafeMenu.url} target="_blank" rel="noopener noreferrer" aria-label={cafeMenu.ariaLabel}>{cafeMenu.label} →</a>
  </div>;
}
