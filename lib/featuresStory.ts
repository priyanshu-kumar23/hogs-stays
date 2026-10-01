import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type Lenis from 'lenis';

// Behaviour for components/sections/Features.tsx: pins the section and slides one flex track sideways while the page scrolls down.
// Must run synchronously inside Motion's gsap.matchMedia context (so the tweens/triggers are reverted with it) and, on desktop,
// before the later gallery/camera triggers are created (pin spacing depends on creation order). Lenis scroll is already wired to
// ScrollTrigger.update by Motion. With prefers-reduced-motion nothing is pinned (pinned=false): the CSS renders a vertical stack.
type Options = { pinned: boolean; lenis: Lenis | null };
const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const CREAM = '#e8e1d6', PINE = '#d3ddd1';

export function initFeaturesStory({ pinned, lenis }: Options): () => void {
  if (!pinned) return () => {};
  const section = document.getElementById('features');
  const track = section?.querySelector<HTMLElement>('[data-fs-track]');
  const viewport = section?.querySelector<HTMLElement>('.fs-viewport');
  const cur = section?.querySelector<HTMLElement>('[data-fs-cur]');
  const fill = section?.querySelector<HTMLElement>('[data-fs-fill]');
  if (!section || !track || !viewport || !cur || !fill) return () => {};

  const panels = Array.from(track.querySelectorAll<HTMLElement>('.fs-panel'));
  const items = Array.from(track.querySelectorAll<HTMLElement>('[data-fs-item]'));
  const cleanups: Array<() => void> = [];
  const on = <T extends EventTarget>(target: T, type: string, fn: EventListener, opts?: AddEventListenerOptions) => {
    target.addEventListener(type, fn, opts);
    cleanups.push(() => target.removeEventListener(type, fn, opts));
  };
  ScrollTrigger.config({ ignoreMobileResize: true }); // phone address-bar resizes must not re-measure the pin

  const small = innerWidth < 768; // phones: no heavy parallax
  const dist = () => Math.max(0, track.offsetWidth - viewport.clientWidth);
  let centers: number[] = [];
  const measure = () => { centers = panels.map(p => p.offsetLeft + p.offsetWidth / 2); };
  measure();

  let active = -1;
  const setActive = (i: number) => {
    if (i === active) return;
    active = i;
    cur.textContent = String(i + 1).padStart(2, '0');
    items.forEach((item, k) => item.toggleAttribute('data-active', k === i));
  };

  const colors = panels.map((_, i) => (i % 2 ? PINE : CREAM)); // cream (intro) -> pale pine -> cream ... -> cream (outro)
  const apply = () => {
    const x = gsap.getProperty(track, 'x') as number;
    const mid = innerWidth / 2;
    let bestItem = 0, bestDist = Infinity;
    panels.forEach((panel, k) => {
      const d = Math.abs(centers[k] + x - mid);
      const t = clamp(d / (panel.offsetWidth * 1.1));
      panel.style.opacity = String(1 - 0.5 * t); // active 1.0 -> neighbours 0.5
      panel.style.transform = `scale(${1.03 - 0.08 * t})`; // centred panel 1.03 -> neighbours 0.95
      const itemIndex = items.indexOf(panel);
      if (itemIndex > -1 && d < bestDist) { bestDist = d; bestItem = itemIndex; }
    });
    setActive(bestItem);
    // Continuous panel index under the viewport centre -> eased background colour.
    let u = 0;
    for (let k = 0; k < panels.length - 1; k++) {
      const a = centers[k] + x, b = centers[k + 1] + x;
      if (mid >= a && mid <= b) { u = k + (mid - a) / (b - a); break; }
      if (mid > b) u = k + 1;
    }
    const lo = Math.floor(u), hi = Math.min(panels.length - 1, lo + 1);
    section.style.setProperty('--fs-bg', gsap.utils.interpolate(colors[lo], colors[hi], u - lo));
    fill.style.transform = `scaleX(${dist() ? clamp(-x / dist()) : 0})`;
  };

  const tween = gsap.to(track, {
    x: () => -dist(), ease: 'none', onUpdate: apply,
    scrollTrigger: { trigger: section, start: 'top top', end: () => '+=' + dist(), pin: true, scrub: small || innerWidth < 1024 ? 0.8 : 1, anticipatePin: 1, invalidateOnRefresh: true },
  });
  const st = tween.scrollTrigger!;

  // Per-panel choreography keyed to each panel's horizontal position (containerAnimation).
  items.forEach(item => {
    const mask = item.querySelector('.fs-mask'), img = item.querySelector('.fs-img');
    const trig = (start: string, end: string) => ({ trigger: item, containerAnimation: tween, start, end, scrub: true, invalidateOnRefresh: true });
    gsap.fromTo(mask, { clipPath: 'inset(14% 16% 14% 16% round 12px)' }, { clipPath: 'inset(0% 0% 0% 0% round 12px)', ease: 'power2.out', scrollTrigger: trig('left 96%', 'left 50%') });
    if (small) return;
    gsap.fromTo(img, { scale: 1.15 }, { scale: 1, ease: 'power1.out', scrollTrigger: trig('left 98%', 'left 40%') });
    gsap.fromTo(img, { xPercent: 4 }, { xPercent: -4, ease: 'none', scrollTrigger: trig('left right', 'right left') });
  });

  const onRefresh = () => { measure(); apply(); };
  ScrollTrigger.addEventListener('refresh', onRefresh);
  cleanups.push(() => ScrollTrigger.removeEventListener('refresh', onRefresh));
  apply();

  // Re-measure the pin once photos have loaded and whenever the track's size changes.
  let timer: ReturnType<typeof setTimeout>;
  const refreshSoon = () => { clearTimeout(timer); timer = setTimeout(() => ScrollTrigger.refresh(), 120); };
  section.querySelectorAll('img').forEach(img => { if (!img.complete) on(img, 'load', refreshSoon, { once: true }); });
  const ro = new ResizeObserver(refreshSoon);
  ro.observe(track);
  cleanups.push(() => { clearTimeout(timer); ro.disconnect(); });

  const goToPanel = (index: number) => {
    const k = clamp(index, 0, panels.length - 1);
    const p = k === 0 ? 0 : k === panels.length - 1 ? 1 : dist() ? clamp((centers[k] - innerWidth / 2) / dist()) : 0;
    const y = st.start + p * (st.end - st.start);
    if (lenis) lenis.scrollTo(y, { duration: 1.1 }); else window.scrollTo({ top: y, behavior: 'smooth' });
  };
  const nearestPanel = () => {
    const x = gsap.getProperty(track, 'x') as number;
    let best = 0, bestDist = Infinity;
    centers.forEach((c, k) => { const d = Math.abs(c + x - innerWidth / 2); if (d < bestDist) { bestDist = d; best = k; } });
    return best;
  };
  // Focus moving into an off-screen panel (e.g. tabbing to the outro CTA) brings that panel into view.
  on(section, 'focusin', e => {
    const panel = (e.target as Element).closest('.fs-panel');
    if (panel && e.target !== track) goToPanel(panels.indexOf(panel as HTMLElement));
  });
  // Arrow keys (and Home/End) move between panels; at either end the key falls through to normal scrolling.
  on(track, 'keydown', event => {
    const e = event as KeyboardEvent;
    if (e.altKey || e.ctrlKey || e.metaKey) return;
    const now = nearestPanel();
    let next: number;
    if (e.key === 'ArrowRight') next = now + 1;
    else if (e.key === 'ArrowLeft') next = now - 1;
    else if (e.key === 'Home') next = 0;
    else if (e.key === 'End') next = panels.length - 1;
    else return;
    if (next < 0 || next > panels.length - 1) return;
    e.preventDefault();
    goToPanel(next);
  });

  // Mouse drag (fine pointers only) scrubs the page scroll 1:1; touch keeps native vertical scrolling.
  if (matchMedia('(pointer:fine)').matches) {
    track.dataset.drag = 'true';
    let down = false, moved = false, startX = 0, startY = 0;
    on(track, 'pointerdown', event => {
      const e = event as PointerEvent;
      if (e.button !== 0 || (e.target as Element).closest('a,button')) return;
      down = true; moved = false; startX = e.clientX; startY = lenis ? lenis.scroll : scrollY;
    });
    on(track, 'pointermove', event => {
      const e = event as PointerEvent;
      if (!down) return;
      const dx = e.clientX - startX;
      if (!moved && Math.abs(dx) > 4) { moved = true; track.setPointerCapture(e.pointerId); }
      if (!moved) return;
      if (lenis) lenis.scrollTo(startY - dx, { immediate: true }); else window.scrollTo(0, startY - dx);
    });
    const end = () => { down = false; };
    on(track, 'pointerup', end); on(track, 'pointercancel', end);
    cleanups.push(() => { delete track.dataset.drag; });
  }

  cleanups.push(() => {
    panels.forEach(p => { p.style.removeProperty('opacity'); p.style.removeProperty('transform'); });
    section.style.removeProperty('--fs-bg');
    fill.style.removeProperty('transform');
  });
  return () => cleanups.forEach(fn => fn());
}
