---
title: 'Wire in data'
tocTitle: 'Data'
description: 'Learn how to wire in data to your UI component'
---

So far, we have created isolated stateless components-–great for Storybook, but ultimately not helpful until we give them some data in our app.

This tutorial doesn’t focus on the particulars of building an app, so we won’t dig into those details here. But we will take a moment to look at a common pattern for wiring in data with container components.

## Container components

Our `TaskList` component as currently written is “presentational” in that it doesn’t talk to anything external to its own implementation. To get data into it, we need a “container”.

This example uses [Svelte's Stores](https://svelte.dev/docs/svelte-store), Svelte's default data management API, to build a simple data model for our app. However, the pattern used here applies just as well to other data management libraries like [Apollo](https://www.apollographql.com/client/) and [MobX](https://mobx.js.org/).

First, we’ll construct a simple Svelte store that responds to actions that change the state of tasks in a file called `store.js` in the `src` directory (intentionally kept simple):

```js:title=src/store.js
// A simple Svelte store implementation with update methods and initial data.
// A true app would be more complex and separated into different files.

import { writable } from 'svelte/store';
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
  };
};
export const taskStore = TaskBox();
```

Then we'll update our `TaskList` to read data out of the store. First, let's move our existing presentational version to the file `src/components/PureTaskList.svelte` and wrap it with a container.

In `src/components/PureTaskList.svelte`:

```html:title=src/components/PureTaskList.svelte
<!--This file moved from TaskList.svelte-->
<script>
  import Task from './Task.svelte';
  import LoadingRow from './LoadingRow.svelte';

  /* Sets the loading state */
  export let loading = false;

  /* Defines a list of tasks */
  export let tasks = [];

  /* Reactive declaration (computed prop in other frameworks) */
  $: noTasks = tasks.length === 0;
  $: emptyTasks = noTasks && !loading;
  $: tasksInOrder = [
    ...tasks.filter((t) => t.state === 'TASK_PINNED'),
    ...tasks.filter((t) => t.state !== 'TASK_PINNED'),
  ];
</script>

{#if loading}
  <div class="list-items">
    <LoadingRow />
    <LoadingRow />
    <LoadingRow />
    <LoadingRow />
    <LoadingRow />
  </div>
{/if}
{#if emptyTasks}
  <div class="list-items">
    <div class="wrapper-message">
      <span class="icon-check" />
      <p class="title-message">You have no tasks</p>
      <p class="subtitle-message">Sit back and relax</p>
    </div>
  </div>
{/if}
{#each tasksInOrder as task}
  <Task {task} on:onPinTask on:onArchiveTask />
{/each}
```

In `src/components/TaskList.svelte`:

```html:title=src/components/TaskList.svelte
<script>
  import PureTaskList from './PureTaskList.svelte';
  import { taskStore } from '../store';

  function onPinTask(event) {
    taskStore.pinTask(event.detail.id);
  }
  function onArchiveTask(event) {
    taskStore.archiveTask(event.detail.id);
  }
</script>

<PureTaskList
  tasks={$taskStore.tasks}
  on:onPinTask={onPinTask}
  on:onArchiveTask={onArchiveTask}
/>
```

The reason to keep the presentational version of the `TaskList` separate is that it is easier to test and isolate. As it doesn't rely on the presence of a store, it is much easier to deal with from a testing perspective. Let's rename `src/components/TaskList.stories.js` into `src/components/PureTaskList.stories.js` and ensure our stories use the presentational version:

```js:title=src/components/PureTaskList.stories.js
import PureTaskList from './PureTaskList.svelte';
import MarginDecorator from './MarginDecorator.svelte';

import * as TaskStories from './Task.stories';

export default {
  component: PureTaskList,
  title: 'PureTaskList',
  tags: ['autodocs'],
  //👇 The auxiliary component will be added as a decorator to help show the UI correctly
  decorators: [() => MarginDecorator],
  render: (args) => ({
    Component: PureTaskList,
    props: args,
    on: {
      ...TaskStories.actionsData,
    },
  }),
};

export const Default = {
  args: {
    // Shaping the stories through args composition.
    // The data was inherited from the Default story in task.stories.js.
    tasks: [
      { ...TaskStories.Default.args.task, id: '1', title: 'Task 1' },
      { ...TaskStories.Default.args.task, id: '2', title: 'Task 2' },
      { ...TaskStories.Default.args.task, id: '3', title: 'Task 3' },
      { ...TaskStories.Default.args.task, id: '4', title: 'Task 4' },
      { ...TaskStories.Default.args.task, id: '5', title: 'Task 5' },
      { ...TaskStories.Default.args.task, id: '6', title: 'Task 6' },
    ],
  },
};

export const WithPinnedTasks = {
  args: {
    // Shaping the stories through args composition.
    // Inherited data coming from the Default story.
    tasks: [
      ...Default.args.tasks.slice(0, 5),
      { id: '6', title: 'Task 6 (pinned)', state: 'TASK_PINNED' },
    ],
  },
};

export const Loading = {
  args: {
    tasks: [],
    loading: true,
  },
};

export const Empty = {
  args: {
    // Shaping the stories through args composition.
    // Inherited data coming from the Loading story.
    ...Loading.args,
    loading: false,
  },
};
```

<video autoPlay muted playsInline loop>
  <source
    src="/intro-to-storybook/finished-puretasklist-states-7-0.mp4"
    type="video/mp4"
  />
</video>

<div class="aside">
💡 Don't forget to commit your changes with git!
</div>

Now that we have some actual data populating our component, obtained from the Svelte store, we could have wired it to `src/App.svelte` and render the component there. Don't worry about it. We'll take care of it in the next chapter.
