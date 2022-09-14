---
title: 'Document for stakeholders'
tocTitle: 'Document'
description: 'Drive design system adoption with documentation'
commit: '9e4a7d3'
---

[Professional](https://product.hubspot.com/blog/how-to-gain-widespread-adoption-of-your-design-system) [frontend](https://segment.com/blog/driving-adoption-of-a-design-system/) [teams](https://medium.com/@didoo/measuring-the-impact-of-a-design-system-7f925af090f7) measure design system success by adoption. To get the full work-saving benefits of a design system, components must be widely circulated. Otherwise, what’s the point?

In this chapter, we’ll create a design system “user manual” to help stakeholders reuse components in their apps. Along the way, we’ll uncover UI documentation best practices used by teams at Shopify, Microsoft, Auth0, and the UK government.

![Generate docs with Storybook automatically](/design-systems-for-developers/design-system-generate-docs.jpg)

## Documentation is exhausting

It’s obvious – documentation is invaluable for collaborative UI development. It helps teams learn how and when to use common UI components. But why does it take so much effort?

If you’ve ever created docs, you probably sunk time into non-documentation tasks like site infrastructure or wrangling technical writers. And even if you find time to publish those docs, it’s grueling to maintain them while developing new features.

**Most docs go out of date the moment they’re created.** Outdated docs undermine trust in the design system components, which results in developers opting to create new components instead of reusing what exists.

## Requirements

Our docs must overcome the inherent friction of creating and maintaining documentation. Here’s what they should do:

- **🔄 Stay up to date** by using the latest production code
- **✍️ Facilitate writing** using familiar writing tools like Markdown
- **⚡️ Reduce maintenance time** so teams can focus on writing
- **📐 Provide boilerplate** so developers don’t rewrite common patterns
- **🎨 Offer customizability** for particularly complex use cases and components

As Storybook users, we have a head start because component variations are already recorded as stories–-a form of documentation. A story showcases how a component is supposed to work given different inputs (props). Stories are easy to write and are self-updating because they use the production components. What’s more, stories can be regression tested using the tools in the previous chapter!

> When you write stories you get component prop documentation and usage examples for free! – Justin Bennett, Engineer at Artsy

## Write stories, generate docs

With the Storybook Docs addon, we can generate rich documentation from existing stories to reduce maintenance time and get out of the box defaults.
Like the addons we've covered in the [build](/design-systems-for-developers/react/en/build/) chapter (Controls and Actions), the Docs addon is also included and configured with each Storybook install, so we can focus on writing good documentation.

Each time you open your Storybook, you should see two tabs:

- 🖼️ “Canvas” tab is your component development environment.
- 📝 “Docs” tab is your component documentation.

![Storybook docs tab](/design-systems-for-developers/storybook-docs-6-0.png)

Behind the scenes, Storybook Docs created a new “Docs” tab for each component. It populated the tab with frequently used documentation pieces like interactive previews, source code viewers, and an args table. You’ll find similar features in the design system documentation of Shopify and Auth0. All in less than 2 minutes.

## Extending documentation

So far, we’ve made lots of progress with little effort. Yet, the documentation still lacks a _human_ touch. We need to give more context (why, when, and how) to other developers.

Start by adding more metadata that explains what the component does. In `src/Avatar.stories.js`, add a subtitle that describes what the Avatar is used for:

```diff:title=src/Avatar.stories.js
import React from 'react';

import { Avatar } from './Avatar';

export default {
  title: 'Design System/Avatar',
  component: Avatar,
  /*
  * More on Storybook argTypes at:
  * https://storybook.js.org/docs/react/api/argtypes
  */
  argTypes: {
    size: {
      control: {
        type: 'select',
      },
      options: ['tiny', 'small', 'medium', 'large'],
    },
  },
  /*
  * More on Storybook parameters at:
  * https://storybook.js.org/docs/react/writing-stories/parameters#component-parameters
  */
+ parameters: {
+   componentSubtitle: 'Displays an image that represents a user or organization',
+ },
};
```

Next, add [JSdoc](https://jsdoc.app/) to the Avatar component (in `src/Avatar.js`) providing a clear description:

```js:title=src/Avatar.js
/**
- Use an avatar for attributing actions or content to specific users.
- The user's name should always be present when using Avatar – either printed beside the avatar or in a tooltip.
**/
export function Avatar({ loading, username, src, size, ...props }) {}
```

You should now see this:

![Storybook docs tab with component details](/design-systems-for-developers/storybook-docspage-6-0.png)

Storybook Docs automatically generated the args table that shows types and default values. That’s convenient, but it doesn’t mean `Avatar` is dummy-proof – several arguments (props) can be misused. Add comments in your `propTypes` to render them in the auto-generated args table.

```js:title=src/Avatar.js
Avatar.propTypes = {
  /**
    Use the loading state to indicate that the data Avatar needs is still loading.
    */
  loading: PropTypes.bool,
  /**
    Avatar falls back to the user's initial when no image is provided.
    Supply a `username` and omit `src` to see what this looks like.
    */
  username: PropTypes.string,
  /**
    The URL of the Avatar's image.
    */
  src: PropTypes.string,
  /**
    Avatar comes in four sizes. In most cases, you'll be fine with `medium`.
    */
  size: PropTypes.oneOf(Object.keys(sizes)),
};
```

By default, every `Avatar` story is rendered in the docs, but we can’t assume other developers know what each story represents. Write some descriptive text for the stories in `src/Avatar.stories.js`:

```diff:title=src/Avatar.stories.js
import React from 'react';

import { Avatar } from './Avatar';

export default {
  title: 'Design System/Avatar',
  component: Avatar,
  /*
  * More on Storybook argTypes at:
  * https://storybook.js.org/docs/react/api/argtypes
  */
  argTypes: {
    size: {
      control: {
        type: 'select',
      },
      options: ['tiny', 'small', 'medium', 'large'],
    },
  },
  parameters: {
    componentSubtitle:
      'Displays an image that represents a user or organization',
  },
};

// Other Avatar stories

export const Sizes = (args) => (
  <div>
    <Avatar {...args} size="large" />
    <Avatar {...args} size="medium" />
    <Avatar {...args} size="small" />
    <Avatar {...args} size="tiny" />
  </div>
);

/*
 * More on component Storybook args at
 * https://storybook.js.org/docs/react/writing-stories/args#story-args
 */
Sizes.args = {
  username: 'Tom Coleman',
  src: 'https://avatars2.githubusercontent.com/u/132554',
};

/*
 * More on component Storybook parameters at:
 * https://storybook.js.org/docs/react/writing-stories/parameters#story-parameters
 */
+ Sizes.parameters = {
+   docs: {
+     // The story now contains a description
+     storyDescription: '4 sizes are supported.',
+   },
+ };
```

<video autoPlay muted playsInline loop>
  <source
    src="/design-systems-for-developers/storybook-docspage-expanded-6-0.mp4"
    type="video/mp4"
  />
</video>

#### Supercharge documentation with Markdown/MDX

Every component is different, and so are the documentation requirements. We used Storybook Docs to generate best practice documentation for free. Let’s add supplementary information and identify some gotchas in our component.

Markdown is a straightforward format for writing text. MDX allows you to use interactive code (JSX) inside of Markdown. Storybook Docs uses MDX to give developers ultimate control over how documentation renders.

As part of the Storybook install workflow, MDX files are registered by default. Your `.storybook/main.js` should look like so:

```js:title=.storybook/main.js
module.exports = {
  stories: ['../src/**/*.stories.mdx', '../src/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
    '@storybook/preset-create-react-app',
    '@storybook/addon-a11y',
  ],
  framework: '@storybook/react',
};
```

Create a new `src/Avatar.stories.mdx` file and supply some details. We’ll remove the `Avatar.stories.js` file and recreate the stories in the mdx file:

<!-- prettier-ignore-start -->

```js:title=src/Avatar.stories.mdx
import { Canvas, Meta, Story } from "@storybook/addon-docs";

import { Avatar } from "./Avatar";

<Meta
  title="Design System/Avatar"
  component={Avatar}
  argTypes={{
    loading: {
      control: "boolean",
      description:
        "Use the loading state to indicate that the data Avatar needs is still loading.",
      table: {
        type: { summary: "boolean" },
        defaultValue: { summary: false },
      },
    },
    username: {
      description:
        "Avatar falls back to the user’s initial when no image is provided. Supply a `username` and omit `src` to see what this looks like.",
      table: {
        defaultValue: {
          summary: "loading",
        },
      },
    },
    src: {
      description: "The URL of the Avatar's image.",
      table: {
        defaultValue: {
          summary: null,
        },
      },
    },
    size: {
      description:
        "Avatar comes in four sizes. In most cases, you’ll be fine with `medium`.",
      table: {
        defaultValue: {
          summary: "medium",
        },
      },
    },
  }}
/>

# Avatar

## Displays an image that represents a user or organization

Use an avatar for attributing actions or content to specific users.

The user's name should _always_ be present when using Avatar – either printed beside the avatar or in a tooltip.

export const Template = (args) => <Avatar {...args} />;

<Story
  name="standard"
  args={{
    size: "large",
    username: "Tom Coleman",
    src: "https://avatars2.githubusercontent.com/u/132554",
  }}
>
  {Template.bind({})}
</Story>

### Sizes

4 sizes are supported.

<Story name="sizes">
  <div>
    <Avatar
      size="large"
      username="Tom Coleman"
      src="https://avatars2.githubusercontent.com/u/132554"
    />
    <Avatar
      size="medium"
      username="Tom Coleman"
      src="https://avatars2.githubusercontent.com/u/132554"
    />
    <Avatar
      size="small"
      username="Tom Coleman"
      src="https://avatars2.githubusercontent.com/u/132554"
    />
    <Avatar
      size="tiny"
      username="Tom Coleman"
      src="https://avatars2.githubusercontent.com/u/132554"
    />
  </div>
</Story>

### Default Values

When no image is supplied to the `src` prop, Avatar displays initials.

Avatar should be used sparingly in situations without access to images.

<Story name="initials">
  <div>
    <Avatar username="Tom Coleman" />
    <Avatar username="Dominic Nguyen" />
    <Avatar username="Kyle Suss" />
    <Avatar username="Michael Shilman" />
  </div>
</Story>

### Loading

The loading state is used when the image or username is, well, loading.

<Story name="loading">
  <div>
    <Avatar size="large" loading />
    <Avatar size="medium" loading />
    <Avatar size="small" loading />
    <Avatar size="tiny" loading />
  </div>
</Story>

### Playground

Experiment with this story with the Controls addon in the Canvas tab.

<Canvas>
  <Story
    name="controls"
    args={{
      loading: false,
      size: "tiny",
      username: "Dominic Nguyen",
      src: "https://avatars2.githubusercontent.com/u/263385",
    }}
  >
    {Template.bind({})}
  </Story>
</Canvas>
```

<!-- prettier-ignore-end -->

In Storybook, your Avatar component’s “Docs” tab should be replaced with our sparse MDX page.

![Storybook docs from MDX](/design-systems-for-developers/storybook-docs-mdx-initial-6-0.png)

Storybook Docs come with “Doc Blocks”, readymade components like interactive previews, the args table, and more. By default, they’re used behind the scenes for the auto-generated docs pages, and they can also be extracted for individual use. Our goal is to customize Avatar’s docs without redoing everything ourselves so let’s reuse Doc Blocks where possible.

Let’s add the [`ArgsTable`](https://storybook.js.org/docs/react/writing-docs/doc-block-argstable#working-with-mdx) doc block and wrap our initial story in a `Canvas`.

```js:title=src/Avatar.stories.mdx
import { ArgsTable, Canvas, Meta, Story } from "@storybook/addon-docs";

# Same content as before

<Canvas>
  <Story
    name="standard"
    args={{
      size: "large",
      username: "Tom Coleman",
      src: "https://avatars2.githubusercontent.com/u/132554",
    }}
  >
    {Template.bind({})}
  </Story>
</Canvas>

<ArgsTable story="standard" />
```

![Storybook docs from MDX with blocks](/design-systems-for-developers/storybook-docs-mdx-docblocks-6-0.png)

Nice! We’re back to where we started, but now with complete control over ordering and content. The benefits of automated doc generation persist because we’re using Doc Blocks.

Customize Avatar’s docs with a note about use cases. It gives developers context about how to take advantage of this component. We can just add markdown as we would in any other markdown document:

```js:title=src/Avatar.stories.mdx

// Same content as before

<ArgsTable story="standard" />

## Usage

Avatar is used to represent a person or an organization. By default the avatar shows an image and gracefully falls back to the first initial of the username. While hydrating the component you may find it useful to render a skeleton template to indicate that Avatar is awaiting data. Avatars can be grouped with the AvatarList component.

### Sizes

// Same content as before
```

![Storybook docs for MDX with usage info](/design-systems-for-developers/storybook-docs-mdx-usage-6-0.png)

#### Custom pages

Every design system comes with a cover page. Storybook Docs allows you to create discrete pages using MDX.

Create a new file `src/Intro.stories.mdx`:

```js:title=src/Intro.stories.mdx
import { Meta } from "@storybook/addon-docs";

<Meta title="Design System/Introduction" />

# Introduction to the Storybook design system tutorial

The Storybook design system tutorial is a subset of the full [Storybook design system](https://github.com/storybookjs/design-system/), created as a learning resource for those interested in learning how to write and publish a design system using best practice techniques.

Learn more in the [Storybook tutorials](https://storybook.js.org/tutorials/).
```

It generates a new documentation-only page that is independent of the automated component docs pages from earlier.

![Storybook docs with introduction page, unsorted](/design-systems-for-developers/storybook-docs-introduction-unsorted.png)

To get it to appear first, we have to tell Storybook to load the Introduction file in `.storybook/main.js`:

```diff:title=.storybook/main.js
module.exports = {
  // Changes the load order of our stories. First loads the Intro page
  // automatically import all files ending in *.stories.js|mdx
  stories: [
+   '../src/Intro.stories.mdx',
    '../src/**/*.stories.mdx',
    '../src/**/*.stories.@(js|jsx|ts|tsx)',
  ],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
    '@storybook/preset-create-react-app',
    '@storybook/addon-a11y',
  ],
  framework: '@storybook/react',
};
```

![Storybook docs with introduction page](/design-systems-for-developers/storybook-docs-introduction-6-0.png)

## Publishing documentation online

If you write documentation that no one reads, is that useful? No. It’s not enough to create high-quality learning material, and we need to surface that material to stakeholders and colleagues. Right now, our docs are buried in the repo, which means folks must run the design system’s Storybook locally to see the docs.

In a previous chapter, we published Storybook online for visual review. It’s easy to use the same mechanism to publish our component docs as well. Let’s add a new script to `package.json` to build our Storybook in docs mode:

```json:clipboard=false
{
  "scripts": {
    "build-storybook-docs": "build-storybook  --docs"
  }
}
```

Save and commit.

Running `build-storybook-docs` in your command line or continuous integration tool will output a static site in the "docs" configuration. Set up a static site deployment tool [Netlify](https://www.netlify.com/) or [Vercel](https://vercel.com/) to deploy the docs site on every commit.

<div class="aside">💡 As your design system grows, you may encounter organization-specific requirements that warrant custom tooling or even building your own static site using tools like Gatsby or Next. It’s easy to port markdown and MDX to other solutions.</div>

## Import the design system in other apps

Up until now, we focused inward. First, on creating durable UI components. Then, on reviewing, testing, and documenting them. Now we’ll shift perspective outward to examine how teams consume design systems.

Chapter 7 walks through packaging the design system for use in other apps. Learn how to combine npm, the JavaScript package manager, with Auto, a time-saving release management tool.
