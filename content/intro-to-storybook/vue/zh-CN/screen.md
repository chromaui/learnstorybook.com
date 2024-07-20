---
title: '构建一个页面'
tocTitle: '页面'
description: '用组件构建一个页面'
commit: 'af51337'
---

我们关注于自底向上构建 UI，从小规模起步逐渐增加复杂性。这样我们可以独立的开发每个组件，弄清其所需的数据，以及如何将其应用于 Storybook。所有的这些操作都不需要我们启动一个服务器或者创建一个页面！

在本章节中我们继续增加复杂性，我们将组件组合成一个页面并在 Storybook 中应用它。

## 嵌套的容器组件

因为我们的应用十分简单，所以我们要构建的页面也十分简单，只需要给 `TaskList` 容器组件（使用 Pinia 中的数据）添加一些布局，并使用 store 创建一个顶层的 `error` 字段（例如当我们遇到一些服务器连接问题时我们可以设置此字段）。在 `src/components/` 文件夹中创建一个展示型组件 `PureInboxScreen.vue`。

```html:title=src/components/PureInboxScreen.vue
<template>
  <div>
    <div v-if="error" class="page lists-show">
      <div class="wrapper-message">
        <span class="icon-face-sad" />
        <p class="title-message">Oh no!</p>
        <p class="subtitle-message">Something went wrong</p>
      </div>
    </div>
    <div v-else class="page lists-show">
      <nav>
        <h1 class="title-page">Taskbox</h1>
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

接着，我们可以创建一个容器，为 `src/components/InboxScreen.vue` 中的 `PureInboxScreen` 抓取数据：

```html:title=src/components/InboxScreen.vue
<template>
  <PureInboxScreen :error="isError" />
</template>

<script>
import PureInboxScreen from './PureInboxScreen';

import { computed } from 'vue';

import { useTaskStore } from '../store';

export default {
  name: 'InboxScreen',
  components: { PureInboxScreen },
  setup() {
    //👇 Creates a store instance
    const store = useTaskStore();

    //👇 Retrieves the error from the store's state
    const isError = computed(() => store.status==='error');
    return {
      isError,
    };
  },
};
</script>
```

下一步，我们需要修改应用的入口文件（`src/main.js`），这样我们就可以快速的将 store 绑定在组件的层次结构中：

```diff:title=src/main.js
import { createApp } from 'vue';
+ import { createPinia } from 'pinia';

import App from './App.vue';

- createApp(App).mount('#app')
+ createApp(App).use(createPinia()).mount('#app');
```

我们同样需要修改 `App` 组件让其渲染 `InboxScreen`（最终，我们将会使用路由来决定渲染哪个页面，现在我们暂时不需要关注这些）：

```diff:title=src/App.vue
<template>
  <div id="app">
-   <img alt="Vue logo" src="./assets/logo.png">
-   <HelloWorld msg="Welcome to Your Vue.js App"/>
+   <InboxScreen />
  </div>
</template>

<script>
- import HelloWorld from './components/HelloWorld.vue'
+ import InboxScreen from './components/InboxScreen.vue';

export default {
  name: 'App',
  components: {
-   HelloWorld
+   InboxScreen
  }
}
</script>

<style>
@import "./index.css";
</style>
```

然而，当在 Storybook 中渲染 story 时事情就变得有趣起来了。

正如我们之前所见的，`TaskList` 组件作为一个**容器**负责渲染 `PureTaskList` 这个展示型组件。根据定义，容器组件不能简单的被隔离式地渲染；它们被期望传递一些上下文或者与某个服务进行通信。这意味着如果我们希望在 Storybook 中渲染一个容器，我们必须 mock（例如提供一个虚拟版本）一个其所需的上下文或者服务。

当在 Storybook 中处理 `TaskList` 时，我们可以通过简单的渲染 `PureTaskList` 并避开容器来回避这个问题。我们将做类似的处理并在 Storybook 中渲染 `PureInboxScreen`。

但是，对于 `PureInboxScreen` 有一个问题。尽管 `PureInboxScreen` 自身是展示型的，但是其子组件 `TaskList` 不是。某种意义上来说，`PureInboxScreen` 已经被“容器性”污染了。所以当我们在 stroy 中设置 `src/components/PureInboxScreen.stories.js` 时：

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

我们可以发现尽管 `error` story 运作正常，但因为 `TaskList` 没有连接相对应的 Pinia store，所以 `default` 的 story 出错了。（你同样会遇到类似的问题当试图对 `PureInboxScreen` 进行单元测试时）。

![Broken inbox](/intro-to-storybook/broken-inboxscreen-vue-pinia.png)

回避此问题的一种方法是永远不要在您应用中渲染容器组件，除非该组件是最高层组件，并且在最高层组件中自顶而下的传递所有需要的数据。

但是，开发人员**将会**不可避免的在下层结构中渲染容器组件。如果我们想要在 Storybook 中渲染应用中大部分或者全部的组件（我们想！），我们仍需要一个解决方案。

<div class="aside">
💡 需要说明的是，自顶而下的传递数据是一种合理的解决方案，尤其是使用 <a href="http://graphql.org/">GraphQL</a> 时。这也是我们在 <a href="https://www.chromatic.com/?utm_source=storybook_website&utm_medium=link&utm_campaign=storybook">Chromatic</a> 中构建超过 800 个 story 的方式。
</div>

## 在 story 中提供上下文

好消息是在 story 中的 `PureInboxScreen` 中使用 Pinia store 十分容易！我们可以更新 story 并直接导入在上一章中创建的 Pinia store。

```diff:title=src/components/PureInboxScreen.stories.js
+ import { setup } from '@storybook/vue3';

+ import { createPinia } from 'pinia';

+ setup((app) => {app.use(createPinia())});

import PureInboxScreen from './PureInboxScreen.vue';

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

在其它库中也存在类似的方法提供模拟上下文，例如 [Apollo](https://www.npmjs.com/package/apollo-storybook-decorator)，[Relay](https://github.com/orta/react-storybooks-relay-container) 或者其他库。

在 Storybook 中遍历状态让我们可以轻松的测试应用的正确性：

<video autoPlay muted playsInline loop >

  <source
    src="/intro-to-storybook/finished-inboxscreen-states-6-0.mp4"
    type="video/mp4"
  />
</video>

## 交互测试

到目前为止，我们已经从头创建了一个功能齐全的应用，从简单组件到页面，并不断通过 story 来测试每个变动。但是每个新建的 story 需要手动检查其他所有 story 来确保 UI 没有崩溃。造成很多额外的工作。

难道我们就不能将该流程自动化并自动对组件进行交互测试吗？

### 通过 play 函数编写一个交互测试

Storybook 的 [`play`](https://storybook.js.org/docs/vue/writing-stories/play-function) 和 [`@storybook/addon-interactions`](https://storybook.js.org/docs/vue/writing-tests/interaction-testing) 帮助我们解决上述问题。一个 play 函数包含 story 渲染之后的一小段代码。

play 函数帮助我们验证当 task 更新后 UI 的变化。它使用与框架无关的 DOM API，这意味着不管什么框架，我们都可以通过编写 story 的 play 函数来与 UI 进行交互并模拟人类行为。

`@storybook/addon-interactions` 帮助我们在 Storybok 中可视化我们的测试，提供一个循序渐进的流程。它还提供了一些方便的 UI 控件，可以暂停、恢复、倒带并逐步完成每个交互。

让我们来看看它的实际应用，更新你新创建的 `PureInboxScreen` 文件，并通过添加以下内容来创建组件交互：

```diff:title=src/components/PureInboxScreen.stories.js
import { app } from '@storybook/vue3';

+ import { fireEvent, within } from '@storybook/testing-library';

import { createPinia } from 'pinia';

app.use(createPinia());

import PureInboxScreen from './PureInboxScreen.vue';

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

+ export const WithInteractions = Template.bind({});
+ WithInteractions.play = async ({ canvasElement }) => {
+   const canvas = within(canvasElement);
+   // Simulates pinning the first task
+   await fireEvent.click(canvas.getByLabelText('pinTask-1'));
+   // Simulates pinning the third task
+   await fireEvent.click(canvas.getByLabelText('pinTask-3'));
+ };
```

检查你最新创建的 story。点击 `Interactions` 面板来查看在 story play 函数中的交互列表。

<video autoPlay muted playsInline loop>

  <source
    src="/intro-to-storybook/storybook-interactive-stories-play-function.mp4"
    type="video/mp4"
  />
</video>

### 使用 test runner 进行自动化测试

通过 Storybook 的 play 函数，我们可以避开之前的问题，使我们能与 UI 进行交互，并在我们更新 task 时快速检测其变化 - 无需额外的手动工作确保 UI 的一致性。

但是，当我们仔细查看 Storybook，我们可以看到只有在查看 story 时才会运行交互测试。因此，我们在进行变更的时候仍然需要查看每个 story 从而运行所有的检查。我们就不能让它更加自动化么？

好消息是可以的！Storybook 的 [test runner](https://storybook.js.org/docs/vue/writing-tests/test-runner) 可以完成那样的操作。这是基于 [Playwright](https://playwright.dev/) 的一个独立的库 - 运行所有的交互测试并捕获 story 的错误。

让我们看看它时如何工作的！运行以下命令进行安装：

```shell
yarn add --dev @storybook/test-runner
```

下一步，更新 `package.json` 的 `scripts` 并添加一个新的测试任务：

```json:clipboard=false
{
  "scripts": {
    "test-storybook": "test-storybook"
  }
}
```

最后，在 Storybook 运行的情况下，打开新的控制台界面并运行以下命令：

```shell
yarn test-storybook --watch
```

<div class="aside">
💡 使用 play 函数的交互测试时测试 UI 组件的绝佳方式。它能做的远比目前看到的多；我们推荐您阅读<a href="https://storybook.js.org/docs/vue/writing-tests/interaction-testing">官方文档</a>进行深入了解。
<br />
为了深入了解测试，请查看<a href="/ui-testing-handbook">测试手册</a>。它涵盖了缩放前端（scaled-front-end）团队所使用的测试策略，以增强您的开发工作流程。
</div>

![Storybook test runner successfully runs all tests](/intro-to-storybook/storybook-test-runner-execution.png)

成功了！现在我们拥有一个工具，可以帮助我们检查所有的 story 渲染是否出错，并且所有的断言是否自动通过。更重要的是，如果一个测试失败了，它将会提供一个链接，该链接可以在浏览器打开失败的 story。

## 组件驱动开发

我们以 `Task` 起步，进一步实现了 `TaskList`，现在我们创建了整个页面的 UI。我们的 `InboxScreen` 包括了一个嵌套容器组件，以及一系列相关联的 story。

<video autoPlay muted playsInline loop style="width:480px; height:auto; margin: 0 auto;">
  <source
    src="/intro-to-storybook/component-driven-development-optimized.mp4"
    type="video/mp4"
  />
</video>

[**组件驱动开发**](https://www.componentdriven.org/)让您可以一步步的在升级组件结构的同时扩展应用的复杂性。同时也使得我们可以更专注于开发本身，并提高对所有可能的 UI 排列组合的覆盖率。简而言之，CDD 帮助您创建了高质量以及更复杂的交互界面。

我们还没有完全结束 - 光创建 UI 是不够的。我们仍需要保证应用的耐用性。

<div class="aside">
💡 别忘了提交您的代码！
</div>
