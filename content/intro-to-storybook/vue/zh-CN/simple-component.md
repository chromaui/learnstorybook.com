---
title: '构建一个简单的组件'
tocTitle: '简单组件'
description: '单独构建一个简单的组件'
commit: 'b586083'
---

我们将按照[组件驱动开发](https://www.componentdriven.org/) (CDD)来构建我们的 UI。这是一个自下而上的构建 UI 的过程，我们从组件开始以整个页面结束。CDD 可以帮助您在构建 UI 时衡量其复杂性。

## 任务

![任务组件的三个状态](/intro-to-storybook/task-states-learnstorybook.png)

`任务(Task)`是我们应用程序的核心组件。每个任务根据其状态的不同在显示上会略有不同。我们提供一个选中(未选中)的复选框，一些关于 Task 的信息和一个允许我们上下移动任务的“pin”按钮。我们需要下述的 props 来将它们整合起来：

- `title` – 描述任务的字符串
- `state` - 当前任务所在列表，以及其是否被选中？

在我们构建`Task`之前，首先我们根据上述的草图编写测试所需的状态(state)。然后我们使用 Storybook 模拟数据并独立的构建组件。我们可以“视觉测试”组件在每个状态下的外观。

## 开始设置

首先，让我们创建 task 组件以及它相关的 story 文件：`src/components/Task.vue` 和 `src/components/Task.stories.js`。

我们将从 `Task` 的基础实现开始，简单传入我们所需要的属性和需要对任务执行的两个操作（在列表之间移动它）：

```html:title=src/components/Task.vue
<template>
  <div class="list-item">
    <label for="title" :aria-label="task.title">
      <input type="text" readonly :value="task.title" id="title" name="title" />
    </label>
  </div>
</template>

<script>
export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: "Task",
  props: {
    task: {
      type: Object,
      required: true,
      default: () => ({ id: "", state: "", title: "" }),
      validator: (task) => ["id", "state", "title"].every((key) => key in task),
    },
  },
};
</script>
```

如上所示，我们基于 Todos 应用程序现有的 HTML 结构为 `Task` 直接渲染 markup。

如下所示，我们在 story 文件中创建 Task 的三个不同测试状态：

```js:title=src/components/Task.stories.js
import { fn } from '@storybook/test';

import Task from './Task.vue';

export const ActionsData = {
  onPinTask: fn(),
  onArchiveTask: fn(),
};

export default {
  component: Task,
  tags: ['autodocs'],
  //👇 Our exports that end in "Data" are not stories.
  excludeStories: /.*Data$/,
  title: 'Task',
  //👇 Our events will be mapped in Storybook UI
  argTypes: {
    ...ActionsData
  },
};

export const Default = {
  args: {
    task: {
      id: '1',
      title: 'Test Task',
      state: 'TASK_INBOX',
    },
  },
};

export const Pinned = {
  args: {
    task: {
      ...Default.args.task,
      state: 'TASK_PINNED',
    },
  },
};

export const Archived = {
  args: {
    task: {
      ...Default.args.task,
      state: 'TASK_ARCHIVED',
    },
  },
};
```

<div class="aside">

💡 [**Actions**](https://storybook.js.org/docs/essentials/actions) 可以帮助一在构建独立的 UI 组件时进行交互验证。一般来说，你无法访问程序上下文中的函数及状态。使用 `fn()` 可以做到。

</div>

Storybook 有两个基本的组织级别：组件和他的 story。可以将每个 story 视作其组件的排列组合。您可以根据需要给每一个组件创建任意个 story。

- **组件**

  - Story

  - Story

  - Story

为了告诉 Storybook 我们正在文档化的组件，我们创建了一个 `default` 的默认导出，其中包含：

- `component` -- 组件本身
- `title` -- 如何在 Storybook 应用侧边栏中引用组件
- `tags` -- 自动为我们的组件生成文档
- `excludeStories` -- story 本身需要但是不用在 Storybook 应用中渲染的信息
- `args` -- 在每个 story 中具体说明 [args](https://storybook.js.org/docs/essentials/actions#action-args) 的行为

为了定义我们的 stories，我们将使用 Component Story Format 3 （也即 [CSF3](https://storybook.js.org/docs/api/csf) ）构建所有的测试用例。这种形式被设计用来以一种简洁的方式构建我们所用到的测试用例。通过导出包含每个组件状态的对象，我们可以更直观地定义测试，并更有效地创建和复用 story。

Arguments 或者简写 [`args`](https://storybook.js.org/docs/vue/writing-stories/args) ，让我们可以在不重启 Storybook 的前提下实时编辑我们的组件。一旦 [`args`](https://storybook.js.org/docs/vue/writing-stories/args) 的值被修改我们的组件也会进行相应的更新。

`fn()` 允许我们创建 Storybook UI 的 **actions** 面板被点击时显示的回调。因此当我们构建一个 pin button 时，我们能够在 UI 上验证 button 点击是否成功。

由于我们需要将相同的一组 actions 传入到组件的所有排列组合中，将它们合并到一个 `actionsData` 变量中，并在我们每次定义 story 的时候传入将会变得非常方便。

值得一提的是当我们将组件所需的操作都合并到 `actionsData` 之后，我们可以在其他组件复用此组件时，让其他组件的 story 也可以复用 `export` 的 `actionsData`，详见下文。

当创建一个 story 时，我们使用一个基本的 `task` 变量来构建 task 组件所期望的形状。通常是根据真实数据来进行建模的。再次说明，`export`-ing 这个语法将让我们在之后的 story 中复用，之后将会看到。

## 配置

我们需要对 Storybook 的配置做几处修改，这样不仅可以识别到近期创建的 story，并且允许我们使用应用程序的 CSS 文件（位于 `src/index.css`）。

首先，修改您的 Storybook 配置文件(`.storybook/main.js`) 为以下内容：

```diff:title=.storybook/main.js
/** @type { import('@storybook/vue3-vite').StorybookConfig } */
const config = {
- stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|ts|tsx)'],
+ stories: ['../src/components/**/*.stories.js'],
  staticDirs: ['../public'],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
  ],
  framework: {
    name: '@storybook/vue3-vite',
    options: {},
  },
};
export default config;
```

完成上述的修改后，修改位于 `.storybook`文件夹中的 `preview.js` 为以下内容：

```diff:title=.storybook/preview.js
+ import '../src/index.css';

//👇 Configures Storybook to log the actions( onArchiveTask and onPinTask ) in the UI.
/** @type { import('@storybook/vue3').Preview } */
const preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
  },
};

export default preview;
```

[`parameters`](https://storybook.js.org/docs/vue/writing-stories/parameters) 通常用来控制 Storybook 功能和插件的行为。在我们的例子中，我们并不需要用到这个能力。相反，我们将会导入我们应用的 CSS 文件。

当我们完成这些，重启 Storybook 服务将会生成三种 Task 状态的测试用例：

<video autoPlay muted playsInline controls >
  <source
    src="/intro-to-storybook/inprogress-task-states-7-0.mp4"
    type="video/mp4"
  />
</video>

## 建立状态

现在我们配置好了 Storybook，导入了样式并且构建了测试用例，接下来我们可以根据设计快速编写组件的 HTML 代码。

当前组件仍然非常基础。首先，编写可以实现设计的代码，无需深入细节。

```html:title=src/components/Task.vue
<template>
  <div :class="classes">
    <label
      :for="'checked' + task.id"
      :aria-label="'archiveTask-' + task.id"
      class="checkbox"
    >
      <input
        type="checkbox"
        :checked="isChecked"
        disabled
        :name="'checked' + task.id"
        :id="'archiveTask-' + task.id"
      />
      <span class="checkbox-custom" @click="archiveTask" />
    </label>
    <label :for="'title-' + task.id" :aria-label="task.title" class="title">
      <input
        type="text"
        readonly
        :value="task.title"
        :id="'title-' + task.id"
        name="title"
        placeholder="Input title"
      />
    </label>
    <button
      v-if="!isChecked"
      class="pin-button"
      @click="pinTask"
      :id="'pinTask-' + task.id"
      :aria-label="'pinTask-' + task.id"
    >
      <span class="icon-star" />
    </button>
  </div>
</template>

<script>
import { reactive, computed } from 'vue';

export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: 'Task',
  props: {
    task: {
      type: Object,
      required: true,
      default: () => ({ id: '', state: '', title: '' }),
      validator: task => ['id', 'state', 'title'].every(key => key in task),
    },
  },
  emits: ['archive-task', 'pin-task'],

  setup(props, { emit }) {
    props = reactive(props);
    return {
      classes: computed(() => ({
        'list-item TASK_INBOX': props.task.state === 'TASK_INBOX',
        'list-item TASK_PINNED': props.task.state === 'TASK_PINNED',
        'list-item TASK_ARCHIVED': props.task.state === 'TASK_ARCHIVED',
      })),
      /**
       * Computed property for checking the state of the task
       */
      isChecked: computed(() => props.task.state === 'TASK_ARCHIVED'),
      /**
       * Event handler for archiving tasks
       */
      archiveTask() {
        emit('archive-task', props.task.id);
      },
      /**
       * Event handler for pinning tasks
       */
      pinTask() {
        emit('pin-task', props.task.id);
      },
    };
  },
};
</script>
```

上面额外的 markup 与之前导入的 CSS 相结合，得到了如下的 UI：

<video autoPlay muted playsInline loop>
  <source
    src="/intro-to-storybook/finished-task-states-7-0.mp4"
    type="video/mp4"
  />
</video>

## 组件构建完成！

现在我们在没有用到服务器或者运行整个前端应用的情况下成功的构建了一个组件。下一步我们以类似的方式逐步构建剩余的 Taskbox 组件。

如您所见，在独立状态下开始构建组件变得简单高效。我们可以期望生成一个更高质量的 UI，同时包含更少的 Bug 和更多的打磨，因为可以深入并测试所有可能的状态。

## 捕获无障碍问题

无障碍测试是指基于 [WCAG](https://www.w3.org/WAI/standards-guidelines/wcag/) 规则和其他行业所接受的最佳实践，使用自动化测试对渲染的 DOM 进行审计的实践。他们作为 QA 的第一线，捕捉明显违反无障碍的行为，以确保尽可能多的用户可以使用该应用，包括视力障碍、听力问题和认知障碍的残疾人。

Storybook 包含一个官方的[无障碍插件](https://storybook.js.org/addons/@storybook/addon-a11y)。由 Deque's [axe-core](https://github.com/dequelabs/axe-core) 驱动，可以捕获 [57% WCAG 问题](https://www.deque.com/blog/automated-testing-study-identifies-57-percent-of-digital-accessibility-issues/)。

让我们看看它是如何工作的！执行以下命令安装插件：

```shell
yarn add --dev @storybook/addon-a11y
```

然后，更新 Storybook 配置文件（`.storybook/main.js`）来启用它：

```diff:title=.storybook/main.js
/** @type { import('@storybook/vue3-vite').StorybookConfig } */
module.exports = {
  stories: ['../src/components/**/*.stories.js'],
  staticDirs: ['../public'],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
+   '@storybook/addon-a11y',
  ],
  framework: {
    name: '@storybook/vue3-vite',
    options: {},
  },
};
export default config;
```
最终，重启你的 Storybook 服务，就可以在 UI 中看到新的插件。

![Task accessibility issue in Storybook](/intro-to-storybook/finished-task-states-accessibility-issue-7-0.png)

回顾我们的 stories，我们可以发现插件在我们的一个测试状态中发现可访问性问题。 [**"Elements must have sufficient color contrast"**](https://dequeuniversity.com/rules/axe/4.4/color-contrast?application=axeAPI) 信息实质上意味着在 task 标题和背景之间没有足够的差异性。我们可以快速的修复这个问题，通过修改应用程序的 CSS（位于`src/index.css`），将文本颜色改为 darker gray 。

```diff:title=src/index.css
.list-item.TASK_ARCHIVED input[type="text"] {
- color: #a0aec0;
+ color: #4a5568;
  text-decoration: line-through;
}
```

就是这样！我们已经迈出了第一步确保 UI 变得可访问。随着我们继续增加应用程序的复杂度，我们可以对其他所有组件重复这个过程，而不需要启用额外的工具或测试环境。

<div class="aside">
💡 别忘记提交您的修改！
</div>
