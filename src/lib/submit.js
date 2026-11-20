// Sends an order or booking request.
// With PUBLIC_FORMS_ENDPOINT set, it POSTs JSON there in the format of the Apps Script backend
// (integrations/google-apps-script/Code.gs): `payload` carries its `action` ("book" or "order") and fields. Otherwise it opens the customer's email app
// with the request filled in, addressed to the shop (plus REQUESTS_CC), so no request is silently dropped.
import { FORMS_ENDPOINT, FORMS_HANDLES_ORDERS, CONTACT, REQUESTS_CC } from './site.js';

// POSTs JSON to the form endpoint and returns its reply; throws on a failed or rejected request.
async function postToEndpoint(body) {
  // Google Apps Script web apps don't answer CORS preflights, so send JSON as text/plain there
  // (a "simple" request). Other services get a normal JSON request.
  const appsScript = /^https:\/\/script\.google\.com\//.test(FORMS_ENDPOINT);
  const res = await fetch(FORMS_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': appsScript ? 'text/plain;charset=utf-8' : 'application/json', Accept: 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`Request failed (${res.status})`);
  const reply = await res.json().catch(() => null);
  if (reply && (reply.error || reply.ok === false)) throw new Error(reply.message || reply.error || 'Request rejected');
  return reply || {};
}

/** Sends a booking or order. Returns { via: 'sent', data } (endpoint reply) or { via: 'email' }. */
export async function sendRequest(kind, subject, lines, payload) {
  // Orders go to the endpoint only if it supports them; otherwise they use the email hand-off below.
  if (FORMS_ENDPOINT && (kind !== 'order' || FORMS_HANDLES_ORDERS)) {
    // kind/subject/summary/to/cc help a generic form service; the Apps Script reads `action` and its
    // own fields, and always emails its own fixed recipients.
    const data = await postToEndpoint({ kind, subject, to: CONTACT.email, cc: REQUESTS_CC, summary: lines.join('\n'), ...payload });
    return { via: 'sent', data };
  }
  const cc = REQUESTS_CC.length ? `&cc=${encodeURIComponent(REQUESTS_CC.join(','))}` : '';
  const href = `mailto:${CONTACT.email}?subject=${encodeURIComponent(subject)}${cc}&body=${encodeURIComponent(lines.join('\n'))}`;
  window.location.href = href;
  return { via: 'email' };
}

/** Whether a saved booking can be cancelled from this browser (it was sent to the script, which returned a code). */
export const canCancelOnline = (booking) => !!(FORMS_ENDPOINT && booking && booking.bookingId && booking.cancelToken);

/** Cancels a coffee cart booking through the Apps Script (action "cancel"). */
export async function cancelBooking(booking, reason = '') {
  if (!canCancelOnline(booking)) throw new Error("This booking can't be cancelled online. Please call or message us.");
  return postToEndpoint({ action: 'cancel', bookingId: booking.bookingId, cancelToken: booking.cancelToken, reason });
}

const STORE = 'callroom:history:v1';
export function remember(kind, record) {
  try {
    const all = JSON.parse(localStorage.getItem(STORE) || '{}');
    all[kind] = [record, ...(all[kind] || [])].slice(0, 20);
    localStorage.setItem(STORE, JSON.stringify(all));
  } catch {
    /* ignore */
  }
}
/** Updates saved records of `kind` that match `test`, merging in `patch`. */
export function updateHistory(kind, test, patch) {
  try {
    const all = JSON.parse(localStorage.getItem(STORE) || '{}');
    all[kind] = (all[kind] || []).map((r) => (test(r) ? { ...r, ...patch } : r));
    localStorage.setItem(STORE, JSON.stringify(all));
  } catch {
    /* ignore */
  }
}
export function history(kind) {
  try {
    return JSON.parse(localStorage.getItem(STORE) || '{}')[kind] || [];
  } catch {
    return [];
  }
}
