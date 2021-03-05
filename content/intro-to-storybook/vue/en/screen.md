---
title: 'Construct a screen'
tocTitle: 'Screens'
description: 'Construct a screen out of components'
commit: '99d3d65'
---

We've concentrated on building UIs from the bottom up; starting small and adding complexity. Doing so has allowed us to develop each component in isolation, figure out its data needs, and play with it in Storybook. All without needing to stand up a server or build out screens!

In this chapter we continue to increase the sophistication by combining components in a screen and developing that screen in Storybook.

## Nested container components

As our app is very simple, the screen we’ll build is pretty trivial, simply wrapping the `TaskList` container component (which supplies its own data via Vuex) in some layout and pulling a top-level `error` field out of the store (let's assume we'll set that field if we have some problem connecting to our server). Let's create a presentational `PureInboxScreen.vue` in your `src/components/` folder:

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
  import PureInboxScreen from './PureInboxScreen';
  import { mapState } from 'vuex';

  export default {
    name: 'InboxScreen',
    components: { PureInboxScreen },
    computed: mapState(['error']),
  };
</script>
```

We also change the `App` component to render the `InboxScreen` (eventually we would use a router to choose the correct screen, but let's not worry about that here):

```diff:title=src/App.vue
<template>
  <div id="app">
-   <task-list />
+   <InboxScreen />
  </div>
</template>

<script>
  import store from './store';
- import TaskList from './components/TaskList.vue';
+ import InboxScreen from './components/InboxScreen.vue';
  export default {
    name: 'app',
    store,
    components: {
-     TaskList
+     InboxScreen,
    },
  };
</script>

<style>
  @import './index.css';
</style>
```

However, where things get interesting is in rendering the story in Storybook.

As we saw previously, the `TaskList` component is a **container** that renders the `PureTaskList` presentational component. By definition container components cannot be simply rendered in isolation; they expect to be passed some context or to connect to a service. What this means is that to render a container in Storybook, we must mock (i.e. provide a pretend version) the context or service it requires.

When placing the `TaskList` into Storybook, we were able to dodge this issue by simply rendering the `PureTaskList` and avoiding the container. We'll do something similar and render the `PureInboxScreen` in Storybook also.

However, for the `PureInboxScreen` we have a problem because although the `PureInboxScreen` itself is presentational, its child, the `TaskList`, is not. In a sense the `PureInboxScreen` has been polluted by “container-ness”. So when we setup our stories in `src/components/PureInboxScreen.stories.js`:

```js:title=src/components/PureInboxScreen.stories.js
import PureInboxScreen from './PureInboxScreen.vue';

export default {
  title: 'PureInboxScreen',
  component: PureInboxScreen,
};

const Template = (args, { argTypes }) => ({
  components: { PureInboxScreen },
  props: Object.keys(argTypes),
  template: '<PureInboxScreen v-bind="$props" />',
});

export const Default = Template.bind({});

export const Error = Template.bind({});
Error.args = { error: true };
```

We see that although the `error` story works just fine, we have an issue in the `default` story, because the `TaskList` has no Vuex store to connect to. (You also would encounter similar problems when trying to test the `PureInboxScreen` with a unit test).

![Broken inbox](/intro-to-storybook/broken-inboxscreen-vue.png)

One way to sidestep this problem is to never render container components anywhere in your app except at the highest level and instead pass all data-requirements down the component hierarchy.

However, developers **will** inevitably need to render containers further down the component hierarchy. If we want to render most or all of the app in Storybook (we do!), we need a solution to this issue.

<div class="aside">
💡 As an aside, passing data down the hierarchy is a legitimate approach, especially when using <a href="http://graphql.org/">GraphQL</a>. It’s how we have built <a href="https://www.chromatic.com">Chromatic</a> alongside 800+ stories.
</div>

## Supplying context to stories

The good news is that it is easy to supply a Vuex store to the `PureInboxScreen` in a story! We can create a new store in our story file and pass it in as the context of the story:

```diff:title=src/components/PureInboxScreen.stories.js
+ import Vue from 'vue';
+ import Vuex from 'vuex';

import PureInboxScreen from './PureInboxScreen.vue';

+ import { action } from '@storybook/addon-actions';
+ import * as TaskListStories from './PureTaskList.stories';

+Vue.use(Vuex);

+ export const store = new Vuex.Store({
+  state: {
+    tasks: TaskListStories.Default.args.tasks,
+  },
+  actions: {
+    pinTask(context, id) {
+      action('pin-task')(id);
+    },
+    archiveTask(context, id) {
+      action('archive-task')(id);
+    },
+  },
+ });

export default {
  title: 'PureInboxScreen',
  component: PureInboxScreen,
  excludeStories: /.*store$/,
};

const Template = (args, { argTypes }) => ({
  components: { PureInboxScreen },
  props: Object.keys(argTypes),
  template: '<PureInboxScreen v-bind="$props" />',
  store,
});

export const Default = Template.bind({});

export const Error = Template.bind({});
Error.args = { error: true };
```

Similar approaches exist to provide mocked context for other data libraries, such as [Apollo](https://www.npmjs.com/package/apollo-storybook-decorator), [Relay](https://github.com/orta/react-storybooks-relay-container) and others.

Cycling through states in Storybook makes it easy to test we’ve done this correctly:

<video autoPlay muted playsInline loop >

  <source
    src="/intro-to-storybook/finished-inboxscreen-states.mp4"
    type="video/mp4"
  />
</video>

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
