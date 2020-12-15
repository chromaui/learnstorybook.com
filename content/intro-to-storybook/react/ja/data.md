---
title: 'データを繋ぐ'
tocTitle: 'データ'
description: 'UI コンポーネントとデータを繋ぐ方法を学びましょう'
commit: '97fc9a6'
---

これまでに、Storybook の切り離された環境で、状態を持たないコンポーネントを作成してきました。しかし、究極的には、アプリケーションからコンポーネントにデータを渡さなければ役には立ちません。

このチュートリアルは「アプリケーションを作る方法について」ではないので、詳細までは説明しませんが、コンテナーコンポーネントとデータを繋ぐ一般的なパターンについて見てみましょう。

## コンテナーコンポーネント

`TaskList` コンポーネントは、今のところ、それ自体では外部とのやりとりをしないので「presentational (表示用)」([このブログ記事](https://medium.com/@dan_abramov/smart-and-dumb-components-7ca2f9a7c7d0)を参照) として書かれています。データを取得するためには「container (コンテナー)」が必要です。

ここではデータを保存する際に使用される React で人気のライブラリーである [Redux](https://redux.js.org/) を使用し、アプリケーションにシンプルなデータモデルを作ります。[Apollo](https://www.apollographql.com/client/) や [MobX](https://mobx.js.org/) といった他のデータ管理用のライブラリーでもここでのパターンが使用できます。

以下のコマンドを実行し必要な依存関係を追加しましょう:

```bash
yarn add react-redux redux
```

まず、タスクの状態を変更するアクションを処理する単純な Redux のストアを作ります。`src` フォルダの `lib/redux.js` というファイルを作ってください (あえて簡単にしています):

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

次に、`TaskList` コンポーネントのデフォルトエクスポートを更新し、Redux のストアに 「connect (接続)」し、ストアから、気になるタスクのリストを描画します。

```javascript
// src/components/TaskList.js

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

これで、Redux からデータを取得し、実際のデータでコンポ―ネントを生成できるようになりました。`src/app.js` に接続してコンポーネントを描画することも可能ですが、今のところはこのままにして、コンポーネント駆動の旅を続けましょう。

アプリケーションで表示する方法は次の章で説明しますのでご心配なく。

この段階で、Storybook のテストが動かなくなりました。`TaskList` がコンテナーコンポーネントとなって、プロパティを受け付けなくなったためです。代わりに `TaskList` はストアに接続し、子供である `PureTaskList` コンポーネントのプロパティをセットしています。

この問題は、Storybook の該当するストーリーに、プレゼンテーショナルコンポーネントである `PureTaskList` エクスポートして、描画することにより、簡単に解決できます:

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
さらにスナップショットテストも失敗しているはずなので、既存のスナップショットテストを <code>-u</code> フラグを付けて実行しなければなりません。<a href="/react/ja/get-started/">はじめに</a>の章で言ったように、<code> --watchAll</code> フラグをつけてテストを実行するのがよいでしょう。
</div>
