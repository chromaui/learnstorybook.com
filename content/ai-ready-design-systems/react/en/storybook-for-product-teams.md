---
title: 'Storybook for product teams'
tocTitle: 'Storybook for product teams'
description: 'XXX XXX XXX'
---

## Set up your project and write your first stories

Storybook lets you write [stories](https://storybook.js.org/docs/get-started/whats-a-story) that render a UI component in isolation. Collections of stories showcase different ways of using components, and document the most important parts of their API.

Because stories render in isolation, you often need to set up [decorators](https://storybook.js.org/docs/writing-stories/decorators) for things like your app themes or localization providers. More complex components, like [app pages](https://storybook.js.org/docs/writing-stories/build-pages-with-storybook), often need mocks.

To get started faster, ask your agent to set up Storybook using its own `setup` skill. Paste the following prompt into your agent:

```js
Run `pnpm exec storybook skills setup` and follow its instructions precisely.
```

The `setup` skill analyses
