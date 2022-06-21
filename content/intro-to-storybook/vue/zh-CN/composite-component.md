---
title: '组装复合组件'
tocTitle: '合成组件'
description: '使用更简单的组件组装复合组件'
commit: '3a315d2'
---

我们在上一章构建了我们的第一个组件；这一章我们继续扩展所学并构建一个 TaskList，即一组 Task。让我们组合组件并看看当引入更多的复杂性时会发生什么。

## Tasklist

Taskbox 通过将固定 task（pinned tasks）置于其他默认 task 之上来强调固定 task。这就需要您针对两种类型的`TaskList`创建对应的 story：默认的以及默认并固定的。

![默认并固定的](/intro-to-storybook/tasklist-states-1.png)

因为`Task`的数据可以是非同步的，我们**还**需要一个当连接不存在时需要提供的 loading 状态。此外我们还需要一个空状态来对应没有 task 的情况。

![空的和loading状态的Task](/intro-to-storybook/tasklist-states-2.png)

## 配置

合成组件相比基本组件并没有太大区别。创建一个`TaskList`组件和其伴随 story 文件：`src/components/TaskList.vue` 和 `src/components/TaskList.stories.js`.

先简单实现以下`TaskList`。您需要先导入`Task`组件并将属性作为输入传入。

```html:title=src/components/TaskList.vue
<template>
  <div class="list-items">
    <template v-if="loading">
      loading
    </template>
    <template v-else-if="isEmpty">
      empty
    </template>
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
  import Task from './Task';
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

下一步我们在 story 文件中创建`Tasklist`的测试状态。

```js:title=src/components/TaskList.stories.js
import TaskList from './TaskList.vue';

import * as TaskStories from './Task.stories';

export default {
  component: TaskList,
  title: 'TaskList',
  decorators: [() => ({ template: '<div style="margin: 3em;"><story/></div>' })],
  argTypes: {
    onPinTask: {},
    onArchiveTask: {},
  },
};

const Template = args => ({
  components: { TaskList },
  setup() {
    return { args, ...TaskStories.actionsData };
  },
  template: '<TaskList v-bind="args" />',
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

<div class="aside">
<a href="https://storybook.js.org/docs/vue/writing-stories/decorators"><b>装饰器</b></a> 提供了一种任意包装story的方法。上述例子中我们在default export中使用decorator关键字来添加样式。装饰器也可以给组件添加其他上下文，详见下文。
</div>

通过导入`TaskStories`，我们能够以最小的代价[合成](https://storybook.js.org/docs/vue/writing-stories/args#args-composition)story 中的参数（argument）。这样就为每个组件保留了其所需的数据和 action（模拟回调）。

现在在 Storybook 中查看新的`TaskList` story 吧。

<video autoPlay muted playsInline loop>
  <source
    src="/intro-to-storybook/inprogress-tasklist-states-6-0.mp4"
    type="video/mp4"
  />
</video>

## 创建状态

我们的组件仍然很粗糙但我们已经有了该如何构建 story 的方向。您可能觉得`.list-items`太过简单了。您是对的 - 大多数情况下我们不会仅仅为了增加一层包装就创建一个新组件。但是`WithPinnedTasks`，`loading`和 `empty`这些边界情况却揭示了`TaskList`**真正的复杂性**。

```diff:title=src/components/TaskList.vue
<template>
  <div class="list-items">
    <template v-if="loading">
+     <div v-for="n in 6" :key="n" class="loading-item">
+       <span class="glow-checkbox" />
+       <span class="glow-text"> <span>Loading</span> <span>cool</span> <span>state</span> </span>
+     </div>
    </template>

    <div v-else-if="isEmpty" class="list-items">
+     <div class="wrapper-message">
+       <span class="icon-check" />
+       <div class="title-message">You have no tasks</div>
+       <div class="subtitle-message">Sit back and relax</div>
+     </div>
    </div>

    <template v-else>
+     <Task v-for="task in tasksInOrder"
+       :key="task.id"
+       :task="task"
+       @archive-task="onArchiveTask
+       @pin-task="onPinTask"/>
    </template>
  </div>
</template>

<script>
import Task from './Task';
import { reactive, computed } from 'vue';

export default {
  name: 'TaskList',
  components: { Task },
  props: {
    tasks: { type: Array, required: true, default: () => [] },
    loading: { type: Boolean, default: false },
  },
  emits: ["archive-task", "pin-task"],

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
    src="/intro-to-storybook/finished-tasklist-states-6-0.mp4"
    type="video/mp4"
  />
</video>

注意固定项目出现在列表中的位置。我们希望固定项目可以出现在列表的顶端以提示用户其优先度。

## 自动化测试

在上一章中我们学习了如何使用 Storyshots 来进行快照测试。`Task`没有太多的复杂性，所以已经够用了。对于`TaskList`来说其增加了另一层复杂性，这就需要我们寻找一个合适的自动化测试方法来验证特定的输入可以产生特定的输出。我们使用[Jest](https://facebook.github.io/jest/)加测试渲染器来创建单元测试。

![Jest logo](/intro-to-storybook/logo-jest.png)

### 使用 Jest 进行单元测试

Storybook 使用手动检查和快照测试的方式来防止 UI 的 bug。看起来好像只要我们覆盖了足够多的场景，并且使用一些工具保证可以人为检查 story 的变化后，错误将会大大减少。

但是，魔鬼存在于细节中。我们还需要一个测试框架来显示的实现上述需求。也就是单元测试。

在我们的例子中，我们希望`TastList`可以将`tasks`属性中的固定 task 渲染在非固定 task 的**上面**。尽管我们已经有一个 story (`WithPinnedTasks`)来对应此场景；但对于任何人为的检查来说仍然过于含糊了，因此当组件**停止**按上述那样排序时 bug 就产生了。很显然这样的测试并不会大声告诉您**你错了！**。

所以为了防止这样的问题发生，我们可以使用 Jest 将 story 渲染成 DOM，然后跑一些 DOM 查询代码来验证输出中重要的部分。story 的 format 非常棒的一点在于，我们只需要简单的导入 story 到我们的测试中就可以渲染它了！

创建一个测试文件`tests/unit/TaskList.spec.js`。我们创建测试来判断输出结果。

```js:title=tests/unit/TaskList.spec.js
import { mount } from '@vue/test-utils';

import TaskList from '../../src/components/TaskList.vue';

//👇 Our story imported here
import { WithPinnedTasks } from '../../src/components/TaskList.stories';

test('renders pinned tasks at the start of the list', () => {
  const wrapper = mount(TaskList, {
    //👇 Story's args used with our test
    propsData: WithPinnedTasks.args,
  });
  const firstPinnedTask = wrapper.find('.list-item:nth-child(1).TASK_PINNED');
  expect(firstPinnedTask).not.toBe(null);
});
```

![TaskList test runner](/intro-to-storybook/tasklist-testrunner.png)

注意我们可以在 story 和单元测试中重用`withPinnedTasksData`；这样我们就可以继续以越来越多的方式运用现有资源（代表组件各种有趣配置的示例）。

请注意这个测试仍然十分脆弱。随着项目逐渐成熟，以及`Task`的实现改变时 -- 也许使用了另一个类名 -- 那测试很可能失败，这需要我们去更新它。这不一定是个问题，但是在 UI 中使用单元测试仍需十分小心。它们的维护工作并不容易。除了依靠肉眼，快照和视觉回归（visual regression）（参见[测试章节](/intro-to-storybook/vue/zh-CN/test/)）。

<div class="aside">
别忘记提交您的代码到git！
</div>
