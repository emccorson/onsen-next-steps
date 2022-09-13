export default `

/* css-components-src/components/toolbar.css */

/* .toolbar { */
:host {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  box-sizing: border-box;
  overflow: hidden;
  word-spacing: 0;
  padding: 0;
  margin: 0;
  font: inherit;
  border: none;
  line-height: normal;
  cursor: default;
  user-select: none;
  z-index: 2;

  display: flex;
  align-items: stretch;
  flex-wrap: nowrap;
  height: var(--toolbar-height);
  padding-left: var(--toolbar-padding);
  padding-right: var(--toolbar-padding);
  background: var(--toolbar-background-color);
  color: var(--toolbar-text-color);
  box-shadow: var(--toolbar-box-shadow);
  font-weight: var(--font-weight);
  width: 100%;
  white-space: nowrap;
  border-bottom: none;
  background-size: 100% 1px;
  background-repeat: no-repeat;
  background-position: bottom;
  background-image: linear-gradient(0deg, var(--toolbar-separator-color), var(--toolbar-separator-color) 100%);
}

@media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi), (min-resolution: 2dppx) {
  /* .toolbar { */
  :host {
    background-image: linear-gradient(0deg, var(--toolbar-separator-color), var(--toolbar-separator-color) 50%, transparent 50%);
  }
}

/* .toolbar__left { */
#left {
  box-sizing: border-box;
  padding: 0;
  margin: 0;
  font: inherit;
  color: inherit;
  background: transparent;
  border: none;

  max-width: 50%;
  width: 27%;
  text-align: left;
  line-height: var(--toolbar-height);
}

/* .toolbar__right { */
#right {
  box-sizing: border-box;
  padding: 0;
  margin: 0;
  font: inherit;
  color: inherit;
  background: transparent;
  border: none;

  max-width: 50%;
  width: 27%;
  text-align: right;
  line-height: var(--toolbar-height);
}

/* .toolbar__center { */
#center {
  box-sizing: border-box;
  padding: 0;
  margin: 0;
  font: inherit;
  background: transparent;
  border: none;

  width: 46%;
  text-align: center;
  line-height: var(--toolbar-height);
  font-size: var(--font-size);
  font-weight: var(--font-weight--large);
  color: var(--toolbar-text-color);
}

/* .toolbar__title { */
#center {
  line-height: var(--toolbar-height);
  font-size: var(--font-size);
  font-weight: var(--font-weight--large);
  color: var(--toolbar-text-color);
  margin: 0;
  padding: 0;
  overflow: visible;
}

/* WHAT HERE?
.toolbar__center:first-child:last-child {
  width: 100%;
}
*/

/* .toolbar--material { */
:host([modifier~="material"]) {
  display: flex;
  flex-wrap: nowrap;
  justify-content: space-between;
  height: var(--toolbar-material-height);
  border-bottom: 0;
  box-shadow: 0 1px 5px rgba(0, 0, 0, 0.3);
  padding: 0;
  background-color: var(--material-toolbar-background-color);
  background-size: 0;
}

/* .toolbar--material__left, .toolbar--material__right { */
:host([modifier~="material"]) #left,
:host([modifier~="material"]) #right {
  font-family: 'Roboto', 'Noto', sans-serif;
  -webkit-font-smoothing: antialiased;
  font-size: 20px;
  font-weight: 500;
  color: var(--material-toolbar-text-color);

  height: var(--toolbar-material-height);
  min-width: 72px;
  width: auto;
  line-height: var(--toolbar-material-height);
}

/* .toolbar--material__center { */
:host([modifier~="material"]) #center {
  font-family: 'Roboto', 'Noto', sans-serif;
  -webkit-font-smoothing: antialiased;
  font-size: 20px;
  font-weight: 500;
  color: var(--material-toolbar-text-color);

  height: var(--toolbar-material-height);
  width: auto;
  flex-grow: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  text-align: left;
  line-height: var(--toolbar-material-height);
}

/* WHAT HERE?
.toolbar--material__center:first-child {
  margin-left: 16px;
}

.toolbar--material__center:last-child {
  margin-right: 16px;
}

.toolbar--material__left:empty, .toolbar--material__right:empty {
  min-width: 16px;
}
*/
`;
