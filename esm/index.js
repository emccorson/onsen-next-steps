import { createClass } from './util.js';

import page from './elements/page.js';

const Page = createClass(page);

customElements.define('ons-page', Page);

export { Page };
