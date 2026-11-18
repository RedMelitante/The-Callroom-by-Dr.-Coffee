// Opening hours, in Manila time (UTC+8, no daylight saving): Mon–Sat 6:00 AM – 6:00 PM, closed Sundays.
export const OPEN_HOUR = 6;
export const CLOSE_HOUR = 18;
export const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

/** Current Manila wall-clock time as { day, minutes }. */
export function manilaNow(date = new Date()) {
  const m = new Date(date.getTime() + (date.getTimezoneOffset() + 480) * 60000);
  return { day: m.getDay(), minutes: m.getHours() * 60 + m.getMinutes(), date: m };
}

export function isOpen(now = manilaNow()) {
  return now.day !== 0 && now.minutes >= OPEN_HOUR * 60 && now.minutes < CLOSE_HOUR * 60;
}

export const todayName = (now = manilaNow()) => DAYS[now.day];

export function fmt(minutes) {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${((h + 11) % 12) + 1}:${String(m).padStart(2, '0')} ${h < 12 ? 'AM' : 'PM'}`;
}

/** Pickup slots for today in 15-minute steps, starting 15+ minutes from now and ending 15 minutes before close. */
export function pickupSlots(now = manilaNow()) {
  if (now.day === 0 || now.minutes >= CLOSE_HOUR * 60 - 15) return [];
  const start = Math.max(OPEN_HOUR * 60, Math.ceil((now.minutes + 15) / 15) * 15);
  const slots = [];
  for (let t = start; t <= CLOSE_HOUR * 60 - 15; t += 15) slots.push(fmt(t));
  return slots;
}

/** Status pill text and colours, matching the design's open/closed pills. */
export function status(short = false, now = manilaNow()) {
  if (isOpen(now)) return { open: true, label: short ? 'Open · til 6PM' : 'Open · until 6PM', bg: '#DCEBE8', fg: '#1F4F4B', dot: '#2F8F6A' };
  const afterClose = now.minutes >= CLOSE_HOUR * 60;
  const when = now.day === 0 || (now.day === 6 && afterClose) ? 'Mon 6AM' : '6AM';
  return { open: false, label: `Closed · opens ${when}`, bg: '#F3DCD3', fg: '#7A2E1C', dot: '#B5432A' };
}

/** Pickup day and slots: today if there is still time, otherwise the next opening day from 6:00 AM. */
export function pickupSchedule(now = manilaNow()) {
  const today = pickupSlots(now);
  if (today.length) return { when: 'Today', heading: 'Pick a time today', slots: ['ASAP · ~15 min', ...today] };
  let day = (now.day + 1) % 7;
  if (day === 0) day = 1;
  const slots = pickupSlots({ day, minutes: 0 });
  const when = day === (now.day + 1) % 7 ? 'Tomorrow' : DAYS[day];
  return { when, heading: `Pick a time for ${when.toLowerCase() === 'tomorrow' ? 'tomorrow' : when}`, slots };
}
