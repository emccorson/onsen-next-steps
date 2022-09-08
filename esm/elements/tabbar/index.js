import { compose } from '../../util.js';
import { withTemplate } from '../../mixins/template.js';
import { withModifier } from '../../mixins/modifier.js';
import { ACTIVE, PAGE } from '../tab/index.js';

import css from './css.js';

const template = document.createElement('template');
template.innerHTML = `
  <style>${css}</style>
  <div part="content" id="content">
  </div>
  <div part="footer" id="footer">
    <slot></slot>
  </div>
`;

// this is an over-simplification for demo purposes
// the real page loader is much more complicated
const loadPage = function () {
  const pageId = this._lastActiveTab[PAGE];
  const pageTemplate = Array.from(document.querySelectorAll('template'))
    .find(node => node.id === pageId);
  const content = this.shadowRoot.querySelector('#content');
  content.replaceChildren(pageTemplate.content.cloneNode(true));
};

const updateTabs = function (event) {
  if (this._lastActiveTab) {
    this._lastActiveTab[ACTIVE] = false;
  }
  this._lastActiveTab = event.target;

  loadPage.call(this);
};

const watchTabs = Base => class extends Base {
  constructor() {
    super();
    this._updateTabs = updateTabs.bind(this);
    this._lastActiveTab = null;
  }

  connectedCallback() {
    super.connectedCallback();

    const tabs = this.shadowRoot.querySelector('slot').assignedNodes()
      .filter(node => node.tagName === 'ONS-TAB');
    const activeTab = tabs.find(tab => tab[ACTIVE]);
    if (activeTab) {
      this._lastActiveTab = activeTab;
    } else {
      this._lastActiveTab = tabs[0];
      tabs[0][ACTIVE] = true;
    }
    loadPage.call(this);

    this.addEventListener(`_${ACTIVE}`, this._updateTabs);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.removeEventListener(`_${ACTIVE}`, this._updateTabs);
  }
};

const tabbar = compose(
  withTemplate(template),
  withModifier,
  watchTabs
);

export default tabbar;
