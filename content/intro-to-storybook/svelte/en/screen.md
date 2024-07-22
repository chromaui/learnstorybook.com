---
title: 'Construct a screen'
tocTitle: 'Screens'
description: 'Construct a screen out of components'
---

We've concentrated on building UIs from the bottom up, starting small and adding complexity. Doing so has allowed us to develop each component in isolation, figure out its data needs, and play with it in Storybook. All without needing to stand up a server or build out screens!

In this chapter, we continue to increase the sophistication by combining components in a screen and developing that screen in Storybook.

## Nested container components

As our app is straightforward, the screen we’ll build is pretty trivial, simply wrapping the `TaskList` component (which supplies its own data via Svelte Store) in some layout and pulling a top-level `error` field out of the store (let's assume we'll set that field if we have some problem connecting to our server).

Let's start by updating our Svelte store (in `src/store.js`) to include our new `error` field we want:

```diff:title=src/store.js
// A simple Svelte store implementation with update methods and initial data.
// A true app would be more complex and separated into different files.

import { writable } from "svelte/store";

/*
 * The initial state of our store when the app loads.
 * Usually, you would fetch this from a server. Let's not worry about that now
 */
const defaultTasks = [
  { id: '1', title: 'Something', state: 'TASK_INBOX' },
  { id: '2', title: 'Something more', state: 'TASK_INBOX' },
  { id: '3', title: 'Something else', state: 'TASK_INBOX' },
  { id: '4', title: 'Something again', state: 'TASK_INBOX' },
];

const TaskBox = () => {
  // Creates a new writable store populated with some initial data
  const { subscribe, update } = writable({
    tasks: defaultTasks,
    status: 'idle',
    error: false,
  });
  return {
    subscribe,
    // Method to archive a task, think of a action with redux or Pinia
    archiveTask: (id) =>
      update((store) => {
        const filteredTasks = store.tasks
          .map((task) =>
            task.id === id ? { ...task, state: 'TASK_ARCHIVED' } : task
          )
          .filter((t) => t.state === 'TASK_INBOX' || t.state === 'TASK_PINNED');

        return { ...store, tasks: filteredTasks };
      }),
    // Method to archive a task, think of a action with redux or Pinia
    pinTask: (id) => {
      update((store) => {
        const task = store.tasks.find((t) => t.id === id);
        if (task) {
          task.state = 'TASK_PINNED';
        }
        return store;
      });
    },
+   isError: () => update((store) => ({ ...store, error: true })),
  };
};
export const taskStore = TaskBox();
```

Now that we have the store updated with the new field. Let's create `InboxScreen.svelte` in your `components` directory:

```html:title=src/components/InboxScreen.svelte
<script>
  import TaskList from "./TaskList.svelte";
  export let error = false;
</script>

<div>
  {#if error}
    <div class="page lists-show">
      <div class="wrapper-message">
        <span class="icon-face-sad" />
        <p class="title-message">Oh no!</p>
        <p class="subtitle-message">Something went wrong</p>
      </div>
    </div>
  {:else}
    <div class="page lists-show">
      <nav>
        <h1 class="title-page">Taskbox</h1>
      </nav>
      <TaskList />
    </div>
  {/if}
</div>
```

We also need to change the `App` component to render the `InboxScreen` (eventually, we would use a router to choose the correct screen, but let's not worry about that here):

```html:title=src/App.svelte
<script>
  import InboxScreen from './components/InboxScreen.svelte';
  import { taskStore } from './store';
</script>

<InboxScreen error={$taskStore.error} />
```

And finally, the `src/main.js`:

```diff:title=src/main.js
- import './app.css';
+ import './index.css';
import App from './App.svelte';

const app = new App({
  target: document.getElementById("app"),
});

export default app;
```

However, where things get interesting is in rendering the story in Storybook.

As we saw previously, the `TaskList` component is a **container** that renders the `PureTaskList` presentational component. By definition, container components cannot be simply rendered in isolation; they expect to be passed some context or connected to a service. What this means is that to render a container in Storybook, we must mock (i.e., provide a pretend version) the context or service it requires.

When placing the `TaskList` into Storybook, we were able to dodge this issue by simply rendering the `PureTaskList` and avoiding the container. We'll do something similar and render the `InboxScreen` in Storybook also.

So when we set up our stories in `InboxScreen.stories.js`:

```js:title=src/components/InboxScreen.stories.js
import InboxScreen from './InboxScreen.svelte';

export default {
  component: InboxScreen,
  title: 'InboxScreen',
  tags: ['autodocs'],
};

export const Default = {};

export const Error = {
  args: { error: true },
};
```

We see that both the `Error` and `Default` stories work just fine.

<div class="aside">

💡 As an aside, passing data down the hierarchy is a legitimate approach, especially when using [GraphQL](http://graphql.org/). It’s how we have built [Chromatic](https://www.chromatic.com/?utm_source=storybook_website&utm_medium=link&utm_campaign=storybook) alongside 800+ stories.

</div>

Cycling through states in Storybook makes it easy to test we’ve done this correctly:

<video autoPlay muted playsInline loop >
  <source
    src="/intro-to-storybook/finished-inbox-screen-states-svelte-7-0.mp4"
    type="video/mp4"
  />
</video>

## Interaction tests

So far, we've been able to build a fully functional application from the ground up, starting from a simple component up to a screen and continuously testing each change using our stories. But each new story also requires a manual check on all the other stories to ensure the UI doesn't break. That's a lot of extra work.

Can't we automate this workflow and test our component interactions automatically?

### Write an interaction test using the play function

Storybook's [`play`](https://storybook.js.org/docs/writing-stories/play-function) and [`@storybook/addon-interactions`](https://storybook.js.org/docs/writing-tests/interaction-testing) help us with that. A play function includes small snippets of code that run after the story renders.

The play function helps us verify what happens to the UI when tasks are updated. It uses framework-agnostic DOM APIs, which means we can write stories with the play function to interact with the UI and simulate human behavior no matter the frontend framework.

The `@storybook/addon-interactions` helps us visualize our tests in Storybook, providing a step-by-step flow. It also offers a handy set of UI controls to pause, resume, rewind, and step through each interaction.

Let's see it in action! Update your newly created `InboxScreen` story, and set up component interactions by adding the following:

```diff:title=src/components/InboxScreen.stories.js
import InboxScreen from './InboxScreen.svelte';

+ import { fireEvent, within } from '@storybook/test';

export default {
  component: InboxScreen,
  title: 'InboxScreen',
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
    src="/intro-to-storybook/storybook-interactive-stories-play-function-svelte.mp4"
    type="video/mp4"
  />
</video>

### Automate tests with the test runner

With Storybook's play function, we were able to sidestep our problem, allowing us to interact with our UI and quickly check how it responds if we update our tasks—keeping the UI consistent at no extra manual effort.

But, if we take a closer look at our Storybook, we can see that it only runs the interaction tests when viewing the story. Therefore, we'd still have to go through each story to run all checks if we make a change. Couldn't we automate it?

The good news is that we can! Storybook's [test runner](https://storybook.js.org/docs/writing-tests/test-runner) allows us to do just that. It's a standalone utility—powered by [Playwright](https://playwright.dev/)—that runs all our interactions tests and catches broken stories.

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

💡 Interaction testing with the play function is a fantastic way to test your UI components. It can do much more than we've seen here; we recommend reading the [official documentation](https://storybook.js.org/docs/writing-tests/interaction-testing) to learn more about it.

For an even deeper dive into testing, check out the [Testing Handbook](/ui-testing-handbook). It covers testing strategies used by scaled-front-end teams to supercharge your development workflow.

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
