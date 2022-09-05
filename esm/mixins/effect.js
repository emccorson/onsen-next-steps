const withEffect = (property, callback) => Base => class extends Base {

  static get observedAttributes() {
    return [...super.observedAttributes, property];
  }

  attributeChangedCallback(name, last, current) {
    super.attributeChangedCallback(name, last, current);
    callback.call(this, name, last, current);
  }
};

export { withEffect };
