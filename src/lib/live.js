// Small client-side behaviours shared by the design components.
import { status } from './hours.js';

/** Keeps this.state.st (the open/closed pill) current. Server render shows the design's "Open" pill. */
export function liveStatus(component, short) {
  component.state = { ...(component.state || {}), st: status(short, { day: 1, minutes: 9 * 60 }) };
  const didMount = component.componentDidMount?.bind(component);
  const willUnmount = component.componentWillUnmount?.bind(component);
  let timer;
  component.componentDidMount = () => {
    const tick = () => component.setState({ st: status(short) });
    tick();
    timer = setInterval(tick, 60000);
    didMount?.();
  };
  component.componentWillUnmount = () => {
    clearInterval(timer);
    willUnmount?.();
  };
}

export const OPEN_CART = 'callroom:open-cart';

/** Opens the slide-out cart. Falls back to the /cart link if the drawer isn't on the page. */
export function openCartDrawer(e) {
  if (!document.getElementById('cart-drawer')) return;
  e?.preventDefault();
  window.dispatchEvent(new CustomEvent(OPEN_CART));
}

let toastTimer;
/** Shows the design's "added" toast for a few seconds. */
export function flashToast(component, name) {
  component.setState({ toast: name });
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => component.setState({ toast: null }), 4000);
}
