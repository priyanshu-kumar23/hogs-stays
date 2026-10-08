import type { Amenity } from '@/lib/rooms';

// Small inline SVG amenity icons in the same 24px, thin-stroke style as components/ui/Icon.tsx. No icon library.
const paths: Record<Amenity, React.ReactNode> = {
  balcony: <><path d="M4 11h16M4 11v9m16-9v9M8 11v9m4-9v9m4-9v9M3 20h18" /><path d="M7 11V5a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v6" /></>,
  closet: <><rect x="4" y="3" width="16" height="17" rx="1.5" /><path d="M12 3v17M9.5 11v2m5-2v2M6 20v1.5M18 20v1.5" /></>,
  kettle: <><path d="M6 10h10l-1 9a1.5 1.5 0 0 1-1.5 1.3h-5A1.5 1.5 0 0 1 7 19l-1-9Z" /><path d="M16 12h2.5a1.5 1.5 0 0 1 0 3H15.5M9 10V7.5a2 2 0 0 1 2-2h0a2 2 0 0 1 2 2V10M4 8l2 2" /></>,
  tv: <><rect x="3" y="5" width="18" height="12" rx="1.5" /><path d="M9 21h6M12 17v4" /></>,
  wifi: <><path d="M2.5 9a14 14 0 0 1 19 0M5.5 12.5a9.5 9.5 0 0 1 13 0M8.6 16a5 5 0 0 1 6.8 0" /><circle cx="12" cy="19.2" r=".9" /></>,
  parking: <><rect x="3.5" y="3.5" width="17" height="17" rx="3" /><path d="M9.5 17V7.5h3.2a2.9 2.9 0 0 1 0 5.8H9.5" /></>,
  jacuzzi: <><path d="M3 12h18v3a5 5 0 0 1-5 5H8a5 5 0 0 1-5-5v-3Z" /><path d="M6 12V6.5A2.5 2.5 0 0 1 8.5 4h0A2.5 2.5 0 0 1 11 6.5M6 20l-1 1.5M18 20l1 1.5" /><circle cx="14.5" cy="7.5" r=".7" /><circle cx="17" cy="9.5" r=".7" /><circle cx="18.5" cy="6" r=".7" /></>,
  bathroom: <><path d="M5 20v-7.5A5.5 5.5 0 0 1 10.5 7H15" /><path d="M15 7v1.5m0 0 3 .5-.6 2.2M15 8.5l-2.3 1.6" /><path d="M9 14v1m3-1v1m3-1v1m-6 3v1m3-1v1m3-1v1" /></>,
};
export default function AmenityIcon({ name, size = 18 }: { name: Amenity; size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">{paths[name]}</svg>;
}
