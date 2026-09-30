'use client';
import { usePathname } from 'next/navigation';
import { motion, useReducedMotion } from 'framer-motion';
import SubpageEffects from '@/components/ui/SubpageEffects';
// Re-mounted on every navigation: a short fade (<600ms). Opacity only, so the fixed WebGL
// layer and GSAP pin-spacers on the home page are never inside a transformed ancestor.
export default function Template({ children }: { children: React.ReactNode }) {
  const reduced = useReducedMotion(); const pathname = usePathname();
  return <motion.div className="page-transition" initial={reduced ? false : { opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: reduced ? 0 : .45, ease: 'easeOut' }}>{pathname !== '/' && <SubpageEffects />}{children}</motion.div>;
}
