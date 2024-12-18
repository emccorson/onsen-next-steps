Onsen UI next steps
===================

1. [Introduction](#introduction)
   1. [Demo](#demo)
2. [Mixins](#mixins)
3. [Shadow DOM](#shadow-dom)
   1. [Custom Elements polyfill](#custom-elements-polyfill)
   2. [`contentReady`](#contentready)
   3. [Shadow DOM and templates](#shadow-dom-and-templates)
   4. [Slots](#slots)
   5. [`slotchange` event](#slotchange-event)
4. [CSS](#css)
   1. [CSS Custom Properties](#css-custom-properties)
   2. [CSS namespaces](#css-namespaces)
   3. [CSS vs. PostCSS](#css-vs-postcss)
   4. [CSS Components project](#css-components-project)
   5. [Icons](#icons)
5. [Parent/child communication](#parentchild-communication)

Introduction
------------

This document contains suggestions for the next release of Onsen UI.

My main suggestion is that we do a major release of Onsen UI v3. There are some
problems with Onsen UI v2 that I believe can be fixed with a major release. In
brief, the problems with v2 are:

  1. We use a polyfill for Custom Elements, which has inconsistent behaviour
  with the Custom Elements specification, and in some cases has prevented users
  from using Onsen UI with other Custom Elements libraries.

  2. We cannot easily remove the Custom Elements polyfill, because the Onsen UI
  code relies on polyfill behaviour which is different from the Custom Elements
  specification.

  3. We use global CSS classes without namespaces, which has caused conflicts
  with users' own CSS classes.

  4. We cannot easily make the Onsen UI components dynamic (for example, adding
  a tab to the tabbar with a button click), due to the complicated DOM
  manipulation code. This also makes the framework bindings (e.g. react-onsenui)
  more complicated than they need to be.

  5. There isn't a good way to have separation of concerns in the codebase. Each
  feature of a custom element (such as modifier functionality, animation
  property etc.) should be separate, but currently it is all mixed together in
  the code. This can make the code quite complicated to maintain over time.

In order to fix these problems, I suggest we do the following:

  1. In general, follow the suggestions from Google in [Custom Element Best
  Practices][1]. Any places I think we should deviate from this, I will mention
  below.

  2. Use the Shadow DOM. We can write the components as templates without
  worrying about user interference, which is much easier than writing DOM
  manipulation code. It will also solve the problem of global CSS.

  3. Write the custom elements in a mixin style. This will allow for separation
  of concerns and much easier code re-use, improving consistency for users and
  maintainability.


### Demo
This repo contains a demo showing how to implement the suggestions in this
document for a small subset of Onsen UI.

To run the demo:

    npm install
    npm start

Then open http://127.0.0.1:8080/ in your browser.


Mixins
------

**Problem:**
In the codebase, we have the problem of **separation of concerns**. Custom
Elements use callbacks such as `attributeChangedCallback` and
`connectedCallback`, and code for separate features ends up being all mixed up
in these callbacks.

For example, here is the v2 ons-list-item connectedCallback:

    connectedCallback() {
      contentReady(this, () => {
        this._setupListeners(true);
        this._originalBackgroundColor = this.style.backgroundColor;
        this.tapped = false;
      });
    }

It has code related to setting up listeners and setting the background colour,
even though these are separate features of the Custom Element.

This makes the Custom Element harder to maintain over time, and it also makes it
harder to reuse common functionality between Custom Elements. For example, all
Onsen UI elements have a `modifier` attribute, but each element has its own
implementation (with some common utility functions) because we can't easily
reuse code.

**Solution:**
I suggest that we write Custom Element features using a **mixin** style.

A mixin is a function that takes a class as an argument and returns a new class
by extending the argument:

    // a mixin that adds the "expandable" property/attribute to a class
    const withExpandable = Base => class extends Base {

      get expandable() {
        return this.hasAttribute('expandable');
      }

      set expandable(value) {
        if (value) {
          this.setAttribute('expandable', '');
        } else {
          this.removeAttribute('expandable');
        }
      }
    };

If a mixin needs to take arguments other than the base class, the mixin
arguments should be separate from the base class argument:

    // a mixin that adds a boolean property/attribute passed as an argument
    // note that it is written as:
    //     mixinArguments => baseClass =>
    // NOT:
    //     (mixinArguments, baseClass) =>
    // this makes it easier to combine mixins (as shown later)
    const withBooleanProperty = property => Base => class extends Base {

      get [property]() {
        return this.hasAttribute(property);
      }

      set [property](value) {
        if (value) {
          this.setAttribute(property, '');
        } else {
          this.removeAttribute(property);
        }
      }
    }

We start with a base Custom Element that does **nothing**:

    class Base extends HTMLElement {
      connectedCallback() { }
      disconnectedCallback() { }
      attributeChangedCallback() { }
    }

Then we write all features in a mixin style:

    const withModifier = Base => class extends Base {
      /* implementation of modifier feature */
    }

    const withBooleanProperty = property => Base => class extends Base {
      /* implementation of boolean property */
    }

Now we can combine the mixins to create our Custom Element:

    const MyElement = withModifier(       // the element has the modifier feature
      withBooleanProperty('expandable')(  // the element has a property "expandable"
        Base                              // we provide the "do nothing" base class
      )
    );

Combining mixins this way can get a bit hard to read (since the code will drift
to the right), so there is the utility function [compose][2] which does the same
as above in a more readable way:

    const allFeatures = compose(         // compose combines mixins into one mixin
      withModifier,
      withBooleanProperty('expandable')
      // can keep adding as many mixins as you like here
    );
    const MyElement = allFeatures(Base); // then we just apply the mixin to the base class

Now adding modifier functionality to the Onsen UI elements is as easy as writing
one mixin and adding it to every element. Behaviour will be consistent across
all elements, and if there is a bug we only need to fix it in one place.

See also:

  - [esm/mixins][3], which contains mixins written for the demo.
  - This [MDN article][4] explaining how mixins work.


Shadow DOM
----------

### Custom Elements polyfill
Onsen UI v2 uses a polyfill to add Custom Element support. At the time the
polyfill was added, Custom Elements were not well supported in browsers, so a
polyfill was needed.

Nowadays, Custom Elements are [well supported][5] in modern browsers, so we
should be able to remove the polyfill. It is important to remove the polyfill
because in [some cases][10] it has prevented users from using Onsen UI with other
Custom Element libraries.

However, the polyfill allowed us to write code that is not allowed in the Custom
Elements specification (and therefore not allowed by browsers), so it is not
simple to just remove the polyfill.

For example, the Custom Elements specification [disallows][6] inspecting an
element's attributes or children in the constructor, but we do this regularly in
the code. Without the polyfill, the browser will throw an exception.

### `contentReady`
Often what we are doing in the constructor of an Onsen UI element is compiling
the element's children, by checking what children have been set by the user, and
adding/removing children as necessary.

The constructor calls `contentReady`, which waits for the element to be "ready"
for compilation (i.e. the child elements have finished loading), and then
compiles the element (manipulates the child elements).

One problem with `contentReady` is that it considers an element to be ready if
it has any child elements. But in the case where Onsen UI is loaded as an ES
module (without the polyfill), there will be child elements before the content
is ready.

Actually, the concept of an element being "ready" does [not particularly make
sense][8] for Custom Elements. Custom Elements should be dynamic - the user should be
able to add or remove children at any time - but it is difficult to make Onsen
UI dynamic while using `contentReady`.

See also:

  - The [component compilation][7] explanation in the Onsen UI guide.

### Shadow DOM and templates
My suggestion is that we use the Shadow DOM in Onsen UI v3.

In brief, the Light DOM refers to DOM elements accessible by the user, such as
an `ons-tab` element. The Shadow DOM refers to the DOM elements that are
internal to a Custom Element and are not accessible by the user.

By using the Shadow DOM, we can write the DOM structure of an Onsen UI element
as a **template**. For example, `ons-page` could be:

    document.createElement('template');
    template.innerHTML = `
      <div part="content">
        <slot></slot>
      </div>
      <div part="background"></div>
    `;

The template is internal to the component; the user cannot access it. Whereas in
v2 we have to write a `_compile` method that manipulates the Light DOM, here we
can just write the template in the Shadow DOM knowing that it won't be
manipulated by the user.

This greatly simplifies the compilation of Onsen UI elements, and makes it much
easier for them to be dynamic.

### Slots
In v2, the most basic way to use an element is to put text between its tags:

    <ons-toolbar>My page</ons-toolbar>

If the user wants more control, he can provide children which structure the layout:

    <ons-toolbar>
      <div class="left">Left content</div>
      <div class="center">My page</div>
      <div class="right">Right content</div>
    </ons-toolbar>

Using the Shadow DOM, we can provide a similar level of control to the user with
**slots**. A slot is a place in the Shadow DOM template where the user can insert
his own content.

In this case, the ons-toolbar template would be:

    <div class="left">
      <slot name="left"></slot>
    </div>
    <div class="center">
      <slot name="center"></slot>
      <slot></slot>                 <---- the default slot
    </div>
    <div class="right">
      <slot name="right"></slot>
    </div>

Now the user can still use the basic text markup:

    <ons-toolbar>My page</ons-toolbar>

If he wants more control, he can use the `slot` attribute instead of the `class`
attribute.

    <ons-toolbar>
      <div slot="left">Left content</div>
      <div slot="center">My page</div>
      <div slot="right">Right content</div>
    </ons-toolbar>

In this way, we can use templates while still offering the same level of control
over Onsen UI elements to the user.

See also:

  - [Using templates and slots][9] MDN article.

### `slotchange` event
Sometimes we will need to do some action when an element's children have
changed. For this we can use the `slotchange` event.

In v3, this will fill the same role that the `contentReady` function filled in
v2, except that since the elements are dynamic, `slotchange` may be called
multiple times, so we should write the code in a way that accounts for this.

See also:

  - [`slotchange` event][13] on MDN.

CSS
---

CSS works a bit differently in the Shadow DOM. Custom Elements that use the
Shadow DOM have their own CSS and are not affected (in general) by global CSS
rules. In short, this means that the current approach of including the Onsen UI
CSS in the head of an HTML file will not work. Instead, a component's CSS should
be included inline in its template:

    <style>
      /* component-specific CSS rules here */
    <style>
    <div id="content">
      <slot></slot>
    </div>
    <div id="background"></div>

In the Shadow DOM, we should not use CSS classes for applying styles, instead
selecting the tag name directly:

    ons-page {    /* instead of `.page` */
      ...
    }

This is safe to do because the Shadow DOM rules are local to the Custom Element,
and will simplify the code because we don't need to use JavaScript to set
classes.

### CSS Custom Properties
Global CSS rules do not generally pierce the Shadow DOM, but CSS custom
properties (CSS variables) _do_ pierce the Shadow DOM. This means we can still
use global CSS files to apply the Onsen UI themes (the default theme, the dark
theme etc.), since a theme is just made of CSS custom properties.

My suggestion is to take all the CSS _custom properties_ from `onsenui.css` and
`onsen-css-components.css` and put them in one file (we can still call it
`onsenui.css`). And we can still have separate files for different themes e.g.
`dark-onsenui.css` for the dark theme.

### CSS namespaces
One issue with Onsen UI v2 is that the Onsen UI CSS can [cause conflicts][12]
with the user's own CSS.

With most CSS moved inline to the Shadow DOM templates, we have almost
completely solved the problem of CSS conflicts with the user's own CSS rules.
The only remaining global CSS is the CSS custom properties (variables), which I
suggested above should be loaded as a file `onsenui.css`.

In v2, the CSS custom properties are defined globally like this:

    :root {
      --background-color: #efeff4;
      --text-color: #1f1f21;
      --sub-text-color: #999;
      --highlight-color-rgb: 0, 118, 255;
      ...
    }

One possible fix is to prefix all custom properties with `ons-`:

    :root {
      --ons-background-color: #efeff4;        <--- custom property is prefixed
      --ons-text-color: #1f1f21;
      --ons-sub-text-color: #999;
      --ons-highlight-color-rgb: 0, 118, 255;
      ...
    }

Alternatively, we could set an attribute `onsenui` on all Onsen UI elements
(using a mixin), and use that as the CSS selector:

    [onsenui] {                <--- only elements with onsenui attribute match
      --background-color: #efeff4;
      --text-color: #1f1f21;
      --sub-text-color: #999;
      --highlight-color-rgb: 0, 118, 255;
      ...
    }

The first solution is simpler to implement (no need for a mixin) with a small
possibility of CSS conflict, whereas the second solution requires a mixin but
has almost zero possibility of CSS conflict.

### CSS vs. PostCSS
In preparation for the Shadow DOM (and to simplify the Onsen UI build process),
I have mostly removed any CSS processing with PostCSS from the project. In
general, it seemed that the added maintenance overhead of using PostCSS was not
worth the benefit. The current situation is that PostCSS is still used for some
small tasks but is mostly removed.

Writing the CSS inline in the Shadow DOM templates will make it more difficult
to apply any CSS processing to the CSS. I do not have concrete a recommendation
for this yet, but there are two possibilities:

  1. Remove the remaining PostCSS processing from the project and write using
     only plain CSS from now on.

  2. Use a plugin such as [rollup-plugin-import-css][11] to insert the CSS
     into the template after it has been processed by PostCSS.

My feeling is that the benefit of processing tools can be easily overrated and
that it is better to write in plain JS/CSS as much as possible. If we write in
plain JS/CSS:

  - There is no need for a build step.
  - There is no need to maintain build dependencies.
  - It is much easier for other people to understand the code.

But this is just my personal preference and I have no strong recommendation.

### CSS Components project
The Onsen UI core (the `onsenui` package) is a completely separate project from
Onsen UI CSS Components (the `onsen-css-components` package). Users who just
want the styling of Onsen UI can use the CSS components without any requirement
to use Custom Elements.

By moving the CSS into the Shadow DOM templates, Onsen UI CSS Components will no
longer be an entirely separate project.

I don't have a concrete suggestion for dealing with this yet, but I think we
should consider:

  - Although CSS Components is a separate project, we never publish CSS
    Components as its own package to npm; it is always bundled with the onsenui
    package.

  - How many users are actually using CSS Components without the Onsen UI core?

If we discover that it is not very important to maintain a separate CSS
Components package, then I think it is fine to merge CSS Components into the
Onsen UI core.

If it _is_ still important to keep the projects separate, we could:

  - use a plugin like [rollup-plugin-import-css][11] to inject the CSS
    Components into the Shadow DOM templates in the build process, or...

  - inline the CSS to Shadow DOM templates and use a plugin to extract the
    CSS, allowing us to make a separate build of CSS Components from the
    Onsen UI core.

### Icons
In v2, icons are provided through third-party icon packs such as Ionicons and
FontAwesome. These icon packs are CSS classes which apply an icon when set on an
element:

    <div class="ion-ios-hammer"></div>   <--- shows hammer icon

If the user wants to use a different icon pack, she can easily link her own
icons in the head of HTML and they will work seamlessly with Onsen UI.

Global CSS classes do not apply to elements in the Shadow DOM, so this will not
work in v3:

    <ons-toolbar-button>
      #shadow-root
      <div class="ion-ios-hammer"></div>  <-- this doesn't work
    </ons-toolbar-button>

However, we can apply global CSS classes to the Custom Element tag since it is
in the Light DOM:

    <ons-toolbar-button class="ion-ios-hammer">  <-- this works
      #shadow-root
      <div></div>
    </ons-toolbar-button>

In order to allow users to provide their own icons in v3, we should restructure
the Onsen UI element templates so that they display properly when the icon class
is applied to the Custom Element itself (e.g. `ons-tab`) instead of some inner
element (e.g. `div.tabbar__icon`).


Parent/child communication
--------------------------
Some Onsen UI elements are dependent on each other. For example, ons-tabbar
depends on having ons-tab children.

There needs to be some communcation between parents and children, but at the
moment we don't do this in a very consistent way. Currently, ons-tab looks for a
parent ons-tabbar and uses its methods and properties. In this way, the child is
manipulating the parent.

This can make the code quite complicated. I suggest we follow the Vue style:

  1. A parent communicates with a child by setting the child's properties. Since
     we are following [Custom Elements Best Practices][1], most functionality on
     the child should be available to use as a property.

  2. A child communicates with a parent by emitting an event. This does **not**
     necessarily follow [Custom Elements Best Practices][1] because the event
     may be emitted due to the parent setting a property. Best Practices
     recommends not to do this because there is a danger of entering an endless
     loop (parent sets property -> child emits event -> parent sets property
     etc.). To counter this, I suggest we make these kinds of events **private**
     by prefixing them with `_` and not publicly documenting them e.g.
     `_active`.

See the demo [tab][14] and [tabbar][15] elements' use of the `_active` event
for an example implementation.


[1]:  https://web.dev/custom-elements-best-practices/
[2]:  https://github.com/OnsenUI/onsen-next-steps/blob/master/esm/util.js
[3]:  https://github.com/OnsenUI/onsen-next-steps/blob/master/esm/mixins
[4]:  https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes#mix-ins
[5]:  https://caniuse.com/custom-elementsv1
[6]:  https://html.spec.whatwg.org/multipage/custom-elements.html#custom-element-conformance
[7]:  https://onsen.io/v2/guide/compilation.html#components-compilation
[8]:  https://github.com/WICG/webcomponents/issues/551#issuecomment-241830839
[9]:  https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_templates_and_slots
[10]: https://github.com/OnsenUI/OnsenUI/issues/2598
[11]: https://github.com/jleeson/rollup-plugin-import-css
[12]: https://github.com/OnsenUI/OnsenUI/issues/2645
[13]: https://developer.mozilla.org/en-US/docs/Web/API/HTMLSlotElement/slotchange_event
[14]: https://github.com/OnsenUI/onsen-next-steps/blob/master/esm/elements/tab/index.js
[15]: https://github.com/OnsenUI/onsen-next-steps/blob/master/esm/elements/tabbar/index.js
