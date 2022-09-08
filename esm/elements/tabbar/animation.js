import { compose } from '../../util.js';
import { withEnumProperty } from '../../mixins/property.js';
import { withEffect } from '../../mixins/effect.js';

const ANIMATION = 'animation';

const animations = Object.freeze({
  SLIDE: 'slide',
  NONE: 'none'
});

const updateAnimation = function () {
  const swiperTarget = this.shadowRoot.querySelector('#swiper-target');

  switch (this.animation) {
    case animations.SLIDE:
      swiperTarget.style.transition = "all 0.3s cubic-bezier(0.4, 0.7, 0.5, 1) 0s";
      break;
    case animations.NONE:
      swiperTarget.style.transition = null;
      break;
  }
};

const animationEffect = withEffect(
  ANIMATION,
  function (name, last, current) {
    if (name === ANIMATION) {
      updateAnimation.call(this);
    }
  }
);

const whenConnected = Base => class extends Base {
  connectedCallback() {
    super.connectedCallback();
    updateAnimation.call(this);
  }
};

const withAnimation = compose(
  withEnumProperty(ANIMATION, Object.values(animations)),
  animationEffect,
  whenConnected
);

export { withAnimation as default, ANIMATION };
