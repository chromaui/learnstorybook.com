---
title: '画面を作る'
tocTitle: '画面'
description: 'コンポーネントをまとめて画面を作りましょう'
commit: 'f8d168d'
---

今までボトムアップ (小さく始めてから複雑性を追加していく) で UI の作成に集中してきました。ボトムアップで作業することで、Storybook で遊びながら、それぞれのコンポーネントを切り離された環境で、それぞれに必要なデータを考えながら開発することができました。サーバーを立ち上げたり、画面を作ったりする必要は全くありませんでした！

この章では Storybook を使用して、コンポーネントを組み合わせて画面を作り、完成度を高めていきます。

## ネストされたコンテナーコンポーネント

このアプリケーションはとても簡単なので、作る画面も些細なものです。 ngxs から自分でデータを取得する `TaskList` コンポーネント を表示して、ストアからの error フィールド (サーバーとの接続に失敗したときに設定される項目だと思ってください) を追加するだけです。

(`src/app/state/task.state.ts`にある) ストアを更新して、 error フィールドを含めることから始めましょう

```diff:title=src/app/state/task.state.ts
import { Injectable } from '@angular/core';
import { State, Selector, Action, StateContext } from '@ngxs/store';
import { patch, updateItem } from '@ngxs/store/operators';
import { Task } from '../models/task.model';

// Defines the actions available to the app
export const actions = {
  ARCHIVE_TASK: 'ARCHIVE_TASK',
  PIN_TASK: 'PIN_TASK',
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
+ // Function to handle how the state should be updated when the action is triggered
+ @Action(AppError)
+ setAppError(
+   { patchState, getState }: StateContext<TaskStateModel>,
+   { payload }: AppError
+ ) {
+   const state = getState();
+   patchState({
+     error: !state.error,
+   });
+ }
}
```

ストア が新しいフィールドを含むよう更新されました。 `pure-inbox-screen.component.ts`を`src/app/components/`フォルダに作りましょう:

```ts:title=src/app/components/pure-inbox-screen.component.ts
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-pure-inbox-screen',
  template: `
    <div *ngIf="error" class="page lists-show">
      <div class="wrapper-message">
        <span class="icon-face-sad"></span>
        <p class="title-message">Oh no!</p>
        <p class="subtitle-message">Something went wrong</p>
      </div>
    </div>

    <div *ngIf="!error" class="page lists-show">
      <nav>
        <h1 class="title-page">Taskbox</h1>
      </nav>
      <app-task-list></app-task-list>
    </div>
  `,
})
export default class PureInboxScreenComponent {
  @Input() error: any;
}
```

そして、`PureInboxScreenComponent`にデータを取ってくるコンテナーをもう一度`inbox-screen.component.ts`に作ります:

```ts:title=src/app/components/inbox-screen.component.ts
import { Component } from '@angular/core';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-inbox-screen',
  template: `
    <app-pure-inbox-screen [error]="error$ | async"></app-pure-inbox-screen>
  `,
})
export default class InboxScreenComponent {
  error$: Observable<boolean>;
  constructor(private store: Store) {
    this.error$ = store.select((state) => state.taskbox.error);
  }
}
```

さらに、`AppComponent` コンポーネントを `InboxScreen` を描画するように変更します (いずれはルーターにどの画面を表示するか決めてもらいますが、今は気にしないでください):

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
  title = 'taskbox';
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

import { environment } from '../environments/environment';
import { AppComponent } from './app.component';

+ import InboxScreenComponent from './components/inbox-screen.component';
+ import PureInboxScreenComponent from './components/pure-inbox-screen.component';

@NgModule({
+ declarations: [AppComponent, InboxScreenComponent, PureInboxScreenComponent],
  imports: [
    BrowserModule,
    TaskModule,
    NgxsModule.forRoot([], { developmentMode: !environment.production, }),
    NgxsReduxDevtoolsPluginModule.forRoot(),
    NgxsLoggerPluginModule.forRoot({ disabled: environment.production, }),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
```

しかし、面白いのは Storybook でのレンダリングです。

前に示したように `TaskList` コンポーネントは、表示用のコンポーネントである `PureTaskList` を描画する**コンテナー**です。定義上コンテナーコンポーネントはコンテキストが渡されたり、サービスに接続したりすることを想定するため、切り離された環境においてはそのままでは描画できません。つまりコンテナーを Storybook で描画するには、コンポーネントに必要なコンテキストやサービスをモック化 (例えば、振る舞いを模倣させたバージョンを提供するなど) しなければならないということです。

`TaskList` を Storybook に置いたときには、コンテナーではなく、`PureTaskListComponent` を描画することにより、この問題を回避しました。似たようなことをして、同じように `PureInboxScreen` を Storybook に描画してみます。

しかし、 `PureInboxScreen` には問題があります。`PureInboxScreen` が表示用コンポーネントであっても、その子供である `TaskList` は表示用ではないのです。つまり、`PureInboxScreen`が「コンテナー性」により汚染されたと言えます。なので、`pure-inbox-screen.stories.ts` を以下のようセットアップします:

```ts:title=src/app/components/pure-inbox-screen.stories.ts
import type { Meta, StoryObj } from '@storybook/angular';

import { moduleMetadata } from '@storybook/angular';

import { CommonModule } from '@angular/common';

import PureInboxScreenComponent from './pure-inbox-screen.component';

import { TaskModule } from './task.module';

const meta: Meta<PureInboxScreenComponent> = {
  component: PureInboxScreenComponent,
  title: 'PureInboxScreen',
  tags: ['autodocs'],
  decorators: [
    moduleMetadata({
      imports: [CommonModule, TaskModule],
    }),
  ],
};

export default meta;
type Story = StoryObj<PureInboxScreenComponent>;

export const Default: Story = {};

export const Error: Story = {
  args: {
    error: true,
  },
};
```

ストーリーが壊れてしまっていることが分かります。これは、「ピュア」なコンポーネントをエラーに使っていますが、ストーリーが両方ストアに依存していてそのコンテキストが必要なためです。

![Broken inbox](/intro-to-storybook/broken-inbox-angular.png)

この問題を回避する方法の 1 つは、コンテナーコンポーネントをアプリケーションの最上位には描画せず、代わりにコンポーネント階層の下層に必要なデータをすべて上位のコンポーネントから渡すことです。

ですが、開発では**きっと**コンポーネント階層の下位の層でコンテナーを描画する必要が出てくるでしょう。アプリケーション全体、もしくは大部分を Storyook で描画したいなら、解決策が必要です。

<div class="aside">
💡 補足として、データを下の階層に渡していくことは正当な手法です。<a href="http://graphql.org/">GraphQL</a> を使う場合は特に。<a href="https://www.chromatic.com/?utm_source=storybook_website&utm_medium=link&utm_campaign=storybook">Chromatic</a> を作る際にはこの手法で 800 以上のストーリーを作成しました。
</div>

## デコレーターを使用してコンテキストを提供する

良いニュースは、ストーリーで `PureInboxScreen` コンポーネントに `Store` を簡単に提供できることです！ 私たちは `Store` をデコレーターにインポートし、`applicationConfig` API を通じて有効にし、それを `PureInboxScreen` コンポーネントに渡すことができます。

```diff:title=src/app/components/pure-inbox-screen.stories.ts
import type { Meta, StoryObj } from '@storybook/angular';

+ import { importProvidersFrom } from '@angular/core';

+ import { Store, NgxsModule } from '@ngxs/store';
+ import { TasksState } from '../state/task.state';

+ import { moduleMetadata, applicationConfig } from '@storybook/angular';

import { CommonModule } from '@angular/common';

import PureInboxScreenComponent from './pure-inbox-screen.component';

import { TaskModule } from './task.module';

const meta: Meta<PureInboxScreenComponent> = {
  component: PureInboxScreenComponent,
  title: 'PureInboxScreen',
  tags: ['autodocs'],
  decorators: [
    moduleMetadata({
      imports: [CommonModule, TaskModule],
    }),
+   applicationConfig({
+     providers: [Store, importProvidersFrom(NgxsModule.forRoot([TasksState]))],
    }),
  ],
};

export default meta;
type Story = StoryObj<PureInboxScreenComponent>;

export const Default: Story = {};

export const Error: Story = {
  args: {
    error: true,
  },
};
```

同様に [@ngrx](https://github.com/ngrx/platform) や [Apollo](https://www.apollographql.com/docs/angular/) など、他のデータライブラリー向けのモックコンテキストも存在します。

Storybook で状態を選択していくことで、問題なく出来ているか簡単にテストできます

<video autoPlay muted playsInline loop >

  <source
    src="/intro-to-storybook/finished-pureinboxscreen-states-7-0.mp4"
    type="video/mp4"
  />
</video>

## インタラクションテスト

これまでで、シンプルなコンポーネントから画面まで、完全に機能するアプリケーションを作り上げ、ストーリーを用いてそれぞれの変更を継続的にテストすることができるようになりました。しかし、新しいストーリーを作るたびに、UI が壊れていないかどうか、他のすべてのストーリーを手作業でチェックする必要もあります。これは、とても大変な作業です。

この作業や操作を自動化することはできないのでしょうか？

### play 関数を使ったインタラクションテスト

Storybook の [`play`](https://storybook.js.org/docs/angular/writing-stories/play-function) 関数と [`@storybook/addon-interactions`](https://storybook.js.org/docs/angular/writing-tests/interaction-testing) が役立ちます。play 関数はストーリーのレンダリング後に実行される小さなコードスニペットを含んでいます。

play 関数はタスクが更新されたときに UI に何が起こるかを検証するのに役立ちます。フレームワークに依存しない DOM API を使用しています。つまり、 play 関数を使って UI を操作し、人間の行動をシミュレートするストーリーを、フロントエンドのフレームワークに関係なく書くことができるのです。

`@storybook/addon-interactions`は、一つ一つのステップごとに Storybook のテストを可視化するのに役立ちます。さらに、各インタラクションの一時停止、再開、巻き戻し、ステップ実行といった便利な UI の制御機能が備わっています。

実際に動かしてみましょう！以下のようにして新しく作成された `pure-inbox-screen` ストーリーを更新し、コンポーネント操作を追加してみましょう:

```diff:title=src/app/components/pure-inbox-screen.stories.ts
import type { Meta, StoryObj } from '@storybook/angular';

import { importProvidersFrom } from '@angular/core';

import { Store, NgxsModule } from '@ngxs/store';
import { TasksState } from '../state/task.state';

import { moduleMetadata, applicationConfig } from '@storybook/angular';

+ import { fireEvent, within } from '@storybook/testing-library';

import { CommonModule } from '@angular/common';

import PureInboxScreenComponent from './pure-inbox-screen.component';

import { TaskModule } from './task.module';

const meta: Meta<PureInboxScreenComponent> = {
  component: PureInboxScreenComponent,
  title: 'PureInboxScreen',
  tags: ['autodocs'],
  decorators: [
    moduleMetadata({
      imports: [CommonModule, TaskModule],
    }),
    applicationConfig({
      providers: [Store, importProvidersFrom(NgxsModule.forRoot([TasksState]))],
    }),
  ],
};

export default meta;
type Story = StoryObj<PureInboxScreenComponent>;

export const Default: Story = {};

export const Error: Story = {
  args: {
    error: true,
  },
};

+ export const WithInteractions: Story = {
+   play: async ({ canvasElement }) => {
+     const canvas = within(canvasElement);
+     // Simulates pinning the first task
+     await fireEvent.click(canvas.getByLabelText('pinTask-1'));
+     // Simulates pinning the third task
+     await fireEvent.click(canvas.getByLabelText('pinTask-3'));
+   },
+ };
```

新しく作成したストーリーを確認します。`Interactions` パネルをクリックすると、ストーリーの play 関数内のインタラクションのリストが表示されます。

<video autoPlay muted playsInline loop>
  <source
    src="/intro-to-storybook/storybook-pureinboxscreen-interactive-stories.mp4"
    type="video/mp4"
  />
</video>

### テスト自動化

play 関数を利用して問題を回避し、UI を操作したりタスクを更新した場合の反応を素早く確認することができます。これによって、手作業の手間をかけずに UI の一貫性を保つことができます。

しかし、Storybook をよく見ると、ストーリーを見るときだけインタラクションテストが実行されることがわかります。そのため、変更時に各ストーリーを全てチェックしなければなりません。これは自動化できないのでしょうか？

可能です！Storybook の[テストランナー](https://storybook.js.org/docs/angular/writing-tests/test-runner)は可能にしてくれます。それは [Playwright](https://playwright.dev/) によって実現されたスタンドアロンなパッケージで、全てのインタラクションテストを実行し、壊れたストーリーを検知してくれます。

それではどのように動くのかみてみましょう！次のコマンドでインストールして走らせます:

```shell
npm install @storybook/test-runner --save-dev
```

次に、 `package.json` の `scripts` をアップデートし、新しいテストタスクを追加してください:

```json:clipboard=false
{
  "scripts": {
    "test-storybook": "test-storybook"
  }
}
```

最後に、Storybook を起動し、新しいターミナルで以下のコマンドを実行してください:

```shell
npm run test-storybook -- --watch
```

<div class="aside">
💡 play 関数でのインタラクションテストはUIコンポーネントをテストするための素晴らしい手法です。ここで紹介したもの以外にも、さまざまなことができます。もっと深く学ぶには<a href="https://storybook.js.org/docs/angular/writing-tests/interaction-testing">公式ドキュメント</a>を読むことをお勧めします。
<br />
テストをさらにもっと深く知るためには、<a href="/ui-testing-handbook">Testing Handbook</a> をチェックしてみてください。これは開発ワークフローを加速させるために、スケーラブルなフロントエンドチームが採用しているテスト戦略について解説しています。
</div>

![Storybook test runner successfully runs all tests](/intro-to-storybook/storybook-test-runner-execution.png)

成功です！これで、全てのストーリーがエラーなくレンダリングされ、全てのテストが自動的に通過するかどうか検証するためのツールができました。さらに、テストが失敗した場合、失敗したストーリーをブラウザで開くリンクを提供してくれます。

## コンポーネント駆動開発

まず、一番下の `Task` から始めて、`TaskList` を作り、画面全体の UI が出来ました。`InboxScreen` ではネストしたコンテナーコンポーネントを含み、一緒にストーリーも作成しました。

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
