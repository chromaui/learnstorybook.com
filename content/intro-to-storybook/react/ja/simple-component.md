---
title: '単純なコンポーネントを作る'
tocTitle: '単純なコンポーネント'
description: '単純なコンポーネントを隔離された環境で作りましょう'
commit: '3d9cd8c'
---

それでは、UI コンポーネントを[コンポーネント駆動開発](https://blog.hichroma.com/component-driven-development-ce1109d56c8e) (CDD) の手法にのっとって作ってみましょう。コンポーネント駆動開発とは、UI を最初にコンポーネントから作り始めて、最後に画面を作り上げる「ボトムアップ」の開発プロセスです。CDD を用いれば UI を作る際に直面する複雑性を軽減することができます。

## Task (タスク)

![Task コンポーネントの三状態](/intro-to-storybook/task-states-learnstorybook.png)

`Task` はアプリケーションのコアとなるコンポーネントです。タスクはその状態によって見た目がかなり異なります。タスクにはチェックボックスと、タスクについての説明と、タスクをリストの上部に固定したり解除したりするためのピン留めボタンがあります。これらをまとめると、以下のプロパティが必要となります:

- `title` – タスクを説明する文字列
- `state` - タスクがどのリストに存在するか。またチェックされているかどうか。

`Task` の作成を始めるにあたり、事前に上記のそれぞれのタスクに応じたテスト用の状態を作成します。次いで、モックデータを使用し、Storybook を使い、コンポーネントを隔離された環境で作ります。それぞれの状態について、コンポーネントの外観を目で確認しながら進めます。

## セットアップする

まずは、タスクのコンポーネントと、対応するストーリーファイル `src/components/Task.js` と `src/components/Task.stories.js` を作成しましょう。

`Task` の基本的な実装から始めます。`Task` は必要だとわかっているプロパティと、タスクに対して実行できる 2 つのアクション (リスト間を移動させる) を属性として取ります:

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

下のコードは `Task` の 3 つのテスト用の状態をストーリーファイルに書いています:

```javascript
// src/components/Task.stories.js

import React from 'react';
import { action } from '@storybook/addon-actions';

import Task from './Task';

export default {
  component: Task,
  title: 'Task',
  // "Data" で終わるエクスポートはストーリーではない
  excludeStories: /.*Data$/,
};

export const taskData = {
  id: '1',
  title: 'Test Task',
  state: 'TASK_INBOX',
  updatedAt: new Date(2018, 0, 1, 9, 0),
};

export const actionsData = {
  onPinTask: action('onPinTask'),
  onArchiveTask: action('onArchiveTask'),
};

export const Default = () => <Task task={{ ...taskData }} {...actionsData} />;

export const Pinned = () => <Task task={{ ...taskData, state: 'TASK_PINNED' }} {...actionsData} />;

export const Archived = () => (
  <Task task={{ ...taskData, state: 'TASK_ARCHIVED' }} {...actionsData} />
);
```

Storybook には基本となる 2 つの階層があります。コンポーネントとその子供となるストーリーです。各ストーリーはコンポーネントの組み合わせだと考えてください。コンポーネントには必要なだけストーリーを記述することができます。

- **コンポーネント**
  - ストーリー
  - ストーリー
  - ストーリー

Storybook に現在のコンポーネントを伝えるには、以下の内容を含む `default export` を記述します:

- `component` -- コンポーネント自体
- `title` -- Storybook のサイドバーにコンポーネントを参照する方法
- `excludeStories` -- ストーリーファイルのエクスポートのうち、Storybook にストーリーとして表示させたくないもの

ストーリーを定義するため、各テスト用の状態について、コンポーネントを描画する関数をエクスポートします。ストーリーとは、特定の状態として描画された要素 (例えば、プロパティを指定したコンポーネントなど) を返す関数で、React の[状態を持たない関数コンポーネント](https://ja.reactjs.org/docs/components-and-props.html)のようなものです。

`action()` はクリックしたときに Storybook の UI 上の **actions** パネルに表示されるコールバックを生成します。そうすることにより、テスト用の UI 上にピン留めボタンを作ったときに、正しくボタンが押されたかどうか特定することができます。

コンポーネントに同じアクションの組み合わせを渡さなければならないのであれば、単一の `actionsData` 変数にまとめて、React の属性の展開の構文 `{...actionsData}` を使用して一度に渡すのが便利です。`<Task {...actionsData}>` というのは `<Task onPinTask={actionsData.onPinTask} onArchiveTask={actionsData.onArchiveTask}>` と同じです。

`actionsData` としてまとめるもう一つの利点は変数をエクスポートして、このコンポーネントを使用するコンポーネントに渡せることです。これについては後で詳しく見てみましょう。

ストーリーを作る際には素となるタスク (`taskData`) を使用してコンポーネントが予期するタスクの状態を作成します。予期されるデータは実際のデータと同じように作ります。もう一度言いますが、このデータをエクスポートすることで、後で作成するストーリーで再利用することが可能です。

<div class="aside">
<a href="https://storybook.js.org/addons/introduction/#2-native-addons"><b>action アドオン</b></a>は隔離された環境で UI コンポーネントを作成するのに役立ちます。隔離された環境ではよく、アプリケーションのコンテキストや状態にアクセスできないためです。<code>action()</code> はそのスタブとして使用できます。
</div>

## 設定する

作成したストーリーを認識させ、[前の章](/react/ja/get-started)で変更した CSS ファイルを使用できるようにするため、Storybook の設定をいくつか変更する必要があります。

まず、設定ファイル (`.storybook/main.js`) を以下のように変更してください:

```javascript
// .storybook/main.js

module.exports = {
  stories: ['../src/components/**/*.stories.js'],
  addons: [
    '@storybook/preset-create-react-app',
    '@storybook/addon-actions',
    '@storybook/addon-links',
  ],
};
```

上記の変更が完了したら、`.storybook` フォルダー内に `preview.js` という新しいファイルを作成し、以下を記述してください:

```javascript
// .storybook/preview.js

import '../src/index.css';
```

変更が終わり、Storybook のサーバーを再起動すると、タスクの 3 つの状態のテストケースが生成されます:

<video autoPlay muted playsInline loop>
  <source
    src="/intro-to-storybook//inprogress-task-states.mp4"
    type="video/mp4"
  />
</video>

## 状態を作り出す

ここまでで、Storybook のセットアップが完了し、スタイルをインポートし、テストケースを作りました。早速、設計に合うようコンポーネントの HTML を実装していきましょう。

今のところコンポーネントは簡素な状態です。まずは設計を満たすのに十分なコードを書いてみましょう。

```javascript
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
    src="/intro-to-storybook/finished-task-states.mp4"
    type="video/mp4"
  />
</video>

## データの前提条件を示す

`propTypes` を使い React にコンポーネントが予期するデータ形式を示すのがベストプラクティスです。これにより予期するデータ形式がコードからわかるだけでなく、早めに問題を見つけるのに役立ちます。

```javascript
// src/components/Task.js

import React from 'react';
import PropTypes from 'prop-types';

export default function Task({ task: { id, title, state }, onArchiveTask, onPinTask }) {
  // ...
}

Task.propTypes = {
  task: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    state: PropTypes.string.isRequired,
  }),
  onArchiveTask: PropTypes.func,
  onPinTask: PropTypes.func,
};
```

これで、開発中にタスクコンポーネントが間違って使用された際、警告が表示されます。

<div class="aside">
別の方法としてコンポーネントのプロパティを TypeScript など JavaScript の型システムで作成する方法もあります。
</div>

## 完成！

これでサーバーを起動したり、フロントエンドアプリケーションを起動したりすることなく、コンポーネントを作りあげることができました。次は同じように、少しずつ Taskbox コンポーネントの残りの部分を作成します。

見た通り、隔離された環境でコンポーネントを作り始めるのは早くて簡単です。あらゆる状態を掘り下げてテストできるので、高品質で、バグが少なく、磨かれた UI を作ることができることでしょう。

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
