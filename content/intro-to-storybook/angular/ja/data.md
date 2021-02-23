---
title: 'データを繋ぐ'
tocTitle: 'データ'
description: 'UI コンポーネントとデータを繋ぐ方法を学びましょう'
commit: 34f1938
---

これまでに、Storybook の切り離された環境で、状態を持たないコンポーネントを作成してきました。しかし、究極的には、アプリケーションからコンポーネントにデータを渡さなければ役には立ちません。

このチュートリアルは「アプリケーションを作る方法について」ではないので、詳細までは説明しませんが、コンテナーコンポーネントとデータを繋ぐ一般的なパターンについて見てみましょう。

## Container components

`TaskList` コンポーネントは、今のところ、それ自体では外部とのやりとりをしないので「presentational (表示用)」([このブログ記事](https://medium.com/@dan_abramov/smart-and-dumb-components-7ca2f9a7c7d0)を参照) として書かれています。データを取得するためには「container (コンテナー)」が必要です。

ここではデータを保存する際に使用される React で人気のライブラリーである [Redux](https://redux.js.org/) を使用し、アプリケーションにシンプルなデータモデルを作ります。[Apollo](https://www.apollographql.com/client/) や [MobX](https://mobx.js.org/) といった他のデータ管理用のライブラリーでもここでのパターンが使用できます。

シンプルなデータモデルを作るため、ここでは[ngxs](https://ngxs.gitbook.io/ngxs/)を使います。Redux/ngrxの原則を受入れつつボイラープレートを減らし、よりAngularらしい状態管理を提供することに注力したライブラリです。[Apollo](https://www.apollographql.com/client/) や [MobX](https://mobx.js.org/) といった他のデータ管理用のライブラリーでもここでのパターンが使用できます。

まず、ngxsをインストールします:

```bash
npm install @ngxs/store @ngxs/logger-plugin @ngxs/devtools-plugin
```

それからタスクの状態を変更するアクションを処理する単純なストアを作ります。`src/app/state/task.state.ts` というファイルを作ってください (あえて簡単にしています):

```typescript
// src/app/state/task.state.ts
import { State, Selector, Action, StateContext } from '@ngxs/store';
import { Task } from '../models/task.model';

// defines the actions available to the app
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
const defaultTasks = {
  1: { id: '1', title: 'Something', state: 'TASK_INBOX' },
  2: { id: '2', title: 'Something more', state: 'TASK_INBOX' },
  3: { id: '3', title: 'Something else', state: 'TASK_INBOX' },
  4: { id: '4', title: 'Something again', state: 'TASK_INBOX' },
};

export class TaskStateModel {
  entities: { [id: number]: Task };
}

// sets the default state
@State<TaskStateModel>({
  name: 'tasks',
  defaults: {
    entities: defaultTasks,
  },
})
export class TasksState {
  @Selector()
  static getAllTasks(state: TaskStateModel) {
    const entities = state.entities;
    return Object.keys(entities).map(id => entities[+id]);
  }

  // triggers the PinTask action, similar to redux
  @Action(PinTask)
  pinTask({ patchState, getState }: StateContext<TaskStateModel>, { payload }: PinTask) {
    const state = getState().entities;

    const entities = {
      ...state,
      [payload]: { ...state[payload], state: 'TASK_PINNED' },
    };

    patchState({
      entities,
    });
  }
  // triggers the archiveTask action, similar to redux
  @Action(ArchiveTask)
  archiveTask({ patchState, getState }: StateContext<TaskStateModel>, { payload }: ArchiveTask) {
    const state = getState().entities;

    const entities = {
      ...state,
      [payload]: { ...state[payload], state: 'TASK_ARCHIVED' },
    };

    patchState({
      entities,
    });
  }
}
```

ストアを実装しましたが、アプリにつなげる前にいくつかのステップを踏む必要があります。

ストアからデータを読むように`TaskListComponent`を更新しますが、まず表示用のバージョンを`pure-task-list.component.ts`という新しいファイルへ移動し(`selector`は`app-pure-task-list`に変更します)、コンテナーでラップします。

以下、`src/app/components/pure-task-list.component.ts`の内容です:

```typescript
//src/app/components/pure-task-list.component.ts

import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Task } from '../models/task.model';

@Component({
  selector: 'app-pure-task-list',
  // same content as before with the task-list.component.ts
})
export class PureTaskListComponent implements OnInit {
  // same content as before with the task-list.component.ts
}
```

その後、`src/app/components/task-list.component.ts`を以下のように変更します:

```typescript
// src/app/components/task-list.component.ts

import { Component, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { TasksState, ArchiveTask, PinTask } from '../state/task.state';
import { Task } from '../models/task.model';
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
export class TaskListComponent implements OnInit {
  @Select(TasksState.getAllTasks) tasks$: Observable<Task[]>;

  constructor(private store: Store) {}

  ngOnInit() {}
  archiveTask(id: string) {
    this.store.dispatch(new ArchiveTask(id));
  }

  pinTask(id: string) {
    this.store.dispatch(new PinTask(id));
  }
}
```

コンポーネントとストアの橋渡しをするAngularモジュールを作ります。

`components`フォルダ内に`task.module.ts`というファイルを作成し、以下の内容を追加します:

```typescript
//src/app/components/task.module.ts

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxsModule } from '@ngxs/store';

import { TaskComponent } from './task.component';
import { TaskListComponent } from './task-list.component';
import { TasksState } from '../state/task.state';
import { PureTaskListComponent } from './pure-task-list.component';

@NgModule({
  imports: [CommonModule, NgxsModule.forFeature([TasksState])],
  exports: [TaskComponent, TaskListComponent],
  declarations: [TaskComponent, TaskListComponent, PureTaskListComponent],
  providers: [],
})
export class TaskModule {}
```

全てのピースが揃ったので、後はストアをアプリケーションに繋げるだけです。トップレベルモジュール(`src/app/app.module.ts`)に以下の内容を記載します:

```typescript
// src/app/app.module.ts

import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { TaskModule } from './components/task.module';
import { NgxsModule } from '@ngxs/store';
import { NgxsReduxDevtoolsPluginModule } from '@ngxs/devtools-plugin';
import { NgxsLoggerPluginModule } from '@ngxs/logger-plugin';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    TaskModule,
    NgxsModule.forRoot([]),
    NgxsReduxDevtoolsPluginModule.forRoot(),
    NgxsLoggerPluginModule.forRoot(),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
```

表示用の`TaskList`をそのままにするのは、テストと分離が容易になるからです。ストアの存在に依存しないので、テストの観点から見ると取り扱いがより簡単になります。`src/app/components/task-list.stories.ts`を`src/app/components/pure-task-list.stories.ts`に変更し、ストーリーが表示用のバージョンを使っていることを確認しましょう:

```typescript
// src/app/components/pure-task-list.stories.ts

import { moduleMetadata } from '@storybook/angular';
import { CommonModule } from '@angular/common';
import { PureTaskListComponent } from './pure-task-list.component';
import { TaskComponent } from './task.component';
import { taskData, actionsData } from './task.stories';

export default {
  title: 'PureTaskList',
  excludeStories: /.*Data$/,
  decorators: [
    moduleMetadata({
      // imports both components to allow component composition with storybook
      declarations: [PureTaskListComponent, TaskComponent],
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
  component: PureTaskListComponent,
  template: `
  <div style="padding: 3rem">
    <app-pure-task-list [tasks]="tasks" (onPinTask)="onPinTask($event)" (onArchiveTask)="onArchiveTask($event)"></app-pure-task-list>
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
  component: PureTaskListComponent,
  template: `
    <div style="padding: 3rem">
      <app-pure-task-list [tasks]="tasks" (onPinTask)="onPinTask($event)" (onArchiveTask)="onArchiveTask($event)"></app-pure-task-list>
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
          <app-pure-task-list [tasks]="[]" loading="true" (onPinTask)="onPinTask($event)" (onArchiveTask)="onArchiveTask($event)"></app-pure-task-list>
        </div>
      `,
});
// tasklist no tasks
export const Empty = () => ({
  template: `
        <div style="padding: 3rem">
          <app-pure-task-list [tasks]="[]" (onPinTask)="onPinTask($event)" (onArchiveTask)="onArchiveTask($event)"></app-pure-task-list>
        </div>
      `,
});
```

<video autoPlay muted playsInline loop>
  <source
    src="/intro-to-storybook/finished-tasklist-states.mp4"
    type="video/mp4"
  />
</video>

同様に, `PureTaskListComponent`をJestのテストで使用する必要があります:

```typescript
// src/app/components/task-list.component.spec.ts

import { render } from '@testing-library/angular';
import { PureTaskListComponent } from './pure-task-list.component';
import { TaskComponent } from './task.component';
import { withPinnedTasksData } from './pure-task-list.stories';
describe('PureTaskList component', () => {
  it('renders pinned tasks at the start of the list', async () => {
    const mockedActions = jest.fn();
    const tree = await render(PureTaskListComponent, {
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

<div class="aside">

さらにスナップショットテストも失敗しているはずなので、既存のスナップショットテストを <code>-u</code> フラグを付けて実行しなければなりません。

Git へのコミットを忘れずに行ってください！

</div>
