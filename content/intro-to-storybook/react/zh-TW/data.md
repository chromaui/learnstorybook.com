---
title: '連結資料'
tocTitle: '資料'
description: '了解把資料連結到 UI 元件的方法'
commit: '9788acc'
---

目前，我們已經做好沒有狀態的獨立元件：對 Storybook 來說很夠用。但到頭來，在 App 加入資料之前是沒什麼用處的。

這份教學並不是要專注鑽研 App 製作，因此不會深入探討細節。但仍會花點時間檢視將容器元件 (container components) 接上資料的常見模式。

## 容器元件

`TaskList` 元件現在的寫法是「展示狀態」（可以看[這篇文章](https://medium.com/@dan_abramov/smart-and-dumb-components-7ca2f9a7c7d0)），因為並沒有進行任何外部溝通，將其接到自身的作法。要灌入資料，就得有個「容器」。

這裡儲存資料的範例，使用最受歡迎的 React 函式庫：[Redux](https://redux.js.org/)，來打造簡易的 App 資料 model。不過，這裡使用的模式也，可以好好的用在其它資料管理函式庫，像是 [Apollo](https://www.apollographql.com/client/) 和 [MobX](https://mobx.js.org/)。

在專案裡加入要用到的相依套件：

```shell
yarn add react-redux redux
```

一開始，在 `src` 資料夾裡，加入 `lib/redux.js` 這支檔案（有刻意簡化），蓋出簡單的 Redux store，對應改變任務狀態的 Action。

```js:title=src/lib/redux.js
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

接著，更新 `TaskList` 元件的預設 export，用來連接 Redux store，並渲染出目標任務。

```js:title=src/components/TaskList.js
import React from 'react';
import PropTypes from 'prop-types';

import Task from './Task';

import { connect } from 'react-redux';
import { archiveTask, pinTask } from '../lib/redux';

export function PureTaskList({ loading, tasks, onPinTask, onArchiveTask }) {
  /* previous implementation of TaskList */
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

既然已經有用來產生元件的 Redux 真實資料，就可以把它接到 `src/app.js`，在那邊渲染元件。但現在先不要，繼續在元件驅動的旅程。

不用擔心，下個章節就會來關照這邊。

這時候，因為 TaskList 現在是容器，沒有設定好接收任何 props，造成 Storybook 的測試無法運作。TaskList 現在連接至 store，改在它裡面的 `PureTaskList`設定 props。

然而，只要把 `PureTaskList` 這個展示元件渲染至上個步驟中，在 Storybook 裡 story 剛加入 export 的宣告，就可以了：

```diff:title=src/components/TaskList.stories.js
import React from 'react';

+ import { PureTaskList } from './TaskList';
import * as TaskStories from './Task.stories';

export default {
+ component: PureTaskList,
  title: 'TaskList',
  decorators: [story => <div style={{ padding: '3rem' }}>{story()}</div>],
};

+ const Template = args => <PureTaskList {...args} />;

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
💡 進行這些變動後，快照得要進行更新。重新執行一次測試指令，加上 <code>-u</code> 來更新。還有，別忘了在 git 提交改好的東西！
</div>
