// Generated from the Claude Design component AccountBody.dc.html; markup and styles kept verbatim.
import { Fragment } from 'preact';
import { DCLogic } from '../../lib/dc.js';
import { addItem } from '../../lib/cart.js';
import { byName, peso } from '../../lib/catalog.js';
import { history } from '../../lib/submit.js';
import { ACCOUNTS_ENABLED } from '../../lib/site.js';

const FIELD = 'min-height: 50px; padding: 0 16px; border-radius: 12px; border: 1.5px solid #D6C3A5; background: #FFFFFF; font-family: inherit; font-size: 16px';
const CONTACT_KEY = 'callroom:contact';
const fmtDate = (iso) => new Date(iso + 'T00:00:00').toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' }).replace(/^(\w+) /, '$1, ');

class Logic extends DCLogic {
constructor(p) { super(p); this.state = { signedIn: false, tab: 'dash', orders: [], bookings: [], contact: {} }; }
componentDidMount() { this.load(); }
load() {
let contact = {};
try { contact = JSON.parse(localStorage.getItem(CONTACT_KEY) || '{}'); } catch { /* ignore */ }
this.setState({ orders: history('orders'), bookings: history('bookings'), contact, loaded: true });
}
saveDetails(e) {
e?.preventDefault?.();
const v = (id) => document.getElementById(id)?.value.trim() || '';
const contact = { name: [v('ad-first'), v('ad-last')].filter(Boolean).join(' '), phone: v('ad-phone'), email: v('ad-email') };
try { localStorage.setItem(CONTACT_KEY, JSON.stringify(contact)); } catch { /* ignore */ }
this.setState({ contact, saved: true });
}
clearAll() {
try { localStorage.removeItem(CONTACT_KEY); localStorage.removeItem('callroom:history:v1'); } catch { /* ignore */ }
this.setState({ orders: [], bookings: [], contact: {}, tab: 'dash', cleared: true });
}
renderVals() {
const s = this.state;
const signedIn = !ACCOUNTS_ENABLED || s.signedIn;
const defs = [['dash', 'Dashboard'], ['orders', 'Orders'], ['book', 'Coffee cart bookings'], ['details', 'Account details'], ['out', ACCOUNTS_ENABLED ? 'Log out' : 'Clear saved data']];
const [first = '', ...rest] = (s.contact.name || '').split(' ');
const usualOrder = s.orders[0];
const usualItem = usualOrder?.items?.[0];
const usualDrink = usualItem ? byName(usualItem.name) : null;
const todayIso = new Date(Date.now() + 8 * 3600000).toISOString().slice(0, 10);
const upcoming = s.bookings.find((b) => b.date >= todayIso);
return {
signedIn, signedOut: !signedIn,
eyebrow: ACCOUNTS_ENABLED ? (s.signedIn ? 'Signed in' : 'My account') : 'Saved on this device',
title: signedIn ? 'My account' : 'Welcome back',
signIn: () => this.setState({ signedIn: true, tab: 'dash' }),
regSent: !!s.regSent, register: () => this.setState({ regSent: true }),
saved: !!s.saved, save: (e) => this.saveDetails(e), cleared: !!s.cleared,
tabs: defs.map(([id, label]) => { const cur = id === s.tab; return { label, cur: cur ? 'page' : 'false', bg: cur ? '#2B1A12' : 'transparent', fg: cur ? '#F7F0E4' : (id === 'out' ? '#8A4F17' : '#2B1A12'), pick: () => id === 'out' ? (ACCOUNTS_ENABLED ? this.setState({ signedIn: false }) : this.clearAll()) : this.setState({ tab: id, saved: false, cleared: false }) }; }),
tDash: s.tab === 'dash', tOrders: s.tab === 'orders', tBook: s.tab === 'book', tDetails: s.tab === 'details',
hello: first || 'there', accountsOn: ACCOUNTS_ENABLED,
hasUsual: !!usualDrink, noUsual: s.loaded && !usualDrink,
usualImg: usualDrink?.img, usualName: usualDrink?.name, usualOpts: usualItem?.opts, usualPrice: usualItem ? peso(usualItem.total / usualItem.qty) : '',
reorder: (e) => { e.preventDefault(); const o = usualOrder.items[0]; const parts = o.opts.split(' · '); addItem(usualDrink.slug, { size: o.size, temp: parts.includes('Hot') ? 'Hot' : 'Iced', sugar: (parts.find((p) => p.endsWith('sugar')) || '100% sugar').replace(' sugar', ''), ice: parts.find((p) => p.endsWith('ice')) || 'No ice', oat: parts.includes('Oat milk') }); location.href = '/cart'; },
hasUpcoming: !!upcoming, noUpcoming: s.loaded && !upcoming,
upName: upcoming?.pkg, upLine: upcoming ? `${fmtDate(upcoming.date)} · ${upcoming.session} · ${upcoming.guests} guests` : '',
orders: s.orders.map((o) => ({ no: o.no, when: `${o.when === 'Today' ? new Date(o.placedAt).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' }) : o.when}, ${o.slot.replace(' · ~15 min', '')}`, status: 'Sent', sbg: '#F1E3CC', sfg: '#6B3F14', total: peso(o.total),
view: (e) => { e.preventDefault(); try { sessionStorage.setItem('callroom:last-order', JSON.stringify(o)); } catch { /* ignore */ } location.href = '/order/confirmed'; } })),
noOrders: s.loaded && !s.orders.length,
bookings: s.bookings.map((b) => ({ head: `Request · ${fmtDate(b.date)} · ${b.session}`, title: b.pkg, line: `${b.type} · ${b.guests} guests · ${b.venue}` })),
noBookings: s.loaded && !s.bookings.length,
firstName: first, lastName: rest.join(' '), phone: s.contact.phone || '', email: s.contact.email || ''
};
}
}

export default class AccountBody extends Logic {
  render() {
    const { accountsOn, bookings, cleared, email, eyebrow, firstName, hasUpcoming, hasUsual, hello, lastName, noBookings, noOrders, noUpcoming, noUsual, orders, phone, regSent, register, reorder, save, saved, signIn, signedIn, signedOut, tBook, tDash, tDetails, tOrders, tabs, title, upLine, upName, usualImg, usualName, usualOpts, usualPrice } = this.renderVals();
    return (
      <Fragment>
<div style="width: 100%; font-family: 'DM Sans', system-ui, sans-serif; color: #2B1A12; background: #F7F0E4; padding: clamp(28px, 5vw, 64px) clamp(20px, 4vw, 40px) clamp(56px, 7vw, 96px); box-sizing: border-box">
<div style="max-width: 1240px; margin: 0 auto; display: flex; flex-direction: column; gap: 28px">

<div style="display: flex; flex-wrap: wrap; justify-content: space-between; align-items: flex-end; gap: 16px">
<div style="display: flex; flex-direction: column; gap: 8px">
<span style="font-family: 'IBM Plex Mono', monospace; font-size: 12px; letter-spacing: 0.14em; text-transform: uppercase; color: #2F6F6A; font-weight: 600">{eyebrow}</span>
<h1 style="margin: 0; font-family: 'Bricolage Grotesque', sans-serif; font-weight: 800; font-size: clamp(36px, 5vw, 60px); letter-spacing: -0.03em; line-height: 1">{title}</h1>
</div>
{(signedIn) ? (<Fragment><a href="/order" style="display: inline-flex; align-items: center; min-height: 48px; padding: 0 22px; border-radius: 999px; background: #2B1A12; color: #F7F0E4; font-weight: 700; text-decoration: none">Order Ahead</a></Fragment>) : null}
</div>

{(signedOut) ? (<Fragment>
<div style="display: flex; flex-wrap: wrap; gap: 20px; align-items: stretch">
<form style="flex: 1 1 380px; min-width: 0; background: #FFFBF4; border: 1px solid #E3D5BF; border-radius: 24px; padding: clamp(22px, 3vw, 36px); display: flex; flex-direction: column; gap: 16px">
<h2 style="margin: 0; font-family: 'Bricolage Grotesque', sans-serif; font-weight: 700; font-size: 26px">Sign in</h2>
<div style="display: flex; flex-direction: column; gap: 8px"><label for="ac-user" style="font-weight: 700; font-size: 14px">Email or mobile number</label><input id="ac-user" type="text" autocomplete="username" style="min-height: 50px; padding: 0 16px; border-radius: 12px; border: 1.5px solid #D6C3A5; background: #FFFFFF; font-family: inherit; font-size: 16px" /></div>
<div style="display: flex; flex-direction: column; gap: 8px"><label for="ac-pass" style="font-weight: 700; font-size: 14px">Password</label><input id="ac-pass" type="password" autocomplete="current-password" style="min-height: 50px; padding: 0 16px; border-radius: 12px; border: 1.5px solid #D6C3A5; background: #FFFFFF; font-family: inherit; font-size: 16px" /></div>
<div style="display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; gap: 8px">
<label style="display: flex; align-items: center; gap: 10px; font-size: 15px; min-height: 44px"><input type="checkbox" style="width: 20px; height: 20px; accent-color: #2F6F6A" />Remember me</label>
<a href="/account" style="font-size: 14px; font-weight: 700; color: #8A4F17">Lost your password?</a>
</div>
<button type="button" onClick={signIn} style="min-height: 54px; border-radius: 999px; border: none; background: #2B1A12; color: #F7F0E4; font-family: inherit; font-weight: 800; font-size: 16px; cursor: pointer">Sign in</button>
</form>
<form style="flex: 1 1 380px; min-width: 0; background: #EFE4D2; border-radius: 24px; padding: clamp(22px, 3vw, 36px); display: flex; flex-direction: column; gap: 16px">
<h2 style="margin: 0; font-family: 'Bricolage Grotesque', sans-serif; font-weight: 700; font-size: 26px">New here? Create an account</h2>
<ul style="margin: 0; padding: 0; list-style: none; display: flex; flex-direction: column; gap: 8px; font-size: 15px; color: #5A3A28">
<li style="display: flex; gap: 10px"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2F6F6A" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="flex: none; margin-top: 2px"><path d="M5 12.5l4.5 4.5L19 7" /></svg>Check out faster when you order ahead</li>
<li style="display: flex; gap: 10px"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2F6F6A" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="flex: none; margin-top: 2px"><path d="M5 12.5l4.5 4.5L19 7" /></svg>See past orders and reorder your usual</li>
<li style="display: flex; gap: 10px"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2F6F6A" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="flex: none; margin-top: 2px"><path d="M5 12.5l4.5 4.5L19 7" /></svg>Track your coffee cart bookings</li>
</ul>
<div style="display: flex; flex-direction: column; gap: 8px"><label for="ac-reg" style="font-weight: 700; font-size: 14px">Email address</label><input id="ac-reg" type="email" autocomplete="email" style="min-height: 50px; padding: 0 16px; border-radius: 12px; border: 1.5px solid #D6C3A5; background: #FFFFFF; font-family: inherit; font-size: 16px" /></div>
<p style="margin: 0; font-size: 13px; color: #5A3A28">We'll email you a link to set your password.</p>
{(regSent) ? (<Fragment><p role="status" style="margin: 0; padding: 12px 14px; border-radius: 12px; background: #DCEBE8; color: #1F4F4B; font-size: 14px; font-weight: 600">Check your email for a link to set your password.</p></Fragment>) : null}
<button type="button" onClick={register} style="min-height: 54px; border-radius: 999px; border: 1.5px solid #2B1A12; background: transparent; color: #2B1A12; font-family: inherit; font-weight: 800; font-size: 16px; cursor: pointer">Create account</button>
</form>
</div>
</Fragment>) : null}

{(signedIn) ? (<Fragment>
<div style="display: flex; flex-wrap: wrap; gap: 24px; align-items: flex-start">
<nav aria-label="Account" style="flex: 1 1 240px; min-width: 0; background: #FFFBF4; border: 1px solid #E3D5BF; border-radius: 22px; padding: 10px; display: flex; flex-direction: column; gap: 4px">
{(tabs).map((t, _i0) => (<Fragment key={_i0}>
<button type="button" aria-current={t.cur} onClick={t.pick} style={`min-height: 48px; padding: 0 16px; border-radius: 14px; border: none; background: ${t.bg}; color: ${t.fg}; font-family: inherit; font-weight: 700; font-size: 15px; text-align: left; cursor: pointer`}>{t.label}</button>
</Fragment>))}
</nav>

<div style="flex: 999 1 560px; min-width: 0; display: flex; flex-direction: column; gap: 20px">

{(tDash) ? (<Fragment>
<div style="display: flex; flex-direction: column; gap: 20px">
<p style="margin: 0; font-size: 17px; color: #5A3A28">Hello <strong style="color: #2B1A12">{hello}</strong>. From here you can see your orders, coffee cart bookings and account details{accountsOn ? '' : ' saved in this browser'}.</p>
{cleared ? <p role="status" style="margin: 0; padding: 12px 14px; border-radius: 12px; background: #DCEBE8; color: #1F4F4B; font-size: 14px; font-weight: 600">Your saved orders, bookings and details were cleared from this browser.</p> : null}
<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 16px">
<div style="background: #2B1A12; color: #F7F0E4; border-radius: 22px; padding: 22px; display: flex; flex-direction: column; gap: 10px">
<span style="font-family: 'IBM Plex Mono', monospace; font-size: 11px; letter-spacing: 0.12em; text-transform: uppercase; color: #E0A458">Your usual</span>
{hasUsual ? (<Fragment><div style="display: flex; align-items: center; gap: 14px"><img src={usualImg} alt="" style="width: 64px; height: 64px; border-radius: 14px; object-fit: cover; background: #F7F0E4" /><div style="display: flex; flex-direction: column; gap: 2px"><strong style="font-family: 'Bricolage Grotesque', sans-serif; font-size: 19px">{usualName}</strong><span style="font-size: 13px; color: #EADBC4">{usualOpts}</span></div></div>
<a href="/cart" onClick={reorder} style="display: inline-flex; align-self: flex-start; align-items: center; min-height: 46px; padding: 0 20px; border-radius: 999px; background: #E0A458; color: #2B1A12; font-weight: 800; text-decoration: none">Reorder · {usualPrice}</a></Fragment>) : null}
{noUsual ? (<Fragment><span style="font-size: 15px; color: #EADBC4">Your first order will show up here for one-tap reordering.</span><a href="/order" style="display: inline-flex; align-self: flex-start; align-items: center; min-height: 46px; padding: 0 20px; border-radius: 999px; background: #E0A458; color: #2B1A12; font-weight: 800; text-decoration: none">Order Ahead</a></Fragment>) : null}
</div>
<div style="background: #DCEBE8; color: #1F4F4B; border-radius: 22px; padding: 22px; display: flex; flex-direction: column; gap: 8px">
<span style="font-family: 'IBM Plex Mono', monospace; font-size: 11px; letter-spacing: 0.12em; text-transform: uppercase">Upcoming booking</span>
{hasUpcoming ? (<Fragment><strong style="font-family: 'Bricolage Grotesque', sans-serif; font-size: 21px">{upName}</strong>
<span style="font-size: 15px">{upLine}</span>
<span style="align-self: flex-start; padding: 5px 10px; border-radius: 999px; background: #FFFFFF; font-weight: 700; font-size: 12px">Awaiting quote</span></Fragment>) : null}
{noUpcoming ? (<Fragment><span style="font-size: 15px">No coffee cart bookings yet.</span><a href="/coffee-cart-events-booking-now" style="align-self: flex-start; display: inline-flex; align-items: center; min-height: 44px; padding: 0 18px; border-radius: 999px; background: #2F6F6A; color: #FFFFFF; font-weight: 700; text-decoration: none">Book the Coffee Cart</a></Fragment>) : null}
</div>
</div>
</div>
</Fragment>) : null}

{(tOrders) ? (<Fragment>
<div style="background: #FFFBF4; border: 1px solid #E3D5BF; border-radius: 22px; overflow: hidden">
<div style="overflow-x: auto">
<table style="width: 100%; min-width: 560px; border-collapse: collapse; font-size: 15px">
<thead><tr style="text-align: left; font-family: 'IBM Plex Mono', monospace; font-size: 11px; letter-spacing: 0.1em; text-transform: uppercase; color: #5A3A28"><th scope="col" style="padding: 14px 20px; border-bottom: 1px solid #E3D5BF">Order</th><th scope="col" style="padding: 14px 20px; border-bottom: 1px solid #E3D5BF">Pickup</th><th scope="col" style="padding: 14px 20px; border-bottom: 1px solid #E3D5BF">Status</th><th scope="col" style="padding: 14px 20px; border-bottom: 1px solid #E3D5BF">Total</th><th scope="col" style="padding: 14px 20px; border-bottom: 1px solid #E3D5BF"><span style="position: absolute; width: 1px; height: 1px; overflow: hidden">Actions</span></th></tr></thead>
<tbody>
{(orders).map((o, _i0) => (<Fragment key={_i0}>
<tr><td style="padding: 14px 20px; border-bottom: 1px dashed #D6C3A5; font-family: 'IBM Plex Mono', monospace; font-weight: 600">{o.no}</td><td style="padding: 14px 20px; border-bottom: 1px dashed #D6C3A5">{o.when}</td><td style="padding: 14px 20px; border-bottom: 1px dashed #D6C3A5"><span style={`padding: 4px 10px; border-radius: 999px; background: ${o.sbg}; color: ${o.sfg}; font-weight: 700; font-size: 12px`}>{o.status}</span></td><td style="padding: 14px 20px; border-bottom: 1px dashed #D6C3A5; font-family: 'IBM Plex Mono', monospace">{o.total}</td><td style="padding: 14px 20px; border-bottom: 1px dashed #D6C3A5; text-align: right"><a href="/order/confirmed" onClick={o.view} style="font-weight: 700; color: #8A4F17">View</a></td></tr>
</Fragment>))}
{noOrders ? (<tr><td colspan="5" style="padding: 20px; color: #5A3A28">No orders yet. <a href="/order" style="color: #8A4F17; font-weight: 700">Order ahead</a> and it will show up here.</td></tr>) : null}
</tbody>
</table>
</div>
</div>
</Fragment>) : null}

{(tBook) ? (<Fragment>
<div style="display: flex; flex-direction: column; gap: 14px">
{bookings.map((b, k) => (<div key={k} style="background: #FFFBF4; border: 1px solid #E3D5BF; border-radius: 22px; padding: 22px; display: flex; flex-wrap: wrap; gap: 16px; align-items: center; justify-content: space-between">
<div style="display: flex; flex-direction: column; gap: 4px"><span style="font-family: 'IBM Plex Mono', monospace; font-size: 11px; letter-spacing: 0.12em; text-transform: uppercase; color: #5A3A28">{b.head}</span><strong style="font-family: 'Bricolage Grotesque', sans-serif; font-size: 21px">{b.title}</strong><span style="font-size: 14px; color: #5A3A28">{b.line}</span></div>
<span style="padding: 6px 12px; border-radius: 999px; background: #DCEBE8; color: #1F4F4B; font-weight: 700; font-size: 13px">Awaiting quote</span>
</div>))}
{noBookings ? <p style="margin: 0; font-size: 16px; color: #5A3A28">No coffee cart booking requests yet.</p> : null}
<a href="/coffee-cart-events-booking-now" style="align-self: flex-start; display: inline-flex; align-items: center; min-height: 48px; padding: 0 20px; border-radius: 999px; background: #2F6F6A; color: #FFFFFF; font-weight: 700; text-decoration: none">Book another event</a>
</div>
</Fragment>) : null}

{(tDetails) ? (<Fragment>
<form onSubmit={save} style="background: #FFFBF4; border: 1px solid #E3D5BF; border-radius: 22px; padding: clamp(20px, 3vw, 32px); display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 16px">
<div style="display: flex; flex-direction: column; gap: 8px"><label for="ad-first" style="font-weight: 700; font-size: 14px">First name</label><input id="ad-first" type="text" autocomplete="given-name" defaultValue={firstName} style="min-height: 50px; padding: 0 16px; border-radius: 12px; border: 1.5px solid #D6C3A5; background: #FFFFFF; font-family: inherit; font-size: 16px" /></div>
<div style="display: flex; flex-direction: column; gap: 8px"><label for="ad-last" style="font-weight: 700; font-size: 14px">Last name</label><input id="ad-last" type="text" autocomplete="family-name" defaultValue={lastName} style="min-height: 50px; padding: 0 16px; border-radius: 12px; border: 1.5px solid #D6C3A5; background: #FFFFFF; font-family: inherit; font-size: 16px" /></div>
<div style="display: flex; flex-direction: column; gap: 8px"><label for="ad-phone" style="font-weight: 700; font-size: 14px">Mobile number</label><input id="ad-phone" type="tel" autocomplete="tel" defaultValue={phone} style="min-height: 50px; padding: 0 16px; border-radius: 12px; border: 1.5px solid #D6C3A5; background: #FFFFFF; font-family: inherit; font-size: 16px" /></div>
<div style="display: flex; flex-direction: column; gap: 8px"><label for="ad-email" style="font-weight: 700; font-size: 14px">Email</label><input id="ad-email" type="email" autocomplete="email" defaultValue={email} style="min-height: 50px; padding: 0 16px; border-radius: 12px; border: 1.5px solid #D6C3A5; background: #FFFFFF; font-family: inherit; font-size: 16px" /></div>
{accountsOn ? <div style="display: flex; flex-direction: column; gap: 8px; grid-column: 1 / -1"><label for="ad-pass" style="font-weight: 700; font-size: 14px">New password <span style="font-weight: 500; color: #5A3A28">(leave blank to keep current)</span></label><input id="ad-pass" type="password" autocomplete="new-password" style="min-height: 50px; padding: 0 16px; border-radius: 12px; border: 1.5px solid #D6C3A5; background: #FFFFFF; font-family: inherit; font-size: 16px" /></div> : null}
{(saved) ? (<Fragment><p role="status" style="grid-column: 1 / -1; margin: 0; padding: 12px 14px; border-radius: 12px; background: #DCEBE8; color: #1F4F4B; font-size: 14px; font-weight: 600">Your details were saved.</p></Fragment>) : null}
<button type="button" onClick={save} style="grid-column: 1 / -1; justify-self: start; min-height: 52px; cursor: pointer; padding: 0 26px; border-radius: 999px; border: none; background: #2B1A12; color: #F7F0E4; font-family: inherit; font-weight: 800; font-size: 16px">Save changes</button>
</form>
</Fragment>) : null}

</div>
</div>
</Fragment>) : null}

</div>
</div>
      </Fragment>
    );
  }
}
