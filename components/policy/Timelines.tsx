import { stayTerms } from '@/lib/policies';

// "FIG." style visuals for the Terms and Cancellation pages. Data comes from lib/policies.ts so the text can never drift from the policy wording.
export function PaymentTimeline() {
  return <figure className="pl-fig">
    <ol className="pl-steps" aria-label="Payment schedule">
      {stayTerms.payment.map((step, index) => <li key={step.when}><span className="pl-step-n" aria-hidden="true">{index + 1}</span><strong>{step.pct}</strong><span>{step.when}</span></li>)}
    </ol>
    <figcaption>FIG. 01 — Payment schedule</figcaption>
  </figure>;
}

export function CancellationTimeline() {
  return <figure className="pl-fig">
    <ol className="pl-bar" aria-label="Refund rules">
      {stayTerms.cancellation.map((rule, index) => <li key={rule.id} className={`is-${rule.id}`}><span className="pl-bar-when">{rule.bar}</span><strong>{rule.short}</strong><span className="pl-bar-n" aria-hidden="true">{index + 1}</span></li>)}
    </ol>
    <figcaption>FIG. 02 — Refund rules at a glance</figcaption>
  </figure>;
}

/** The highlighted peak-season notice (23 Dec – 1 Jan). */
export function PeakNotice() {
  return <aside className="pl-notice is-peak" role="note"><strong>{stayTerms.peakShort}</strong><span>{stayTerms.peakNotice}</span></aside>;
}
