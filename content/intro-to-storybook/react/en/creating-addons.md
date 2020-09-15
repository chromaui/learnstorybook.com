---
title: 'Bonus: Create an addon'
tocTitle: 'Bonus: Creating addons'
description: 'Learn how to build your own addons that will super charge your development'
commit: 'bebba5d'
---

Earlier, we introduced a key Storybook feature: the robust [addons](https://storybook.js.org/docs/react/configure/storybook-addons) ecosystem. Addons are used to enhance your developer experience and workflows.

In this bonus chapter, we're going to take a look on how we create our own addon. You might think that writing it can be a daunting task, but actually it's not, we just need to take a couple of steps to get started and we can start writing it.

But first thing is first, let's first scope out what our addon will do.

## The addon we're going to write

For this example, let's assume that our team has some design assets that are somehow related to the existing UI components. Looking at the current Storybook UI, it seems that relationship isn't really apparent. How can we fix that?

We have our goal, now let's define what features our addon will support:

- Display the design asset in a panel
- Support images, but also urls for embedding
- Should support multiple assets, just in case there will be multiple versions or themes

We'll attach the list of assets to the stories with [parameters](https://storybook.js.org/docs/react/writing-stories/parameters#story-parameters), a Storybook feature that allows us to add extra metadata to our stories.

```javascript
// YourComponent.js

export default {
  title: 'Your component',
  decorators: [
    /*...*/
  ],
  parameters: {
    assets: ['path/to/your/asset.png'],
  },
  //
};
```

## Setup

We've outlined what our addon will do, it's time to start working on it.

In the root folder of your project, create a new file called `.babelrc` with the following inside:

```json
{
  "presets": [
    [
      "@babel/preset-env",
      {
        "targets": {
          "node": "current"
        }
      }
    ],
    "@babel/preset-react"
  ]
}
```

Adding this file will allow us to use the correct presets and options for the addon we're about to develop.

Afterwards, inside your `.storybook` folder create a new one called `design-addon` and inside it a new file called `register.js`.

And that's it! We are ready to start developing our addon.

<div class="aside">We're going to use the<code>.storybook</code> folder as a placeholder for our addon. The reason behind this, is to maintain a straightforward approach and avoid complicating it too much. Should this addon be transformed into a actual addon it would be best to move it to a separate package with it's own file and folder structure.</div>

## Writing the addon

Add the following to your recently created file:

```javascript
//.storybook/design-addon/register.js

import React from 'react';
import { AddonPanel } from '@storybook/components';
import { addons, types } from '@storybook/addons';

addons.register('my/design-addon', () => {
  addons.add('design-addon/panel', {
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

This is the typical boilerplate code to get you started. Going over what the code is doing:

- We're registering a new addon in our Storybook.
- Add a new UI element for our addon with some options (a title that will define our addon and the type of element used) and render it with some text for now.

Starting Storybook at this point, we won't be able to see the addon just yet. We need to register our own in the `.storybook/main.js` file. Just add the following to the already existing `addons` list:

```js
// .storybook/main.js

module.exports = {
  stories: ['../src/components/**/*.stories.js'],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/preset-create-react-app',
    './.storybook/design-addon/register.js', // our addon
  ],
};
```

![design assets addon running inside Storybook](/intro-to-storybook/create-addon-design-assets-added.png)

Success! We have our newly created addon added to the Storybook UI.

<div class="aside">Storybook allows you to add not only panels, but a whole range of different types of UI components. And most if not all of them are already created inside the @storybook/components package, so that you don't need waste too much time implementing the UI and focus on writing features.</div>

### Creating the content component

We've completed our first objective. Time to start working on the second one.

To complete it, we need to make some changes to our imports and introduce a new component that will display the asset information.

Make the following changes to the addon file:

```javascript
//.storybook/design-addon/register.js

import React, { Fragment } from 'react';
/* same as before */
import { useParameter } from '@storybook/api';

const Content = () => {
  const results = useParameter('assets', []); // story's parameter being retrieved here
  return (
    <Fragment>
      {results.length ? (
        <ol>
          {results.map(i => (
            <li>{i}</li>
          ))}
        </ol>
      ) : null}
    </Fragment>
  );
};
```

We've created the component, modified the imports, all that's missing is to connect the component to our panel and we'll have a working addon capable of displaying information relative to our stories.

Your code should look like the following:

```javascript
//.storybook/design-addon/register.js

import React, { Fragment } from 'react';
import { AddonPanel } from '@storybook/components';
import { useParameter } from '@storybook/api';
import { addons, types } from '@storybook/addons';

const Content = () => {
  const results = useParameter('assets', []); // story's parameter being retrieved here
  return (
    <Fragment>
      {results.length ? (
        <ol>
          {results.map(i => (
            <li>{i}</li>
          ))}
        </ol>
      ) : null}
    </Fragment>
  );
};

addons.register('my/design-addon', () => {
  addons.add('design-addon/panel', {
    title: 'assets',
    type: types.PANEL,
    render: ({ active, key }) => (
      <AddonPanel active={active} key={key}>
        <Content />
      </AddonPanel>
    ),
  });
});
```

Notice that we're using the [useParameter](https://storybook.js.org/docs/react/api/addons-api#useparameter), this handy hook will allow us to read the information supplied by the `parameters` option for each story, which in our case will be either a single path to a asset or a list of paths. You'll see it in effect shortly.

### Using our addon with a story

We've connected all the necessary pieces. But how can we see if it's actually working and showing anything?

To do so, we're going to make a small change to the `Task.stories.js` file and add the [parameters](https://storybook.js.org/docs/react/writing-stories/parameters) option.

```javascript
// src/components/Task.stories.js

export default {
  component: Task,
  title: 'Task',
  parameters: {
    assets: [
      'path/to/your/asset.png',
      'path/to/another/asset.png',
      'path/to/yet/another/asset.png',
    ],
  },
  argTypes: {
    /* ...actionsData, */
    backgroundColor: { control: 'color' },
  },
};
/* same as before  */
```

Go ahead and restart your Storybook and select the Task story, you should see something like this:

![storybook story showing contents with design assets addon](/intro-to-storybook/create-addon-design-assets-inside-story.png)

### Showing content in our addon

At this stage we can see that the addon is working as it should, but now let's change the `Content` component to actually display what we want:

```javascript
//.storybook/design-addon/register.js

import React, { Fragment } from 'react';
import { AddonPanel } from '@storybook/components';
import { useParameter, useStorybookState } from '@storybook/api';
import { addons, types } from '@storybook/addons';
import { styled } from '@storybook/theming';

const getUrl = input => {
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

const Content = () => {
  // story's parameter being retrieved here
  const results = useParameter('assets', []);
  // the id of story retrieved from Storybook global state
  const { storyId } = useStorybookState();

  if (results.length === 0) {
    return null;
  }

  const url = getUrl(results[0]).replace('{id}', storyId);

  return (
    <Fragment>
      <Asset url={url} />
    </Fragment>
  );
};
```

Let's take a look at the code. We use the `styled` tag that comes from the `@storybook/theming` package. This allows us to customize Storybook's theme and the addon UI. [`useStorybookState`](https://storybook.js.org/docs/react/api/addons-api#usestorybookstate) is a hook that allows us to tap into Storybook's internal state to fetch any bit of information present. In our case we're using it to fetch the id of each story created.

### Displaying the actual assets

To actually see the assets displayed in our addon, we need to copy them over to the `public` folder and adjust the story's `parameters` option to reflect these changes.

Storybook will pick up on the change and will load the assets, but for now, only the first one.

![actual assets loaded](/intro-to-storybook/design-assets-image-loaded.png)

## Stateful addons

Going over our initial objectives:

- ✔️ Display the design asset in a panel
- ✔️ Support images, but also urls for embedding
- ❌ Should support multiple assets, just in case there will be multiple versions or themes

We're almost there, only one goal remaining.

For the final one, we're going to need some sort of state, we could use React's `useState` hook, or if we were working with class components `this.setState()`. But instead we're going to use Storybook's own `useAddonState`, which gives us a means to persist the addon state, and avoid creating extra logic to persist the local state. We'll also use another UI element from Storybook, the `ActionBar`, which will allow us to change between items.

We need to adjust our imports for our needs:

```javascript
//.storybook/design-addon/register.js

import { useParameter, useStorybookState, useAddonState } from '@storybook/api';
import { AddonPanel, ActionBar } from '@storybook/components';
/* same as before */
```

And modify our `Content` component, so that we can change between assets:

```javascript
//.storybook/design-addon/register.js

const Content = () => {
  // story's parameter being retrieved here
  const results = useParameter('assets', []);
  // addon state being persisted here
  const [selected, setSelected] = useAddonState('my/design-addon', 0);
  // the id of the story retrieved from Storybook global state
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

## Addon built

We've accomplished what we set out to do, which is to create a fully functioning Storybook addon that displays the design assets related to the UI components.

<details>
  <summary>Click to expand and see the full code used in this example</summary>

```javascript
// .storybook/design-addon/register.js

import React, { Fragment } from 'react';

import { useParameter, useStorybookState, useAddonState } from '@storybook/api';
import { addons, types } from '@storybook/addons';
import { AddonPanel, ActionBar } from '@storybook/components';
import { styled } from '@storybook/theming';

const getUrl = input => {
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
    return <Img alt="" src={url} />;
  }

  return <Iframe title={url} src={url} />;
};

const Content = () => {
  const results = useParameter('assets', []); // story's parameter being retrieved here
  const [selected, setSelected] = useAddonState('my/design-addon', 0); // addon state being persisted here
  const { storyId } = useStorybookState(); // the story«s unique identifier being retrieved from Storybook global state

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

addons.register('my/design-addon', () => {
  addons.add('design-addon/panel', {
    title: 'assets',
    type: types.PANEL,
    render: ({ active, key }) => (
      <AddonPanel active={active} key={key}>
        <Content />
      </AddonPanel>
    ),
  });
});
```

</details>

## Next steps

The next logical step for our addon, would be to make it it's own package and allow it to be distributed with your team and possibly with the rest of the community.

But that's beyond the scope of this tutorial. This example demonstrates how you can use the Storybook API to create your own custom addon to further enhance your development workflow.

Learn how to further customize your addon:

- [add buttons in the Storybook toolbar](https://github.com/storybookjs/storybook/blob/next/addons/viewport/src/register.tsx#L8-L15)
- [communicate through the channel with the iframe](https://github.com/storybookjs/storybook/blob/next/dev-kits/addon-roundtrip/README.md)
- [send commands and results](https://github.com/storybookjs/storybook/tree/next/addons/events)
- [perform analysis on the html/css outputted by your component](https://github.com/storybookjs/storybook/tree/next/addons/a11y)
- [wrap components, re-render with new data](https://github.com/storybookjs/storybook/tree/next/addons/knobs)
- [fire DOM events, make DOM changes](https://github.com/storybookjs/storybook/tree/next/addons/events)
- [run tests](https://github.com/storybookjs/storybook/tree/next/addons/jest)

And much more!

<div class="aside">Should you create a new addon and you're interested in having it featured, feel free to open a PR in the Storybook documentation to have it featured.</div>

### Dev kits

To help you jumpstart the addon development, the Storybook team has developed some `dev-kits`.

These packages are starter-kits to help you start building your own addons.
The addon we've just finished creating is based on one of those starter-sets, more specifically the `addon-parameters` dev-kit.

You can find this one and others here:
https://github.com/storybookjs/storybook/tree/next/dev-kits

More dev-kits will become available in the future.

## Sharing addons with the team

Addons are timesaving additions to your workflow, but it can be difficult for non-technical teammates and reviewers to take advantage of their features. You can't guarantee folks will run Storybook on their local machine. That's why deploying your Storybook to an online location for everyone to reference can be really helpful.
