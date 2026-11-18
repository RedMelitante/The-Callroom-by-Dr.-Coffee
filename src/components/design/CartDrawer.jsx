// Generated from the Claude Design component CartDrawer.dc.html; markup and styles kept verbatim.
import { Fragment } from 'preact';
import { DCLogic } from '../../lib/dc.js';
import { connectCart, totals, setQty, removeLine } from '../../lib/cart.js';
import { pickupSlots } from '../../lib/hours.js';
import { OPEN_CART } from '../../lib/live.js';

class Logic extends DCLogic {
constructor(p) { super(p); this.state = { open: false }; connectCart(this); }
componentDidMount() {
this.onOpen = () => { this.lastFocus = document.activeElement; this.setState({ open: true }, () => this.closeBtn?.focus()); };
this.onKey = (e) => { if (e.key === 'Escape' && this.state.open) this.close(); };
window.addEventListener(OPEN_CART, this.onOpen);
window.addEventListener('keydown', this.onKey);
}
componentWillUnmount() { window.removeEventListener(OPEN_CART, this.onOpen); window.removeEventListener('keydown', this.onKey); }
close = () => { this.setState({ open: false }); this.lastFocus?.focus?.(); };
renderVals() {
const { items, count, subtotal } = totals(this.state.mounted ? undefined : []);
const slots = this.state.mounted ? pickupSlots() : [];
return {
isOpen: this.state.open, close: this.close, closeRef: (el) => { this.closeBtn = el; },
items: items.map((i) => ({ ...i, inc: () => setQty(i.id, i.qty + 1), dec: () => setQty(i.id, i.qty - 1), remove: () => removeLine(i.id) })),
count, subtotal, empty: count === 0, hasItems: count > 0,
earliest: slots.length ? `Earliest pickup today: ` : '', earliestTime: slots[0] || '', closedNote: slots.length ? '' : 'We’re closed for today. Order now and choose a pickup time when we reopen.'
};
}
}

export default class CartDrawer extends Logic {
  render() {
    const { close, closeRef, closedNote, count, earliest, earliestTime, empty, hasItems, isOpen, items, subtotal } = this.renderVals();
    return (
      <Fragment>
<div onClick={close} aria-hidden="true" style={`position: fixed; inset: 0; z-index: 60; background: rgba(43, 26, 18, 0.45); display: ${isOpen ? 'block' : 'none'}`}></div>
<aside id="cart-drawer" aria-label="Your order" role="dialog" aria-modal="true" hidden={!isOpen} style="position: fixed; top: 0; right: 0; z-index: 61; width: min(420px, 100vw); height: 100dvh; box-sizing: border-box; background: #F7F0E4; display: flex; flex-direction: column; font-family: 'DM Sans', system-ui, sans-serif; color: #2B1A12; border-left: 1px solid #E3D5BF">
<div style="display: flex; align-items: center; justify-content: space-between; padding: 20px 24px; border-bottom: 1px solid #E3D5BF">
<div style="display: flex; flex-direction: column; gap: 2px">
<h2 style="margin: 0; font-family: 'Bricolage Grotesque', sans-serif; font-weight: 800; font-size: 24px">Your order</h2>
<span style="font-family: 'IBM Plex Mono', monospace; font-size: 12px; color: #5A3A28">{count} {count === 1 ? 'item' : 'items'} · pickup at the 2nd floor kiosk</span>
</div>
<button type="button" ref={closeRef} onClick={close} aria-label="Close cart" style="width: 44px; height: 44px; box-sizing: border-box; border-radius: 999px; border: 1.5px solid #D6C3A5; background: transparent; color: #2B1A12; display: inline-flex; align-items: center; justify-content: center; cursor: pointer; padding: 0"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" /></svg></button>
</div>
<div style="flex: 1 1 auto; overflow-y: auto; padding: 8px 24px; display: flex; flex-direction: column">
{(items).map((i, _i0) => (<Fragment key={_i0}>
<div style="display: flex; gap: 14px; padding: 18px 0; border-bottom: 1px dashed #D6C3A5">
<div style="width: 76px; height: 76px; border-radius: 14px; background: #FFFBF4; border: 1px solid #E3D5BF; overflow: hidden; flex: none"><img src={i.img} alt="" style="width: 100%; height: 100%; object-fit: contain; display: block" /></div>
<div style="flex: 1 1 auto; display: flex; flex-direction: column; gap: 4px; min-width: 0">
<div style="display: flex; justify-content: space-between; gap: 8px"><span style="font-weight: 700; font-size: 16px">{i.name}</span><span style="font-family: 'IBM Plex Mono', monospace; font-weight: 600">{i.price}</span></div>
<span style="font-size: 13px; color: #5A3A28">{i.opts}</span>
<div style="display: flex; align-items: center; justify-content: space-between; margin-top: 6px">
<div style="display: inline-flex; align-items: center; border: 1.5px solid #D6C3A5; border-radius: 999px; background: #FFFFFF">
<button type="button" aria-label="Decrease quantity" onClick={i.dec} style="width: 40px; height: 40px; border: none; background: transparent; color: #2B1A12; font-size: 18px; font-weight: 700">−</button>
<span style="min-width: 24px; text-align: center; font-weight: 700">{i.qty}</span>
<button type="button" aria-label="Increase quantity" onClick={i.inc} style="width: 40px; height: 40px; border: none; background: transparent; color: #2B1A12; font-size: 18px; font-weight: 700">+</button>
</div>
<button type="button" onClick={i.remove} style="min-height: 40px; border: none; background: transparent; color: #8A4F17; font-family: inherit; font-size: 14px; font-weight: 700; text-decoration: underline; cursor: pointer">Remove</button>
</div>
</div>
</div>
</Fragment>))}
{(empty) ? (<p style="margin: 18px 0 0; font-size: 15px; color: #5A3A28; line-height: 1.6">Your order is empty. <a href="/order" style="color: #8A4F17; font-weight: 700">Browse the menu</a> to add a drink.</p>) : null}
<div style="margin-top: 18px; padding: 14px 16px; border-radius: 14px; background: #DCEBE8; color: #1F4F4B; font-size: 14px; line-height: 1.5; display: flex; gap: 10px; align-items: flex-start">
<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="flex: none; margin-top: 1px"><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>
<span>{earliest ? <Fragment>{earliest}<strong>{earliestTime}</strong>. You'll choose your time at checkout.</Fragment> : closedNote}</span>
</div>
</div>
{hasItems ? (<div style="padding: 20px 24px 24px; border-top: 1px solid #E3D5BF; background: #FFFBF4; display: flex; flex-direction: column; gap: 14px">
<div style="display: flex; justify-content: space-between; font-size: 16px"><span>Subtotal</span><span style="font-family: 'IBM Plex Mono', monospace; font-weight: 600; font-size: 18px">{subtotal}</span></div>
<a href="/checkout" style="display: flex; align-items: center; justify-content: center; min-height: 54px; border-radius: 999px; background: #2B1A12; color: #F7F0E4; font-weight: 700; font-size: 16px; text-decoration: none">Checkout · pickup</a>
<a href="/cart" style="text-align: center; font-weight: 700; font-size: 15px; color: #8A4F17">View full cart</a>
</div>) : null}
</aside>
      </Fragment>
    );
  }
}
