---
title: 'Wire in data'
tocTitle: 'Data'
description: 'Learn how to wire in data to your UI component'
commit: '30e306d'
---

So far, we have created isolated stateless components-–great for Storybook, but ultimately not helpful until we give them some data in our app.

This tutorial doesn’t focus on the particulars of building an app, so we won’t dig into those details here. But we will take a moment to look at a common pattern for wiring in data with container components.

## Container components

Our `TaskList` component as currently written is “presentational” in that it doesn’t talk to anything external to its own implementation. To get data into it, we need a “container”.

This example uses [Pinia](https://pinia.vuejs.org/), Vue's default data management library, to build a straightforward data model for our app. However, the pattern used here applies just as well to other data management libraries like [Apollo](https://www.apollographql.com/client/) and [MobX](https://mobx.js.org/).

Add the necessary dependency to your project with:

```shell
yarn add pinia
```

First, we'll create a simple Pinia store that responds to actions that change the task's state in a file called `store.js` in the `src` directory (intentionally kept simple):

```js:title=src/store.js
/* A simple Pinia store/actions implementation.
 * A true app would be more complex and separated into different files.
 */
import { defineStore } from 'pinia';

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

/*
 * The store is created here.
 * You can read more about Pinia defineStore in the docs:
 * https://pinia.vuejs.org/core-concepts/
 */
export const useTaskStore = defineStore({
  id: 'taskbox',
  state: () => ({
    tasks: defaultTasks,
    status: 'idle',
    error: null,
  }),
  actions: {
    archiveTask(id) {
      const task = this.tasks.find((task) => task.id === id);
      if (task) {
        task.state = 'TASK_ARCHIVED';
      }
    },
    pinTask(id) {
      const task = this.tasks.find((task) => task.id === id);
      if (task) {
        task.state = 'TASK_PINNED';
      }
    },
  },
  getters: {
    getFilteredTasks: (state) => {
      const filteredTasks = state.tasks.filter(
        (t) => t.state === 'TASK_INBOX' || t.state === 'TASK_PINNED'
      );
      return filteredTasks;
    },
  },
});
```

Then we'll update our `TaskList` to read data out of the store. First, let's move our existing presentational version to the file `src/components/PureTaskList.vue` (renaming the component to `PureTaskList`) and wrap it with a container.

In `src/components/PureTaskList.vue`:

```html:title=src/components/PureTaskList.vue
<template>
  <div class="list-items">
    <template v-if="loading">
      <div v-for="n in 6" :key="n" class="loading-item">
        <span class="glow-checkbox" />
        <span class="glow-text">
          <span>Loading</span> <span>cool</span> <span>state</span>
        </span>
      </div>
    </template>

    <div v-else-if="isEmpty" class="list-items">
      <div class="wrapper-message">
        <span class="icon-check" />
        <p class="title-message">You have no tasks</p>
        <p class="subtitle-message">Sit back and relax</p>
      </div>
    </div>

    <template v-else>
      <Task
        v-for="task in tasksInOrder"
        :key="task.id"
        :task="task"
        @archive-task="onArchiveTask"
        @pin-task="onPinTask"
      />
    </template>
  </div>
</template>
<script>
import Task from './Task.vue';
import { reactive, computed } from 'vue';

export default {
  name: 'PureTaskList',
  components: { Task },
  props: {
    tasks: { type: Array, required: true, default: () => [] },
    loading: { type: Boolean, default: false },
  },
  emits: ['archive-task', 'pin-task'],

  setup(props, { emit }) {
    props = reactive(props);
    return {
      isEmpty: computed(() => props.tasks.length === 0),
      tasksInOrder: computed(() => {
        return [
          ...props.tasks.filter((t) => t.state === 'TASK_PINNED'),
          ...props.tasks.filter((t) => t.state !== 'TASK_PINNED'),
        ];
      }),
      /**
       * Event handler for archiving tasks
       */
      onArchiveTask(taskId) {
        emit('archive-task', taskId);
      },
      /**
       * Event handler for pinning tasks
       */
      onPinTask(taskId) {
        emit('pin-task', taskId);
      },
    };
  },
};
</script>
```

In `src/components/TaskList.vue`:

```html:title=src/components/TaskList.vue
<template>
  <PureTaskList :tasks="tasks" @archive-task="archiveTask" @pin-task="pinTask" />
</template>

<script>
import PureTaskList from './PureTaskList.vue';

import { computed } from 'vue';

import { useTaskStore } from '../store';

export default {
  components: { PureTaskList },
  name: 'TaskList',
  setup() {
    //👇 Creates a store instance
    const store = useTaskStore();

    //👇 Retrieves the tasks from the store's state auxiliary getter function
    const tasks = computed(() => store.getFilteredTasks);

    //👇 Dispatches the actions back to the store
    const archiveTask = (task) => store.archiveTask(task);
    const pinTask = (task) => store.pinTask(task);

    return {
      tasks,
      archiveTask,
      pinTask,
    };
  },
};
</script>
```

The reason to keep the presentational version of the `TaskList` separate is that it is easier to test and isolate. As it doesn't rely on the presence of a store, it is much easier to deal with from a testing perspective. Let's rename `src/components/TaskList.stories.js` into `src/components/PureTaskList.stories.js` and ensure our stories use the presentational version:

```diff:title=src/components/PureTaskList.stories.js
+ import PureTaskList from './PureTaskList.vue';

import * as TaskStories from './Task.stories';

export default {
+ component: PureTaskList,
+ title: 'PureTaskList',
  tags: ['autodocs'],
  decorators: [() => ({ template: '<div style="margin: 3em;"><story/></div>' })],
  argTypes: {
    onPinTask: {},
    onArchiveTask: {},
  },
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

Now that we have some actual data populating our component, obtained from the Pinia store, we could have wired it to `src/App.vue` and render the component there. Don't worry about it. We'll take care of it in the next chapter.
