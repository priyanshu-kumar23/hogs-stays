// External Instagram link: opens in a new tab, never leaks the opener, always labelled for screen readers.
export default function InstagramLink({ href, label, children = 'Instagram', className }: { href: string; label: string; children?: string; className?: string }) {
  return <a className={className} href={href} target="_blank" rel="noopener noreferrer" aria-label={`${label} (opens in a new tab)`}>{children} <span aria-hidden="true">↗</span></a>;
}
