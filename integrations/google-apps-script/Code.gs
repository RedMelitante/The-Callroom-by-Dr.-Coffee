/**
 * The Callroom by Dr. Coffee: form service for callroomcoffee.com
 *
 * Receives orders and coffee cart booking requests from the website (PUBLIC_FORMS_ENDPOINT).
 *  - Coffee cart booking → email to RECIPIENTS + an event on the shop's Google Calendar
 *  - Pickup order        → email to RECIPIENTS only
 *
 * Deploy as a web app from the shop's Google account (see README.md in this folder).
 * Recipients are set here, never taken from the request, so the script can't be used to
 * send email to anyone else.
 */

// ---- Settings -------------------------------------------------------------

/** Who gets every order and booking email. The first address is "To", the rest are CC. */
var RECIPIENTS = ['thecallroombydc@gmail.com', 'redmelitante@digitalservicesmaster.com'];

/** Calendar for bookings: 'primary' = the default calendar of the account that deploys this script. */
var CALENDAR_ID = 'primary';

/** All booking times are Manila time. */
var TIMEZONE_OFFSET = '+08:00';

/** Service hours used when a booking has no start/end time. */
var DEFAULT_HOURS = { AM: ['08:00', '12:00'], PM: ['15:00', '18:00'] };

/** Basic abuse limit: at most this many requests per 10 minutes, across the whole site. */
var MAX_REQUESTS_PER_10_MIN = 30;

// ---- Web app entry points -------------------------------------------------

function doPost(e) {
  try {
    var data = parseBody_(e);
    throttle_();
    if (data.kind === 'booking') return json_(handleBooking_(data));
    if (data.kind === 'order') return json_(handleOrder_(data));
    return json_({ ok: false, error: 'Unknown request type' });
  } catch (err) {
    console.error(err);
    return json_({ ok: false, error: String(err && err.message ? err.message : err) });
  }
}

/** Opening the web app URL in a browser shows that it's running. */
function doGet() {
  return json_({ ok: true, service: 'The Callroom form service' });
}

// ---- Handlers ---------------------------------------------------------------

function handleBooking_(data) {
  var b = data.booking || {};
  required_(b, ['date', 'session', 'name', 'phone']);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(b.date)) throw new Error('Invalid date');
  var session = b.session === 'AM' ? 'AM' : 'PM';
  var start = validTime_(b.start) || DEFAULT_HOURS[session][0];
  var end = validTime_(b.end) || DEFAULT_HOURS[session][1];
  var startAt = new Date(b.date + 'T' + start + ':00' + TIMEZONE_OFFSET);
  var endAt = new Date(b.date + 'T' + end + ':00' + TIMEZONE_OFFSET);
  if (!(endAt > startAt)) endAt = new Date(startAt.getTime() + 3 * 60 * 60 * 1000);

  var pkg = clean_(b.pkgName || b.pkg, 80);
  var title = '☕ Coffee cart (request) · ' + pkg + ' · ' + clean_(b.type, 60) + ' · ' + clean_(b.guests, 10) + ' guests';
  var details = [
    'Status: REQUEST — send the quote, then confirm or delete this event.',
    '',
    'Package: ' + pkg,
    'Event type: ' + clean_(b.type, 60),
    'Guests: ' + clean_(b.guests, 10),
    'Venue: ' + clean_(b.venue, 200),
    'Service: ' + start + ' – ' + end + ' (' + session + ')',
    'Theme / notes: ' + (clean_(b.theme, 1000) || '—'),
    '',
    'Name: ' + clean_(b.name, 100),
    'Mobile: ' + clean_(b.phone, 30),
    'Email: ' + (clean_(b.email, 120) || '—'),
    '',
    'Sent from callroomcoffee.com',
  ].join('\n');

  var calendarNote;
  try {
    var calendar = CALENDAR_ID === 'primary' ? CalendarApp.getDefaultCalendar() : CalendarApp.getCalendarById(CALENDAR_ID);
    var event = calendar.createEvent(title, startAt, endAt, { location: clean_(b.venue, 200), description: details });
    event.setColor(CalendarApp.EventColor.YELLOW);
    calendarNote = 'Added to the calendar (yellow = request): ' + calendar.getName() + ', ' + b.date + ' ' + start + '–' + end + '.';
  } catch (err) {
    console.error(err);
    calendarNote = 'Could not add this to the calendar (' + err + '). Please add it by hand.';
  }

  sendEmail_(
    'Coffee cart booking · ' + b.date + ' · ' + session + ' · ' + clean_(b.name, 60),
    clean_(data.summary, 5000) + '\n\n' + calendarNote,
    b.email
  );
  return { ok: true, calendar: calendarNote.indexOf('Added') === 0 };
}

function handleOrder_(data) {
  var o = data.order || {};
  required_(o, ['no', 'name', 'phone']);
  sendEmail_(
    'Pickup order ' + clean_(o.no, 20) + ' · ' + clean_(o.when, 20) + ', ' + clean_(o.slot, 30) + ' · ' + clean_(o.name, 60),
    clean_(data.summary, 5000),
    o.email
  );
  return { ok: true };
}

// ---- Helpers -----------------------------------------------------------------

function sendEmail_(subject, body, customerEmail) {
  var options = { name: 'The Callroom website' };
  if (RECIPIENTS.length > 1) options.cc = RECIPIENTS.slice(1).join(',');
  if (isEmail_(customerEmail)) options.replyTo = customerEmail;
  MailApp.sendEmail(RECIPIENTS[0], oneLine_(subject), body, options);
}

function parseBody_(e) {
  var raw = e && e.postData && e.postData.contents;
  if (!raw) throw new Error('Empty request');
  if (raw.length > 20000) throw new Error('Request too large');
  var data = JSON.parse(raw);
  if (!data || typeof data !== 'object') throw new Error('Invalid request');
  return data;
}

function throttle_() {
  var cache = CacheService.getScriptCache();
  var lock = LockService.getScriptLock();
  lock.waitLock(5000);
  try {
    var key = 'requests-' + Math.floor(Date.now() / 600000);
    var count = Number(cache.get(key) || 0) + 1;
    if (count > MAX_REQUESTS_PER_10_MIN) throw new Error('Too many requests, please try again in a few minutes');
    cache.put(key, String(count), 900);
  } finally {
    lock.releaseLock();
  }
}

function required_(obj, keys) {
  keys.forEach(function (k) {
    if (obj[k] === undefined || obj[k] === null || String(obj[k]).trim() === '') throw new Error('Missing ' + k);
  });
}

function clean_(value, max) {
  return String(value === undefined || value === null ? '' : value).trim().slice(0, max);
}

function oneLine_(value) {
  return String(value).replace(/[\r\n]+/g, ' ').slice(0, 200);
}

function validTime_(value) {
  return /^\d{2}:\d{2}$/.test(String(value || '')) ? String(value) : '';
}

function isEmail_(value) {
  return /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(String(value || ''));
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

/**
 * Run this once from the Apps Script editor (select it, press Run) to grant permissions and
 * check everything works. It sends a test email and creates a test event that you can delete.
 */
function testSetup() {
  var tomorrow = Utilities.formatDate(new Date(Date.now() + 86400000), 'Asia/Manila', 'yyyy-MM-dd');
  var result = handleBooking_({
    kind: 'booking',
    summary: 'TEST booking from the setup check. Delete the calendar event when you have seen it.',
    booking: { date: tomorrow, session: 'PM', pkgName: 'TEST · The Full Prescription', type: 'Test', guests: '1', venue: 'Test venue', start: '15:00', end: '16:00', name: 'Setup test', phone: '00000000000' },
  });
  console.log(JSON.stringify(result));
}
