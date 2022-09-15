---
title: 'データを繋ぐ'
tocTitle: 'データ'
description: 'UI コンポーネントとデータを繋ぐ方法を学びましょう'
commit: '94b134e'
---

これまでに、Storybook の切り離された環境で、状態を持たないコンポーネントを作成してきました。しかし、究極的には、アプリケーションからコンポーネントにデータを渡さなければ役には立ちません。

このチュートリアルは「アプリケーションを作る方法について」ではないので、詳細までは説明しませんが、コンポーネントとデータを繋ぐ一般的なパターンについて見てみましょう。

## 繋がれたコンポーネント

`TaskList` コンポーネントは、今のところ「presentational (表示用)」として書かれており、その実装以外の外部とは何もやりとりをしません。データを中に入れるためにはデータプロバイダに繋ぐ必要があります。

ここではデータを保存する際に使用される React で人気のライブラリーである [Redux](https://redux.js.org/) を使用し、アプリケーションにシンプルなデータモデルを作ります。[Apollo](https://www.apollographql.com/client/) や [MobX](https://mobx.js.org/) といった他のデータ管理用のライブラリーでもここでのパターンが使用できます。

以下のコマンドを実行し必要な依存関係を追加しましょう:

```shell
yarn add @reduxjs/toolkit react-redux
```

まず、タスクの状態を変更するアクションを処理する単純な Redux のストアを作ります。`src/lib` フォルダの `store.js` というファイルを作ってください (あえて簡単にしています):

```js:title=src/lib/store.js
/* A simple redux store/actions/reducer implementation.
 * A true app would be more complex and separated into different files.
 */
import { configureStore, createSlice } from '@reduxjs/toolkit';

/*
 * The initial state of our store when the app loads.
 * Usually, you would fetch this from a server. Let's not worry about that now
 */
const defaultTasks = [
  { id: '1', title: 'Something', state: 'TASK_INBOX' },
  { id: '2', title: 'Something more', state: 'TASK_INBOX' },
  { id: '3', title: 'Something else', state: 'TASK_INBOX' },
  { id: '4', title: 'Something again', state: 'TASK_INBOX' },
];
const TaskBoxData = {
  tasks: defaultTasks,
  status: 'idle',
  error: null,
};

/*
 * The store is created here.
 * You can read more about Redux Toolkit's slices in the docs:
 * https://redux-toolkit.js.org/api/createSlice
 */
const TasksSlice = createSlice({
  name: 'taskbox',
  initialState: TaskBoxData,
  reducers: {
    updateTaskState: (state, action) => {
      const { id, newTaskState } = action.payload;
      const task = state.tasks.findIndex((task) => task.id === id);
      if (task >= 0) {
        state.tasks[task].state = newTaskState;
      }
    },
  },
});

// The actions contained in the slice are exported for usage in our components
export const { updateTaskState } = TasksSlice.actions;

/*
 * Our app's store configuration goes here.
 * Read more about Redux's configureStore in the docs:
 * https://redux-toolkit.js.org/api/configureStore
 */
const store = configureStore({
  reducer: {
    taskbox: TasksSlice.reducer,
  },
});

export default store;
```

次に、`TaskList` コンポーネントのデフォルトエクスポートを更新し、Redux のストアに 「connect (接続)」し、ストアから、気になるタスクのリストを描画します。

```js:title=src/components/TaskList.js
import React from 'react';
import Task from './Task';
import { useDispatch, useSelector } from 'react-redux';
import { updateTaskState } from '../lib/store';

export default function TaskList() {
  // We're retrieving our state from the store
  const tasks = useSelector((state) => {
    const tasksInOrder = [
      ...state.taskbox.tasks.filter((t) => t.state === 'TASK_PINNED'),
      ...state.taskbox.tasks.filter((t) => t.state !== 'TASK_PINNED'),
    ];
    const filteredTasks = tasksInOrder.filter(
      (t) => t.state === 'TASK_INBOX' || t.state === 'TASK_PINNED'
    );
    return filteredTasks;
  });

  const { status } = useSelector((state) => state.taskbox);

  const dispatch = useDispatch();

  const pinTask = (value) => {
    // We're dispatching the Pinned event back to our store
    dispatch(updateTaskState({ id: value, newTaskState: 'TASK_PINNED' }));
  };
  const archiveTask = (value) => {
    // We're dispatching the Archive event back to our store
    dispatch(updateTaskState({ id: value, newTaskState: 'TASK_ARCHIVED' }));
  };
  const LoadingRow = (
    <div className="loading-item">
      <span className="glow-checkbox" />
      <span className="glow-text">
        <span>Loading</span> <span>cool</span> <span>state</span>
      </span>
    </div>
  );
  if (status === 'loading') {
    return (
      <div className="list-items" data-testid="loading" key={"loading"}>
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
      <div className="list-items" key={"empty"} data-testid="empty">
        <div className="wrapper-message">
          <span className="icon-check" />
          <div className="title-message">You have no tasks</div>
          <div className="subtitle-message">Sit back and relax</div>
        </div>
      </div>
    );
  }

  return (
    <div className="list-items" data-testid="success" key={"success"}>
      {tasks.map((task) => (
        <Task
          key={task.id}
          task={task}
          onPinTask={(task) => pinTask(task)}
          onArchiveTask={(task) => archiveTask(task)}
        />
      ))}
    </div>
  );
}
```

これで、Redux からデータを取得し、実際のデータでコンポ―ネントを生成できるようになりました。`src/app.js` に接続してコンポーネントを描画することも可能ですが、今のところはこのままにして、コンポーネント駆動の旅を続けましょう。

アプリケーションで表示する方法は次の章で説明しますのでご心配なく。

## デコレーターにコンテキストを渡す

この段階で、Storybook のテストが動かなくなりました。`TaskList` が繋がれたコンポーネントとなって、タスクを取得しアップデートするのに Redux ストアに依存しているからです。

![壊れたタスクリスト](/intro-to-storybook/broken-tasklist-optimized.png)

この問題を解決するために、さまざまなアプローチができます。しかし、私たちのアプリは非常に単純なので、[前の章](/intro-to-storybook/react/ja/composite-component)で行ったのと同様に、デコレーターに頼ることができ、Storybook の中でモックストアを利用できます:

```js:title=src/components/TaskList.stories.js
import React from 'react';

import TaskList from './TaskList';
import * as TaskStories from './Task.stories';

import { Provider } from 'react-redux';

import { configureStore, createSlice } from '@reduxjs/toolkit';

// A super-simple mock of the state of the store
export const MockedState = {
  tasks: [
    { ...TaskStories.Default.args.task, id: '1', title: 'Task 1' },
    { ...TaskStories.Default.args.task, id: '2', title: 'Task 2' },
    { ...TaskStories.Default.args.task, id: '3', title: 'Task 3' },
    { ...TaskStories.Default.args.task, id: '4', title: 'Task 4' },
    { ...TaskStories.Default.args.task, id: '5', title: 'Task 5' },
    { ...TaskStories.Default.args.task, id: '6', title: 'Task 6' },
  ],
  status: 'idle',
  error: null,
};

// A super-simple mock of a redux store
const Mockstore = ({ taskboxState, children }) => (
  <Provider
    store={configureStore({
      reducer: {
        taskbox: createSlice({
          name: 'taskbox',
          initialState: taskboxState,
          reducers: {
            updateTaskState: (state, action) => {
              const { id, newTaskState } = action.payload;
              const task = state.tasks.findIndex((task) => task.id === id);
              if (task >= 0) {
                state.tasks[task].state = newTaskState;
              }
            },
          },
        }).reducer,
      },
    })}
  >
    {children}
  </Provider>
);

export default {
  component: TaskList,
  title: 'TaskList',
  decorators: [(story) => <div style={{ padding: "3rem" }}>{story()}</div>],
  excludeStories: /.*MockedState$/,
};

const Template = () => <TaskList />;

export const Default = Template.bind({});
Default.decorators = [
  (story) => <Mockstore taskboxState={MockedState}>{story()}</Mockstore>,
];

export const WithPinnedTasks = Template.bind({});
WithPinnedTasks.decorators = [
  (story) => {
    const pinnedtasks = [
      ...MockedState.tasks.slice(0, 5),
      { id: '6', title: 'Task 6 (pinned)', state: 'TASK_PINNED' },
    ];

    return (
      <Mockstore
        taskboxState={{
          ...MockedState,
          tasks: pinnedtasks,
        }}
      >
        {story()}
      </Mockstore>
    );
  },
];

export const Loading = Template.bind({});
Loading.decorators = [
  (story) => (
    <Mockstore
      taskboxState={{
        ...MockedState,
        status: 'loading',
      }}
    >
      {story()}
    </Mockstore>
  ),
];

export const Empty = Template.bind({});
Empty.decorators = [
  (story) => (
    <Mockstore
      taskboxState={{
        ...MockedState,
        tasks: [],
      }}
    >
      {story()}
    </Mockstore>
  ),
];
```

<div class="aside">
💡 <code>excludeStories</code> は Storybook の設定のフィールドで、モックされた状態がストーリーとして扱われるのを防ぐためのものです。このフィールドについては <a href="https://storybook.js.org/docs/react/api/csf">Storybook documentation</a> で詳しく説明されています。
</div>

<video autoPlay muted playsInline loop>
  <source
    src="/intro-to-storybook/finished-tasklist-states-6-4-optimized.mp4"
    type="video/mp4"
  />
</video>

<div class="aside">
💡 この変更により、全てのテストはアップデートが必要になります。<code>-u</code> フラグをつけてテストを再実行し、アップデートしてください。 Git へのコミットを忘れずに行ってください！
</div>

成功です! Storybook が動作し、接続されたコンポーネントにデータを渡す方法を確認することができました。次の章では、ここで学んだことを画面に適用してみましょう。
