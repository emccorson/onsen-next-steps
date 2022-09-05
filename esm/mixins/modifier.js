import { withStringProperty, withBooleanProperty } from './property.js';
import { withEffect } from './effect.js';
import { compose } from '../util.js';

const MODIFIER = 'modifier';

const updateModifier = function () {
  this.shadowRoot?.querySelector('slot').assignedNodes()
    .filter(e => e.tagName && e.tagName.startsWith('ONS-'))
    .forEach(e => e[MODIFIER] = this[MODIFIER]);
};

const modifierProp = withStringProperty(MODIFIER);

const modifierEffect = withEffect(
  MODIFIER,
  function (name, last, current) {
    if (name === MODIFIER) {
      updateModifier.call(this);
    }
  }
);

const modifierBase = Base => class extends Base {
  constructor() {
    super();
    this.shadowRoot?.querySelector('slot')
      .addEventListener('slotchange', updateModifier.bind(this));
  }
};


const withModifier = compose(
  modifierBase,
  modifierProp,
  modifierEffect
);

export { withModifier };
