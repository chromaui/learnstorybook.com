---
title: 'Wire in data'
tocTitle: 'Data'
description: 'Learn how to wire in data to your UI component'
---

So far, we have created isolated stateless components-–great for Storybook, but ultimately not helpful until we give them some data in our app.

This tutorial doesn’t focus on the particulars of building an app, so we won’t dig into those details here. But we will take a moment to look at a common pattern for wiring in data with container components.

## Container components

Our `TaskList` component as currently written is “presentational” in that it doesn’t talk to anything external to its own implementation. To get data into it, we need a “container”.

For this tutorial, we'll use Svelte's [runes](https://svelte.dev/docs/svelte/what-are-runes), a powerful reactivity system that provides explicit, fine-grained reactive primitives to implement a simple store. We'll use the [`$state`](https://svelte.dev/docs/svelte/$state) rune to build a simple data model for our application and help us manage the state of our tasks.

First, we’ll construct a simple store that responds to actions that change the state of tasks in a file called `store.svelte.ts` in the `src/lib/state` directory (intentionally kept simple):

```ts:title=src/lib/state/store.svelte.ts
// A simple Svelte state management implementation using runes update methods and initial data.
// A true app would be more complex and separated into different files.
import type { TaskData } from '../../types';

interface TaskBoxState {
  tasks: TaskData[];
  status: 'idle' | 'loading' | 'failed' | 'succeeded';
  error: string | null;
}
/*
 * The initial state of our store when the app loads.
 * Usually, you would fetch this from a server. Let's not worry about that now
 */
const defaultTasks: TaskData[] = [
  { id: '1', title: 'Something', state: 'TASK_INBOX' },
  { id: '2', title: 'Something more', state: 'TASK_INBOX' },
  { id: '3', title: 'Something else', state: 'TASK_INBOX' },
  { id: '4', title: 'Something again', state: 'TASK_INBOX' },
];

const initialState: TaskBoxState = {
  tasks: defaultTasks,
  status: 'idle',
  error: null,
};


export const store: TaskBoxState = $state(initialState);

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
    task.state = 'TASK_PINNED';
  }
}
```

Then we'll update our `TaskList` to read data out of the store. First, let's move our existing presentational version to the file `src/lib/components/PureTaskList.svelte` and wrap it with a container.

In `src/lib/components/PureTaskList.svelte`:

```html:title=src/lib/components/PureTaskList.svelte
<!--This file moved from TaskList.svelte-->
<script lang="ts">
  import type { TaskData } from '../../types';

  import Task from './Task.svelte';

  import LoadingRow from './LoadingRow.svelte';

  interface Props {
    /** Checks if it's in loading state */
    loading?: boolean;
    /** The list of tasks */
    tasks: TaskData[];
    /** Event to change the task to pinned */
    onPinTask: (id: string) => void;
    /** Event to change the task to archived */
    onArchiveTask: (id: string) => void;
  }

  const {
    loading = false,
    tasks = [],
    onPinTask,
    onArchiveTask,
  }: Props = $props();

  let noTasks = $derived(tasks.length === 0);
  let tasksInOrder = $derived([
    ...tasks.filter((t) => t.state === 'TASK_PINNED'),
    ...tasks.filter((t) => t.state !== 'TASK_PINNED'),
  ]);
</script>

{#if loading}
  <<div class="list-items" data-testid="loading" id="loading">
    <LoadingRow />
    <LoadingRow />
    <LoadingRow />
    <LoadingRow />
    <LoadingRow />
  </div>
{/if}
{#if !loading && noTasks}
  <div class="list-items">
    <div class="wrapper-message">
      <span class="icon-check"></span>
      <p class="title-message">You have no tasks</p>
      <p class="subtitle-message">Sit back and relax</p>
    </div>
  </div>
{/if}

{#each tasksInOrder as task}
  <Task {task} {onPinTask} {onArchiveTask} />
{/each}
```

In `src/lib/components/TaskList.svelte`:

```html:title=src/lib/components/TaskList.svelte
<script lang="ts">
  import { archiveTask, pinTask, store } from '../state/store.svelte';

  import PureTaskList from './PureTaskList.svelte';
</script>

<PureTaskList
  loading={store.status === "loading"}
  tasks={store.tasks}
  onPinTask={pinTask}
  onArchiveTask={archiveTask}
/>
```

The reason to keep the presentational version of the `TaskList` separate is that it is easier to test and isolate. As it doesn't rely on the presence of a store, it is much easier to deal with from a testing perspective. Let's rename `src/lib/components/TaskList.stories.svelte` into `src/lib/components/PureTaskList.stories.svelte` and ensure our stories use the presentational version:

```html:title=src/lib/components/PureTaskList.stories.svelte
<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf';

  import PureTaskList from './PureTaskList.svelte';
  import MarginDecorator from './MarginDecorator.svelte';

  import * as TaskStories from './Task.stories.svelte';

  export const TaskListData = [
    { ...TaskStories.TaskData, id: '1', title: 'Task 1' },
    { ...TaskStories.TaskData, id: '2', title: 'Task 2' },
    { ...TaskStories.TaskData, id: '3', title: 'Task 3' },
    { ...TaskStories.TaskData, id: '4', title: 'Task 4' },
    { ...TaskStories.TaskData, id: '5', title: 'Task 5' },
    { ...TaskStories.TaskData, id: '6', title: 'Task 6' },
  ];

  const { Story } = defineMeta({
    component: PureTaskList,
    title: 'PureTaskList',
    tags: ['autodocs'],
    excludeStories: /.*Data$/,
    decorators: [() => MarginDecorator],
    args: {
      ...TaskStories.TaskData.events,
    },
  });
</script>

<Story
  name="Default"
  args={{
    tasks: TaskListData,
    loading: false,
  }}
/>
<Story
  name="WithPinnedTasks"
  args={{
    tasks: [
      ...TaskListData.slice(0, 5),
      { id: '6', title: 'Task 6 (pinned)', state: 'TASK_PINNED' },
    ],
  }}
/>

<Story
  name="Loading"
  args={{
    tasks: [],
    loading: true,
  }}
/>

<Story
  name="Empty"
  args={{
    tasks: TaskListData.slice(0, 0),
    loading: false,
  }}
/>
```

<video autoPlay muted playsInline loop>
  <source
    src="/intro-to-storybook/finished-puretasklist-states-9-0.mp4"
    type="video/mp4"
  />
</video>

<div class="aside">
💡 Don't forget to commit your changes with git!
</div>

Now that we have some actual data populating our component, obtained from the Svelte store, we could have wired it to `src/App.svelte` and render the component there. Don't worry about it. We'll take care of it in the next chapter.
