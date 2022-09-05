import { compose } from '../util.js';
import { withTemplate } from '../mixins/template.js';
import { withModifier } from '../mixins/modifier.js';
import { withStringProperty } from '../mixins/property.js';
import { withEffect } from '../mixins/effect.js';

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

const tab = compose(
  withTemplate(template),
  withModifier,
  withStringProperty(LABEL),
  updateLabel
);

export default tab;
