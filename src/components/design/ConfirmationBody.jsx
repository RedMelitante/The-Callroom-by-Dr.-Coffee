// Generated from the Claude Design component ConfirmationBody.dc.html; markup and styles kept verbatim.
import { Fragment } from 'preact';
import { DCLogic } from '../../lib/dc.js';
import { peso } from '../../lib/catalog.js';
import { KIOSK_LANDMARK, ONLINE_PAYMENTS } from '../../lib/site.js';

class Logic extends DCLogic {
constructor(p) { super(p); this.state = { order: null, ready: false }; }
componentDidMount() {
let order = null;
try { order = JSON.parse(sessionStorage.getItem('callroom:last-order') || 'null'); } catch { /* ignore */ }
this.setState({ order, ready: true });
}
renderVals() {
const o = this.state.order;
const first = o ? o.name.split(' ')[0] : '';
const tail = KIOSK_LANDMARK ? ` ${KIOSK_LANDMARK}` : '';
return {
has: !!o, none: this.state.ready && !o,
thanks: o ? (o.via === 'email' ? `Thanks, ${first}. Your email app has opened with your order: press send so it reaches us. We'll start brewing a few minutes before your pickup time.` : `Thanks, ${first}. We'll start brewing a few minutes before your pickup time.`) : '',
payTag: o ? (ONLINE_PAYMENTS ? `Paid · ${o.pay}` : `Pay at pickup · ${o.pay}`) : '',
no: o?.no, pickup: o ? `${o.when}, ${o.slot.replace(' · ~15 min', '')}` : '',
items: o ? o.items.map((i) => ({ label: `${i.name} · ${i.size === 'Large' ? 'L' : 'R'}${i.qty > 1 ? ` ×${i.qty}` : ''}`, price: peso(i.total) })) : [],
total: o ? peso(o.total) : '',
step3: `Look for the kiosk${tail}. Show order no. ${o?.no || ''}.`
};
}
}

export default class ConfirmationBody extends Logic {
  render() {
    const { has, items, no, none, payTag, pickup, step3, thanks, total } = this.renderVals();
    return (
      <Fragment>
<div style="width: 100%; font-family: 'DM Sans', system-ui, sans-serif; color: #2B1A12; background: #F7F0E4; padding: clamp(28px, 5vw, 64px) clamp(20px, 4vw, 40px) clamp(56px, 7vw, 96px); box-sizing: border-box">
<div style="max-width: 1040px; margin: 0 auto; display: flex; flex-direction: column; gap: 28px">

{none ? (<div style="display: flex; flex-direction: column; align-items: flex-start; gap: 14px">
<h1 style="margin: 0; font-family: 'Bricolage Grotesque', sans-serif; font-weight: 800; font-size: clamp(36px, 5vw, 60px); letter-spacing: -0.03em; line-height: 1">No recent order</h1>
<p style="margin: 0; font-size: 18px; color: #5A3A28; line-height: 1.6">We couldn't find an order placed from this browser. Start a new one from the menu.</p>
<a href="/order" style="display: inline-flex; align-items: center; min-height: 54px; padding: 0 26px; border-radius: 999px; background: #2B1A12; color: #F7F0E4; font-weight: 700; font-size: 16px; text-decoration: none">Order Ahead</a>
</div>) : null}
{has ? (<Fragment>
<div style="display: flex; flex-direction: column; align-items: flex-start; gap: 14px">
<span style="width: 60px; height: 60px; border-radius: 999px; background: #2F6F6A; color: #FFFFFF; display: flex; align-items: center; justify-content: center"><svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7" /></svg></span>
<h1 style="margin: 0; font-family: 'Bricolage Grotesque', sans-serif; font-weight: 800; font-size: clamp(36px, 5vw, 60px); letter-spacing: -0.03em; line-height: 1">Prescription received.</h1>
<p style="margin: 0; font-size: 18px; color: #5A3A28; line-height: 1.6">{thanks}</p>
</div>

<div style="display: flex; flex-wrap: wrap; gap: 20px; align-items: stretch">
<div style="flex: 1 1 340px; min-width: 0; background: #FFFBF4; border: 1px solid #D6C3A5; border-radius: 24px; overflow: hidden; display: flex; flex-direction: column">
<div style="display: flex; justify-content: space-between; padding: 12px 22px; background: #2B1A12; color: #F7F0E4; font-family: 'IBM Plex Mono', monospace; font-size: 12px; letter-spacing: 0.1em; text-transform: uppercase"><span>Rx · Pickup slip</span><span>{payTag}</span></div>
<div style="padding: 22px; display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 18px">
<div style="display: flex; flex-direction: column; gap: 4px"><span style="font-family: 'IBM Plex Mono', monospace; font-size: 11px; letter-spacing: 0.12em; text-transform: uppercase; color: #5A3A28">Order no.</span><span style="font-family: 'IBM Plex Mono', monospace; font-weight: 600; font-size: clamp(24px, 3vw, 32px)">{no}</span></div>
<div style="display: flex; flex-direction: column; gap: 4px"><span style="font-family: 'IBM Plex Mono', monospace; font-size: 11px; letter-spacing: 0.12em; text-transform: uppercase; color: #5A3A28">Pickup</span><span style="font-family: 'Bricolage Grotesque', sans-serif; font-weight: 800; font-size: clamp(24px, 3vw, 32px)">{pickup}</span></div>
<div style="grid-column: 1 / -1; display: flex; flex-direction: column; gap: 8px; padding-top: 16px; border-top: 1px dashed #D6C3A5; font-size: 15px">
{items.map((i, k) => (<div key={k} style="display: flex; justify-content: space-between"><span>{i.label}</span><span style="font-family: 'IBM Plex Mono', monospace">{i.price}</span></div>))}
<div style="display: flex; justify-content: space-between; font-weight: 800; padding-top: 6px"><span>Total</span><span style="font-family: 'IBM Plex Mono', monospace">{total}</span></div>
</div>
</div>
<div style="margin-top: auto; padding: 16px 22px; background: #DCEBE8; color: #1F4F4B; display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 8px; font-size: 13px; font-weight: 700">
<span style="display: flex; flex-direction: column; gap: 6px"><span style="height: 6px; border-radius: 999px; background: #2F6F6A"></span>Received</span>
<span style="display: flex; flex-direction: column; gap: 6px"><span style="height: 6px; border-radius: 999px; background: #A9CCC6"></span>Brewing</span>
<span style="display: flex; flex-direction: column; gap: 6px"><span style="height: 6px; border-radius: 999px; background: #A9CCC6"></span>Ready</span>
</div>
</div>

<div style="flex: 1 1 340px; min-width: 0; background: #FFFBF4; border: 1px solid #E3D5BF; border-radius: 24px; padding: 22px; display: flex; flex-direction: column; gap: 16px">
<h2 style="margin: 0; font-family: 'Bricolage Grotesque', sans-serif; font-weight: 800; font-size: 24px">Pick up at the 2nd floor kiosk</h2>
<div role="img" aria-label="Simple floor map: main entrance on JV Serina St, stairs and elevators up to the 2nd floor, kiosk marked near the lobby" style="position: relative; height: 200px; border-radius: 16px; background: #EFE4D2; border: 1px solid #E3D5BF; overflow: hidden">
<div style="position: absolute; left: 0; right: 0; bottom: 0; height: 34px; background: #D6C3A5; display: flex; align-items: center; padding: 0 14px; font-family: 'IBM Plex Mono', monospace; font-size: 11px; letter-spacing: 0.1em; text-transform: uppercase; color: #3A261B">JV Serina St</div>
<div style="position: absolute; left: 16px; top: 16px; width: 44%; height: 104px; border: 2px solid #B79C7A; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 700; color: #5A3A28">Wards</div>
<div style="position: absolute; right: 16px; top: 16px; width: 28%; height: 50px; border: 2px solid #B79C7A; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 700; color: #5A3A28">Lifts · Stairs</div>
<div style="position: absolute; right: 18%; top: 92px; display: flex; flex-direction: column; align-items: center; gap: 4px">
<span style="width: 40px; height: 40px; border-radius: 999px; background: #2B1A12; color: #F7F0E4; display: flex; align-items: center; justify-content: center; border: 3px solid #E0A458"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 8h13v5a6 6 0 0 1-6 6h-1a6 6 0 0 1-6-6z" /><path d="M17 10h1.5a2.5 2.5 0 0 1 0 5H17" /></svg></span>
<span style="font-size: 12px; font-weight: 800; background: #FFFBF4; padding: 2px 8px; border-radius: 6px">The Callroom</span>
</div>
</div>
<ol style="margin: 0; padding: 0; list-style: none; display: flex; flex-direction: column; gap: 10px; font-size: 15px; line-height: 1.5">
<li style="display: flex; gap: 12px"><span style="width: 26px; height: 26px; flex: none; border-radius: 999px; background: #2B1A12; color: #F7F0E4; font-family: 'IBM Plex Mono', monospace; font-size: 12px; display: flex; align-items: center; justify-content: center">1</span>Enter Madonna Hospital from JV Serina St.</li>
<li style="display: flex; gap: 12px"><span style="width: 26px; height: 26px; flex: none; border-radius: 999px; background: #2B1A12; color: #F7F0E4; font-family: 'IBM Plex Mono', monospace; font-size: 12px; display: flex; align-items: center; justify-content: center">2</span>Take the lift or stairs to the 2nd floor.</li>
<li style="display: flex; gap: 12px"><span style="width: 26px; height: 26px; flex: none; border-radius: 999px; background: #2B1A12; color: #F7F0E4; font-family: 'IBM Plex Mono', monospace; font-size: 12px; display: flex; align-items: center; justify-content: center">3</span>{step3}</li>
</ol>
<div style="display: flex; flex-wrap: wrap; gap: 10px">
<a href="/visit-us" style="display: inline-flex; align-items: center; min-height: 48px; padding: 0 18px; border-radius: 999px; border: 1.5px solid #2B1A12; color: #2B1A12; font-weight: 700; text-decoration: none">Full directions</a>
<a href="tel:09327233849" style="display: inline-flex; align-items: center; min-height: 48px; padding: 0 18px; border-radius: 999px; background: #2F6F6A; color: #FFFFFF; font-weight: 700; text-decoration: none">Call the kiosk</a>
</div>
</div>
</div>

</Fragment>) : null}
<div style="display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; gap: 12px; padding: 18px 22px; border-radius: 20px; border: 1.5px dashed #B79C7A">
<span style="font-size: 15px; color: #5A3A28">Running late? Call us at <a href="tel:09327233849" style="color: inherit; font-weight: 700">0932 723 3849</a>.</span>
<a href="/order" style="font-weight: 700; color: #8A4F17; min-height: 44px; display: inline-flex; align-items: center">Back to menu</a>
</div>
</div>
</div>
      </Fragment>
    );
  }
}
