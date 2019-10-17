---
title: "Creating addons"
tocTitle: "Creating addons"
description: "Learn how to build your own addons that will super charge your development"
commit: "dac373a"
---

In the previous chapter we were introduced to one of the key features of Storybook, its robust system of [addons](https://storybook.js.org/addons/introduction/), which can be used to enhance not only yours but also your team's developer experience and workflows.

In this chapter we're going to take a look on how we create our own addon. You might think that writting it can be a daunting task, but actually it's not, we just need to take a couple of steps to get started and we can start writting it.

But first thing is first, let's first scope out what our addon will do.

## The addon we're going to write

For this example, let's assume that our team has some design assets that are somehow related to the existing UI components. Looking at the current Storybook UI, it seems that relationship isn't really apparent. How can we fix that?

We have our goal, now let's define what features our addon will support:

- Display the design asset in a panel
- Support images, but also urls for embedding
- Should support multiple assets, just in case there will be multiple versions or themes

The way we'll be attaching the list of assets to the stories is through [parameters](https://storybook.js.org/docs/configurations/options-parameter/), which is a Storybook option that allow us to inject custom parameters to our stories. The way to use it, it's quite similar on how we used a decorator in previous chapters.

<!-- this is probably not needed as it's used below-->

```javascript
storiesOf("your-component", module)
  .addParameters({
    assets: ["path/to/your/asset.png"]
  })
  .addDecorator(/*...*/)
  .add(/*...*/);
```

<!-- -->

## Setup

We've outlined what our addon will do, time to setup our local development environment. We need some additional packages in our project. More specifically:

<!-- it would be nice that the readme files would have some minimal information for each package-->

- 📦 [@storybook/api](https://www.npmjs.com/package/@storybook/api) for Storybook API usage.
- 📦 [@storybook/components](https://www.npmjs.com/package/@storybook/components) to use Storybook's UI components.
- 📦 [@storybook/theming ](https://www.npmjs.com/package/@storybook/theming) for styling.
- 🛠 [@babel/preset-react](https://babeljs.io/docs/en/babel-preset-react) to transpile correctly some of React's new features.

Open a console, navigate to your project folder and run the following command:

<!--using npm here until the whole tutorial set is moved into npm or yarn issue #153-->

```bash
  npm install --save-dev @storybook/api @storybook/components @storybook/theming @babel/preset-react
```

We'll need to make a small change to the `.babelrc` file we created earlier. We need to add a reference to the `@babel/preset-react` package.

Your updated file should look like this:

```json
{
  "presets": ["@babel/preset-react"],
  "plugins": ["macros"]
}
```

## Writing the addon

We have what we need, it's time to start working on the actual addon.

Inside the `.storybook` folder create a new folder called `addons` and inside, a file called `design-assets.js` with the following:

```javascript
//.storybook/addons/design-assets.js
import React from "react";
import { AddonPanel } from "@storybook/components";
import { addons, types } from "@storybook/addons";

addons.register("my/design-assets", () => {
  addons.add("design-assets/panel", {
    title: "assets",
    type: types.PANEL,
    render: ({ active, key }) => (
      <AddonPanel active={active} key={key}>
        implement
      </AddonPanel>
    )
  });
});
```

<div class="aside">We're going to use the .storybook folder as a placeholder for our addon. The reason behind this, is to maintain a straightforward approach and avoid complicating it too much. Should this addon be transformed into a actual addon it would be best to move it to a separate package with it's own file and folder structure.</div>

This is the a typical boilerplate code to get started and going over what the code is doing:

- We're registering a new addon in our Storybook.
- Add a new UI element for our addon with some options (a title that will define our addon and the type of element used) and render it with some text.

Starting Storybook at this point, we won't be able to see the addon just yet. Like we did earlier with the Knobs addon, we need to register our own in the `.storybook/addons.js` file. Just add the following and should be able to see it working:

```js
import "./addons/design-assets";
```

![design assets addon running inside Storybook](/create-addon-design-assets-added.png)

Success! We have our newly created addon added to the Storybook UI.

<div class="aside">Storybook allows you to add not only panels, but a whole range of different types of UI components. And most if not all of them are already created inside the @storybook/components package, so that you don't need waste too much time implementing the UI and focus on writting features.</div>



### Creating the content component

We've completed our first objective. Time to start working on the second one.

To complete it, we need to make some changes to our imports and introduce a new component that will display the asset information.

Make the following changes to the addon file:

```javascript
//.storybook/addons/design-assets.js
import React, { Fragment } from "react";
/* same as before */
import { useParameter } from "@storybook/api";

//.storybook/addons/design-assets.js
const Content = () => {
  const results = useParameter("assets", []); // story's parameter being retrieved here

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
//.storybook/addons/design-assets.js
import React, { Fragment } from "react";
import { AddonPanel } from "@storybook/components";
import { useParameter } from "@storybook/api";
import { addons, types } from "@storybook/addons";

const Content = () => {
  const results = useParameter("assets", []); // story's parameter being retrieved here

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

addons.register("my/design-assets", () => {
  addons.add("design-assets/panel", {
    title: "assets",
    type: types.PANEL,
    render: ({ active, key }) => (
      <AddonPanel active={active} key={key}>
        implement
      </AddonPanel>
    )
  });
});
```

Notice that we're using the [useParameter](https://storybook.js.org/docs/addons/api/#useparameter), this handy hook will allow us to read the information supplied by the `addParameters` option for each story, which in our case will be either a single path to a asset or a list of paths. You'll see it in effect shortly.

### Using our addon with a story

We've connected all the necessary pieces. But how can we see if it's actually working and showing anything?

To do so, we're going to make a small change to the `Task.stories.js` file and add the [addParameters](https://storybook.js.org/docs/configurations/options-parameter/#per-story-options) option.

```javascript
// src/components/Task.stories.js
storiesOf("Task", module)
  .addDecorator(withKnobs)
  .addParameters({
    assets: [
      "path/to/your/asset.png",
      "path/to/another/asset.png",
      "path/to/yet/another/asset.png"
    ]
  });
/* same as before  */
```

Go ahead and restart your Storybook and select the Task story, you should see something like this:

![storybook story showing contents with design assets addon](/create-addon-design-assets-inside-story.png)

### Showing the actual assets

At this stage we can see that the addon is working as it should our stories, but now let's change the `Content` component to actually display the assets:

```javascript
//.storybook/addons/design-assets.js
import React, { Fragment } from "react";
import { AddonPanel } from "@storybook/components";
import { useParameter, useStorybookState } from "@storybook/api";
import { addons, types } from "@storybook/addons";
import { styled } from "@storybook/theming";

const getUrl = input => {
  return typeof input === "string" ? input : input.url;
};

const Iframe = styled.iframe({
  width: "100%",
  height: "100%",
  border: "0 none"
});
const Img = styled.img({
  width: "100%",
  height: "100%",
  border: "0 none",
  objectFit: "contain"
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
  // story's parameter being retrieved here
  const results = useParameter("assets", []); 
  // the id of story retrieved from Storybook global state
  const { storyId } = useStorybookState(); 

  if (results.length === 0) {
    return null;
  }

  const url = getUrl(results[0]).replace("{id}", storyId);

  return (
    <Fragment>
      <Asset url={url} />
    </Fragment>
  );
};
```

If you take a closer look, you'll see that we're using the `styled` tag, this tag comes from the `@storybook/theming` package. Using this tag, will allow us to customize not only Storybook's theme but also the UI to our needs. Also [useStorybookState](https://storybook.js.org/docs/addons/api/#usestorybookstate), which is a real handy hook, that allows us to tap into Storybook's internal state so that we can fetch any bit of information present. In our case we're using it to fetch only the id of each story created.

### Displaying actual assets

To actually see the assets displayed in our addon, we need to copy them over to the `public` folder and adjust the `addParameter` option to reflect these changes. 

Storybook will pick on the change and will load the assets, but for now, only the first one. 

![actual assets loaded](/design-assets-image-loaded.png) <!--needs to be created-->


## Stateful addons

Going over our initial objectives:

- ✔️ Display the design asset in a panel
- ✔️ Support images, but also urls for embedding
- ❌ Should support multiple assets, just in case there will be multiple versions or themes

We're almost there, only one goal remaining.

For the final one, we're going to need some sort of state, we could use React's `useState`, or if we were working with class components `this.setState()`. But instead we're going to use Storybook's own `useAddonState`, which gives us a means to persist the addon state, and avoid creating extra logic to persist the local state. Also use another UI element from Storybook, the `ActionBar`, which will allow us to change between items.

We need to adjust our imports for our needs:

```javascript
//.storybook/addons/design-assets.js
import { useParameter, useStorybookState, useAddonState } from "@storybook/api";
import { AddonPanel, ActionBar } from "@storybook/components";
/* same as before */
```

And modify our `Content` component, so that we can change between assets:

```javascript
//.storybook/addons/design-assets.js
export const Content = () => {
  // story's parameter being retrieved here
  const results = useParameter("assets", []); 
   // addon state being persisted here
  const [selected, setSelected] = useAddonState("my/design-assets", 0);
   // the id of the story retrieved from Storybook global state
  const { storyId } = useStorybookState(); 

  if (results.length === 0) {
    return null;
  }

  if (results.length && !results[selected]) {
    setSelected(0);
    return null;
  }

  const url = getUrl(results[selected]).replace("{id}", storyId);

  return (
    <Fragment>
      <Asset url={url} />
      {results.length > 1 ? (
        <ActionBar
          actionItems={results.map((i, index) => ({
            title: typeof i === "string" ? `asset #${index + 1}` : i.name,
            onClick: () => setSelected(index)
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
// .storybook/addons
import React, { Fragment } from "react";

import { useParameter, useStorybookState, useAddonState } from "@storybook/api";
import { addons, types } from "@storybook/addons";
import { AddonPanel, ActionBar } from "@storybook/components";
import { styled } from "@storybook/theming";

const getUrl = input => {
  return typeof input === "string" ? input : input.url;
};

const Iframe = styled.iframe({
  width: "100%",
  height: "100%",
  border: "0 none"
});
const Img = styled.img({
  width: "100%",
  height: "100%",
  border: "0 none",
  objectFit: "contain"
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

export const Content = () => {
  const results = useParameter("assets", []); // story's parameter being retrieved here
  const [selected, setSelected] = useAddonState("my/design-assets", 0); // addon state being persisted here
  const { storyId } = useStorybookState(); // the story«s unique identifier being retrieved from Storybook global state

  if (results.length === 0) {
    return null;
  }

  if (results.length && !results[selected]) {
    setSelected(0);
    return null;
  }

  const url = getUrl(results[selected]).replace("{id}", storyId);

  return (
    <Fragment>
      <Asset url={url} />
      {results.length > 1 ? (
        <ActionBar
          actionItems={results.map((i, index) => ({
            title: typeof i === "string" ? `asset #${index + 1}` : i.name,
            onClick: () => setSelected(index)
          }))}
        />
      ) : null}
    </Fragment>
  );
};

addons.register("my/design-assets", () => {
  addons.add("design-assets/panel", {
    title: "assets",
    type: types.PANEL,
    render: ({ active, key }) => (
      <AddonPanel active={active} key={key}>
        <Content />
      </AddonPanel>
    )
  });
});
```

</details>

## Next steps

The next logical step for our addon, would be to make it it's own package and allow it to be distributed with your team and possibly with the rest of the community. 

But that's beyond the scope of this tutorial. This example demonstrates how you can use the Storybook API to create your own custom addon to further enchance your development workflow.

Not only what we've accomplished here, but additionally you can also:

- [add buttons in the storybook toolbar](https://github.com/storybookjs/storybook/blob/next/addons/viewport/src/register.tsx#L8-L15)
- [communicate through the channel with the iframe](https://github.com/storybookjs/storybook/blob/next/dev-kits/addon-roundtrip/README.md)
- [send commands and results](https://github.com/storybookjs/storybook/tree/next/addons/events)
- [perform analysis on the html/css outputted by your component](https://github.com/storybookjs/storybook/tree/next/addons/a11y)
- [wrap components, re-render with new data](https://github.com/storybookjs/storybook/tree/next/addons/knobs)
- [fire DOM events, make DOM changes](https://github.com/storybookjs/storybook/tree/next/addons/events)
- [run tests](https://github.com/storybookjs/storybook/tree/next/addons/jest)

And much more!

<div class="aside">Should you create a new addon and you're interested in having it featured, feel free to open a PR in the Storybook documentation to have it featured.</div>

### Dev kits

To help you jumpstart the addon development, the Storybook teams has developed some `dev-kits`.

These packages work like little starter-sets, for you to start developing your own custom addons.
The addon we've just finished creating is based on one of those starter-sets, more specifically the `addon-parameters` dev-kit.

You can find this one and others here:
https://github.com/storybookjs/storybook/tree/next/dev-kits

More dev-kits will become available in the future.

<!-- old version

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
import Component from "./component";

export default {
  title: "Component",
  component: Component,
  parameters: {
    assets: ["path/to/asset.png"]
  }
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
import React, { useMemo, Fragment } from "react";

import { useParameter } from "@storybook/api";
import { addons, types } from "@storybook/addons";
import { AddonPanel } from "@storybook/components";
```

Now we register a new addon with storybook using and add a panel:

```js
addons.register("my/design-assets", () => {
  addons.add(PANEL_ID, {
    title: "assets",
    type: types.PANEL,
    render: ({ active, key }) => (
      <AddonPanel active={active} key={key}>
        implement
      </AddonPanel>
    )
  });
});
```

Storybook won't auto-load the file we just created, we need to add a reference to `.storybook/addons/design-assets.js` to the file registering all addons.
The file where this happens is `.storybook/addons.js`. so add this line to that file:

```js
import "./addons/design-assets";
```

When we start storybook now, we should actually see a panel added to the UI.
Storybook allows you to not just add panels, but a list of types of UI.

But now we're going to write a component that hooks into storybook's state and get the parameters of the current story:

```js
export const Content = () => {
  const results = useParameter("assets", []);

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

Now all we need to do is connect this component to the rendering of our registered panel and we'll have our working addon:

```js
import React, { useMemo } from "react";

import { useParameter } from "@storybook/api";
import { addons, types } from "@storybook/addons";
import { AddonPanel } from "@storybook/components";

// this is often placed in a constants.js file
const ADDON_ID = "storybook/parameter";
const PANEL_ID = `${ADDON_ID}/panel`;
const PARAM_KEY = `assets`;

// this is often placed in a panel.js file
const Content = () => {
  const results = useParameter(PARAM_KEY, []);

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

// this is often placed in a register.js file
addons.register(ADDON_ID, () => {
  addons.add(PANEL_ID, {
    title: "parameter",
    type: types.PANEL,
    render: ({ active, key }) => (
      <AddonPanel active={active} key={key}>
        <Content />
      </AddonPanel>
    )
  });
});
```

At this point we can navigate between stories in storybook and see the list of design assets associated with the selected story.

Let's change the `Content` component so it actually displays the assets:

```js
import React, { Fragment, useMemo } from "react";

import { useParameter, useStorybookState } from "@storybook/api";
import { styled } from "@storybook/theming";
import { ActionBar } from "@storybook/components";

const ADDON_ID = "storybook/parameter";
const PARAM_KEY = `assets`;

const getUrl = input => {
  return typeof input === "string" ? input : input.url;
};

const Iframe = styled.iframe({
  width: "100%",
  height: "100%",
  border: "0 none"
});
const Img = styled.img({
  width: "100%",
  height: "100%",
  border: "0 none",
  objectFit: "contain"
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

  const url = getUrl(results[0]).replace("{id}", storyId);

  return <Asset url={url} />;
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

  const url = getUrl(results[selected]).replace("{id}", storyId);

  return <Asset url={url} />;
};
```

## Using storybook UI inside your custom addon

Now we have state, but no way of changing the state.
We could of course create our own UI, but let's instead use some UI that storybook has already made.

Storybook's UI component can be found in the `@storybook/components` package.

Let's use the `ActionBar` component:

```js
import { ActionBar } from "@storybook/components";

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

  const url = getUrl(results[selected]).replace("{id}", storyId);

  return (
    <Fragment>
      <Asset url={url} />
      {results.length > 1 ? (
        <ActionBar
          actionItems={results.map((i, index) => ({
            title: typeof i === "string" ? `asset #${index + 1}` : i.name,
            onClick: () => setSelected(index)
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
export const ADDON_ID = "storybook/design-assets";
export const PANEL_ID = `${ADDON_ID}/panel`;
export const PARAM_KEY = `assets`;
```

```js
// register.js
import React from "react";

import { addons, types } from "@storybook/addons";
import { AddonPanel } from "@storybook/components";
import { ADDON_ID, PANEL_ID } from "./constants";
import { Content } from "./panel";

addons.register(ADDON_ID, () => {
  addons.add(PANEL_ID, {
    title: "design assets",
    type: types.PANEL,
    render: ({ active, key }) => (
      <AddonPanel active={active} key={key}>
        <Content />
      </AddonPanel>
    )
  });
});
```

```js
// panel.js
import React, { Fragment, useMemo } from "react";

import { useParameter, useAddonState, useStorybookState } from "@storybook/api";
import { styled } from "@storybook/theming";
import { ActionBar } from "@storybook/components";
import { PARAM_KEY, ADDON_ID } from "./constants";

const Iframe = styled.iframe({
  width: "100%",
  height: "100%",
  border: "0 none"
});
const Img = styled.img({
  width: "100%",
  height: "100%",
  border: "0 none",
  objectFit: "contain"
});

const Asset = ({ url }) => {
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

const getUrl = input => (typeof input === "string" ? input : input.url);

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

  return (
    <Fragment>
      <Asset url={url} />
      {results.length > 1 ? (
        <ActionBar
          actionItems={results.map((i, index) => ({
            title: typeof i === "string" ? `asset #${index + 1}` : i.name,
            onClick: () => setSelected(index)
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
-->
