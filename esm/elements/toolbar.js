import { compose } from '../util.js';
import { withModifier } from '../mixins/modifier.js';
import { withTemplate } from '../mixins/template.js';

const template = document.createElement('template');
template.innerHTML = `
  <div part="left">
    <slot name="left"></slot>
  </div>
  <div part="center">
    <slot name="center"></slot>
    <slot></slot>
  </div>
  <div part="right">
    <slot name="right"></slot>
  </div>
`;

const toolbar = compose(
  withTemplate(template),
  withModifier
);

export default toolbar;
