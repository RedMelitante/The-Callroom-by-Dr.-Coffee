// The Callroom menu: 16 drinks in 5 series, with the real prices from the old site.
// This is the single source for the menu, order catalog, product pages, cart and checkout.
// When the Medusa backend is connected, replace this module with product data from the Store API.

export const OAT_MILK = 20;

// Size ounces are still to be confirmed. Leave null to hide the note on the product page.
export const SIZE_OZ = { Regular: null, Large: null };

export const SERIES = [
  { id: 'coffee', key: 'Coffee', no: '01', name: 'Coffee', label: 'Coffee series', tag: { bg: '#2B1A12', fg: '#F7F0E4' } },
  { id: 'milk', key: 'Milk', no: '02', name: 'Milk Therapy', label: 'Milk series', tag: { bg: '#F1E3CC', fg: '#6B3F14' } },
  { id: 'yakult', key: 'Yakult', no: '03', name: 'Yakult Gut Shot', label: 'Yakult series', tag: { bg: '#FBE7E1', fg: '#8A2F22' } },
  { id: 'soda', key: 'Soda', no: '04', name: 'Pulse Soda', label: 'Soda series', tag: { bg: '#DCEBE8', fg: '#1F4F4B' } },
  { id: 'tea', key: 'Tea', no: '05', name: 'Detoxi-Tea', label: 'Tea series', tag: { bg: '#DCEBE8', fg: '#1F4F4B' } },
];

const RL = { Regular: 145, Large: 170 };
const coffee = (hotR, hotL, icedR, icedL) => ({ Hot: { Regular: hotR, Large: hotL }, Iced: { Regular: icedR, Large: icedL } });

// prices: coffee -> { Hot: {Regular, Large}, Iced: {Regular, Large} }; others -> { Regular, Large }
export const DRINKS = [
  { slug: 'dr-black-coffee', series: 'Coffee', name: 'Dr. Black Coffee', sig: 'Straight, strong, no sugar needed.', img: 'dr-black-coffee', tint: '#CDB596', prices: coffee(100, 130, 130, 160), fav: true,
    description: 'Freshly brewed 100% Arabica, served black. No sugar needed: just a clean, strong cup for early rounds and long waits.' },
  { slug: 'dr-brew-coffee', series: 'Coffee', name: 'Dr. Brew Coffee', sig: 'Our everyday house brew.', img: 'dr-brew-coffee', tint: '#E6D3B6', prices: coffee(100, 130, 130, 160), fav: true,
    description: 'Our everyday house brew: smooth 100% Arabica, brewed to order. The cup most regulars start their shift with.' },
  { slug: 'caramel-remedy', series: 'Coffee', name: 'Caramel Remedy', sig: 'Espresso, milk and caramel.', img: 'caramel-remedy', tint: '#E2C9A6', prices: coffee(120, 150, 145, 170), fav: true,
    description: 'Espresso and fresh milk finished with a caramel drizzle. Sweet, mellow and easy to love.' },
  { slug: 'dr-viet-coffee', series: 'Coffee', name: 'Dr. Viet Coffee', sig: 'Bold and sweet, Vietnamese-style.', img: 'dr-viet-coffee', tint: '#DCC5A4', prices: coffee(120, 150, 145, 170), fav: true,
    description: 'Bold Arabica sweetened Vietnamese-style. Strong enough for a double shift, sweet enough to enjoy it.' },
  { slug: 'salted-caramel-drip', series: 'Coffee', name: 'Salted Caramel Drip', sig: 'Sweet, salty, slow-dripped.', img: 'salted-caramel-drip', tint: '#E8D2B0', prices: coffee(120, 150, 145, 170), fav: true,
    description: 'Slow-dripped coffee with salted caramel. Sweet, a little salty, and very hard to order just one of.' },
  { slug: 'spanish-stimu-latte', series: 'Coffee', name: 'Spanish Stimu-Latte', sig: 'Creamy, sweet, wakes you up.', img: 'spanish-stimu-latte', tint: '#E0CCAE', prices: coffee(120, 150, 145, 170), fav: true,
    description: 'Espresso with creamy, sweetened milk, Spanish-latte style. Creamy, sweet, and it wakes you up. Take one before rounds.' },
  { slug: 'white-coat-mocha', series: 'Coffee', name: 'White Coat Mocha', sig: 'Espresso and chocolate, doctor-approved.', img: 'white-coat-mocha', tint: '#E0CCAE', prices: coffee(120, 150, 145, 170),
    description: 'Espresso and chocolate with fresh milk. Doctor-approved comfort in a cup.' },
  { slug: 'caramel-milk-therapy', series: 'Milk', name: 'Caramel Milk Therapy', sig: 'Fresh milk and house caramel.', img: 'caramel-milk-therapy', tint: '#EAD7BA', prices: RL, fav: true,
    description: 'Cold fresh milk with our house-made caramel. Coffee-free, gently sweet, and the drink our night-shift regulars reach for when they need a softer pick-me-up.' },
  { slug: 'chocolate-milk-therapy', series: 'Milk', name: 'Chocolate Milk Therapy', sig: 'Rich chocolate and fresh milk.', img: 'chocolate-milk-therapy', tint: '#D9C1A3', prices: RL, fav: true,
    description: 'Rich chocolate and cold fresh milk. Coffee-free, and a favourite with kids and grown-ups alike.' },
  { slug: 'strawberry-milk-therapy', series: 'Milk', name: 'Strawberry Milk Therapy', sig: 'Strawberry and fresh milk.', img: 'strawberry-milk-therapy', tint: '#F6DCD3', prices: RL,
    description: 'Strawberry and cold fresh milk. Coffee-free, sweet and pink.' },
  { slug: 'green-apple-yakult-gut-shot', series: 'Yakult', name: 'Green Apple Yakult Gut Shot', sig: 'Green apple and Yakult.', img: 'green-apple-yakult', tint: '#F6DCD3', prices: RL,
    description: 'Green apple and Yakult over ice. Fruity, tangy and coffee-free.' },
  { slug: 'lychee-yakult-gut-shot', series: 'Yakult', name: 'Lychee Yakult Gut Shot', sig: 'Lychee and Yakult.', img: 'lychee-yakult', tint: '#F3D3C8', prices: RL,
    description: 'Lychee and Yakult over ice. Fruity, tangy and coffee-free.' },
  { slug: 'blue-pulse-soda', series: 'Soda', name: 'Blue Pulse Soda', sig: 'Sparkling soda with a blue layer.', img: 'blue-pulse-soda', tint: '#D3E6E2', prices: RL,
    description: 'Sparkling soda with a blue layer. Cold, fizzy and coffee-free.' },
  { slug: 'strawberry-pulse-soda', series: 'Soda', name: 'Strawberry Pulse Soda', sig: 'Sparkling soda with strawberry.', img: 'strawberry-pulse-soda', tint: '#C8DFDA', prices: RL,
    description: 'Sparkling soda with strawberry. Cold, fizzy and coffee-free.' },
  { slug: 'lemon-detoxi-tea', series: 'Tea', name: 'Lemon Detoxi-Tea', sig: 'Iced tea with lemon.', img: 'lemon-detoxi-tea', tint: '#E8D2B0', prices: RL,
    description: 'Iced tea with lemon. Bright, cold and refreshing.' },
  { slug: 'passionfruit-detoxi-tea', series: 'Tea', name: 'Passionfruit Detoxi-Tea', sig: 'Iced tea with passionfruit.', img: 'passionfruit-detoxi-tea', tint: '#E8D2B0', prices: RL,
    description: 'Iced tea with passionfruit. Tart, cold and refreshing.' },
].map((d) => ({ ...d, img: `/images/${d.img}.webp`, href: `/products/${d.slug}` }));

export const isCoffee = (d) => d.series === 'Coffee';
export const seriesOf = (d) => SERIES.find((s) => s.key === d.series);
export const bySlug = (slug) => DRINKS.find((d) => d.slug === slug);
export const byName = (name) => DRINKS.find((d) => d.name === name);
export const peso = (n) => '₱' + Number(n).toLocaleString('en-PH');

/** Unit price for a drink and its options. */
export function unitPrice(d, { size = 'Regular', temp = 'Iced', oat = false } = {}) {
  const base = isCoffee(d) ? d.prices[temp][size] : d.prices[size];
  return base + (oat && isCoffee(d) ? OAT_MILK : 0);
}

/** Price range shown on cards, e.g. ₱100–180 (coffee upper bound includes oat milk). */
export function priceRange(d) {
  if (!isCoffee(d)) return `${peso(d.prices.Regular)}–${d.prices.Large}`;
  const all = Object.values(d.prices).flatMap((p) => Object.values(p));
  return `${peso(Math.min(...all))}–${Math.max(...all) + OAT_MILK}`;
}

/** Number of a drink within its series, e.g. "01". */
export function seriesNo(d) {
  const i = DRINKS.filter((x) => x.series === d.series).indexOf(d);
  return String(i + 1).padStart(2, '0');
}
