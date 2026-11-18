// Generated from the Claude Design component CartBody.dc.html; markup and styles kept verbatim.
import { Fragment } from 'preact';
import { DCLogic } from '../../lib/dc.js';
import { connectCart, totals, setQty } from '../../lib/cart.js';

class Logic extends DCLogic {
constructor(p) { super(p); connectCart(this); }
renderVals() {
const { items, count, subtotal } = totals(this.state.mounted ? undefined : []);
return {
items: items.map((i) => ({ ...i, href: i.d.href, inc: () => setQty(i.id, i.qty + 1), dec: () => setQty(i.id, i.qty - 1) })),
subtotal, count, hasItems: !this.state.mounted || count > 0, empty: !!this.state.mounted && count === 0
};
}
}

export default class CartBody extends Logic {
  render() {
    const { count, empty, hasItems, items, subtotal } = this.renderVals();
    return (
      <Fragment>
<div style="width: 100%; font-family: 'DM Sans', system-ui, sans-serif; color: #2B1A12; background: #F7F0E4; padding: clamp(28px, 5vw, 64px) clamp(20px, 4vw, 40px) clamp(56px, 7vw, 96px); box-sizing: border-box">
<div style="max-width: 1240px; margin: 0 auto; display: flex; flex-direction: column; gap: 28px">
<div style="display: flex; flex-wrap: wrap; justify-content: space-between; align-items: flex-end; gap: 12px">
<div style="display: flex; flex-direction: column; gap: 8px">
<span style="font-family: 'IBM Plex Mono', monospace; font-size: 12px; letter-spacing: 0.14em; text-transform: uppercase; color: #2F6F6A; font-weight: 600">Pickup order</span>
<h1 style="margin: 0; font-family: 'Bricolage Grotesque', sans-serif; font-weight: 800; font-size: clamp(36px, 5vw, 60px); letter-spacing: -0.03em; line-height: 1">Your order</h1>
</div>
<a href="/order" style="display: inline-flex; align-items: center; min-height: 44px; font-weight: 700; color: #8A4F17">+ Add another drink</a>
</div>

<div style="display: flex; flex-wrap: wrap; gap: 24px; align-items: flex-start">
<div style="flex: 999 1 560px; min-width: 0; background: #FFFBF4; border: 1px solid #E3D5BF; border-radius: 24px; padding: 8px clamp(16px, 3vw, 28px)">
{(items).map((i, _i0) => (<Fragment key={_i0}>
<div style="display: flex; flex-wrap: wrap; gap: 16px; align-items: center; padding: 20px 0; border-bottom: 1px dashed #D6C3A5">
<div style="width: 88px; height: 88px; border-radius: 16px; background: #F7F0E4; border: 1px solid #E3D5BF; overflow: hidden; flex: none"><img src={i.img} alt="" style="width: 100%; height: 100%; object-fit: contain; display: block" /></div>
<div style="flex: 1 1 200px; min-width: 0; display: flex; flex-direction: column; gap: 4px">
<span style="font-family: 'IBM Plex Mono', monospace; font-size: 11px; letter-spacing: 0.1em; text-transform: uppercase; color: #5A3A28">Rx · {i.series}</span>
<span style="font-family: 'Bricolage Grotesque', sans-serif; font-weight: 700; font-size: 20px">{i.name}</span>
<span style="font-size: 14px; color: #5A3A28">{i.opts}</span>
<a href={i.href} aria-label={`Edit ${i.name}`} style="align-self: flex-start; display: inline-flex; align-items: center; min-height: 36px; color: #8A4F17; font-weight: 700; font-size: 14px">Edit</a>
</div>
<div style="display: flex; align-items: center; gap: 16px; margin-left: auto">
<div style="display: inline-flex; align-items: center; border: 1.5px solid #D6C3A5; border-radius: 999px; background: #FFFFFF">
<button type="button" aria-label={`Decrease ${i.name}`} onClick={i.dec} style="width: 44px; height: 44px; border: none; background: transparent; color: #2B1A12; font-size: 20px; font-weight: 700; cursor: pointer">−</button>
<span style="min-width: 24px; text-align: center; font-weight: 800">{i.qty}</span>
<button type="button" aria-label={`Increase ${i.name}`} onClick={i.inc} style="width: 44px; height: 44px; border: none; background: transparent; color: #2B1A12; font-size: 20px; font-weight: 700; cursor: pointer">+</button>
</div>
<span style="min-width: 64px; text-align: right; font-family: 'IBM Plex Mono', monospace; font-weight: 600; font-size: 17px">{i.line}</span>
</div>
</div>
</Fragment>))}
{(empty) ? (<div style="padding: 28px 0; display: flex; flex-direction: column; gap: 12px; align-items: flex-start"><span style="font-family: 'Bricolage Grotesque', sans-serif; font-weight: 700; font-size: 22px">Your order is empty</span><span style="font-size: 16px; color: #5A3A28">Pick a drink from the menu and it will show up here.</span><a href="/order" style="display: inline-flex; align-items: center; min-height: 52px; padding: 0 24px; border-radius: 999px; background: #2B1A12; color: #F7F0E4; font-weight: 700; font-size: 16px; text-decoration: none">Order Ahead</a></div>) : null}
</div>

<aside aria-label="Order summary" style="flex: 1 1 320px; min-width: 0; background: #2B1A12; color: #F7F0E4; border-radius: 24px; padding: 28px; display: flex; flex-direction: column; gap: 16px">
<h2 style="margin: 0; font-family: 'Bricolage Grotesque', sans-serif; font-weight: 700; font-size: 24px">Summary</h2>
<div style="display: flex; justify-content: space-between; font-size: 16px"><span>Items ({count})</span><span style="font-family: 'IBM Plex Mono', monospace">{subtotal}</span></div>
<div style="display: flex; justify-content: space-between; font-size: 16px"><span>Pickup</span><span style="font-family: 'IBM Plex Mono', monospace">Free</span></div>
<div style="display: flex; justify-content: space-between; align-items: baseline; padding-top: 14px; border-top: 1px dashed #5A3A28"><span style="font-weight: 700; font-size: 18px">Total</span><span style="font-family: 'IBM Plex Mono', monospace; font-weight: 600; font-size: 26px">{subtotal}</span></div>
<div style="display: flex; gap: 10px; align-items: flex-start; padding: 12px 14px; border-radius: 14px; background: #3A261B; font-size: 14px; line-height: 1.5; color: #EADBC4">
<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#E0A458" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="flex: none; margin-top: 2px"><path d="M12 21s-7-6.2-7-11a7 7 0 0 1 14 0c0 4.8-7 11-7 11z" /><circle cx="12" cy="10" r="2.5" /></svg>
Pick up at the 2nd floor kiosk, Madonna Hospital. No delivery.
</div>
<a href={hasItems ? '/checkout' : undefined} aria-disabled={hasItems ? undefined : 'true'} style={`display: flex; align-items: center; justify-content: center; min-height: 56px; border-radius: 999px; background: ${hasItems ? '#E0A458' : '#E3D5BF'}; color: ${hasItems ? '#2B1A12' : '#7A624C'}; font-weight: 800; font-size: 17px; text-decoration: none`}>Choose pickup time</a>
<span style="text-align: center; font-size: 13px; color: #EADBC4">GCash · Maya · Card</span>
</aside>
</div>
</div>
</div>
      </Fragment>
    );
  }
}
