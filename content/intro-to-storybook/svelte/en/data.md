---
title: 'Wire in data'
tocTitle: 'Data'
description: 'Learn how to wire in data to your UI component'
---

So far we created isolated stateless components –great for Storybook, but ultimately not useful until we give them some data in our app.

This tutorial doesn’t focus on the particulars of building an app so we won’t dig into those details here. But we will take a moment to look at a common pattern for wiring in data with container components.

## Container components

Our `TaskList` component as currently written is “presentational” (see [this blog post](https://medium.com/@dan_abramov/smart-and-dumb-components-7ca2f9a7c7d0)) in that it doesn’t talk to anything external to its own implementation. To get data into it, we need a “container”.

This example uses [Svelte's Stores](https://svelte.dev/docs#svelte_store), Svelte's default data management API to build a simple data model for our app. However, the pattern used here applies just as well to other data management libraries like [Apollo](https://www.apollographql.com/client/) and [MobX](https://mobx.js.org/).

First we’ll construct a simple Svelte store that responds to actions that change the state of tasks, in a file called `src/store.js` (intentionally kept simple):

```js:title=src/store.js
// A simple Svelte store implementation with update methods and initial data.
// A true app would be more complex and separated into different files.

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
//
```

Then we'll update our `TaskList` to read data out of the store. First let's move our existing presentational version to the file `src/components/PureTaskList.svelte`, and wrap it with a container.

In `src/components/PureTaskList.svelte`:

```svelte:title=src/components/PureTaskList.svelte
<!--This file moved from TaskList.svelte-->
<script>
  import Task from './Task.svelte';
  import LoadingRow from './LoadingRow.svelte';
  export let loading = false;
  export let tasks = [];
  $: noTasks = tasks.length === 0;
  $: emptyTasks = tasks.length === 0 && !loading;
  $: tasksInOrder = [
    ...tasks.filter(t => t.state === 'TASK_PINNED'),
    ...tasks.filter(t => t.state !== 'TASK_PINNED'),
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
{#if noTasks && !loading}
<div class="list-items">
  <div class="wrapper-message">
    <span class="icon-check" />
    <div class="title-message">You have no tasks</div>
    <div class="subtitle-message">Sit back and relax</div>
  </div>
</div>
{/if}
{#each tasksInOrder as task}
  <Task {task} on:onPinTask on:onArchiveTask />
{/each}
```

In `src/components/TaskList.svelte`:

```svelte:title=src/components/TaskList.svelte

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

<div>
  <PureTaskList
    tasks={$taskStore}
    on:onPinTask={onPinTask}
    on:onArchiveTask={onArchiveTask}
  />
</div>
```

The reason to keep the presentational version of the `TaskList` separate is because it is easier to test and isolate. As it doesn't rely on the presence of a store it is much easier to deal with from a testing perspective. Let's rename `src/components/TaskList.stories.js` into `src/components/PureTaskList.stories.js`, and ensure our stories use the presentational version:

```js:title=src/components/PureTaskList.stories.js
import PureTaskList from './PureTaskList.svelte';
import MarginDecorator from './MarginDecorator.svelte';

import * as TaskStories from './Task.stories';

export default {
  component: PureTaskList,
  //👇 The auxiliary component will be added as a decorator to help show the UI correctly
  decorators: [() => MarginDecorator],
  title: 'PureTaskList',
  argTypes: {
    onPinTask: { action: 'onPinTask' },
    onArchiveTask: { action: 'onArchiveTask' },
  },
};

const Template = args => ({
  Component: PureTaskList,
  props: args,
  on: {
    ...TaskStories.actionsData,
  },
});
export const Default = Template.bind({});
Default.args = {
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
};

export const WithPinnedTasks = Template.bind({});
WithPinnedTasks.args = {
  // Shaping the stories through args composition.
  // Inherited data coming from the Default story.
  tasks: [
    ...Default.args.tasks.slice(0, 5),
    { id: '6', title: 'Task 6 (pinned)', state: 'TASK_PINNED' },
  ],
};

export const Loading = Template.bind({});
Loading.args = {
  tasks: [],
  loading: true,
};

export const Empty = Template.bind({});
Empty.args = {
  // Shaping the stories through args composition.
  // Inherited data coming from the Loading story.
  ...Loading.args,
  loading: false,
};
```

<video autoPlay muted playsInline loop>
  <source
    src="/intro-to-storybook/finished-tasklist-states-6-0.mp4"
    type="video/mp4"
  />
</video>

Similarly, we need to use `PureTaskList` in our Jest test:

```diff:title=src/components/TaskList.test.js
- import TaskList from './TaskList.svelte';

+ import PureTaskList from './PureTaskList.svelte';

import { render } from '@testing-library/svelte';

//👇 Our story imported here
- import { WithPinnedTasks } from './TaskList.stories';

+ import { WithPinnedTasks } from './PureTaskList.stories';

test('PureTaskList', () => {
  const { container } = render(PureTaskList, {
    //👇 Story's args used with our test
    props: WithPinnedTasks.args,
  });
  expect(container.firstChild.children[0].classList.contains('TASK_PINNED')).toBe(true);
});
```

<div class="aside">
💡 With this change your snapshots will require an update. Re-run the test command with the <code>-u</code> flag to update them. Also don't forget to commit your changes with git!
</div>
