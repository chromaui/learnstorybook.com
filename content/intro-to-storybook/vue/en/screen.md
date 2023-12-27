---
title: 'Construct a screen'
tocTitle: 'Screens'
description: 'Construct a screen out of components'
commit: 'af51337'
---

We've concentrated on building UIs from the bottom up, starting small and adding complexity. Doing so has allowed us to develop each component in isolation, figure out its data needs, and play with it in Storybook. All without needing to stand up a server or build out screens!

In this chapter, we continue to increase the sophistication by combining components in a screen and developing that screen in Storybook.

## Nested container components

As our app is straightforward, the screen we’ll build is pretty trivial, simply wrapping the `TaskList` component (which supplies its own data via Pinia) in some layout and pulling a top-level `error` field out of the store (let's assume we'll set that field if we have some problem connecting to our server). Let's create a presentational `PureInboxScreen.vue` in your `src/components/` folder:

```html:title=src/components/PureInboxScreen.vue
<template>
  <div>
    <div v-if="error" class="page lists-show">
      <div class="wrapper-message">
        <span class="icon-face-sad" />
        <p class="title-message">Oh no!</p>
        <p class="subtitle-message">Something went wrong</p>
      </div>
    </div>
    <div v-else class="page lists-show">
      <nav>
        <h1 class="title-page">Taskbox</h1>
      </nav>
      <TaskList />
    </div>
  </div>
</template>

<script>
import TaskList from './TaskList.vue';
export default {
  name: 'PureInboxScreen',
  components: { TaskList },
  props: {
    error: { type: Boolean, default: false },
  },
};
</script>
```

Then, we can create a container, which again grabs the data for the `PureInboxScreen` in `src/components/InboxScreen.vue`:

```html:title=src/components/InboxScreen.vue
<template>
  <PureInboxScreen :error="isError" />
</template>

<script>
import PureInboxScreen from './PureInboxScreen.vue';

import { computed } from 'vue';

import { useTaskStore } from '../store';

export default {
  name: 'InboxScreen',
  components: { PureInboxScreen },
  setup() {
    //👇 Creates a store instance
    const store = useTaskStore();

    //👇 Retrieves the error from the store's state
    const isError = computed(() => store.status==='error');
    return {
      isError,
    };
  },
};
</script>
```

Next, we’ll need to update our app’s entry point (`src/main.js`) so that we can wire the store into our component hierarchy reasonably quick:

```diff:title=src/main.js
import { createApp } from 'vue';
+ import { createPinia } from 'pinia';

import App from './App.vue';

- createApp(App).mount('#app')
+ createApp(App).use(createPinia()).mount('#app');
```

We also need to change the `App` component to render the `InboxScreen` (eventually, we would use a router to choose the correct screen, but let's not worry about that here):

```html:title=src/App.vue
<script setup>
import InboxScreen from './components/InboxScreen.vue';
</script>

<template>
  <div id="app">
    <InboxScreen />
  </div>
</template>

<style>
@import './index.css';
</style>
```

However, where things get interesting is in rendering the story in Storybook.

As we saw previously, the `TaskList` component is a **container** that renders the `PureTaskList` presentational component. By definition, container components cannot be simply rendered in isolation; they expect to be passed some context or connected to a service. What this means is that to render a container in Storybook, we must mock (i.e., provide a pretend version) the context or service it requires.

When placing the `TaskList` into Storybook, we were able to dodge this issue by simply rendering the `PureTaskList` and avoiding the container. We'll do something similar and render the `PureInboxScreen` in Storybook also.

However, we have a problem with the `PureInboxScreen` because although the `PureInboxScreen` itself is presentational, its child, the `TaskList`, is not. In a sense, the `PureInboxScreen` has been polluted by “container-ness”. So when we set up our stories in `src/components/PureInboxScreen.stories.js`:

```js:title=src/components/PureInboxScreen.stories.js
import PureInboxScreen from './PureInboxScreen.vue';

export default {
  component: PureInboxScreen,
  title: 'PureInboxScreen',
  tags: ['autodocs'],
};

export const Default = {};

export const Error = {
  args: { error: true },
};

```

We see that although the `error` story works just fine, we have an issue in the `default` story because the `TaskList` has no Pinia store to connect to.

![Broken inbox](/intro-to-storybook/pure-inboxscreen-vue-pinia-tasks-issue.png)

One way to sidestep this problem is to never render container components anywhere in your app except at the highest level and instead pass all data requirements down the component hierarchy.

However, developers **will** inevitably need to render containers further down the component hierarchy. If we want to render most or all of the app in Storybook (we do!), we need a solution to this issue.

<div class="aside">
💡 As an aside, passing data down the hierarchy is a legitimate approach, especially when using <a href="http://graphql.org/">GraphQL</a>. It’s how we have built <a href="https://www.chromatic.com/?utm_source=storybook_website&utm_medium=link&utm_campaign=storybook">Chromatic</a> alongside 800+ stories.
</div>

## Supplying context to stories

The good news is that it is easy to connect Storybook to a Pinia store and reuse it across stories! We can
update our `.storybook/preview.js` configuration file and rely on Storybook's `setup` function to register our existing Pinia store:

```diff:title=.storybook/preview.js
+ import { setup } from '@storybook/vue3';

+ import { createPinia } from 'pinia';

import '../src/index.css';

//👇 Registers a global Pinia instance inside Storybook to be consumed by existing stories
+ setup((app) => {
+   app.use(createPinia());
+ });

/** @type { import('@storybook/vue3').Preview } */
const preview = {
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
  },
};

export default preview;
```

Similar approaches exist to provide mocked context for other data libraries, such as [Apollo](https://www.npmjs.com/package/apollo-storybook-decorator), [Relay](https://github.com/orta/react-storybooks-relay-container) and others.

Cycling through states in Storybook makes it easy to test we’ve done this correctly:

<video autoPlay muted playsInline loop >

  <source
    src="/intro-to-storybook/finished-pureinboxscreen-states-7-0.mp4"
    type="video/mp4"
  />
</video>

## Interaction tests

So far, we've been able to build a fully functional application from the ground up, starting from a simple component up to a screen and continuously testing each change using our stories. But each new story also requires a manual check on all the other stories to ensure the UI doesn't break. That's a lot of extra work.

Can't we automate this workflow and test our component interactions automatically?

### Write an interaction test using the play function

Storybook's [`play`](https://storybook.js.org/docs/vue/writing-stories/play-function) and [`@storybook/addon-interactions`](https://storybook.js.org/docs/vue/writing-tests/interaction-testing) help us with that. A play function includes small snippets of code that run after the story renders.

The play function helps us verify what happens to the UI when tasks are updated. It uses framework-agnostic DOM APIs, which means we can write stories with the play function to interact with the UI and simulate human behavior no matter the frontend framework.

The `@storybook/addon-interactions` helps us visualize our tests in Storybook, providing a step-by-step flow. It also offers a handy set of UI controls to pause, resume, rewind, and step through each interaction.

Let's see it in action! Update your newly created `PureInboxScreen` story, and set up component interactions by adding the following:

```diff:title=src/components/PureInboxScreen.stories.js
import PureInboxScreen from './PureInboxScreen.vue';

+ import { fireEvent, within } from '@storybook/test';

export default {
  component: PureInboxScreen,
  title: 'PureInboxScreen',
  tags: ['autodocs'],
};

export const Default = {};

export const Error = {
  args: { error: true },
};

+ export const WithInteractions = {
+  play: async ({ canvasElement }) => {
+    const canvas = within(canvasElement);
+    // Simulates pinning the first task
+    await fireEvent.click(canvas.getByLabelText('pinTask-1'));
+    // Simulates pinning the third task
+    await fireEvent.click(canvas.getByLabelText('pinTask-3'));
+  },
+ };
```

<div class="aside">

💡 The `@storybook/test` package replaces the `@storybook/jest` and `@storybook/testing-library` testing packages, offering a smaller bundle size and a more straightforward API based on the [Vitest](https://vitest.dev/) package.

</div>

Check your newly created story. Click the `Interactions` panel to see the list of interactions inside the story's play function.

<video autoPlay muted playsInline loop>
  <source
    src="/intro-to-storybook/storybook-pureinboxscreen-interactive-stories.mp4"
    type="video/mp4"
  />
</video>

### Automate tests with the test runner

With Storybook's play function, we were able to sidestep our problem, allowing us to interact with our UI and quickly check how it responds if we update our tasks—keeping the UI consistent at no extra manual effort.

But, if we take a closer look at our Storybook, we can see that it only runs the interaction tests when viewing the story. Therefore, we'd still have to go through each story to run all checks if we make a change. Couldn't we automate it?

The good news is that we can! Storybook's [test runner](https://storybook.js.org/docs/vue/writing-tests/test-runner) allows us to do just that. It's a standalone utility—powered by [Playwright](https://playwright.dev/)—that runs all our interactions tests and catches broken stories.

Let's see how it works! Run the following command to install it:

```shell
yarn add --dev @storybook/test-runner
```

Next, update your `package.json` `scripts` and add a new test task:

```json:clipboard=false
{
  "scripts": {
    "test-storybook": "test-storybook"
  }
}
```

Finally, with your Storybook running, open up a new terminal window and run the following command:

```shell
yarn test-storybook --watch
```

<div class="aside">
💡 Interaction testing with the play function is a fantastic way to test your UI components. It can do much more than we've seen here; we recommend reading the <a href="https://storybook.js.org/docs/vue/writing-tests/interaction-testing">official documentation</a> to learn more about it. 
<br />
For an even deeper dive into testing, check out the <a href="/ui-testing-handbook">Testing Handbook</a>. It covers testing strategies used by scaled-front-end teams to supercharge your development workflow.
</div>

![Storybook test runner successfully runs all tests](/intro-to-storybook/storybook-test-runner-execution.png)

Success! Now we have a tool that helps us verify whether all our stories are rendered without errors and all assertions pass automatically. What's more, if a test fails, it will provide us with a link that opens up the failing story in the browser.

## Component-Driven Development

We started from the bottom with `Task`, then progressed to `TaskList`, now we’re here with a whole screen UI. Our `InboxScreen` accommodates a nested container component and includes accompanying stories.

<video autoPlay muted playsInline loop style="width:480px; height:auto; margin: 0 auto;">
  <source
    src="/intro-to-storybook/component-driven-development-optimized.mp4"
    type="video/mp4"
  />
</video>

[**Component-Driven Development**](https://www.componentdriven.org/) allows you to gradually expand complexity as you move up the component hierarchy. Among the benefits are a more focused development process and increased coverage of all possible UI permutations. In short, CDD helps you build higher-quality and more complex user interfaces.

We’re not done yet - the job doesn't end when the UI is built. We also need to ensure that it remains durable over time.

<div class="aside">
💡 Don't forget to commit your changes with git!
</div>
