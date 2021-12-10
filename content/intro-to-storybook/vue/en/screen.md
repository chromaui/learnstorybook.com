---
title: 'Construct a screen'
tocTitle: 'Screens'
description: 'Construct a screen out of components'
commit: '0450cb2'
---

We've concentrated on building UIs from the bottom up, starting small and adding complexity. Doing so has allowed us to develop each component in isolation, figure out its data needs, and play with it in Storybook. All without needing to stand up a server or build out screens!

In this chapter, we continue to increase the sophistication by combining components in a screen and developing that screen in Storybook.

## Nested container components

As our app is straightforward, the screen we’ll build is pretty trivial, simply wrapping the `TaskList` component (which supplies its own data via Redux) in some layout and pulling a top-level `error` field out of the store (let's assume we'll set that field if we have some problem connecting to our server). Let's create a presentational `PureInboxScreen.vue` in your `src/components/` folder:

```html:title=src/components/PureInboxScreen.vue
<template>
  <div>
    <div v-if="error" class="page lists-show">
      <div class="wrapper-message">
        <span class="icon-face-sad" />
        <div class="title-message">Oh no!</div>
        <div class="subtitle-message">Something went wrong</div>
      </div>
    </div>
    <div v-else class="page lists-show">
      <nav>
        <h1 class="title-page">
          <span class="title-wrapper">Taskbox</span>
        </h1>
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
  <PureInboxScreen :error="error" />
</template>

<script>
  import { computed } from 'vue';

  import { useStore } from 'vuex';

  import PureInboxScreen from './PureInboxScreen';

  export default {
    name: 'InboxScreen',
    components: { PureInboxScreen },
    setup() {
      //👇 Creates a store instance
      const store = useStore();

      //👇 Retrieves the error from the store's state
      const error = computed(() => store.state.error);
      return {
        error,
      };
    },
  };
</script>
```

Next, we’ll need to update our app’s entry point (`src/main.js`) so that we can wire the store into our component hierarchy reasonably quick:

```diff:title=src/main.js
import { createApp } from 'vue';

import App from './App.vue';

+ import store from './store';

- createApp(App).mount('#app')
+ createApp(App).use(store).mount('#app')
```

We also need to change the `App` component to render the `InboxScreen` (eventually, we would use a router to choose the correct screen, but let's not worry about that here):

```diff:title=src/App.vue
<template>
  <div id="app">
-   <img alt="Vue logo" src="./assets/logo.png">
-   <HelloWorld msg="Welcome to Your Vue.js App"/>
+   <InboxScreen />
  </div>
</template>

<script>
- import HelloWorld from './components/HelloWorld.vue'
+ import InboxScreen from './components/InboxScreen.vue';

export default {
  name: 'App',
  components: {
-   HelloWorld
+   InboxScreen
  }
}
</script>

<style>
@import "./index.css";
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
};

const Template = args => ({
  components: { PureInboxScreen },
  setup() {
    return {
      args,
    };
  },
  template: '<PureInboxScreen v-bind="args" />',
});

export const Default = Template.bind({});

export const Error = Template.bind({});
Error.args = { error: true };
```

We see that although the `error` story works just fine, we have an issue in the `default` story because the `TaskList` has no Vuex store to connect to. (You also would encounter similar problems when trying to test the `PureInboxScreen` with a unit test).

![Broken inbox](/intro-to-storybook/broken-inboxscreen-vue.png)

One way to sidestep this problem is to never render container components anywhere in your app except at the highest level and instead pass all data requirements down the component hierarchy.

However, developers **will** inevitably need to render containers further down the component hierarchy. If we want to render most or all of the app in Storybook (we do!), we need a solution to this issue.

<div class="aside">
💡 As an aside, passing data down the hierarchy is a legitimate approach, especially when using <a href="http://graphql.org/">GraphQL</a>. It’s how we have built <a href="https://www.chromatic.com">Chromatic</a> alongside 800+ stories.
</div>

## Supplying context to stories

The good news is that it is easy to supply a Vuex store to the `PureInboxScreen` in a story! We can just use a mocked version of the Vuex store provided in a decorator:

```diff:title=src/components/PureInboxScreen.stories.js
+ import { app } from '@storybook/vue3';

+ import { createStore } from 'vuex';

import PureInboxScreen from './PureInboxScreen.vue';

+ import { action } from '@storybook/addon-actions';
+ import * as TaskListStories from './PureTaskList.stories';

+ const store = createStore({
+   state: {
+     tasks: TaskListStories.Default.args.tasks,
+   },
+   actions: {
+     pinTask(context, id) {
+       action("pin-task")(id);
+     },
+     archiveTask(context, id) {
+       action("archive-task")(id);
+     },
+   },
+ });

+ app.use(store);

export default {
  title: 'PureInboxScreen',
  component: PureInboxScreen,
};

const Template = (args) => ({
  components: { PureInboxScreen },
  setup() {
    return {
      args,
    };
  },
  template: '<PureInboxScreen v-bind="args" />',
});

export const Default = Template.bind({});

export const Error = Template.bind({});
Error.args = { error: true };
```

Similar approaches exist to provide mocked context for other data libraries, such as [Apollo](https://www.npmjs.com/package/apollo-storybook-decorator), [Relay](https://github.com/orta/react-storybooks-relay-container) and others.

Cycling through states in Storybook makes it easy to test we’ve done this correctly:

<video autoPlay muted playsInline loop >

  <source
    src="/intro-to-storybook/finished-inboxscreen-states-6-0.mp4"
    type="video/mp4"
  />
</video>

## Interactive stories

So far, we've been able to build a fully functional application from the ground up, starting from a simple component up to a screen and continuously testing each change using our stories. But each new story also requires a manual check on all the other stories to ensure the UI doesn't break. That's a lot of extra work.

Can't we automate this workflow and interact with our components automatically?

Storybook's [`play`](https://storybook.js.org/docs/vue/writing-stories/play-function) function allows us to do just that. A play function includes small snippets of code that are run after the story renders.

The play function helps us verify what happens to the UI when tasks are updated. It uses framework-agnostic DOM APIs, that means we can write stories with the play function to interact with the UI and simulate human behavior no matter the frontend framework.

Let's see it in action! Update your newly created `PureInboxScreen` story, and set up component interactions by adding the following:

```diff:title=src/components/PureInboxScreen.stories.js
import { app } from '@storybook/vue3';

+ import { fireEvent, within } from '@storybook/testing-library';

import { createStore } from 'vuex';

import PureInboxScreen from './PureInboxScreen.vue';

import { action } from '@storybook/addon-actions';
import * as TaskListStories from './PureTaskList.stories';

const store = createStore({
  state: {
    tasks: TaskListStories.Default.args.tasks,
  },
  actions: {
    pinTask(context, id) {
      action("pin-task")(id);
    },
    archiveTask(context, id) {
      action("archive-task")(id);
    },
  },
});

app.use(store);

export default {
  title: 'PureInboxScreen',
  component: PureInboxScreen,
};

const Template = (args) => ({
  components: { PureInboxScreen },
  setup() {
    return {
      args,
    };
  },
  template: '<PureInboxScreen v-bind="args" />',
});

export const Default = Template.bind({});

export const Error = Template.bind({});
Error.args = { error: true };

+ export const WithInteractions = Template.bind({});
+ WithInteractions.play = async ({ canvasElement }) => {
+   const canvas = within(canvasElement);
+   // Simulates pinning the first task
+   await fireEvent.click(canvas.getByLabelText("pinTask-1"));
+   // Simulates pinning the third task
+   await fireEvent.click(canvas.getByLabelText("pinTask-3"));
+ };
```

Check your newly created story. Click the `Interactions` panel to see the list of interactions inside the story's play function.

<video autoPlay muted playsInline loop>

  <source
    src="/intro-to-storybook/storybook-interactive-stories-play-function.mp4"
    type="video/mp4"
  />
</video>

The play function allows us to interact with our UI and quickly check how it responds if we update our tasks. That keeps the UI consistent at no extra manual effort. All without needing to spin up a testing environment or add additional packages.

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
