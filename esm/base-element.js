// The base element.
// This shouldn't do anything at all; functionality should be added using mixins.

class BaseElement extends HTMLElement {

  static get observedAttributes() {
    return [];
  }

  attributeChangedCallback() { }

  connectedCallback() { }

  disconnectedCallback() { }
}

export default BaseElement;
