import { createClass } from './util.js';

import page from './elements/page/index.js';
import toolbar from './elements/toolbar/index.js';
import tab from './elements/tab/index.js';
import tabbar from './elements/tabbar/index.js';

const Page = createClass(page);
customElements.define('ons-page', Page);

const Toolbar = createClass(toolbar);
customElements.define('ons-toolbar', Toolbar);

const Tab = createClass(tab);
customElements.define('ons-tab', Tab);

const Tabbar = createClass(tabbar);
customElements.define('ons-tabbar', Tabbar);

export {
  Page,
  Toolbar,
  Tab,
  Tabbar
};
