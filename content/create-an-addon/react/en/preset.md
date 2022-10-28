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

<div class="aside">💡 The <code>withRoundTrip</code> decorator from the Addon Kit is an example of two-way communication between the story and an addon. However, we don't require that for our addon and can delete it.</div>

![toggling the tool toggles the outlines](../../images/toggle.gif)

## Root-level preset

Before we can add our addon to the catalog, there's one item worth mentioning. Each Storybook addon must include a root-level preset to register the addon without any additional configuration from the user. Luckily for us, this was set up for us when we cloned the repository in the [setup section](/create-an-addon/react/en/getting-started/). If you open your `preset.js` in the root directory, you'll see the following inside:

```js:title=preset.js
function config(entry = []) {
  return [...entry, require.resolve("./dist/esm/preset/preview")];
}

function managerEntries(entry = []) {
  return [...entry, require.resolve("./dist/esm/preset/manager")];
}

module.exports = {
  managerEntries,
  config,
};
```

<div class="aside">
 💡 Read the official <a href="https://storybook.js.org/docs/react/addons/writing-presets#manager-entries">Storybook documentation</a> to learn more about presets.
</div>

Success! You now have a fully functional addon in your local Storybook. In the final chapter, learn how to list your addon in the catalog. That way you can share with your team and the Storybook community.
