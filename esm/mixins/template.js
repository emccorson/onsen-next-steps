import { compose } from '../util.js';

const withTemplateExtra = extra => Base => class extends Base {
  constructor() {
    super();
    this.shadowRoot.appendChild(extra.content.cloneNode(true));
  }
};

const withTemplate = template => compose(
  Base => class extends Base {
    constructor() {
      super();
      this.attachShadow({mode: 'open'});
    }
  },
  withTemplateExtra(template)
);

const slotTemplate = document.createElement('template');
slotTemplate.innerHTML = '<slot></slot>';
const withSlot = withTemplate(slotTemplate);

export { withTemplate, withSlot, withTemplateExtra };
