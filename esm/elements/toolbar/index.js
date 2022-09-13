import { compose } from '../../util.js';
import { withModifier } from '../../mixins/modifier.js';
import { withTemplate } from '../../mixins/template.js';

import css from './css.js';

const template = document.createElement('template');
template.innerHTML = `
  <style>${css}</style>
  <div id="left" part="left">
    <slot name="left"></slot>
  </div>
  <div id="center" part="center">
    <slot name="center"></slot>
    <slot></slot>
  </div>
  <div id="right" part="right">
    <slot name="right"></slot>
  </div>
`;

const toolbar = compose(
  withTemplate(template),
  withModifier
);

export default toolbar;
