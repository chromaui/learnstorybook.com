---
title: '画面を作る'
tocTitle: '画面'
description: 'コンポーネントをまとめて画面を作りましょう'
commit: '45615b4'
---

今までボトムアップ (小さく始めてから複雑性を追加していく) で UI の作成に集中してきました。ボトムアップで作業することで、Storybook で遊びながら、それぞれのコンポーネントを切り離された環境で、それぞれに必要なデータを考えながら開発することができました。サーバーを立ち上げたり、画面を作ったりする必要は全くありませんでした！

この章では Storybook を使用して、コンポーネントを組み合わせて画面を作り、完成度を高めていきます。

## ネストされたコンテナーコンポーネント

このアプリケーションはとても単純なので、作る画面も些細なものです。 ngxs から自分でデータを取得する TaskListComponent を表示して、ストアからの error フィールド (サーバーとの接続に失敗したときに設定される項目だと思ってください) を追加するだけです。

(`src/app/state/task.state.ts`にある) ストアを更新して、 error フィールドを含めることから始めましょう

```diff:title=src/app/state/task.state.ts
import { State, Selector, Action, StateContext } from '@ngxs/store';
import { Task } from '../models/task.model';

// defines the actions available to the app
export const actions = {
  ARCHIVE_TASK: 'ARCHIVE_TASK',
  PIN_TASK: 'PIN_TASK',
  // Defines the new error field we need
+ ERROR: 'APP_ERROR',
};

export class ArchiveTask {
  static readonly type = actions.ARCHIVE_TASK;

  constructor(public payload: string) {}
}

export class PinTask {
  static readonly type = actions.PIN_TASK;

  constructor(public payload: string) {}
}
+ // The class definition for our error field
+ export class AppError {
+   static readonly type = actions.ERROR;
+   constructor(public payload: boolean) {}
+ }

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
+ error: boolean;
}

// Sets the default state
@State<TaskStateModel>({
  name: 'tasks',
  defaults: {
    entities: defaultTasks,
+   error: false,
  },
})
export class TasksState {
  @Selector()
  static getAllTasks(state: TaskStateModel) {
    const entities = state.entities;
    return Object.keys(entities).map(id => entities[+id]);
  }

  // Defines a new selector for the error field
  @Selector()
  static getError(state: TaskStateModel) {
    const { error } = state;
    return error;
  }
  //
  // Triggers the PinTask action, similar to redux
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
  // Triggers the PinTask action, similar to redux
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

+ // Function to handle how the state should be updated when the action is triggered
+ @Action(AppError)
+ setAppError({ patchState, getState }: StateContext<TaskStateModel>, { payload }: AppError) {
+   const state = getState();
+   patchState({
+     error: !state.error,
+   });
+ }
}
```

ストア が新しいフィールドを含むよう更新されました。`src/app/components/`に`pure-inbox-screen.component.ts`という名前で表示用コンポーネントを作りましょう:

```ts:title=src/app/components/pure-inbox-screen.component.ts
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-pure-inbox-screen',
  template: `
    <div *ngIf="error" class="page lists-show">
      <div class="wrapper-message">
        <span class="icon-face-sad"></span>
        <div class="title-message">Oh no!</div>
        <div class="subtitle-message">Something went wrong</div>
      </div>
    </div>

    <div *ngIf="!error" class="page lists-show">
      <nav>
        <h1 class="title-page">
          <span class="title-wrapper">Taskbox</span>
        </h1>
      </nav>
      <app-task-list></app-task-list>
    </div>
  `,
})
export class PureInboxScreenComponent {
  @Input() error: any;
}
```

それから前回と同様、`PureInboxScreenComponent`にデータを取ってくるコンテナーを作ります。`inbox-screen.component.ts`という名前の新しいファイルに:

```ts:title=src/app/components/inbox-screen.component.ts
import { Component } from '@angular/core';
import { Select } from '@ngxs/store';
import { TasksState } from '../state/task.state';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-inbox-screen',
  template: `
    <app-pure-inbox-screen [error]="error$ | async"></app-pure-inbox-screen>
  `,
})
export class InboxScreenComponent {
  @Select(TasksState.getError) error$: Observable<any>;
}
```

さらに、`AppComponent` コンポーネントを `InboxScreenComponent` を描画するように変更します (いずれはルーターにどの画面を表示するか決めてもらいますが、今は気にしないでください):

```diff:title=src/app/app.component.ts
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
- templateUrl: './app.component.html',
- styleUrls: ['./app.component.css']
+ template: `
+   <app-inbox-screen></app-inbox-screen>
+ `,
})
export class AppComponent {
- title = 'intro-storybook-angular-template';
+ title = 'taskbox';
}
```

最後に、`app.module.ts`:

```diff:title=src/app/app.module.ts
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { TaskModule } from './components/task.module';
import { NgxsModule } from '@ngxs/store';
import { NgxsReduxDevtoolsPluginModule } from '@ngxs/devtools-plugin';
import { NgxsLoggerPluginModule } from '@ngxs/logger-plugin';
import { AppComponent } from './app.component';

+ import { InboxScreenComponent } from './components/inbox-screen.component';
+ import { PureInboxScreenComponent } from './components/pure-inbox-screen.component';

@NgModule({
+ declarations: [AppComponent, InboxScreenComponent, PureInboxScreenComponent],
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

<div class="aside"><p>テストファイルを更新するのを忘れないでください <code>src/app/app.component.spec.ts</code>. 次に実行したときにテストが失敗してしまいます。</p></div>

面白いのは Storybook でのレンダリングです。

前に示したように `TaskListComponent` コンポーネントは、表示用のコンポーネントである `PureTaskListComponent` を描画する**コンテナー**です。定義上コンテナーコンポーネントはコンテキストが渡されたり、サービスに接続したりすることを想定するため、切り離された環境においてはそのままでは描画できません。つまりコンテナーを Storybook で描画するには、コンポーネントに必要なコンテキストやサービスをモック化 (例えば、振る舞いを模倣させるなど) しなければならないということです。

`TaskListComponent` を Storybook に置いたときには、コンテナーではなく、`PureTaskListComponent` を描画することにより、この問題を回避しました。同じように `PureInboxScreenComponent` を Storybook に描画してみます。

しかし、 `PureInboxScreenComponent` には問題があります。`PureInboxScreenComponent` が表示用コンポーネントであっても、その子供である `TaskListComponent` は表示用ではないのです。つまり、`PureInboxScreenComponent`が「コンテナー性」により汚染されたと言えます。なので、`pure-inbox-screen.stories.ts` を以下のようセットアップすると:

```ts:title=src/app/components/pure-inbox-screen.stories.ts
import { moduleMetadata, Story, Meta } from '@storybook/angular';

import { CommonModule } from '@angular/common';

import { PureInboxScreenComponent } from './pure-inbox-screen.component';

import { TaskModule } from './task.module';

export default {
  component: PureInboxScreenComponent,
  decorators: [
    moduleMetadata({
      declarations: [PureInboxScreenComponent],
      imports: [CommonModule, TaskModule],
    }),
  ],
  title: 'PureInboxScreen',
} as Meta;

const Template: Story<PureInboxScreenComponent> = args => ({
  props: args,
});

export const Default = Template.bind({});

export const Error = Template.bind({});
Error.args = {
  error: true,
};
```

ストーリーが壊れてしまっていることが分かります。これは、「ピュア」なコンポーネントをエラーに使っていますが、ストーリーが両方ストアに依存していてそのコンテキストが必要なためです。

この問題を回避する方法の 1 つは、コンテナーコンポーネントをアプリケーションの最上位にのみ描画し、代わりにコンポーネント階層の下層に必要なデータをすべて上位のコンポーネントから渡すことです。

ですが、開発では**きっと**コンポーネント階層の下位の層でコンテナーを描画する必要が出てくるでしょう。アプリケーション全体、もしくは大部分を Storyook で描画したいなら、解決策が必要です。

<div class="aside">
💡 補足として、データを下の階層に渡していくことは正当な手法です。<a href="http://graphql.org/">GraphQL</a> を使う場合は特に。<a href="https://www.chromatic.com/?utm_source=storybook_website&utm_medium=link&utm_campaign=storybook">Chromatic</a> を作る際にはこの手法で 800 以上のストーリーを作成しました。
</div>

## デコレーターを使用してコンテキストを渡す

ストーリーの中で `PureInboxScreenComponent` に `Store` を渡すのは簡単です！モック化した `Store` をデコレーター内部で使用します:

```diff:title=src/app/components/pure-inbox-screen.stories.ts
import { moduleMetadata } from '@storybook/angular';
import { Story, Meta } from '@storybook/angular/types-6-0';

import { PureInboxScreenComponent } from './pure-inbox-screen.component';
import { TaskModule } from './task.module';

+ import { Store, NgxsModule } from '@ngxs/store';
+ import { TasksState } from '../state/task.state';

export default {
  title: 'PureInboxScreen',
  component:PureInboxScreenComponent,
  decorators: [
    moduleMetadata({
-     imports: [CommonModule,TaskModule],
+     imports: [CommonModule,TaskModule,NgxsModule.forRoot([TasksState])],
+     providers: [Store],
    }),
  ],
} as Meta;

const Template: Story<PureInboxScreenComponent> = (args) => ({
  component: PureInboxScreenComponent,
  props: args,
});

export const Default = Template.bind({});

export const Error = Template.bind({});
Error.args = {
  error: true,
};
```

同様に [@ngrx](https://github.com/ngrx/platform) や [Apollo](https://www.apollographql.com/docs/angular/) など、他のデータライブラリー向けのモックコンテキストも存在します。

Storybook で状態を選択していくことで、問題なく出来ているか簡単にテストできます

<video autoPlay muted playsInline loop >

  <source
    src="/intro-to-storybook/finished-inboxscreen-states-6-0.mp4"
    type="video/mp4"
  />
</video>

## コンポーネント駆動開発

まず、一番下の `TaskComponent` から始めて、`TaskListComponent` を作り、画面全体の UI が出来ました。`InboxScreenComponent` ではネストしたコンテナーコンポーネントを含み、一緒にストーリーも作成しました。

<video autoPlay muted playsInline loop style="width:480px; height:auto; margin: 0 auto;">
  <source
    src="/intro-to-storybook/component-driven-development-optimized.mp4"
    type="video/mp4"
  />
</video>

[**コンポーネント駆動開発**](https://www.componentdriven.org/) (CDD) はコンポーネント階層を上がるごとに少しずつ複雑性を拡張していきます。利点としては、開発プロセスに集中できること、UI の組み合わせの網羅性を向上できること、が挙げられます。要するに、CDD によって、高品質で複雑な UI を作ることができます。

まだ終わりではありません。UI を作成しても仕事は終わりません。長期間にわたり耐久性を維持できるようにしなければなりません。

<div class="aside">
💡 Git へのコミットを忘れずに行ってください！
</div>
