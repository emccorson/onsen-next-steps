import { compose } from '../util.js';
import { withBooleanProperty } from './property.js';
import { withTemplate } from './template.js';
import { withIcon } from './icon.js';

const DISABLED = 'disabled';

const template = document.createElement('template');
template.innerHTML = `
  <slot></slot>
  <button hidden></button>
`;

const withButtonBase = compose(
  withTemplate(template),
  withBooleanProperty(DISABLED),
  withIcon
);

export { withButtonBase };
