// Generated from the Claude Design component SiteHeader.dc.html; markup and styles kept verbatim.
import { Fragment } from 'preact';
import { DCLogic } from '../../lib/dc.js';
import { connectCart, totals } from '../../lib/cart.js';
import { liveStatus, openCartDrawer } from '../../lib/live.js';
import { ROUTES } from '../../lib/site.js';

class Logic extends DCLogic {
constructor(p) { super(p); connectCart(this); liveStatus(this, false); }
renderVals() {
const a = this.props.active ?? 'Home';
const items = [
['Our Menu', ROUTES.OurMenu, ['OurMenu', 'Menu', 'Product', 'Cart', 'Checkout', 'Confirmation']],
['Coffee Cart', '/coffee-cart-events', ['Events']],
['About', '/about-us', ['About']],
['Visit Us', '/visit-us', ['Visit']],
['FAQ', '/faq', ['Faq']],
['Blog', '/blogs', ['Blog', 'Article']]
];
const { count } = totals(this.state.mounted ? undefined : []);
return { st: this.state.st, count, hasCount: count > 0, cartLabel: `Cart, ${count} item${count === 1 ? '' : 's'}`, openCart: openCartDrawer, links: items.map(([label, href, keys]) => ({ label, href, current: keys.includes(a) ? 'page' : undefined, bg: keys.includes(a) ? '#EFE4D2' : 'transparent' })) };
}
}

export default class SiteHeader extends Logic {
  render() {
    const { cartLabel, count, hasCount, links, openCart, st } = this.renderVals();
    return (
      <Fragment>
<header style="position: sticky; top: 0; z-index: 20; width: 100%; background: #F7F0E4; border-bottom: 1px solid #E3D5BF; font-family: 'DM Sans', system-ui, sans-serif; color: #2B1A12">
<div style="max-width: 1320px; margin: 0 auto; min-height: 76px; padding: 0 clamp(20px, 3vw, 40px); box-sizing: border-box; display: flex; align-items: center; gap: 16px">
<a href="/" aria-label="The Callroom by Dr. Coffee — home" style="display: flex; align-items: center; gap: 10px; text-decoration: none; color: #2B1A12; flex: none">
<img src="/images/logo.webp" alt="" style="width: 48px; height: 48px; border-radius: 999px; display: block; flex: none" />
<span style="display: flex; flex-direction: column; line-height: 1"><span style="font-family: 'Bricolage Grotesque', sans-serif; font-weight: 800; font-size: 20px; letter-spacing: -0.02em">The Callroom</span><span style="font-family: 'IBM Plex Mono', monospace; font-size: 10px; letter-spacing: 0.14em; text-transform: uppercase; color: #2F6F6A; margin-top: 3px">by Dr. Coffee</span></span>
</a>
<nav aria-label="Main" style="display: flex; gap: 2px; flex: 1 1 auto; justify-content: center; min-width: 0">
{(links).map((l, _i0) => (<Fragment key={_i0}>
<a href={l.href} aria-current={l.current} style={`padding: 10px 11px; border-radius: 999px; text-decoration: none; font-weight: 600; font-size: 15px; white-space: nowrap; color: #2B1A12; background: ${l.bg}`}>{l.label}</a>
</Fragment>))}
</nav>
<span style={`display: inline-flex; align-items: center; gap: 8px; padding: 7px 12px; border-radius: 999px; background: ${st.bg}; color: ${st.fg}; font-weight: 600; font-size: 13px; white-space: nowrap`}><span style={`width: 8px; height: 8px; border-radius: 999px; background: ${st.dot}`}></span>{st.label}</span>
<a href="/order" style="display: inline-flex; align-items: center; min-height: 44px; padding: 0 20px; border-radius: 999px; background: #2B1A12; color: #F7F0E4; font-weight: 700; font-size: 15px; text-decoration: none; white-space: nowrap">Order Ahead</a>
<a href="/account" aria-label="My account" style="flex: none; width: 44px; height: 44px; border-radius: 999px; border: 1.5px solid #D6C3A5; display: inline-flex; align-items: center; justify-content: center; color: #2B1A12"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="8" r="4" /><path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6" /></svg></a>
<a href="/cart" aria-label={cartLabel} onClick={openCart} style="flex: none; position: relative; width: 44px; height: 44px; border-radius: 999px; border: 1.5px solid #D6C3A5; display: inline-flex; align-items: center; justify-content: center; color: #2B1A12">
<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 7h12l-1 13H7z" /><path d="M9 7a3 3 0 0 1 6 0" /></svg>
{hasCount ? <span style="position: absolute; top: -4px; right: -4px; min-width: 20px; height: 20px; padding: 0 5px; box-sizing: border-box; border-radius: 999px; background: #E0A458; color: #2B1A12; font-weight: 800; font-size: 11px; display: flex; align-items: center; justify-content: center">{count}</span> : null}
</a>
</div>
</header>
      </Fragment>
    );
  }
}
