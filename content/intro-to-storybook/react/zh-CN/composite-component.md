---
title: '组装复合组件'
tocTitle: '合成组件'
description: '使用更简单的组件 组装复合组件'
commit: 'e955d6c'
---

上一章节我们构建了第一个组件；本章节扩展学习如何构建一个 Tasks 列表，TaskList 组件。将组件组合在一起，看看当引入更多复杂性时会发生什么。

## TaskList 任务列表

Taskbox 通过将 固定任务 置于默认任务之上 来强调 固定任务。这产生了两种变体`TaskList` 您需要为以下内容创建故事：默认项目 以及 默认和 固定项目。

![default and pinned tasks](/intro-to-storybook/tasklist-states-1.png)

`Task`可以异步发送数据,我们**也**需要在没有连接的情况下渲染 loading 状态。此外，当没有任务时，则需要空状态。

![empty and loading tasks](/intro-to-storybook/tasklist-states-2.png)

## 获取设置

复合组件与其包含的基本组件没有太大区别。创建一个 `TaskList` 组件和对应的 story 文件：`src/components/TaskList.js` 和 `src/components/TaskList.stories.js`。

从粗略的实现开始 `TaskList`。你需要先导入 `Task` 组件，并将属性和行为作为输入传递。

```javascript
// src/components/TaskList.js

import React from 'react';

import Task from './Task';

export default function TaskList({ loading, tasks, onPinTask, onArchiveTask }) {
  const events = {
    onPinTask,
    onArchiveTask,
  };

  if (loading) {
    return <div className="list-items">loading</div>;
  }

  if (tasks.length === 0) {
    return <div className="list-items">empty</div>;
  }

  return (
    <div className="list-items">
      {tasks.map((task) => (
        <Task key={task.id} task={task} {...events} />
      ))}
    </div>
  );
}
```

接下来在 story 文件中创建 `Tasklist` 的测试状态。

```javascript
// src/components/TaskList.stories.js

import React from 'react';

import TaskList from './TaskList';
import * as TaskStories from './Task.stories';

export default {
  component: TaskList,
  title: 'TaskList',
  decorators: [(story) => <div style={{ padding: '3rem' }}>{story()}</div>],
};

const Template = (args) => <TaskList {...args} />;

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

`addDecorator()`允许我们为每个任务的渲染添加一些"上下文". 在这种情况下,我们在列表周围添加 _填充-padding_,以便更容易进行 可视化验证.

<div class="aside">
<a href="https://storybook.js.org/docs/react/writing-stories/decorators"><b>Decorators-装饰器</b></a> 是一种为 故事 提供任意包装的方法。 在这种情况下，我们使用装饰器来添加样式。 它们还可以用于包装故事在 <b>"providers" - 设置 React上下文 的库组件</b>.
</div>

通过引入 `TaskStories`，我们可以不费力的在我们的 stories 中[编写](https://storybook.js.org/docs/react/writing-stories/args#args-composition) arguments (简写为 args)。这样，可以保留组件期望的数据和行为（模拟回调）。

现在查看 Storybook 的 `TaskList` 新内容。

<video autoPlay muted playsInline loop>
  <source
    src="/intro-to-storybook/inprogress-tasklist-states-6-0.mp4"
    type="video/mp4"
  />
</video>

## 建立状态

我们的组件仍然很粗糙，但现在我们已经了解了要努力的故事。你可能会想到 `.list-items` 包装过于简单化。你是对的 - 在大多数情况下，我们不会只是添加一个包装器来创建一个新的组件。但是 **真正的复杂性** 的 `TaskList` 组件在边缘情况下会显示 `withPinnedTasks`，`loading`，和 `empty`。

```javascript
// src/components/TaskList.js

import React from 'react';

import Task from './Task';

export default function TaskList({ loading, tasks, onPinTask, onArchiveTask }) {
  const events = {
    onPinTask,
    onArchiveTask,
  };

  const LoadingRow = (
    <div className="loading-item">
      <span className="glow-checkbox" />
      <span className="glow-text">
        <span>Loading</span> <span>cool</span> <span>state</span>
      </span>
    </div>
  );
  if (loading) {
    return (
      <div className="list-items">
        {LoadingRow}
        {LoadingRow}
        {LoadingRow}
        {LoadingRow}
        {LoadingRow}
        {LoadingRow}
      </div>
    );
  }
  if (tasks.length === 0) {
    return (
      <div className="list-items">
        <div className="wrapper-message">
          <span className="icon-check" />
          <div className="title-message">You have no tasks</div>
          <div className="subtitle-message">Sit back and relax</div>
        </div>
      </div>
    );
  }
  const tasksInOrder = [
    ...tasks.filter((t) => t.state === 'TASK_PINNED'),
    ...tasks.filter((t) => t.state !== 'TASK_PINNED'),
  ];
  return (
    <div className="list-items">
      {tasksInOrder.map((task) => (
        <Task key={task.id} task={task} {...events} />
      ))}
    </div>
  );
}
```

添加的标记会产生以下 UI:

<video autoPlay muted playsInline loop>
  <source
    src="/intro-to-storybook/finished-tasklist-states-6-0.mp4"
    type="video/mp4"
  />
</video>

请注意列表中固定项的位置。我们希望固定项目在列表顶部呈现，以使其成为我们用户的优先事项。

## 数据要求和 props

随着组件的增长，输入要求也在增长。要求定义 `TaskList` 的 _props_。因为 `Task` 是一个子组件，请确保提供正确形状的数据来呈现它。为了节省时间和头痛，请重用您定义的早期 `Task` 的 propTypes。

```javascript
// src/components/TaskList.js

import React from 'react';
import PropTypes from 'prop-types';

import Task from './Task';

export default function TaskList() {
  ...
}

TaskList.propTypes = {
  /** Checks if it's in loading state */
  loading: PropTypes.bool,
  /** The list of tasks */
  tasks: PropTypes.arrayOf(Task.propTypes.task).isRequired,
  /** Event to change the task to pinned */
  onPinTask: PropTypes.func,
  /** Event to change the task to archived */
  onArchiveTask: PropTypes.func,
};
TaskList.defaultProps = {
  loading: false,
};
```

## 自动化测试

在上一章中，我们学习了如何使用 Storyshots 快照测试 故事。`Task`测试没有太多的复杂性，已然够用了。而`TaskList`增加了另一层复杂性，我们希望以自动测试的方式验证某些输入产生某些输出。为此，我们将使用创建单元测试[jest-笑话](https://facebook.github.io/jest/)再加上测试渲染器等[Enzyme](http://airbnb.io/enzyme/)。

![Jest logo](/intro-to-storybook/logo-jest.png)

### 用 Jest 进行单元测试

Storybook 故事与手动可视化测试和快照测试 (见上文) 相结合，可以避免 UI 错误。如果故事涵盖了 各种各样的组件用例，并且我们使用的工具可以确保人员检查故事的任何变化，那么错误的可能性就大大降低。

然而，有时候魔鬼是在细节中。需要一个明确有关这些细节的测试框架。这让我们进行了单元测试。

在我们的例子中，我们希望我们的`TaskList`，在传递不固定 tasks 之前，呈现所有固定 tasks。虽然我们有一个故事 (`withPinnedTasks`) 测试这个确切的场景；但是如果组件停止对这样的任务进行排序，那么就人类看着来说，这可能是不明确的，_因为只看到表面与操作_， 这是一个 bug。它肯定不会尖叫 **"错误!"** 直怼眼睛。

因此，为了避免这个问题，我们可以使用 Jest 将故事呈现给`DOM`，并运行一些`DOM`查询代码，来验证输出的显着特征。

创建一个名为的测试文件`TaskList.test.js`。在这里，我们将构建我们的测试，对输出进行断言。

```javascript
// src/components/TaskList.test.js

import React from 'react';
import ReactDOM from 'react-dom';
import '@testing-library/jest-dom/extend-expect';

import { WithPinnedTasks } from './TaskList.stories'; //👈  Our story imported here

it('renders pinned tasks at the start of the list', () => {
  const div = document.createElement('div');
  //👇 Story's args used with our test
  ReactDOM.render(<WithPinnedTasks {...WithPinnedTasks.args} />, div);

  // We expect the task titled "Task 6 (pinned)" to be rendered first, not at the end
  const lastTaskInput = div.querySelector('.list-item:nth-child(1) input[value="Task 6 (pinned)"]');
  expect(lastTaskInput).not.toBe(null);

  ReactDOM.unmountComponentAtNode(div);
});
```

![TaskList test runner](/intro-to-storybook/tasklist-testrunner.png)

请注意，我们已经能够重用 `withPinnedTasks` 故事和单元测试中的任务列表；通过这种方式，我们可以继续以越来越多的方式利用现有资源 (代表组件的有趣配置的示例)。

另请注意，此测试非常脆弱。随着项目的成熟，以及项目的确切实现，这都可能是`Task`的更改 - 可能使用不同的类名或`textarea`而不是一个`input`- 测试将失败，需要更新。这不一定是一个问题，但使用 UI 的单元测试要小心的指示。它们不容易维护。替代的是依靠视觉，快照和视觉回归 (参见[测试章节](/intro-to-storybook/react/zh-CN/test/)) 的 Storybook 测试。
