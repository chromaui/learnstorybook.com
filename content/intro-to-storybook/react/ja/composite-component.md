---
title: '複合的なコンポーネントを組み立てる'
tocTitle: '複合的なコンポーネント'
description: '単純なコンポーネントから複合的なコンポーネントを組み立てましょう'
commit: 'cfa25b6'
---

前の章では、最初のコンポーネントを作成しました。この章では、学習した内容を基にタスクのリストである `TaskList` を作成します。それではコンポーネントを組み合わせて、複雑になった場合にどうすればよいか見てみましょう。

## TaskList (タスクリスト)

Taskbox はピン留めされたタスクを通常のタスクより上部に表示することで強調します。これにより `TaskList` に、タスクのリストが通常のタスクのみである場合と、ピン留めされたタスクとの組み合わせである場合というストーリーを追加するべき 2 つのバリエーションができます。

![通常のタスクとピン留めされたタスク](/intro-to-storybook/tasklist-states-1.png)

`Task` のデータは非同期に送信されるので、接続がないことを示すため、読み込み中の状態**も併せて**必要となります。さらにタスクがない場合に備え、空の状態も必要です。

![空の状態と読み込み中の状態](/intro-to-storybook/tasklist-states-2.png)

## セットアップする

複合的なコンポーネントも基本的なコンポーネントと大きな違いはありません。`TaskList` のコンポーネントとそのストーリーファイル、`src/components/TaskList.jsx` と `src/components/TaskList.stories.jsx` を作成しましょう。

まずは `TaskList` の大まかな実装から始めます。前の章で作成した `Task` コンポーネントをインポートし、属性とアクションを入力として渡します。

```jsx:title=src/components/TaskList.jsx
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
      {tasks.map(task => (
        <Task key={task.id} task={task} {...events} />
      ))}
    </div>
  );
}
```

次に `Tasklist` のテスト状態をストーリーファイルに記述します。

```jsx:title=src/components/TaskList.stories.jsx
import TaskList from './TaskList';

import * as TaskStories from './Task.stories';

export default {
  component: TaskList,
  title: 'TaskList',
  decorators: [(story) => <div style={{ padding: '3rem' }}>{story()}</div>],
  tags: ['autodocs'],
};

export const Default = {
  args: {
    // Shaping the stories through args composition.
    // The data was inherited from the Default story in Task.stories.jsx.
    tasks: [
      { ...TaskStories.Default.args.task, id: '1', title: 'Task 1' },
      { ...TaskStories.Default.args.task, id: '2', title: 'Task 2' },
      { ...TaskStories.Default.args.task, id: '3', title: 'Task 3' },
      { ...TaskStories.Default.args.task, id: '4', title: 'Task 4' },
      { ...TaskStories.Default.args.task, id: '5', title: 'Task 5' },
      { ...TaskStories.Default.args.task, id: '6', title: 'Task 6' },
    ],
  },
};

export const WithPinnedTasks = {
  args: {
    tasks: [
      ...Default.args.tasks.slice(0, 5),
      { id: '6', title: 'Task 6 (pinned)', state: 'TASK_PINNED' },
    ],
  },
};

export const Loading = {
  args: {
    tasks: [],
    loading: true,
  },
};

export const Empty = {
  args: {
    // Shaping the stories through args composition.
    // Inherited data coming from the Loading story.
    ...Loading.args,
    loading: false,
  },
};
```

<div class="aside">
💡 <a href="https://storybook.js.org/docs/writing-stories/decorators"><b>デコレーター</b></a>を使ってストーリーに任意のラッパーを設定できます。上記のコードでは、<code>decorators</code> というキーをデフォルトエクスポートに追加し、描画するコンポーネントの周りに <code>padding</code> を設定しています。ストーリーで使用する「プロバイダー」(例えば、React のコンテキストを設定するライブラリコンポーネントなど) を使うためにも使用します。
</div>

`TaskStories` をインポートすることで、ストーリーに必要な引数 (args) を最小限の労力で[組み合わせる](https://storybook.js.org/docs/writing-stories/args#args-composition)ことができます。そうすることで、2 つのコンポーネントが想定するデータとアクション (呼び出しのモック) の一貫性が保たれます。

それでは `TaskList` の新しいストーリーを Storybook で確認してみましょう。

<video autoPlay muted playsInline loop>
  <source
    src="/intro-to-storybook/inprogress-tasklist-states-7-0.mp4"
    type="video/mp4"
  />
</video>

## 状態を作りこむ

今のコンポーネントはまだ粗削りですが、ストーリーは見えています。単に `.list-items` だけのためにラッパーを作るのは単純すぎると思うかもしれません。実際、その通りです。ほとんどの場合、単なるラッパーのためだけに新しいコンポーネントは作りません。`TaskList` の**本当の複雑さ**は `withPinnedTasks`、`loading`、`empty` といったエッジケース(ユーザーが遭遇する可能性のあるまれなバグ)に現れているのです。

```jsx:title=src/components/TaskList.jsx
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
          <p className="title-message">You have no tasks</p>
          <p className="subtitle-message">Sit back and relax</p>
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

追加したマークアップで UI は以下のようになります。

<video autoPlay muted playsInline loop>
  <source
    src="/intro-to-storybook/finished-tasklist-states-7-0.mp4"
    type="video/mp4"
  />
</video>

リスト内のピン留めされたタスクの位置に注目してください。ピン留めされたタスクはユーザーにとって優先度を高くするため、リストの先頭に描画されます。

## データ要件とプロパティ

コンポーネントが大きくなるにつれ、入力の要件も増えていきます。`TaskList` のプロパティの要件を定義しましょう。`Task` が子供のコンポーネントなので、`Task` を表示するのに正しいデータ構造が渡されていることを確認しましょう。時間を節約するため、前の章で `Task` に定義した `propTypes` を再利用しましょう。

```diff:title=src/components/TaskList.jsx
import React from 'react';
+ import PropTypes from 'prop-types';

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
          <p className="title-message">You have no tasks</p>
          <p className="subtitle-message">Sit back and relax</p>
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

+ TaskList.propTypes = {
+  /** Checks if it's in loading state */
+  loading: PropTypes.bool,
+  /** The list of tasks */
+  tasks: PropTypes.arrayOf(Task.propTypes.task).isRequired,
+  /** Event to change the task to pinned */
+  onPinTask: PropTypes.func,
+  /** Event to change the task to archived */
+  onArchiveTask: PropTypes.func,
+ };
+ TaskList.defaultProps = {
+  loading: false,
+ };
```

<div class="aside">
💡 Git へのコミットを忘れずに行ってください！
</div>
