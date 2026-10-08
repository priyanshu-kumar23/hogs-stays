import SubpageEffects from '@/components/ui/SubpageEffects';
// Re-mounted on navigation between top-level routes: a short fade (<600ms), done in CSS (.page-transition in pages.css) so the server HTML is
// fully visible and a slow or failed hydration can never leave the page blank. Opacity only, so the fixed WebGL layer and GSAP pin-spacers
// on the home page are never inside a transformed ancestor. SubpageEffects keys its work on the pathname itself (this component is NOT
// remounted between sibling routes such as /stays -> /stays/panorama).
export default function Template({ children }: { children: React.ReactNode }) {
  return <div className="page-transition"><SubpageEffects />{children}</div>;
}
