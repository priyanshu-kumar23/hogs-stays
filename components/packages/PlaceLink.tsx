'use client';
// A stop in a day's route that opens the matching place in the Attractions drawer. The drawer lives in AttractionsSection,
// so the two talk through a window event and the (server-rendered) day cards stay light.
export default function PlaceLink({ slug, label }: { slug: string; label: string }) {
  return <button type="button" className="pk-place" aria-haspopup="dialog" onClick={event => window.dispatchEvent(new CustomEvent('hogs:place', { detail: { slug, trigger: event.currentTarget } }))}>{label}</button>;
}
