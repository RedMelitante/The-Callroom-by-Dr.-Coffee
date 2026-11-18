// Generated from the Claude Design component OurMenuBody.dc.html; markup and styles kept verbatim.
import { Fragment } from 'preact';
import { DCLogic } from '../../lib/dc.js';
import { byName } from '../../lib/catalog.js';

class Logic extends DCLogic {
renderVals() {
const coffeeCols = ['Hot R', 'Hot L', 'Iced R', 'Iced L'];
const sizeCols = ['Regular', 'Large'];
const c4 = (a, b, c, d) => ['₱' + a, '₱' + b, '₱' + c, '₱' + d];
const rl = ['₱145', '₱170'];
const raw = [
{ id: 'coffee', no: '01', name: 'Coffee', blurb: 'Pulled to order from one bean, 100% Arabica.', bandBg: '#2B1A12', bandFg: '#F7F0E4', chipBg: '#2B1A12', chipFg: '#F7F0E4', cols: coffeeCols, items: [
{ name: 'Dr. Black Coffee', sig: 'Straight, strong, no sugar needed.', img: '/images/dr-black-coffee.webp', prices: c4(100, 130, 130, 160), fav: true },
{ name: 'Dr. Brew Coffee', sig: 'Our everyday house brew.', img: '/images/dr-brew-coffee.webp', prices: c4(100, 130, 130, 160), fav: true },
{ name: 'Caramel Remedy', sig: 'Espresso, milk and caramel.', img: '/images/caramel-remedy.webp', prices: c4(120, 150, 145, 170), fav: true },
{ name: 'Dr. Viet Coffee', sig: 'Bold and sweet, Vietnamese-style.', img: '/images/dr-viet-coffee.webp', prices: c4(120, 150, 145, 170), fav: true },
{ name: 'Salted Caramel Drip', sig: 'Sweet, salty, slow-dripped.', img: '/images/salted-caramel-drip.webp', prices: c4(120, 150, 145, 170), fav: true },
{ name: 'Spanish Stimu-Latte', sig: 'Creamy, sweet, wakes you up.', img: '/images/spanish-stimu-latte.webp', prices: c4(120, 150, 145, 170), fav: true },
{ name: 'White Coat Mocha', sig: 'Espresso and chocolate, doctor-approved.', img: '/images/white-coat-mocha.webp', prices: c4(120, 150, 145, 170) }
] },
{ id: 'milk', no: '02', name: 'Milk Therapy', blurb: 'Coffee-free, made with fresh milk.', bandBg: '#F1E3CC', bandFg: '#2B1A12', chipBg: '#F1E3CC', chipFg: '#2B1A12', cols: sizeCols, items: [
{ name: 'Caramel Milk Therapy', sig: 'Fresh milk and house caramel.', img: '/images/caramel-milk-therapy.webp', prices: rl, fav: true },
{ name: 'Chocolate Milk Therapy', sig: 'Rich chocolate and fresh milk.', img: '/images/chocolate-milk-therapy.webp', prices: rl, fav: true },
{ name: 'Strawberry Milk Therapy', sig: 'Strawberry and fresh milk.', img: '/images/strawberry-milk-therapy.webp', prices: rl }
] },
{ id: 'yakult', no: '03', name: 'Yakult Gut Shot', blurb: 'Fruity, tangy, made with Yakult.', bandBg: '#FBE7E1', bandFg: '#2B1A12', chipBg: '#FBE7E1', chipFg: '#2B1A12', cols: sizeCols, items: [
{ name: 'Green Apple Yakult Gut Shot', sig: 'Green apple and Yakult.', img: '/images/green-apple-yakult.webp', prices: rl },
{ name: 'Lychee Yakult Gut Shot', sig: 'Lychee and Yakult.', img: '/images/lychee-yakult.webp', prices: rl }
] },
{ id: 'soda', no: '04', name: 'Pulse Soda', blurb: 'Sparkling and cold.', bandBg: '#DCEBE8', bandFg: '#1F4F4B', chipBg: '#DCEBE8', chipFg: '#1F4F4B', cols: sizeCols, items: [
{ name: 'Blue Pulse Soda', sig: 'Sparkling soda with a blue layer.', img: '/images/blue-pulse-soda.webp', prices: rl },
{ name: 'Strawberry Pulse Soda', sig: 'Sparkling soda with strawberry.', img: '/images/strawberry-pulse-soda.webp', prices: rl }
] },
{ id: 'tea', no: '05', name: 'Detoxi-Tea', blurb: 'Iced fruit teas.', bandBg: '#2F6F6A', bandFg: '#FFFFFF', chipBg: '#2F6F6A', chipFg: '#FFFFFF', cols: sizeCols, items: [
{ name: 'Lemon Detoxi-Tea', sig: 'Iced tea with lemon.', img: '/images/lemon-detoxi-tea.webp', prices: rl },
{ name: 'Passionfruit Detoxi-Tea', sig: 'Iced tea with passionfruit.', img: '/images/passionfruit-detoxi-tea.webp', prices: rl }
] }
];
return { series: raw.map((s) => ({ ...s, colCount: s.cols.length, count: s.items.length, items: s.items.map((d) => ({ ...d, href: byName(d.name).href, fav: !!d.fav })) })) };
}
}

export default class OurMenuBody extends Logic {
  render() {
    const { series } = this.renderVals();
    return (
      <Fragment>
<div style="width: 100%; font-family: 'DM Sans', system-ui, sans-serif; color: #2B1A12; background: #F7F0E4">

<section style="padding: clamp(32px, 5vw, 72px) clamp(20px, 4vw, 40px) clamp(28px, 4vw, 48px)">
<div style="max-width: 1240px; margin: 0 auto; display: flex; flex-wrap: wrap; gap: 28px; align-items: flex-end; justify-content: space-between">
<div style="flex: 1 1 520px; min-width: 0; display: flex; flex-direction: column; gap: 16px">
<span style="font-family: 'IBM Plex Mono', monospace; font-size: 12px; letter-spacing: 0.14em; text-transform: uppercase; color: #2F6F6A; font-weight: 600">Your daily prescription</span>
<h1 style="margin: 0; font-family: 'Bricolage Grotesque', sans-serif; font-weight: 800; font-size: clamp(44px, 6.4vw, 84px); letter-spacing: -0.035em; line-height: 0.98">Our Menu</h1>
<p style="margin: 0; font-size: 18px; line-height: 1.6; color: #5A3A28; max-width: 560px">Every drink and every price, in one place. 100% Arabica, brewed to order, no powdered mixes.</p>
</div>
<div style="flex: 0 1 340px; min-width: 0; border: 1.5px dashed #B79C7A; border-radius: 18px; background: #FFFBF4; padding: 16px 20px; display: flex; flex-direction: column; gap: 8px; font-size: 14px; line-height: 1.5">
<span style="font-family: 'IBM Plex Mono', monospace; font-size: 11px; letter-spacing: 0.12em; text-transform: uppercase; color: #5A3A28">Rx notes</span>
<span style="display: flex; justify-content: space-between; gap: 12px"><span>Oat milk, any coffee</span><strong style="font-family: 'IBM Plex Mono', monospace">+₱20</strong></span>
<span style="display: flex; justify-content: space-between; gap: 12px"><span>Sizes</span><strong>Regular · Large</strong></span>
<span style="display: flex; justify-content: space-between; gap: 12px"><span>Hours</span><strong>Mon–Sat · 6AM–6PM</strong></span>
</div>
</div>
</section>

<nav aria-label="Jump to series" style="position: sticky; top: 0; z-index: 3; background: #F7F0E4; border-top: 1px solid #E3D5BF; border-bottom: 1px solid #E3D5BF; padding: 10px clamp(20px, 4vw, 40px)">
<div style="max-width: 1240px; margin: 0 auto; display: flex; gap: 8px; overflow-x: auto">
{(series).map((s, _i0) => (<Fragment key={_i0}>
<a href={`#${s.id}`} style={`flex: none; display: inline-flex; align-items: center; gap: 8px; min-height: 44px; padding: 0 16px; border-radius: 999px; background: ${s.chipBg}; color: ${s.chipFg}; font-weight: 700; font-size: 15px; text-decoration: none; white-space: nowrap`}>{s.name}<span style="font-family: 'IBM Plex Mono', monospace; font-size: 12px; font-weight: 500; opacity: 0.8">{s.count}</span></a>
</Fragment>))}
</div>
</nav>

<div style="padding: clamp(32px, 5vw, 64px) clamp(20px, 4vw, 40px) clamp(56px, 7vw, 96px)">
<div style="max-width: 1240px; margin: 0 auto; display: flex; flex-direction: column; gap: clamp(40px, 5vw, 64px)">
{(series).map((s, _i0) => (<Fragment key={_i0}>
<section id={s.id} style="background: #FFFBF4; border: 1px solid #E3D5BF; border-radius: 28px; overflow: hidden">
<header style={`display: flex; flex-wrap: wrap; justify-content: space-between; align-items: flex-end; gap: 12px 24px; padding: clamp(20px, 3vw, 28px) clamp(18px, 3vw, 32px); background: ${s.bandBg}; color: ${s.bandFg}`}>
<div style="display: flex; flex-direction: column; gap: 6px">
<span style="font-family: 'IBM Plex Mono', monospace; font-size: 12px; letter-spacing: 0.14em; text-transform: uppercase; opacity: 0.85">Series {s.no}</span>
<h2 style="margin: 0; font-family: 'Bricolage Grotesque', sans-serif; font-weight: 800; font-size: clamp(30px, 3.6vw, 44px); letter-spacing: -0.025em; line-height: 1">{s.name}</h2>
<p style="margin: 0; font-size: 15px; opacity: 0.9">{s.blurb}</p>
</div>
<div style={`display: grid; grid-template-columns: repeat(${s.colCount}, minmax(64px, auto)); gap: 4px 8px; font-family: 'IBM Plex Mono', monospace; font-size: 11px; letter-spacing: 0.08em; text-transform: uppercase; text-align: right; padding-right: 58px`}>
{(s.cols).map((c, _i1) => (<Fragment key={_i1}><span style="opacity: 0.85">{c}</span></Fragment>))}
</div>
</header>
<div style="display: flex; flex-direction: column; padding: 4px clamp(18px, 3vw, 32px) 8px">
{(s.items).map((d, _i1) => (<Fragment key={_i1}>
<div style="display: flex; flex-wrap: wrap; align-items: center; gap: 12px 20px; padding: 16px 0; border-bottom: 1px dashed #D6C3A5">
<div style="flex: 1 1 280px; min-width: 0; display: flex; align-items: center; gap: 16px">
<div style="width: 72px; height: 72px; border-radius: 16px; background: #F7F0E4; overflow: hidden; flex: none"><img src={d.img} alt={d.name} style="width: 100%; height: 100%; object-fit: cover; display: block" /></div>
<div style="display: flex; flex-direction: column; gap: 3px; min-width: 0">
<span style="display: flex; flex-wrap: wrap; align-items: center; gap: 8px"><h3 style="margin: 0; font-family: 'Bricolage Grotesque', sans-serif; font-weight: 700; font-size: 20px; line-height: 1.15">{d.name}</h3>{(d.fav) ? (<Fragment><span style="padding: 3px 8px; border-radius: 999px; background: #E0A458; color: #2B1A12; font-weight: 800; font-size: 11px">Favourite</span></Fragment>) : null}</span>
<span style="font-size: 14px; color: #5A3A28; line-height: 1.45">{d.sig}</span>
</div>
</div>
<div style="flex: 0 0 auto; margin-left: auto; display: flex; align-items: center; gap: 14px">
<div style={`display: grid; grid-template-columns: repeat(${s.colCount}, minmax(64px, auto)); gap: 8px; text-align: right; font-family: 'IBM Plex Mono', monospace; font-weight: 600; font-size: 16px`}>
{(d.prices).map((p, _i2) => (<Fragment key={_i2}><span>{p}</span></Fragment>))}
</div>
<a href={d.href} aria-label={`Order ${d.name}`} style="width: 44px; height: 44px; flex: none; border-radius: 999px; background: #2B1A12; color: #F7F0E4; display: inline-flex; align-items: center; justify-content: center"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><path d="M12 5v14M5 12h14" /></svg></a>
</div>
</div>
</Fragment>))}
</div>
</section>
</Fragment>))}

<section style="display: flex; flex-wrap: wrap; gap: 20px; align-items: stretch">
<div style="flex: 1 1 380px; min-width: 0; background: #EFE4D2; border-radius: 24px; padding: clamp(22px, 3vw, 32px); display: flex; flex-direction: column; gap: 10px">
<span style="font-family: 'IBM Plex Mono', monospace; font-size: 12px; letter-spacing: 0.14em; text-transform: uppercase; color: #2F6F6A; font-weight: 600">Baked in house</span>
<h2 style="margin: 0; font-family: 'Bricolage Grotesque', sans-serif; font-weight: 800; font-size: 28px; letter-spacing: -0.02em">Pastries &amp; cookies</h2>
<p style="margin: 0; font-size: 15px; color: #5A3A28; line-height: 1.6">Fresh from our kitchen every morning. Ask the barista what's in the case today.</p>
</div>
<div style="flex: 1 1 380px; min-width: 0; background: #2B1A12; color: #F7F0E4; border-radius: 24px; padding: clamp(22px, 3vw, 32px); display: flex; flex-direction: column; gap: 14px; justify-content: space-between">
<div style="display: flex; flex-direction: column; gap: 8px">
<h2 style="margin: 0; font-family: 'Bricolage Grotesque', sans-serif; font-weight: 800; font-size: 28px; letter-spacing: -0.02em">Skip the line between rounds</h2>
<p style="margin: 0; font-size: 15px; color: #EADBC4; line-height: 1.6">Order ahead and pick up at the 2nd floor kiosk, Madonna Hospital.</p>
</div>
<div style="display: flex; flex-wrap: wrap; gap: 10px">
<a href="/order" style="display: inline-flex; align-items: center; min-height: 52px; padding: 0 24px; border-radius: 999px; background: #E0A458; color: #2B1A12; font-weight: 800; text-decoration: none">Order Ahead</a>
<a href="/coffee-cart-events" style="display: inline-flex; align-items: center; min-height: 52px; padding: 0 22px; border-radius: 999px; border: 1.5px solid #5A3A28; color: #F7F0E4; font-weight: 700; text-decoration: none">Book the Coffee Cart</a>
</div>
</div>
</section>

</div>
</div>
</div>
      </Fragment>
    );
  }
}
