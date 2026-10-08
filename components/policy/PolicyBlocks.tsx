import { policyContact, type PolicyBlock } from '@/lib/policies';
import RichText from './RichText';

/** Contact details (phone / WhatsApp, email, Instagram) as tappable rows. */
export function ContactList({ compact = false }: { compact?: boolean }) {
  const c = policyContact;
  return <ul className={`pl-contact${compact ? ' is-compact' : ''}`}>
    <li><span>Phone / WhatsApp</span><a href={c.phoneHref}>{c.phone}</a></li>
    <li><span>Email</span><a href={c.emailHref}>{c.email}</a></li>
    <li><span>Instagram</span><a href={c.instagramHref} target="_blank" rel="noopener noreferrer">{c.instagram}</a></li>
  </ul>;
}

/** Renders paragraphs, bullet lists (copper markers), notice boxes, contact lists and buttons. */
export default function PolicyBlocks({ blocks }: { blocks: PolicyBlock[] }) {
  return <>{blocks.map((block, index) => {
    if (block.type === 'p') return <p key={index}><RichText text={block.text} /></p>;
    if (block.type === 'ul') return <ul key={index} className="pl-list">{block.items.map(item => <li key={item}><RichText text={item} /></li>)}</ul>;
    if (block.type === 'note') return <aside key={index} className="pl-notice" role="note"><RichText text={block.text} /></aside>;
    if (block.type === 'cta') return <p key={index}><a className="pl-button" href={block.href} target="_blank" rel="noopener noreferrer">{block.label} <span aria-hidden="true">↗</span></a></p>;
    return <ContactList key={index} />;
  })}</>;
}
