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

```javascript
// src/store.js

// A simple Svelte store implementation with update methods and initial data.
// A true app would be more complex and separated into different files.
import { writable } from 'svelte/store';

const TaskBox = () => {

    // creates a new writable store populated with some initial data
    const { subscribe, update } = writable([
      { id: "1", title: "Something", state: "TASK_INBOX" },
      { id: "2", title: "Something more", state: "TASK_INBOX" },
      { id: "3", title: "Something else", state: "TASK_INBOX" },
      { id: "4", title: "Something again", state: "TASK_INBOX" }
    ]);
    
    return {
        subscribe,
        // method to archive a task, think of a action with redux or Vuex
        archiveTask:(id)=>update(tasks=>{
          tasks.map(task=>task.id===id?{...task,state:'TASK_ARCHIVED'}:task)
          return tasks
        }),
        // method to pin a task, think of a action with redux or Vuex
        pinTask:(id)=>update(tasks=>{
          tasks.map(task=>task.id===id?{...task,state:'TASK_PINNED'}:task)
          return tasks
        })
    }
  }; 

  // We export the constructed svelte store
  export const taskStore = TaskBox();
//
```

Then we'll update our `TaskList` to read data out of the store. First let's move our existing presentational version to the file `src/components/PureTaskList.svelte`, and wrap it with a container.

In `src/components/PureTaskList.svelte`:

```html
<!--This file moved from TaskList.svelte-->
<script>
  import Task from "./Task.svelte";
  import LoadingRow from "./LoadingRow.svelte";
  export let loading = false;
  export let tasks = [];
  // reactive declarations (computed prop in other frameworks)
  $: noTasks = tasks.length === 0;
  $: emptyTasks = tasks.length === 0 && !loading;
  $: tasksInOrder = [
    ...tasks.filter(t => t.state === "TASK_PINNED"),
    ...tasks.filter(t => t.state !== "TASK_PINNED")
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

{#if tasks.length === 0 && !loading}
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

```html
<script>
  import PureTaskList from './PureTaskList.svelte';
  import {store} from '../store'; // imports the store objeect
  function onPinTask(event) {
    store.archiveTask(event.detail.id) // triggers the "action" in the store
    
  }
  function onArchiveTask(event) {
    store.pinTask(event.detail.id) // triggers the "action" in the store
  }
</script>

<div>
  <PureTaskList tasks={$store} on:onPinTask={onPinTask} on:onArchiveTask={onArchiveTask}/>
</div>
```

The reason to keep the presentational version of the `TaskList` separate is because it is easier to test and isolate. As it doesn't rely on the presence of a store it is much easier to deal with from a testing perspective. Let's rename `src/components/TaskList.stories.js` into `src/components/PureTaskList.stories.js`, and ensure our stories use the presentational version:

```javascript
import { storiesOf } from "@storybook/svelte";

import PureTaskList from "./PureTaskList.svelte";
import { task, actions } from "./Task.stories";

export const defaultTasks = [
  { ...task, id: "1", title: "Task 1" },
  { ...task, id: "2", title: "Task 2" },
  { ...task, id: "3", title: "Task 3" },
  { ...task, id: "4", title: "Task 4" },
  { ...task, id: "5", title: "Task 5" },
  { ...task, id: "6", title: "Task 6" }
];

export const withPinnedTasks = [
  ...defaultTasks.slice(0, 5),
  { id: "6", title: "Task 6 (pinned)", state: "TASK_PINNED" }
];

storiesOf("PureTaskList", module)
  .add("default", () => {
    return {
      Component: PureTaskList,
      props: {
        tasks: defaultTasks
      },
      on: {
        ...actions
      }
    };
  })
  .add("withPinnedTasks", () => {
    return {
      Component: PureTaskList,
      props: {
        tasks: withPinnedTasks
      },
      on: {
        ...actions
      }
    };
  })
  .add("loading", () => {
    return {
      Component: PureTaskList,
      props: {
        loading: true
      },
      on: {
        ...actions
      }
    };
  })
  .add("empty", () => {
    return {
      Component: PureTaskList,
      on: {
        ...actions
      }
    };
  });
```

<video autoPlay muted playsInline loop>
  <source
    src="/intro-to-storybook/finished-tasklist-states.mp4"
    type="video/mp4"
  />
</video>

Similarly, we need to use `PureTaskList` in our Jest test:

```js
import PureTaskList from "./PureTaskList.svelte";
import {render} from '@testing-library/svelte';
import { withPinnedTasks } from './PureTaskList.stories';

describe("TaskList",()=>{
    it('renders pinned tasks at the start of the list',()=>{
        setTimeout(() => {
            const {container}= render(PureTaskList,{
                props:{
                    tasks:withPinnedTasks
                }
            })
            expect(container.firstChild.classList.contains('TASK_PINNED')).toBe(true)
        }, 10);
    })
})
```
<div class="aside">Should your snapshot tests fail at this stage, you must update the existing snapshots by running the test script with the flag -u. Or create a new script to address this issue.</div>
