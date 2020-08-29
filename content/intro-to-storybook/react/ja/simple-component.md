---
title: '単純なコンポーネントを作る'
tocTitle: '単純なコンポーネント'
description: '単純なコンポーネントを切り離して作りましょう'
commit: '3d9cd8c'
---

それでは、[コンポーネント駆動開発](https://www.componentdriven.org/) (CDD) の手法にのっとって UI を作ってみましょう。コンポーネント駆動開発とは、UI を最初にコンポーネントから作り始めて、最後に画面を作り上げる「ボトムアップ」の開発プロセスです。CDD を用いれば UI を作る際に直面する複雑性を軽減することができます。

## Task (タスク)

![Task コンポーネントの 3 つの状態](/intro-to-storybook/task-states-learnstorybook.png)

`Task` は今回作るアプリケーションのコアとなるコンポーネントです。タスクはその状態によって見た目が微妙に異なります。タスクにはチェックされた (または未チェックの) チェックボックスと、タスクについての説明と、リストの上部に固定したり解除したりするためのピン留めボタンがあります。これをまとめると、以下のプロパティが必要となります:

- `title` – タスクを説明する文字列
- `state` - タスクがどのリストに存在するか。またチェックされているかどうか。

`Task` の作成を始めるにあたり、事前に上記のそれぞれのタスクに応じたテスト用の状態を作成します。次いで、Storybook で、モックデータを使用し、コンポーネントを切り離して作ります。コンポーネントのそれぞれの状態について見た目を確認しながら進めます。

## セットアップする

まずは、タスクのコンポーネントと、対応するストーリーファイル `src/components/Task.js` と `src/components/Task.stories.js` を作成しましょう。

`Task` の基本的な実装から始めます。`Task` は上述したプロパティと、タスクに対して実行できる 2 つの (リスト間を移動させる) アクションを引数として取ります:

```javascript
// src/components/Task.js

import React from 'react';

export default function Task({ task: { id, title, state }, onArchiveTask, onPinTask }) {
  return (
    <div className="list-item">
      <input type="text" value={title} readOnly={true} />
    </div>
  );
}
```

上のコードは Todo アプリケーションの HTML を基にした `Task` の簡単なマークアップです。

下のコードは `Task` に対する 3 つのテスト用の状態をストーリーファイルに書いています:

```javascript
// src/components/Task.stories.js

import React from 'react';

import Task from './Task';

export default {
  component: Task,
  title: 'Task',
};

const Template = args => <Task {...args} />;

export const Default = Template.bind({});
Default.args = {
  task: {
    id: '1',
    title: 'Test Task',
    state: 'TASK_INBOX',
    updatedAt: new Date(2018, 0, 1, 9, 0),
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
- `argTypes` -- 各ストーリーの [args](https://storybook.js.org/docs/react/api/argtypes) の挙動を指定する

ストーリーを定義するには、テスト用の状態ごとにストーリーを生成する関数をエクスポートします。ストーリーとは、特定の状態で描画された要素 (例えば、プロパティを指定したコンポーネントなど) を返す関数で、React の[状態を持たない関数コンポーネント](https://ja.reactjs.org/docs/components-and-props.html)のようなものです。

コンポーネントが連なりを持っているので、`Template` 変数に各ストーリーを割り当てるのが便利です。このパターンを導入することで、書くべきコードの量が減り、保守性も上がります。

<div class="aside">

`Template.bind({})` は関数のコピーを作成する [JavaScript の標準的な](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/bind) テクニックで、同じ実装を使いながら、エクスポートされたそれぞれのストーリーに独自のプロパティを設定することができます。

</div>

Arguments (略して [`args`](https://storybook.js.org/docs/react/writing-stories/args)) を使用することで、controls アドオンを通して、Storybook を再起動することなく直にコンポーネントを編集することができるようになります。[`args`](https://storybook.js.org/docs/react/writing-stories/args) の値が変わるとコンポーネントもそれに合わせて変わります。

ストーリーを作る際には素となるタスク (`args` の `task`) を使用してコンポーネントが想定するタスクの状態を作成します。想定されるデータは実際のデータと同じように作ります。もう一度言いますが、このデータをエクスポートすることで、今後作成するストーリーで再利用することが可能となるのです。

<div class="aside">
<a href="https://storybook.js.org/docs/react/essentials/actions"><b>Actions</b></a> は切り離された環境で UI コンポーネントを開発する際の動作確認に役立ちます。アプリケーションの実行中には状態や関数を参照出来ないことがよくあります。<code>action()</code> はそのスタブとして使用できます。
</div>

## 設定する

作成したストーリーを認識させ、[前の章](/react/ja/get-started)で変更した CSS ファイルを使用できるようにするため、Storybook の設定をいくつか変更する必要があります。

まず、設定ファイル (`.storybook/main.js`) を以下のように変更してください:

```javascript
// .storybook/main.js

module.exports = {
  stories: ['../src/components/**/*.stories.js'],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/preset-create-react-app',
  ],
};
```

上記の変更が完了したら、`.storybook` フォルダー内の `preview.js` を、以下のように変更してください:

```javascript
// .storybook/preview.js

import '../src/index.css';

// Configures Storybook to log the actions(onArchiveTask and onPinTask) in the UI.
export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
};
```

[`parameters`](https://storybook.js.org/docs/react/writing-stories/parameters) は Storybook の機能やアドオンの振る舞いをコントロールするのに使用します。この例では、`actions` (呼び出しのモック) がどのように扱われるかを設定しています。

`actions` はクリックした時などに Storybook の **actions** パネルにその情報を表示するコールバックを作成します。これにより、ピン留めボタンを作成するとき、ボタンがクリックされたことがテスト用の UI 上で確認できます。

Storybook のサーバーを再起動すると、タスクの 3 つの状態のテストケースが生成されているはずです:

<video autoPlay muted playsInline loop>
  <source
    src="/intro-to-storybook//inprogress-task-states-6-0.mp4"
    type="video/mp4"
  />
</video>

## 状態を作り出す

ここまでで、Storybook のセットアップが完了し、スタイルをインポートし、テストケースを作りました。早速、デザインに合わせてコンポーネントの HTML を実装していきましょう。

今のところコンポーネントは簡素な状態です。まずはデザインを実現するために最低限必要なコードを書いてみましょう:

```javascript
// src/components/Task.js
// src/components/Task.js

import React from 'react';

export default function Task({ task: { id, title, state }, onArchiveTask, onPinTask }) {
  return (
    <div className={`list-item ${state}`}>
      <label className="checkbox">
        <input
          type="checkbox"
          defaultChecked={state === 'TASK_ARCHIVED'}
          disabled={true}
          name="checked"
        />
        <span className="checkbox-custom" onClick={() => onArchiveTask(id)} />
      </label>
      <div className="title">
        <input type="text" value={title} readOnly={true} placeholder="Input title" />
      </div>

      <div className="actions" onClick={event => event.stopPropagation()}>
        {state !== 'TASK_ARCHIVED' && (
          // eslint-disable-next-line jsx-a11y/anchor-is-valid
          <a onClick={() => onPinTask(id)}>
            <span className={`icon-star`} />
          </a>
        )}
      </div>
    </div>
  );
}
```

追加したマークアップとインポートした CSS により以下のような UI ができます:

<video autoPlay muted playsInline loop>
  <source
    src="/intro-to-storybook/finished-task-states-6-0.mp4"
    type="video/mp4"
  />
</video>

## データ要件を明示する

`propTypes` を使い React にコンポーネントが想定するデータ形式を示すのがベストプラクティスです。これにより想定するデータ形式がコードからわかるだけでなく、早期に問題を見つけるのに役立ちます。

```javascript
// src/components/Task.js

import React from 'react';
import PropTypes from 'prop-types';

export default function Task({ task: { id, title, state }, onArchiveTask, onPinTask }) {
  // ...
}

Task.propTypes = {
  /** Composition of the task */
  task: PropTypes.shape({
    /** Id of the task */
    id: PropTypes.string.isRequired,
    /** Title of the task */
    title: PropTypes.string.isRequired,
    /** Current state of the task */
    state: PropTypes.string.isRequired,
  }),
  /** Event to change the task to archived */
  onArchiveTask: PropTypes.func,
  /** Event to change the task to pinned */
  onPinTask: PropTypes.func,
};
```

これで、開発中にタスクコンポーネントが間違って使用された際、警告が表示されます。

<div class="aside">
別の方法としてコンポーネントのプロパティを TypeScript など JavaScript の型システムで作成する方法もあります。
</div>

## 完成！

これでサーバーを起動したり、フロントエンドアプリケーションを起動したりすることなく、コンポーネントを作りあげることができました。次の章でも、同じように Taskbox コンポーネントの残りの部分を少しずつ作成していきます。

見た通り、コンポーネントだけを切り離して作り始めるのは早くて簡単です。あらゆる状態を掘り下げてテストできるので、高品質で、バグが少なく、洗練された UI を作ることができることでしょう。

## 自動化されたテスト

Storybook はアプリケーションの UI を作成する際に目視でテストする素晴らしい方法を提供してくれます。ストーリーがあることにより、タスクの外観を壊していないことを確認しながらアプリケーションを開発できます。しかし、これは完全に手動のプロセスなので、誰かが警告やエラーがなく表示されていることをそれぞれの状態を確認しながらクリックしていかなければなりません。自動化できないものでしょうか。

### スナップショットテスト

スナップショットテストとは、特定の入力に対してコンポーネントの「既知の良好な」出力を記録し、将来、出力が変化したコンポーネントを特定できるようにするテスト手法です。
これで補完することにより、コンポーネントの新しいバージョンでの変化を Storybook で素早く確認できるようになります。

<div class="aside">
コンポーネントに渡すデータは変化しないものを使用してください。そうすれば毎回スナップショットテストの結果が同じになります。日付や、ランダムに生成された値に気を付けましょう。
</div>

[Storyshots アドオン](https://github.com/storybooks/storybook/tree/master/addons/storyshots)を使用することで、それぞれのストーリーにスナップショットテストが作成されます。開発時の依存関係を以下のコマンドで追加してください:

```bash
yarn add -D @storybook/addon-storyshots react-test-renderer
```

次に、`src/storybook.test.js` ファイルを以下の内容で作成します:

```javascript
// src/storybook.test.js

import initStoryshots from '@storybook/addon-storyshots';
initStoryshots();
```

これだけです。`yarn test` を実行すれば以下のような出力が得られます:

![Task テストランナー](/intro-to-storybook/task-testrunner.png)

これで `Task` の各ストーリーに対するスナップショットテストが出来ました。`Task` の実装を変更するたびに、変更内容の確認を求められるようになります。
