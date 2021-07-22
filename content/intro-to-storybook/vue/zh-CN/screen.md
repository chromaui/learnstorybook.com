---
title: '构建一个页面'
tocTitle: '页面'
description: '用组件构建一个页面'
commit: '99d3d65'
---

我们关注了如何自底向上的构建 UI；从小规模起步逐渐增加复杂性。这样我们可以独立的开发每个组件，弄清其所需的数据，以及如何将其应用于 Storybook。所有的这些操作都不需要我们启动一个服务器或者创建一个页面！

在本章节中我们继续增加复杂性，我们将组件组合成一个页面并在 Storybook 中应用它。

## 嵌套的容器组件

因为我们的应用十分简单，所以我们要构建的页面也十分简单，只需要给`TaskList`容器组件（使用 Vuex 中的数据）添加一些布局，并使用 store 创建一个顶层的`error`字段（例如当我们遇到一些服务器连接问题时我们可以设置此字段）。在`src/components/`文件夹中创建一个表示型组件`PureInboxScreen.vue`。

```html:title=src/components/PureInboxScreen.vue
<template>
  <div>
    <div v-if="error" class="page lists-show">
      <div class="wrapper-message">
        <span class="icon-face-sad" />
        <div class="title-message">Oh no!</div>
        <div class="subtitle-message">Something went wrong</div>
      </div>
    </div>
    <div v-else class="page lists-show">
      <nav>
        <h1 class="title-page">
          <span class="title-wrapper">Taskbox</span>
        </h1>
      </nav>
      <TaskList />
    </div>
  </div>
</template>

<script>
  import TaskList from './TaskList.vue';
  export default {
    name: 'PureInboxScreen',
    components: { TaskList },
    props: {
      error: { type: Boolean, default: false },
    },
  };
</script>
```

接着我们创建一个容器，为`src/components/InboxScreen.vue`中的`PureInboxScreen`抓取数据：

```html:title=src/components/InboxScreen.vue
<template>
  <PureInboxScreen :error="error" />
</template>

<script>
  import { computed } from 'vue';

  import { useStore } from 'vuex';

  import PureInboxScreen from './PureInboxScreen';

  export default {
    name: 'InboxScreen',
    components: { PureInboxScreen },
    setup() {
      //👇 Creates a store instance
      const store = useStore();

      //👇 Retrieves the error from the store's state
      const error = computed(() => store.state.error);
      return {
        error,
      };
    },
  };
</script>
```

同时我们修改`App`组件让其渲染`InboxScreen`（最终我们会使用路由来决定渲染哪个页面，现在我们暂时不需要担心这些）：

```diff:title=src/App.vue
<template>
  <div id="app">
-   <task-list />
+   <InboxScreen />
  </div>
</template>

<script>
- import TaskList from './components/TaskList.vue';
+ import InboxScreen from './components/InboxScreen.vue';
  export default {
    name: 'app',
    components: {
-     TaskList
+     InboxScreen,
    },
  };
</script>

<style>
  @import './index.css';
</style>
```

但是，当在 Storybook 中渲染 story 时事情就变得有趣起来了。

正如我们之前所见的，`TaskList`组件作为一个**容器**负责渲染`PureTaskList`这个表示型组件。我们定义了容器组件不能简单的被隔离式地渲染；我们希望传递给它们一些上下文或者让它们和某个服务进行通信。这表示如果我们希望在 Storybook 中渲染一个容器，我们必须模拟（例如提供一个虚拟版本）一个其所需的上下文或者服务。

当在 Storybook 中处理`TaskList`时，我们可以简单的通过渲染`PureTaskList`来回避这个问题。我们这里同样通过渲染`PureInboxScreen`来解决此问题。

但是这里我们遇到的问题是，尽管`PureInboxScreen`本身是表示型的，但它的子组件`TaskList`却并不是。某种意义上来说`PureIndexScreen`被“容器性”所污染了。所以当我们设置`src/components/PureInboxScreen.stories.js`时：

```js:title=src/components/PureInboxScreen.stories.js
import PureInboxScreen from './PureInboxScreen.vue';

export default {
  component: PureInboxScreen,
  title: 'PureInboxScreen',
};

const Template = args => ({
  components: { PureInboxScreen },
  setup() {
    return {
      args,
    };
  },
  template: '<PureInboxScreen v-bind="args" />',
});

export const Default = Template.bind({});

export const Error = Template.bind({});
Error.args = { error: true };
```

我们发现尽管`error`的 story 运作正常，但因为`TaskList`没有连接相对应的 Vuex store，所以`default`的 story 出错了。（类似的问题同样出现在`PureIndexSreen`的单元测试中）。

![Broken inbox](/intro-to-storybook/broken-inboxscreen-vue.png)

回避此问题的一种方法是永远不要在您应用中渲染容器组件，除非该组件是最高层组件，并且在最高层组件中自顶而下的传递所有需要的数据。

但是，开发人员**将会**不可避免的在下层结构中渲染容器组件。如果我们想要在 Storybook 中渲染应用中大部分或者全部的组件（我们想！），我们仍需要一个解决方案。

<div class="aside">
💡 需要说明的是，自顶而下的传递数据是一种合理的解决方案，尤其是使用<a href="http://graphql.org/">GraphQL</a>时。这也是我们在<a href="https://www.chromatic.com">Chromatic</a>中构建超过800个story的方式。
</div>

## 在 story 中提供上下文

好消息是对于 story 来说在`PureInboxScreen`中使用 Vuex store 十分容易！我们可以在 story 文件中创建一个新的 store 作为上下文：

```diff:title=src/components/PureInboxScreen.stories.js
+ import { app } from '@storybook/vue3';

+ import { createStore } from 'vuex';

import PureInboxScreen from './PureInboxScreen.vue';

+ import { action } from '@storybook/addon-actions';
+ import * as TaskListStories from './PureTaskList.stories';

+ const store = createStore({
+   state: {
+     tasks: TaskListStories.Default.args.tasks,
+   },
+   actions: {
+     pinTask(context, id) {
+       action("pin-task")(id);
+     },
+     archiveTask(context, id) {
+       action("archive-task")(id);
+     },
+   },
+ });

+ app.use(store);

export default {
  title: 'PureInboxScreen',
  component: PureInboxScreen,
};

const Template = (args) => ({
  components: { PureInboxScreen },
  setup() {
    return {
      args,
    };
  },
  template: '<PureInboxScreen v-bind="args" />',
});

export const Default = Template.bind({});

export const Error = Template.bind({});
Error.args = { error: true };
```

使用其他的，例如[Apollo](https://www.npmjs.com/package/apollo-storybook-decorator)，[Relay](https://github.com/orta/react-storybooks-relay-container) 或者别的库时也可以利用类似的方法模拟上下文。

在 Storybook 中遍历状态让我们可以轻松的测试应用的正确性：

<video autoPlay muted playsInline loop >

  <source
    src="/intro-to-storybook/finished-inboxscreen-states-6-0.mp4"
    type="video/mp4"
  />
</video>

## 组件驱动开发

我们以`Task`起步，进一步实现`TaskList`，现在我们创建了整个页面的 UI。我们的`InboxScreen`包括了一个嵌套容器组件，以及一系列相关联的 story。

<video autoPlay muted playsInline loop style="width:480px; height:auto; margin: 0 auto;">
  <source
    src="/intro-to-storybook/component-driven-development-optimized.mp4"
    type="video/mp4"
  />
</video>

[**组件驱动开发**](https://www.componentdriven.org/)让您可以一步步的在升级组件结构的同时扩展应用的复杂性。同时也使得我们可以更专注于开发本身，并提高对所有可能的 UI 排列组合的覆盖率。简而言之，CDD 帮助您创建了高质量以及更复杂的 UI。

我们还没有完全结束 - 光创建 UI 是不够的。我们仍需要保证应用的耐用性。

<div class="aside">
💡 别忘了提交您的代码！
</div>
