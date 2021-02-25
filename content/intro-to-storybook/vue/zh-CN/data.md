---
title: '绑定数据'
tocTitle: '数据'
description: '学习如何在您的UI组件中绑定数据'
commit: 'fa1c954'
---

我们创建了隔离的无状态组件 -这对于 Storybook 来说没问题，但是在真实 app 中只有绑定了数据后这样的组件才有意义。

这份教程不会关注如何构建一个特定的 app，所以我们不会讨论一些构建 app 的细节。但是我们将会花点时间来研究一下通常是如何给一个容器组件绑定数据。

## 容器组件（Container components）

我们目前编写的`TaskList`组件属于一个“表示型（presentational）”的组件（参照[这篇博客](https://medium.com/@dan_abramov/smart-and-dumb-components-7ca2f9a7c7d0)），意味着该组件不会告诉外部它自己的实现。为了将数据放进该组件，我们需要一个“容器”。

此示例使用[Vuex](https://vuex.vuejs.org)，一个 Vue 默认的数据管理库，来为我们的 app 创建一个直观的数据模型。不过此处的示例同样也适用于其他的数据管理库，例如[Apollo](https://www.apollographql.com/client/)和[MobX](https://mobx.js.org/)。

首先通过下面的命令安装 vuex：

```bash
yarn add vuex
```

在`src/store.js`中我们构建了一个标准的 Vuex store 来处理一些可能的改变状态的操作。

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

在顶层的 app 组件（`src/App.vue`）中我们可以非常容易的将 store 绑定到我们的组件结构中：

```html
<!--src/App.vue -->

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

接下来我们更新`TaskList`让其读取 store 中的数据。首先让我们将目前的表示型版本移动到文件`src/components/PureTaskList.vue`中（重命名组件为`PureTaskList`），并用容器包裹起来。

在`src/components/PureTaskList.vue`中：

```html
<!-- src/components/PureTaskList.vue -->

<template>
  <!-- 和之前的内容一致 -->
</template>

<script>
  import Task from './Task';
  export default {
    name: 'PureTaskList',
    // 和之前的内容一致
  };
</script>
```

在`src/components/TaskList.vue`中：

```html
<!-- src/components/TaskList.vue -->

<template>
  <PureTaskList :tasks="tasks" v-on="$listeners" @archive-task="archiveTask" @pin-task="pinTask" />
</template>

<script>
  import PureTaskList from './PureTaskList';
  import { mapState, mapActions } from 'vuex';

  export default {
    components: { PureTaskList },

    methods: mapActions(['archiveTask', 'pinTask']),

    computed: mapState(['tasks']),
  };
</script>
```

将`TaskList`的表示型版本分离开的原因是，这使得我们的测试和隔离更加容易。同时因为它不依赖 store，所以从测试的角度来说将变的更加容易。重命名`src/components/TaskList.stories.js`为`src/components/PureTaskList.stories.js`，并在我们的 story 中使用表示型版本：

```javascript
// src/components/PureTaskList.stories.js

import PureTaskList from './PureTaskList';
import * as TaskStories from './Task.stories';

export default {
  component: PureTaskList,
  title: 'PureTaskList',
  decorators: [() => '<div style="padding: 3rem;"><story /></div>'],
};

const Template = (args, { argTypes }) => ({
  components: { PureTaskList },
  props: Object.keys(argTypes),
  // 重用task.stories.js中的actions
  methods: TaskStories.actionsData,
  template: '<PureTaskList v-bind="$props" @pin-task="onPinTask" @archive-task="onArchiveTask" />',
});

export const Default = Template.bind({});
Default.args = {
  // 使用args来来改变story外观。
  // 从task.stories.js的Default story继承数据。
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
  // 使用args来来改变story外观。
  // 从task.stories.js的Default story继承数据。
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
  // 使用args来来改变story外观。
  // 从task.stories.js的Default story继承数据。
  ...Loading.args,
  loading: false,
};
```

<video autoPlay muted playsInline loop>
  <source
    src="/intro-to-storybook/finished-tasklist-states.mp4"
    type="video/mp4"
  />
</video>

同样的，我们也需要在 Jest 测试中使用`PureTaskList`：

```js
// tests/unit/PureTaskList.spec.js

import Vue from 'vue';
import PureTaskList from '../../src/components/PureTaskList.vue';
import { WithPinnedTasks } from '../../src/components/PureTaskList.stories';

it('renders pinned tasks at the start of the list', () => {
  // render PureTaskList
  const Constructor = Vue.extend(PureTaskList);
  const vm = new Constructor({
    // ...using WithPinnedTasks.args
    propsData: WithPinnedTasks.args,
  }).$mount();
  const firstTaskPinned = vm.$el.querySelector('.list-item:nth-child(1).TASK_PINNED');

  // We expect the pinned task to be rendered first, not at the end
  expect(firstTaskPinned).not.toBe(null);
});
```

<div class="aside">

当您的快照测试失败时，您必须用-u 来重新运行测试脚本以便更新现有的快照。或者创建一个新的脚本来解决这个问题。

别忘记提交您的代码！

</div>
