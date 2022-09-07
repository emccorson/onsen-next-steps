import { compose } from '../../util.js';
import { withTemplate } from '../../mixins/template.js';
import { withModifier } from '../../mixins/modifier.js';

import css from './css.js';

const template = document.createElement('template');
template.innerHTML = `
  <style>${css}</style>
  <slot name="toolbar"></slot>
  <div id="background" part="background"></div>
  <div id="content" part="content">
    <slot></slot>
  </div>
`;

const checkToolbar = Base => class extends Base {
  constructor() {
    super();
    const toolbarSlot = this.shadowRoot.querySelector('slot[name="toolbar"]');
    toolbarSlot.addEventListener('slotchange', () =>
      toolbarSlot.classList.toggle('has-toolbar', toolbarSlot.assignedNodes().length !== 0)
    );
  }
};

const page = compose(
  withTemplate(template),
  withModifier,
  checkToolbar
);

export default page;
