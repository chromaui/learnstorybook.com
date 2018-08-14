---
title: "Wire in data"
tocTitle: "Data"
description: "Learn how to wire in data to your UI component"
commit: 660b02e
---

# Wire in data

So far we created isolated stateless components –great for Storybook, but ultimately not useful until we give them some data in our app.

This tutorial doesn’t focus on the particulars of building an app so we won’t dig into those details here. But we will take a moment to look at a common pattern for wiring in data with container components.

## Container components

Our `TaskList` component as currently written is “presentational” (see [this blog post](https://medium.com/@dan_abramov/smart-and-dumb-components-7ca2f9a7c7d0)) in that it doesn’t talk to anything external to its own implementation. To get data into it, we need a “container”.

This example uses [Vuex](https://vuex.vuejs.org), Vue's default data management library, to build a simple data model for our app. However, the pattern used here applies just as well to other data management libraries like [Apollo](https://www.apollographql.com/client/) and [MobX](https://mobx.js.org/).

First, install vuex with

```bash
yarn add vuex
```

Then we’ll construct a simple Vuex store that responds to actions that change the state of tasks, in a file called `src/store.js` (intentionally kept simple):

```javascript
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

In our top-level app component (`src/App.vue`) we can wire the store into our component heirarchy failry easily:

```html
<template>
  <div id="app">
    <task-list/>
  </div>
</template>

<script>
import store from "./store";
import TaskList from "./containers/TaskList.vue";
import "../src/index.css";

export default {
  name: "app",
  store,
  components: {
    TaskList
  }
};
</script>
```

Then we'll update our `TaskList` to read data out of the store. First let's move our existing presentational version to the file `src/components/PureTaskList` (renaming the component to `pure-task-list`), and wrap it with a container in `src/containers/TaskList.vue`:

```html
<template>
  <div>
    <pure-task-list :tasks="tasks"/>
  </div>
</template>

<script>
import PureTaskList from "@/components/PureTaskList";
import { mapState } from "vuex";

export default {
  name: "task-list",
  components: {
    PureTaskList
  },
  computed: {
    ...mapState(["tasks"])
  }
};
</script>
```

The reason to keep the presentational version of the `TaskList` separate is because it is easier to test and isolate. As it doesn't rely on the presence of a store it is much easier to deal with from a testing perspective. We can ensure our stories use the presentational version:

```javascript
import { storiesOf } from '@storybook/vue';
import { task } from './Task.stories';

import PureTaskList from './PureTaskList';
import { methods } from './Task.stories';

export const defaultTaskList = [
  { ...task, id: '1', title: 'Task 1' },
  { ...task, id: '2', title: 'Task 2' },
  { ...task, id: '3', title: 'Task 3' },
  { ...task, id: '4', title: 'Task 4' },
  { ...task, id: '5', title: 'Task 5' },
  { ...task, id: '6', title: 'Task 6' },
];

export const withPinnedTasks = [
  ...defaultTaskList.slice(0, 5),
  { id: '6', title: 'Task 6 (pinned)', state: 'TASK_PINNED' },
];

const paddedList = () => {
  return {
    template: '<div style="padding: 3rem;"><story/></div>',
  };
};

storiesOf('PureTaskList', module)
  .addDecorator(paddedList)
  .add('default', () => ({
    components: { PureTaskList },
    template: `<pure-task-list :tasks="tasks" @archiveTask="onArchiveTask" @pinTask="onPinTask"/>`,
    data: () => ({
      tasks: defaultTaskList,
    }),
    methods,
  }))
  .add('withPinnedTasks', () => ({
    components: { PureTaskList },
    template: `<pure-task-list :tasks="tasks" @archiveTask="onArchiveTask" @pinTask="onPinTask"/>`,
    data: () => ({
      tasks: withPinnedTasks,
    }),
    methods,
  }))
  .add('loading', () => ({
    components: { PureTaskList },
    template: `<pure-task-list loading @archiveTask="onArchiveTask" @pinTask="onPinTask"/>`,
    methods,
  }))
  .add('empty', () => ({
    components: { PureTaskList },
    template: `<pure-task-list  @archiveTask="onArchiveTask" @pinTask="onPinTask"/>`,
    methods,
  }));
```

<video autoPlay muted playsInline loop>
  <source
    src="/finished-tasklist-states.mp4"
    type="video/mp4"
  />
</video>

Similarly, we need to use `PureTaskList` in our Jest test:

```js
import React from 'react';
import ReactDOM from 'react-dom';
import { PureTaskList } from './TaskList';

it('renders when empty', () => {
  const div = document.createElement('div');
  const events = { onSnoozeTask: jest.fn(), onPinTask: jest.fn(), onArchiveTask: jest.fn() };
  ReactDOM.render(<PureTaskList tasks={[]} {...events} />, div);
  ReactDOM.unmountComponentAtNode(div);
});
```
