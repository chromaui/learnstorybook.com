---
title: 'データを繋ぐ'
tocTitle: 'データ'
description: 'UI コンポーネントとデータを繋ぐ方法を学びましょう'
commit: '33e3597'
---

これまでに、Storybook の切り離された環境で、状態を持たないコンポーネントを作成してきました。しかし、究極的には、アプリケーションからコンポーネントにデータを渡さなければ役には立ちません。

このチュートリアルは「アプリケーションを作る方法について」ではないので、詳細までは説明しませんが、コンテナーコンポーネントとデータを繋ぐ一般的なパターンについて見てみましょう。

## コンテナーコンポーネント

`TaskList` コンポーネントは、今のところ「presentational (表示用)」として書かれており、その実装以外の外部とは何もやりとりをしません。データを中に入れるためには「container (コンテナー)」が必要です。

ここでは Redux/ngrx の原則を取り入れつつボイラープレートを減らし、より Angular らしい状態管理の方法を提供する [ngxs](https://ngxs.gitbook.io/ngxs/) を使用し、アプリケーションにシンプルなデータモデルを作ります。しかし、 [ngrx/store](https://github.com/ngrx/platform) や [Apollo](https://www.apollographql.com/docs/angular/) といった他のデータ管理用のライブラリーでもここでのパターンが使用できます。

以下のコマンドを実行し必要な依存関係を追加しましょう:

```shell
npm install @ngxs/store @ngxs/logger-plugin @ngxs/devtools-plugin
```

まず、タスクの状態を変更するアクションを処理する単純なストアを作ります。`src/app/state` フォルダの `task.state.ts` というファイルを作ってください (あえて簡単にしています):

```ts:title=src/app/state/task.state.ts
import { Injectable } from '@angular/core';
import { State, Selector, Action, StateContext } from '@ngxs/store';
import { patch, updateItem } from '@ngxs/store/operators';
import { Task } from '../models/task.model';

// Defines the actions available to the app
export const actions = {
  ARCHIVE_TASK: 'ARCHIVE_TASK',
  PIN_TASK: 'PIN_TASK',
};

export class ArchiveTask {
  static readonly type = actions.ARCHIVE_TASK;

  constructor(public payload: string) {}
}

export class PinTask {
  static readonly type = actions.PIN_TASK;

  constructor(public payload: string) {}
}

// The initial state of our store when the app loads.
// Usually you would fetch this from a server
const defaultTasks = [
  { id: '1', title: 'Something', state: 'TASK_INBOX' },
  { id: '2', title: 'Something more', state: 'TASK_INBOX' },
  { id: '3', title: 'Something else', state: 'TASK_INBOX' },
  { id: '4', title: 'Something again', state: 'TASK_INBOX' },
];

export interface TaskStateModel {
  tasks: Task[];
  status: 'idle' | 'loading' | 'success' | 'error';
  error: boolean;
}

// Sets the default state
@State<TaskStateModel>({
  name: 'taskbox',
  defaults: {
    tasks: defaultTasks,
    status: 'idle',
    error: false,
  },
})
@Injectable()
export class TasksState {
  // Defines a new selector for the error field
  @Selector()
  static getError(state: TaskStateModel): boolean {
    return state.error;
  }

  @Selector()
  static getAllTasks(state: TaskStateModel): Task[] {
    return state.tasks;
  }

  // Triggers the PinTask action, similar to redux
  @Action(PinTask)
  pinTask(
    { getState, setState }: StateContext<TaskStateModel>,
    { payload }: PinTask
  ) {
    const task = getState().tasks.find((task) => task.id === payload);

    if (task) {
      const updatedTask: Task = {
        ...task,
        state: 'TASK_PINNED',
      };
      setState(
        patch({
          tasks: updateItem<Task>(
            (pinnedTask) => pinnedTask?.id === payload,
            updatedTask
          ),
        })
      );
    }
  }
  // Triggers the archiveTask action, similar to redux
  @Action(ArchiveTask)
  archiveTask(
    { getState, setState }: StateContext<TaskStateModel>,
    { payload }: ArchiveTask
  ) {
    const task = getState().tasks.find((task) => task.id === payload);
    if (task) {
      const updatedTask: Task = {
        ...task,
        state: 'TASK_ARCHIVED',
      };
      setState(
        patch({
          tasks: updateItem<Task>(
            (archivedTask) => archivedTask?.id === payload,
            updatedTask
          ),
        })
      );
    }
  }
}
```

そしてストアからデータを読み込むように`TaskList`コンポーネントを更新します。まず、表示用のバージョンを`src/app/components/pure-task-list.component.ts`という新しいファイルへ移動しコンテナーでラップします。

`src/app/components/pure-task-list.component.ts`:

```diff:title=src/app/components/pure-task-list.component.ts
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Task } from '../models/task.model';
@Component({
- selector:'app-task-list',
+ selector: 'app-pure-task-list',
  template: `
    <div class="list-items">
      <app-task
        *ngFor="let task of tasksInOrder"
        [task]="task"
        (onArchiveTask)="onArchiveTask.emit($event)"
        (onPinTask)="onPinTask.emit($event)"
      >
      </app-task>
      <div
        *ngIf="tasksInOrder.length === 0 && !loading"
        class="wrapper-message"
      >
        <span class="icon-check"></span>
        <p class="title-message">You have no tasks</p>
        <p class="subtitle-message">Sit back and relax</p>
      </div>
      <div *ngIf="loading">
        <div *ngFor="let i of [1, 2, 3, 4, 5, 6]" class="loading-item">
          <span class="glow-checkbox"></span>
          <span class="glow-text">
            <span>Loading</span> <span>cool</span> <span>state</span>
          </span>
        </div>
      </div>
    </div>
  `,
})
- export default class TaskListComponent {
+ export default class PureTaskListComponent {
    /**
     * @ignore
     * Component property to define ordering of tasks
    */
    tasksInOrder: Task[] = [];

    @Input() loading = false;

    // tslint:disable-next-line: no-output-on-prefix
    @Output() onPinTask: EventEmitter<any> = new EventEmitter();

    // tslint:disable-next-line: no-output-on-prefix
    @Output() onArchiveTask: EventEmitter<any> = new EventEmitter();

    @Input()
    set tasks(arr: Task[]) {
      const initialTasks = [
        ...arr.filter((t) => t.state === 'TASK_PINNED'),
        ...arr.filter((t) => t.state !== 'TASK_PINNED'),
      ];
      const filteredTasks = initialTasks.filter(
        (t) => t.state === 'TASK_INBOX' || t.state === 'TASK_PINNED'
      );
      this.tasksInOrder = filteredTasks.filter(
        (t) => t.state === 'TASK_INBOX' || t.state === 'TASK_PINNED'
      );
    }
 }
```

`src/app/components/task-list.component.ts`:

```ts:title=src/app/components/task-list.component.ts
import { Component } from '@angular/core';
import { Store } from '@ngxs/store';
import { ArchiveTask, PinTask } from '../state/task.state';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-task-list',
  template: `
    <app-pure-task-list
      [tasks]="tasks$ | async"
      (onArchiveTask)="archiveTask($event)"
      (onPinTask)="pinTask($event)"
    ></app-pure-task-list>
  `,
})
export default class TaskListComponent {
  tasks$?: Observable<any>;

  constructor(private store: Store) {
     this.tasks$ = store.select((state) => state.taskbox.tasks);
  }

  /**
   * Component method to trigger the archiveTask event
   */
  archiveTask(id: string) {
    this.store.dispatch(new ArchiveTask(id));
  }

  /**
   * Component method to trigger the pinTask event
   */
  pinTask(id: string) {
    this.store.dispatch(new PinTask(id));
  }
}
```

続いてコンポーネントとストアの橋渡しをする Angular モジュールを作ります。

`src/app/components`フォルダ内に`task.module.ts`というファイルを作成し、以下の内容を追加します:

```ts:title=src/app/components/task.module.ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxsModule } from '@ngxs/store';

import TaskComponent from './task.component';
import TaskListComponent from './task-list.component';
import { TasksState } from '../state/task.state';
import PureTaskListComponent from './pure-task-list.component';

@NgModule({
  imports: [CommonModule, NgxsModule.forFeature([TasksState])],
  exports: [TaskComponent, TaskListComponent],
  declarations: [TaskComponent, TaskListComponent, PureTaskListComponent],
  providers: [],
})
export class TaskModule {}
```

必要なものが揃いました。後はストアをアプリケーションに繋げるだけです。トップレベルモジュール(`src/app/app.module.ts`)を更新します:

```diff:title=src/app/app.module.ts
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

+ import { TaskModule } from './components/task.module';
+ import { NgxsModule } from '@ngxs/store';
+ import { NgxsReduxDevtoolsPluginModule } from '@ngxs/devtools-plugin';
+ import { NgxsLoggerPluginModule } from '@ngxs/logger-plugin';

+ import { environment } from '../environments/environment';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
+   TaskModule,
+    NgxsModule.forRoot([], {
+     developmentMode: !environment.production,
+   }),
+   NgxsReduxDevtoolsPluginModule.forRoot(),
+   NgxsLoggerPluginModule.forRoot({
+     disabled: environment.production,
+   }),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
```

表示用の TaskList をそのままにしておくのは、テストと分離が容易になるからです。ストアの存在に依存しないので、テストの観点から見ると取り扱いがより簡単になります。`src/app/components/task-list.stories.ts` を `src/app/components/pure-task-list.stories.ts` に変更し、ストーリーが表示用のバージョンを使っていることを確認しましょう:

```ts:title=src/app/components/pure-task-list.stories.ts
import type { Meta, StoryObj } from '@storybook/angular';

import { argsToTemplate, componentWrapperDecorator, moduleMetadata } from '@storybook/angular';

import { CommonModule } from '@angular/common';

import PureTaskListComponent from './pure-task-list.component';

import TaskComponent from './task.component';

import * as TaskStories from './task.stories';

const meta: Meta<PureTaskListComponent> = {
  component: PureTaskListComponent,
  title: 'PureTaskList',
  tags: ['autodocs'],
  decorators: [
    moduleMetadata({
      //👇 Imports both components to allow component composition with Storybook
      declarations: [PureTaskListComponent, TaskComponent],
      imports: [CommonModule],
    }),
    //👇 Wraps our stories with a decorator
    componentWrapperDecorator(
      (story) => `<div style="margin: 3em">${story}</div>`
    ),
  ],
  render: (args: PureTaskListComponent) => ({
    props: {
      ...args,
      onPinTask: TaskStories.actionsData.onPinTask,
      onArchiveTask: TaskStories.actionsData.onArchiveTask,
    },
    template: `<app-pure-task-list ${argsToTemplate(args)}></app-pure-task-list>`,
  }),
};
export default meta;
type Story = StoryObj<PureTaskListComponent>;

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

<video autoPlay muted playsInline loop>
  <source
    src="/intro-to-storybook/finished-puretasklist-states-7-0.mp4"
    type="video/mp4"
  />
</video>

<div class="aside">
💡 Git へのコミットを忘れずに行ってください！
</div>

今はストアから取得した実際のデータがありそれをコンポーネントに入れているので、 `src/app/app.component.ts` に繋げてそこでレンダリングすることもできました。安心してください。次の章でそれを行います。
