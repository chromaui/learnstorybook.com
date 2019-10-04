---
title: "Creating addons"
tocTitle: "Creating addons"
description: "Learn how to build your own addons that will super charge your development"
commit: "dac373a"
---

Storybook's addon architecture allows you to expand it's feature set and customize it to your needs.

Writing your own addon may sound a bit daunting, but as you'll see in this guide, it can be quite simple.

We're going to write an addon together, first let's scope what our addon will do:

## The addon we're going to write

Your team has design assets which have some relationship to the UI components. That relationship isn't really apparent from within storybook's UI. Let's fix that!

We're going to write an addon that will show our design assets next to our component!

![Storybook and your app](/intro-to-storybook/design-assets-addon.png)

**Our addon should**:
- display the design asset in a panel
- support images, but also urls for embedding
- should support multiple assets, just in case there will be multiple versions or themes

The way we'll be attaching the list of assets to stories is via parameters.

This is what it will look like when someone is adding design assets to their story:

```js
import Component from './component';

export default {
  title: 'Component',
  component: Component,
  parameters: {
    assets: ['path/to/asset.png'],
  },
};

export const variant = () => <Component />;
```

With our public API defined, let's start writing the addon to make this appear in storybook's UI.

## Writing the addon

Let's create a new file: `.storybook/addons/design-assets.js`. (you may have to create the `addons` folder).

> **Note:**
> We're making this addon for storybook inside the storybook config folder which is `.storybook` by default.
> At some point in the future we should move this addon into it's own package, let's focus on writing the addon and making it work first.

Within this new file we're going to import some dependencies we're going to need. You may also need to install these using `npm` or `yarn`.

These will be the dependencies we're going ot need: `react`, `@storybook/api`, `@storybook/addons` and `@storybook/components`.

In the file we just created we're going to import these dependencies:

```js
import React, { useMemo, Fragment } from 'react';

import { useParameter } from '@storybook/api';
import { addons, types } from '@storybook/addons';
import { AddonPanel } from '@storybook/components';
```

Now we register a new addon with storybook using and add a panel:
```js
addons.register('my/design-assets', () => {
  addons.add(PANEL_ID, {
    title: 'assets',
    type: types.PANEL,
    render: ({ active, key }) => (
      <AddonPanel active={active} key={key}>
        implement
      </AddonPanel>
    ),
  });
});
```

Storybook won't auto-load the file we just created, we need to add a reference to `.storybook/addons/design-assets.js` to the file registering all addons.
The file where this happens is `.storybook/addons.js`. so add this line to that file:

```js
import './addons/design-assets';
```

When we start storybook now, we should actually see a panel added to the UI.
Storybook allows you to not just add panels, but a list of types of UI.

But now we're going to write a component that hooks into storybook's state and get the parameters of the current story:

```js
export const Content = () => {
  const results = useParameter('assets', []);

  return (
    <Fragment>
      {results.length ? (
      <ol>
          {results.map((i) => (
          <li>{i}</li>
          ))}
      </ol>
      ) : null}
    </Fragment>
  );
};
```

Now all we need to do is connect this component to the rendering of our registered panel and we'll have our working addon:
```js
import React, { useMemo } from 'react';

import { useParameter } from '@storybook/api';
import { addons, types } from '@storybook/addons';
import { AddonPanel } from '@storybook/components';

// this is often placed in a constants.js file
const ADDON_ID = 'storybook/parameter';
const PANEL_ID = `${ADDON_ID}/panel`;
const PARAM_KEY = `assets`;

// this is often placed in a panel.js file
const Content = () => {
  const results = useParameter(PARAM_KEY, []);

  return (
    <Fragment>
      {results.length ? (
      <ol>
          {results.map((i) => (
          <li>{i}</li>
          ))}
      </ol>
      ) : null}
    </Fragment>
  );
};

// this is often placed in a register.js file
addons.register(ADDON_ID, () => {
  addons.add(PANEL_ID, {
    title: 'parameter',
    type: types.PANEL,
    render: ({ active, key }) => (
      <AddonPanel active={active} key={key}>
        <Content />
      </AddonPanel>
    ),
  });
});
```

At this point we can navigate between stories in storybook and see the list of design assets associated with the selected story.

Let's change the `Content` component so it actually displays the assets:
```js
import React, { Fragment, useMemo } from 'react';

import { useParameter, useStorybookState } from '@storybook/api';
import { styled } from '@storybook/theming';
import { ActionBar } from '@storybook/components';

const ADDON_ID = 'storybook/parameter';
const PARAM_KEY = `assets`;

const getUrl = (input) => {
  return typeof input === 'string' ? input : input.url;
};

const Iframe = styled.iframe({
  width: '100%',
  height: '100%',
  border: '0 none',
});
const Img = styled.img({
  width: '100%',
  height: '100%',
  border: '0 none',
  objectFit: 'contain',
});

const Asset = ({ url }) => {
  if (!url) {
    return null;
  }
  if (url.match(/\.(png|gif|jpeg|tiff|svg|anpg|webp)/)) {
    // do image viewer
    return <Img alt="" src={url} />;
  }

  return <Iframe title={url} src={url} />;
};

export const Content = () => {
  const results = useParameter(PARAM_KEY, []);
  const { storyId } = useStorybookState();

  if (results.length === 0) {
    return null;
  }

  const url = getUrl(results[0]).replace('{id}', storyId);
  
  return (
    <Asset url={url} />
  );
};
```

Note: Styling in storybook is done via `@storybook/theming` which exposes `styled` as a named export. Using this you can create new component for storybook's UI that respond to storybook's theme.
If you're using this be sure to also add `@storybook/theming` to your `package.json`.

## Stateful addons

So 1 of our goals was:

> - should support multiple assets, just in case there will be multiple versions or themes

To do so, we need state, namely: "which asset is currently selected".

We could use `useState` from react or we could use `this.setState` in a class component. But let's instead use storybook's `useAddonState`!

```js
export const Content = () => {
  const results = useParameter(PARAM_KEY, []);
  const [selected, setSelected] = useAddonState(ADDON_ID, 0);
  const { storyId } = useStorybookState();

  if (results.length === 0) {
    return null;
  }

  if (results.length && !results[selected]) {
    setSelected(0);
    return null;
  }

  const url = getUrl(results[selected]).replace('{id}', storyId);
  
  return (
    <Asset url={url} />
  );
};
```

## Using storybook UI inside your custom addon

Now we have state, but no way of changing the state.
We could of course create our own UI, but let's instead use some UI that storybook has already made.

Storybook's UI component can be found in the `@storybook/components` package.

Let's use the `ActionBar` component:

```js
import { ActionBar } from '@storybook/components';

export const Content = () => {
  const results = useParameter(PARAM_KEY, []);
  const [selected, setSelected] = useAddonState(ADDON_ID, 0);
  const { storyId } = useStorybookState();

  if (results.length === 0) {
    return null;
  }

  if (results.length && !results[selected]) {
    setSelected(0);
    return null;
  }

  const url = getUrl(results[selected]).replace('{id}', storyId);
  
  return (
    <Fragment>
      <Asset url={url} />
      {results.length > 1 ? (
        <ActionBar
          actionItems={results.map((i, index) => ({
            title: typeof i === 'string' ? `asset #${index + 1}` : i.name,
            onClick: () => setSelected(index),
          }))}
        />
      ) : null}
    </Fragment>
  );
};
```

## Full source code of our addon

```js
// constants.js
export const ADDON_ID = 'storybook/design-assets';
export const PANEL_ID = `${ADDON_ID}/panel`;
export const PARAM_KEY = `assets`;
```

```js
// register.js
import React from 'react';

import { addons, types } from '@storybook/addons';
import { AddonPanel } from '@storybook/components';
import { ADDON_ID, PANEL_ID } from './constants';
import { Content } from './panel';

addons.register(ADDON_ID, () => {
  addons.add(PANEL_ID, {
    title: 'design assets',
    type: types.PANEL,
    render: ({ active, key }) => (
      <AddonPanel active={active} key={key}>
        <Content />
      </AddonPanel>
    ),
  });
});
```

```js
// panel.js
import React, { Fragment, useMemo, ReactElement } from 'react';

import { useParameter, useAddonState, useStorybookState } from '@storybook/api';
import { styled } from '@storybook/theming';
import { ActionBar } from '@storybook/components';
import { PARAM_KEY, ADDON_ID } from './constants';

interface AssetDescription {
  url: string;
  name: string;
}

type Results = (string | AssetDescription)[];
type Selected = number;

const Iframe = styled.iframe({
  width: '100%',
  height: '100%',
  border: '0 none',
});
const Img = styled.img({
  width: '100%',
  height: '100%',
  border: '0 none',
  objectFit: 'contain',
});

const Asset = ({ url }: { url: string | undefined }): ReactElement => {
  if (!url) {
    return null;
  }
  if (url.match(/\.(png|gif|jpeg|tiff|svg|anpg|webp)/)) {
    // do image viewer
    return <Img alt="" src={url} />;
  }
  if (url.match(/\.(mp4|ogv|webm)/)) {
    // do video viewer
    return <div>not implemented yet, sorry</div>;
  }

  return <Iframe title={url} src={url} />;
};

const getUrl = (input: AssetDescription | string): string => {
  return typeof input === 'string' ? input : input.url;
};

export const Content = () => {
  const results = useParameter<Results>(PARAM_KEY, []);
  const [selected, setSelected] = useAddonState<Selected>(ADDON_ID, 0);
  const { storyId } = useStorybookState();

  if (results.length === 0) {
    return null;
  }

  if (results.length && !results[selected]) {
    setSelected(0);
    return null;
  }

  return (
    <Fragment>
      <Asset url={url} />
      {results.length > 1 ? (
        <ActionBar
          actionItems={results.map((i, index) => ({
            title: typeof i === 'string' ? `asset #${index + 1}` : i.name,
            onClick: () => setSelected(index),
          }))}
        />
      ) : null}
    </Fragment>
  );
};
```

## Extracting your addon into it's own package

After your addon is working as intended, you will likely want to extract it into it's own package.

If it's useful to you, it's likely useful to someone else as well.

You can open a PR on the storybook documentation to have your addon featured there.

## What's next?

This is an example of an addon that uses parameters and displays it in a panel, but that's just one of the many options you have.

With these principles you're able to display you custom UI in a variety of places in the storybook UI.

You can:
- [add buttons in the storybook toolbar](https://github.com/storybookjs/storybook/blob/next/addons/viewport/src/register.tsx#L8-L15)
- [communicate through the channel with the iframe](https://github.com/storybookjs/storybook/blob/next/dev-kits/addon-roundtrip/README.md)
- [send commands and results](https://github.com/storybookjs/storybook/tree/next/addons/events)
- [perform analysis on the html/css outputted by your component](https://github.com/storybookjs/storybook/tree/next/addons/a11y)
- [wrap components, re-render with new data](https://github.com/storybookjs/storybook/tree/next/addons/knobs)
- [fire DOM events, make DOM changes](https://github.com/storybookjs/storybook/tree/next/addons/events)
- [run tests](https://github.com/storybookjs/storybook/tree/next/addons/jest)

And much more!

# Dev Kits

To help you write addons, the Storybook team has developed `dev-kits`. 

These packages are like little starter-sets for you to start developing your own addon.
The addon we just created is based on the `addon-parameters` dev-kit.

You can find the dev-kits here:
https://github.com/storybookjs/storybook/tree/next/dev-kits

More dev-kits will become available in the future.


