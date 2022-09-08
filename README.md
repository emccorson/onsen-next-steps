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
