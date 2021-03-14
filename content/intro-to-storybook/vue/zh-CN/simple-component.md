---
title: '构建一个简单的组件'
tocTitle: '简单组件'
description: '单独构建一个简单的组件'
commit: 'f03552f'
---

我们将按照[组件驱动开发](https://www.componentdriven.org/) (CDD)来构建我们的 UI。这是一个自下而上的构建 UI 的过程，我们从组件开始以整个页面结束。CDD 可以帮助您在构建 UI 时衡量其复杂性。

## 任务

![任务组件的三个状态](/intro-to-storybook/task-states-learnstorybook.png)

`任务(Task)`是我们应用程序的核心组件。每个任务根据其状态的不同在显示上会略有不同。我们提供一个选中(未选中)的复选框，一些关于 Task 的信息和一个允许我们上下移动任务的“pin”按钮。我们需要下述的 props 来将它们整合起来：

- `title` – 描述任务的字符串
- `state` - 当前任务所在列表，以及其是否被选中？

在我们构建`Task`之前，首先我们根据上述的草图编写测试所需的状态(state)。然后我们使用 Storybook 模拟数据并独立的构建组件。我们可以“视觉测试”自己设定好状态的组件外观。

这个过程有点像[驱动测试开发](https://en.wikipedia.org/wiki/Test-driven_development) (TDD) 所以我们可以称之为“[Visual TDD](https://www.chromatic.com/blog/visual-test-driven-development)”

## 配置

首先，让我们创建 task 组件以及它相关的 story 文件：`src/components/Task.vue` 和 `src/components/Task.stories.js`。

首先我们使用已知将会用到的属性为基础实现一个最基本的`Task`：

```html:title=src/components/Task.vue
<template>
  <div class="list-item">
    <input type="text" readonly :value="task.title" />
  </div>
</template>

<script>
  export default {
    name: 'Task',
    props: {
      task: {
        type: Object,
        required: true,
        default: () => ({ id: '', state: '', title: '' }),
        validator: task => ['id', 'state', 'title'].every(key => key in task),
      },
    },
  };
</script>
```

如上所示，我们直接基于现有的 Todos 应用的 HTML 结构创建一个`Task`。

如下，我们在 story 文件中创建 Task 的三个不同测试状态：

```js:title=src/components/Task.stories.js
import Task from './Task';

import { action } from '@storybook/addon-actions';

export default {
  title: 'Task',
  component: Task,
  // 我们的以“Data”结尾导出的内容不属于story
  excludeStories: /.*Data$/,
};

export const actionsData = {
  onPinTask: action('pin-task'),
  onArchiveTask: action('archive-task'),
};

const Template = (args, { argTypes }) => ({
  components: { Task },
  props: Object.keys(argTypes),
  methods: actionsData,
  template: '<Task v-bind="$props" @pin-task="onPinTask" @archive-task="onArchiveTask" />',
});

export const Default = Template.bind({});
Default.args = {
  task: {
    id: '1',
    title: 'Test Task',
    state: 'TASK_INBOX',
    updatedAt: new Date(2018, 0, 1, 9, 0),
  },
};

export const Pinned = Template.bind({});
Pinned.args = {
  task: {
    ...Default.args.task,
    state: 'TASK_PINNED',
  },
};

export const Archived = Template.bind({});
Archived.args = {
  task: {
    ...Default.args.task,
    state: 'TASK_ARCHIVED',
  },
};
```

Storybook 有两个基本的组织级别：组件和他的 story。可以将每个 story 视作其组件的排列组合。您可以根据需要给每一个组件创建任意个 story。

- **组件**
  - Story
  - Story
  - Story

我们创建了一个`default`来提示 Storybook 我们正在文档化的组件：

- `component` -- 组件本身,
- `title` -- 在 Storybook 应用侧边栏的显示,
- `excludeStories` -- story 本身需要但是不用在 Storybook 应用中渲染的信息。

我们为每一个我们需要测试的状态导出一个函数，以此来定义我们的 story。Story 实际上就是一个根据给定的状态返回已渲染元素的函数---就像是[无状态函数式组件](https://vuejs.org/v2/guide/render-function.html#Functional-Components)那样。

因为我们的组件存在多种排列组合，所以设置一个`Template`变量不失为一种便捷的做法。使用这样的模式来创建您的 Story 可以大量减少代码量和维护成本。

<div class="aside">
💡 <code>Template.bind({})</code> 是 <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/bind">标准JavaScript</a> 中用来复制函数的技术。我们使用这项技术保证了在使用同一份实现的同时，让每一个导出的story可以配置自己的属性。
</div>

Arguments 或者简写[`args`](https://storybook.js.org/docs/vue/writing-stories/args) , 让我们可以在不重启 Storybook 的前提下实时编辑我们的组件。只要 [`args`](https://storybook.js.org/docs/vue/writing-stories/args) 的值被修改我们的组件也会相应的更新。

我们创建了一个最基本的`task`变量来描述 task 组件应该呈现的样子。这通常是根据真实数据来进行建模的。同时，`导出`此 task 也让我们在以后编写其他 story 时可以复用它，详见下文。

`action()`使我们可以创建一个回调函数，当点击事件触发时 Storybook UI 的**actions**面板会显示结果。所以如果我们创建了一个 pin 按钮，我们就可以通过面板清楚的知道按钮是否被成功点击了。

考虑到我们需要为组件的每一个排列组合都传入同样的 actions，通常的便捷做法是将他们合并到一个`actionsData`变量中，并传入给每一个定义好的 story 中(story 使用`methods`属性访问)。

值得一提的是当我们将组件所需的操作都合并到`actionsData`之后，我们可以在其他组件复用此组件时，让其他组件的 story 也可以复用`导出`的`actionsData`，详见下文。

<div class="aside">
💡 <a href="https://storybook.js.org/docs/vue/essentials/actions"><b>Actions</b></a>帮助您在隔离构建UI组件时验证交互。 通常情况下您不会持有应用程序上下文中函数和状态的访问权限。请使用<code>action()</code>保存它们。
</div>

## 配置

我们需要对 Storybook 的配置做几处修改，这样其不仅可以识别到近期创建的 story，同时还允许我们可以使用应用的 CSS 文件（在`sec/index.css`）。

如下修改您的 Storybook 配置文件(`.storybook/main.js`)：

```diff:title=.storybook/main.js
module.exports = {
  //👇 我们的story的所在位置
  stories: ['../src/components/**/*.stories.js'],
  addons: ['@storybook/addon-links', '@storybook/addon-essentials'],
};
```

完成上述的修改后，如下所示修改您`.storybook`文件夹中的`preview.js` ：

```diff:title=.storybook/preview.js
import '../src/index.css';

//👇 配置Storybook使其可以在UI中记录actions(onArchiveTask和onPinTask)
export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
};
```

[`parameters`](https://storybook.js.org/docs/vue/writing-stories/parameters) 通常用来控制 Storybook 中特性和插件的行为。在我们的例子中我们使用它们来配置`actions`(模拟的回掉)该如何被处理。

`actions`允许我们创建回调来决定当点击事件发生时 Storybook UI 的**actions**面板将如何显示。这样当我们创建了一个 pin 按钮后，我们就可以在测试 UI 中查看该按钮是否被点击成功了。

完成了上述配置后重启 Storybook 服务器，Task 的三种状态的测试用例应该就生成完毕了：

<video autoPlay muted playsInline controls >
  <source
    src="/intro-to-storybook//inprogress-task-states.mp4"
    type="video/mp4"
  />
</video>

## 建立状态

现在我们配置好了 Storyb，导入了样式并且构建了测试用例，接下来我们可以根据设计快速编写组件的 HTML 代码。

我们的组件现在仍然十分粗糙。我们做一些修改保证其在满足所需设计的同时而不至于陷入太多的细节中。

```diff:title=src/components/Task.vue
<template>
  <div class="list-item" :class="task.state">
    <label class="checkbox">
      <input type="checkbox" :checked="isChecked" disabled name="checked" />
      <span class="checkbox-custom" @click="$emit('archive-task', task.id)" />
    </label>
    <div class="title">
      <input type="text" :value="task.title" readonly placeholder="Input title" />
    </div>

    <div class="actions">
      <a v-if="!isChecked" @click="$emit('pin-task', task.id)">
        <span class="icon-star" />
      </a>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'Task',
    props: {
      task: {
        type: Object,
        required: true,
        default: () => ({ id: '', state: '', title: '' }),
        validator: task => ['id', 'state', 'title'].every(key => key in task),
      },
    },
    computed: {
      isChecked() {
        return this.task.state === 'TASK_ARCHIVED';
      },
    },
  };
</script>
```

我们配合已经导入的 CSS 追加了一些标记，得到了如下的 UI：

<video autoPlay muted playsInline loop>
  <source
    src="/intro-to-storybook/finished-task-states.mp4"
    type="video/mp4"
  />
</video>

## 组件构建完成！

这样我们在没有服务器或者不需要运行整个前端应用的情况下成功的构建了一个组件。下一步我们以类似的方式逐个构建剩余的 Taskbox 组件。

如您所见，这种隔离式的组件构建方式既轻松又高效。我们由此可以生成一个更高质量的 UI，同时包含更少的 Bug 和打磨，原因在于我们现在可以深入并对每一个可能的状态进行测试。

## 自动化测试

Storybook 给我们提供了一个在开发期间可视化测试应用程序的方法。这样的‘story’保证了我们在不破坏 Task 外观的同时可以继续开发应用程序。然而到目前为止这仍然是一个完全手动的过程，这意味着我们需要某个人手动的测试每一个状态并确保其渲染得正确无误。我们能将这个过程自动化吗？

### 快照测试

快照测试指的是先根据给定的输入记录下组件的所谓的“正确的”输出，并且当输出改变时予以标记。这补充了 Storybook，因为 Storybook 可以快速查看组件的新版本并可视化修改。

<div class="aside">
💡 请确保您组件渲染的数据不会更改，以保证快照测试不会每一次都失败。尤其注意日期或者随机数据等信息。
</div>

通过[Storyshots addon](https://github.com/storybooks/storybook/tree/master/addons/storyshots)我们可以为每一个 story 创建一个快照测试。通过下述方式追加依赖：

```bash
yarn add -D @storybook/addon-storyshots jest-vue-preprocessor
```

上述命令生成了`tests/unit/storybook.spec.js`文件，内容如下：

```js:title=tests/unit/storybook.spec.js
import initStoryshots from '@storybook/addon-storyshots';

initStoryshots();
```

我们还需要在`jest.config.js`中追加一行：

```diff:title=jest.config.js
module.exports = {
  ...
  transformIgnorePatterns: ["/node_modules/(?!(@storybook/.*\\.vue$))"],
};
```

完成上述操作后运行`yarn test:unit`并查看输出：

![Task test runner](/intro-to-storybook/task-testrunner.png)

这样我们就为每一个`Task` story 创建了快照测试。一旦我们修改了`Task`，我们就需要根据提示验证那些修改。

<div class="aside">
💡 别忘记提交您的修改！
</div>
