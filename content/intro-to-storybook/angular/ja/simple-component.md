---
title: '単純なコンポーネントを作る'
tocTitle: '単純なコンポーネント'
description: '単純なコンポーネントを切り離して作りましょう'
commit: '27e1538'
---

それでは、[コンポーネント駆動開発](https://www.componentdriven.org/) (CDD) の手法にのっとって UI を作ってみましょう。コンポーネント駆動開発とは、UI を最初にコンポーネントから作り始めて、最後に画面を作り上げる「ボトムアップ」の開発プロセスです。CDD を用いれば UI を作る際に直面する複雑性を軽減することができます。

## Task (タスク)

![Task コンポーネントの 3 つの状態](/intro-to-storybook/task-states-learnstorybook.png)

`TaskComponent` は今回作るアプリケーションのコアとなるコンポーネントです。タスクはその状態によって見た目が微妙に異なります。タスクにはチェックされた (または未チェックの) チェックボックスと、タスクについての説明と、リストの上部に固定したり解除したりするためのピン留めボタンがあります。これをまとめると、以下のプロパティが必要となります:

- `title` – タスクを説明する文字列
- `state` - タスクがどのリストに存在するか。またチェックされているかどうか。

`TaskComponent` の作成を始めるにあたり、事前に上記のそれぞれのタスクに応じたテスト用の状態を作成します。次いで、Storybook で、モックデータを使用し、コンポーネントを切り離して作ります。コンポーネントのそれぞれの状態について「ビジュアルテスト」を行い、見た目を確認しながら進めます。

[テスト駆動開発](https://ja.wikipedia.org/wiki/%E3%83%86%E3%82%B9%E3%83%88%E9%A7%86%E5%8B%95%E9%96%8B%E7%99%BA) (TDD) に似ているこのプロセスを、「[Visual TDD](https://www.chromatic.com/blog/visual-test-driven-development)」と呼んでいます。

## セットアップする

まずは、タスクのコンポーネントと、対応するストーリーファイル `src/app/components/task.component.ts` と `src/app/components/task.stories.ts` を作成しましょう。

`TaskComponent` の基本的な実装から始めます。必要と分かっているインプットと、タスクに対して実行できる 2 つの (リスト間を移動させる) アクションを受け取ります:

```ts:title=src/app/components/task.component.ts
import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-task',
  template: `
    <div class="list-item">
      <input type="text" [value]="task.title" readonly="true" />
    </div>
  `,
})
export class TaskComponent {
  @Input() task: any;

  // tslint:disable-next-line: no-output-on-prefix
  @Output()
  onPinTask = new EventEmitter<Event>();

  // tslint:disable-next-line: no-output-on-prefix
  @Output()
  onArchiveTask = new EventEmitter<Event>();
}
```

上のコードは Todo アプリケーションの HTML を基にした `TaskComponent` の簡単なマークアップです。

下のコードは `TaskComponent` に対する 3 つのテスト用の状態をストーリーファイルに書いています:

```ts:title=src/app/components/task.stories.ts
import { moduleMetadata, Story, Meta } from '@storybook/angular';

import { CommonModule } from '@angular/common';

import { action } from '@storybook/addon-actions';

import { TaskComponent } from './task.component';

export default {
  component: TaskComponent,
  decorators: [
    moduleMetadata({
      declarations: [TaskComponent],
      imports: [CommonModule],
    }),
  ],
  excludeStories: /.*Data$/,
  title: 'Task',
} as Meta;

export const actionsData = {
  onPinTask: action('onPinTask'),
  onArchiveTask: action('onArchiveTask'),
};

const Template: Story<TaskComponent> = args => ({
  props: {
    ...args,
    onPinTask: actionsData.onPinTask,
    onArchiveTask: actionsData.onArchiveTask,
  },
});

export const Default = Template.bind({});
Default.args = {
  task: {
    id: '1',
    title: 'Test Task',
    state: 'TASK_INBOX',
    updatedAt: new Date(2021, 0, 1, 9, 0),
  },
};

export const Pinned = Template.bind({});
Pinned.args = {
  task: {
    ...Default.args.task,
    state: 'TASK_PINNED',
  },
};

export const Archived = Template.bind({});
Archived.args = {
  task: {
    ...Default.args.task,
    state: 'TASK_ARCHIVED',
  },
};
```

Storybook には基本となる 2 つの階層があります。コンポーネントとその子供となるストーリーです。各ストーリーはコンポーネントに連なるものだと考えてください。コンポーネントには必要なだけストーリーを記述することができます。

- **コンポーネント**
  - ストーリー
  - ストーリー
  - ストーリー

Storybook にコンポーネントを認識させるには、以下の内容を含む `default export` を記述します:

- `component` -- コンポーネント自体
- `title` -- Storybook のサイドバーにあるコンポーネントを参照する方法
- `excludeStories` -- ストーリーファイルのエクスポートのうち、Storybook にストーリーとして表示させたくないもの

ストーリーを定義するには、テスト用の状態ごとにストーリーを生成する関数をエクスポートします。ストーリーとは、特定の状態で描画された要素 (例えば、プロパティを指定したコンポーネントなど) を返す関数で、[関数コンポーネント](https://angular.jp/guide/component-interaction)のようなものです。

コンポーネントにストーリーが複数連なっているので、各ストーリーを単一の `Template` 変数に割り当てるのが便利です。このパターンを導入することで、書くべきコードの量が減り、保守性も上がります。

<div class="aside">

💡 `Template.bind({})` は関数のコピーを作成する [JavaScript の標準的な](https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Function/bind) テクニックで、同じ実装を使いながら、エクスポートされたそれぞれのストーリーに独自のプロパティを設定することができます。

</div>

Arguments (略して [`args`](https://storybook.js.org/docs/angular/writing-stories/args)) を使用することで、コントロールアドオンを通して、Storybook を再起動することなく、コンポーネントを動的に編集することができるようになります。 [`args`](https://storybook.js.org/docs/angular/writing-stories/args) の値が変わるとコンポーネントもそれに合わせて変わります。

ストーリーを作る際には素となるタスク (`task`) を使用してコンポーネントが想定するタスクの状態を作成します。想定されるデータは実際のデータと同じように作ります。さらに、このデータをエクスポートすることで、今後作成するストーリーで再利用することが可能となります。

`action()` を使うと、クリックされたときに Storybook の画面の **actions** パネルに表示されるコールバックを作ることができます。なのでピン留めボタンを作るときに、クリックがうまくいっているかテスト UI 上で分かります。

コンポーネントの全てのストーリーに同じアクションを渡す必要があるので、 `actionsData` という 1 つの変数にまとめて各ストーリーの定義に渡すと便利です。

コンポーネントに必要な `actionsData` を作るもう一つの利点は、後ほど見るように、 `export` してこのコンポーネントを再利用するコンポーネントのストーリーで使える点です。

<div class="aside">
💡 <a href="https://storybook.js.org/docs/angular/essentials/actions"><b>アクションアドオン</b></a>は切り離された環境で UI コンポーネントを開発する際の動作確認に役立ちます。アプリケーションの実行中には状態や関数を参照出来ないことがよくあります。 <code>action()</code> はそのスタブとして使用できます。
</div>

## 設定する

作成したストーリーを認識させるため、若干の変更を加える必要があります。Storybook 用設定ファイル (`.storybook/main.js`) を以下のように変更してください:

```diff:title=.storybook/main.js
module.exports = {
- stories: [
-   '../src/**/*.stories.mdx',
-   '../src/**/*.stories.@(js|jsx|ts|tsx)'
- ],
+ stories: ['../src/app/components/**/*.stories.ts'],
  addons: ['@storybook/addon-links', '@storybook/addon-essentials'],
};
```

Storybook のサーバーを再起動すると、タスクの 3 つの状態のテストケースが生成されているはずです:

<video autoPlay muted playsInline controls >
  <source
    src="/intro-to-storybook/inprogress-task-states-6-0.mp4"
    type="video/mp4"
  />
</video>

## データ要件を明示する

コンポーネントが想定するデータ構造を明示的に示すのがベストプラクティスです。これにより想定するデータ構造がコードからわかるだけでなく、早期に問題を見つけるのに役立ちます。ここでは Typescript を使い、 `Task` モデルのインターフェースを作ります。

`app` フォルダの中に `models` フォルダを作り、 `task.model.ts` というファイルを以下の内容で作成します。

```ts:title=src/app/models/task.model.ts
export interface Task {
  id: string;
  title: string;
  state: string;
}
```

## 状態を作り出す

ここまでで、Storybook のセットアップが完了し、スタイルをインポートし、テストケースを作りました。早速、デザインに合わせてコンポーネントの HTML を実装していきましょう。

今のところコンポーネントは簡素な状態です。まずはデザインを実現するために最低限必要なコードを書いてみましょう:

```diff:title=src/app/components/task.component.ts
import { Component, Input, Output, EventEmitter } from '@angular/core';

+ import { Task } from '../models/task.model';

@Component({
  selector: 'app-task',
  template: `
+   <div class="list-item {{ task?.state }}">
+     <label class="checkbox">
+       <input
+         type="checkbox"
+         [defaultChecked]="task?.state === 'TASK_ARCHIVED'"
+         disabled="true"
+         name="checked"
+       />
+       <span class="checkbox-custom" (click)="onArchive(task.id)"></span>
+     </label>
+     <div class="title">
+       <input
+         type="text"
+         [value]="task?.title"
+         readonly="true"
+         placeholder="Input title"
+       />
+     </div>
+     <div class="actions">
+       <a *ngIf="task?.state !== 'TASK_ARCHIVED'" (click)="onPin(task.id)">
+         <span class="icon-star"></span>
+       </a>
+     </div>
+   </div>
  `,
})
export class TaskComponent {
+ @Input() task: Task;

  // tslint:disable-next-line: no-output-on-prefix
  @Output()
  onPinTask = new EventEmitter<Event>();

  // tslint:disable-next-line: no-output-on-prefix
  @Output()
  onArchiveTask = new EventEmitter<Event>();

+ /**
+  * Component method to trigger the onPin event
+  * @param id string
+  */
+ onPin(id: any) {
+   this.onPinTask.emit(id);
+ }
+ /**
+  * Component method to trigger the onArchive event
+  * @param id string
+  */
+ onArchive(id: any) {
+   this.onArchiveTask.emit(id);
+ }
}
```

追加したマークアップとインポートした CSS により以下のような UI ができます:

<video autoPlay muted playsInline loop>
  <source
    src="/intro-to-storybook/finished-task-states-6-0.mp4"
    type="video/mp4"
  />
</video>

## 完成

これでサーバーを起動したり、フロントエンドアプリケーションを起動したりすることなく、コンポーネントを作りあげることができました。次の章では、Taskbox の残りのコンポーネントを、同じように少しずつ作成していきます。

見た通り、コンポーネントだけを切り離して作り始めるのは早くて簡単です。あらゆる状態を掘り下げてテストできるので、高品質で、バグが少なく、洗練された UI を作ることができることでしょう。

## 自動化されたテスト

Storybook はアプリケーションの UI を作成する際に目視でテストする素晴らしい方法を与えてくれます。ストーリーがあれば、タスクの外観が壊れていないことを確認しながらアプリケーションを開発できます。しかしこれは完全に手動の作業なので、警告やエラーがなく表示されていることを、それぞれの状態を確認しながら誰かがクリックしていかなければなりません。なんとか自動化できないものでしょうか。

### スナップショットテスト

スナップショットテストとは、特定の入力に対してコンポーネントの「既知の良好な」出力を記録し、将来、出力が変化したコンポーネントを特定できるようにするテスト手法です。
これで補完することにより、コンポーネントの新しいバージョンでの変化を Storybook で素早く確認できるようになります。

<div class="aside">
💡 コンポーネントに渡すデータは変化しないものを使用してください。そうすれば毎回スナップショットテストの結果が同じになります。日付や、ランダムに生成された値に気を付けましょう。
</div>

[Storyshots アドオン](https://github.com/storybooks/storybook/tree/master/addons/storyshots)を使用することで、それぞれのストーリーにスナップショットテストが作成されます。開発時の依存関係を以下のコマンドで追加してください:

```bash
npm install -D @storybook/addon-storyshots
```

次に、`src/storybook.test.js` ファイルを以下の内容で作成します:

```ts:title=src/storybook.test.js
import initStoryshots from '@storybook/addon-storyshots';

initStoryshots();
```

最後に、`package.json`の`jest`キーに小さな変更を加える必要があります。

```diff:title=package.json
{
   "transform": {
      "^.+\\.(ts|html)$": "ts-jest",
      "^.+\\.js$": "babel-jest",
+     "^.+\\.stories\\.[jt]sx?$": "@storybook/addon-storyshots/injectFileName"
    },
}
```

以上の修正をしてから`npm run test` を実行すると、以下のような出力が得られます。

![Task テストランナー](/intro-to-storybook/task-testrunner.png)

これで `TaskComponent` の各ストーリーに対するスナップショットテストが出来ました。`TaskComponent` の実装を変更するたびに、変更内容の確認を求められるようになります。

上記のテストに加えて、`jest`は`app.component.ts`に対してのテストも実行します。

<div class="aside">
💡 Git へのコミットを忘れずに行ってください！
</div>
