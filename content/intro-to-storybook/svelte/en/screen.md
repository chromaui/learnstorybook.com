---
title: 'Construct a screen'
tocTitle: 'Screens'
description: 'Construct a screen out of components'
---

We've concentrated on building UIs from the bottom up; starting small and adding complexity. Doing so has allowed us to develop each component in isolation, figure out its data needs, and play with it in Storybook. All without needing to stand up a server or build out screens!

In this chapter we continue to increase the sophistication by combining components in a screen and developing that screen in Storybook.

## Nested container components

As our app is very simple, the screen we’ll build is pretty trivial, simply wrapping the `TaskList` component (which supplies its own data via Svelte Store) in some layout and pulling a top-level `error` field out of the store (let's assume we'll set that field if we have some problem connecting to our server). Create `InboxScreen.svelte` in your `components` folder:

```svelte:title=src/components/InboxScreen.svelte
<script>
  import TaskList from './TaskList.svelte';
  export let error = false;
</script>

<div>
  {#if error}
    <div class="page lists-show">
      <div class="wrapper-message">
        <span class="icon-face-sad" />
        <div class="title-message">Oh no!</div>
        <div class="subtitle-message">Something went wrong</div>
      </div>
    </div>
  {:else}
    <div class="page lists-show">
      <nav>
        <h1 class="title-page">
          <span class="title-wrapper">Taskbox</span>
        </h1>
      </nav>
      <TaskList />
    </div>
  {/if}
</div>
```

We need to update our store (in `src/store.js`) to include our new `error` field, transforming it into :

```diff:title=src/store.js
import { writable } from 'svelte/store';

const TaskBox = () => {
  // Creates a new writable store populated with some initial data
  const { subscribe, update } = writable([
    { id: '1', title: 'Something', state: 'TASK_INBOX' },
    { id: '2', title: 'Something more', state: 'TASK_INBOX' },
    { id: '3', title: 'Something else', state: 'TASK_INBOX' },
    { id: '4', title: 'Something again', state: 'TASK_INBOX' },
  ]);

  return {
    subscribe,
    // Method to archive a task, think of a action with redux or Vuex
    archiveTask: id =>
      update(tasks =>
        tasks.map(task => (task.id === id ? { ...task, state: 'TASK_ARCHIVED' } : task))
      ),
    // Method to archive a task, think of a action with redux or Vuex
    pinTask: id =>
      update(tasks =>
        tasks.map(task => (task.id === id ? { ...task, state: 'TASK_PINNED' } : task))
      ),
  };
};
export const taskStore = TaskBox();

+ // Store to handle the app state
+ const AppState = () => {
+  const { subscribe, update } = writable(false);
+  return {
+    subscribe,
+    error: () => update(error => !error),
+  };
+ };

+ export const AppStore = AppState();
```

We also change the `App` component to render the `InboxScreen` (eventually we would use a router to choose the correct screen, but let's not worry about that here):

```svelte:title=src/App.svelte
<script>
  import './index.css'
  import { AppStore } from './store';
  import InboxScreen from './components/InboxScreen.svelte';
</script>

<InboxScreen error="{$AppStore}" />
```

<div class="aside">
💡 Don't forget to update the <code>TaskList</code> component and your unit tests to reflect the changes that were introduced.
</div>

However, where things get interesting is in rendering the story in Storybook.

As we saw previously, the `TaskList` component is a **container** that renders the `PureTaskList` presentational component. By definition with other frameworks, container components cannot be simply rendered in isolation; they expect to be passed some context or to connect to a service.

When placing the `TaskList` into Storybook, we were able to illustrate this issue by simply rendering the `PureTaskList` and avoiding the container. We'll do something similar and render the `PureInboxScreen` in Storybook also.

So when we setup our stories in `InboxScreen.stories.js`:

```js:title=src/components/InboxScreen.stories.js
import InboxScreen from './InboxScreen.svelte';

export default {
  component: InboxScreen,
  title: 'PureInboxScreen',
};

const Template = args => ({
  Component: InboxScreen,
  props: args,
});

export const Default = Template.bind({});

export const Error = Template.bind({});
Error.args = {
  error: true,
};
```

We see that both the `error` and `standard` stories work just fine. (But you will encounter some problems when trying to test the `PureInboxScreen` with a unit test if no data is supplied like we did with `TaskList`).

<div class="aside">
💡 As an aside, passing data down the hierarchy is a legitimate approach, especially when using <a href="http://graphql.org/">GraphQL</a>. It’s how we have built <a href="https://www.chromatic.com">Chromatic</a> alongside 800+ stories.
</div>

Cycling through states in Storybook makes it easy to test we’ve done this correctly:

<video autoPlay muted playsInline loop >

  <source
    src="/intro-to-storybook/finished-inboxscreen-states-6-0.mp4"
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
