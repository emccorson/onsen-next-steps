import BaseElement from './base-element.js';

const compose = (...mixins) => Base =>
  mixins.reduce((_class, f) => f(_class), Base);

const createClass = (...mixins) => class extends compose(...mixins)(BaseElement) {};

export { compose, createClass };
