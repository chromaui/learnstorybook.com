---
title: '画面を作る'
tocTitle: '画面'
description: 'コンポーネントから画面を作る'
commit: '4aef5f7'
---

今までボトムアップ (小さく始めてから複雑性を追加していく) で UI の作成に集中してきました。ボトムアップで作業することで、Storybook で遊びながら、コンポーネントのデータ要件を見つけ出し、隔離された環境で各コンポーネントを開発することができました。サーバーを立ち上げたり、画面を作ったりする必要は全くありませんでした！

この章では Storybook を使用し、コンポーネントを画面にまとめながら、完成度を高めていきます。

## ネストされたコンテナーコンポーネント

このアプリケーションはとても単純なので、作る画面は、(Redux から自分でデータを取得する) `TaskList` をレイアウトで囲って、Redux からの `error` フィールド (サーバーとの接続に失敗したときに設定される項目だと思ってください) を追加しただけの、とても些細なものです。それでは `components` フォルダーに `InboxScreen.js` ファイルを作りましょう:

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
  error: PropTypes.string,
};

PureInboxScreen.defaultProps = {
  error: null,
};

export default connect(({ error }) => ({ error }))(PureInboxScreen);
```

また、`App` コンポーネントが `InboxScreen` を描画するように変更 (いずれはルーターにどの画面を表示するか決めてもらいますが、今は気にしないでください) します。

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

けれど、Storybook のストーリーに面白いことが起きています。

前に示したように `TaskList` コンポーネントは `PureTaskList` プレゼンテーショナルコンテナーを描画する **コンテナー** です。定義上コンテナーコンポーネントはコンテキストが渡されたり、サービスに接続されたりすることを予期するため、隔離された環境で単純には描画できません。つまりコンテナーを Storybook で描画するには、コンポーネントに必要なコンテキストやサービスをモック化 (例えば、振る舞いを模倣させるなど) しなければならないということです。

`TaskList` を Storybook に置いたときには、コンテナーではなく、`PureTaskList` を描画することにより、この問題を回避しました。同じように `PureInboxScreen` を Storybook に描画します。

しかし、`PureInboxScreen` には問題があります。`PureInboxScreen` 自体がプレゼンテーショナルとなっても、その子供である `TaskList` はプレゼンテーショナルではないのです。ある意味では、`PureInboxScreen`が「コンテナー化」により汚染されたと言えます。なので、`InboxScreen.stories.js` を以下のようセットアップすると:

```javascript
// src/components/InboxScreen.stories.js

import React from 'react';

import { PureInboxScreen } from './InboxScreen';

export default {
  component: PureInboxScreen,
  title: 'InboxScreen',
};

export const Default = () => <PureInboxScreen />;

export const Error = () => <PureInboxScreen error="Something" />;
```

`Error`　のストーリーは正しく動いていますが、`Default` のストーリーには問題があります。それは `TaskList` に接続するべき Redux のストアがないためです。(同様に `PureInboxScreen` を単体テストしようとしても同じことが起こります。)

![壊れている Inbox](/intro-to-storybook/broken-inboxscreen.png)

この問題を回避する方法の 1 つは、コンテナーコンポーネントをアプリケーションの最上位にのみ描画し、代わりにコンポーネント階層の下層に必要なデータをすべて上位のコンポーネントから渡すことです。

ですが、開発では**きっと**コンポーネント階層の下位の層でコンテナーを描画する必要が出てくるでしょう。アプリケーション全体、もしくは大部分を Storyook で描画したいなら、解決策が必要です。

<div class="aside">
補足として、データを階層化して渡すことは正当な手法です。<a href="http://graphql.org/">GraphQL</a> を使う場合は特に。<a href="https://www.chromatic.com">Chromatic</a> を作る際にはこの手法により 800 以上のストーリーを書きました。
</div>

## デコレーターを使用してコンテキストを渡す

ストーリーの中で `InboxScreen` に Redux のストアを渡すのは簡単です！モック化したストアをデコレーター内部で使用します:

```javascript
// src/components/InboxScreen.stories.js

import React from 'react';
import { action } from '@storybook/addon-actions';
import { Provider } from 'react-redux';

import { PureInboxScreen } from './InboxScreen';
import { defaultTasksData } from './TaskList.stories';

export default {
  component: PureInboxScreen,
  title: 'InboxScreen',
  decorators: [story => <Provider store={store}>{story()}</Provider>],
};

// とても簡素な Redux ストアのモック
const store = {
  getState: () => {
    return {
      tasks: defaultTasksData,
    };
  },
  subscribe: () => 0,
  dispatch: action('dispatch'),
};

export const Default = () => <PureInboxScreen />;

export const Error = () => <PureInboxScreen error="Something" />;
```

同様に [Apollo](https://www.npmjs.com/package/apollo-storybook-decorator) や [Relay](https://github.com/orta/react-storybooks-relay-container) など、他のデータライブラリー向けのモックコンテキストも存在します。

Storybook で状態を選択していくことで、問題なく出来ているか簡単にテストできます:

<video autoPlay muted playsInline loop >

  <source
    src="/intro-to-storybook/finished-inboxscreen-states.mp4"
    type="video/mp4"
  />
</video>

## コンポーネント駆動開発

まず `Task` から始めて、`TaskList` を作り、画面全体の UI が出来ました。`InboxScreen` はネストしたコンテナーコンポーネントを含んでおり、付随するストーリーもあります。

<video autoPlay muted playsInline loop style="width:480px; height:auto; margin: 0 auto;">
  <source
    src="/intro-to-storybook/component-driven-development-optimized.mp4"
    type="video/mp4"
  />
</video>

[**コンポーネント駆動開発**](https://blog.hichroma.com/component-driven-development-ce1109d56c8e) (CDD) はコンポーネント階層を上がるごとに少しずつ複雑性を拡張していくことが出来ます。利点として、開発プロセスに集中できること、UI の組み合わせをすべて網羅できること、が挙げられます。要するに、CDD によって、高品質で複雑な UI を作ることができます。

まだ終わりではありません。UI を作成しても仕事は終わりません。長期間にわたり耐久性を維持できるようにしなければなりません。
