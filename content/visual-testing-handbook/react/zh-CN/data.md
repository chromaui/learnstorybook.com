---
title: "连线数据"
tocTitle: "Data"
description: "了解如何将数据连接到UI组件"
commit: 9c50472
---

到目前为止,我们创建了孤立的无状态组件 - Storybook很棒,但作用不大,除非我们在应用程序中为他们提供一些数据. 

本教程不关注构建应用程序的细节,因此我们不会在此处深入研究这些细节. 但我们将花点时间研究一下 与容器组件 连接数据 的常见模式. 

## 容器组件

我们的`TaskList`目前编写的组件是"表现性的" (见[这篇博文](https://medium.com/@dan_abramov/smart-and-dumb-components-7ca2f9a7c7d0)) 因为它不会与 其自身实现之外 的任何内容交谈. 为了获取数据,我们需要一个"容器". 

这个例子使用[Redux](https://redux.js.org/),最流行的React库,用于存储数据,为我们的应用程序构建一个简单的数据模型. 但是,此处使用的模式同样适用于其他数据管理库[阿波罗](https://www.apollographql.com/client/)和[MobX](https://mobx.js.org/). 


首先,我们将构建一个简单的Redux存储,它在一个`src/lib/redux.js`中定义改变任务状态的操作 (故意保持简单) : 

```javascript
// 一个简单的 redux store/actions/reducer 实现。
// 一个真正的应用程序将更复杂，并分为不同的文件.
import { createStore } from 'redux';

// 这些行为是可能发生的store变化的“名称”
export const actions = {
  ARCHIVE_TASK: 'ARCHIVE_TASK',
  PIN_TASK: 'PIN_TASK',
};

// 动作创建者是将动作与 要求的数据捆绑在一起的方式
export const archiveTask = id => ({ type: actions.ARCHIVE_TASK, id });
export const pinTask = id => ({ type: actions.PIN_TASK, id });

// 我们所有的Reducer都只是改变了一个任务的状态。
function taskStateReducer(taskState) {
  return (state, action) => {
    return {
      ...state,
      tasks: state.tasks.map(
        task => (task.id === action.id ? { ...task, state: taskState } : task)
      ),
    };
  };
}

// reducer描述了 Store 中每个 action 如何改变内容

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

// 应用加载时我们Store 的初始状态。

// 通常你会从服务器上获取它
const defaultTasks = [
  { id: '1', title: 'Something', state: 'TASK_INBOX' },
  { id: '2', title: 'Something more', state: 'TASK_INBOX' },
  { id: '3', title: 'Something else', state: 'TASK_INBOX' },
  { id: '4', title: 'Something again', state: 'TASK_INBOX' },
];

// 我们导出构造的 redux store
export default createStore(reducer, { tasks: defaultTasks });
```

然后我们将更新默认导出`TaskList`组件连接到Redux存储,并呈现我们感兴趣的任务: 

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
  loading: PropTypes.bool,
  tasks: PropTypes.arrayOf(Task.propTypes.task).isRequired,
  onPinTask: PropTypes.func.isRequired,
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

在这个阶段,我们的 Storybook测试将停止工作,因为`TaskList`现在是一个容器,不再需要任何 props,而是连接到 Store 并设置`PureTaskList`包裹组件的props. 


但是,我们可以通过简单地渲染`PureTaskList`来轻松解决这个问题 - 我们的 Storybook故事中的表现部分: 

```javascript
import React from 'react';
import { storiesOf } from '@storybook/react';

import { PureTaskList } from './TaskList';
import { task, actions } from './Task.stories';

export const defaultTasks = [
  { ...task, id: '1', title: 'Task 1' },
  { ...task, id: '2', title: 'Task 2' },
  { ...task, id: '3', title: 'Task 3' },
  { ...task, id: '4', title: 'Task 4' },
  { ...task, id: '5', title: 'Task 5' },
  { ...task, id: '6', title: 'Task 6' },
];

export const withPinnedTasks = [
  ...defaultTasks.slice(0, 5),
  { id: '6', title: 'Task 6 (pinned)', state: 'TASK_PINNED' },
];

storiesOf('TaskList', module)
  .addDecorator(story => <div style={{ padding: '3rem' }}>{story()}</div>)
  .add('default', () => <PureTaskList tasks={defaultTasks} {...actions} />)
  .add('withPinnedTasks', () => <PureTaskList tasks={withPinnedTasks} {...actions} />)
  .add('loading', () => <PureTaskList loading tasks={[]} {...actions} />)
  .add('empty', () => <PureTaskList tasks={[]} {...actions} />);
```

<video autoPlay muted playsInline loop>
  <source
    src="/finished-tasklist-states.mp4"
    type="video/mp4"
  />
</video>

同样,我们需要使用`PureTaskList`在我们的Jest测试中: 

```js
import React from 'react';
import ReactDOM from 'react-dom';
import { PureTaskList } from './TaskList';
import { withPinnedTasks } from './TaskList.stories';

it('renders pinned tasks at the start of the list', () => {
  const div = document.createElement('div');
  const events = { onPinTask: jest.fn(), onArchiveTask: jest.fn() };
  ReactDOM.render(<PureTaskList tasks={withPinnedTasks} {...events} />, div);

  // 我们期望首先渲染标题为“任务6（固定）”的任务，而不是最后
  const lastTaskInput = div.querySelector('.list-item:nth-child(1) input[value="Task 6 (pinned)"]');
  expect(lastTaskInput).not.toBe(null);

  ReactDOM.unmountComponentAtNode(div);
});
```
