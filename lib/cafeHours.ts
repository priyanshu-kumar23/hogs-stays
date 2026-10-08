import { cafeHours } from './content';

// Open/closed is always worked out in the cafe's own time zone (Asia/Kolkata), never the visitor's.
const toMinutes = (hhmm: string) => { const [h, m] = hhmm.split(':').map(Number); return h * 60 + m; };

/** Minutes since midnight in the cafe's time zone. */
export function minutesInCafeZone(now: Date = new Date()) {
  const parts = new Intl.DateTimeFormat('en-GB', { timeZone: cafeHours.timeZone, hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).formatToParts(now);
  const get = (type: string) => Number(parts.find(part => part.type === type)?.value ?? 0);
  return (get('hour') % 24) * 60 + get('minute');
}

/** True from opening time up to (not including) closing time, every day of the week. */
export function isCafeOpen(now: Date = new Date()) {
  const minutes = minutesInCafeZone(now);
  return minutes >= toMinutes(cafeHours.opens) && minutes < toMinutes(cafeHours.closes);
}
export const cafeStatusLabel = (open: boolean) => (open ? 'Open now' : `Closed — opens at ${cafeHours.opensLabel}`);
