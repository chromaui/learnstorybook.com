---
title: "Assemble a composite component"
tocTitle: "Composite component"
description: "Assemble a composite component out of simpler components"
commit: c72f06f
---

Last chapter we built our first component; this chapter extends what we learned to build TaskList, a list of Tasks. Let’s combine components together and see what happens when more complexity is introduced.

## Tasklist

Taskbox emphasizes pinned tasks by positioning them above default tasks. This yields two variations of `TaskList` you need to create stories for: default items and default and pinned items.

![default and pinned tasks](/tasklist-states-1.png)

Since `Task` data can be sent asynchronously, we **also** need a loading state to render in the absence of a connection. In addition, an empty state is required when there are no tasks.

![empty and loading tasks](/tasklist-states-2.png)

## Get setup

A composite component isn’t much different than the basic components it contains. Create a `TaskList` component and an accompanying story file: `src/components/TaskList.vue` and `src/components/TaskList.stories.js`.

Start with a rough implementation of the `TaskList`. You’ll need to import the `Task` component from earlier and pass in the attributes and actions as inputs.

```html
<template>
  <div>
    <div class="list-items" v-if="loading"> loading </div>
    <div class="list-items" v-if="noTasks && !this.loading">empty </div>
    <div class="list-items" v-if="showTasks">
      <task v-for="(task, index) in tasks" :key="index" :task="task"
        @archiveTask="$emit('archiveTask', $event)" @pinTask="$emit('pinTask', $event)"/>
    </div>
  </div>
</template>

<script>
import Task from "./Task";
export default {
  name: "task-list",
  props: {
    loading: {
      type: Boolean,
      default: false
    },
    tasks: {
      type: Array,
      default() {
        return [];
      }
    }
  },
  components: {
    Task
  },
  computed: {
    noTasks() {
      return this.tasks.length === 0;
    },
    showTasks() {
      return !this.loading && !this.noTasks;
    }
  }
};
</script>
```

Next create `Tasklist`’s test states in the story file.

```javascript
import { storiesOf } from '@storybook/vue';
import { task } from './Task.stories';

import TaskList from './TaskList';
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

storiesOf('TaskList', module)
  .addDecorator(paddedList)
  .add('default', () => ({
    components: { TaskList },
    template: `<task-list :tasks="tasks" @archiveTask="onArchiveTask" @pinTask="onPinTask"/>`,
    data: () => ({
      tasks: defaultTaskList,
    }),
    methods,
  }))
  .add('withPinnedTasks', () => ({
    components: { TaskList },
    template: `<task-list :tasks="tasks" @archiveTask="onArchiveTask" @pinTask="onPinTask"/>`,
    data: () => ({
      tasks: withPinnedTasks,
    }),
    methods,
  }))
  .add('loading', () => ({
    components: { TaskList },
    template: `<task-list loading @archiveTask="onArchiveTask" @pinTask="onPinTask"/>`,
    methods,
  }))
  .add('empty', () => ({
    components: { TaskList },
    template: `<task-list  @archiveTask="onArchiveTask" @pinTask="onPinTask"/>`,
    methods,
  }));
```

`addDecorator()` allows us to add some “context” to the rendering of each task. In this case we add padding around the list to make it easier to visually verify.

<div class="aside">
<a href="https://storybook.js.org/addons/introduction/#1-decorators"><b>Decorators</b></a> are a way to provide arbitrary wrappers to stories. In this case we’re using a decorator to add styling. They can also be used to add other context to components, as we'll see later.
</div>

`task` supplies the shape of a `Task` that we created and exported from the `Task.stories.js` file. Similarly, `methods` defines the actions (mocked callbacks) that a `Task` component expects, which the `TaskList` also needs.

Now check Storybook for the new `TaskList` stories.

<video autoPlay muted playsInline loop>
  <source
    src="/inprogress-tasklist-states.mp4"
    type="video/mp4"
  />
</video>

## Build out the states

Our component is still rough but now we have an idea of the stories to work toward. You might be thinking that the `.list-items` wrapper is overly simplistic. You're right – in most cases we wouldn’t create a new component just to add a wrapper. But the **real complexity** of `TaskList` component is revealed in the edge cases `withPinnedTasks`, `loading`, and `empty`.

```html
<template>
  <div>
    <div v-if="loading">
      <div class="loading-item" v-for="(n, index) in 5" :key="index">
        <span class="glow-checkbox" />
        <span class="glow-text">
          <span>Loading</span> <span>cool</span> <span>state</span>
        </span>
      </div>
    </div>
    <div class="list-items" v-if="noTasks && !this.loading">
      <div class="wrapper-message">
        <span class="icon-check" />
        <div class="title-message">You have no tasks</div>
        <div class="subtitle-message">Sit back and relax</div>
      </div>
    </div>
    <div class="list-items" v-if="showTasks">
      <task v-for="(task, index) in tasksInOrder" :key="index" :task="task"
        @archiveTask="$emit('archiveTask', $event)" @pinTask="$emit('pinTask', $event)"/>
    </div>
  </div>
</template>

<script>
import Task from "./Task";
export default {
  name: "task-list",
  props: {
    loading: {
      type: Boolean,
      default: false
    },
    tasks: {
      type: Array,
      default() {
        return [];
      }
    }
  },
  components: {
    Task
  },
  computed: {
    noTasks() {
      return this.tasks.length === 0;
    },
    showTasks() {
      return !this.loading && !this.noTasks;
    },
    tasksInOrder() {
      return [
        ...this.tasks.filter(t => t.state === "TASK_PINNED"),
        ...this.tasks.filter(t => t.state !== "TASK_PINNED")
      ];
    }
  }
};
</script>
```

The added markup results in the following UI:

<video autoPlay muted playsInline loop>
  <source
    src="/finished-tasklist-states.mp4"
    type="video/mp4"
  />
</video>

Note the position of the pinned item in the list. We want the pinned item to render at the top of the list to make it a priority for our users.

## Automated testing

In the previous chapter we learned how to snapshot test stories using Storyshots. With `Task` there wasn’t a lot of complexity to test beyond that it renders OK. Since `TaskList` adds another layer of complexity we want to verify that certain inputs produce certain outputs in a way amenable to automatic testing. To do this we’ll create unit tests using [Jest](https://facebook.github.io/jest/) coupled with a test renderer such as [Enzyme](http://airbnb.io/enzyme/).

![Jest logo](/logo-jest.png)

### Unit tests with Jest

Storybook stories paired with manual visual tests and snapshot tests (see above) go a long way to avoiding UI bugs. If stories cover a wide variety of component use cases, and we use tools that ensure a human checks any change to the story, errors are much less likely.

However, sometimes the devil is in the details. A test framework that is explicit about those details is needed. Which brings us to unit tests.

In our case, we want our `TaskList` to render any pinned tasks **before** unpinned tasks that it is passed in the `tasks` prop. Although we have a story (`withPinnedTasks`) to test this exact scenario; it can be ambiguous to a human reviewer that if the component **stops** ordering the tasks like this, it is a bug. It certainly won’t scream **“Wrong!”** to the casual eye.

So, to avoid this problem, we can use Jest to render the story to the DOM and run some DOM querying code to verify salient features of the output.

Create a test file called `tests/unit/TaskList.spec.js`. Here we’ll build out our tests that make assertions about the output.

```javascript
import Vue from 'vue';
import TaskList from '../../src/components/TaskList.vue';
import { withPinnedTasks } from '../../src/components/TaskList.stories';

it('renders pinned tasks at the start of the list', () => {
  const Constructor = Vue.extend(TaskList);
  const vm = new Constructor({
    propsData: { tasks: withPinnedTasks },
  }).$mount();
  const lastTaskInput = vm.$el.querySelector('.list-item:nth-child(1).TASK_PINNED');

  // We expect the pinned task to be rendered first, not at the end
  expect(lastTaskInput).not.toBe(null);
});
```

![TaskList test runner](/tasklist-testrunner.png)

Note that we’ve been able to reuse the `withPinnedTasks` list of tasks in both story and unit test; in this way we can continue to leverage an existing resource (the examples that represent interesting configurations of a component) in more and more ways.

Notice as well that this test is quite brittle. It's possible that as the project matures, and the exact implementation of the `Task` changes --perhaps using a different classname--the test will fail, and need to be updated. This is not necessarily a problem, but rather an indication to be careful liberally using unit tests for UI. They're not easy to maintain. Instead rely on visual, snapshot, and visual regression (see [testing chapter](/test/)) tests where possible.
