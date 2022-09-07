export default `

/* css-components-src/page.css */

/* :root { */
:host {
  --page-background-color: var(--background-color);
  --page-material-background-color: var(--material-background-color);
}

/* .page { */
:host {
  font-family: -apple-system, 'Helvetica Neue', 'Helvetica', 'Arial', 'Lucida Grande', sans-serif;
  -moz-osx-font-smoothing: grayscale;
  font-weight: var(--font-weight);

  background-color: var(--page-background-color);
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow-x: visible;
  overflow-y: hidden;
  color: var(--text-color);
  -ms-overflow-style: none;
  -webkit-font-smoothing: antialiased;
}

/* .page__content { */
::part(content) {
  background-color: var(--page-background-color);
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  box-sizing: border-box;
}

/* .page__background { */
::part(background) {
  background-color: var(--page-background-color);
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  box-sizing: border-box;
}

/* .page--material { */
:host([modifier~="material"]) {
  font-family: 'Roboto', 'Noto', sans-serif;
  -webkit-font-smoothing: antialiased;
  font-weight: var(--material-font-weight);

  background-color: var(--page-material-background-color);
}

/* .page--material__content { */
:host([modifier~="material"])::part(content) {
  font-family: 'Roboto', 'Noto', sans-serif;
  -webkit-font-smoothing: antialiased;

  font-weight: var(--font-weight);
}

/* .page--material__background { */
:host([modifier~="material"])::part(background) {
  background-color: var(--page-material-background-color);
}


/* css-component-src/components/combination.css */

/* .toolbar+.page__background { */
slot[name="toolbar"].has-toolbar + #background {
  top: var(--toolbar-height);
}

/* .toolbar+.page__background+.page__content { */
slot[name="toolbar"].has-toolbar + #background + #content {
  top: var(--toolbar-height);
  padding-top: 0;
}

/* .toolbar.toolbar--material+.page__background { */
:host([modifier~="material"]) slot[name="toolbar"].has-toolbar + #background {
  top: var(--toolbar-material-height);
}

/* .toolbar.toolbar--material+.page__background+.page__content { */
:host([modifier~="material"]) slot[name="toolbar"].has-toolbar + #background + #content {
  top: var(--toolbar-material-height);
  padding-top: 0;
}

`;
