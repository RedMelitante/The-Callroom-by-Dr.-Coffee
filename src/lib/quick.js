// "Quick add" buttons on drink cards: adds a drink with default options, or removes that quick-added line.
import { getLines, addItem, removeLine } from './cart.js';
import { flashToast } from './live.js';

const QUICK = { size: 'Regular', temp: 'Iced', sugar: '100%', ice: 'Regular ice', oat: false };
const quickLine = (slug) => getLines().find((l) => l.slug === slug && l.size === QUICK.size && l.temp === QUICK.temp && l.sugar === QUICK.sugar && l.ice === QUICK.ice && !l.oat);

/** Returns the design's quick-add fields for a drink card. */
export function quickFx(component, d) {
  const line = component.state.mounted ? quickLine(d.slug) : null;
  const on = !!line;
  return {
    isAdded: on,
    notAdded: !on,
    pressed: on ? 'true' : 'false',
    addLabel: on ? d.name + ' added to your order' : 'Quick add ' + d.name,
    addBg: on ? '#E0A458' : '#2B1A12',
    addFg: on ? '#2B1A12' : '#F7F0E4',
    add: () => {
      if (on) {
        removeLine(line.id);
        component.setState({ toast: null });
      } else {
        addItem(d.slug, QUICK);
        flashToast(component, d.name);
      }
    },
  };
}
