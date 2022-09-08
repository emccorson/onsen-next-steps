import { compose } from '../../util.js';
import { withTemplate } from '../../mixins/template.js';
import { withModifier } from '../../mixins/modifier.js';
import { ACTIVE, PAGE } from '../tab/index.js';

import css from './css.js';
import withAnimation from './animation.js';

const template = document.createElement('template');
template.innerHTML = `
  <style>${css}</style>
  <div part="content" id="content">
    <div id="swiper-target"></div>
  </div>
  <div part="footer" id="footer">
    <slot></slot>
  </div>
`;

// this is an over-simplification for demo purposes
// the real page loader is much more complicated
const loadPages = function () {
  const templates = Array.from(document.querySelectorAll('template'));
  const pages = this.shadowRoot.querySelector('slot').assignedNodes()
    .filter(node => node.tagName === 'ONS-TAB')
    .map(node => {
      const pageId = node[PAGE];
      const pageTemplate = templates.find(node => node.id === pageId);
      return pageTemplate.content.cloneNode(true);
    });
  const swiperTarget = this.shadowRoot.querySelector('#swiper-target');
  swiperTarget.replaceChildren(...pages);

  const index = this.shadowRoot.querySelector('slot').assignedElements().findIndex(node => node[ACTIVE]);
  const offset = 0 - (swiperTarget.offsetWidth * index);
  swiperTarget.style.transform = `translate3d(${offset}px, 0, 0)`;
};

const updateTabs = function (event) {
  if (this._lastActiveTab) {
    this._lastActiveTab[ACTIVE] = false;
  }
  this._lastActiveTab = event.target;

  loadPages.call(this);
};

const watchTabs = Base => class extends Base {
  constructor() {
    super();
    this._updateTabs = updateTabs.bind(this);
    this._lastActiveTab = null;
  }

  connectedCallback() {
    super.connectedCallback();

    const slot = this.shadowRoot.querySelector('slot');
    const tabs = slot.assignedNodes()
      .filter(node => node.tagName === 'ONS-TAB');
    const activeTab = tabs.find(tab => tab[ACTIVE]);
    if (activeTab) {
      this._lastActiveTab = activeTab;
    } else {
      this._lastActiveTab = tabs[0];
      tabs[0][ACTIVE] = true;
    }
    loadPages.call(this);

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
  watchTabs,
  withAnimation
);

export default tabbar;
