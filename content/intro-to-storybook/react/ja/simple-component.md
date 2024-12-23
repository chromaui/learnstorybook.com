---
title: '単純なコンポーネントを作る'
tocTitle: '単純なコンポーネント'
description: '単純なコンポーネントを切り離して作りましょう'
commit: '9b36e1a'
---

それでは、[コンポーネント駆動開発](https://www.componentdriven.org/) (CDD) の手法にのっとって UI を作ってみましょう。コンポーネント駆動開発とは、UI を最初にコンポーネントから作り始めて、最後に画面を作り上げる「ボトムアップ」の開発プロセスです。CDD を用いれば、 UI を作る際に直面する複雑性を軽減できます。

## Task (タスク)

![Task コンポーネントの 3 つの状態](/intro-to-storybook/task-states-learnstorybook.png)

`Task` は今回作るアプリケーションのコアとなるコンポーネントです。タスクはその状態によって見た目が微妙に異なります。タスクにはチェックされた (または未チェックの) チェックボックスと、タスクについての説明と、リストの上部に固定したり解除したりするためのピン留めボタンがあります。これをまとめると、以下のプロパティが必要となります:

- `title` – タスクを説明する文字列
- `state` - タスクがどのリストに存在するか。またチェックされているかどうか。

`Task` の作成を始めるにあたり、事前に上記のそれぞれのタスクに応じたテスト用の状態を作成します。次いで、Storybook で、モックデータを使用し、コンポーネントを切り離して作ります。コンポーネントのそれぞれの状態について見た目を確認しながら進めます。

## セットアップする

まずは、タスクのコンポーネントと、対応するストーリーファイル `src/components/Task.jsx` と `src/components/Task.stories.jsx` を作成しましょう。

`Task` の基本的な実装から始めます。`Task` は上述したプロパティと、タスクに対して実行できる 2 つの (リスト間を移動させる) アクションを引数として取ります。

```js:title=src/components/Task.jsx
import React from 'react';

export default function Task({ task: { id, title, state }, onArchiveTask, onPinTask }) {
  return (
    <div className="list-item">
      <label htmlFor="title" aria-label={title}>
        <input type="text" value={title} readOnly={true} name="title" />
      </label>
    </div>
  );
}
```

上のコードは Todo アプリケーションの HTML を基にした `Task` の簡単なマークアップです。

下のコードは `Task` に対する 3 つのテスト用の状態をストーリーファイルに書くものです。

```js:title=src/components/Task.stories.jsx
import Task from './Task';

export default {
  component: Task,
  title: 'Task',
  tags: ['autodocs'],
};

export const Default = {
  args: {
    task: {
      id: '1',
      title: 'Test Task',
      state: 'TASK_INBOX',
    },
  },
};

export const Pinned = {
  args: {
    task: {
      ...Default.args.task,
      state: 'TASK_PINNED',
    },
  },
};

export const Archived = {
  args: {
    task: {
      ...Default.args.task,
      state: 'TASK_ARCHIVED',
    },
  },
};
```

Storybook には基本となる 2 つの階層があります。コンポーネントとその子供となるストーリーです。各ストーリーはコンポーネントに連なるものだと考えてください。コンポーネントには必要なだけストーリーを記述できます。

- **コンポーネント**
  - ストーリー
  - ストーリー
  - ストーリー

Storybook にコンポーネントを認識させるには、以下の内容を含む `default export` を記述します:

- `component` -- コンポーネント自体
- `title` -- Storybook のサイドバーでコンポーネントをグループ化または分類するためのタイトル
- `tags` -- このコンポーネントのドキュメントを自動生成するためのタグ

ストーリーを定義するには、コンポーネント ストーリー フォーマット 3 ( [CSF3](https://storybook.js.org/docs/api/csf) )を使用してテストケースを構築します。このフォーマットは、各テストケースを簡潔に構築するために設計されています。各コンポーネントの状態を含むオブジェクトをエクスポートすることで、テストをより直感的に定義し、ストーリーをより効率的に作成・再利用できます。

Arguments (略して [`args`](https://storybook.js.org/docs/writing-stories/args)) を使用することで、コントロールアドオンを通して、Storybook を再起動することなく、コンポーネントを動的に編集することができるようになります。[`args`](https://storybook.js.org/docs/writing-stories/args) の値が変わるとコンポーネントもそれに合わせて変わります。

ストーリーを作る際には素となるタスク引数を使用してコンポーネントが想定するタスクの状態を作成します。想定されるデータは実際のデータと同じように作ります。さらに、このデータをエクスポートすることで、今後作成するストーリーで再利用することが可能となります。

## 設定する

作成したストーリーを認識させたり、CSS ファイル (`src/index.css`にあります) を Storybook 上で使用できるようにするため、Storybook の設定をいくつか変更する必要があります。

まず、設定ファイル (`.storybook/main.js`) を以下のように変更してください。

```diff:title=.storybook/main.js
/** @type { import('@storybook/react-vite').StorybookConfig } */
const config = {
- stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|ts|tsx)'],
+ stories: ['../src/components/**/*.stories.@(js|jsx)'],
  staticDirs: ['../public'],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
  ],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  docs: {
    autodocs: 'tag',
  },
};
export default config;
```

上記の変更が完了したら、`.storybook` フォルダー内の `preview.js` を、以下のように変更してください。

```diff:title=.storybook/preview.js
+ import '../src/index.css';

//👇 Configures Storybook to log the actions( onArchiveTask and onPinTask ) in the UI.
/** @type { import('@storybook/react').Preview } */
const preview = {
  parameters: {
    actions: { argTypesRegex: "^on[A-Z].*" },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
  },
};

export default preview;
```

[`parameters`](https://storybook.js.org/docs/writing-stories/parameters) は Storybook の機能やアドオンの振る舞いをコントロールするのに使用します。この例では、アクション (`actions`、呼び出しのモック) がどのように扱われるかを設定しています。

アクションアドオンを使用することで、クリックした時などに Storybook の **actions** パネルにその情報を表示するコールバックを作成できます。これにより、ピン留めボタンを作成するとき、ボタンがクリックされたことがテスト用の UI 上で確認できます。

Storybook のサーバーを再起動すると、タスクの 3 つの状態のテストケースが生成されているはずです:

<video autoPlay muted playsInline loop>
  <source
    src="/intro-to-storybook/inprogress-task-states-7-0.mp4"
    type="video/mp4"
  />
</video>

## 状態を作り出す

ここまでで、Storybook のセットアップが完了し、スタイルをインポートし、テストケースを作りました。早速、デザインに合わせてコンポーネントの HTML を実装していきましょう。

今のところコンポーネントは簡素な状態です。まずはデザインを実現するために最低限必要なコードを書いてみましょう。

```jsx:title=src/components/Task.jsx
import React from 'react';

export default function Task({ task: { id, title, state }, onArchiveTask, onPinTask }) {
  return (
    <div className={`list-item ${state}`}>
      <label
        htmlFor="checked"
        aria-label={`archiveTask-${id}`}
        className="checkbox"
      >
        <input
          type="checkbox"
          disabled={true}
          name="checked"
          id={`archiveTask-${id}`}
          checked={state === "TASK_ARCHIVED"}
        />
        <span
          className="checkbox-custom"
          onClick={() => onArchiveTask(id)}
        />
      </label>

      <label htmlFor="title" aria-label={title} className="title">
        <input
          type="text"
          value={title}
          readOnly={true}
          name="title"
          placeholder="Input title"
        />
      </label>

      {state !== "TASK_ARCHIVED" && (
        <button
          className="pin-button"
          onClick={() => onPinTask(id)}
          id={`pinTask-${id}`}
          aria-label={`pinTask-${id}`}
          key={`pinTask-${id}`}
        >
          <span className={`icon-star`} />
        </button>
      )}
    </div>
  );
}
```

追加したマークアップとインポートした CSS により以下のような UI ができます。

<video autoPlay muted playsInline loop>
  <source
    src="/intro-to-storybook/finished-task-states-7-0.mp4"
    type="video/mp4"
  />
</video>

## データ要件を明示する

`propTypes` を使い React にコンポーネントが想定するデータ構造を示すのがベストプラクティスです。これにより想定するデータ構造がコードからわかるだけでなく、早期に問題を見つけるのに役立ちます。

```diff:title=src/components/Task.jsx
import React from 'react';
+ import PropTypes from 'prop-types';

export default function Task({ task: { id, title, state }, onArchiveTask, onPinTask }) {
  return (
    <div className={`list-item ${state}`}>
      <label
        htmlFor="checked"
        aria-label={`archiveTask-${id}`}
        className="checkbox"
      >
        <input
          type="checkbox"
          disabled={true}
          name="checked"
          id={`archiveTask-${id}`}
          checked={state === "TASK_ARCHIVED"}
        />
        <span
          className="checkbox-custom"
          onClick={() => onArchiveTask(id)}
        />
      </label>

      <label htmlFor="title" aria-label={title} className="title">
        <input
          type="text"
          value={title}
          readOnly={true}
          name="title"
          placeholder="Input title"
        />
      </label>

      {state !== "TASK_ARCHIVED" && (
        <button
          className="pin-button"
          onClick={() => onPinTask(id)}
          id={`pinTask-${id}`}
          aria-label={`pinTask-${id}`}
          key={`pinTask-${id}`}
        >
          <span className={`icon-star`} />
        </button>
      )}
    </div>
  );
}

+ Task.propTypes = {
+  /** Composition of the task */
+  task: PropTypes.shape({
+    /** Id of the task */
+    id: PropTypes.string.isRequired,
+    /** Title of the task */
+    title: PropTypes.string.isRequired,
+    /** Current state of the task */
+    state: PropTypes.string.isRequired,
+  }),
+  /** Event to change the task to archived */
+  onArchiveTask: PropTypes.func,
+  /** Event to change the task to pinned */
+  onPinTask: PropTypes.func,
+ };
```

これで、開発中にタスクコンポーネントが間違って使用された際、警告が表示されます。

<div class="aside">
💡 別の方法としてコンポーネントのプロパティを TypeScript など JavaScript の型システムで作成する方法もあります。
</div>

## 完成！

これでサーバーを起動したり、フロントエンドアプリケーションを起動したりすることなく、コンポーネントを作りあげることができました。次の章では、Taskbox の残りのコンポーネントを、同じように少しずつ作成します。

見た通り、コンポーネントを切り離して開発を始めるのは、迅速かつ簡単です。あらゆる状態を掘り下げてテストできるので、高品質で、バグが少なく、洗練された UI を作ることができることでしょう。

## アクセシビリティの問題の検知

アクセシビリティテストとは、[WCAG](https://www.w3.org/WAI/standards-guidelines/wcag/) のルールと他の業界で認められたベストプラクティスに基づく経験則に対して、自動化ツールを用いることでレンダリングされた DOM を監視することを指します。これは視覚障害、聴覚障害、認知障害などの障害をお持ちの方を含む、できるだけ多くのユーザーがアプリケーションを利用できるように、明らかなアクセシビリティの違反を検知するために QA の第一線として機能します。

Storybook には公式の[アクセシビリティアドオン](https://storybook.js.org/addons/@storybook/addon-a11y)があります。このアドオンは、Deque の [axe-core](https://github.com/dequelabs/axe-core) がベースで、[WCAG の問題の 57%](https://www.deque.com/blog/automated-testing-study-identifies-57-percent-of-digital-accessibility-issues/) に対応しています。

それでは、どのように動かすのか見てみましょう! 以下のコマンドでアドオンをインストールします。

```shell
yarn add --dev @storybook/addon-a11y
```

アドオンを利用可能にするために、Storybook の設定ファイル(`.storybook/main.js`)を以下のように設定します。

```diff:title=.storybook/main.js
/** @type { import('@storybook/react-vite').StorybookConfig } */
const config = {
  stories: ['../src/components/**/*.stories.@(js|jsx)'],
  staticDirs: ['../public'],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
+   '@storybook/addon-a11y',
  ],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  docs: {
    autodocs: 'tag',
  },
};
export default config;
```

![タスクのアクセシビリティの問題をStorybookで表示する](/intro-to-storybook/finished-task-states-accessibility-issue-7-0.png)

ストーリーをひととおり見てみると、このアドオンがひとつのアクセシビリティの問題を検知したことがわかります。[**"Elements must have sufficient color contrast"**](https://dequeuniversity.com/rules/axe/4.4/color-contrast?application=axeAPI) というエラーメッセージは、タイトルと背景に十分なコントラストがないことを指しています。そのため、アプリケーションの CSS (`src/index.css`)を編集して、テキストのカラーをより暗いグレーに修正する必要があります。

```diff:title=src/index.css
.list-item.TASK_ARCHIVED input[type="text"] {
- color: #a0aec0;
+ color: #4a5568;
  text-decoration: line-through;
}
```

以上です！これで、UI のアクセシビリティ向上の最初のステップが完了です。アプリケーションをさらに複雑にしても、他のすべてのコンポーネントに対してこのプロセスを繰り返すことができ、追加のツールやテスト環境を準備する必要はありません。

<div class="aside">
💡 Git へのコミットを忘れずに行ってください！
</div>
