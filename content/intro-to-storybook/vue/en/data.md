---
title: 'Wire in data'
tocTitle: 'Data'
description: 'Learn how to wire in data to your UI component'
commit: 'fa1c954'
---

So far we created isolated stateless components –great for Storybook, but ultimately not useful until we give them some data in our app.

This tutorial doesn’t focus on the particulars of building an app so we won’t dig into those details here. But we will take a moment to look at a common pattern for wiring in data with container components.

## Container components

Our `TaskList` component as currently written is “presentational” (see [this blog post](https://medium.com/@dan_abramov/smart-and-dumb-components-7ca2f9a7c7d0)) in that it doesn’t talk to anything external to its own implementation. To get data into it, we need a “container”.

This example uses [Vuex](https://vuex.vuejs.org), Vue's default data management library, to build a straightforward data model for our app. However, the pattern used here applies just as well to other data management libraries like [Apollo](https://www.apollographql.com/client/) and [MobX](https://mobx.js.org/).

First, install vuex with:

```bash
yarn add vuex@next --save
```

In a file called `src/store.js` we'll construct a standard Vuex store that responds to actions which will change the tasks state:

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

Next, we’ll need to update our app’s entry point (`src/main.js`) so that we can wire the store into our component hierarchy reasonably quick:

```diff:title=src/main.js
import { createApp } from 'vue';

import App from './App.vue';

+ import store from './store';

- createApp(App).mount('#app')
+ createApp(App).use(store).mount('#app')
```

Once we've connected the store into our app, we'll need to update the the top-level app component (`src/App.vue`) to display our `TaskList` component:

```diff:title=src/App.vue
<template>
- <img alt="Vue logo" src="./assets/logo.png">
- <HelloWorld msg="Welcome to Your Vue.js App"/>
+ <div id="app">
+   <task-list />
+ </div>
</template>

<script>
- import HelloWorld from './components/HelloWorld.vue'
+ import TaskList from './components/TaskList.vue';

export default {
  name: 'App',
  components: {
-   HelloWorld
+   TaskList
  }
}
</script>

<style>
@import "./index.css";
</style>
```

Then we'll update our `TaskList` to read data out of the store. First let's move our existing presentational version to the file `src/components/PureTaskList.vue` (renaming the component to `PureTaskList`), and wrap it with a container.

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

The reason to keep the presentational version of the `TaskList` separate is because it is easier to test and isolate. As it doesn't rely on the presence of a store it is much easier to deal with from a testing perspective. Let's rename `src/components/TaskList.stories.js` into `src/components/PureTaskList.stories.js`, and ensure our stories use the presentational version:

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

Similarly, we need to use `PureTaskList` in our Jest test:

```diff:title=tests/unit/PureTaskList.spec.js
import { mount } from '@vue/test-utils';

- import TaskList from '../../src/components/TaskList.vue';

+ import PureTaskList from '../../src/components/PureTaskList.vue';

//👇 Our story imported here
- import { WithPinnedTasks } from '../src/components/TaskList.stories.js';

+ import { WithPinnedTasks } from '../../src/components/PureTaskList.stories';

it('renders pinned tasks at the start of the list', () => {
  // render PureTaskList
- const wrapper = mount(TaskList, {
-   //👇 Story's args used with our test
-   propsData: WithPinnedTasks.args,
- });
+ const wrapper = mount(PureTaskList, {
+   propsData: WithPinnedTasks.args,
+ });

  const firstPinnedTask = wrapper.find('.list-item:nth-child(1).TASK_PINNED');
  expect(firstPinnedTask).not.toBe(null);
});
```

<div class="aside">
💡 With this change your snapshots will require an update. Re-run the test command with the <code>-u</code> flag to update them. Also don't forget to commit your changes with git!
</div>
