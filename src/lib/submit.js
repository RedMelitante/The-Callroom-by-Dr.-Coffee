// Sends an order or booking request.
// With PUBLIC_FORMS_ENDPOINT set, it POSTs JSON there. Otherwise it opens the customer's email app
// with the request filled in, addressed to the shop (plus REQUESTS_CC), so no request is silently dropped.
import { FORMS_ENDPOINT, CONTACT, REQUESTS_CC } from './site.js';

export async function sendRequest(kind, subject, lines, data) {
  if (FORMS_ENDPOINT) {
    const res = await fetch(FORMS_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      // `to` and `cc` tell the form service who should be emailed about this request.
      body: JSON.stringify({ kind, subject, to: CONTACT.email, cc: REQUESTS_CC, summary: lines.join('\n'), ...data }),
    });
    if (!res.ok) throw new Error(`Request failed (${res.status})`);
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
