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

## Get setup

A composite component isn’t much different from the basic components it contains. Create a `TaskList` component, an auxiliary component to help us display the correct markup, and an accompanying story file: `src/components/TaskList.svelte`, `src/components/MarginDecorator.svelte`, and `src/components/TaskList.stories.js`.

Start with a rough implementation of the `TaskList`. You’ll need to import the `Task` component from earlier and pass in the attributes and actions as inputs.

```svelte:title=src/components/TaskList.svelte
<script>
  import Task from './Task.svelte';
  export let loading = false;
  export let tasks = [];

  //👇 Reactive declarations (computed prop in other frameworks)
  $: noTasks = tasks.length === 0;
  $: emptyTasks = noTasks && !loading;
</script>
{#if loading}
  <div class="list-items">loading</div>
{/if}
{#if emptyTasks}
  <div class="list-items">empty</div>
{/if}
{#each tasks as task}
  <Task {task} on:onPinTask on:onArchiveTask />
{/each}
```

Next, create `MarginDecorator` with the following inside:

```svelte:title=src/components/MarginDecorator.svelte
<div>
  <slot />
</div>

<style>
  div {
    margin: 3em;
  }
</style>
```

Finally, create `Tasklist`’s test states in the story file.

```js:title=src/components/TaskList.stories.js
import TaskList from './TaskList.svelte';

import MarginDecorator from './MarginDecorator.svelte';

import * as TaskStories from './Task.stories';

export default {
  component: TaskList,
  //👇 The auxiliary component will be added as a decorator to help show the UI correctly
  decorators: [() => MarginDecorator],
  title: 'TaskList',
  argTypes: {
    onPinTask: { action: 'onPinTask' },
    onArchiveTask: { action: 'onArchiveTask' },
  },
};

const Template = args => ({
  Component: TaskList,
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

<div class="aside">
💡 <a href="https://storybook.js.org/docs/svelte/writing-stories/decorators"><b>Decorators</b></a> are a way to provide arbitrary wrappers to stories. In this case we’re using a decorator `key` on the default export to add styling around the rendered component. They can also be used to add other context to components.
</div>

By importing `TaskStories`, we were able to [compose](https://storybook.js.org/docs/svelte/writing-stories/args#args-composition) the arguments (args for short) in our stories with minimal effort. That way, the data and actions (mocked callbacks) expected by both components are preserved.

Now check Storybook for the new `TaskList` stories.

<video autoPlay muted playsInline loop>
  <source
    src="/intro-to-storybook/inprogress-tasklist-states-6-0.mp4"
    type="video/mp4"
  />
</video>

## Build out the states

Our component is still rough, but now we have an idea of the stories to work toward. You might be thinking that the `.list-items` wrapper is overly simplistic. You're right – in most cases, we wouldn’t create a new component just to add a wrapper. But the **real complexity** of the `TaskList` component is revealed in the edge cases `withPinnedTasks`, `loading`, and `empty`.

For the loading edge case, we will create a new component that will display the correct markup.

Create a new file called `LoadingRow.svelte` and inside add the following markup:

```svelte:title=src/components/LoadingRow.svelte
<div class="loading-item">
  <span class="glow-checkbox" />
  <span class="glow-text">
    <span>Loading</span>
    <span>cool</span>
    <span>state</span>
  </span>
</div>
```

And update `TaskList.svelte` to the following:

```diff:title=src/components/TaskList.svelte
<script>
  import Task from './Task.svelte';
+ import LoadingRow from './LoadingRow.svelte';
  export let loading = false;
  export let tasks = [];

  //👇 Reactive declarations (computed props in other frameworks)
  $: noTasks = tasks.length === 0;
  $: emptyTasks = noTasks && !loading;
+ $: tasksInOrder = [
+   ...tasks.filter(t => t.state === 'TASK_PINNED'),
+   ...tasks.filter(t => t.state !== 'TASK_PINNED'),
+ ];
</script>
+ {#if loading}
+   <div class="list-items">
+     <LoadingRow />
+     <LoadingRow />
+     <LoadingRow />
+     <LoadingRow />
+     <LoadingRow />
+   </div>
+ {/if}
+ {#if emptyTasks}
+   <div class="list-items">
+     <div class="wrapper-message">
+       <span class="icon-check" />
+       <div class="title-message">You have no tasks</div>
+       <div class="subtitle-message">Sit back and relax</div>
+     </div>
+   </div>
+ {/if}
+ {#each tasksInOrder as task}
+   <Task {task} on:onPinTask on:onArchiveTask />
+ {/each}
```

The added markup results in the following UI:

<video autoPlay muted playsInline loop>
  <source
    src="/intro-to-storybook/finished-tasklist-states-6-0.mp4"
    type="video/mp4"
  />
</video>

Note the position of the pinned item in the list. We want the pinned item to render at the top of the list to make it a priority for our users.

## Automated testing

In the previous chapter, we learned how to snapshot test stories using Storyshots. With `Task`, there wasn’t much complexity to test beyond that it renders OK. Since `TaskList` adds another layer of complexity, we want to verify that certain inputs produce certain outputs in a way amenable to automatic testing. To do this, we’ll create unit tests using [Svelte Testing Library](https://testing-library.com/docs/svelte-testing-library/intro).

![Testing library logo](/intro-to-storybook/testinglibrary-image.jpeg)

### Unit tests with Svelte Testing Library

Storybook stories, manual tests, and snapshot tests go a long way to avoiding UI bugs. If stories cover a wide variety of component use cases, and we use tools that ensure a human checks any change to the story, errors are much less likely.

However, sometimes the devil is in the details. A test framework that is explicit about those details is needed, bringing us to unit tests.

In our case, we want our `TaskList` to render any pinned tasks **before** unpinned tasks that it has passed in the `tasks` prop. Although we have a story (`WithPinnedTasks`) to test this exact scenario, it can be ambiguous to a human reviewer that if the component **stops** ordering the tasks like this, it is a bug. It certainly won’t scream **“Wrong!”** to the casual eye.

So, to avoid this problem, we can use Svelte Testing Library to render the story to the DOM and run some DOM querying code to verify salient features of the output.

Create a test file called `src/components/TaskList.test.js`. Here, we’ll build out our tests that make assertions about the output.

```js:title=src/components/TaskList.test.js
import TaskList from './TaskList.svelte';

import { render } from '@testing-library/svelte';

import { WithPinnedTasks } from './TaskList.stories'; //👈  Our story imported here

test('renders pinned tasks at the start of the list', () => {
  //👇 Story's args used with our test
  const { container } = render(TaskList, {
    props: WithPinnedTasks.args,
  });
  expect(container.firstChild.children[0].classList.contains('TASK_PINNED')).toBe(true);
});
```

![TaskList test runner](/intro-to-storybook/tasklist-testrunner.png)

Note that we’ve been able to reuse the `WithPinnedTasks` story in our unit test; in this way, we can continue to leverage an existing resource (the examples that represent interesting configurations of a component) in many ways.

Notice as well that this test is quite brittle. It's possible that as the project matures and the exact implementation of the `Task` changes--perhaps using a different classname or a `textarea` rather than an `input`--the test will fail and need to be updated. It is not necessarily a problem but rather an indication of being careful about using unit tests for UI. They're not easy to maintain. Instead rely on manual, snapshot, and visual regression (see [testing chapter](/intro-to-storybook/svelte/en/test/)) tests where possible.

<div class="aside">
💡 Don't forget to commit your changes with git!
</div>
