---
title: 'データを繋ぐ'
tocTitle: 'データ'
description: 'UI コンポーネントとデータを繋ぐ方法を学びましょう'
commit: 'f05981b'
---

これまでに、Storybook の隔離された環境で、状態を持たないコンポーネントを作成してきました。しかし、究極的には、アプリケーションからコンポーネントにデータを渡さなければ役には立ちません。

このチュートリアルは「アプリケーションを作る方法について」ではないので、詳細までは説明しませんが、コンテナーコンポーネントとデータを繋ぐ一般的なパターンについて見てみましょう。

## コンテナーコンポーネント

`TaskList` コンポーネントは、今のところ、それ自体では外部とのやりとりをしないので「presentational (表示用)」([このブログ記事](https://medium.com/@dan_abramov/smart-and-dumb-components-7ca2f9a7c7d0)を参照) として書かれています。データを取得するためには「container (コンテナー)」が必要です。

ここではデータを保存する際に使用される React で人気のライブラリー、[Redux](https://redux.js.org/) を使用し、アプリケーションのシンプルなデータモデルを作ります。[Apollo](https://www.apollographql.com/client/) や [MobX](https://mobx.js.org/) といった他のデータ管理用のライブラリーでもここでのパターンが使用できます。

以下のコマンドを実行し必要な依存関係を追加しましょう:

```bash
yarn add react-redux redux
```

まず、タスクの状態を変更するアクションを処理する単純な Redux のストアを作ります。`src` フォルダの `lib/redux.js` というファイルを作ってください (あえて簡単にしています):

```javascript
// src/lib/redux.js

// Redux のストア/アクション/リデューサーの単純な実装。
// 実際のアプリケーションではもっと複雑で複数のファイルに分かれます。
import { createStore } from 'redux';

// アクションはストアに対して発生する変更の名前です
export const actions = {
  ARCHIVE_TASK: 'ARCHIVE_TASK',
  PIN_TASK: 'PIN_TASK',
};

// アクションクリエーターはアクションの実行に必要なデータをまとめます
export const archiveTask = id => ({ type: actions.ARCHIVE_TASK, id });
export const pinTask = id => ({ type: actions.PIN_TASK, id });

// 今回のリデューサーは単純に一つのタスクの状態のみを変更します
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

// リデューサーはアクションごとにストア内のデータを変更する方法を定義します
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

// アプリケーションが起動したときの最初の状態です。
// 大抵はサーバーからデータを取得します。
const defaultTasks = [
  { id: '1', title: 'Something', state: 'TASK_INBOX' },
  { id: '2', title: 'Something more', state: 'TASK_INBOX' },
  { id: '3', title: 'Something else', state: 'TASK_INBOX' },
  { id: '4', title: 'Something again', state: 'TASK_INBOX' },
];

// Redux のストアを生成してからエクスポートします
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
  /* 前回の TaskList の実装 */
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

この段階で、Storybook のテストが動かなくなってしまいました。`TaskList` がストアに接続されてコンテナーとなり、プロパティが不要となりました。、代わりに、`TaskList` にラップされた `PureTaskList` にプロパティがセットされています。

この問題は、Storybook の該当するストーリーに、プレゼンテーショナルコンポーネントである `PureTaskList` エクスポートして、描画することにより、簡単に解決できます:

```javascript
// src/components/TaskList.stories.js

import React from 'react';

import { PureTaskList } from './TaskList';
import { taskData, actionsData } from './Task.stories';

export default {
  component: PureTaskList,
  title: 'TaskList',
  decorators: [story => <div style={{ padding: '3rem' }}>{story()}</div>],
  excludeStories: /.*Data$/,
};

export const defaultTasksData = [
  { ...taskData, id: '1', title: 'Task 1' },
  { ...taskData, id: '2', title: 'Task 2' },
  { ...taskData, id: '3', title: 'Task 3' },
  { ...taskData, id: '4', title: 'Task 4' },
  { ...taskData, id: '5', title: 'Task 5' },
  { ...taskData, id: '6', title: 'Task 6' },
];

export const withPinnedTasksData = [
  ...defaultTasksData.slice(0, 5),
  { id: '6', title: 'Task 6 (pinned)', state: 'TASK_PINNED' },
];

export const Default = () => <PureTaskList tasks={defaultTasksData} {...actionsData} />;

export const WithPinnedTasks = () => <PureTaskList tasks={withPinnedTasksData} {...actionsData} />;

export const Loading = () => <PureTaskList loading tasks={[]} {...actionsData} />;

export const Empty = () => <PureTaskList tasks={[]} {...actionsData} />;
```

<video autoPlay muted playsInline loop>
  <source
    src="/intro-to-storybook/finished-tasklist-states.mp4"
    type="video/mp4"
  />
</video>

<div class="aside">
さらにスナップショットテストも失敗しているはずなので、既存のスナップショットテストを <code>-u</code> フラグを付けて実行しなければなりません。<a href="/intro-to-storybook/react/ja/get-started/">はじめに</a>の章で言ったように、<code> --watchAll</code> フラグをつけてテストを実行するのがよいでしょう。
</div>
