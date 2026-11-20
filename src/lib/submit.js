// Sends an order or booking request.
// With PUBLIC_FORMS_ENDPOINT set, it POSTs JSON there in the format of the Apps Script backend
// (integrations/google-apps-script/Code.gs): `payload` carries its `action` ("book" or "order") and fields. Otherwise it opens the customer's email app
// with the request filled in, addressed to the shop (plus REQUESTS_CC), so no request is silently dropped.
import { FORMS_ENDPOINT, CONTACT, REQUESTS_CC } from './site.js';

export async function sendRequest(kind, subject, lines, payload) {
  if (FORMS_ENDPOINT) {
    // Google Apps Script web apps don't answer CORS preflights, so send JSON as text/plain there
    // (a "simple" request). Other services get a normal JSON request.
    const appsScript = /^https:\/\/script\.google\.com\//.test(FORMS_ENDPOINT);
    const res = await fetch(FORMS_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': appsScript ? 'text/plain;charset=utf-8' : 'application/json', Accept: 'application/json' },
      // kind/subject/summary/to/cc help a generic form service; the Apps Script reads `action` and its
      // own fields, and always emails its own fixed recipients.
      body: JSON.stringify({ kind, subject, to: CONTACT.email, cc: REQUESTS_CC, summary: lines.join('\n'), ...payload }),
    });
    if (!res.ok) throw new Error(`Request failed (${res.status})`);
    const reply = await res.json().catch(() => null);
    if (reply && (reply.error || reply.ok === false)) throw new Error(reply.message || reply.error || 'Request rejected');
    return 'sent';
  }
  const cc = REQUESTS_CC.length ? `&cc=${encodeURIComponent(REQUESTS_CC.join(','))}` : '';
  const href = `mailto:${CONTACT.email}?subject=${encodeURIComponent(subject)}${cc}&body=${encodeURIComponent(lines.join('\n'))}`;
  window.location.href = href;
  return 'email';
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
export function history(kind) {
  try {
    return JSON.parse(localStorage.getItem(STORE) || '{}')[kind] || [];
  } catch {
    return [];
  }
}
