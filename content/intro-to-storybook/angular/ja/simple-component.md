---
title: '単純なコンポーネントを作る'
tocTitle: '単純なコンポーネント'
description: '単純なコンポーネントを切り離して作りましょう'
commit: '6ba8a4e'
---

それでは、[コンポーネント駆動開発](https://www.componentdriven.org/) (CDD) の手法にのっとって UI を作ってみましょう。コンポーネント駆動開発とは、UI を最初にコンポーネントから作り始めて、最後に画面を作り上げる「ボトムアップ」の開発プロセスです。CDD を用いれば UI を作る際に直面する複雑性を軽減することができます。

## Task (タスク)

![Task コンポーネントの 3 つの状態](/intro-to-storybook/task-states-learnstorybook-accessible.png)

`Task` は今回作るアプリケーションのコアとなるコンポーネントです。タスクはその状態によって見た目が微妙に異なります。タスクにはチェックされた (または未チェックの) チェックボックスと、タスクについての説明と、リストの上部に固定したり解除したりするためのピン留めボタンがあります。これをまとめると、以下のプロパティが必要となります:

- `title` – タスクを説明する文字列
- `state` - タスクがどのリストに存在するか。またチェックされているかどうか。

`Task` の作成を始めるにあたり、事前に上記のそれぞれのタスクに応じたテスト用の状態を作成します。次いで、Storybook で、モックデータを使用し、コンポーネントを切り離して作ります。コンポーネントのそれぞれの状態について見た目を確認しながら進めます。

## セットアップする

まずは、タスクのコンポーネントと、対応するストーリーファイル `src/app/components/task.component.ts` と `src/app/components/task.stories.ts` を作成しましょう。

`Task` コンポーネントのベースとなる実装から始めます。`Task` は上述したインプットと、タスクに対して実行できる 2 つの (リスト間を移動させる) アクションを引数として取ります:

```ts:title=src/app/components/task.component.ts
import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-task',
  template: `
    <div class="list-item">
      <label [attr.aria-label]="task.title + ''" for="title">
        <input
          type="text"
          [value]="task.title"
          readonly="true"
          id="title"
          name="title"
        />
      </label>
    </div>
  `,
})
export default class TaskComponent {
  /**
   * The shape of the task object
  */
  @Input() task: any;

  // tslint:disable-next-line: no-output-on-prefix
  @Output()
  onPinTask = new EventEmitter<Event>();

  // tslint:disable-next-line: no-output-on-prefix
  @Output()
  onArchiveTask = new EventEmitter<Event>();
}
```

上のコードは Todo アプリケーションの HTML を基にした `Task` component の簡単なマークアップです。

下のコードは `Task` に対する 3 つのテスト用の状態をストーリーファイルに書いています:

```ts:title=src/app/components/task.stories.ts
import type { Meta, StoryObj } from '@storybook/angular';

import { argsToTemplate } from '@storybook/angular';

import { action } from '@storybook/addon-actions';

import TaskComponent from './task.component';

export const actionsData = {
  onPinTask: action('onPinTask'),
  onArchiveTask: action('onArchiveTask'),
};

const meta: Meta<TaskComponent> = {
  title: 'Task',
  component: TaskComponent,
  excludeStories: /.*Data$/,
  tags: ['autodocs'],
  render: (args: TaskComponent) => ({
    props: {
      ...args,
      onPinTask: actionsData.onPinTask,
      onArchiveTask: actionsData.onArchiveTask,
    },
    template: `<app-task ${argsToTemplate(args)}></app-task>`,
  }),
};

export default meta;
type Story = StoryObj<TaskComponent>;

export const Default: Story = {
  args: {
    task: {
      id: '1',
      title: 'Test Task',
      state: 'TASK_INBOX',
    },
  },
};

export const Pinned: Story = {
  args: {
    task: {
      ...Default.args?.task,
      state: 'TASK_PINNED',
    },
  },
};

export const Archived: Story = {
  args: {
    task: {
      ...Default.args?.task,
      state: 'TASK_ARCHIVED',
    },
  },
};
```

<div class="aside">
💡 <a href="https://storybook.js.org/docs/angular/essentials/actions"><b>アクション</b></a>は、UIコンポーネントを単独で構築する際にインタラクションを検証するのに役立ちます。多くの場合、アプリのコンテキストで使用している関数や状態にアクセスできないことがあります。<code>action()</code>を使用して、それらをスタブとして用います。
</div>

Storybook には基本となる 2 つの階層があります。コンポーネントとその子供となるストーリーです。各ストーリーはコンポーネントに連なるものだと考えてください。コンポーネントには必要なだけストーリーを記述することができます。

- **コンポーネント**
  - ストーリー
  - ストーリー
  - ストーリー

テストやドキュメントを書いているのはどのコンポーネントなのかを Storybook に認識させるには、以下の内容を含む `default` export を記述します:

- `component` -- コンポーネント自体
- `title` -- Storybook のサイドバーにあるコンポーネントをグループ化またはカテゴライズする方法
- `tags` -- コンポーネントのドキュメントを生成するために使用
- `excludeStories` -- ストーリーに必要だが、Storybook でレンダリングされるべきでない追加情報
- `render` -- コンポーネントが Storybook でどのようにレンダリングされるかを指定するカスタム[render 関数](https://storybook.js.org/docs/angular/api/csf#custom-render-functions)
- `argsToTemplate` -- args をコンポーネントのプロパティとイベントバインディングに変換するヘルパー関数で、Storybook のコントロールとコンポーネントの入出力に対する堅牢なワークフローのサポートを提供

ストーリーを定義するために、Component Story Format 3（[CSF3](https://storybook.js.org/docs/angular/api/csf) とも呼ばれます）を使用し各テストケースを構築します。このフォーマットは、各テストケースを簡潔に構築するために設計されています。各コンポーネントの状態を含むオブジェクトをエクスポートすることで、私たちはテストをより直感的に定義し、ストーリーをより効率的に作成および再利用することができます。

ストーリーを定義するには、テスト用の状態ごとにストーリーを生成する関数をエクスポートします。ストーリーとは、特定の状態で描画された要素 (例えば、プロパティを指定したコンポーネントなど) を返す関数で、[関数コンポーネント](https://angular.jp/guide/component-interaction)のようなものです。

Arguments (略して [`args`](https://storybook.js.org/docs/angular/writing-stories/args)) を使用することで、コントロールアドオンを通して、Storybook を再起動することなく、コンポーネントを動的に編集することができるようになります。 [`args`](https://storybook.js.org/docs/angular/writing-stories/args) の値が変わるとコンポーネントもそれに合わせて変わります。

`action()` を使うと、クリックされたときに Storybook の画面の **actions** パネルに表示されるコールバックを作ることができます。なのでピン留めボタンを作るときに、クリックがうまくいっているかテスト UI 上で分かります。

コンポーネントの全てのストーリーに同じアクションを渡す必要があるので、 `actionsData` という 1 つの変数にまとめて各ストーリーの定義に渡すと便利です。コンポーネントに必要な `actionsData` を作るもう一つの利点は、後ほど見るように、 `export` してこのコンポーネントを再利用するコンポーネントのストーリーで使える点です。

ストーリーを作る際には素となるタスク引数を使用してコンポーネントが想定するタスクの状態を作成します。想定されるデータは実際のデータと同じように作ります。さらに、このデータをエクスポートすることで、今後作成するストーリーで再利用することが可能となります。

## 設定する

作成したストーリーを認識させるため、1 つ小さな変更を加える必要があります。Storybook 用設定ファイル (`.storybook/main.s`) を以下のように変更してください:

```diff:title=.storybook/main.ts
import type { StorybookConfig } from '@storybook/angular';
const config: StorybookConfig = {
- stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|ts|tsx)'],
+ stories: ['../src/app/components/**/*.stories.ts'],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
  ],
  framework: {
    name: '@storybook/angular',
    options: {},
  },
  docs: {
    autodocs: 'tag',
  },
};
export default config;
```

Storybook のサーバーを再起動すると、タスクの 3 つの状態のテストケースが生成されているはずです:

<video autoPlay muted playsInline loop>
  <source
    src="/intro-to-storybook/inprogress-task-states-7-0.mp4"
    type="video/mp4"
  />
</video>

## データ要件を明示する

コンポーネントが想定するデータ構造を明示的に示すのがベストプラクティスです。これにより想定するデータ構造がコードからわかるだけでなく、早期に問題を見つけるのに役立ちます。ここでは Typescript を使い、 `Task` モデルのインターフェースを作ります。

`app` フォルダの中に `models` フォルダを作り、 `task.model.ts` というファイルを以下の内容で作成します。

```ts:title=src/app/models/task.model.ts
export interface Task {
  id?: string;
  title?: string;
  state?: string;
}
```

## 状態を作り出す

ここまでで、Storybook のセットアップが完了し、スタイルをインポートし、テストケースを作りました。早速、デザインに合わせてコンポーネントの HTML を実装していきましょう。

今のところコンポーネントは簡素な状態です。まずはデザインを実現するために最低限必要なコードを書いてみましょう:

```ts:title=src/app/components/task.component.ts
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Task } from '../models/task.model';

@Component({
  selector: 'app-task',
  template: `
    <div class="list-item {{ task?.state }}">
      <label
        [attr.aria-label]="'archiveTask-' + task?.id"
        for="checked-{{ task?.id }}"
        class="checkbox"
      >
        <input
          type="checkbox"
          disabled="true"
          [defaultChecked]="task?.state === 'TASK_ARCHIVED'"
          name="checked-{{ task?.id }}"
          id="checked-{{ task?.id }}"
        />
        <span class="checkbox-custom" (click)="onArchive(task?.id)"></span>
      </label>
      <label
        [attr.aria-label]="task?.title + ''"
        for="title-{{ task?.id }}"
        class="title"
      >
        <input
          type="text"
          [value]="task?.title"
          readonly="true"
          id="title-{{ task?.id }}"
          name="title-{{ task?.id }}"
          placeholder="Input title"
        />
      </label>
      <button
        *ngIf="task?.state !== 'TASK_ARCHIVED'"
        class="pin-button"
        [attr.aria-label]="'pinTask-' + task?.id"
        (click)="onPin(task?.id)"
      >
        <span class="icon-star"></span>
      </button>
    </div>
  `,
})
export default class TaskComponent {
  /**
   * The shape of the task object
  */
  @Input() task?: Task;

  // tslint:disable-next-line: no-output-on-prefix
  @Output()
  onPinTask = new EventEmitter<Event>();

  // tslint:disable-next-line: no-output-on-prefix
  @Output()
  onArchiveTask = new EventEmitter<Event>();

  /**
   * @ignore
   * Component method to trigger the onPin event
   * @param id string
   */
  onPin(id: any) {
    this.onPinTask.emit(id);
  }
  /**
   * @ignore
   * Component method to trigger the onArchive event
   * @param id string
   */
  onArchive(id: any) {
    this.onArchiveTask.emit(id);
  }
}
```

追加したマークアップと既存の CSS(設定は src/styles.css と angular.json を確認してください) により以下のような UI ができます:

<video autoPlay muted playsInline loop>
  <source
    src="/intro-to-storybook/finished-task-states-7-0.mp4"
    type="video/mp4"
  />
</video>

## 完成

これでサーバーを起動したり、フロントエンドアプリケーションを起動したりすることなく、コンポーネントを作りあげることができました。次の章では、Taskbox の残りのコンポーネントを、同じように少しずつ作成していきます。

見た通り、コンポーネントだけを切り離して作り始めるのは早くて簡単です。あらゆる状態を掘り下げてテストできるので、高品質で、バグが少なく、洗練された UI を作ることができることでしょう。

## アクセシビリティの問題の検知

アクセシビリティテストとは、[WCAG](https://www.w3.org/WAI/standards-guidelines/wcag/) のルールと他の業界で認めれたベストプラクティスに基づく経験則に対して、自動化ツールを用いることでレンダリングされた DOM を監視することを指します。これは視覚障害、聴覚障害、認知障害などの障害をお持ちの方を含む、できるだけ多くのユーザーがアプリケーションを利用できるように、明らかなアクセシビリティの違反を検知するために QA の第一線として機能します。

Storybook には公式の[アクセシビリティアドオン](https://storybook.js.org/addons/@storybook/addon-a11y)があります。これは、Deque の [axe-core](https://github.com/dequelabs/axe-core) を使っており、[WCAG の問題の 57%](https://www.deque.com/blog/automated-testing-study-identifies-57-percent-of-digital-accessibility-issues/) に対応しています。

それでは、どのように動かすのかみてみましょう! 以下のコマンドでアドオンをインストールします:

```shell
npm install @storybook/addon-a11y --save-dev
```

アドオンを利用可能にするために、Storybook の設定ファイル(`.storybook/main.ts`)を以下のように設定します:

```diff:title=.storybook/main.ts
import type { StorybookConfig } from '@storybook/angular';
const config: StorybookConfig = {
  stories: ['../src/app/components/**/*.stories.ts'],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
+   '@storybook/addon-a11y',
  ],
  framework: {
    name: '@storybook/angular',
    options: {},
  },
  docs: {
    autodocs: 'tag',
  },
};
export default config;

```

![Task accessibility issue in Storybook](/intro-to-storybook/finished-task-states-accessibility-issue-7-0.png)

ストーリーを一通り見てみると、このアドオンが一つのアクセシビリティの問題を検知したことがわかります。[**「Elements must have sufficient color contrast」**](https://dequeuniversity.com/rules/axe/4.4/color-contrast?application=axeAPI)というエラーメッセージは本質的にはタイトルと背景に十分なコントラストがないことを指しています。そのため、アプリケーションの CSS (`src/styles.css` にある)の中で、テキストカラーをより暗いグレーに修正する必要があります。

```diff:title=src/styles.css
.list-item.TASK_ARCHIVED input[type="text"] {
- color: #a0aec0;
+ color: #4a5568;
  text-decoration: line-through;
}
```

以上です！これで、UI のアクセシビリティ向上の最初のステップが完了です。アプリケーションをさらに複雑にしても、他の全てのコンポーネントに対してこのプロセスを繰り返すことができ、追加のツールやテスト環境を準備する必要はありません。

<div class="aside">
💡 Git へのコミットを忘れずに行ってください！
</div>
