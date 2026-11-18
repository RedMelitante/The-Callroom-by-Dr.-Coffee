// Generated from the Claude Design component BottomNav.dc.html; markup and styles kept verbatim.
import { Fragment } from 'preact';
import { DCLogic } from '../../lib/dc.js';
import { connectCart, totals } from '../../lib/cart.js';

class Logic extends DCLogic {
constructor(p) { super(p); connectCart(this); }
renderVals() {
const a = this.props.active ?? 'Home';
const defs = [
{ key: 'home', label: 'Home', href: '/', on: ['Home', 'About', 'Visit', 'Faq', 'Blog', 'Article'] },
{ key: 'menu', label: 'Menu', href: '/menu', on: ['OurMenu', 'Menu', 'Product'] },
{ key: 'cart', label: 'Cart', href: '/cart', on: ['Cart', 'Checkout', 'Confirmation'] },
{ key: 'events', label: 'Events', href: '/coffee-cart-events', on: ['Events'] }
];
const { count } = totals(this.state.mounted ? undefined : []);
return { count, tabs: defs.map((d) => {
const act = d.on.includes(a);
return { aria: d.key === 'cart' ? `Cart, ${count} item${count === 1 ? '' : 's'}` : undefined, current: act ? 'page' : undefined, label: d.label, href: d.href, home: d.key === 'home', menu: d.key === 'menu', cart: d.key === 'cart', events: d.key === 'events', fg: act ? '#2B1A12' : '#EADBC4', bg: act ? '#E0A458' : 'transparent' };
}) };
}
}

export default class BottomNav extends Logic {
  render() {
    const { count, tabs } = this.renderVals();
    return (
      <Fragment>
<nav aria-label="Quick" style="position: sticky; bottom: 0; z-index: 30; width: 100%; height: 76px; box-sizing: border-box; padding: 8px 8px 12px; background: #2B1A12; display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 4px; font-family: 'DM Sans', system-ui, sans-serif; border-radius: 22px 22px 0 0">
{(tabs).map((t, _i0) => (<Fragment key={_i0}>
<a href={t.href} aria-label={t.aria} aria-current={t.current} style={`position: relative; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 4px; border-radius: 14px; text-decoration: none; color: ${t.fg}; background: ${t.bg}; font-size: 12px; font-weight: 700`}>
{(t.home) ? (<Fragment><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 11l8-7 8 7v9H4z" /><path d="M10 20v-6h4v6" /></svg></Fragment>) : null}
{(t.menu) ? (<Fragment><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 8h13v5a6 6 0 0 1-6 6h-1a6 6 0 0 1-6-6z" /><path d="M17 10h1.5a2.5 2.5 0 0 1 0 5H17" /><path d="M8 2v3M12 2v3" /></svg></Fragment>) : null}
{(t.cart) ? (<Fragment><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 7h12l-1 13H7z" /><path d="M9 7a3 3 0 0 1 6 0" /></svg>{count > 0 ? <span style="position: absolute; top: 4px; left: 54%; min-width: 18px; height: 18px; padding: 0 5px; box-sizing: border-box; border-radius: 999px; background: #E0A458; color: #2B1A12; font-size: 10px; font-weight: 800; display: flex; align-items: center; justify-content: center">{count}</span> : null}</Fragment>) : null}
{(t.events) ? (<Fragment><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3.5" y="5" width="17" height="15" rx="2" /><path d="M3.5 10h17M8 3v4M16 3v4" /></svg></Fragment>) : null}
<span>{t.label}</span>
</a>
</Fragment>))}
</nav>
      </Fragment>
    );
  }
}
