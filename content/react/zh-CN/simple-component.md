---
title: '构建一个简单的组件'
tocTitle: '简单 组件'
description: '单独构建一个简单的组件'
commit: 403f19a
---

# 构建一个简单的组件

我们将按照[组件驱动开发](https://blog.hichroma.com/component-driven-development-ce1109d56c8e) (CDD) 方法论来 构建我们的 UI。 这是一个从"自下而上"，开始构建 UI 的过程，从组件开始，再到整个页面结束。 CDD 可帮助您在构建 UI 时，将您所面临的复杂程度罗列出来。

## 任务-Task

![Task component in three states](/task-states-learnstorybook.png)

`Task`是我们的应用程序的核心组件。每个任务的显示略有不同，具体取决于它所处的`状态-state`。 我们会显示一个，选中 (或未选中) 复选框(checkbox)，一些有关任务的信息，以及一个"pin"按钮，允许我们在列表中上下移动任务。 为了把各个它们摆在一起，我们需要下面的 **props**:

- `title` - 描述任务的字符串
- `state` - 哪个列表是当前的任务，是否已选中?

在我们开始构建`Task`时，我们首先编写状态测试，对应上面草图中，不同类型的任务。 然后我们用 Storybook ，模拟出数据，隔离对应状态组件。 我们会"视觉测试"，组件在每个状态下的外观。

这个过程，类似于[测试驱动的开发(TDD)](https://en.wikipedia.org/wiki/Test-driven_development)，我们可以称之为["视觉 TDD"](https://blog.hichroma.com/visual-test-driven-development-aec1c98bed87)

## 开始设置吧

首先，让我们创建任务(task)组件，及其附带的故事(stories)文件: `src/components/Task.js`和`src/components/Task.stories.js`

我们将从基本实现开始，简单传入我们需要的`属性-props`，以及您可以对任务执行的两个`on`操作 (为了，在列表间移动) :

```javascript
import React from 'react';

export default function Task({
  task: {id, title, state},
  onArchiveTask,
  onPinTask
}) {
  return (
    <div className="list-item">
      <input type="text" value={title} readOnly={true} />
    </div>
  );
}
```

上面，我们基于 Todos 应用程序中现有的 HTML 结构，为`Task`提供简单的标记语言。

下面， 我们在故事文件中，构建 Task 的 三个测试状态:

```javascript
import React from 'react';
import {storiesOf} from '@storybook/react';
import {action} from '@storybook/addon-actions';

import Task from './Task';

export const task = {
  id: '1',
  title: 'Test Task',
  state: 'TASK_INBOX',
  updatedAt: new Date(2018, 0, 1, 9, 0)
};

export const actions = {
  onPinTask: action('onPinTask'),
  onArchiveTask: action('onArchiveTask')
};

storiesOf('Task', module)
  .add('default', () => <Task task={task} {...actions} />)
  .add('pinned', () => (
    <Task task={{...task, state: 'TASK_PINNED'}} {...actions} />
  ))
  .add('archived', () => (
    <Task task={{...task, state: 'TASK_ARCHIVED'}} {...actions} />
  ));
```

Storybook 中，有两个基本的组织级别：该组件与其孩子的故事。把每个故事，视为该组件的一次组合。您可以根据需要，为每个组件创建尽可能多的故事。

- **组件**
  - 故事
  - 故事
  - 故事

要开始 Storybook，我们先运行`storiesOf()`函数，注册组件。我们为组件添加 _显示名称 —— Storybook 应用程序侧栏上，显示的名称_。

`action()`允许我们创建一个回调，当 click(点击) 发生，会在 Storybook UI 的 **action** 面板中出现。因此，当我们构建了一个 pin 按钮，我们能够在测试 UI 中，确定这个按钮是否点击成功。

由于我们需要将相同的一组操作，传递给组件的所有组合，因此将它们捆绑到`actions`变量，并使用 React 的`{...actions}`的`porps`扩展，这样可以一次传递完它们。 `<Task {...actions}>`相当于`<Task onPinTask={actions.onPinTask} onArchiveTask={actions.onArchiveTask}>`。

关于捆绑`actions`的另一个好处就是，你可以用`export`导出它们，给重用该组件的组件使用，我们稍后会看到。

为了定义我们的故事，我们用`add()`，一次一个，为我们的每个测试状态生成一个故事。 `add`的第二个参数是一个函数，它返回一个给定状态的渲染元素 (即带有一组`props`的组件类) - 就像一个 React 的[无状态函数组件](https://reactjs.org/docs/components-and-props.html)。

在创建故事时，我们使用基本任务 (`task`对象) ，去构建组件期望的任务的形状(组件属性)。这通常是根据真实数据的模型建模的。再一次，正如我们所看到的，`export`导出这种形状，能让我们在以后的故事中，重复使用它。

<div class="aside">
<a href="https://storybook.js.org/addons/introduction/#2-native-addons"><b>Actions</b></a> 帮助您在隔离情况下，构建 UI 组件时，验证交互。通常，您无法访问，应用程序上下文中的函数和状态。通过使用 <code>action()</code> 将它们塞进来。
</div>

## 配置

我们还必须对 Storybook 的配置 (`.storybook/config.js`) ，做一个聪明的小改动，让它注意到我们的`.stories.js`文件，并使用我们的 CSS 文件。 默认情况下， Storybook 会在`/stories`目录下，查找故事; 本教程使用类似于`.test.js`的命名方案，这个命令是 **CRA** 所喜爱的，用于自动化测试的方案。

```javascript
import {configure} from '@storybook/react';
import '../src/index.css';

const req = require.context('../src', true, /.stories.js$/);

function loadStories() {
  req.keys().forEach(filename => req(filename));
}

configure(loadStories, module);
```

完成此操作后，重新启动 Storybook 服务器，应该会产生，三种状态的任务测试用例:

<video autoPlay muted playsInline loop>
  <source
    src="/inprogress-task-states.mp4"
    type="video/mp4"
  />
</video>

## 建立状态

现在我们有 Storybook 设置，导入的样式和构建的测试用例，我们可以快速开始实现组件的 HTML，以匹配(故事书测试)设计。

目前，该组件仍处于基本形态。让我们先编写实现设计的代码，不用过多细节:

```javascript
import React from 'react';

export default function Task({
  task: {id, title, state},
  onArchiveTask,
  onPinTask
}) {
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
        <input
          type="text"
          value={title}
          readOnly={true}
          placeholder="Input title"
        />
      </div>

      <div className="actions" onClick={event => event.stopPropagation()}>
        {state !== 'TASK_ARCHIVED' && (
          <a onClick={() => onPinTask(id)}>
            <span className={`icon-star`} />
          </a>
        )}
      </div>
    </div>
  );
}
```

上面的附加标记语言，与我们之前导入的 CSS 相结合，产生以下 UI:

<video autoPlay muted playsInline loop>
  <source
    src="/finished-task-states.mp4"
    type="video/mp4"
  />
</video>

## 具体数据的要求

最好的做法是，在 React 中使用`propTypes`，这样就可以指定组件所需的数据形状。它不仅可以自我记录，还有助于及早发现问题。

```javascript
import React from 'react';
import PropTypes from 'prop-types';

function Task() {
  ...
}

Task.propTypes = {
  task: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    state: PropTypes.string.isRequired,
  }),
  onArchiveTask: PropTypes.func,
  onPinTask: PropTypes.func,
};

export default Task;
```

现在，若是任务组件被滥用，则会在开发模式下，出现警告。

<div class="aside">
另一种同功能的方法是使用 JavaScript 类型系统，比如像 TypeScript，它来为组件属性创建类型。
</div>

## 组件构建!

我们现在已成功构建了一个组件，没用到服务器，或运行整个前端应用程序。下一步是以类似的方式，逐个构建剩余的 Taskbox 组件。

如您所见，单独构建组件的开始，非常简单快捷。我们可以期望，生成更高质量的 UI，减少错误和更好的打磨，因为它可以挖掘，并测试每个可能的状态。

## 自动化测试

Storybook 为我们提供了一种在施工期间，能够视觉测试我们的应用程序的方式。在我们持续开发应用程序时，"stories"将有助于我们，确保不会在视觉上打破我们的任务。
但是，在这个阶段，这是一个完全手动的过程，有人必须努力点击每个测试状态，并确保它呈现良好，且没有错误或警告。
我们不能自动这样做吗?

### 快照测试

快照测试是指，记录带一定输入的组件的"已知良好"输出，然后，将来输出发生变化时，标记组件的做法。
这让 Storybook 更好了，因为快照是查看组件新版本，并检查更改的快速方法。

<div class="aside">
确保您的组件，呈现 <b>不变</b> 的数据，以便每次快照测试，都不会失败。但要注意日期或随机生成的值等内容。
</div>

需要[Storyshots 插件](https://github.com/storybooks/storybook/tree/master/addons/storyshots)为每个故事创建快照测试。
通过添加开发依赖项，来使用它:

```bash
yarn add --dev @storybook/addon-storyshots react-test-renderer require-context.macro
```

然后创建一个`src/storybook.test.js`文件，包含以下内容:

```javascript
import initStoryshots from '@storybook/addon-storyshots';
initStoryshots();
```

你还会需要用到 [babel 宏](https://github.com/kentcdodds/babel-plugin-macros)，确保`require.context` (一些 webpack 魔法) 能在 Jest (我的测试) 运行。 更新`.storybook/config.js`:

```js
import {configure} from '@storybook/react';
import requireContext from 'require-context.macro';

import '../src/index.css';

const req = requireContext('../src/components', true, /\.stories\.js$/);

function loadStories() {
  req.keys().forEach(filename => req(filename));
}

configure(loadStories, module);
```

(注意到，我们替换了 `require.context`，变成调用来自对应 macro 的`requireContext`)。

完成上述操作后，我们就可以运行了`yarn test`，并看到以下输出:

![Task test runner](/task-testrunner.png)

我们现在帮每个`Task`故事，都拥有了快照测试。如果我们改变了`Task`的实现，我们会被提示，要验证更改。
