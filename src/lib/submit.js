// Sends an order or booking request.
// With PUBLIC_FORMS_ENDPOINT set, it POSTs JSON there. Otherwise it opens the customer's email app
// with the request filled in, addressed to the shop, so no request is silently dropped.
import { FORMS_ENDPOINT, CONTACT } from './site.js';

export async function sendRequest(kind, subject, lines, data) {
  if (FORMS_ENDPOINT) {
    const res = await fetch(FORMS_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ kind, subject, summary: lines.join('\n'), ...data }),
    });
    if (!res.ok) throw new Error(`Request failed (${res.status})`);
    return 'sent';
  }
  const href = `mailto:${CONTACT.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(lines.join('\n'))}`;
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
