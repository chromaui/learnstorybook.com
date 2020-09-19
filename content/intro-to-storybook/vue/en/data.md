---
title: 'Wire in data'
tocTitle: 'Data'
description: 'Learn how to wire in data to your UI component'
commit: 28bc240
---

So far we created isolated stateless components –great for Storybook, but ultimately not useful until we give them some data in our app.

This tutorial doesn’t focus on the particulars of building an app so we won’t dig into those details here. But we will take a moment to look at a common pattern for wiring in data with container components.

## Container components

Our `TaskList` component as currently written is “presentational” (see [this blog post](https://medium.com/@dan_abramov/smart-and-dumb-components-7ca2f9a7c7d0)) in that it doesn’t talk to anything external to its own implementation. To get data into it, we need a “container”.

This example uses [Vuex](https://vuex.vuejs.org), Vue's default data management library, to build a straightforward data model for our app. However, the pattern used here applies just as well to other data management libraries like [Apollo](https://www.apollographql.com/client/) and [MobX](https://mobx.js.org/).

First, install vuex with:

```bash
yarn add vuex
```

In a file called `src/store.js` we'll construct a standard Vuex store that responds to actions which will change the tasks state:

```javascript

// src/store.js
import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
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

In our top-level app component (`src/App.vue`) we can wire the store into our component hierarchy fairly easily:

```html

<!--src/App.vue-->
<template>
  <div id="app">
    <task-list />
  </div>
</template>

<script>
  import store from './store';
  import TaskList from './components/TaskList.vue';

  export default {
    name: 'app',
    store,
    components: {
      TaskList,
    },
  };
</script>
<style>
  @import './index.css';
</style>
```

Then we'll update our `TaskList` to read data out of the store. First let's move our existing presentational version to the file `src/components/PureTaskList.vue` (renaming the component to `pure-task-list`), and wrap it with a container.

In `src/components/PureTaskList.vue`:

```html

<!--src/components/PureTaskList.vue-->
<template>
<!--same content as before-->
</template>

<script>
import Task from "./Task";
export default {
  name: "pure-task-list",
  ...
}
</script>
```

In `src/components/TaskList.vue`:

```html

<!--src/components/TaskList.vue`-->
<template>
  <div>
    <pure-task-list :tasks="tasks" @archiveTask="archiveTask" @pinTask="pinTask" />
  </div>
</template>

<script>
  import PureTaskList from './PureTaskList';
  import { mapState, mapActions } from 'vuex';

  export default {
    name: 'task-list',
    components: {
      PureTaskList,
    },
    methods: {
      ...mapActions(['archiveTask', 'pinTask']),
    },
    computed: {
      ...mapState(['tasks']),
    },
  };
</script>
```

The reason to keep the presentational version of the `TaskList` separate is because it is easier to test and isolate. As it doesn't rely on the presence of a store it is much easier to deal with from a testing perspective. Let's rename `src/components/TaskList.stories.js` into `src/components/PureTaskList.stories.js`, and ensure our stories use the presentational version:

```javascript

//src/components/PureTaskList.stories.js
import PureTaskList from './PureTaskList';
import { taskData, actionsData } from './Task.stories';

const paddedList = () => {
  return {
    template: '<div style="padding: 3rem;"><story/></div>',
  };
};
export default {
  title: 'TaskList',
  excludeStories: /.*Data$/,
  decorators: [paddedList],
};

export const defaultTasksData = [
  { ...taskData, id: '1', title: 'Task 1' },
  { ...taskData, id: '2', title: 'Task 2' },
  { ...taskData, id: '3', title: 'Task 3' },
  { ...taskData, id: '4', title: 'Task 4' },
  { ...taskData, id: '5', title: 'Task 5' },
  { ...taskData, id: '6', title: 'Task 6' },
];
export const withPinnedTasksData = [
  ...defaultTasksData.slice(0, 5),
  { id: '6', title: 'Task 6 (pinned)', state: 'TASK_PINNED' },
];


export const Default = () => ({
  components: { PureTaskList },
  template: `<pure-task-list :tasks="tasks" @archiveTask="onArchiveTask" @pinTask="onPinTask"/>`,
  props: {
    tasks: {
      default: () => defaultTasksData
    }
  },
  methods: actionsData
});
// tasklist with pinned tasks
export const WithPinnedTasks = () => ({
  components: { PureTaskList },
  template: `<pure-task-list :tasks="tasks" @archiveTask="onArchiveTask" @pinTask="onPinTask"/>`,
  props: {
    tasks: {
      default: () => withPinnedTasksData
    }
  },
  methods: actionsData
});
// tasklist in loading state
export const Loading = () => ({
  components: { PureTaskList },
  template: `<pure-task-list loading @archiveTask="onArchiveTask" @pinTask="onPinTask"/>`,
  methods: actionsData
});
// tasklist no tasks
export const Empty = () => ({
  components: { PureTaskList },
  template: `<pure-task-list @archiveTask="onArchiveTask" @pinTask="onPinTask"/>`,
  methods: actionsData
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

//tests/unit/TaskList.spec.js
import Vue from 'vue';
import PureTaskList from '../../src/components/PureTaskList.vue';
import { withPinnedTasksData } from '../../src/components/PureTaskList.stories';

it('renders pinned tasks at the start of the list', () => {
  const Constructor = Vue.extend(PureTaskList);
  const vm = new Constructor({
    propsData: { tasks: withPinnedTasksData },
  }).$mount();
  const lastTaskInput = vm.$el.querySelector('.list-item:nth-child(1).TASK_PINNED');

  // We expect the pinned task to be rendered first, not at the end
  expect(lastTaskInput).not.toBe(null);
});
```

<div class="aside">Should your snapshot tests fail at this stage, you must update the existing snapshots by running the test script with the flag -u. Or create a new script to address this issue.</div>
