---
title: '连线数据'
tocTitle: 'Data'
description: '了解如何将数据连接到UI组件'
commit: 'b29407b'
---

到目前为止,我们创建了孤立的无状态组件 - Storybook 很棒,但作用不大,除非我们在应用程序中为他们提供一些数据.

本教程不关注构建应用程序的细节,因此我们不会在此处深入研究这些细节. 但我们将花点时间研究一下 与容器组件 连接数据 的常见模式.

## 容器组件

我们的`TaskList`目前编写的组件是"表现性的" (见[这篇博文](https://medium.com/@dan_abramov/smart-and-dumb-components-7ca2f9a7c7d0)) 因为它不会与 其自身实现之外 的任何内容交谈. 为了获取数据,我们需要一个"容器".

这个例子使用[Redux](https://redux.js.org/),最流行的 React 库,用于存储数据,为我们的应用程序构建一个简单的数据模型. 但是,此处使用的模式同样适用于其他数据管理库[阿波罗](https://www.apollographql.com/client/)和[MobX](https://mobx.js.org/).

在你的项目中添加必要的依赖：

```bash
yarn add react-redux redux
```

首先,我们将构建一个简单的 Redux 存储,它在一个`src/lib/redux.js`中定义改变任务状态的操作 (故意保持简单) :

```javascript
// src/lib/redux.js

// A simple redux store/actions/reducer implementation.
// A true app would be more complex and separated into different files.
import { createStore } from 'redux';

// The actions are the "names" of the changes that can happen to the store
export const actions = {
  ARCHIVE_TASK: 'ARCHIVE_TASK',
  PIN_TASK: 'PIN_TASK',
};

// The action creators bundle actions with the data required to execute them
export const archiveTask = id => ({ type: actions.ARCHIVE_TASK, id });
export const pinTask = id => ({ type: actions.PIN_TASK, id });

// All our reducers simply change the state of a single task.
function taskStateReducer(taskState) {
  return (state, action) => {
    return {
      ...state,
      tasks: state.tasks.map(task =>
        task.id === action.id ? { ...task, state: taskState } : task
      ),
    };
  };
}

// The reducer describes how the contents of the store change for each action
export const reducer = (state, action) => {
  switch (action.type) {
    case actions.ARCHIVE_TASK:
      return taskStateReducer('TASK_ARCHIVED')(state, action);
    case actions.PIN_TASK:
      return taskStateReducer('TASK_PINNED')(state, action);
    default:
      return state;
  }
};

// The initial state of our store when the app loads.
// Usually you would fetch this from a server
const defaultTasks = [
  { id: '1', title: 'Something', state: 'TASK_INBOX' },
  { id: '2', title: 'Something more', state: 'TASK_INBOX' },
  { id: '3', title: 'Something else', state: 'TASK_INBOX' },
  { id: '4', title: 'Something again', state: 'TASK_INBOX' },
];

// We export the constructed redux store
export default createStore(reducer, { tasks: defaultTasks });
```

然后我们将更新默认导出`TaskList`组件连接到 Redux 存储,并呈现我们感兴趣的任务:

```javascript
import React from 'react';
import PropTypes from 'prop-types';

import Task from './Task';
import { connect } from 'react-redux';
import { archiveTask, pinTask } from '../lib/redux';

export function PureTaskList({ loading, tasks, onPinTask, onArchiveTask }) {
  /* 以前的 TaskList 实现 */
}

PureTaskList.propTypes = {
  /** Checks if it's in loading state */
  loading: PropTypes.bool,
  /** The list of tasks */
  tasks: PropTypes.arrayOf(Task.propTypes.task).isRequired,
  /** Event to change the task to pinned */
  onPinTask: PropTypes.func.isRequired,
  /** Event to change the task to archived */
  onArchiveTask: PropTypes.func.isRequired,
};

PureTaskList.defaultProps = {
  loading: false,
};

export default connect(
  ({ tasks }) => ({
    tasks: tasks.filter(t => t.state === 'TASK_INBOX' || t.state === 'TASK_PINNED'),
  }),
  dispatch => ({
    onArchiveTask: id => dispatch(archiveTask(id)),
    onPinTask: id => dispatch(pinTask(id)),
  })
)(PureTaskList);
```

现在我们已经有了一些从 Redux 获得的用于填充组件的真实数据，我们可以连到 `src/app.js` 并在那渲染组件。但是现在我们先不这样做，让我们继续组件驱动之旅。

不要担心，我们将在下一章进行介绍。

在这个阶段,我们的 Storybook 测试将停止工作,因为`TaskList`现在是一个容器,不再需要任何 props,而是连接到 Store 并设置`PureTaskList`包裹组件的 props.

但是,我们可以通过简单地渲染`PureTaskList`来轻松解决这个问题 - 我们的 Storybook 故事中的表现部分:

```javascript
// src/components/TaskList.stories.js

import React from 'react';

import { PureTaskList } from './TaskList';
import * as TaskStories from './Task.stories';

export default {
  component: PureTaskList,
  title: 'TaskList',
  decorators: [story => <div style={{ padding: '3rem' }}>{story()}</div>],
};

const Template = args => <PureTaskList {...args} />;

export const Default = Template.bind({});
Default.args = {
  // Shaping the stories through args composition.
  // The data was inherited the Default story in task.stories.js.
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

<div class="aside">
如果你的快照测试失败，你需要通过运行测试脚本并带上 <code>-u</code> 标志来更新已存在的快照。随着我们的应用程序越来越大，这可能也是运行测试脚本时带有 <code> --watchAll</code> 标志的好处，如 <a href="/intro-to-storybook/react/zh-CN/get-started/">开始吧</a> 章节中提到的。
</div>
