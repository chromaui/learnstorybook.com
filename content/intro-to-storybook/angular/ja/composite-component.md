---
title: '複合的なコンポーネントを組み立てる'
tocTitle: '複合的なコンポーネント'
description: '単純なコンポーネントから複合的なコンポーネントを組み立てましょう'
commit: d3abd86
---

前の章では、最初のコンポーネントを作成しました。この章では、学習した内容を基にタスクのリストである `TaskListComponent` を作成します。それではコンポーネントを組み合わせて、複雑になった場合にどうすればよいか見てみましょう。

## TaskListComponent (タスクリストコンポーネント)

Taskbox はピン留めされたタスクを通常のタスクより上部に表示することで強調します。これにより `TaskListComponent` に、タスクのリストが、通常のタスクのみである場合と、ピン留めされたタスクとの組み合わせである場合という、ストーリーを追加するべき 2 つのバリエーションができます。

![通常のタスクとピン留めされたタスク](/intro-to-storybook/tasklist-states-1.png)

`TaskComponent` のデータは非同期的に送信されるので、接続がないことを示すため、読み込み中の状態**も**必要となります。さらにタスクがない場合に備え、空の状態も必要です。

![空の状態と読み込み中の状態](/intro-to-storybook/tasklist-states-2.png)

## セットアップする

複合的なコンポーネントも基本的なコンポーネントと大きな違いはありません。`TaskListComponent` のコンポーネントとそのストーリーファイル、`src/components/task-list-component.ts` と `src/components/task-list.stories.js` を作成しましょう。

まずは `TaskListComponent` の大まかな実装から始めます。前の章で作成した `Task` コンポーネントをインポートし、属性とアクションを入力とイベントとして渡します。

```typescript
// src/app/components/task-list.component.ts

import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Task } from '../models/task.model';

@Component({
  selector: 'app-task-list',
  template: `
    <div class="list-items">
      <div *ngIf="loading">loading</div>
      <div *ngIf="!loading && tasks.length === 0">empty</div>
      <app-task
        *ngFor="let task of tasks"
        [task]="task"
        (onArchiveTask)="onArchiveTask.emit($event)"
        (onPinTask)="onPinTask.emit($event)"
      >
      </app-task>
    </div>
  `,
})
export class TaskListComponent implements OnInit {
  @Input() tasks: Task[] = [];
  @Input() loading = false;

  // tslint:disable-next-line: no-output-on-prefix
  @Output() onPinTask: EventEmitter<any> = new EventEmitter();
  // tslint:disable-next-line: no-output-on-prefix
  @Output() onArchiveTask: EventEmitter<any> = new EventEmitter();

  constructor() {}

  ngOnInit() {}
}
```

次に `TaskListComponent` のテスト状態をストーリーファイルに記述します。

```typescript
// src/app/components/task-list.stories.ts

import { moduleMetadata } from '@storybook/angular';
import { CommonModule } from '@angular/common';
import { TaskListComponent } from './task-list.component';
import { TaskComponent } from './task.component';
import { taskData, actionsData } from './task.stories';

export default {
  title: 'TaskList',
  excludeStories: /.*Data$/,
  decorators: [
    moduleMetadata({
      // imports both components to allow component composition with storybook
      declarations: [TaskListComponent, TaskComponent],
      imports: [CommonModule],
    }),
  ],
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
// default TaskList state
export const Default = () => ({
  component: TaskListComponent,
  template: `
  <div style="padding: 3rem">
    <app-task-list [tasks]="tasks" (onPinTask)="onPinTask($event)" (onArchiveTask)="onArchiveTask($event)"></app-task-list>
  </div>
`,
  props: {
    tasks: defaultTasksData,
    onPinTask: actionsData.onPinTask,
    onArchiveTask: actionsData.onArchiveTask,
  },
});
// tasklist with pinned tasks
export const WithPinnedTasks = () => ({
  component: TaskListComponent,
  template: `
    <div style="padding: 3rem">
      <app-task-list [tasks]="tasks" (onPinTask)="onPinTask($event)" (onArchiveTask)="onArchiveTask($event)"></app-task-list>
    </div>
  `,
  props: {
    tasks: withPinnedTasksData,
    onPinTask: actionsData.onPinTask,
    onArchiveTask: actionsData.onArchiveTask,
  },
});
// tasklist in loading state
export const Loading = () => ({
  template: `
        <div style="padding: 3rem">
          <app-task-list [tasks]="[]" loading="true" (onPinTask)="onPinTask($event)" (onArchiveTask)="onArchiveTask($event)"></app-task-list>
        </div>
      `,
});
// tasklist no tasks
export const Empty = () => ({
  template: `
        <div style="padding: 3rem">
          <app-task-list [tasks]="[]" (onPinTask)="onPinTask($event)" (onArchiveTask)="onArchiveTask($event)"></app-task-list>
        </div>
      `,
});
```

<div class="aside">
<a href="https://storybook.js.org/docs/react/writing-stories/decorators"><b>デコレーター</b></a>を使ってストーリーに任意のラッパーを設定できます。上記のコードでは、<code>decorators</code> というキーをデフォルトエクスポートに追加し、描画するコンポーネントの周りに <code>padding</code> を設定してます。ストーリーで使用する「プロバイダー」(例えば、React のコンテキストを設定するライブラリコンポーネントなど) を使うためにも使用します。
</div>

`taskData` は `task.stories.ts` ファイルでエクスポートした `Task` のデータ構造です。同様に `actionsData` は `TaskComponent` コンポーネントが想定するアクション (呼び出しのモック) を定義しています。`TaskListComponent` でも同様に必要となります。

それでは `TaskListComponent` の新しいストーリーを Storybook で確認してみましょう。

<video autoPlay muted playsInline loop>
  <source
    src="/intro-to-storybook/inprogress-tasklist-states.mp4"
    type="video/mp4"
  />
</video>

## 状態を作りこむ

今のコンポーネントはまだ粗削りですが、ストーリーは見えています。単に `.list-items` だけのためにラッパーを作るのは単純すぎると思うかもしれません。実際にその通りです。ほとんどの場合単なるラッパーのためだけに新しいコンポーネントは作りません。`TaskListComponent` の**本当の複雑さ**は `WithPinnedTasks`かつ`loading`かつ`empty`といったエッジケースに現われているのです。

```typescript
// src/app/components/task-list.component.ts

import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Task } from '../models/task.model';

@Component({
  selector: 'app-task-list',
  template: `
    <div class="list-items">
      <app-task
        *ngFor="let task of tasksInOrder"
        [task]="task"
        (onArchiveTask)="onArchiveTask.emit($event)"
        (onPinTask)="onPinTask.emit($event)"
      >
      </app-task>

      <div *ngIf="tasksInOrder.length === 0 && !loading" class="wrapper-message">
        <span class="icon-check"></span>
        <div class="title-message">You have no tasks</div>
        <div class="subtitle-message">Sit back and relax</div>
      </div>

      <div *ngIf="loading">
        <div *ngFor="let i of [1, 2, 3, 4, 5, 6]" class="loading-item">
          <span class="glow-checkbox"></span>
          <span class="glow-text"> <span>Loading</span> <span>cool</span> <span>state</span> </span>
        </div>
      </div>
    </div>
  `,
})
export class TaskListComponent implements OnInit {
  tasksInOrder: Task[] = [];
  @Input() loading = false;

  // tslint:disable-next-line: no-output-on-prefix
  @Output() onPinTask: EventEmitter<any> = new EventEmitter();

  // tslint:disable-next-line: no-output-on-prefix
  @Output() onArchiveTask: EventEmitter<any> = new EventEmitter();

  @Input()
  set tasks(arr: Task[]) {
    this.tasksInOrder = [
      ...arr.filter(t => t.state === 'TASK_PINNED'),
      ...arr.filter(t => t.state !== 'TASK_PINNED'),
    ];
  }

  constructor() {}

  ngOnInit() {}
}
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

コンポーネントが大きくなるにつれ、入力の要件も増えていきます。`TaskListComponent` のプロパティの要件を Typescript で定義しましょう。`TaskComponent` が子供のコンポーネントなので、表示するのに正しいデータ構造が渡されていることを確認しましょう。時間を節約するため、前の章で `task.model.ts` に定義したモデルを再利用しましょう。

## Automated testing

前の章で Storyshots を使用してストーリーのスナップショットテストを行う方法を学びました。`TaskComponent` では、問題なく描画されるのを確認することは、それほど複雑ではありませんでした。`TaskListComponent` では複雑さが増しているので、ある入力がある出力を生成するかどうかを、自動テスト可能な方法で検証したいと思います。そのためには [Jest](https://facebook.github.io/jest/) をテストレンダラーとともに使用し、単体テストを作ります。

![Jest ロゴ](/intro-to-storybook/logo-jest.png)

### Jest で単体テストする

Storybook のストーリーと、手動のテスト、スナップショットテストがあれば UI のバグを防ぐのに十分でしょう。ストーリーでコンポーネントの様々なユースケースをカバーしており、ストーリーへのどんな変更に対しても、人が確実に確認できるツールを使用していれば、エラーはめったに発生しなくなります。

けれども、悪魔は細部に宿ります。そういった細部を明確にするテストフレームワークが必要です。単体テストを始めましょう。

`TaskListComponent` の `tasks` プロパティで渡されたタスクのリストのうち、ピン留めされたタスクを通常のタスクの**前に**表示させたいと思います。このシナリオをテストするストーリー (`WithPinnedTasks`) は既にありますが、コンポーネントが並び替えを**しなくなった**場合に、それがバグかどうかを人間のレビュアーでは判別しかねます。ストーリーでは誰にでも分かるように、**間違っているよ！**と叫んではくれません。

この問題を回避するため、Jest を使ってストーリーを DOM に描画し、DOM を検索するコードを実行し、出力から目立った機能を検証します。ストーリー形式のいいところは単純にストーリーをインポートして、そのまま描画できるところです。

`task-list.component.spec.ts` にテストファイルを作ります。以下に、出力を検証するテストコードを示します。

```typescript
// src/app/components/task-list.component.spec.ts

import { render } from '@testing-library/angular';
import { TaskListComponent } from './task-list.component';
import { TaskComponent } from './task.component';
import { withPinnedTasksData } from './task-list.stories';
describe('TaskList component', () => {
  it('renders pinned tasks at the start of the list', async () => {
    const mockedActions = jest.fn();
    const tree = await render(TaskListComponent, {
      declarations: [TaskComponent],
      componentProperties: {
        tasks: withPinnedTasksData,
        loading: false,
        onPinTask: {
          emit: mockedActions,
        } as any,
        onArchiveTask: {
          emit: mockedActions,
        } as any,
      },
    });
    const component = tree.fixture.componentInstance;
    expect(component.tasksInOrder[0].id).toBe('6');
  });
});
```

![TaskList のテストランナー](/intro-to-storybook/tasklist-testrunner.png)

単体テストで `withPinnedTasksData` ストーリーを再利用出来ていることに注目してください。このように、多様な方法で既存のリソースを活用していくことができます。

ただし、このテストは非常に脆いことにも留意してください。プロジェクトが成熟し、`Task` の実装が変わっていく (たとえば、別のクラス名に変更されたり、`input` 要素ではなく `textarea` に変更されたりする) と、テストが失敗し、更新が必要となる可能性があります。これは必ずしも問題とならないかもしれませんが、UI の単体テストを使用する際の注意点です。UI の単体テストはメンテナンスが難しいのです。可能な限り手動のテストや、スナップショットテスト、視覚的なリグレッションテスト ([テストの章](/angular/ja/test/)を参照してください) に頼るようにしてください。

<div class="aside">
Git へのコミットを忘れずに行ってください！
</div>
