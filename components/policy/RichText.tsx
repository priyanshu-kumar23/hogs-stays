import Link from 'next/link';
import type { ReactNode } from 'react';

// Tiny inline renderer for policy / FAQ strings: **bold** and [label](href). Internal links use next/link; http(s) links open in a new tab.
const pattern = /(\*\*[^*]+\*\*|\[[^\]]+\]\([^)]+\))/g;
export default function RichText({ text }: { text: string }) {
  const nodes: ReactNode[] = text.split(pattern).filter(Boolean).map((part, index) => {
    if (part.startsWith('**')) return <strong key={index}>{part.slice(2, -2)}</strong>;
    const link = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (link) {
      const [, label, href] = link;
      return /^https?:|^mailto:|^tel:/.test(href)
        ? <a key={index} href={href} target={href.startsWith('http') ? '_blank' : undefined} rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}>{label}</a>
        : <Link key={index} href={href}>{label}</Link>;
    }
    return part;
  });
  return <>{nodes}</>;
}
