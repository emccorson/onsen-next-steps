import { compose } from '../util.js';
import { withTemplate } from '../mixins/template.js';
import { withModifier } from '../mixins/modifier.js';

const template = document.createElement('template');
template.innerHTML = `
  <slot name="toolbar"></slot>
  <div part="background"></div>
  <div part="content">
    <slot></slot>
  </div>
`;

const page = compose(
  withTemplate(template),
  withModifier
);

export default page;
