---
title: 'Assemble a composite component'
tocTitle: 'Composite component'
description: 'Assemble a composite component out of simpler components'
---

Last chapter, we built our first component; this chapter extends what we learned to build TaskList, a list of Tasks. Let’s combine components together and see what happens when more complexity is introduced.

## Tasklist

Taskbox emphasizes pinned tasks by positioning them above default tasks. It yields two variations of `TaskList` you need to create stories for, default and pinned items.

![default and pinned tasks](/intro-to-storybook/tasklist-states-1.png)

Since `Task` data can be sent asynchronously, we **also** need a loading state to render in the absence of a connection. In addition, we require an empty state for when there are no tasks.

![empty and loading tasks](/intro-to-storybook/tasklist-states-2.png)

## Get set up

A composite component isn’t much different from the basic components it contains. Create a `TaskList` component, an auxiliary component to help us display the correct markup, and an accompanying story file: `src/lib/components/TaskList.svelte`, `src/lib/components/MarginDecorator.svelte`, and `src/lib/components/TaskList.stories.svelte`.

Start with a rough implementation of the `TaskList`. You’ll need to import the `Task` component from earlier and pass in the attributes and actions as inputs.

```html:title=src/lib/components/TaskList.svelte
<script lang="ts">
  import type { TaskData } from '../../types';

  import Task from './Task.svelte';

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

  const noTasks = $derived(tasks.length === 0);
</script>

{#if loading}
  <div class="list-items">loading</div>
{/if}

{#if !loading && noTasks}
  <div class="list-items">empty</div>
{/if}

{#each tasks as task}
  <Task {task} {onPinTask} {onArchiveTask} />
{/each}
```

Next, create `MarginDecorator` with the following inside:

```html:title=src/lib/components/MarginDecorator.svelte
<script>
  let { children } = $props();
</script>

<div>
  {@render children()}
</div>

<style>
  div {
    margin: 3em;
  }
</style>
```

Finally, create `Tasklist`’s test states in the story file.

```html:title=src/lib/components/TaskList.stories.svelte
<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf';

  import TaskList from './TaskList.svelte';
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
    component: TaskList,
    title: 'TaskList',
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

<div class="aside">

[**Decorators**](https://storybook.js.org/docs/writing-stories/decorators) are a way to provide arbitrary wrappers to stories. In this case, we're using Svelte's CSF's `decorators` property to add styling around the rendered component. They can also be used to add other context to components.

</div>

By importing `TaskStories`, we were able to [compose](https://storybook.js.org/docs/writing-stories/args#args-composition) the arguments (args for short) in our stories with minimal effort. That way, the data and actions (mocked callbacks) expected by both components are preserved.

Now check Storybook for the new `TaskList` stories.

<video autoPlay muted playsInline loop>
  <source
    src="/intro-to-storybook/inprogress-tasklist-states-9-0.mp4"
    type="video/mp4"
  />
</video>

## Build out the states

Our component is still rough, but now we have an idea of the stories to work toward. You might be thinking that the `.list-items` wrapper is overly simplistic. You're right – in most cases, we wouldn’t create a new component just to add a wrapper. But the **real complexity** of the `TaskList` component is revealed in the edge cases `withPinnedTasks`, `loading`, and `empty`.

For the loading edge case, we will create a new component that will display the correct markup.

Create a new file called `LoadingRow.svelte` and inside add the following markup:

```html:title=src/lib/components/LoadingRow.svelte
<div class="loading-item">
  <span class="glow-checkbox"></span>
  <span class="glow-text">
    <span>Loading</span>
    <span>cool</span>
    <span>state</span>
  </span>
</div>
```

And update `TaskList.svelte` to the following:

```html:title=src/lib/components/TaskList.svelte
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

  const noTasks = $derived(tasks.length === 0);
  const tasksInOrder = $derived([
    ...tasks.filter((t) => t.state === 'TASK_PINNED'),
    ...tasks.filter((t) => t.state !== 'TASK_PINNED'),
  ]);
</script>

{#if loading}
  <div class="list-items" data-testid="loading" id="loading">
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

The added markup results in the following UI:

<video autoPlay muted playsInline loop>
  <source
    src="/intro-to-storybook/finished-tasklist-states-9-0.mp4"
    type="video/mp4"
  />
</video>

Note the position of the pinned item in the list. We want the pinned item to render at the top of the list to make it a priority for our users.

<div class="aside">
💡 Don't forget to commit your changes with git!
</div>
