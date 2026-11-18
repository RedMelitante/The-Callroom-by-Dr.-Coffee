// Generated from the Claude Design component ProductBody.dc.html; markup and styles kept verbatim.
import { Fragment } from 'preact';
import { DCLogic } from '../../lib/dc.js';
import { connectCart, addItem } from '../../lib/cart.js';
import { bySlug, byName, isCoffee, seriesOf, seriesNo, unitPrice, priceRange, peso, SIZE_OZ } from '../../lib/catalog.js';
import { flashToast } from '../../lib/live.js';
import { quickFx } from '../../lib/quick.js';

// Pairings shown under each drink (the design pairs Caramel Milk Therapy with these four).
const PAIRS = {
  Coffee: ['Caramel Milk Therapy', 'Chocolate Milk Therapy', 'Lychee Yakult Gut Shot', 'Blue Pulse Soda'],
  default: ['Chocolate Milk Therapy', 'Caramel Remedy', 'Spanish Stimu-Latte', 'Dr. Viet Coffee'],
};

class Logic extends DCLogic {
constructor(p) {
super(p);
const d = bySlug(p.slug);
this.state = { size: 'Large', temp: 'Iced', sugar: '50%', ice: 'Regular ice', qty: 1, toast: null };
if (isCoffee(d)) this.state.sugar = '100%';
connectCart(this);
}
renderVals() {
const s = this.state;
const d = bySlug(this.props.slug);
const coffee = isCoffee(d);
const series = seriesOf(d);
const pill = (sel) => ({ sel: sel ? 'true' : 'false', bg: sel ? '#2B1A12' : '#FFFFFF', fg: sel ? '#F7F0E4' : '#2B1A12', bd: sel ? '#2B1A12' : '#D6C3A5' });
const opts = { size: s.size, temp: s.temp };
const unit = unitPrice(d, opts);
const showIce = !coffee || s.temp === 'Iced';
const pairs = (PAIRS[d.series] || PAIRS.default).filter((n) => n !== d.name).slice(0, 4).map(byName);
return {
d, seriesLabel: series.label, seriesTag: `${series.label} · No. ${seriesNo(d)}`, tagBg: series.tag.bg, tagFg: series.tag.fg,
fav: !!d.fav, caffeine: coffee ? 'Yes' : d.series === 'Tea' ? 'Tea' : 'None', served: coffee ? 'Hot or iced' : 'Iced',
coffee, showIce,
temps: ['Hot', 'Iced'].map((l) => ({ ...pill(l === s.temp), label: l, pick: () => this.setState({ temp: l }) })),
sizes: ['Regular', 'Large'].map((l) => ({ ...pill(l === s.size), label: l, note: SIZE_OZ[l] ? `${SIZE_OZ[l]} oz` : '', price: peso(unitPrice(d, { ...opts, size: l })), pick: () => this.setState({ size: l }) })),
sugars: ['0%', '25%', '50%', '75%', '100%'].map((l) => ({ ...pill(l === s.sugar), label: l, pick: () => this.setState({ sugar: l }) })),
ices: ['No ice', 'Less ice', 'Regular ice'].map((l) => ({ ...pill(l === s.ice), label: l, pick: () => this.setState({ ice: l }) })),
qty: s.qty,
inc: () => this.setState({ qty: s.qty + 1 }),
dec: () => this.setState({ qty: Math.max(1, s.qty - 1) }),
total: peso(unit * s.qty),
addToOrder: (e) => {
e.preventDefault();
addItem(d.slug, { size: s.size, temp: coffee ? s.temp : 'Iced', sugar: s.sugar, ice: showIce ? s.ice : 'No ice' }, s.qty);
flashToast(this, s.qty > 1 ? `${s.qty} × ${d.name}` : d.name);
},
toast: !!s.toast, toastName: s.toast,
related: pairs.map((p) => ({ ...p, price: priceRange(p), ...quickFx(this, p) }))
};
}
}

export default class ProductBody extends Logic {
  render() {
    const { addToOrder, caffeine, coffee, d, dec, fav, ices, inc, qty, related, served, seriesLabel, seriesTag, showIce, sizes, sugars, tagBg, tagFg, temps, toast, toastName, total } = this.renderVals();
    return (
      <Fragment>
<div style="width: 100%; font-family: 'DM Sans', system-ui, sans-serif; color: #2B1A12; background: #F7F0E4; padding: clamp(20px, 4vw, 48px) clamp(20px, 4vw, 40px) clamp(56px, 7vw, 96px); box-sizing: border-box">
<div style="max-width: 1240px; margin: 0 auto; display: flex; flex-direction: column; gap: clamp(40px, 6vw, 80px)">

<div style="display: flex; flex-direction: column; gap: 20px">
<nav aria-label="Breadcrumb" style="font-size: 14px; color: #5A3A28; display: flex; gap: 8px; flex-wrap: wrap"><a href="/order" style="color: #8A4F17">Menu</a><span aria-hidden="true">/</span><span>{seriesLabel}</span><span aria-hidden="true">/</span><span style="color: #2B1A12; font-weight: 600">{d.name}</span></nav>
<div style="display: flex; flex-wrap: wrap; gap: clamp(24px, 4vw, 56px); align-items: flex-start">

<div style="flex: 1 1 420px; min-width: 0; display: flex; flex-direction: column; gap: 12px">
<div style="aspect-ratio: 1 / 1; border-radius: 28px; background: #F7F0E4; border: 1px solid #E3D5BF; overflow: hidden; position: relative">
<img src={d.img} alt={`${d.name} in a Callroom cup`} style="width: 100%; height: 100%; object-fit: cover; display: block;object-fit: contain" />
{fav ? <span style="position: absolute; top: 16px; left: 16px; padding: 6px 12px; border-radius: 999px; background: #E0A458; color: #2B1A12; font-weight: 700; font-size: 13px">Staff favourite</span> : null}
</div>
<div style="display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 10px">
<div style="aspect-ratio: 1 / 1; border-radius: 14px; overflow: hidden; background: #F7F0E4; border: 2px solid #2B1A12"><img src={d.img} alt="" style="width: 100%; height: 100%; object-fit: cover; display: block;object-fit: contain" /></div>
<div style="aspect-ratio: 1 / 1; border-radius: 14px; overflow: hidden; background: #F7F0E4; border: 1px solid #E3D5BF"><img src="/images/hero-drinks.webp" alt="" style="width: 100%; height: 100%; object-fit: cover; display: block" /></div>
<div style="aspect-ratio: 1 / 1; border-radius: 14px; overflow: hidden"><img src="/images/kiosk.webp" alt="" style="width: 100%; height: 100%; object-fit: cover; display: block" /></div>
<div style="aspect-ratio: 1 / 1; border-radius: 14px; overflow: hidden"><img src="/images/staff-at-stall.webp" alt="" style="width: 100%; height: 100%; object-fit: cover; display: block" /></div>
</div>
</div>

<div style="flex: 1 1 420px; min-width: 0; display: flex; flex-direction: column; gap: 24px">
<div style="display: flex; flex-direction: column; gap: 10px">
<span style={`align-self: flex-start; padding: 6px 12px; border-radius: 6px; background: ${tagBg}; color: ${tagFg}; font-family: 'IBM Plex Mono', monospace; font-size: 12px; letter-spacing: 0.1em; text-transform: uppercase`}>{seriesTag}</span>
<h1 style="margin: 0; font-family: 'Bricolage Grotesque', sans-serif; font-weight: 800; font-size: clamp(36px, 4.6vw, 56px); letter-spacing: -0.03em; line-height: 1">{d.name}</h1>
<p style="margin: 0; font-size: 17px; line-height: 1.6; color: #5A3A28">{d.description}</p>
</div>

<div style="border: 1px dashed #B79C7A; border-radius: 16px; background: #FFFBF4; padding: 14px 18px; display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 12px; font-family: 'IBM Plex Mono', monospace; font-size: 12px; color: #5A3A28">
<div style="display: flex; flex-direction: column; gap: 4px"><span style="letter-spacing: 0.1em; text-transform: uppercase">Caffeine</span><strong style="color: #2B1A12; font-size: 14px">{caffeine}</strong></div>
<div style="display: flex; flex-direction: column; gap: 4px"><span style="letter-spacing: 0.1em; text-transform: uppercase">Served</span><strong style="color: #2B1A12; font-size: 14px">{served}</strong></div>
<div style="display: flex; flex-direction: column; gap: 4px"><span style="letter-spacing: 0.1em; text-transform: uppercase">Ready in</span><strong style="color: #2B1A12; font-size: 14px">~10 min</strong></div>
</div>

{coffee ? (<fieldset style="border: none; margin: 0; padding: 0">
<legend style="font-weight: 700; font-size: 15px; margin-bottom: 10px">Temperature</legend>
<div style="display: flex; flex-wrap: wrap; gap: 8px">
{temps.map((o) => (<button key={o.label} type="button" aria-pressed={o.sel} onClick={o.pick} style={`min-height: 44px; padding: 0 16px; border-radius: 999px; border: 1.5px solid ${o.bd}; background: ${o.bg}; color: ${o.fg}; font-family: inherit; font-weight: 700; font-size: 15px; cursor: pointer`}>{o.label}</button>))}
</div>
</fieldset>) : null}

<fieldset style="border: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 10px">
<legend style="font-weight: 700; font-size: 15px; margin-bottom: 10px">Size</legend>
<div style="display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 10px">
{(sizes).map((o, _i0) => (<Fragment key={_i0}>
<button type="button" aria-pressed={o.sel} onClick={o.pick} style={`min-height: 64px; padding: 10px 16px; border-radius: 16px; border: 2px solid ${o.bd}; background: ${o.bg}; color: ${o.fg}; font-family: inherit; text-align: left; display: flex; justify-content: space-between; align-items: center; cursor: pointer`}>
<span style="display: flex; flex-direction: column; gap: 2px"><span style="font-weight: 700; font-size: 16px">{o.label}</span>{o.note ? <span style="font-size: 13px; opacity: 0.8">{o.note}</span> : null}</span>
<span style="font-family: 'IBM Plex Mono', monospace; font-weight: 600; font-size: 16px">{o.price}</span>
</button>
</Fragment>))}
</div>
</fieldset>

<fieldset style="border: none; margin: 0; padding: 0">
<legend style="font-weight: 700; font-size: 15px; margin-bottom: 10px">Sugar level</legend>
<div style="display: flex; flex-wrap: wrap; gap: 8px">
{(sugars).map((o, _i0) => (<Fragment key={_i0}>
<button type="button" aria-pressed={o.sel} onClick={o.pick} style={`min-height: 44px; min-width: 64px; padding: 0 14px; border-radius: 999px; border: 1.5px solid ${o.bd}; background: ${o.bg}; color: ${o.fg}; font-family: inherit; font-weight: 700; font-size: 15px; cursor: pointer`}>{o.label}</button>
</Fragment>))}
</div>
</fieldset>

{showIce ? (<fieldset style="border: none; margin: 0; padding: 0">
<legend style="font-weight: 700; font-size: 15px; margin-bottom: 10px">Ice</legend>
<div style="display: flex; flex-wrap: wrap; gap: 8px">
{(ices).map((o, _i0) => (<Fragment key={_i0}>
<button type="button" aria-pressed={o.sel} onClick={o.pick} style={`min-height: 44px; padding: 0 16px; border-radius: 999px; border: 1.5px solid ${o.bd}; background: ${o.bg}; color: ${o.fg}; font-family: inherit; font-weight: 700; font-size: 15px; cursor: pointer`}>{o.label}</button>
</Fragment>))}
</div>
</fieldset>) : null}

<div style="display: flex; flex-wrap: wrap; gap: 12px; align-items: center; padding-top: 8px; border-top: 1px solid #E3D5BF">
<div style="display: inline-flex; align-items: center; border: 1.5px solid #D6C3A5; border-radius: 999px; background: #FFFFFF; height: 56px">
<button type="button" aria-label="Decrease quantity" onClick={dec} style="width: 52px; height: 52px; border: none; background: transparent; color: #2B1A12; font-size: 22px; font-weight: 700; cursor: pointer">−</button>
<span aria-live="polite" style="min-width: 28px; text-align: center; font-weight: 800; font-size: 17px">{qty}</span>
<button type="button" aria-label="Increase quantity" onClick={inc} style="width: 52px; height: 52px; border: none; background: transparent; color: #2B1A12; font-size: 22px; font-weight: 700; cursor: pointer">+</button>
</div>
<a href="/cart" onClick={addToOrder} style="flex: 1 1 220px; display: inline-flex; align-items: center; justify-content: center; gap: 10px; min-height: 56px; padding: 0 24px; border-radius: 999px; background: #E0A458; color: #2B1A12; font-weight: 800; font-size: 17px; text-decoration: none">Add to order · {total}</a>
</div>
<p style="margin: 0; font-size: 14px; color: #5A3A28; display: flex; gap: 8px; align-items: center"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2F6F6A" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 21s-7-6.2-7-11a7 7 0 0 1 14 0c0 4.8-7 11-7 11z" /><circle cx="12" cy="10" r="2.5" /></svg>Pickup only · 2nd floor kiosk, Madonna Hospital</p>
</div>
</div>
</div>

<section style="display: flex; flex-direction: column; gap: 24px">
<h2 style="margin: 0; font-family: 'Bricolage Grotesque', sans-serif; font-weight: 800; font-size: clamp(28px, 3.4vw, 40px); letter-spacing: -0.02em">Pairs well with</h2>
<div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); gap: clamp(12px, 2vw, 20px)">
{(related).map((r, _i0) => (<Fragment key={_i0}>
<article style="background: #FFFBF4; border: 1px solid #E3D5BF; border-radius: 20px; overflow: hidden; display: flex; flex-direction: column">
<a href={r.href} aria-label={r.name} style="aspect-ratio: 4 / 3; background: #F7F0E4; display: flex; align-items: center; justify-content: center; color: #7A5A40; overflow: hidden"><img src={r.img} alt="" style="width: 100%; height: 100%; object-fit: contain; display: block" /></a>
<div style="padding: 14px; display: flex; justify-content: space-between; align-items: center; gap: 8px">
<div style="display: flex; flex-direction: column; gap: 2px; min-width: 0"><h3 style="margin: 0; font-family: 'Bricolage Grotesque', sans-serif; font-weight: 700; font-size: 17px; line-height: 1.15">{r.name}</h3><span style="font-family: 'IBM Plex Mono', monospace; font-size: 14px; font-weight: 600">{r.price}</span></div>
<button type="button" aria-label={r.addLabel} aria-pressed={r.pressed} onClick={r.add} style={`width: 44px; height: 44px; flex: none; border-radius: 999px; border: none; background: ${r.addBg}; color: ${r.addFg}; display: inline-flex; align-items: center; justify-content: center; cursor: pointer`}>{(r.notAdded) ? (<Fragment><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><path d="M12 5v14M5 12h14" /></svg></Fragment>) : null}{(r.isAdded) ? (<Fragment><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7" /></svg></Fragment>) : null}</button>
</div>
</article>
</Fragment>))}
</div>
</section>

</div>
{(toast) ? (<Fragment>
<div role="status" style="position: fixed; left: 50%; bottom: 96px; transform: translateX(-50%); z-index: 50; display: flex; align-items: center; gap: 14px; padding: 12px 14px 12px 18px; border-radius: 999px; background: #2B1A12; color: #F7F0E4; box-shadow: 0 12px 30px rgba(43, 26, 18, 0.3); font-size: 15px; white-space: nowrap">
<span><strong>{toastName}</strong> added</span>
<a href="/cart" style="display: inline-flex; align-items: center; min-height: 40px; padding: 0 16px; border-radius: 999px; background: #E0A458; color: #2B1A12; font-weight: 800; text-decoration: none">View cart</a>
</div>
</Fragment>) : null}
</div>
      </Fragment>
    );
  }
}
