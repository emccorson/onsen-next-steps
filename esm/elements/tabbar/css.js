export default `

/* .tabbar { */
::part(footer) {
  font-family: -apple-system, 'Helvetica Neue', 'Helvetica', 'Arial', 'Lucida Grande', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-weight: var(--font-weight);

  display: flex;
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  white-space: nowrap;
  margin: 0;
  padding: 0;
  height: var(--tabbar-height);
  background-color: var(--tabbar-background-color);
  border-top: var(--tabbar-border-top);
  width: 100%;
}

@media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi), (min-resolution: 2dppx) {
  /* .tabbar { */
  ::part(footer) {
    border-top: none;
    background-size: 100% 1px;
    background-repeat: no-repeat;
    background-position: top;
    background-image: linear-gradient(180deg, var(--tabbar-border-color), var(--tabbar-border-color) 50%, transparent 50%);
  }
}

/* .tabbar__content { */
::part(content) {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: var(--tabbar-height);
  z-index: 0;
}

/* .tabbar--material { */
:host([modifier~="material"])::part(footer) {
  background: none;
  background-color: var(--material-tabbar-background-color);
  border-bottom-width: 0;
  box-shadow:
    0 4px 2px -2px rgba(0, 0, 0, 0.14),
    0 3px 5px -2px rgba(0, 0, 0, 0.12),
    0 5px 1px -4px rgba(0, 0, 0, 0.2);
}


/* swiper.css */

/* .ons-swiper { */
#content {
  overflow: hidden;
  display: block;
  box-sizing: border-box;
}

/* .ons-swiper-target { */
#swiper-target {
  display: flex;
  height: 100%;
  z-index: 1;
  flex-direction: row;
}

/* .ons-swiper-target > * { */
#swiper-target > * {
  height: inherit;
  flex-shrink: 0;
  box-sizing: border-box;
  width: 100%;
  position: relative !important;
}

`;
