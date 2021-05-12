---
title: 'Build UI components'
tocTitle: 'Build'
description: 'Setup Storybook to build and catalog design system components'
commit: 4211d5e
---

In chapter 3 we’ll set up the essential design system tooling starting with Storybook, the most popular component explorer. The goal of this guide is to show you how professional teams build design systems, so we’ll also focus on finer details like the code hygiene, timesaving Storybook addons, and directory structure.

![Where Storybook fits in](/design-systems-for-developers/design-system-framework-storybook.jpg)

## Code formatting and linting for hygiene

Design systems are collaborative, so tools that fix syntax and standardize formatting serve to improve contribution quality. Enforcing code consistency with tooling is much less work than policing code by hand, a benefit for the resourceful design system author.

We’ll use VSCode as our editor in this tutorial but the same idea can be applied to all modern editors like Atom, Sublime, or IntelliJ.

If we add Prettier to our project and set our editor up correctly, we should obtain consistent formatting without having to think much about it:

```shell
yarn add --dev prettier
```

If you are using Prettier for the first time, you may need to set it up for your editor. In VSCode, install the Prettier addon:

![Prettier addon for VSCode](/design-systems-for-developers/prettier-addon.png)

Enable the Format on Save `editor.formatOnSave` if you haven’t done so already. Once you’ve installed Prettier, you should find that it auto-formats your code whenever you save a file.

## Install Storybook

Storybook is the industry-standard [component explorer](https://www.chromatic.com/blog/ui-component-explorers---your-new-favorite-tool) for developing UI components in isolation. Since design systems focus on UI components, Storybook is the ideal tool for the use case. We’ll rely on these features:

- 📕Catalog UI components
- 📄Save component variations as stories
- ⚡️Developer experience tooling like Hot Module Reloading
- 🛠Supports many view layers including React

Install and run Storybook

```shell
npx -p @storybook/cli sb init
yarn storybook
```

You should see this:

![Initial Storybook UI](/design-systems-for-developers/storybook-initial-6-0.png)

Nice, we’ve set up a component explorer!

Every time you install Storybook into an application it will add some examples inside the `stories` folder. If you want, take some time and explore them. But we won't be needing them for our design system, so it's safe to delete the `stories` directory.

Now your Storybook should look like this (notice that the font styles are a little off, for instance see the "Avatar: Initials" story):

<video autoPlay muted playsInline loop>
  <source
    src="/design-systems-for-developers/storybook-initial-stories-without-styles-6-0.mp4"
    type="video/mp4"
  />
</video>

#### Add global styles

Our design system requires some global styles (a CSS reset) to be applied to the document for components to be rendered correctly. The styles can be added easily via a Styled Components global style tag. Adjust your global styles, located in `src/shared/global.js` to the following:

```diff:title=src/shared/global.js
import { createGlobalStyle, css } from 'styled-components';

import { color, typography } from './styles';

+ export const fontUrl = 'https://fonts.googleapis.com/css?family=Nunito+Sans:400,700,800,900';

export const bodyStyles = css`
  /* Same as before */
`;

export const GlobalStyle = createGlobalStyle`
 body {
   ${bodyStyles}
 }`;
```

To use the `GlobalStyle` “component” in Storybook, we can make use of a [decorator](https://storybook.js.org/docs/react/writing-stories/decorators) (a component wrapper). In an app we’d place that component in the top-level app layout, but in Storybook we wrap all stories in it using the preview config file [`.storybook/preview.js`](https://storybook.js.org/docs/react/configure/overview#configure-story-rendering).

```diff:title=.storybook/preview.js
+ import React from 'react';

+ import { GlobalStyle } from '../src/shared/global';

+ // Global decorator to apply the styles to all stories
+ export const decorators = [
+   Story => (
+     <>
+       <GlobalStyle />
+       <Story />
+     </>
+   ),
+ ];

export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
};
```

The decorator will ensure the `GlobalStyle` is rendered no matter which story is selected.

<div class="aside">💡 The <code><></code> in the decorator is not a typo -- it’s a <a href="https://reactjs.org/docs/fragments.html">React Fragment</a> that we use here to avoid adding an unnecessary extra HTML tag to our output.</div>

#### Add font tag

Our design system also relies on the font Nunito Sans to be loaded into the app. The way to achieve that in an app depends on the app framework (read more about it [here](https://github.com/storybookjs/design-system#font-loading)), but in Storybook the easiest way to achieve that is to use [`.storybook/preview-head.html`](https://storybook.js.org/docs/react/configure/story-rendering#adding-to-head) to add a `<link>` tag directly to the `<head>` of the page:

```html:title=.storybook/preview-head.html
<link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Nunito+Sans:400,700,800,900" />
```

Your Storybook should now look like this. Notice the “T” is sans-serif because we added global font styles.

![Storybook with global styles loaded](/design-systems-for-developers/storybook-global-styles-6-0.png)

## Supercharge Storybook with addons

Storybook includes a powerful [addon ecosystem](https://storybook.js.org/addons) created by a massive community. For the pragmatic developer, it’s easier to build our workflow using the ecosystem instead of creating custom tooling ourselves (which can be time-consuming).

<h4>Actions addon to verify interactivity</h4>

The [actions addon](https://storybook.js.org/docs/react/essentials/actions) gives you UI feedback in Storybook when an action is performed on an interactive element like a Button or Link. Actions comes installed in Storybook by default and you use it simply by passing an “action” as a callback prop to a component.

Let’s see how to use it in our Button element, which optionally takes a wrapper component to respond to clicks. Let's alter the story to pass an action to that wrapper:

```diff:title=src/Button.stories.js
import React from 'react';

import styled from 'styled-components';

+ import { action } from '@storybook/addon-actions'

+ const onButtonClick = action("onButtonClick")

// When the user clicks a button, it will trigger the `action()`,
// ultimately showing up in Storybook's addon panel.
function ButtonWrapper(props) {
-  return <CustomButton {...props} />;
+  return <CustomButton onClick={onButtonClick} {...props} />
}

export const buttonWrapper = (args) => (
  return <Button ButtonWrapper={ButtonWrapper} appearance="primary" />;
// … etc ..
)
```

<video autoPlay muted playsInline loop>
  <source
    src="/design-systems-for-developers/storybook-addon-actions-6-0.mp4"
    type="video/mp4"
  />
</video>

<h4>Controls to stress test components</h4>

Fresh installs of Storybook include the [Controls addon](https://storybook.js.org/docs/react/essentials/controls), it's already configured out of the box.

It allows you to interact with component inputs (props) dynamically in the Storybook UI. You can supply multiple values to a component prop through [arguments](https://storybook.js.org/docs/react/writing-stories/args) (or args for short) and adjust them through the UI. This helps design systems creators stress test component inputs (props) by adjusting the argument's values. It also gives design systems consumers the ability to try components before integrating them, so they can understand how each input (prop) affects the component.

Let's see how they work, by adding a new story in the `Avatar` component, located in `src/Avatar.stories.js`:

```js:title=src/Avatar.stories.js
// New story using controls
const Template = args => <Avatar {...args} />;

export const Controls = Template.bind({});
Controls.args = {
  loading: false,
  size: 'tiny',
  username: 'Dominic Nguyen',
  src: 'https://avatars2.githubusercontent.com/u/263385',
};
```

Notice the Controls tab in the addon panel. Controls automatically generates graphical UI to adjust props. For instance, the “size” select element allows us to cycle through the supported Avatar sizes `tiny`, `small`, `medium`, and `large`. The same was applied to the remainder component's props (“loading”,“username” and “src”). This allows us to create a user-friendly way to stress test components.

<video autoPlay muted playsInline loop>
  <source
    src="/design-systems-for-developers/storybook-addon-controls-6-0.mp4"
    type="video/mp4"
  />
</video>

That said, Controls don’t replace stories. They are great for exploring the edge cases of the components. Stories are used for showcasing the intended cases.

We'll visit the Accessibility and Docs addons in later chapters.

> “Storybook is a powerful frontend workshop environment tool that allows teams to design, build, and organize UI components (and even full screens!) without getting tripped up over business logic and plumbing.” – Brad Frost, Author of Atomic Design

## Learn how to automate maintenance

Now that our design system components are in Storybook, we've taken one more step to create a industry-standard design system. Now it's a good time to commit our work to our remote repository. Then we can start thinking about how we setup the automated tooling that streamlines ongoing maintenance.

A design system, like all software, should evolve. The challenge is to ensure UI components continue to look and feel as intended as the design system grows.

In chapter 4 we’ll learn how to set up continuous integration and auto-publish the design system online for collaboration.
