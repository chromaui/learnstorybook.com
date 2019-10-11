---
title: 'Build UI components'
tocTitle: 'Build'
description: 'Setup Storybook to build and catalog design system components'
commit: e7b6f00
---

In chapter 3 we’ll set up the essential design system tooling starting with Storybook, the most popular component explorer. The goal of this guide is to show you how professional teams build design systems, so we’ll also focus on finer details like the code hygiene, timesaving Storybook addons, and directory structure.

![Where Storybook fits in](/design-systems-for-developers/design-system-framework-storybook.jpg)

## Code formatting and linting for hygiene

Design systems are collaborative, so tools that fix syntax and standardize formatting serve to improve contribution quality. Enforcing code consistency with tooling is much less work than policing code by hand, a benefit for the resourceful design system author.

We’ll use VSCode as our editor in this tutorial but the same idea can be applied to all modern editors like Atom, Sublime, or IntelliJ.

If we add Prettier to our project and set our editor up correctly, we should obtain consistent formatting without having to think much about it:

```bash
yarn add --dev prettier
```

If you are using Prettier for the first time, you may need to set it up for your editor. In VSCode, install the Prettier addon:

![Prettier addon for VSCode](/design-systems-for-developers/prettier-addon.png)

Enable the Format on Save `editor.formatOnSave` if you haven’t done so already. Once you’ve installed Prettier, you should find that it auto-formats your code whenever you save a file.

## Install Storybook

Storybook is the industry-standard [component explorer](https://blog.hichroma.com/the-crucial-tool-for-modern-frontend-engineers-fb849b06187a) for developing UI components in isolation. Since design systems focus on UI components, Storybook is the ideal tool for the use case. We’ll rely on these features:

- 📕Catalog UI components
- 📄Save component variations as stories
- ⚡️Developer experience tooling like Hot Module Reloading
- 🛠Supports many view layers including React

Install and run Storybook

```bash
npx -p @storybook/cli sb init
yarn storybook
```

You should see this:

![Initial Storybook UI](/design-systems-for-developers/storybook-initial.png)

Nice, we’ve set up a component explorer!

By default, Storybook has created a folder `src/stories` with some example stories. However, when we copied our components over, we brought their stories too. We can get them indexed in our Storybook by changing the search path in `.storybook/config.js` from `’src/stories’` to `’src/components’`, and removing the `src/stories` directory:

```javascript
import { configure } from '@storybook/react';

// automatically import all files ending in *.stories.js
configure(require.context('../src', true, /\.stories\.js$/), module);
```

Your Storybook should reload like this (notice that the font styles are a little off, for instance see the "Initials" story):

![Initial set of stories](/design-systems-for-developers/storybook-initial-stories.png)

#### Add global styles

Our design system requires some global styles (a CSS reset) to be applied to the document for components to be rendered correctly. The styles can be added easily via a Styled Components global style tag. For reference here is how the code is exported from `src/shared/global.js`:

```javascript
import { createGlobalStyle, css } from 'styled-components';
import { color, typography } from './styles';

export const fontUrl = 'https://fonts.googleapis.com/css?family=Nunito+Sans:400,700,800,900';

export const bodyStyles = css`
  /* global styles */
`;

export const GlobalStyle = createGlobalStyle`
 body {
   ${bodyStyles}
 }
`;
```

To use the `GlobalStyle` “component” in Storybook, we can make use of a decorator (a component wrapper). In an app we’d place that component in the top-level app layout.

```javascript
import React from 'react';
import { configure, addDecorator } from '@storybook/react';
import { GlobalStyle } from '../src/shared/global';

addDecorator(story => (
  <>
    <GlobalStyle />
    {story()}
  </>
));

// automatically import all files ending in *.stories.js
configure(require.context('../src', true, /\.stories\.js$/), module);
```

The decorator will ensure the `GlobalStyle` is rendered no matter which story is selected.

<div class="aside">The <code><></code> in the decorator is not a typo -- it’s a <a href="https://reactjs.org/docs/fragments.html">React Fragment</a> that we use here to avoid adding an unnecessary extra HTML tag to our output.</div>

#### Add font tag

Our design system also relies on the font Nunito Sans to be loaded into the app. The way to achieve that in an app depends on the app framework (read more about it [here](https://github.com/storybookjs/design-system#font-loading)), but in Storybook the easiest way to achieve that is to use `.storybook/preview-head.html` to add a `<link>` tag directly to the `<head>` of the page:

```javascript
<link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Nunito+Sans:400,700,800,900">
```

Your Storybook should now look like this. Notice the “T” is sans-serif because we added global font styles.

![Storybook with global styles loaded](/design-systems-for-developers/storybook-global-styles.png)

## Supercharge Storybook with addons

Storybook includes a powerful addon ecosystem created by a massive community. For the pragmatic developer, it’s easier to build our workflow using the ecosystem instead of creating custom tooling ourselves (which can be time-consuming).

<h4>Actions addon to verify interactivity</h4>

The [actions addon](https://github.com/storybookjs/storybook/tree/next/addons/actions) gives you UI feedback in Storybook when an action is performed on an interactive element like a Button or Link. Actions comes installed in storybook by default and you use it simply by passing an “action” as a callback prop to a component.

Let’s see how to use it in our Button element, which optionally takes a wrapper component to respond to clicks. We have a story that passes an action to that wrapper:

```javascript
import React from 'react';
import styled from 'styled-components';
import { action } from '@storybook/addon-actions';

// When the user clicks a button, it will trigger the `action()`,
// ultimately showing up in Storybook's addon panel.
function ButtonWrapper(props) {
return <CustomButton onClick={action('button action click')} {...props} />;
}

export const buttonWrapper = () => (
<Button ButtonWrapper={ButtonWrapper} appearance="primary">
// … etc ..
)
```

![Using the actions addon](/design-systems-for-developers/storybook-addon-actions.gif)

#### Source to view and paste code

When you view a story, you often want to see the underlying code to understand how it works and paste it into your project. The Storysource addon shows the currently selected story code in the addon panel.

```bash
yarn add --dev  @storybook/addon-storysource
```

Register the addon in `.storybook/addons.js`:

```javascript
import '@storybook/addon-actions/register';
import '@storybook/addon-links/register';
import '@storybook/addon-storysource/register';
```

And update your webpack config in `.storybook/webpack.config.js`:

```javascript
module.exports = function({ config }) {
 config.module.rules.unshift({
   test: /\.stories\.jsx?$/,
   loaders: [require.resolve('@storybook/source-loader')],
   enforce: 'pre',
 });

 return config;
};
```

This is what that workflow looks like in Storybook:

![The Storysource addon](/design-systems-for-developers/storybook-addon-storysource.png)

<h4>Knobs to stress test components</h4>

The [knobs addon](https://github.com/storybookjs/storybook/tree/next/addons/knobs) allows you to interact with component props dynamically in the Storybook UI. Knobs allows you to supply a multiple values to a component prop and adjust them through via the UI. This helps design system creators stress test component inputs by adjusting, well, knobs. It also gives design system consumers the ability to try components before integrating them so that they can understand how each prop affects the component.

Let’s see how this works by setting up knobs in the `Avatar` component:

```bash
yarn add --dev @storybook/addon-knobs
```

Register the addon in `.storybook/addons.js`:

```javascript
import '@storybook/addon-actions/register';
import '@storybook/addon-links/register';
import '@storybook/addon-storysource/register';
import '@storybook/addon-knobs/register';
```

Add a story that uses knobs in `src/Avatar.stories.js`:

```javascript
import React from 'react';
import { withKnobs, select, boolean } from '@storybook/addon-knobs';

// …

export const knobs = () => (
  <Avatar
    loading={boolean('Loading')}
    size={select('Size', ['tiny', 'small', 'medium', 'large'])}
    username="Dominic Nguyen"
    src="https://avatars2.githubusercontent.com/u/263385"
  />
);

knobs.story = {
  decorators: [withKnobs],
};
```

Notice the Knobs tab in the addon panel. We instrumented the “Size” select element that allows us to cycle through the supported Avatar sizes `tiny`, `small`, `medium`, and `large`. You can instrument other props with knobs as well to create an interactive playground for the component.

![Storybook knobs addon](/design-systems-for-developers/storybook-addon-knobs.gif)

That said, knobs don’t replace stories. Knobs are great for exploring the edge cases of the components. Stories are used for showcasing the intended cases.

We'll visit the Accessbility and Docs addons in later chapters.

> “Storybook is a powerful frontend workshop environment tool that allows teams to design, build, and organize UI components (and even full screens!) without getting tripped up over business logic and plumbing.” – Brad Frost, Author of Atomic Design

## Learn how to automate maintenance

Now that our design system components are in Storybook, we need to set up the automated tooling that streamlines ongoing maintenance. A design system, like all software, should evolve. The challenge is to ensure UI components continue to look and feel as intended as the design system grows.

In chapter 4 we’ll learn how to set up continuous integration and auto-publish the design system online for collaboration.
