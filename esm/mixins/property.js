const withProperty = (getter, setter, property) => Base => class extends Base {
  constructor() {
    super();

    if (this.hasOwnProperty(property)) {
      let value = this[property];
      delete this[property];
      this[property] = value;
    }
  }

  get [property]() {
    return getter.call(this);
  }

  set [property](value) {
    setter.call(this, value);
  }
};

const withStringProperty = property => {
  const getter = function () { return this.getAttribute(property); };

  const setter = function (value) {
    if (value === null || value === undefined) {
      this.removeAttribute(property);
    } else {
      this.setAttribute(property, value);
    }
  };

  return withProperty(getter, setter, property);
};

const withBooleanProperty = property => {
  const getter = function () { return this.hasAttribute(property); };

  const setter = function (value) {
    if (value) {
      this.setAttribute(property, '');
    } else {
      this.removeAttribute(property);
    }
  };

  return withProperty(getter, setter, property);
};

export { withProperty, withStringProperty, withBooleanProperty };
