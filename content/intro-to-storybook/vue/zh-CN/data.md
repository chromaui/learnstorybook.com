---
title: '绑定数据'
tocTitle: '数据'
description: '学习如何在您的UI组件中绑定数据'
commit: 'bd77a32'
---

我们创建了隔离的无状态组件 -这对于 Storybook 来说没问题，但是在真实 app 中只有绑定了数据后这样的组件才有意义。

这份教程不会关注如何构建一个特定的 app，所以我们不会讨论一些构建 app 的细节。但是我们将会花点时间来研究一下通常是如何给一个容器组件绑定数据。

## 容器组件（Container components）

我们目前编写的`TaskList`组件属于一个“表示型（presentational）”的组件（参照[这篇博客](https://medium.com/@dan_abramov/smart-and-dumb-components-7ca2f9a7c7d0)），意味着该组件不会告诉外部它自己的实现。为了将数据放进该组件，我们需要一个“容器”。

此示例使用[Vuex](https://vuex.vuejs.org)，一个 Vue 默认的数据管理库，来为我们的 app 创建一个直观的数据模型。不过此处的示例同样也适用于其他的数据管理库，例如[Apollo](https://www.apollographql.com/client/)和[MobX](https://mobx.js.org/)。

首先通过下面的命令安装 vuex：

```bash
yarn add vuex@next --save
```

在`src/store.js`中我们构建了一个标准的 Vuex store 来处理一些可能的改变状态的操作。

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

下一步, 我们需要更新应用的入口文件 (`src/main.js`)以帮助我们更轻松的将 store 集成到组件结构中:

```diff:title=src/main.js
import { createApp } from 'vue';

import App from './App.vue';

+ import store from './store';

- createApp(App).mount('#app')
+ createApp(App).use(store).mount('#app')
```

当我们在 app 中使用了 store 后，我们需要更新顶层的组件(`src/App.vue`)来显示`TaskList`组件。

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

接下来我们更新`TaskList`让其读取 store 中的数据。首先让我们将目前的表示型版本移动到文件`src/components/PureTaskList.vue`中（重命名组件为`PureTaskList`），并用容器包裹起来。

在`src/components/PureTaskList.vue`中：

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

将`TaskList`的表示型版本分离开的原因是，这使得我们的测试和隔离更加容易。同时因为它不依赖 store，所以从测试的角度来说将变的更加容易。重命名`src/components/TaskList.stories.js`为`src/components/PureTaskList.stories.js`，并在我们的 story 中使用表示型版本：

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

同样的，我们也需要在 Jest 测试中使用`PureTaskList`：

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
💡 您需要更新快照来应对上述的修改。加上<code>-u</code>重新运行测试命令来更新快照。同时别忘记提交您的代码！
</div>
