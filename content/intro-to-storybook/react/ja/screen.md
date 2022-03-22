---
title: '画面を作る'
tocTitle: '画面'
description: 'コンポーネントをまとめて画面を作りましょう'
commit: '79829b2'
---

今までボトムアップ (小さく始めてから複雑性を追加していく) で UI の作成に集中してきました。ボトムアップで作業することで、Storybook で遊びながら、それぞれのコンポーネントを切り離された環境で、それぞれに必要なデータを考えながら開発することができました。サーバーを立ち上げたり、画面を作ったりする必要は全くありませんでした！

この章では Storybook を使用して、コンポーネントを組み合わせて画面を作り、完成度を高めていきます。

## ネストされたコンテナーコンポーネント

このアプリケーションはとても単純なので、作る画面は些細なものです。(Redux から自分でデータを取得する) `TaskList` をレイアウトして、Redux からの `error` フィールド (サーバーとの接続に失敗したときに設定される項目だと思ってください) を追加するだけです。それでは `components` フォルダーに `InboxScreen.js` ファイルを作りましょう:

```javascript
// src/components/InboxScreen.js

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import TaskList from './TaskList';

export function PureInboxScreen({ error }) {
  if (error) {
    return (
      <div className="page lists-show">
        <div className="wrapper-message">
          <span className="icon-face-sad" />
          <div className="title-message">Oh no!</div>
          <div className="subtitle-message">Something went wrong</div>
        </div>
      </div>
    );
  }

  return (
    <div className="page lists-show">
      <nav>
        <h1 className="title-page">
          <span className="title-wrapper">Taskbox</span>
        </h1>
      </nav>
      <TaskList />
    </div>
  );
}

PureInboxScreen.propTypes = {
  /** The error message */
  error: PropTypes.string,
};

PureInboxScreen.defaultProps = {
  error: null,
};

export default connect(({ error }) => ({ error }))(PureInboxScreen);
```

さらに、`App` コンポーネントを `InboxScreen` を描画するように変更します (いずれはルーターにどの画面を表示するか決めてもらいますが、今は気にしないでください):

```javascript
// src/App.js

import React from 'react';
import { Provider } from 'react-redux';
import store from './lib/redux';

import InboxScreen from './components/InboxScreen';

import './index.css';
function App() {
  return (
    <Provider store={store}>
      <InboxScreen />
    </Provider>
  );
}
export default App;
```

しかし興味深いのは、`InboxScreen` のストーリーに関してです。

前に示したように `TaskList` コンポーネントは、表示用のコンポーネントである `PureTaskList` を描画する**コンテナー**です。定義上コンテナーコンポーネントはコンテキストが渡されたり、サービスに接続したりすることを想定するため、切り離された環境においてはそのままでは描画できません。つまりコンテナーを Storybook で描画するには、コンポーネントに必要なコンテキストやサービスをモック化 (例えば、振る舞いを模倣させるなど) しなければならないということです。

`TaskList` を Storybook に置いたときには、コンテナーではなく、`PureTaskList` を描画することにより、この問題を回避しました。同じように `PureInboxScreen` を Storybook に描画してみます。

しかし、`PureInboxScreen` には問題があります。`PureInboxScreen` が表示用コンポーネントであっても、その子供である `TaskList` は表示用ではないのです。つまり、`PureInboxScreen`が「コンテナー性」により汚染されたと言えます。なので、`InboxScreen.stories.js` を以下のようセットアップすると:

```javascript
// src/components/InboxScreen.stories.js

import React from 'react';

import { PureInboxScreen } from './InboxScreen';

export default {
  component: PureInboxScreen,
  title: 'InboxScreen',
};

const Template = (args) => <PureInboxScreen {...args} />;

export const Default = Template.bind({});

export const Error = Template.bind({});
Error.args = {
  error: 'Something',
};
```

`Error` ストーリーは正しく動いていますが、`Default` ストーリーには問題があります。それは `TaskList` に接続するべき Redux のストアがないためです。(同様に `PureInboxScreen` を単体テストしようとしても同じことが起こります。)

![壊れている Inbox](/intro-to-storybook/broken-inboxscreen.png)

この問題を回避する方法の 1 つは、コンテナーコンポーネントをアプリケーションの最上位にのみ描画し、代わりにコンポーネント階層の下層に必要なデータをすべて上位のコンポーネントから渡すことです。

ですが、開発では**きっと**コンポーネント階層の下位の層でコンテナーを描画する必要が出てくるでしょう。アプリケーション全体、もしくは大部分を Storyook で描画したいなら、解決策が必要です。

<div class="aside">
補足として、データを下の階層に渡していくことは正当な手法です。<a href="http://graphql.org/">GraphQL</a> を使う場合は特に。<a href="https://www.chromatic.com">Chromatic</a> を作る際にはこの手法で 800 以上のストーリーを作成しました。
</div>

## デコレーターを使用してコンテキストを渡す

ストーリーの中で `InboxScreen` に Redux のストアを渡すのは簡単です！モック化したストアをデコレーター内部で使用します:

```javascript
// src/components/InboxScreen.stories.js

import React from 'react';
import { Provider } from 'react-redux';
import { action } from '@storybook/addon-actions';
import { PureInboxScreen } from './InboxScreen';
import * as TaskListStories from './TaskList.stories';

// A super-simple mock of a redux store
const store = {
  getState: () => {
    return {
      tasks: TaskListStories.Default.args.tasks,
    };
  },
  subscribe: () => 0,
  dispatch: action('dispatch'),
};

export default {
  component: PureInboxScreen,
  decorators: [(story) => <Provider store={store}>{story()}</Provider>],
  title: 'InboxScreen',
};

const Template = (args) => <PureInboxScreen {...args} />;

export const Default = Template.bind({});

export const Error = Template.bind({});
Error.args = {
  error: 'Something',
};
```

同様に [Apollo](https://www.npmjs.com/package/apollo-storybook-decorator) や [Relay](https://github.com/orta/react-storybooks-relay-container) など、他のデータライブラリー向けのモックコンテキストも存在します。

Storybook で状態を選択していくことで、問題なく出来ているか簡単にテストできます:

<video autoPlay muted playsInline loop >

  <source
    src="/intro-to-storybook/finished-inboxscreen-states-6-0.mp4"
    type="video/mp4"
  />
</video>

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
Git へのコミットを忘れずに行ってください！
</div>
