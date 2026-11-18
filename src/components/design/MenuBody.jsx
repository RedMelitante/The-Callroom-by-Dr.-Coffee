// Generated from the Claude Design component MenuBody.dc.html; markup and styles kept verbatim.
import { Fragment } from 'preact';
import { DCLogic } from '../../lib/dc.js';
import { connectCart } from '../../lib/cart.js';
import { DRINKS, priceRange } from '../../lib/catalog.js';
import { pickupSlots, status } from '../../lib/hours.js';
import { quickFx } from '../../lib/quick.js';

class Logic extends DCLogic {
constructor(p) { super(p); this.state = { tab: 'All', toast: null }; connectCart(this); }
componentDidMount() {
const want = new URLSearchParams(location.search).get('series');
if (want && ['Coffee', 'Milk', 'Yakult', 'Soda', 'Tea'].includes(want)) this.setState({ tab: want });
}
renderVals() {
const items = DRINKS.map((d) => ({ ...d, tag: d.fav ? 'Fav' : '', price: priceRange(d) }));
const names = ['All', 'Coffee', 'Milk', 'Yakult', 'Soda', 'Tea'];
const t = this.state.tab;
const slots = pickupSlots();
return {
tabs: names.map((n) => {
const sel = n === t;
return { label: n, count: n === 'All' ? items.length : items.filter((i) => i.series === n).length, sel: sel ? 'true' : 'false',
bg: sel ? '#2B1A12' : '#FFFBF4', fg: sel ? '#F7F0E4' : '#2B1A12', bd: sel ? '#2B1A12' : '#D6C3A5',
pick: () => this.setState({ tab: n }) };
}),
shown: (t === 'All' ? items : items.filter((i) => i.series === t)).map((d) => ({ ...d, ...quickFx(this, d), noImg: !d.img, bg: d.img ? '#F7F0E4' : d.tint })),
toast: !!this.state.toast, toastName: this.state.toast,
nextSlot: !this.state.mounted || slots.length ? 'in ~15 min' : (status().label.replace('Closed · ', ''))
};
}
}

export default class MenuBody extends Logic {
  render() {
    const { nextSlot, shown, tabs, toast, toastName } = this.renderVals();
    return (
      <Fragment>
<div style="width: 100%; font-family: 'DM Sans', system-ui, sans-serif; color: #2B1A12; background: #F7F0E4; padding: clamp(28px, 5vw, 64px) clamp(20px, 4vw, 40px) clamp(56px, 7vw, 96px); box-sizing: border-box">
<div style="max-width: 1240px; margin: 0 auto; display: flex; flex-direction: column; gap: 28px">

<div style="display: flex; flex-wrap: wrap; justify-content: space-between; align-items: flex-end; gap: 20px">
<div style="display: flex; flex-direction: column; gap: 10px">
<span style="font-family: 'IBM Plex Mono', monospace; font-size: 12px; letter-spacing: 0.14em; text-transform: uppercase; color: #2F6F6A; font-weight: 600">Order ahead · pickup only</span>
<h1 style="margin: 0; font-family: 'Bricolage Grotesque', sans-serif; font-weight: 800; font-size: clamp(40px, 5.5vw, 68px); letter-spacing: -0.03em; line-height: 1">Order Ahead</h1>
<p style="margin: 0; font-size: 17px; color: #5A3A28; line-height: 1.6; max-width: 520px">Pick your drink, choose a time, collect it at the 2nd floor kiosk. Prices shown from smallest to largest size.</p>
</div>
<div style="display: flex; align-items: center; gap: 10px; padding: 12px 16px; border-radius: 14px; background: #FFFBF4; border: 1px solid #E3D5BF; font-size: 14px">
<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2F6F6A" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>
<span>Next pickup slot: <strong>{nextSlot}</strong></span>
</div>
</div>

<div role="tablist" aria-label="Drink series" style="display: flex; gap: 8px; overflow-x: auto; padding-bottom: 4px; position: sticky; top: 0; background: #F7F0E4; z-index: 2">
{(tabs).map((t, _i0) => (<Fragment key={_i0}>
<button type="button" role="tab" aria-selected={t.sel} onClick={t.pick} style={`flex: none; min-height: 44px; padding: 0 18px; border-radius: 999px; border: 1.5px solid ${t.bd}; background: ${t.bg}; color: ${t.fg}; font-family: inherit; font-weight: 700; font-size: 15px; cursor: pointer; white-space: nowrap`}>{t.label} <span style="font-family: 'IBM Plex Mono', monospace; font-weight: 500; font-size: 12px; opacity: 0.8">{t.count}</span></button>
</Fragment>))}
</div>

<div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); gap: clamp(12px, 2vw, 20px)">
{(shown).map((d, _i0) => (<Fragment key={_i0}>
<article style="background: #FFFBF4; border: 1px solid #E3D5BF; border-radius: 20px; overflow: hidden; display: flex; flex-direction: column">
<div style="display: flex; justify-content: space-between; padding: 9px 14px; border-bottom: 1px dashed #D6C3A5; font-family: 'IBM Plex Mono', monospace; font-size: 10px; letter-spacing: 0.12em; text-transform: uppercase; color: #5A3A28"><span>Rx · {d.series}</span><span>{d.tag}</span></div>
<a href={d.href} aria-label={d.name} style={`aspect-ratio: 1 / 1; background: ${d.bg}; display: flex; align-items: center; justify-content: center; color: #7A5A40; text-decoration: none`}>
{(d.img) ? (<Fragment><img src={d.img} alt="" style="width: 100%; height: 100%; object-fit: contain; display: block" /></Fragment>) : null}{(d.noImg) ? (<Fragment><svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 4h10l-1.5 16h-7z" /><path d="M6 4h12M9 9h6" /></svg></Fragment>) : null}
</a>
<div style="padding: 14px; display: flex; flex-direction: column; gap: 4px; flex: 1 1 auto">
<h2 style="margin: 0; font-family: 'Bricolage Grotesque', sans-serif; font-weight: 700; font-size: 18px; line-height: 1.15"><a href={d.href} style="color: #2B1A12; text-decoration: none">{d.name}</a></h2>
<p style="margin: 0; font-size: 13px; color: #5A3A28; line-height: 1.45; flex: 1 1 auto">{d.sig}</p>
<div style="display: flex; justify-content: space-between; align-items: center; margin-top: 10px; gap: 8px">
<span style="font-family: 'IBM Plex Mono', monospace; font-weight: 600; font-size: 15px">{d.price}</span>
<button type="button" aria-label={d.addLabel} aria-pressed={d.pressed} onClick={d.add} style={`width: 44px; height: 44px; flex: none; border-radius: 999px; border: none; background: ${d.addBg}; color: ${d.addFg}; display: inline-flex; align-items: center; justify-content: center; cursor: pointer`}>{(d.notAdded) ? (<Fragment><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><path d="M12 5v14M5 12h14" /></svg></Fragment>) : null}{(d.isAdded) ? (<Fragment><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7" /></svg></Fragment>) : null}</button>
</div>
</div>
</article>
</Fragment>))}
</div>

<div style="display: flex; flex-wrap: wrap; gap: 16px; align-items: center; justify-content: space-between; padding: 20px 24px; border-radius: 20px; border: 1.5px dashed #B79C7A; background: #FFFBF4">
<div style="display: flex; flex-wrap: wrap; gap: 10px">
<p style="margin: 0; font-size: 15px; color: #5A3A28; max-width: 640px; flex: 1 1 100%"><strong style="color: #2B1A12">Sugar and ice your way.</strong> Every drink can be adjusted on the next screen. Need it for a group? The Coffee Cart serves events across CDO.</p>
<a href="/menu" style="display: inline-flex; align-items: center; min-height: 48px; padding: 0 20px; border-radius: 999px; border: 1.5px solid #2B1A12; color: #2B1A12; font-weight: 700; text-decoration: none">See full price list</a>
<a href="/coffee-cart-events" style="display: inline-flex; align-items: center; min-height: 48px; padding: 0 20px; border-radius: 999px; background: #2F6F6A; color: #FFFFFF; font-weight: 700; text-decoration: none">Book the Coffee Cart</a>
</div>
</div>

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
