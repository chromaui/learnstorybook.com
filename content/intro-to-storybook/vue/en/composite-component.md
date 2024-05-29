---
title: 'Assemble a composite component'
tocTitle: 'Composite component'
description: 'Assemble a composite component out of simpler components'
commit: '3221bbb'
---

Last chapter, we built our first component; this chapter extends what we learned to make TaskList, a list of Tasks. Let’s combine components together and see what happens when we introduce more complexity.

## Tasklist

Taskbox emphasizes pinned tasks by positioning them above default tasks. It yields two variations of `TaskList` you need to create stories for, default and pinned items.

![default and pinned tasks](/intro-to-storybook/tasklist-states-1.png)

Since `Task` data can be sent asynchronously, we **also** need a loading state to render in the absence of a connection. In addition, we require an empty state for when there are no tasks.

![empty and loading tasks](/intro-to-storybook/tasklist-states-2.png)

## Get set up

A composite component isn’t much different from the basic components it contains. Create a `TaskList` component and an accompanying story file: `src/components/TaskList.vue` and `src/components/TaskList.stories.js`.

Start with a rough implementation of the `TaskList`. You’ll need to import the `Task` component from earlier and pass in the attributes as inputs.

```html:title=src/components/TaskList.vue
<template>
  <div class="list-items">
    <template v-if="loading"> loading </template>
    <template v-else-if="isEmpty"> empty </template>
    <template v-else>
      <Task
        v-for="task in tasks"
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
  name: 'TaskList',
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

Next, create `Tasklist`’s test states in the story file.

```js:title=src/components/TaskList.stories.js
import TaskList from './TaskList.vue';

import * as TaskStories from './Task.stories';

export default {
  component: TaskList,
  title: 'TaskList',
  tags: ['autodocs'],
  decorators: [() => ({ template: '<div style="margin: 3em;"><story/></div>' })],
  args: {
    ...TaskStories.ActionsData,
  }
}

export const Default = {
  args: {
    // Shaping the stories through args composition.
    // The data was inherited from the Default story in Task.stories.js.
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

<div class="aside">

💡[**Decorators**](https://storybook.js.org/docs/writing-stories/decorators) are a way to provide arbitrary wrappers to stories. In this case we’re using a decorator key on the default export to add some `margin` around the rendered component. But they can also be used to add other context to components, as we'll see later.

</div>

By importing `TaskStories`, we were able to [compose](https://storybook.js.org/docs/writing-stories/args#args-composition) the arguments (args for short) in our stories with minimal effort. That way, the data and actions (mocked callbacks) expected by both components are preserved.

Now check Storybook for the new `TaskList` stories.

<video autoPlay muted playsInline loop>
  <source
    src="/intro-to-storybook/inprogress-tasklist-states-7-0.mp4"
    type="video/mp4"
  />
</video>

## Build out the states

Our component is still rough, but now we have an idea of the stories to work toward. You might be thinking that the `.list-items` wrapper is overly simplistic. You're right – in most cases, we wouldn’t create a new component just to add a wrapper. But the **real complexity** of the `TaskList` component is revealed in the edge cases `withPinnedTasks`, `loading`, and `empty`.

```diff:title=src/components/TaskList.vue
<template>
  <div class="list-items">
    <template v-if="loading">
+     <div v-for="n in 6" :key="n" class="loading-item">
+       <span class="glow-checkbox" />
+       <span class="glow-text">
+         <span>Loading</span> <span>cool</span> <span>state</span>
+       </span>
+     </div>
    </template>

    <div v-else-if="isEmpty" class="list-items">
+     <div class="wrapper-message">
+       <span class="icon-check" />
+       <p class="title-message">You have no tasks</p>
+       <p class="subtitle-message">Sit back and relax</p>
+     </div>
    </div>

    <template v-else>
+     <Task
+       v-for="task in tasksInOrder"
+       :key="task.id"
+       :task="task"
+       @archive-task="onArchiveTask"
+       @pin-task="onPinTask"
+     />
   </template>
  </div>
</template>

<script>
import Task from './Task.vue';
import { reactive, computed } from 'vue';

export default {
  name: 'TaskList',
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
+     tasksInOrder:computed(()=>{
+       return [
+         ...props.tasks.filter(t => t.state === 'TASK_PINNED'),
+         ...props.tasks.filter(t => t.state !== 'TASK_PINNED'),
+       ]
+     }),
      /**
       * Event handler for archiving tasks
       */
      onArchiveTask(taskId) {
        emit('archive-task',taskId);
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

The added markup results in the following UI:

<video autoPlay muted playsInline loop>
  <source
    src="/intro-to-storybook/finished-tasklist-states-7-0.mp4"
    type="video/mp4"
  />
</video>

Note the position of the pinned item in the list. We want the pinned item to render at the top of the list to make it a priority for our users.

<div class="aside">
💡 Don't forget to commit your changes with git!
</div>
