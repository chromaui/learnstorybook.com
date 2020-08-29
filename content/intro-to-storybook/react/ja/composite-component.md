---
title: '複合的なコンポーネントを組み立てる'
tocTitle: '複合的なコンポーネント'
description: '単純なコンポーネントから複合的なコンポーネントを組み立てましょう'
commit: 'c43580d'
---

前の章では、最初のコンポーネントを作成しました。この章では、学習した内容を基にタスクのリストである `TaskList` を作成します。それではコンポーネントを組み合わせて、複雑になった場合にどうすればよいか見てみましょう。

## TaskList (タスクリスト)

Taskbox はピン留めされたタスクを通常のタスクより上部に表示することで強調します。これにより `TaskList` に、タスクのリストが、通常のタスクのみである場合と、ピン留めされたタスクとの組み合わせである場合という、ストーリーを追加するべき 2 つのバリエーションができます。

![通常のタスクとピン留めされたタスク](/intro-to-storybook/tasklist-states-1.png)

`Task` のデータは非同期的に送信されるので、接続がないことを示すため、読み込み中の状態**も**必要となります。さらにタスクがない場合に備え、空の状態も必要です。

![空の状態と読み込み中の状態](/intro-to-storybook/tasklist-states-2.png)

## セットアップする

複合的なコンポーネントも基本的なコンポーネントと大きな違いはありません。`TaskList` のコンポーネントとそのストーリーファイル、`src/components/TaskList.js` と `src/components/TaskList.stories.js` を作成しましょう。

まずは `TaskList` の大まかな実装から始めます。前の章で作成した `Task` コンポーネントをインポートし、属性とアクションを入力として渡します。

```javascript
// src/components/TaskList.js

import React from 'react';

import Task from './Task';

function TaskList({ loading, tasks, onPinTask, onArchiveTask }) {
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

export default TaskList;
```

次に `Tasklist` のテスト状態をストーリーファイルに記述します。

```javascript
// src/components/TaskList.stories.js

import React from 'react';

import TaskList from './TaskList';
import { taskData, actionsData } from './Task.stories';

export default {
  component: TaskList,
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

export const Default = () => <TaskList tasks={defaultTasksData} {...actionsData} />;

export const WithPinnedTasks = () => <TaskList tasks={withPinnedTasksData} {...actionsData} />;

export const Loading = () => <TaskList loading tasks={[]} {...actionsData} />;

export const Empty = () => <TaskList tasks={[]} {...actionsData} />;
```

<div class="aside">
<a href="https://storybook.js.org/addons/introduction/#1-decorators"><b>デコレーター</b></a>を使ってストーリーに任意のラッパーを設定できます。上記のコードでは、<code>decorators</code> というキーをデフォルトエクスポートに追加し、描画するコンポーネントの周りに <code>padding</code> を設定してます。ストーリーで使用する「プロバイダー」(例えば、React のコンテキストを設定するライブラリコンポーネントなど) を使うためにも使用します。
</div>

`taskData` は `Task.stories.js` ファイルでエクスポートした `Task` のデータ形式です。同様に `actionsData` は `Task` コンポーネントが想定するアクション (コールバックのモック) を定義しています。`TaskList` でも同様に必要となります。

それでは `TaskList` の新しいストーリーを Storybook で確認してみましょう。

<video autoPlay muted playsInline loop>
  <source
    src="/intro-to-storybook/inprogress-tasklist-states.mp4"
    type="video/mp4"
  />
</video>

## 状態を作りこむ

今のコンポーネントはまだ粗削りですが、ストーリーは見えています。単に `.list-items` だけのためにラッパーを作るのは単純すぎると思うかもしれません。実際にその通りです。ほとんどの場合単なるラッパーのためだけに新しいコンポーネントは作りません。`TaskList` の**本当の複雑さ**は `withPinnedTasks`、`loading`、`empty` といったエッジケースに現れているのです。

```javascript
// src/components/TaskList.js

import React from 'react';

import Task from './Task';

function TaskList({ loading, tasks, onPinTask, onArchiveTask }) {
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
    ...tasks.filter(t => t.state === 'TASK_PINNED'),
    ...tasks.filter(t => t.state !== 'TASK_PINNED'),
  ];

  return (
    <div className="list-items">
      {tasksInOrder.map(task => (
        <Task key={task.id} task={task} {...events} />
      ))}
    </div>
  );
}

export default TaskList;
```

追加したマークアップで UI は以下のようになります:

<video autoPlay muted playsInline loop>
  <source
    src="/intro-to-storybook/finished-tasklist-states.mp4"
    type="video/mp4"
  />
</video>

リスト内のピン留めされたタスクの位置に注目してください。ピン留めされたタスクはユーザーにとって優先度を高くするため、リストの先頭に描画されます。

## データ要件とプロパティ

コンポーネントが大きくなるにつれ、入力の要件も増えていきます。`TaskList` のプロパティの要件を定義しましょう。`Task` が子供のコンポーネントなので、`Task` を表示するのに正しいデータ形式が渡されていることを確認しましょう。時間を節約するため、前の章で `Task` に定義した `propTypes` を再利用しましょう。

```javascript
// src/components/TaskList.js

import React from 'react';
import PropTypes from 'prop-types';

import Task from './Task';

function TaskList() {
  ...
}


TaskList.propTypes = {
  loading: PropTypes.bool,
  tasks: PropTypes.arrayOf(Task.propTypes.task).isRequired,
  onPinTask: PropTypes.func.isRequired,
  onArchiveTask: PropTypes.func.isRequired,
};

TaskList.defaultProps = {
  loading: false,
};

export default TaskList;
```

## 自動テスト

前の章で Storyshots を使用してストーリーのスナップショットテストを行う方法を学びました。`Task` では、問題なく描画されるのを確認することは、それほど複雑ではありませんでした。`TaskList` では複雑さが増しているので、ある入力がある出力を生成するかどうかを、自動テスト可能な方法で検証したいと思います。そのためには [Jest](https://facebook.github.io/jest/) をテストレンダラーとともに使用し、単体テストを作ります。

![Jest ロゴ](/intro-to-storybook/logo-jest.png)

### Jest で単体テストする

Storybook のストーリーと、手動のテスト、スナップショットテストがあれば UI のバグを防ぐことはできるでしょう。ストーリーでコンポーネントの様々なユースケースをカバーしており、ストーリーへの変更に対し、人が確認できるツールを使用していれば、エラーはあまり見かけないことでしょう。

けれども、細部には悪魔が潜んでいます。そういった細部を明確にするテストフレームワークが必要です。単体テストを始めましょう。

`TaskList` の `tasks` プロパティで渡されたタスクのリストのうち、ピン留めされたタスクを通常のタスクの**前に**表示させたいと思います。このシナリオをテストするストーリー (`WithPinnedTasks`) は既にありますが、コンポーネントが**並び替えをしなくなった**場合に、それがバグかどうかを人間のレビュアーでは判別しかねます。ストーリーでは誰の目にも分かるように、**間違っているよ！**と叫んではくれません。

この問題を回避するため、Jest を使ってストーリーを DOM に描画し、DOM を検索するコードを実行し、出力から目立った機能を検証します。ストーリーのいいところは単純にストーリーをインポートして、そのまま描画に使えるところです。

`src/components/TaskList.test.js` にテストファイルを作ります。以下に、出力を検証するテストコードを示します。

```javascript
// src/components/TaskList.test.js

import React from 'react';
import ReactDOM from 'react-dom';
import { WithPinnedTasks } from './TaskList.stories';

it('renders pinned tasks at the start of the list', () => {
  const div = document.createElement('div');
  ReactDOM.render(<WithPinnedTasks />, div);

  // タイトルが "Task 6 (pinned)" であるタスクが最後にではなく、最初に表示されるはず
  const lastTaskInput = div.querySelector('.list-item:nth-child(1) input[value="Task 6 (pinned)"]');
  expect(lastTaskInput).not.toBe(null);

  ReactDOM.unmountComponentAtNode(div);
});
```

![TaskList のテストランナー](/intro-to-storybook/tasklist-testrunner.png)

単体テストで `WithPinnedTasks` ストーリーを再利用出来ていることに注目してください。このように、いろいろな方法で既存のリソースを活用していくことができます。

ただし、このテストは非常に脆いことにも留意してください。プロジェクトが成熟し、`Task` の実装が変わっていく (たとえば、別のクラス名に変更されたり、`input` 要素ではなく `textarea` に変更されたりする) と、テストが失敗し、更新が必要となる可能性があります。これは必ずしも問題とならないかもしれませんが、UI の単体テストを使用する際の注意点です。UI の単体テストはメンテナンスが難しいのです。可能な限り手動のテストや、スナップショットテスト、視覚的なリグレッションテスト ([テストの章](/react/ja/test/)を参照してください) に頼るようにしてください。
