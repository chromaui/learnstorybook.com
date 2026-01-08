---
title: '组装复合组件'
tocTitle: '合成组件'
description: '使用更简单的组件组装复合组件'
commit: '554783d'
---

我们在上一章构建了我们的第一个组件；这一章我们将扩展学习构建一个 Tasks 列表，即 TaskList 组件。让我们组合组件，并看看当引入更多的复杂性时会发生什么。

## Tasklist

Taskbox 通过将固定 task（pinned tasks）置于其他默认 task 之上来强调固定 task。这就需要您针对两种类型的`TaskList`创建对应的 story：默认的以及固定的 task。

![默认并固定的](/intro-to-storybook/tasklist-states-1.png)

因为 `Task` 的数据可以是异步的，我们**还**需要在连接不存的情况下渲染 loading 状态。此外，我们还需要一个空状态来对应没有 task 的情况。

![空的和loading状态的Task](/intro-to-storybook/tasklist-states-2.png)

## 配置

合成组件与其所包含基本组件并没有太大区别。创建一个 `TaskList` 组件和其对应的 story 文件：`src/components/TaskList.vue` 和 `src/components/TaskList.stories.js`。

从 `TaskList` 的粗略实现开始。您需要先导入先前的 `Task` 组件并将属性作为输入传入。

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

下一步，在 story 文件中创建 `Tasklist` 的测试状态。

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
  },
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

<div class="aside">

💡 [**Decorators - 装饰器**](https://storybook.js.org/docs/writing-stories/decorators) 提供了一种任意包装 story 的方法。上述例子中我们使用默认导出的 decorator 关键字给渲染的组件周围添加一些 `margin`。但是装饰器也可以给组件添加其他上下文，详见下文。

</div>

通过导入 `TaskStories`，我们能够以最小的代价[组合](https://storybook.js.org/docs/vue/writing-stories/args#args-composition) story 中的参数（argument）。这样，就为每个组件保留了其所需的数据和 action（模拟回调）。

现在在 Storybook 中查看新的 `TaskList` story 吧。

<video autoPlay muted playsInline loop>
  <source
    src="/intro-to-storybook/inprogress-tasklist-states-7-0.mp4"
    type="video/mp4"
  />
</video>

## 创建状态

我们的组件仍然很粗糙，但我们已经有了构建 story 的方向。您可能觉得 `.list-items` 太过简单了。您是对的 - 大多数情况下我们不会仅仅为了增加一层包装就创建一个新组件。但是 `WithPinnedTasks`，`loading` 和 `empty` 这些边界情况揭示了 `TaskList` **真正的复杂性**。

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

通过上述代码我们生成了如下 UI：

<video autoPlay muted playsInline loop>
  <source
    src="/intro-to-storybook/finished-tasklist-states-7-0.mp4"
    type="video/mp4"
  />
</video>

注意固定项目出现在列表中的位置。我们希望固定项目可以渲染在列表的顶端，从而提示用户其优先级。·

<div class="aside">
💡 别忘记提交您的代码到 git！
</div>
