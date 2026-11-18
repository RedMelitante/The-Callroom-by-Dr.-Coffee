// Cart shared by every page (header badge, bottom nav, drawer, cart, checkout).
// Stored in localStorage so it survives navigation between the static pages.
// Medusa integration point: swap these functions for Store API cart calls.
import { bySlug, unitPrice, peso, isCoffee } from './catalog.js';

const KEY = 'callroom:cart:v1';
const EVENT = 'callroom:cart';

function read() {
  try {
    const v = JSON.parse(localStorage.getItem(KEY) || '[]');
    return Array.isArray(v) ? v.filter((l) => bySlug(l.slug) && l.qty > 0) : [];
  } catch {
    return [];
  }
}

function write(lines) {
  try {
    localStorage.setItem(KEY, JSON.stringify(lines));
  } catch {
    /* storage unavailable: cart lasts for this page only */
  }
  memory = lines;
  window.dispatchEvent(new CustomEvent(EVENT));
}

let memory = null;
export function getLines() {
  if (typeof window === 'undefined') return [];
  return memory ?? (memory = read());
}

const DEFAULT_OPTS = { size: 'Regular', temp: 'Iced', sugar: '100%', ice: 'Regular ice', oat: false };
const lineId = (slug, o) => [slug, o.size, o.temp, o.sugar, o.ice, o.oat ? 'oat' : ''].join('|');

export function addItem(slug, opts = {}, qty = 1) {
  const o = { ...DEFAULT_OPTS, ...opts };
  const id = lineId(slug, o);
  const lines = getLines().slice();
  const hit = lines.find((l) => l.id === id);
  if (hit) hit.qty += qty;
  else lines.push({ id, slug, ...o, qty });
  write(lines);
}

export function setQty(id, qty) {
  write(getLines().map((l) => (l.id === id ? { ...l, qty: Math.max(0, qty) } : l)).filter((l) => l.qty > 0));
}

export const removeLine = (id) => setQty(id, 0);
export const clearCart = () => write([]);

/** Lines with product data and prices attached. */
export function detailed(lines = getLines()) {
  return lines.map((l) => {
    const d = bySlug(l.slug);
    const unit = unitPrice(d, l);
    const opts = [l.size, isCoffee(d) ? l.temp : null, `${l.sugar} sugar`, l.temp === 'Hot' && isCoffee(d) ? null : l.ice, l.oat ? 'Oat milk' : null]
      .filter(Boolean)
      .join(' · ');
    return { ...l, d, name: d.name, img: d.img, series: d.series, unit, total: unit * l.qty, opts, line: peso(unit * l.qty), price: peso(unit * l.qty) };
  });
}

export function totals(lines = getLines()) {
  const items = detailed(lines);
  const sum = items.reduce((a, i) => a + i.total, 0);
  return { items, count: items.reduce((a, i) => a + i.qty, 0), sum, subtotal: peso(sum) };
}

/** Subscribe a design component to cart changes (also across browser tabs). */
export function subscribe(fn) {
  const onStorage = (e) => {
    if (e.key === KEY) {
      memory = null;
      fn();
    }
  };
  window.addEventListener(EVENT, fn);
  window.addEventListener('storage', onStorage);
  return () => {
    window.removeEventListener(EVENT, fn);
    window.removeEventListener('storage', onStorage);
  };
}

/** Mixin for class components: keeps this.state.cartRev in sync and re-renders on change. */
export function connectCart(component) {
  const didMount = component.componentDidMount?.bind(component);
  const willUnmount = component.componentWillUnmount?.bind(component);
  let off;
  component.componentDidMount = () => {
    off = subscribe(() => component.setState({ cartRev: (component.state.cartRev || 0) + 1 }));
    component.setState({ cartRev: 1, mounted: true });
    didMount?.();
  };
  component.componentWillUnmount = () => {
    off?.();
    willUnmount?.();
  };
}
