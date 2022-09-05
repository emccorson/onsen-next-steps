import { compose } from '../util.js';
import { withTemplate } from '../mixins/template.js';
import { withModifier } from '../mixins/modifier.js';
import { withStringProperty, withBooleanProperty } from '../mixins/property.js';
import { withEffect } from '../mixins/effect.js';

const PAGE = 'page';

const template = document.createElement('template');
template.innerHTML = `
  <input type="radio" hidden></input>
  <button part="button">
    <div id="label"></div>
  </button>
`;

const LABEL = 'label';
const updateLabel = withEffect(
  LABEL,
  function (name, last, current) {
    if (name === LABEL) {
      this.shadowRoot.querySelector('#label').textContent = this[LABEL];
    }
  }
);

const ACTIVE = 'active';
const updateActive = withEffect(
  ACTIVE,
  function (name, last, current) {
    if (name === ACTIVE && this.active && (last === null || last === undefined)) {
      this.dispatchEvent(new CustomEvent(`_${ACTIVE}`, {bubbles: true}));
    }
  }
);

const handleClick = function () {
  this.active = true;
};
const activeOnClick = Base => class extends Base {
  constructor() {
    super();
    this._activeOnClick = handleClick.bind(this);
  }

  connectedCallback() {
    super.connectedCallback();
    this.addEventListener('click', this._activeOnClick);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.removeEventListener('click', this._activeOnClick);
  }
};

const tab = compose(
  withTemplate(template),
  withModifier,
  withStringProperty(PAGE),
  withStringProperty(LABEL),
  updateLabel,
  withBooleanProperty(ACTIVE),
  updateActive,
  activeOnClick
);

export { tab as default, ACTIVE, PAGE };
