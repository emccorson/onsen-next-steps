export default `

/* .tabbar__item { */
:host {
  font-family: -apple-system, 'Helvetica Neue', 'Helvetica', 'Arial', 'Lucida Grande', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-weight: var(--font-weight);

  position: relative;

  flex-grow: 1;
  flex-basis: 0;
  width: auto;
  border-radius: 0;
}

/* .tabbar__item > input { */
#input {
  position: absolute;
  right: 0;
  top: 0;
  left: 0;
  bottom: 0;
  padding: 0;
  border: 0;
  background-color: transparent;
  z-index: 1;
  vertical-align: top;
  outline: none;
  width: 100%;
  height: 100%;
  margin: 0;
  appearance: none;
}

/* .tabbar__button { */
::part(button) {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;

  box-sizing: border-box;

  margin: 0;
  font: inherit;
  background: transparent;
  border: none;

  cursor: default;
  user-select: none;

  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;

  position: relative;
  display: inline-block;
  text-decoration: none;
  padding: 0;
  height: var(--tabbar-button-line-height);
  letter-spacing: 0;
  color: var(--tabbar-button-color);
  vertical-align: top;
  background-color: transparent;
  border-top: var(--tabbar-button-border);
  width: 100%;
  font-weight: var(--font-weight);
  line-height: var(--tabbar-button-line-height);
}

/* @media (--retina-query) */
@media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi), (min-resolution: 2dppx) {
  /* .tabbar__button { */
  ::part(button) {
    border-top: none;
  }
}

.tabbar__icon {
  font-size: 24px;
  padding: 0;
  margin: 0;
  line-height: 26px;
  display: block !important; /* stylelint-disable-line declaration-no-important */
  height: 28px;
}

/* WHAT DO WE DO?
.tabbar__label {

  font-family: -apple-system, 'Helvetica Neue', 'Helvetica', 'Arial', 'Lucida Grande', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-weight: var(--font-weight);

  display: inline-block;
}

.tabbar__badge.notification {
  vertical-align: text-bottom;
  top: -1px;
  margin-left: 5px;
  z-index: 10;
  font-size: 12px;
  height: 16px;
  min-width: 16px;
  line-height: 16px;
  border-radius: 8px;
}

.tabbar__icon ~ .tabbar__badge.notification {
  position: absolute;
  top: 5px;
  margin-left: 0;
}

.tabbar__icon + .tabbar__label {
  display: block;
  font-size: 10px;
  line-height: 1;
  margin: 0;
  font-weight: var(--font-weight);
}

.tabbar__label:first-child {
  font-size: 16px;
  line-height: var(--tabbar-button-line-height);
  margin: 0;
  padding: 0;
}
*/

/* :checked + .tabbar__button { */
:host([active])::part(button) {
  color: var(--tabbar-active-color);
  background-color: transparent;
  box-shadow: var(--tabbar-active-box-shadow);
  border-top: var(--tabbar-active-border-top);
}

/* .tabbar__button:focus { */
::part(button):focus {
  z-index: 1;
  border-top: var(--tabbar-focus-border-top);
  box-shadow: var(--tabbar-button-focus-box-shadow);
  outline: 0;
}

/* .tabbar--material__button { */
:host([modifier~="material"])::part(button) {
  background-color: transparent;
  color: var(--material-tabbar-text-color);
  text-transform: uppercase;
  font-size: 14px;

  /* mixin: material-font */
  font-family: 'Roboto', 'Noto', sans-serif;
  -webkit-font-smoothing: antialiased;
  font-weight: var(--material-font-weight);
}

/* .tabbar--material__button:after { */
:host([modifier~="material"])::part(button):after {
  content: '';
  display: block;
  width: 0;
  height: 2px;
  bottom: 0;
  position: absolute;
  margin-top: -2px;
  background-color: var(--material-tabbar-current-color);
}

/* :checked + .tabbar--material__button:after { */
:host([modifier~="material"]):host([active])::part(button):after {
  width: 100%;
  transition: width 0.2s ease-in-out;
}

/* :checked + .tabbar--material__button { */
:host([modifier~="material"]):host([active])::part(button) {
  background-color: transparent;
  color: var(--material-tabbar-current-color);
}

/* .tabbar--material__item:not([ripple]):active { */
:host(:active) {
  background-color: var(--material-tabbar-highlight-color);
}

/* WHAT DO WE DO HERE?
.tabbar--material__icon {
  font-size: 22px !important;
  line-height: 36px;
}

.tabbar--material__label {
  font-family: 'Roboto', 'Noto', sans-serif;
  -webkit-font-smoothing: antialiased;
  font-weight: var(--material-font-weight);
}

.tabbar--material__label:first-child {
  font-family: 'Roboto', 'Noto', sans-serif;
  -webkit-font-smoothing: antialiased;

  letter-spacing: 0.015em;
  font-weight: 500;
  font-size: 14px;
}

.tabbar--material__icon + .tabbar--material__label {
  font-size: 10px;
}
*/

`;
