'use client';
import { createContext, useContext } from 'react';

// The music context lives in its own file so MusicProvider (which renders the widget) and its consumers (the widget, the Cafe playlist box)
// never import each other: a circular import can give hot reload two copies of this module, and then useMusic() can't find the provider.
export type MusicContext = {
  onCafe: boolean; visible: boolean; entering: boolean; playing: boolean; ready: boolean; failed: boolean; expanded: boolean;
  setExpanded: (value: boolean) => void; play: () => void; toggle: () => void; dismiss: () => void;
  registerSlot: (el: HTMLElement | null) => void; registerPanel: (el: HTMLElement | null) => void;
};

const noop = () => {};
/** What consumers get when there is no provider: everything off, every control a no-op. A wiring mistake must never crash the page. */
const fallback: MusicContext = {
  onCafe: false, visible: false, entering: false, playing: false, ready: false, failed: false, expanded: false,
  setExpanded: noop, play: noop, toggle: noop, dismiss: noop, registerSlot: noop, registerPanel: noop,
};

export const Ctx = createContext<MusicContext | null>(null);
let warned = false;
export function useMusic(): MusicContext {
  const value = useContext(Ctx);
  if (value) return value;
  if (process.env.NODE_ENV !== 'production' && !warned) { warned = true; console.warn('useMusic() was called outside <MusicProvider>; using inert defaults. Check app/layout.tsx.'); }
  return fallback;
}
