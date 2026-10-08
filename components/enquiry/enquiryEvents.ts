// Any "Book / Enquire" button anywhere on the page opens the one <BookingEnquiry /> mounted on that page by firing this window event.
export const ENQUIRE_EVENT = 'hogs:enquire';
export type EnquireDetail = { room?: string; trigger?: Element | null };
export const openEnquiry = (detail: EnquireDetail = {}) => window.dispatchEvent(new CustomEvent<EnquireDetail>(ENQUIRE_EVENT, { detail }));
