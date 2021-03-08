---
title: 'Preset'
tocTitle: 'Preset'
description: 'Enable Outline for every story'
commit: 'bdb7aaa'
---

Now that the decorator is out of the way, let's use a preset to wrap every story with it.

Presets allow you to combine a bunch of different Storybook configurations and apply them in one go. Some addons are purely responsible for configuring Storybook and have no UI. For example, <a href="https://www.npmjs.com/package/@storybook/preset-create-react-app">preset-create-react-app</a> and <a href="https://www.npmjs.com/package/storybook-preset-nuxt">preset-nuxt</a>. These are called <a href="https://storybook.js.org/docs/react/addons/writing-presets">Preset addons</a>.

Our preset is split into two parts:

1. `manager.js` for registering the addon
2. `preview.js` for specifying global decorators

Update the preview to just use the `withGlobals` decorator, which will automatically wrap all stories.

```js:title=src/preset/preview.js
import { withGlobals } from '../withGlobals';

export const decorators = [withGlobals];
```

<div class="aside"><b>Note:</b> the <code>withRoundTrip</code> decorator from the Addon Kit is an example of two-way communication between the story and an addon. However, we don't require that for our addon and can delete it.</div>

Success! You now have a fully functional addon in your local Storybook. In the final chapter, learn how to list your addon in the catalog. That way you can share with your team and the Storybook community.

![toggling the tool toggles the outlines](../../images/toggle.gif)
