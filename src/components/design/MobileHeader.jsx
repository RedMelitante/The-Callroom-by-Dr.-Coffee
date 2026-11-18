// Generated from the Claude Design component MobileHeader.dc.html; markup and styles kept verbatim.
import { Fragment } from 'preact';
import { DCLogic } from '../../lib/dc.js';
import { liveStatus } from '../../lib/live.js';
import { ROUTES, CONTACT } from '../../lib/site.js';

class Logic extends DCLogic {
constructor(p) { super(p); this.state = { open: false }; liveStatus(this, true); }
renderVals() {
const o = this.state.open;
const items = [['Home', 'Home'], ['Our Menu', 'OurMenu'], ['Order Ahead', 'Menu'], ['Coffee Cart & Events', 'Events'], ['Book the Coffee Cart', 'Booking'], ['About', 'About'], ['Visit Us', 'Visit'], ['FAQ', 'Faq'], ['Blog', 'Blog'], ['My account', 'Account']];
return { open: o, closed: !o, expanded: o ? 'true' : 'false', menuLabel: o ? 'Close menu' : 'Open menu', toggle: () => this.setState({ open: !o }),
links: items.map(([label, p]) => ({ label, href: ROUTES[p] })), st: this.state.st };
}
}

export default class MobileHeader extends Logic {
  render() {
    const { closed, expanded, links, menuLabel, open, st, toggle } = this.renderVals();
    return (
      <Fragment>
<header style="position: sticky; top: 0; z-index: 30; width: 100%; height: 64px; box-sizing: border-box; padding: 0 16px; background: #F7F0E4; border-bottom: 1px solid #E3D5BF; display: flex; align-items: center; gap: 10px; font-family: 'DM Sans', system-ui, sans-serif; color: #2B1A12">
<a href="/" aria-label="The Callroom by Dr. Coffee — home" style="display: flex; align-items: center; gap: 8px; text-decoration: none; color: #2B1A12; flex: 1 1 auto; min-width: 0">
<img src="/images/logo.webp" alt="" style="width: 40px; height: 40px; border-radius: 999px; display: block; flex: none" />
<span style="font-family: 'Bricolage Grotesque', sans-serif; font-weight: 800; font-size: 18px; letter-spacing: -0.02em; white-space: nowrap">The Callroom</span>
</a>
<span style={`display: inline-flex; align-items: center; gap: 6px; padding: 6px 10px; border-radius: 999px; background: ${st.bg}; color: ${st.fg}; font-weight: 700; font-size: 12px; white-space: nowrap`}><span style={`width: 7px; height: 7px; border-radius: 999px; background: ${st.dot}`}></span>{st.label}</span>
<button type="button" aria-label={menuLabel} aria-expanded={expanded} onClick={toggle} style="width: 44px; height: 44px; border: none; background: transparent; color: #2B1A12; display: inline-flex; align-items: center; justify-content: center; padding: 0; margin-right: -8px">
{(closed) ? (<Fragment><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16" /></svg></Fragment>) : null}
{(open) ? (<Fragment><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" /></svg></Fragment>) : null}
</button>
{(open) ? (<Fragment>
<nav aria-label="Mobile" style="position: absolute; left: 0; right: 0; top: 64px; z-index: 40; background: #F7F0E4; border-bottom: 1px solid #E3D5BF; box-shadow: 0 18px 30px rgba(43, 26, 18, 0.16); padding: 8px 16px 18px; display: flex; flex-direction: column">
{(links).map((l, _i0) => (<Fragment key={_i0}>
<a href={l.href} style="display: flex; align-items: center; justify-content: space-between; min-height: 52px; border-bottom: 1px dashed #D6C3A5; color: #2B1A12; font-weight: 700; font-size: 17px; text-decoration: none">{l.label}<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#8A4F17" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 6l6 6-6 6" /></svg></a>
</Fragment>))}
<div style="display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 10px; margin-top: 16px">
<a href={CONTACT.tel} style="display: flex; align-items: center; justify-content: center; min-height: 48px; border-radius: 999px; border: 1.5px solid #2B1A12; color: #2B1A12; font-weight: 700; text-decoration: none">Call us</a>
<a href="https://www.facebook.com/share/19KisJPYkX/" style="display: flex; align-items: center; justify-content: center; min-height: 48px; border-radius: 999px; background: #2F6F6A; color: #FFFFFF; font-weight: 700; text-decoration: none">Message us</a>
</div>
</nav>
</Fragment>) : null}
</header>
      </Fragment>
    );
  }
}
