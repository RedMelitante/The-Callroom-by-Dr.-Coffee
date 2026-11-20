/*******************************************************************
 * The Callroom by Dr. Coffee — Coffee Cart & Orders Backend
 * (Google Apps Script, owned and deployed by redmelitante@gmail.com)
 *
 * Based on the "Coffee Cart & Events Booking" backend already deployed
 * for this site, extended so it also handles pickup orders.
 *
 * WHAT THIS DOES
 * - COFFEE CART BOOKINGS (POST action "book"):
 *   - The website sends the event date, a 30-minute time slot (default
 *     business hours: 7:00 AM to 8:30 PM), the package, guest count,
 *     venue and contact details.
 *   - There is only ONE cart/team. Time slots are NOT exclusive — more
 *     than one customer can request the same slot on purpose. Dates are
 *     not blocked either, even a configured "closed" weekday. Staff sort
 *     out any overlap or off-day request by phone.
 *   - Every request becomes a "PENDING" event (colored yellow) on the
 *     cart's Google Calendar, covering that slot's 30 minutes.
 *     Overlapping requests simply create overlapping events.
 *   - An email goes to every address in CONFIG.notifyEmails.
 *   - Staff call the customer to confirm the details, then edit the
 *     calendar event directly (rename, recolor, resize/move).
 * - PICKUP ORDERS (POST action "order"):
 *   - An email goes to every address in CONFIG.notifyEmails.
 *   - No calendar event.
 *
 * PACKAGES LIVE ON THE WEBSITE, NOT HERE
 * - The website sends the package label the customer picked; this
 *   backend just records it on the calendar event and in the email.
 *
 * SETUP
 * 1. Check CONFIG below: notification emails, the cart's Calendar ID,
 *    and business hours.
 * 2. Project Settings (gear icon) > set the project Time Zone to
 *    Asia/Manila. Apps Script dates follow this setting, not the
 *    visitor's browser — skip this and every slot will be off.
 * 3. Deploy > New deployment (or Manage deployments > Edit > New
 *    version to keep the same URL) > type "Web app".
 *      Execute as: Me
 *      Who has access: Anyone
 * 4. Put the Web App URL in the website's PUBLIC_FORMS_ENDPOINT
 *    variable (Railway) and redeploy the website.
 *******************************************************************/

const CONFIG = {
  // Everyone here gets every booking and order email.
  // The first address is "To", the rest are CC.
  notifyEmails: ['thecallroombydc@gmail.com', 'redmelitante@gmail.com'],

  calendarId: '43261ef8e230713b8d282462c5ef2f328d84167e31f497ee66df7df1988c0571@group.calendar.google.com',

  // null = no designated day off. Set 0-6 (0=Sunday) to flag one weekday
  // as normally closed. This does NOT block booking that day — it only
  // adds a heads-up message to the availability response.
  closedWeekday: null,

  // Business hours the cart can be booked. Time slots are generated
  // from these three values at request time.
  //   start / end : 24-hour "HH:MM". `end` is when the LAST slot ends.
  //   slotMinutes : length of each slot, in minutes.
  bookingHours: {
    start: '07:00',
    end: '20:30',
    slotMinutes: 30,
  },
};

/* ================= Web app entry points ================= */

function doGet(e) {
  try {
    const action = e.parameter.action;
    if (action === 'availability') {
      const date = e.parameter.date; // 'YYYY-MM-DD'
      return jsonOutput(getAvailability(date));
    }
    if (action === 'packages') {
      // Kept for backward compatibility — only returns time slots.
      return jsonOutput({ sessions: buildTimeSlots() });
    }
    return jsonOutput({ error: 'Unknown action' });
  } catch (err) {
    return jsonOutput({ error: String(err) });
  }
}

function doPost(e) {
  try {
    const raw = e.postData && e.postData.contents;
    if (!raw || raw.length > 20000) return jsonOutput({ error: 'BAD_REQUEST' });
    const body = JSON.parse(raw);
    if (body.action === 'book') {
      return jsonOutput(createBookingRequest(body));
    }
    if (body.action === 'order') {
      return jsonOutput(createOrderNotification(body));
    }
    return jsonOutput({ error: 'Unknown action' });
  } catch (err) {
    return jsonOutput({ error: String(err) });
  }
}

function jsonOutput(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

/* ================= Availability ================= */

function getAvailability(dateStr) {
  if (!dateStr) return { error: 'Missing date' };

  const date = parseDateOnly(dateStr);
  const slots = buildTimeSlots();

  // Neither the date nor the time slots are ever blocked.
  if (CONFIG.closedWeekday !== null && date.getDay() === CONFIG.closedWeekday) {
    return {
      sessions: slots,
      message: "We're normally closed this day, but go ahead and request a time — we'll call to confirm.",
    };
  }

  return { sessions: slots };
}

/* ================= Booking creation ================= */

function createBookingRequest(body) {
  const date = clean(body.date, 10);
  const sessionId = clean(body.session, 5);
  const packageLabel = clean(body.packageLabel || body.package, 80);
  const guestCount = clean(body.guestCount, 10);
  const location = clean(body.location, 200);
  const name = clean(body.name, 100);
  const phone = clean(body.phone, 30);
  const email = clean(body.email, 120);
  const note = clean(body.note, 1500);

  if (!date || !sessionId || !packageLabel || !location || !name || !phone) {
    return { error: 'MISSING_FIELDS', message: 'Please fill in the event location, your name, and phone number.' };
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return { error: 'INVALID_DATE', message: 'Please pick a valid date.' };

  const slot = buildTimeSlots().filter(function (s) { return s.id === sessionId; })[0];
  if (!slot) return { error: 'INVALID_SESSION', message: 'Please pick a valid time.' };

  const parsedDate = parseDateOnly(date);
  const slotStart = combineDateAndTime(parsedDate, slot.startTime);
  const slotEnd = combineDateAndTime(parsedDate, slot.endTime);

  const cal = CalendarApp.getCalendarById(CONFIG.calendarId);
  if (!cal) return { error: 'CONFIG_ERROR', message: 'Booking system is misconfigured. Please contact us directly.' };

  // Intentionally no "is this slot already taken" check — time slots
  // are not exclusive.
  const title = 'PENDING - ' + name + ' (' + packageLabel + ')';
  const descriptionLines = [
    'Package: ' + packageLabel,
    'Guest count: ' + (guestCount || 'not specified'),
    'Location: ' + location,
    'Phone: ' + phone,
    email ? ('Email: ' + email) : '',
    note ? ('Note from customer: ' + note) : '',
    '',
    'Status: Waiting for phone confirmation.',
  ].filter(function (line) { return line !== ''; });

  const event = cal.createEvent(title, slotStart, slotEnd, { description: descriptionLines.join('\n'), location: location });
  event.setColor(CalendarApp.EventColor.YELLOW);

  notifyStaff(name, phone, email, date, slot.label, packageLabel, guestCount, location, note);

  return {
    success: true,
    message: 'Request received! We will call you shortly to confirm your booking.',
  };
}

function notifyStaff(name, phone, email, date, sessionLabel, packageLabel, guestCount, location, note) {
  const subject = 'New booking request: ' + name + ' — ' + date + ' (' + sessionLabel + ')';
  const bodyLines = [
    'A new pending booking request came in:',
    '',
    'Customer: ' + name,
    'Phone: ' + phone,
    email ? ('Email: ' + email) : '',
    'Date: ' + date,
    'Time: ' + sessionLabel,
    'Package: ' + packageLabel,
    'Guest count: ' + (guestCount || 'not specified'),
    'Location: ' + location,
    note ? ('Note: ' + note) : '',
    '',
    'Added to the calendar as a yellow PENDING event.',
    'Note: time slots are not exclusive — check the calendar for this date/time',
    'in case another request came in for the same slot, and confirm with both',
    'customers as needed. Then update the calendar event (rename it, change its',
    'color, or drag its edges to resize) as usual.',
  ].filter(function (line) { return line !== ''; });

  sendToStaff(subject, bodyLines.join('\n'), email);
}

/* ================= Pickup orders (email only) ================= */

function createOrderNotification(body) {
  const o = body.order || {};
  const orderNo = clean(o.no, 20);
  const name = clean(o.name, 100);
  const phone = clean(o.phone, 30);
  const email = clean(o.email, 120);
  const when = clean(o.when, 20);
  const slot = clean(o.slot, 30);
  const pay = clean(o.pay, 20);
  const items = Array.isArray(o.items) ? o.items.slice(0, 50) : [];

  if (!orderNo || !name || !phone || !items.length) {
    return { error: 'MISSING_FIELDS', message: 'Please fill in your name and mobile number, and add a drink.' };
  }

  const itemLines = items.map(function (i) {
    return clean(i.qty, 4) + ' × ' + clean(i.name, 80) + ' (' + clean(i.opts, 120) + ') — ₱' + clean(i.total, 10);
  });

  const subject = 'New pickup order ' + orderNo + ': ' + name + ' — ' + when + ', ' + slot;
  const bodyLines = [
    'A new pickup order came in:',
    '',
    'Order no.: ' + orderNo,
    'Customer: ' + name,
    'Phone: ' + phone,
    email ? ('Email: ' + email) : '',
    'Pickup: ' + when + ', ' + slot,
    'Payment: ' + pay + ' (pay at pickup)',
    'Text when ready: ' + (o.notify ? 'Yes' : 'No'),
  ].filter(function (line) { return line !== ''; })
    .concat([''], itemLines, ['', 'Total: ₱' + clean(o.total, 10)]);

  sendToStaff(subject, bodyLines.join('\n'), email);

  return { success: true, message: 'Order received!' };
}

/* ================= Email ================= */

// Sends to CONFIG.notifyEmails: the first address is "To", the rest CC.
// Recipients always come from CONFIG, never from the request.
function sendToStaff(subject, body, customerEmail) {
  const to = CONFIG.notifyEmails[0];
  const options = { name: 'The Callroom website' };
  if (CONFIG.notifyEmails.length > 1) options.cc = CONFIG.notifyEmails.slice(1).join(',');
  if (/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(customerEmail || '')) options.replyTo = customerEmail;
  MailApp.sendEmail(to, oneLine(subject), body, options);
}

/* ================= Time slot helpers ================= */

// Builds the list of bookable time slots for a day from CONFIG.bookingHours.
function buildTimeSlots() {
  const hours = CONFIG.bookingHours;
  const step = hours.slotMinutes;
  const startMinutes = timeStrToMinutes(hours.start);
  const endMinutes = timeStrToMinutes(hours.end);

  const slots = [];
  for (let m = startMinutes; m + step <= endMinutes; m += step) {
    const slotStart = minutesToTimeStr(m);
    const slotEnd = minutesToTimeStr(m + step);
    slots.push({
      id: slotStart,                       // e.g. '07:00' — sent by the website as `session`
      label: formatTime12h(slotStart),     // e.g. '7:00 AM'
      period: formatTime12hParts(slotStart).period,
      startTime: slotStart,
      endTime: slotEnd,
    });
  }
  return slots;
}

function timeStrToMinutes(timeStr) {
  const parts = timeStr.split(':').map(Number);
  return parts[0] * 60 + parts[1];
}

function minutesToTimeStr(totalMinutes) {
  const h = Math.floor(totalMinutes / 60);
  const m = totalMinutes % 60;
  return (h < 10 ? '0' : '') + h + ':' + (m < 10 ? '0' : '') + m;
}

// Returns { hour12, minuteStr, period } for a 24-hour "HH:MM" string.
function formatTime12hParts(timeStr) {
  const parts = timeStr.split(':').map(Number);
  const hour = parts[0];
  const minute = parts[1];
  const period = hour >= 12 ? 'PM' : 'AM';
  let hour12 = hour % 12;
  if (hour12 === 0) hour12 = 12;
  const minuteStr = (minute < 10 ? '0' : '') + minute;
  return { hour12: hour12, minuteStr: minuteStr, period: period };
}

function formatTime12h(timeStr) {
  const p = formatTime12hParts(timeStr);
  return p.hour12 + ':' + p.minuteStr + ' ' + p.period;
}

/* ================= Date helpers ================= */

function parseDateOnly(dateStr) {
  const parts = dateStr.split('-').map(Number);
  return new Date(parts[0], parts[1] - 1, parts[2]);
}

function combineDateAndTime(dateObj, timeStr) {
  const parts = timeStr.split(':').map(Number);
  const result = new Date(dateObj);
  result.setHours(parts[0], parts[1], 0, 0);
  return result;
}

/* ================= Input helpers ================= */

function clean(value, max) {
  return String(value === undefined || value === null ? '' : value).trim().slice(0, max);
}

function oneLine(value) {
  return String(value).replace(/[\r\n]+/g, ' ').slice(0, 200);
}
