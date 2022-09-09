ONSEN UI NEXT STEPS
===================

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


[1]: https://web.dev/custom-elements-best-practices/


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
      connectedCallback { }
      disconnectedCallback { }
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


[2]: https://github.com/emccorson/onsen-next-steps/blob/master/esm/util.js
[3]: https://github.com/emccorson/onsen-next-steps/blob/master/esm/mixins
[4]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes#mix-ins
