---
title: '複合的なコンポーネントを組み立てる'
tocTitle: '複合的なコンポーネント'
description: '単純なコンポーネントから複合的なコンポーネントを組み立てましょう'
commit: '3da0d0a'
---

前の章では、最初のコンポーネントを作成しました。この章では、学習した内容を基にタスクのリストである TaskList を作成します。それではコンポーネントを組み合わせて、複雑になった場合にどうすればよいか見てみましょう。

## Tasklist (タスクリスト)

Taskbox はピン留めされたタスクを通常のタスクより上部に表示することで強調します。これにより `TaskList` に、タスクのリストが、通常のタスクのみである場合と、ピン留めされたタスクとの組み合わせである場合という、ストーリーを追加するべき 2 つのバリエーションができます。

![通常のタスクとピン留めされたタスク](/intro-to-storybook/tasklist-states-1.png)

`Task` のデータは非同期的に送信されるので、接続がないことを示すため、読み込み中の状態**も**必要となります。さらにタスクがない場合に備え、空の状態も必要です。

![空の状態と読み込み中の状態](/intro-to-storybook/tasklist-states-2.png)

## セットアップする

複合的なコンポーネントも基本的なコンポーネントと大きな違いはありません。`TaskList` のコンポーネントとそのストーリーファイル、`src/app/components/task-list-component.ts` と `src/app/components/task-list.stories.ts` を作成しましょう。

まずは `TaskList` の大まかな実装から始めます。前の章で作成した `Task` コンポーネントをインポートし、属性とアクションを入力として渡します。

```ts:title=src/app/components/task-list.component.ts
import { Component, Input, Output, EventEmitter } from '@angular/core';

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
export default class TaskListComponent {
  /** The list of tasks */
  @Input() tasks: Task[] = [];

  /** Checks if it's in loading state */
  @Input() loading = false;

  /** Event to change the task to pinned */
  // tslint:disable-next-line: no-output-on-prefix
  @Output()
  onPinTask = new EventEmitter<Event>();

  /** Event to change the task to archived */
  // tslint:disable-next-line: no-output-on-prefix
  @Output()
  onArchiveTask = new EventEmitter<Event>();
}
```

次に `TaskList` のテスト状態をストーリーファイルに記述します。

```ts:title=src/app/components/task-list.stories.ts
import type { Meta, StoryObj } from '@storybook/angular';

import { argsToTemplate, componentWrapperDecorator, moduleMetadata } from '@storybook/angular';

import { CommonModule } from '@angular/common';

import TaskListComponent from './task-list.component';
import TaskComponent from './task.component';

import * as TaskStories from './task.stories';

const meta: Meta<TaskListComponent> = {
  component: TaskListComponent,
  title: 'TaskList',
  tags: ['autodocs'],
  decorators: [
    moduleMetadata({
      //👇 Imports both components to allow component composition with Storybook
      declarations: [TaskListComponent, TaskComponent],
      imports: [CommonModule],
    }),
    //👇 Wraps our stories with a decorator
    componentWrapperDecorator(
      (story) => `<div style="margin: 3em">${story}</div>`
    ),
  ],
  render: (args: TaskListComponent) => ({
    props: {
      ...args,
      onPinTask: TaskStories.actionsData.onPinTask,
      onArchiveTask: TaskStories.actionsData.onArchiveTask,
    },
    template: `<app-task-list ${argsToTemplate(args)}></app-task-list>`,
  }),
};
export default meta;
type Story = StoryObj<TaskListComponent>;

export const Default: Story = {
  args: {
    tasks: [
      { ...TaskStories.Default.args?.task, id: '1', title: 'Task 1' },
      { ...TaskStories.Default.args?.task, id: '2', title: 'Task 2' },
      { ...TaskStories.Default.args?.task, id: '3', title: 'Task 3' },
      { ...TaskStories.Default.args?.task, id: '4', title: 'Task 4' },
      { ...TaskStories.Default.args?.task, id: '5', title: 'Task 5' },
      { ...TaskStories.Default.args?.task, id: '6', title: 'Task 6' },
    ],
  },
};

export const WithPinnedTasks: Story = {
  args: {
    tasks: [
      // Shaping the stories through args composition.
      // Inherited data coming from the Default story.
      ...(Default.args?.tasks?.slice(0, 5) || []),
      { id: '6', title: 'Task 6 (pinned)', state: 'TASK_PINNED' },
    ],
  },
};

export const Loading: Story = {
  args: {
    tasks: [],
    loading: true,
  },
};

export const Empty: Story = {
  args: {
    // Shaping the stories through args composition.
    // Inherited data coming from the Loading story.
    ...Loading.args,
    loading: false,
  },
};
```

<div class="aside">
💡 <a href="https://storybook.js.org/docs/angular/writing-stories/decorators"><b>デコレーター</b></a>を使ってストーリーに任意のラッパーを設定できます。上記のコードでは、decoratorというキーをデフォルトエクスポートで使用し、レンダリングされたコンポーネントの周りに<code>余白</code>を追加するために使っています。ストーリーで使用する「プロバイダー」(例えば、コンテキストを設定するライブラリコンポーネントなど) でストーリーをラップするにも使用します。
</div>

`TaskStories` をインポートすることで、ストーリーに必要な引数 (args) を最小限の労力で[組み合わせる](https://storybook.js.org/docs/angular/writing-stories/args#args-composition)ことができます。そうすることで、2 つのコンポーネントが想定するデータとアクション (呼び出しのモック) の一貫性が保たれます。

それでは `TaskListComponent` の新しいストーリーを Storybook で確認してみましょう。

<video autoPlay muted playsInline loop>
  <source
    src="/intro-to-storybook/inprogress-tasklist-states-7-0.mp4"
    type="video/mp4"
  />
</video>

## 状態を作りこむ

今のコンポーネントはまだ粗削りですが、ストーリーは見えています。単に `.list-items` だけのためにラッパーを作るのは単純すぎると思うかもしれません。実際にその通りです。ほとんどの場合単なるラッパーのためだけに新しいコンポーネントは作りません。 `TaskList`コンポーネント の**本当の複雑さ**は `WithPinnedTasks`、`loading`、`empty` といったエッジケースに現われているのです。

```diff:title=src/app/components/task-list.component.ts
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Task } from '../models/task.model';

@Component({
  selector: 'app-task-list',
+ template: `
+   <div class="list-items">
+     <app-task
+       *ngFor="let task of tasksInOrder"
+       [task]="task"
+       (onArchiveTask)="onArchiveTask.emit($event)"
+       (onPinTask)="onPinTask.emit($event)"
+     >
+     </app-task>
+     <div
+       *ngIf="tasksInOrder.length === 0 && !loading"
+       class="wrapper-message"
+     >
+       <span class="icon-check"></span>
+       <p class="title-message">You have no tasks</p>
+       <p class="subtitle-message">Sit back and relax</p>
+     </div>
+     <div *ngIf="loading">
+       <div *ngFor="let i of [1, 2, 3, 4, 5, 6]" class="loading-item">
+         <span class="glow-checkbox"></span>
+         <span class="glow-text">
+           <span>Loading</span> <span>cool</span> <span>state</span>
+         </span>
+       </div>
+     </div>
+   </div>
  `,
})
export default class TaskListComponent {
- /** The list of tasks */
- @Input() tasks: Task[] = [];

+  /**
+  * @ignore
+  * Component property to define ordering of tasks
+  */
+ tasksInOrder: Task[] = [];

  @Input() loading = false;

  // tslint:disable-next-line: no-output-on-prefix
  @Output() onPinTask: EventEmitter<any> = new EventEmitter();

  // tslint:disable-next-line: no-output-on-prefix
  @Output() onArchiveTask: EventEmitter<any> = new EventEmitter();

+ @Input()
+ set tasks(arr: Task[]) {
+   const initialTasks = [
+     ...arr.filter(t => t.state === 'TASK_PINNED'),
+     ...arr.filter(t => t.state !== 'TASK_PINNED'),
+   ];
+   const filteredTasks = initialTasks.filter(
+     t => t.state === 'TASK_INBOX' || t.state === 'TASK_PINNED'
+   );
+   this.tasksInOrder = filteredTasks.filter(
+     t => t.state === 'TASK_INBOX' || t.state === 'TASK_PINNED'
+   );
+ }
}
```

追加したマークアップで UI は以下のようになります:

<video autoPlay muted playsInline loop>
  <source
    src="/intro-to-storybook/finished-tasklist-states-6-0.mp4"
    type="video/mp4"
  />
</video>

リスト内のピン留めされたタスクの位置に注目してください。ピン留めされたタスクはユーザーにとって優先度を高くするため、リストの先頭に描画されます。

## データ要件

コンポーネントが大きくなるにつれ、入力の要件も増えていきます。`TaskList`コンポーネントのプロパティの要件を Typescript で定義しましょう。`Task` が子供のコンポーネントなので、表示するのに正しいデータ構造が渡されていることを確認しましょう。時間を節約するため、前の章で `task.model.ts` に定義したモデルを再利用しましょう。

<div class="aside">
💡 Git へのコミットを忘れずに行ってください！
</div>
