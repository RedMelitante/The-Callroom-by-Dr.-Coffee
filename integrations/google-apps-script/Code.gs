/*******************************************************************
 * Coffee Cart & Events Booking — Backend (Google Apps Script)
 *
 * WHAT THIS DOES
 * - Customers pick an event date, then a 30-minute time slot (default
 *   business hours: 7:00 AM to 8:30 PM), a package tier, guest count,
 *   and event location.
 * - There is only ONE cart/team. Time slots are NOT exclusive — more
 *   than one customer can request the same slot on purpose. Dates are
 *   not blocked either, even a configured "closed" weekday — the
 *   customer just sees a heads-up that the business is normally closed
 *   that day, but can still submit the request. This is all
 *   intentional: the business would rather see every request and have
 *   staff sort out any overlap or off-day request by phone than have
 *   the system silently turn someone away.
 * - Every request is turned into a "PENDING" event (colored yellow) on
 *   the single Google Calendar, covering that slot's 30 minutes.
 *   Overlapping requests simply create overlapping calendar events —
 *   that's how staff see there's a clash to resolve by phone.
 * - The staff member gets an email the moment a request comes in,
 *   calls the customer to confirm real details (final headcount,
 *   exact address, setup time, add-ons, and to resolve any overlapping
 *   request for the same slot), then edits the calendar event directly
 *   (rename, recolor, resize/move) as needed. No auto-expiry — pending
 *   events sit until dealt with.
 *
 * PACKAGES LIVE IN WORDPRESS, NOT HERE
 * - Package names, prices, descriptions, and what's included are
 *   managed in the WordPress plugin's settings page (Settings →
 *   Coffee Cart Booking → Manage Packages), so staff can add, edit,
 *   or remove packages without a developer touching any code.
 * - The widget sends whichever package label the customer picked
 *   along with the booking request (see createBookingRequest below);
 *   this backend just records it on the calendar event and in the
 *   staff email. It never needs to know the package list itself.
 *
 * SETUP
 * 1. Fill in CONFIG below: notification email + the cart's Calendar ID
 *    + business hours (if different from the 7 AM–8:30 PM default).
 * 2. In this Apps Script project: Project Settings (gear icon) > set
 *    the project Time Zone to match the business (e.g. Asia/Manila).
 *    Apps Script's Date object behaves relative to this setting, not
 *    the visitor's browser — skip this and every slot will be off by
 *    however many hours separate the timezones.
 * 3. Deploy > New deployment > type "Web app".
 *      Execute as: Me
 *      Who has access: Anyone
 * 4. Copy the Web App URL it gives you and paste it into the
 *    WordPress plugin's Settings > Coffee Cart Booking page.
 *******************************************************************/

const CONFIG = {
  // Comma-separated: MailApp.sendEmail sends to every address listed.
  notifyEmail: 'thecallroombydc@gmail.com,redmelitante@gmail.com',
  calendarId: '43261ef8e230713b8d282462c5ef2f328d84167e31f497ee66df7df1988c0571@group.calendar.google.com',

  // null = no designated day off. Set 0-6 (0=Sunday) to flag one weekday
  // as normally closed. This does NOT block booking that day — it only
  // adds a heads-up message to the response so the widget can show the
  // customer something like "we're normally closed this day" while
  // still letting them submit the request. See getAvailability() below.
  closedWeekday: null,

  // Business hours the cart can be booked. Time slots are generated
  // from these three values at request time — to change hours or slot
  // length, edit these, nothing else.
  //   start / end : 24-hour "HH:MM". `end` is when the LAST slot ends,
  //                 not when it starts (e.g. end: '20:30' with 30-
  //                 minute slots means the last bookable slot is
  //                 8:00 PM–8:30 PM).
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
      // Kept for backward compatibility with older widget builds — only
      // returns time slots now. Package tiers live in WordPress (see the
      // note at the top of this file).
      return jsonOutput({ sessions: buildTimeSlots() });
    }
    return jsonOutput({ error: 'Unknown action' });
  } catch (err) {
    return jsonOutput({ error: String(err) });
  }
}

function doPost(e) {
  try {
    const body = JSON.parse(e.postData.contents);
    if (body.action === 'book') {
      return jsonOutput(createBookingRequest(body));
    }
    if (body.action === 'order') {
      return jsonOutput(createOrderRequest(body));
    }
    if (body.action === 'cancel') {
      return jsonOutput(cancelBookingRequest(body));
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

  // Neither the date nor the time slots are ever blocked — every slot
  // is offered for every date, regardless of what's already on the
  // calendar or whether this is the business's usual day off. Staff
  // resolve any overlapping or off-day requests by phone, so there's
  // nothing here to filter out or turn away.
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
  const date = body.date;
  const sessionId = body.session;
  // The widget sends both the package id (for its own bookkeeping) and
  // the package label (what to actually show/record) — packages
  // themselves are configured in WordPress, not in this file.
  const packageLabel = (body.packageLabel || body.package || '').toString().trim();
  const guestCount = body.guestCount;
  const location = body.location;
  const name = body.name;
  const phone = body.phone;
  const note = body.note;

  if (!date || !sessionId || !packageLabel || !location || !name || !phone) {
    return { error: 'MISSING_FIELDS', message: 'Please fill in the event location, your name, and phone number.' };
  }

  const slot = buildTimeSlots().filter(function (s) { return s.id === sessionId; })[0];
  if (!slot) return { error: 'INVALID_SESSION', message: 'Please pick a valid time.' };

  const parsedDate = parseDateOnly(date);
  const slotStart = combineDateAndTime(parsedDate, slot.startTime);
  const slotEnd = combineDateAndTime(parsedDate, slot.endTime);

  const cal = CalendarApp.getCalendarById(CONFIG.calendarId);
  if (!cal) return { error: 'CONFIG_ERROR', message: 'Booking system is misconfigured. Please contact us directly.' };

  // Intentionally no "is this slot already taken" check — time slots
  // are not exclusive. Every request becomes its own PENDING event, and
  // if two requests land on the same slot, both events show up on the
  // calendar (overlapping) so staff can see and resolve it by phone.
  const title = 'PENDING - ' + name + ' (' + packageLabel + ')';
  const descriptionLines = [
    'Package: ' + packageLabel,
    'Guest count: ' + (guestCount || 'not specified'),
    'Location: ' + location,
    'Phone: ' + phone,
    note ? ('Note from customer: ' + note) : '',
    '',
    'Status: Waiting for phone confirmation.',
  ].filter(function (line) { return line !== ''; });

  const event = cal.createEvent(title, slotStart, slotEnd, { description: descriptionLines.join('\n'), location: location });
  event.setColor(CalendarApp.EventColor.YELLOW);

  // A random code, stored only on this calendar event and in the customer's
  // browser, lets the customer cancel this booking from the website's
  // My account page (see cancelBookingRequest below).
  const cancelToken = Utilities.getUuid();
  event.setTag('cancelToken', cancelToken);
  event.setTag('status', 'pending');

  notifyStaff(name, phone, date, slot.label, packageLabel, guestCount, location, note);

  return {
    success: true,
    message: 'Request received! We will call you shortly to confirm your booking.',
    bookingId: event.getId(),
    cancelToken: cancelToken,
  };
}

function notifyStaff(name, phone, date, sessionLabel, packageLabel, guestCount, location, note) {
  const subject = 'New booking request: ' + name + ' — ' + date + ' (' + sessionLabel + ')';
  const bodyLines = [
    'A new pending booking request came in:',
    '',
    'Customer: ' + name,
    'Phone: ' + phone,
    'Date: ' + date,
    'Time: ' + sessionLabel,
    'Package: ' + packageLabel,
    'Guest count: ' + (guestCount || 'not specified'),
    'Location: ' + location,
    note ? ('Note: ' + note) : '',
    '',
    'Note: time slots are not exclusive — check the calendar for this date/time',
    'in case another request came in for the same slot, and confirm with both',
    'customers as needed. Then update the calendar event (rename it, change its',
    'color, or drag its edges to resize) as usual.',
  ].filter(function (line) { return line !== ''; });

  MailApp.sendEmail(CONFIG.notifyEmail, subject, bodyLines.join('\n'));
}

/* ================= Booking cancellation ================= */

// Called from the website's My account page. Needs the bookingId and the
// cancelToken returned when the booking was made, so only the customer who
// made the booking can cancel it. The event is kept on the calendar, renamed
// "CANCELLED - …" and colored red, and staff get an email.
function cancelBookingRequest(body) {
  const bookingId = sanitize(body.bookingId, 300);
  const cancelToken = sanitize(body.cancelToken, 100);
  const reason = sanitize(body.reason, 500);

  if (!bookingId || !cancelToken) {
    return { error: 'MISSING_FIELDS', message: 'This booking can\'t be cancelled online. Please call or message us.' };
  }

  const cal = CalendarApp.getCalendarById(CONFIG.calendarId);
  if (!cal) return { error: 'CONFIG_ERROR', message: 'Booking system is misconfigured. Please contact us directly.' };

  let event = null;
  try {
    event = cal.getEventById(bookingId);
  } catch (err) {
    event = null;
  }
  // Same answer for "no such booking" and "wrong code", so codes can't be guessed.
  if (!event || event.getTag('cancelToken') !== cancelToken) {
    return { error: 'NOT_FOUND', message: 'We couldn\'t find this booking. Please call or message us to cancel.' };
  }

  if (event.getTag('status') === 'cancelled') {
    return { success: true, message: 'This booking was already cancelled.' };
  }
  if (event.getStartTime().getTime() < Date.now()) {
    return { error: 'TOO_LATE', message: 'This booking date has passed. Please call or message us.' };
  }

  const oldTitle = event.getTitle();
  const cancelledAt = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'yyyy-MM-dd h:mm a');
  event.setTitle('CANCELLED - ' + oldTitle.replace(/^(PENDING|CONFIRMED|CANCELLED)\s*-\s*/i, ''));
  event.setColor(CalendarApp.EventColor.RED);
  event.setDescription(
    'CANCELLED by the customer on the website (' + cancelledAt + ').' +
    (reason ? '\nReason: ' + reason : '') + '\n\n' + event.getDescription()
  );
  event.setTag('status', 'cancelled');

  const when = Utilities.formatDate(event.getStartTime(), Session.getScriptTimeZone(), 'yyyy-MM-dd h:mm a');
  const subject = oneLine('Booking cancelled by customer: ' + oldTitle.replace(/^(PENDING|CONFIRMED)\s*-\s*/i, '') + ' — ' + when);
  const bodyLines = [
    'A customer cancelled their coffee cart booking on the website.',
    '',
    'Booking: ' + oldTitle,
    'Date/time: ' + when,
    reason ? ('Reason: ' + reason) : '',
    '',
    'The calendar event is now marked CANCELLED (red). Delete it whenever you like.',
    '',
    'Booking details:',
    event.getDescription(),
  ].filter(function (line, i, arr) { return line !== '' || (arr[i - 1] !== '' && arr[i - 1] !== undefined); });

  MailApp.sendEmail(CONFIG.notifyEmail, subject, bodyLines.join('\n'));

  return { success: true, message: 'Your booking request has been cancelled.' };
}

/* ================= Order creation ================= */

// Pickup / delivery orders from the website. Email only — no calendar
// event. Accepts the order either nested under `body.order` (what the
// website sends) or as top-level fields on `body`.
function createOrderRequest(body) {
  const o = (body.order && typeof body.order === 'object') ? body.order : body;

  const name = sanitize(o.name, 100);
  const phone = sanitize(o.phone, 30);
  const email = sanitize(o.email, 120);
  const orderNo = sanitize(o.no || o.orderNo, 20);
  const fulfillment = sanitize(o.fulfillment, 100) || 'Pickup';
  const address = sanitize(o.address, 300);
  const pickupDay = sanitize(o.when, 20);
  const pickupTime = sanitize(o.slot, 30);
  const payment = sanitize(o.pay || o.payment, 30);
  const note = sanitize(o.note, 1000);
  const total = toAmount(o.total);
  const items = (Array.isArray(o.items) ? o.items : []).slice(0, 50).map(function (i) {
    return {
      name: sanitize(i && i.name, 80),
      qty: Math.max(1, Math.min(99, parseInt(i && i.qty, 10) || 1)),
      options: sanitize(i && (i.opts || i.options), 150),
      total: toAmount(i && (i.total !== undefined ? i.total : i.price)),
    };
  }).filter(function (i) { return i.name; });

  if (!name || !phone || !items.length) {
    return { error: 'MISSING_FIELDS', message: 'Please provide your name, phone number, and order items.' };
  }

  const when = [pickupDay, pickupTime].filter(function (v) { return v; }).join(', ');
  const subject = oneLine('New order' + (orderNo ? ' ' + orderNo : '') + ': ' + name + (when ? ' — ' + when : ''));
  const bodyLines = ['A new order came in:', ''];
  if (orderNo) bodyLines.push('Order no.: ' + orderNo);
  bodyLines.push('Customer: ' + name);
  bodyLines.push('Phone: ' + phone);
  bodyLines.push('Email: ' + (email || 'not provided'));
  bodyLines.push('Fulfillment: ' + fulfillment + (when ? ' — ' + when : ''));
  if (address) bodyLines.push('Address: ' + address);
  if (payment) bodyLines.push('Payment: ' + payment);
  if (note) bodyLines.push('Note: ' + note);
  bodyLines.push('', 'Items:');
  items.forEach(function (i) {
    bodyLines.push('- ' + i.qty + ' × ' + i.name + (i.options ? ' (' + i.options + ')' : '') + (i.total !== null ? ' — ₱' + i.total : ''));
  });
  bodyLines.push('', 'Total: ' + (total !== null ? '₱' + total : 'not provided'));

  MailApp.sendEmail(CONFIG.notifyEmail, subject, bodyLines.join('\n'));

  return {
    success: true,
    message: 'Order received! We will have it ready for you.',
  };
}

// Trims, removes control characters (newlines included) and caps length.
function sanitize(value, maxLength) {
  if (value === undefined || value === null) return '';
  return String(value).replace(/[\u0000-\u001F\u007F]+/g, ' ').replace(/\s+/g, ' ').trim().slice(0, maxLength);
}

function oneLine(value) {
  return sanitize(value, 200);
}

// Returns a non-negative amount rounded to 2 decimals, or null if not a number.
function toAmount(value) {
  const n = Number(value);
  if (!isFinite(n) || n < 0) return null;
  return Math.round(n * 100) / 100;
}

/* ================= Time slot helpers ================= */

// Builds the list of bookable time slots for a day from
// CONFIG.bookingHours. Pure function of CONFIG — no calendar lookups —
// since slots are the same every open day and are never filtered by
// what's already booked.
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
      id: slotStart,                       // e.g. '07:00' — stable, sortable, used by the widget
      label: formatTime12h(slotStart),     // e.g. '7:00 AM' — shown to the customer (just the start time, not the full range)
      // 'AM' or 'PM', based on the slot's START time. Lets the widget
      // ask "AM or PM?" first and only show matching slots, instead of
      // listing all ~27 at once. A slot straddling noon (11:30 AM–12:00
      // PM) is grouped under AM since that's when it starts.
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
