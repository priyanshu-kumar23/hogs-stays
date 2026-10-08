import type { PolicySection } from '@/lib/policies';
import { policyContact } from '@/lib/policies';
import PolicyBlocks from './PolicyBlocks';

// One card per rule, each with a small inline SVG icon (24px, thin stroke, same style as components/ui/Icon.tsx).
const icons: Record<string, React.ReactNode> = {
  moon: <path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5Z" />,
  home: <><path d="m3 10 9-7 9 7v11H3V10Z" /><path d="M9 21v-8h6v8" /></>,
  users: <><circle cx="9" cy="8" r="3.2" /><path d="M2.5 20a6.5 6.5 0 0 1 13 0M16 5.2a3.2 3.2 0 0 1 0 5.6M18 14.2a6.5 6.5 0 0 1 3.5 5.8" /></>,
  ban: <><circle cx="12" cy="12" r="9" /><path d="m5.6 5.6 12.8 12.8" /></>,
  flame: <path d="M12 3c1 3.5 5 5.5 5 10a5 5 0 0 1-10 0c0-2 1-3 2-4 .3 1.5 1.2 2 2 2 0-3-.5-5 1-8Z" />,
  cup: <><path d="M4 9h13v6a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5V9Zm13 1h2a3 3 0 0 1 0 6h-2M7 3v3m4-3v3m4-3v3" /></>,
  leaf: <><path d="M5 19C5 10 10 5 20 4c0 10-5 15-14 15Z" /><path d="M5 19c3-5 6-8 10-10" /></>,
  shield: <path d="M12 3 4.5 6v6c0 4.5 3 7.5 7.5 9 4.5-1.5 7.5-4.5 7.5-9V6L12 3Z" />,
  phone: <path d="M6.5 3.5h3l1.5 4-2 1.5a11 11 0 0 0 6 6l1.5-2 4 1.5v3a2 2 0 0 1-2 2A16 16 0 0 1 4.5 5.5a2 2 0 0 1 2-2Z" />,
};
const Icon = ({ name }: { name: string }) => <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">{icons[name] ?? icons.shield}</svg>;

export default function HouseRulesGrid({ sections }: { sections: PolicySection[] }) {
  return <div className="pl-rules">
    {sections.map((section, index) => {
      const emergency = section.id === 'emergency-contact';
      return <section key={section.id} id={section.id} className={`pl-rule${emergency ? ' is-emergency' : ''}`} aria-labelledby={`${section.id}-t`}>
        <span className="pl-rule-icon"><Icon name={section.icon ?? 'shield'} /></span>
        <h2 id={`${section.id}-t`}><span className="pl-num">{index + 1}</span>{section.title}</h2>
        <div className="pl-rule-body"><PolicyBlocks blocks={section.blocks.filter(block => block.type !== 'contact')} /></div>
        {emergency && <div className="pl-rule-actions">
          <a className="pl-button" href={policyContact.phoneHref}>Call {policyContact.phone}</a>
          <a className="pl-button is-outline" href={policyContact.whatsappHref} target="_blank" rel="noopener noreferrer">WhatsApp <span aria-hidden="true">↗</span></a>
        </div>}
      </section>;
    })}
  </div>;
}
