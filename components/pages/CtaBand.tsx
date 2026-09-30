import Link from 'next/link';
import Icon from '@/components/ui/Icon';
export default function CtaBand({ eyebrow, title, href, label, secondary }: { eyebrow: string; title: [string, string]; href: string; label: string; secondary?: { href: string; label: string } }) {
  return <section className="section cta-band"><p className="eyebrow">{eyebrow}</p><h2>{title[0]}<br /><em>{title[1]}</em></h2><div className="cta-actions"><Link className="button" href={href}>{label} <Icon /></Link>{secondary && <Link className="button outline" href={secondary.href}>{secondary.label}</Link>}</div></section>;
}
