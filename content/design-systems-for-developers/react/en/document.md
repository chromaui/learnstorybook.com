---
title: 'Document for stakeholders'
tocTitle: 'Document'
description: 'Drive design system adoption with documentation'
commit: a032b50
---

[Professional](https://product.hubspot.com/blog/how-to-gain-widespread-adoption-of-your-design-system) [frontend](https://segment.com/blog/driving-adoption-of-a-design-system/) [teams](https://medium.com/@didoo/measuring-the-impact-of-a-design-system-7f925af090f7) measure design system success by adoption. To get the full work-saving benefits of a design system, components must be widely circulated. Otherwise, what’s the point?

In this chapter, we’ll create a design system “user manual” to help stakeholders reuse components in their apps. Along the way, we’ll uncover UI documentation best practices used by teams at Shopify, Microsoft, Auth0, and the UK government.

![Generate docs with Storybook automatically](/design-systems-for-developers/design-system-generate-docs.jpg)

## Documentation is exhausting

It’s obvious – documentation is invaluable for collaborative UI development. It helps teams learn how and when to use common UI components. But why does it take so much effort?

If you’ve ever created docs, you probably sunk time into non-documentation tasks like site infrastructure or wrangling technical writers. And even if you find time to publish those docs, it’s grueling to maintain them while continuing to develop features.

**Most docs go out of date the moment they’re created.** Outdated docs undermine trust in the design system components, which results in developers opting to create new components instead of reusing what exists.

## Requirements

Our docs must overcome the inherent friction of creating and maintaining documentation. Here’s what they should do:

- **🔄Stay up to date** by using the latest production code
- **✍️Facilitate writing** using familiar writing tools like Markdown
- **⚡️Reduce maintenance time** so teams can focus on writing
- **📐Provide boilerplate** so developers don’t rewrite common patterns
- **🎨Offer customizability** for particularly complex use cases and components

As Storybook users, we have a head start because component variations are already recorded as stories – a form of documentation. A story showcases how a component is supposed to work given different inputs (props). Stories are easy to write and are self-updating because they use the production components. What’s more, stories can be regression tested using the tools in the previous chapter!

> When you write stories you get component prop documentation and usage examples for free! – Justin Bennett, Engineer at Artsy

## Write stories, generate docs

With the Storybook Docs addon, we can generate rich documentation from existing stories to reduce maintenance time and get out-of-the-box defaults. First, navigate to your design system directory. We’ll install the docs addon:

```bash
yarn add --dev @storybook/addon-docs
```

We'll add it to our addons list in `.storybook/main.js`:

```javascript
// .storybook/main.js

module.exports = {
  stories: ['../src/**/*.stories.js'],
  addons: [
    '@storybook/preset-create-react-app',
    '@storybook/addon-actions',
    '@storybook/addon-links',
    '@storybook/addon-storysource',
    '@storybook/addon-knobs',
    {
      name: '@storybook/addon-docs',
      options: {
        configureJSX: true,
      },
    },
  ],
};
```

You should see two tabs in your Storybook. “Canvas” tab is your component development environment. “Docs” is your component documentation.

![Storybook docs tab](/design-systems-for-developers/storybook-docs.png)

Behind the scenes, Storybook Docs created a new “Docs” tab for each component. It populated the tab with frequently used documentation pieces like interactive previews, source code viewers, and a props table. You’ll find similar features in the design system documentation of Shopify and Auth0. All in less than 5 minutes.

## Extending documentation

So far we’ve made lots of progress with little effort. Yet, the documentation still lacks a _human_ touch. We need to give more context (why, when, and how) for other developers.

Start by adding more metadata that explains what the component does. In `src/Avatar.stories.js`, add a subtitle that describes what the Avatar is used for:

```javascript
// src/Avatar.stories.js

export default {
  title: 'Design System|Avatar',

  parameters: {
    component: Avatar,
    componentSubtitle: 'Displays an image that represents a user or organization',
  },
};
```

Next add JSdoc to the Avatar component (in `src/components/Avatar.js`) that provides a description to be read:

```javascript
// src/components/Avatar.js

/**
- Use an avatar for attributing actions or content to specific users.
- The user's name should always be present when using Avatar – either printed beside the avatar or in a tooltip.
**/

export function Avatar({ loading, username, src, size, ...props }) {
```

You should now see this:

![Storybook docs tab with component details](/design-systems-for-developers/storybook-docspage.png)

Storybook Docs automatically generated the prop table that shows types and default values. That’s convenient, but it doesn’t mean Avatar is dummy-proof – several props can be misused. Add comments in your proptypes to render them in the auto-generated prop table.

```javascript
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

By default, every Avatar story is rendered in the docs. We can’t assume other developers know what each story represents. Write some descriptive text for the stories in `src/Avatar.stories.js`:

```javascript
// src/Avatar.stories.js

export const sizes = () => (
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
);
sizes.story = {
  parameters: { docs: { storyDescription: '4 sizes are supported.' } },
};
```

![Storybook docs tab with filled out details](/design-systems-for-developers/storybook-docspage-expanded.png)

#### Supercharge documentation with Markdown/MDX

Every component is different and so are the documentation requirements. We used Storybook Docs to generate best practice documentation for free. Let’s add supplementary information and identify some gotchas in our component.

Markdown is a straightforward format for writing text. MDX allows you to use interactive code (JSX) inside of Markdown. Storybook Docs uses MDX to give developers ultimate control over how documentation renders.

First, let’s take control of the Avatar doc generation from the default. Register MDX files in `.storybook/main.js` like so.

```javascript
// .storybook/main.js

module.exports = {
  // automatically import all files ending in *.stories.js|mdx
  stories: ['../src/**/*.stories.(js|mdx)'],
  addons: [
    '@storybook/preset-create-react-app',
    '@storybook/addon-actions',
    '@storybook/addon-links',
    '@storybook/addon-storysource',
    '@storybook/addon-knobs',
    '@storybook/addon-a11y',
    '@storybook/addon-docs',
  ],
};
```

Create a new `src/Avatar.stories.mdx` file and supply some details. We’ll remove the `Avatar.stories.js` file and recreate the stories in the mdx file:

```javascript
// src/Avatar.stories.mdx

import { Meta, Story } from '@storybook/addon-docs/blocks';
import { withKnobs, select, boolean } from '@storybook/addon-knobs';

import { Avatar } from './Avatar';

<Meta title="Design System|Avatar" component={Avatar} />

# Avatar

## Displays an image that represents a user or organization

Use an avatar for attributing actions or content to specific users. The user's name should _always_ be present when using Avatar – either printed beside the avatar or in a tooltip.

<Story name="standard">
  <Avatar
    size="large"
    username="Tom Coleman"
    src="https://avatars2.githubusercontent.com/u/132554"
  />
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

When no image is supplied to the `src` prop, Avatar displays initials. Avatar should be used sparingly in situations without access to images.

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

Experiment with this story with Knobs addon in Canvas mode.

<Story name="knobs" parameters={{ decorators: [withKnobs] }}>
  <Avatar
    loading={boolean('Loading')}
    size={select('Size', ['tiny', 'small', 'medium', 'large'])}
    username="Dominic Nguyen"
    src="https://avatars2.githubusercontent.com/u/263385"
  />
</Story>
```

In Storybook your Avatar component’s “Docs” tab should be replaced with our sparse MDX page.

![Storybook docs from MDX](/design-systems-for-developers/storybook-docs-mdx-initial.png)

Storybook Docs come with “Doc Blocks”, readymade components like interactive previews, the props table, and more. By default, they’re used behind the scenes for the auto-generated docs pages. They can also be extracted for individual use. Our goal is to customize Avatar’s docs without redoing everything ourselves so let’s reuse Doc Blocks where possible.

Let’s add the `Props` doc block, and wrap our initial story in a `Preview`

```javascript
// src/Avatar.stories.mdx

import { Meta, Story, Props, Preview } from '@storybook/addon-docs/blocks';

# …

<Preview withToolbar>
  <Story name="standard">
    <Avatar
      size="large"
      username="Tom Coleman"
      src="https://avatars2.githubusercontent.com/u/132554"
    />
  </Story>
</Preview>

<Props of={Avatar} />
```

![Storybook docs from MDX with blocks](/design-systems-for-developers/storybook-docs-mdx-docblocks.png)

Nice! We’re back to where we started, but now with full control over ordering and content. The benefits of automated doc generation persist because we’re using Doc Blocks.

Customize Avatar’s docs with a note about use cases. This gives developers context about how to take advantage of this component. We can just add markdown as we would in any other markdown document:

```javascript
// src/Avatar.stories.mdx

// Same content as before

<Props of={Avatar} />

## Usage

Avatar is used to represent a person or an organization. By default the avatar shows an image and gracefully falls back to the first initial of the username. While hydrating the component you may find it useful to render a skeleton template to indicate that Avatar is awaiting data. Avatars can be grouped with the AvatarList component.

### Sizes

// Same content as before

```

![Storybook docs for MDX with usage info](/design-systems-for-developers/storybook-docs-mdx-usage.png)

#### Custom pages

Every design system comes with a cover page. Storybook Docs allows you to create discrete pages using MDX.

Create a new file `src/components/Intro.stories.mdx`:

```javascript
// src/components/Intro.stories.mdx

import { Meta } from '@storybook/addon-docs/blocks';

<Meta title="Design System|Introduction" />

# Introduction to the Learn Storybook design system

The Learn Storybook design system is a subset of the full [Storybook design system](https://github.com/storybookjs/design-system/), created as a learning resource for those interested in learning how to write and publish a design system using best practice techniques.

Learn more at [Learn Storybook](https://learnstorybook.com).
```

This generates a new documentation-only page that is independent of the automated component docs pages from earlier.

![Storybook docs with introduction page, unsorted](/design-systems-for-developers/storybook-docs-introduction-unsorted.png)

To get it to appear first, we have to tell Storybook to load the Introduction file in `.storybook/main.js`:

```javascript
// .storybook/main.js

module.exports = {
  // changes the load order of our stories. First loads the Intro page
  // automatically import all files ending in *.stories.js|mdx
  stories: ['../src/components/Intro.stories.mdx', '../src/**/*.stories.(js|mdx)'],
  addons: [
    '@storybook/preset-create-react-app',
    '@storybook/addon-actions',
    '@storybook/addon-links',
    '@storybook/addon-storysource',
    '@storybook/addon-knobs',
    '@storybook/addon-a11y',
    '@storybook/addon-docs',
  ],
};
```

<div class="aside">
 <p>If you're still using <code>storiesOf</code> format, you'll need to make some adjustments to your <code>./storybook/preview.js</code> and add the  <code>sortStories</code> function in order to display them correctly.</p>
 <p> You can read more about it <a href="https://storybook.js.org/docs/configurations/options-parameter/#sorting-stories">here.</a></p>
</div>

![Storybook docs with introduction page](/design-systems-for-developers/storybook-docs-introduction.png)

## Publishing documentation online

If you write documentation that no one reads, is that useful? No. It’s not enough to create high-quality learning material, we need to surface that material to stakeholders and colleagues. Right now, our docs are buried in the repo which means folks must run the design system’s Storybook locally in order to see the docs.

In a previous chapter, we published Storybook online for visual review. It’s easy to use the same mechanism to publish our component docs as well. Let’s add a new script to `package.json` to build our Storybook in docs mode:

```json
{
  "scripts": {
    "build-storybook-docs": "build-storybook -s public --docs"
  }
}
```

Save and commit. For instance, we could use either [Netlify](https://www.netlify.com/) or even [Vercel](https://vercel.com/) as a deployment system for our docs site on every commit.

<!--
Create a second Netlify integration to run the docs build script:

![alt_text](/design-systems-for-developers/Feedback-wanted55.png)

Great. Every time you commit, you’ll now see two PR checks. One takes you to the published Storybook. The other takes you to the published Storybook Docs.

![alt_text](/design-systems-for-developers/Feedback-wanted56.png) -->

<div class="aside">As your design system grows you may encounter organization-specific requirements that warrant custom tooling or even building your own static site using tools like Gatsby or Next. It’s easy to port markdown and MDX to other solutions.</div>

## Import the design system in other apps

Up until now, we focused inward. First, on creating durable UI components. Then, on reviewing, testing, and documenting them. Now we’ll shift perspective outward to examine how teams consume design systems.

Chapter 7 walks through packaging the design system for use in other apps. Learn how to combine npm, the JavaScript package manager, with Auto, a time-saving release management tool.
