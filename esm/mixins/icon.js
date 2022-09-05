import { compose } from '../util.js';
import { withStringProperty } from './property.js';
import { withEffect } from './effect.js';

const ICON = 'icon';

const updateIcon = withEffect(
  ICON,
  function (name, last, current) {
    if (name === ICON) {
      this.classList.remove(last);
      this.classList.add(current);
    }
  }
);

const withIcon = compose(
  withStringProperty(ICON),
  updateIcon
);

export { withIcon };
