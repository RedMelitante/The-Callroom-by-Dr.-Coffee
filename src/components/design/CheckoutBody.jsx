// Generated from the Claude Design component CheckoutBody.dc.html; markup and styles kept verbatim.
import { Fragment } from 'preact';
import { DCLogic } from '../../lib/dc.js';
import { connectCart, totals, clearCart } from '../../lib/cart.js';
import { peso } from '../../lib/catalog.js';
import { pickupSchedule } from '../../lib/hours.js';
import { sendRequest, remember } from '../../lib/submit.js';
import { CONTACT, ONLINE_PAYMENTS } from '../../lib/site.js';

const FIELD = 'min-height: 50px; padding: 0 16px; border-radius: 12px; background: #FFFFFF; font-family: inherit; font-size: 16px; color: #2B1A12';
const fieldStyle = (bad) => `${FIELD}; border: ${bad ? '2px solid #B5432A' : '1.5px solid #D6C3A5'}`;

class Logic extends DCLogic {
constructor(p) {
super(p);
this.state = { step: 1, slot: '', pay: 'GCash', name: '', phone: '', email: '', notify: true, errors: {}, sending: false, failed: '' };
connectCart(this);
}
componentDidMount() {
try { const c = JSON.parse(localStorage.getItem('callroom:contact') || '{}'); this.setState({ name: c.name || '', phone: c.phone || '', email: c.email || '' }); } catch { /* ignore */ }
}
validate() {
const s = this.state;
const errors = {};
if (!s.name.trim()) errors.name = 'Enter the name we should call at pickup.';
if (s.phone.replace(/\D/g, '').length !== 11) errors.phone = 'Enter an 11-digit mobile number.';
if (s.email && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(s.email)) errors.email = 'Enter a valid email, or leave it blank.';
this.setState({ errors });
return !Object.keys(errors).length;
}
async place(e, schedule, cart) {
e.preventDefault();
if (this.state.sending || !cart.count) return;
const s = this.state;
const no = 'CR-' + String(Date.now() % 10000).padStart(4, '0');
const slot = s.slot || schedule.slots[0];
const order = { no, fulfillment: 'Pickup at the 2nd floor kiosk, Madonna Hospital', name: s.name.trim(), phone: s.phone.trim(), email: s.email.trim(), notify: s.notify, when: schedule.when, slot, pay: s.pay,
items: cart.items.map((i) => ({ name: i.name, size: i.size, opts: i.opts, qty: i.qty, total: i.total })), total: cart.sum, placedAt: new Date().toISOString() };
const lines = [`New pickup order ${no}`, '', `Name: ${order.name}`, `Mobile: ${order.phone}`, order.email ? `Email: ${order.email}` : null,
`Pickup: ${order.when}, ${slot}`, `Payment: ${s.pay}${ONLINE_PAYMENTS ? '' : ' (pay at pickup)'}`, `Text when ready: ${s.notify ? 'Yes' : 'No'}`, '',
...cart.items.map((i) => `${i.qty} × ${i.name} (${i.opts}) — ${peso(i.total)}`), '', `Total: ${peso(cart.sum)}`].filter((l) => l !== null);
this.setState({ sending: true, failed: '' });
try {
const { via } = await sendRequest('order', `Pickup order ${no} · ${order.when}, ${slot}`, lines, { action: 'order', order });
order.via = via;
try { sessionStorage.setItem('callroom:last-order', JSON.stringify(order)); localStorage.setItem('callroom:contact', JSON.stringify({ name: order.name, phone: order.phone, email: order.email })); } catch { /* ignore */ }
remember('orders', order);
clearCart();
setTimeout(() => { location.href = '/order/confirmed'; }, via === 'email' ? 600 : 0);
} catch (err) {
this.setState({ sending: false, failed: `We couldn't send your order. Please try again, or call us at ${CONTACT.phone}.` });
}
}
renderVals() {
const s = this.state;
const cart = totals(s.mounted ? undefined : []);
const schedule = pickupSchedule();
const slotSel = s.slot || schedule.slots[0];
const labels = ['Contact', 'Pickup time', 'Payment', 'Review'];
const pays = [{ label: 'GCash', note: ONLINE_PAYMENTS ? 'Pay in the GCash app' : 'Pay with GCash at pickup' }, { label: 'Maya', note: ONLINE_PAYMENTS ? 'Pay in the Maya app' : 'Pay with Maya at pickup' }, { label: 'Card', note: ONLINE_PAYMENTS ? 'Visa · Mastercard' : 'Visa · Mastercard at the kiosk' }];
const err = s.errors;
const field = (k) => (e) => this.setState({ [k]: e.currentTarget.value, errors: { ...s.errors, [k]: undefined } });
return {
steps: labels.map((l, i) => ({ n: i + 1, label: l, bar: i + 1 <= s.step ? '#2F6F6A' : '#E3D5BF', fg: i + 1 === s.step ? '#2B1A12' : '#5A3A28' })),
s1: s.step === 1, s2: s.step === 2, s3: s.step === 3, s4: s.step === 4,
slotHeading: schedule.heading, when: schedule.when,
slots: schedule.slots.map((t) => { const sel = t === slotSel; return { label: t, sel: sel ? 'true' : 'false', bg: sel ? '#2B1A12' : '#FFFFFF', fg: sel ? '#F7F0E4' : '#2B1A12', bd: sel ? '#2B1A12' : '#D6C3A5', pick: () => this.setState({ slot: t }) }; }),
pays: pays.map((p) => { const sel = p.label === s.pay; return { ...p, sel: sel ? 'true' : 'false', bg: sel ? '#F1E3CC' : '#FFFFFF', bd: sel ? '#2B1A12' : '#D6C3A5', pick: () => this.setState({ pay: p.label }) }; }),
online: ONLINE_PAYMENTS, payIntro: ONLINE_PAYMENTS ? 'Pay now so your drink is ready when you arrive.' : 'Choose how you’ll pay. You pay at the kiosk when you pick up.',
isCard: ONLINE_PAYMENTS && s.pay === 'Card', isWallet: ONLINE_PAYMENTS && s.pay !== 'Card', payLabel: s.pay, slot: slotSel,
name: s.name, phone: s.phone, email: s.email, notify: s.notify,
onName: field('name'), onPhone: field('phone'), onEmail: field('email'), onNotify: (e) => this.setState({ notify: e.currentTarget.checked }),
errName: err.name, errPhone: err.phone, errEmail: err.email,
nameStyle: fieldStyle(err.name), phoneStyle: fieldStyle(err.phone), emailStyle: fieldStyle(err.email),
items: cart.items, count: cart.count, countLabel: `${cart.count} item${cart.count === 1 ? '' : 's'}`, total: cart.subtotal,
emptyCart: !!s.mounted && cart.count === 0, sending: s.sending, failed: s.failed,
canBack: s.step > 1, notBack: s.step === 1, notLast: s.step < 4, isLast: s.step === 4,
nextLabel: s.step === 3 ? 'Review order' : 'Continue',
next: () => { if (s.step === 1 && !this.validate()) return; this.setState({ step: Math.min(4, s.step + 1) }); },
back: () => this.setState({ step: Math.max(1, s.step - 1) }),
placeOrder: (e) => this.place(e, schedule, cart),
placeLabel: s.sending ? 'Sending…' : `Place order · ${cart.subtotal}`
};
}
}

export default class CheckoutBody extends Logic {
  render() {
    const { back, canBack, count, countLabel, email, emailStyle, emptyCart, errEmail, errName, errPhone, failed, isCard, isLast, isWallet, items, name, nameStyle, next, nextLabel, notBack, notLast, notify, onEmail, onName, onNotify, onPhone, payIntro, payLabel, pays, phone, phoneStyle, placeLabel, placeOrder, s1, s2, s3, s4, sending, slot, slotHeading, slots, steps, total, when } = this.renderVals();
    return (
      <Fragment>
<div style="width: 100%; font-family: 'DM Sans', system-ui, sans-serif; color: #2B1A12; background: #F7F0E4; padding: clamp(24px, 4vw, 56px) clamp(20px, 4vw, 40px) clamp(56px, 7vw, 96px); box-sizing: border-box">
<div style="max-width: 1240px; margin: 0 auto; display: flex; flex-direction: column; gap: 28px">

<div style="display: flex; flex-direction: column; gap: 8px">
<span style="font-family: 'IBM Plex Mono', monospace; font-size: 12px; letter-spacing: 0.14em; text-transform: uppercase; color: #2F6F6A; font-weight: 600">Order-ahead pickup</span>
<h1 style="margin: 0; font-family: 'Bricolage Grotesque', sans-serif; font-weight: 800; font-size: clamp(34px, 4.6vw, 56px); letter-spacing: -0.03em; line-height: 1">Checkout</h1>
</div>

<ol aria-label="Checkout steps" style="list-style: none; margin: 0; padding: 0; display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 8px">
{(steps).map((s, _i0) => (<Fragment key={_i0}>
<li style="display: flex; flex-direction: column; gap: 8px">
<span style={`height: 6px; border-radius: 999px; background: ${s.bar}`}></span>
<span style={`display: flex; align-items: center; gap: 8px; font-size: 14px; font-weight: 700; color: ${s.fg}`}><span style="font-family: 'IBM Plex Mono', monospace; font-size: 12px">0{s.n}</span><span>{s.label}</span></span>
</li>
</Fragment>))}
</ol>

<div style="display: flex; flex-wrap: wrap; gap: 24px; align-items: flex-start">
<div style="flex: 999 1 560px; min-width: 0; background: #FFFBF4; border: 1px solid #E3D5BF; border-radius: 24px; padding: clamp(20px, 3vw, 36px); display: flex; flex-direction: column; gap: 24px">

{(s1) ? (<Fragment>
<div style="display: flex; flex-direction: column; gap: 20px">
<div style="display: flex; flex-direction: column; gap: 4px"><h2 style="margin: 0; font-family: 'Bricolage Grotesque', sans-serif; font-weight: 700; font-size: 26px">Who's picking up?</h2><p style="margin: 0; color: #5A3A28; font-size: 15px">We'll call this name at the kiosk.</p></div>
<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 16px">
<div style="display: flex; flex-direction: column; gap: 8px"><label for="co-name" style="font-weight: 700; font-size: 14px">Full name</label><input id="co-name" type="text" autocomplete="name" required value={name} onInput={onName} aria-invalid={errName ? 'true' : undefined} aria-describedby={errName ? 'co-name-err' : undefined} style={nameStyle} />{errName ? <span id="co-name-err" style="font-size: 13px; color: #9A3520; font-weight: 600">{errName}</span> : null}</div>
<div style="display: flex; flex-direction: column; gap: 8px"><label for="co-phone" style="font-weight: 700; font-size: 14px">Mobile number</label><input id="co-phone" type="tel" autocomplete="tel" inputmode="tel" required placeholder="0917 555 0123" value={phone} onInput={onPhone} aria-invalid={errPhone ? 'true' : undefined} aria-describedby={errPhone ? 'co-phone-err' : undefined} style={phoneStyle} />{errPhone ? <span id="co-phone-err" style="font-size: 13px; color: #9A3520; font-weight: 600">{errPhone}</span> : null}</div>
<div style="display: flex; flex-direction: column; gap: 8px; grid-column: 1 / -1"><label for="co-email" style="font-weight: 700; font-size: 14px">Email <span style="font-weight: 500; color: #5A3A28">(for your receipt, optional)</span></label><input id="co-email" type="email" autocomplete="email" placeholder="you@example.com" value={email} onInput={onEmail} aria-invalid={errEmail ? 'true' : undefined} aria-describedby={errEmail ? 'co-email-err' : undefined} style={emailStyle} />{errEmail ? <span id="co-email-err" style="font-size: 13px; color: #9A3520; font-weight: 600">{errEmail}</span> : null}</div>
</div>
<label style="display: flex; align-items: center; gap: 12px; font-size: 15px; min-height: 44px"><input type="checkbox" checked={notify} onChange={onNotify} style="width: 22px; height: 22px; accent-color: #2F6F6A" />Text me when my order is ready</label>
</div>
</Fragment>) : null}

{(s2) ? (<Fragment>
<div style="display: flex; flex-direction: column; gap: 20px">
<div style="display: flex; flex-direction: column; gap: 4px"><h2 style="margin: 0; font-family: 'Bricolage Grotesque', sans-serif; font-weight: 700; font-size: 26px">{slotHeading}</h2><p style="margin: 0; color: #5A3A28; font-size: 15px">Slots run every 15 minutes from 6:00 AM to 5:45 PM, Mon–Sat.</p></div>
<div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(104px, 1fr)); gap: 10px">
{(slots).map((t, _i0) => (<Fragment key={_i0}>
<button type="button" aria-pressed={t.sel} onClick={t.pick} style={`min-height: 52px; border-radius: 14px; border: 1.5px solid ${t.bd}; background: ${t.bg}; color: ${t.fg}; font-family: 'IBM Plex Mono', monospace; font-weight: 600; font-size: 15px; cursor: pointer`}>{t.label}</button>
</Fragment>))}
</div>
<div style="display: flex; gap: 10px; align-items: center; padding: 12px 16px; border-radius: 14px; background: #DCEBE8; color: #1F4F4B; font-size: 14px"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>Pick a slot that fits your break. Running late? Call us at <a href="tel:09327233849" style="color: inherit; font-weight: 700">0932 723 3849</a>.</div>
</div>
</Fragment>) : null}

{(s3) ? (<Fragment>
<div style="display: flex; flex-direction: column; gap: 20px">
<div style="display: flex; flex-direction: column; gap: 4px"><h2 style="margin: 0; font-family: 'Bricolage Grotesque', sans-serif; font-weight: 700; font-size: 26px">Payment</h2><p style="margin: 0; color: #5A3A28; font-size: 15px">{payIntro}</p></div>
<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 12px">
{(pays).map((p, _i0) => (<Fragment key={_i0}>
<button type="button" aria-pressed={p.sel} onClick={p.pick} style={`min-height: 84px; padding: 14px 18px; border-radius: 16px; border: 2px solid ${p.bd}; background: ${p.bg}; color: #2B1A12; font-family: inherit; text-align: left; display: flex; flex-direction: column; justify-content: center; gap: 4px; cursor: pointer`}>
<span style="font-weight: 800; font-size: 17px">{p.label}</span><span style="font-size: 13px; color: #5A3A28">{p.note}</span>
</button>
</Fragment>))}
</div>
{(isCard) ? (<Fragment>
<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); gap: 14px">
<div style="display: flex; flex-direction: column; gap: 8px; grid-column: 1 / -1"><label for="co-card" style="font-weight: 700; font-size: 14px">Card number</label><input id="co-card" type="text" inputmode="numeric" autocomplete="cc-number" placeholder="1234 5678 9012 3456" style="min-height: 50px; padding: 0 16px; border-radius: 12px; border: 1.5px solid #D6C3A5; background: #FFFFFF; font-family: inherit; font-size: 16px" /></div>
<div style="display: flex; flex-direction: column; gap: 8px"><label for="co-exp" style="font-weight: 700; font-size: 14px">Expiry</label><input id="co-exp" type="text" autocomplete="cc-exp" placeholder="MM / YY" style="min-height: 50px; padding: 0 16px; border-radius: 12px; border: 1.5px solid #D6C3A5; background: #FFFFFF; font-family: inherit; font-size: 16px" /></div>
<div style="display: flex; flex-direction: column; gap: 8px"><label for="co-cvc" style="font-weight: 700; font-size: 14px">CVC</label><input id="co-cvc" type="text" inputmode="numeric" autocomplete="cc-csc" placeholder="123" style="min-height: 50px; padding: 0 16px; border-radius: 12px; border: 1.5px solid #D6C3A5; background: #FFFFFF; font-family: inherit; font-size: 16px" /></div>
</div>
</Fragment>) : null}
{(isWallet) ? (<Fragment>
<p style="margin: 0; padding: 14px 16px; border-radius: 14px; border: 1.5px dashed #B79C7A; font-size: 15px; color: #5A3A28">You'll be sent to {payLabel} to approve {total}, then brought back here.</p>
</Fragment>) : null}
</div>
</Fragment>) : null}

{(s4) ? (<Fragment>
<div style="display: flex; flex-direction: column; gap: 18px">
<h2 style="margin: 0; font-family: 'Bricolage Grotesque', sans-serif; font-weight: 700; font-size: 26px">Review your order</h2>
<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 12px">
<div style="padding: 16px; border-radius: 16px; background: #F7F0E4; display: flex; flex-direction: column; gap: 4px"><span style="font-family: 'IBM Plex Mono', monospace; font-size: 11px; letter-spacing: 0.1em; text-transform: uppercase; color: #5A3A28">Pickup by</span><strong style="font-size: 16px">{name}</strong><span style="font-size: 14px; color: #5A3A28">{phone}</span></div>
<div style="padding: 16px; border-radius: 16px; background: #F7F0E4; display: flex; flex-direction: column; gap: 4px"><span style="font-family: 'IBM Plex Mono', monospace; font-size: 11px; letter-spacing: 0.1em; text-transform: uppercase; color: #5A3A28">When</span><strong style="font-size: 16px">{when}, {slot}</strong><span style="font-size: 14px; color: #5A3A28">2nd floor kiosk</span></div>
<div style="padding: 16px; border-radius: 16px; background: #F7F0E4; display: flex; flex-direction: column; gap: 4px"><span style="font-family: 'IBM Plex Mono', monospace; font-size: 11px; letter-spacing: 0.1em; text-transform: uppercase; color: #5A3A28">Payment</span><strong style="font-size: 16px">{payLabel}</strong><span style="font-size: 14px; color: #5A3A28">{total}</span></div>
</div>
<p style="margin: 0; font-size: 14px; color: #5A3A28">By placing this order you agree to pick it up at the 2nd floor kiosk, Madonna Hospital.</p>
</div>
</Fragment>) : null}

{failed ? (<p role="alert" style="margin: 0; padding: 12px 16px; border-radius: 14px; background: #F3DCD3; color: #7A2E1C; font-size: 15px; font-weight: 600">{failed}</p>) : null}
<div style="display: flex; flex-wrap: wrap; gap: 12px; justify-content: space-between; align-items: center; padding-top: 20px; border-top: 1px solid #E3D5BF">
{(canBack) ? (<Fragment><button type="button" onClick={back} style="min-height: 52px; padding: 0 22px; border-radius: 999px; border: 1.5px solid #2B1A12; background: transparent; color: #2B1A12; font-family: inherit; font-weight: 700; font-size: 16px; cursor: pointer">Back</button></Fragment>) : null}
{(notBack) ? (<Fragment><a href="/cart" style="display: inline-flex; align-items: center; min-height: 52px; font-weight: 700; color: #8A4F17">Back to cart</a></Fragment>) : null}
{(notLast) ? (<Fragment><button type="button" onClick={next} style="min-height: 52px; padding: 0 28px; border-radius: 999px; border: none; background: #2B1A12; color: #F7F0E4; font-family: inherit; font-weight: 700; font-size: 16px; cursor: pointer">{nextLabel}</button></Fragment>) : null}
{(isLast) ? (<Fragment><button type="button" onClick={placeOrder} disabled={sending || !count} style={`min-height: 52px; padding: 0 28px; border-radius: 999px; border: none; background: ${count ? '#E0A458' : '#E3D5BF'}; color: ${count ? '#2B1A12' : '#7A624C'}; font-family: inherit; font-weight: 800; font-size: 16px; cursor: pointer`}>{placeLabel}</button></Fragment>) : null}
</div>
</div>

<aside aria-label="Order summary" style="flex: 1 1 320px; min-width: 0; background: #FFFBF4; border: 1px solid #E3D5BF; border-radius: 24px; overflow: hidden">
<div style="display: flex; justify-content: space-between; padding: 12px 22px; background: #2B1A12; color: #F7F0E4; font-family: 'IBM Plex Mono', monospace; font-size: 12px; letter-spacing: 0.1em; text-transform: uppercase"><span>Rx · Your order</span><span>{countLabel}</span></div>
<div style="padding: 8px 22px 22px; display: flex; flex-direction: column">
{items.map((i) => (<div key={i.id} style="display: flex; justify-content: space-between; gap: 12px; padding: 14px 0; border-bottom: 1px dashed #D6C3A5"><span style="display: flex; flex-direction: column; gap: 2px"><strong>{i.name}{i.qty > 1 ? ` ×${i.qty}` : ''}</strong><span style="font-size: 13px; color: #5A3A28">{i.opts}</span></span><span style="font-family: 'IBM Plex Mono', monospace">{i.line}</span></div>))}
{emptyCart ? (<p style="margin: 14px 0 0; font-size: 15px; color: #5A3A28">Your order is empty. <a href="/order" style="color: #8A4F17; font-weight: 700">Add a drink</a> first.</p>) : null}
<div style="display: flex; justify-content: space-between; align-items: baseline; padding-top: 16px"><strong style="font-size: 18px">Total</strong><span style="font-family: 'IBM Plex Mono', monospace; font-weight: 600; font-size: 24px">{total}</span></div>
</div>
</aside>
</div>
</div>
</div>
      </Fragment>
    );
  }
}
