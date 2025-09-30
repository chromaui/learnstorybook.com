---
title: 'Construct a screen'
tocTitle: 'Screens'
description: 'Construct a screen out of components'
---

We've concentrated on building UIs from the bottom up, starting small and adding complexity. Doing so has allowed us to develop each component in isolation, figure out its data needs, and play with it in Storybook. All without needing to stand up a server or build out screens!

In this chapter, we continue to increase the sophistication by combining components in a screen and developing that screen in Storybook.

## Connected pages

As our application is straightforward, the screen we'll build is pretty trivial. It simply fetches data from a remote API, wraps the `TaskList` component (which supplies its own data via a custom store using the `$state` rune) in some layout, and pulls a top-level `error` field out of the store (let's assume we'll set that field if we have some problem connecting to our server).

We'll start by updating our store (in `src/lib/state/store.svelte.ts`) to connect to a remote API and handle the various states for our application (i.e., `error`, `succeeded`):

```ts:title=src/lib/state/store.svelte.ts
// A simple Svelte state management implementation using runes update methods and initial data.
// A true app would be more complex and separated into different files.
import type { TaskData } from '../../types';

interface TaskBoxState {
  tasks: TaskData[];
  status: 'idle' | 'loading' | 'failed' | 'succeeded';
  error: string | null;
}

const initialState: TaskBoxState = {
  tasks: [],
  status: 'idle',
  error: null,
};


export const store: TaskBoxState = $state(initialState);

// Function that fetches tasks from the API to populate the store
export async function fetchTasks() {
  store.status = 'loading';
  try {
    const response = await fetch('https://jsonplaceholder.typicode.com/todos?userId=1');
    const data = await response.json();
    // Transform the data to match the TaskData type
    const result = data.map(
      (task: { id: number; title: string; completed: boolean }) => ({
        id: `${task.id}`,
        title: task.title,
        state: task.completed ? 'TASK_ARCHIVED' : 'TASK_INBOX',
      })
    ).filter(
      (task: TaskData) => task.state === 'TASK_INBOX' || task.state === 'TASK_PINNED');


    store.tasks = result;
    store.status = 'succeeded';
  } catch (error) {
    if (error && typeof error === 'object' && 'message' in error) {
      store.error = (error as { message: string }).message;
    } else {
      store.error = String(error);
    }
    store.status = 'failed';
  }
}

// Function that archives a task
export function archiveTask(id: string) {
  const filteredTasks = store.tasks
    .map((task): TaskData =>
      task.id === id ? { ...task, state: 'TASK_ARCHIVED' as TaskData['state'] } : task
    )
    .filter((t) => t.state === 'TASK_INBOX' || t.state === 'TASK_PINNED');
  store.tasks = filteredTasks;
}

// Function that pins a task
export function pinTask(id: string) {
  const task = store.tasks.find((task) => task.id === id);
  if (task) {
    task.state = "TASK_PINNED";
  }
}
```

Now that we've updated our store to retrieve the data from a remote API endpoint and prepared it to handle the various states of our app, let's create our `InboxScreen.svelte` in the `src/lib/components` directory:

```html:title=src/lib/components/InboxScreen.svelte
<script lang="ts">
  import TaskList from './TaskList.svelte';

  import { fetchTasks, store } from '../state/store.svelte';

  $effect(() => {
    fetchTasks();
  });
</script>

{#if store.status === "failed"}
  <div class="page lists-show">
    <div class="wrapper-message">
      <span class="icon-face-sad"></span>
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
```

We also need to change the `App` component to render the `InboxScreen` (eventually, we would use a router to choose the correct screen, but let's not worry about that here):

```html:title=src/App.svelte
<script lang="ts">
  import InboxScreen from "./lib/components/InboxScreen.svelte";
</script>

<InboxScreen />
```

And finally, the `src/main.ts`:

```diff:title=src/main.ts
import { mount } from 'svelte';

- import './app.css';
+ import './index.css';

import App from './App.svelte';

const app = mount(App, {
  target: document.getElementById('app')!,
});

export default app;
```

However, where things get interesting is in rendering the story in Storybook.

As we saw previously, the `TaskList` component is a **container** that renders the `PureTaskList` presentational component. By definition, container components cannot be rendered in isolation; they expect to be passed some context or connected to a service. What this means is that to render a container in Storybook, we must mock the context or service it requires.

When placing the `TaskList` into Storybook, we were able to dodge this issue by simply rendering the `PureTaskList` and avoiding the container. However, as our application grows, it quickly becomes unmanageable to keep the connected components out of Storybook and create presentational components for each. As our `InboxScreen` is a connected component, we'll need to provide a way to mock the store and the data it provides.

So when we set up our stories in `InboxScreen.stories.svelte`:

```html:title=src/lib/components/InboxScreen.stories.svelte
<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf';

  import InboxScreen from './InboxScreen.svelte';

  const { Story } = defineMeta({
    component: InboxScreen,
    title: 'InboxScreen',
    tags: ['autodocs'],
  });
</script>

<Story name="Default" />

<Story name="Error" />

```

We can quickly spot an issue with the `Error` story. Instead of displaying the right state, it shows a list of tasks. We could easily apply the same approach as in the last chapter. Instead, we'll use a well-known API mocking library alongside a Storybook addon to help us solve this issue.

<!-- TODO:
  - Follow up with Design to get an updated image for both permutations
    - Non-react version that shows the same structure as below
    - React version that showcases Task, TaskList, and InboxScreen
-->

![Broken inbox screen state](/intro-to-storybook/broken-inbox-error-state-9-0-non-react.png)

## Mocking API services

As our application is pretty straightforward and doesn't depend too much on remote API calls, we're going to use [Mock Service Worker](https://mswjs.io/) and [Storybook's MSW addon](https://storybook.js.org/addons/msw-storybook-addon). Mock Service Worker is an API mocking library. It relies on service workers to capture network requests and provides mocked data in responses.

When we set up our app in the [Get started section](/intro-to-storybook/svelte/en/get-started) both packages were also installed. All that remains is to configure them and update our stories to use them.

In your terminal, run the following command to generate a generic service worker inside your `public` folder:

```shell
yarn init-msw
```

Then, we'll need to update our `.storybook/preview.ts` and initialize them:

```diff:title=.storybook/preview.ts
import type { Preview } from '@storybook/svelte-vite';

import '../src/index.css';

+ import { initialize, mswLoader } from 'msw-storybook-addon';

// Registers the msw addon
+ initialize();

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
+ loaders: [mswLoader],
};

export default preview;
```

Finally, update the `InboxScreen` stories and include a [parameter](https://storybook.js.org/docs/writing-stories/parameters) that mocks the remote API calls:

```diff:title=src/lib/components/InboxScreen.stories.svelte
<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf';

+ import { http, HttpResponse } from 'msw';

  import InboxScreen from './InboxScreen.svelte';

  import * as PureTaskListStories from './PureTaskList.stories.svelte';

  const { Story } = defineMeta({
    component: InboxScreen,
    title: 'InboxScreen',
    tags: ['autodocs'],
  });
</script>

<Story
  name="Default"
+   parameters={{
+     msw: {
+       handlers: [
+         http.get('https://jsonplaceholder.typicode.com/todos?userId=1', () => {
+           return HttpResponse.json(PureTaskListStories.TaskListData);
+         }),
+       ],
+     },
+   }}
/>

<Story
  name="Error"
+  parameters={{
+     msw: {
+       handlers: [
+         http.get('https://jsonplaceholder.typicode.com/todos?userId=1', () => {
+           return new HttpResponse(null, {
+             status: 403,
          });
+         }),
+       ],
+     },
+   }}
/>
```

<div class="aside">

💡 As an aside, passing data down the hierarchy is a legitimate approach, especially when using [GraphQL](http://graphql.org/). It’s how we have built [Chromatic](https://www.chromatic.com/?utm_source=storybook_website&utm_medium=link&utm_campaign=storybook) alongside 800+ stories.

</div>

Check your Storybook, and you'll see that the `Error` story is now working as intended. MSW intercepted our remote API call and provided the appropriate response.

<video autoPlay muted playsInline loop >
  <source
    src="/intro-to-storybook/inbox-screen-with-msw-addon-non-react-9.0.mp4"
    type="video/mp4"
  />
</video>

## Interaction tests

So far, we've been able to build a fully functional application from the ground up, starting from a simple component up to a screen and continuously testing each change using our stories. But each new story also requires a manual check on all the other stories to ensure the UI doesn't break. That's a lot of extra work.

Can't we automate this workflow and test our component interactions automatically?

### Write an interaction test using the play function

Storybook's [`play`](https://storybook.js.org/docs/writing-stories/play-function) can help us with that. A play function includes small snippets of code that run after the story renders. It uses framework-agnostic DOM APIs, meaning we can write stories with the play function to interact with the UI and simulate human behavior, regardless of the frontend framework. We'll use them to verify that the UI behaves as expected when we update our tasks.

Update your newly created `InboxScreen` story, and set up component interactions by adding the following:

```diff:title=src/lib/components/InboxScreen.stories.svelte
<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf';

  import { http, HttpResponse } from 'msw';

+ import { waitFor, waitForElementToBeRemoved } from 'storybook/test';

  import InboxScreen from './InboxScreen.svelte';

  import * as PureTaskListStories from './PureTaskList.stories.svelte';

  const { Story } = defineMeta({
    component: InboxScreen,
    title: 'InboxScreen',
    tags: ['autodocs'],
  });
</script>

<Story
  name="Default"
  parameters={{
    msw: {
      handlers: [
        http.get('https://jsonplaceholder.typicode.com/todos?userId=1', () => {
          return HttpResponse.json(PureTaskListStories.TaskListData);
        }),
      ],
    },
  }}
+ play={async ({ canvas, userEvent }) => {
+   await waitForElementToBeRemoved(await canvas.findByTestId("loading"));
+   await waitFor(async () => {
+     await userEvent.click(canvas.getByLabelText("pinTask-1"));
+     await userEvent.click(canvas.getByLabelText("pinTask-3"));
+   });
+ }}
/>

<Story
  name="Error"
  parameters={{
    msw: {
      handlers: [
        http.get('https://jsonplaceholder.typicode.com/todos?userId=1', () => {
          return new HttpResponse(null, {
            status: 403,
          });
        }),
      ],
    },
  }}
/>
```

<div class="aside">

💡 The `Interactions` panel helps us visualize our tests in Storybook, providing a step-by-step flow. It also offers a handy set of UI controls to pause, resume, rewind, and step through each interaction.

</div>

Check the `Default` story. Click the `Interactions` panel to see the list of interactions inside the story's play function.

<video autoPlay muted playsInline loop>
  <source
    src="/intro-to-storybook/storybook-play-function-non-react.mp4"
    type="video/mp4"
  />
</video>

### Automate test with the Vitest addon

With the play function, we were able to quickly simulate user interactions with our component and verify how it behaves when we update our tasks—keeping the UI consistent. However, if we look into our Storybook, we can see that our interaction tests only run when viewing the story. This means that if we make a change, we still have to go through each story to run all checks manually. Couldn't we automate it?

We can! Storybook's [Vitest addon](https://storybook.js.org/docs/writing-tests/integrations/vitest-addon) allows us to run our interaction tests in a more automated way, leveraging the power of Vitest for a faster and more efficient testing experience. Let's see how it works!

With your Storybook running, click the "Run Tests" in the sidebar. This will run tests on our stories, how they render, their behavior, and the interactions defined in the play function, including the one we just added to the `InboxScreen` story.

<video autoPlay muted playsInline loop>
  <source
    src="/intro-to-storybook/storybook-vitest-addon-non-react.mp4"
    type="video/mp4"
  />
</video>

<div class="aside">

💡 The Vitest addon can do much more than we've seen here, including other types of testing. We recommend reading the [official documentation](https://storybook.js.org/docs/writing-tests/integrations/vitest-addon) to learn more about it.

</div>

Now, we have a tool that helps us automate our UI testing without the need for manual checks. This is a great way to ensure that our UI remains consistent and functional as we continue to build out our application. What's more, if our tests fail, we'll be notified immediately, allowing us to fix any outstanding issues quickly and easily.

## Component-Driven Development

We started from the bottom with `Task`, then progressed to `TaskList`, now we’re here with a whole screen UI. Our `InboxScreen` accommodates connected components and includes accompanying stories.

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
