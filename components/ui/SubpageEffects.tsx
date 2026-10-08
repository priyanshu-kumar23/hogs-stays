'use client';
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Lenis from 'lenis';
// Lightweight motion for inner pages: Lenis smooth scroll + IntersectionObserver reveals.
// No WebGL, GSAP or ScrollTrigger here; the home page keeps its own Motion controller.
//
// Reveals are progressive enhancement: content is visible in the server HTML and with JS off. CSS only hides `[data-reveal]` once
// `html.reveal-ready` is set (below), and every hidden element is guaranteed to be shown by one of: the observer, the "above the
// viewport" rule, the safety sweep, or a MutationObserver that picks up elements added after the first scan.
//
// Why the effect depends on `pathname`: app/template.tsx is only remounted when the first route segment changes, so /stays -> /stays/panorama
// (and /packages -> /packages/<slug>) reuse this component. A mount-only effect never saw the new page's elements, which stayed hidden.
const SAFETY_MS = 1500;

export default function SubpageEffects() {
  const pathname = usePathname();
  const home = pathname === '/'; // the home page runs its own GSAP controller (components/ui/Motion.tsx)
  const reduce = () => matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Hide-until-revealed only while this component is mounted (i.e. on inner pages) and the browser can actually reveal.
  useEffect(() => {
    if (home || reduce() || !('IntersectionObserver' in window)) return;
    const root = document.documentElement;
    root.classList.add('reveal-ready');
    return () => root.classList.remove('reveal-ready');
  }, [home]);

  // Per-route work: fresh Lenis, observers over the new page's elements, safety sweep. Fully torn down on every route change.
  useEffect(() => {
    if (home) return;
    const reduced = reduce();
    if (!location.hash) window.scrollTo(0, 0);
    let lenis: Lenis | null = null; let frame = 0;
    if (!reduced) {
      lenis = new Lenis({ duration: 1.2, anchors: true, smoothWheel: true });
      lenis.scrollTo(location.hash || 0, { immediate: true, force: true });
      const raf = (time: number) => { lenis?.raf(time); frame = requestAnimationFrame(raf); };
      frame = requestAnimationFrame(raf);
    }

    const show = (el: Element) => el.classList.add('is-in');
    const watched = new WeakSet<Element>();
    // threshold 0 (not a ratio): a tall element can never reach 8% visibility, and a pixel inside the margin is enough.
    // Elements already above the viewport (scroll restore, hash jumps) count as revealed.
    const observer = !reduced && 'IntersectionObserver' in window
      ? new IntersectionObserver(entries => entries.forEach(entry => {
          if (entry.isIntersecting || entry.boundingClientRect.top < 0) { show(entry.target); observer?.unobserve(entry.target); }
        }), { rootMargin: '0px 0px -6% 0px', threshold: 0 })
      : null;
    const scan = () => document.querySelectorAll<HTMLElement>('[data-reveal]:not(.is-in)').forEach(el => { if (!watched.has(el)) { watched.add(el); observer?.observe(el); } });
    // Safety net: anything still hidden that is in or above the viewport is forced visible.
    const sweep = () => document.querySelectorAll<HTMLElement>('[data-reveal]:not(.is-in)').forEach(el => { if (el.getBoundingClientRect().top < innerHeight) show(el); });

    scan();
    let pending = 0;
    const mutations = new MutationObserver(() => { cancelAnimationFrame(pending); pending = requestAnimationFrame(scan); });
    mutations.observe(document.body, { childList: true, subtree: true });
    const timer = window.setTimeout(sweep, SAFETY_MS);
    window.addEventListener('load', sweep, { once: true });
    let alive = true;
    document.fonts?.ready.then(() => { if (alive) { scan(); window.setTimeout(sweep, SAFETY_MS); } });

    return () => {
      alive = false;
      cancelAnimationFrame(frame); cancelAnimationFrame(pending); window.clearTimeout(timer);
      window.removeEventListener('load', sweep);
      lenis?.destroy(); observer?.disconnect(); mutations.disconnect();
    };
  }, [pathname]);
  return null;
}
