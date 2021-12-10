---
title: 'Wire in data'
tocTitle: 'Data'
description: 'Learn how to wire in data to your UI component'
commit: 'c881ddc'
---

So far, we have created isolated stateless components-–great for Storybook, but ultimately not helpful until we give them some data in our app.

This tutorial doesn’t focus on the particulars of building an app, so we won’t dig into those details here. But we will take a moment to look at a common pattern for wiring in data with container components.

## Container components

Our `TaskList` component as currently written is “presentational” in that it doesn’t talk to anything external to its own implementation. To get data into it, we need a “container”.

This example uses [Vuex](https://vuex.vuejs.org), Vue's default data management library, to build a straightforward data model for our app. However, the pattern used here applies just as well to other data management libraries like [Apollo](https://www.apollographql.com/client/) and [MobX](https://mobx.js.org/).

Add the necessary dependency to your project with:

```bash
yarn add vuex@next --save
```

First, we'll create a simple Vuex store that responds to actions that change the task's state in a file called `store.js` in the `src` directory (intentionally kept simple):

```js:title=src/store.js
import { createStore } from 'vuex';

export default createStore({
  state: {
    tasks: [
      { id: '1', title: 'Something', state: 'TASK_INBOX' },
      { id: '2', title: 'Something more', state: 'TASK_INBOX' },
      { id: '3', title: 'Something else', state: 'TASK_INBOX' },
      { id: '4', title: 'Something again', state: 'TASK_INBOX' },
    ],
  },
  mutations: {
    ARCHIVE_TASK(state, id) {
      state.tasks.find(task => task.id === id).state = 'TASK_ARCHIVED';
    },
    PIN_TASK(state, id) {
      state.tasks.find(task => task.id === id).state = 'TASK_PINNED';
    },
  },
  actions: {
    archiveTask({ commit }, id) {
      commit('ARCHIVE_TASK', id);
    },
    pinTask({ commit }, id) {
      commit('PIN_TASK', id);
    },
  },
});
```

Then we'll update our `TaskList` to read data out of the store. First, let's move our existing presentational version to the file `src/components/PureTaskList.vue` (renaming the component to `PureTaskList`) and wrap it with a container.

In `src/components/PureTaskList.vue`:

```html:title=src/components/PureTaskList.vue
<template>
  <!-- same content as before -->
</template>

<script>
  import Task from './Task';
  export default {
    name: 'PureTaskList',
    // same content as before
  };
</script>
```

In `src/components/TaskList.vue`:

```html:title=src/components/TaskList.vue
<template>
  <PureTaskList :tasks="tasks" @archive-task="archiveTask" @pin-task="pinTask" />
</template>

<script>
  import PureTaskList from './PureTaskList';

  import { computed } from 'vue';

  import { useStore } from 'vuex';

  export default {
    components: { PureTaskList },
    name: 'TaskList',
    setup() {
      //👇 Creates a store instance
      const store = useStore();

      //👇 Retrieves the tasks from the store's state
      const tasks = computed(() => store.state.tasks);

      //👇 Dispatches the actions back to the store
      const archiveTask = task => store.dispatch('archiveTask', task);
      const pinTask = task => store.dispatch('pinTask', task);

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
  decorators: [
    () => ({ template: '<div style="margin: 3em;"><story/></div>' }),
  ],
  argTypes: {
    onPinTask: {},
    onArchiveTask: {},
  },
};

const Template = (args, { argTypes }) => ({
+ components: { PureTaskList },
 setup() {
    return { args, ...TaskStories.actionsData };
  },
+ template: '<PureTaskList v-bind="args" />',
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

<div class="aside">
💡 With this change, all of our tests will require an update. Update the imports and re-run the test command with the <code>-u</code> flag to update them. Also, don't forget to commit your changes with git!
</div>

Now that we have some actual data populating our component, obtained from the Vuex store, we could have wired it to `src/App.vue` and render the component there. Don't worry about it. We'll take care of it in the next chapter.
