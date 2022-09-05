import { compose } from '../util.js';
import { withTemplate } from '../mixins/template.js';
import { withModifier } from '../mixins/modifier.js';

const template = document.createElement('template');
template.innerHTML = `
  <div part="content">
  </div>
  <div>
    <slot></slot>
  </div>
`;

const tabbar = compose(
  withTemplate(template),
  withModifier
);

export default tabbar;
