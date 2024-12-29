---
title: '绑定数据'
tocTitle: '数据'
description: '学习如何在您的 UI 组件中绑定数据'
commit: '30e306d'
---

到目前为止，我们创建了隔离的无状态组件 - 这对于 Storybook 来说没问题，但是在真实 app 中只有绑定了数据才有意义。

这份教程不会关注如何构建一个特定的 app，所以我们不会深入这些细节。但是，我们将花点时间来看看容器组件绑定数据的常见模式。

## 容器组件（Container components）

我们目前编写的 `TaskList` 组件是一个“展示型（presentational）”的组件，不会与其实现之外的任何东西进行交流。为了将数据放进该组件，我们需要一个“容器”。

此示例使用 [Pinia](https://pinia.vuejs.org/)，Vue 默认的数据管理库，来为我们的 app 创建一个直观的数据模型。但是，此处使用的模式同样也适用于其他的数据管理库，例如 [Apollo](https://www.apollographql.com/client/) 和 [MobX](https://mobx.js.org/)。

为项目添加必要的依赖：

```shell
yarn add pinia
```

首先，我们在 `src/store.js` 中我们构建了一个简单（故意保持简单）的 Pinia store 来处理一些可能改变状态的操作。

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

然后我们将通过读取 store 中的数据来更新 `TaskList`。首先，将我们现有的演示版本移入文件 `src/components/PureTaskList.vue` 中（将组件重命名为 `PureTaskList`），并用容器包裹它。

在 `src/components/PureTaskList.vue` 文件中：

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

在 `src/components/TaskList.vue` 文件中：

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

将 `TaskList` 的展示版本分离的原因是测试和隔离更加方便。因为它不依赖于 store 存在，所以从测试角度来说更易处理。让我们将 `src/components/TaskList.stories.js` 重命名为 `src/components/PureTaskList.stories.js` 并确保在 story 中使用展示版本：

```diff:title=src/components/PureTaskList.stories.js
+ import PureTaskList from './PureTaskList.vue';

import * as TaskStories from './Task.stories';

export default {
+ component: PureTaskList,
+ title: 'PureTaskList',
  tags: ['autodocs'],
  decorators: [() => ({ template: '<div style="margin: 3em;"><story/></div>' })],
  args: {
    ...TaskStories.ActionsData,
  }
};

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

<video autoPlay muted playsInline loop>
  <source
    src="/intro-to-storybook/finished-puretasklist-states-7-0.mp4"
    type="video/mp4"
  />
</video>

<div class="aside">
💡 别忘记提交您的代码到 git！
</div>

现在我们从 Pinia store 中获取了一些实际数据来填充组件，我们可以在 `src/App.vue` 中绑定并渲染它。不用担心，我们将在下一个章节讨论这个问题。
