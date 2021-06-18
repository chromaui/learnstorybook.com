---
title: '构建一个简单的组件'
tocTitle: '简单 组件'
description: '单独构建一个简单的组件'
commit: '97d6750'
---

我们将按照[组件驱动开发](https://www.componentdriven.org/) (CDD) 方法论来 构建我们的 UI。这是一个从“自下而上”开始构建 UI 的过程，从组件开始到整个页面结束。CDD 可帮助您在构建 UI 时，摆列您所面临的复杂程度。

## 任务-Task

![Task component in three states](/intro-to-storybook/task-states-learnstorybook.png)

`Task` 是我们的应用程序的核心组件。每个任务的显示略有不同，具体取决于它所处的 `状态-state`。我们显示一个选中 (或未选中) 复选框，一些有关任务的信息，以及一个“pin”按钮，允许我们在列表中上下移动任务。为了把各个它们摆在一起,我们需要下面的 **props**:

- `title` - 描述任务的字符串
- `state` - 哪个列表是当前的任务，是否已选中？

在我们开始构建`Task`时，我们首先编写 与 上面草图中不同类型的任务相对应的测试状态。然后我们使用 Storybook 模拟数据独立构建组件。我们将“视觉测试”组件在每个状态下的外观。

## 获取设置

首先,让我们创建任务 Task 组件 及 其附带的 story 文件：`src/components/Task.js` 和 `src/components/Task.stories.js`

我们将从 `Task` 的基本实现开始，简单传入我们需要的 `属性-props` 以及需要对任务执行的两个 `on` 操作（在列表之间移动它）：

```javascript
// src/components/Task.js

import React from 'react';

export default function Task({ task: { id, title, state }, onArchiveTask, onPinTask }) {
  return (
    <div className="list-item">
      <input type="text" value={title} readOnly={true} />
    </div>
  );
}
```

上面,我们基于 Todos 应用程序现有 HTML 结构为 `Task` 提供简单的 markup .

下面, 我们在 story 文件中构建 Task 的三个测试状态:

```javascript
// src/components/Task.stories.js

import React from 'react';

import Task from './Task';

export default {
  component: Task,
  title: 'Task',
};

const Template = args => <Task {...args} />;

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

Storybook 中有两个基本的组织级别。Component 及其 child stories.

将每个 story 视为 Component 的排列。您可以根据需要为每个组件创建尽可能多的 story。

- **Component**
  - Story
  - Story
  - Story

为了告知 Storybook 关于我们正在记录的 component，我们创建了一个 `default` 默认导出，其中包含：

- `component` -- component 组件本身
- `title` -- 如何在 Storybook 侧边栏中引用组件

为了定义我们的 stories，我们为每个测试状态导出一个函数用于生成一个 story。story 是一个根据传入的 state 返回一个已渲染元素的函数，就像是 [无状态组件](https://reactjs.org/docs/components-and-props.html#function-and-class-components)。

我们的组件有很多排列，因此将其分配给一个 `Template` 变量是很方便的。将这种模式引入你的 stories 将会减少很多需要编写并维护的代码量。

<div class="aside">

`Template.bind({})` 是一个可以用于复制函数的 [JavaScript 标准](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/bind) 技术。我们使用此技术允许每个导出的 story 都使用相同的实现，但能够设置自己的属性。

</div>

Arguments 或者 [`args`](https://storybook.js.org/docs/react/writing-stories/args) 简写，不需要重启 Storybook 就可以通过 controls 插件实时编辑我们的组件。一旦 [`args`](https://storybook.js.org/docs/react/writing-stories/args) 被修改，组件就会更新。

在创建 story 时，我们使用基本任务 (`task`) 构建组件期望的任务的形状。这通常是根据真实数据的模型建模的。再次，正如我们所看到的，`export` 这种形状将使我们能够在以后的 story 中重复使用它。

<div class="aside">
<a href="https://storybook.js.org/docs/react/essentials/actions"><b>Actions</b></a> 帮助您在隔离构建UI组件时验证交互。通，您无法访问应用程序上下文中的函数和状态。使用 <code>action()</code> 将它们存入。
</div>

## 配置

我们需要对 Storybook 配置进行几处修改，使其不仅可以注意到我们刚创建的 stories，而且还能允许我们使用[上个章节](/intro-to-storybook/react/zh-CN/get-started)中修改过的 CSS 文件。

```javascript
// .storybook/main.js

module.exports = {
  //👇 Location of our stories
  stories: ['../src/components/**/*.stories.js'],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/preset-create-react-app',
  ],
};
```

完成以上修改后，在 `.storybook` 文件夹中修改 `preview.js` 为一下内容：

```javascript
// .storybook/preview.js

import '../src/index.css'; //👈 The app's CSS file goes here

//👇 Configures Storybook to log the actions( onArchiveTask and onPinTask ) in the UI.
export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
};
```

[`parameters`](https://storybook.js.org/docs/react/writing-stories/parameters) 通常用于控制 Storybook 的功能和插件的行为。在我们的例子中我们将使用它来配置如何处理 `actions`（模拟回调）。

`actions` 允许我们创建被点击时显示在 Storybook 界面的 **actions** 面板上的回调。因此当我们构建一个 pin button 时，我们能够在测试界面上验证 button 点击是否成功。

当我们完成这些时，重启 Storybook 服务将产生三个任务状态的测试用例：

<video autoPlay muted playsInline loop>
  <source
    src="/intro-to-storybook/inprogress-task-states-6-0.mp4"
    type="video/mp4"
  />
</video>

## 建立状态

现在我们有 Storybook 的设置，样式的导入及测试用例的构建，我们可以快速开始组件的匹配设计的 HTML 实现。

目前该组件仍然很基础。首先编写代码实现设计，而无需关注太多细节。

```javascript
// src/components/Task.js

import React from 'react';

export default function Task({ task: { id, title, state }, onArchiveTask, onPinTask }) {
  return (
    <div className={`list-item ${state}`}>
      <label className="checkbox">
        <input
          type="checkbox"
          defaultChecked={state === 'TASK_ARCHIVED'}
          disabled={true}
          name="checked"
        />
        <span className="checkbox-custom" onClick={() => onArchiveTask(id)} />
      </label>
      <div className="title">
        <input type="text" value={title} readOnly={true} placeholder="Input title" />
      </div>

      <div className="actions" onClick={event => event.stopPropagation()}>
        {state !== 'TASK_ARCHIVED' && (
          // eslint-disable-next-line jsx-a11y/anchor-is-valid
          <a onClick={() => onPinTask(id)}>
            <span className={`icon-star`} />
          </a>
        )}
      </div>
    </div>
  );
}
```

上面的附加 markup 与我们之前导入的 CSS 相结合，产生以下 UI：

<video autoPlay muted playsInline loop>
  <source
    src="/intro-to-storybook/finished-task-states-6-0.mp4"
    type="video/mp4"
  />
</video>

## 特别数据要求

最佳实践是在 React 中使用 `propTypes` 指定组件期望的数据形态。不仅可以自我记录文档化，也能帮助我们尽早发现问题。

```javascript
// src/components/Task.js

import React from 'react';
import PropTypes from 'prop-types';

export default function Task({ task: { id, title, state }, onArchiveTask, onPinTask }) {
  // ...
}

Task.propTypes = {
  /** Composition of the task */
  task: PropTypes.shape({
    /** Id of the task */
    id: PropTypes.string.isRequired,
    /** Title of the task */
    title: PropTypes.string.isRequired,
    /** Current state of the task */
    state: PropTypes.string.isRequired,
  }),
  /** Event to change the task to archived */
  onArchiveTask: PropTypes.func,
  /** Event to change the task to pinned */
  onPinTask: PropTypes.func,
};
```

现在，如果 Task 组件被滥用，将会在开发环境出现警告。

<div class="aside">
另一种实现方法是使用类似 TypeScript 的 JavaScript 类型系统来为组件属性创建类型。
</div>

## 组件构建!

我们现在已成功构建了一个组件，没用到服务器或运行整个前端应用程序。下一步是以类似的方式逐个构建剩余的 Taskbox 组件。

如您所见，开始单独构建组件非常简单快捷。我们可以期望生成更高质量的 UI，减少错误和更多打磨，因为它可以挖掘并测试每个可能的状态。

## 自动化测试

Storybook 为我们提供了一种在开发期间，`可视化`测试我们的应用程序。在我们继续开发应用程序时，`stories` 将有助于确保我们不会打破 Task 的外观。
但是，在这个阶段，这是一个完全手动的过程，有人必须努力点击每个测试状态,并确保它呈现良好且没有错误或警告。我们不能自动这样做吗？

### 快照测试

快照测试是指记录给定输入的组件的“已知合格”的输出，然后将来输出发生变化时标记组件的做法。
这补充了 Storybook，因为快照是查看组件新版本并检查更改的快速方法。

<div class="aside">
确保您的组件呈现 <b>不变</b> 的数据，以便每次快照测试都不会失败。注意日期或随机生成的值等内容。
</div>

需要[Storyshots 插件](https://github.com/storybooks/storybook/tree/master/addons/storyshots)为每个故事创建快照测试。
通过添加开发依赖项来使用它：

```bash
yarn add -D @storybook/addon-storyshots react-test-renderer
```

然后创建一个`src/storybook.test.js`文件中包含以下内容：

```javascript
// src/storybook.test.js

import initStoryshots from '@storybook/addon-storyshots';
initStoryshots();
```

完成上述操作后，我们就可以运行了 `yarn test` 并看到以下输出：

![Task test runner](/intro-to-storybook/task-testrunner.png)

我们现在为每个 `Task` 的 stories 进行快照测试。如果我们改变了 `Task` 的实现,我们会提示您验证更改。
