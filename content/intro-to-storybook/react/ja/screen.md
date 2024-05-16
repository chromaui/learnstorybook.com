---
title: '画面を作る'
tocTitle: '画面'
description: 'コンポーネントをまとめて画面を作りましょう'
commit: '2275632'
---

今までボトムアップ (小規模な状態から複雑さを追加していく) で UI の作成に集中してきました。ボトムアップで作業することで、Storybook で遊びながら、それぞれのコンポーネントを切り離された環境で、それぞれに必要なデータを考えながら開発することができました。サーバーを立ち上げたり、画面を作ったりする必要はまったくありませんでした！

この章では Storybook を使用して、コンポーネントを組み合わせて画面を作り、完成度を高めていきます。

## 繋がれた画面

このアプリケーションはとても単純なので、作る画面は些細なものです。リモート API からデータを取得し、(Redux から自分でデータを取得する) `TaskList` をラップして、Redux からの `error` フィールドを追加するだけです。

まず、リモート API に接続してさまざまな状態 (すなわち、`error`、`succeeded`) をアプリケーションで扱えるようにするために、Redux ストア (`src/lib/store.js` 内) をアップデートするところから始めましょう。

```diff:title=src/lib/store.js
/* シンプルなreduxのストア/アクション/リデューサーの実装です。
 * 本当のアプリケーションはもっと複雑で、異なるファイルに分けられます。
 */
import {
  configureStore,
  createSlice,
+ createAsyncThunk,
} from '@reduxjs/toolkit';

/*
 * アプリケーションのロード時のストアの初期状態です。
 * 通常、サーバーから取得しますが、今回は気にしないでください(ファイルに直書きしています)。
 */

const TaskBoxData = {
  tasks: [],
  status: 'idle',
  error: null,
};

/*
 * AsyncThunkを使ってリモートエンドポイントからタスクを取得します。
 * Redux Toolkitのthunkについて詳しくはドキュメントを参照してください:
 * https://redux-toolkit.js.org/api/createAsyncThunk
 */
+ export const fetchTasks = createAsyncThunk('todos/fetchTodos', async () => {
+   const response = await fetch(
+     'https://jsonplaceholder.typicode.com/todos?userId=1'
+   );
+   const data = await response.json();
+   const result = data.map((task) => ({
+     id: `${task.id}`,
+     title: task.title,
+     state: task.completed ? 'TASK_ARCHIVED' : 'TASK_INBOX',
+   }));
+   return result;
+ });

/*
 * ストアはここで作成されます。
 * Redux Toolkitのスライスについて詳しくはドキュメントを参照してください:
 * https://redux-toolkit.js.org/api/createSlice
 */
const TasksSlice = createSlice({
  name: 'taskbox',
  initialState: TaskBoxData,
  reducers: {
    updateTaskState: (state, action) => {
      const { id, newTaskState } = action.payload;
      const task = state.tasks.findIndex((task) => task.id === id);
      if (task >= 0) {
        state.tasks[task].state = newTaskState;
      }
    },
  },
  /*
   * 非同期アクション用のリデューサを追加します。
   * 詳しくは https://redux-toolkit.js.org/api/createAsyncThunk を参照してください。
   */
+  extraReducers(builder) {
+    builder
+    .addCase(fetchTasks.pending, (state) => {
+      state.status = 'loading';
+      state.error = null;
+      state.tasks = [];
+    })
+    .addCase(fetchTasks.fulfilled, (state, action) => {
+      state.status = 'succeeded';
+      state.error = null;
+      // Add any fetched tasks to the array
+      state.tasks = action.payload;
+     })
+    .addCase(fetchTasks.rejected, (state) => {
+      state.status = 'failed';
+      state.error = "Something went wrong";
+      state.tasks = [];
+    });
+ },
});

// スライスに含まれるアクションはコンポーネントで使用するためにエクスポートされます
export const { updateTaskState } = TasksSlice.actions;

/*
 * アプリケーションのストアの設定はここにあります。
 * ReduxのconfigureStoreについて詳しくはドキュメントを参照してください:
 * https://redux-toolkit.js.org/api/configureStore
 */
const store = configureStore({
  reducer: {
    taskbox: TasksSlice.reducer,
  },
});

export default store;
```

リモート API エンドポイントからデータを取得するようにストアを更新し、アプリのさまざまな状態を処理できるように準備したので、`InboxScreen.jsx` を `src/components` ディレクトリに作成しましょう:

```jsx:title=src/components/InboxScreen.jsx
import React, { useEffect } from 'react';

import { useDispatch, useSelector } from 'react-redux';

import { fetchTasks } from '../lib/store';

import TaskList from './TaskList';

export default function InboxScreen() {
  const dispatch = useDispatch();
  // We're retrieving the error field from our updated store
  const { error } = useSelector((state) => state.taskbox);
  // The useEffect triggers the data fetching when the component is mounted
  useEffect(() => {
    dispatch(fetchTasks());
  }, []);

  if (error) {
    return (
      <div className="page lists-show">
        <div className="wrapper-message">
          <span className="icon-face-sad" />
          <p className="title-message">Oh no!</p>
          <p className="subtitle-message">Something went wrong</p>
        </div>
      </div>
    );
  }
  return (
    <div className="page lists-show">
      <nav>
        <h1 className="title-page">Taskbox</h1>
      </nav>
      <TaskList />
    </div>
  );
}
```

さらに、`App` コンポーネントを `InboxScreen` を描画するように変更します (いずれはルーターにどの画面を表示するか決めてもらいますが、今は気にしないでください):

```diff:title=src/App.jsx
- import { useState } from 'react'
- import reactLogo from './assets/react.svg'
- import viteLogo from '/vite.svg'
- import './App.css'

+ import './index.css';
+ import store from './lib/store';

+ import { Provider } from 'react-redux';
+ import InboxScreen from './components/InboxScreen';

function App() {
- const [count, setCount] = useState(0)
  return (
-   <div className="App">
-     <div>
-       <a href="https://vitejs.dev" target="_blank">
-         <img src={viteLogo} className="logo" alt="Vite logo" />
-       </a>
-       <a href="https://reactjs.org" target="_blank">
-         <img src={reactLogo} className="logo react" alt="React logo" />
-       </a>
-     </div>
-     <h1>Vite + React</h1>
-     <div className="card">
-       <button onClick={() => setCount((count) => count + 1)}>
-         count is {count}
-       </button>
-       <p>
-         Edit <code>src/App.jsx</code> and save to test HMR
-       </p>
-     </div>
-     <p className="read-the-docs">
-       Click on the Vite and React logos to learn more
-     </p>
-   </div>
+   <Provider store={store}>
+     <InboxScreen />
+   </Provider>
  );
}
export default App;
```

しかし、面白くなるのは Storybook でストーリーをレンダリングするときです。

前回見たように、`TaskList` コンポーネントは現在 **接続された** コンポーネントで、タスクのレンダリングは Redux ストアに依存しています。`InboxScreen` も接続されたコンポーネントなので、同じように、ストーリーにストアを渡します。以下のように `InboxScreen.stories.jsx` でストーリーを設定します:

```jsx:title=src/components/InboxScreen.stories.jsx
import InboxScreen from './InboxScreen';
import store from '../lib/store';

import { Provider } from 'react-redux';

export default {
  component: InboxScreen,
  title: 'InboxScreen',
  decorators: [(story) => <Provider store={store}>{story()}</Provider>],
  tags: ['autodocs'],
};

export const Default = {};

export const Error = {};
``` const Error = Template.bind({});
```

私たちは `error` ストーリーですぐに問題を発見できます。正しい状態が表示されず、タスクのリストが表示されます。この問題を回避する 1 つの方法は、前章で行ったように各状態に対してモックされたバージョンを提供することです。その代わりに、よく知られた API モッキングライブラリを Storybook アドオンと一緒に使用して、この問題を解決するのに役立てます。

![壊れた Inbox 画面の状態](/intro-to-storybook/broken-inbox-error-state-7-0-optimized.png)

## API をモックする

今回のアプリケーションは単純で、リモート API 呼び出しにあまり依存しないので、[Mock Service Worker](https://mswjs.io/) と [Storybook MSW アドオン](https://storybook.js.org/addons/msw-storybook-addon) を使用することにします。Mock Service Worker は、API モックライブラリです。Service Worker に依存してネットワークリクエストを捕捉し、モックデータをレスポンスします。

[初めの章](/intro-to-storybook/react/ja/get-started) でアプリケーションをセットアップしたときに、これらのパッケージはすでにインストールされています。あとは、それらを設定しストーリーを更新して使用するのみです。

ターミナルで以下のコマンドを実行し、`public` フォルダの中にサービスワーカーを生成します。

```shell
yarn init-msw
```

その後、`.storybook/preview.js` をアップデートしてそれらを初期化する必要があります:

```diff:title=.storybook/preview.js
import '../src/index.css';

+ // mswアドオンを登録
+ import { initialize, mswLoader } from 'msw-storybook-addon';

+ // MSWを初期化
+ initialize();

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
+ loaders: [mswLoader],
};

export default preview;
```

最後に、`InboxScreen` のストーリーを更新し、リモート API 呼び出しをモックする [parameter](https://storybook.js.org/docs/react/writing-stories/parameters) を組み込みます。

```diff:title=src/components/InboxScreen.stories.jsx
import InboxScreen from './InboxScreen';
import store from '../lib/store';
+ import { rest } from 'msw';
+ import { MockedState } from './TaskList.stories';
import { Provider } from 'react-redux';

export default {
  component: InboxScreen,
  title: 'InboxScreen',
  decorators: [(story) => <Provider store={store}>{story()}</Provider>],
  tags: ['autodocs'],
};

export const Default = {
+ parameters: {
+   msw: {
+     handlers: [
+       rest.get(
+         'https://jsonplaceholder.typicode.com/todos?userId=1',
+         (req, res, ctx) => {
+           return res(ctx.json(MockedState.tasks));
+         }
+       ),
+     ],
+   },
+ },
};
export const Error = {
+ parameters: {
+   msw: {
+     handlers: [
+       rest.get(
+         'https://jsonplaceholder.typicode.com/todos?userId=1',
+         (req, res, ctx) => {
+           return res(ctx.status(403));
+         }
+       ),
+     ],
+   },
+ },
};
```

<div class="aside">
補足として、データを下の階層に渡していくことは正当な手法です。<a href="http://graphql.org/">GraphQL</a> を使う場合は特に。<a href="https://www.chromatic.com/?utm_source=storybook_website&utm_medium=link&utm_campaign=storybook">Chromatic</a> を作る際にはこの手法で 800 以上のストーリーを作成しました。

</div>

Storybook で `error` ストーリーが意図したように動作していることが確認できます。 MSW がリモート API をインターセプトして、適切なレスポンスを返しました。

<video autoPlay muted playsInline loop>
  <source
    src="/intro-to-storybook/inbox-screen-with-working-msw-addon-optimized-7.0.mp4"
    type="video/mp4"
  />
</video>

## インタラクションテスト

これまでで、シンプルなコンポーネントから画面まで、完全に機能するアプリケーションを作り上げ、ストーリーを用いてそれぞれの変更を継続的にテストすることができるようになりました。しかし、新しいストーリーを作るたびに、UI が壊れていないかどうか、他のすべてのストーリーを手作業でチェックする必要もあります。これは、とても大変な作業です。

この作業や操作を自動化することはできないのでしょうか？

### play 関数を使ったインタラクションテスト

Storybook の [`play`](https://storybook.js.org/docs/react/writing-stories/play-function) 関数と [`@storybook/addon-interactions`](https://storybook.js.org/docs/react/writing-tests/interaction-testing) が役立ちます。play 関数はストーリーのレンダリング後に実行される小さなコードスニペットを含んでいます。

play 関数はタスクが更新されたときに UI に何が起こるかを検証するのに役立ちます。フレームワークに依存しない DOM API を使用しています。つまり、 play 関数を使って UI を操作し、人間の行動をシミュレートするストーリーを、フロントエンドのフレームワークに関係なく書くことができるのです。

`@storybook/addon-interactions`は、ひとつひとつのステップごとに Storybook のテストを可視化するのに役立ちます。さらに、各インタラクションの一時停止、再開、巻き戻し、ステップ実行といった便利な UI の制御機能が備わっています。

実際に動かしてみましょう！以下のようにして新しく作成された `InboxScreen` ストーリーを更新し、コンポーネント操作を追加してみましょう。

```diff:title=src/components/InboxScreen.stories.jsx
import InboxScreen from './InboxScreen';

import store from '../lib/store';
import { rest } from 'msw';
import { MockedState } from './TaskList.stories';
import { Provider } from 'react-redux';

+ import {
+  fireEvent,
+  waitFor,
+  within,
+  waitForElementToBeRemoved
+ } from '@storybook/test';

export default {
  component: InboxScreen,
  title: 'InboxScreen',
  decorators: [(story) => <Provider store={store}>{story()}</Provider>],
  tags: ['autodocs'],
};

export const Default = {
  parameters: {
    msw: {
      handlers: [
        rest.get(
          'https://jsonplaceholder.typicode.com/todos?userId=1',
          (req, res, ctx) => {
            return res(ctx.json(MockedState.tasks));
          }
        ),
      ],
    },
  },
+ play: async ({ canvasElement }) => {
+   const canvas = within(canvasElement);
+   //  コンポーネントのローディング状態からの遷移を待機
+   await waitForElementToBeRemoved(await canvas.findByTestId('loading'));
+   // ストアに基づいたコンポーネントの更新を待機
+   await waitFor(async () => {
+     // 最初のタスクのピン止めをシミュレート
+     await fireEvent.click(canvas.getByLabelText('pinTask-1'));
+     // 3つ目のタスクのピン止めをシミュレート
+     await fireEvent.click(canvas.getByLabelText('pinTask-3'));
+   });
+ },
};
export const Error = {
  parameters: {
    msw: {
      handlers: [
        rest.get(
          'https://jsonplaceholder.typicode.com/todos?userId=1',
          (req, res, ctx) => {
            return res(ctx.status(403));
          }
        ),
      ],
    },
  },
};
```

<div class="aside">

💡 The `@storybook/test` パッケージは `@storybook/jest`と`@storybook/testing-library`を置き換えるものです。
より小さなバンドルサイズと、VitestパッケージをベースにしたよりわかりやすいAPIを提供します。

</div>

`Default`ストーリーを確認します。`Interactions` パネルをクリックすると、ストーリーの play 関数内のインタラクションのリストが表示されます。

<video autoPlay muted playsInline loop>
  <source
    src="/intro-to-storybook/storybook-interactive-stories-play-function-7-0.mp4"
    type="video/mp4"
  />
</video>

### test runnerによるテストの自動化

play 関数を利用して、UI を操作し、タスクを更新した場合の反応を素早く確認できます。これによって、余計な手間をかけずに UI の一貫性を保つことができます。

しかし、Storybook をよく見ると、ストーリーを見るときだけインタラクションテストが実行されることがわかります。そのため、変更時に各ストーリーをすべてチェックしなければなりません。これは自動化できないのでしょうか？

結論から言うと、それは可能です！Storybook の[テストランナー](https://storybook.js.org/docs/react/writing-tests/test-runner)は [Playwright](https://playwright.dev/) によって実現されたスタンドアロンなパッケージで、すべのインタラクションテストを実行し、壊れたストーリーを検知してくれます。

それではどのように動くのかみてみましょう！次のコマンドでインストールします。

```bash
yarn add --dev @storybook/test-runner
```

次に、 `package.json` の `scripts` を更新し、新しいテストタスクを追加してください。

```json:clipboard=false
{
  "scripts": {
    "test-storybook": "test-storybook"
  }
}
```

最後に、Storybook を起動し、新しいターミナルで以下のコマンドを実行してください。

```bash
yarn test-storybook --watch
```

<div class="aside">
💡 play 関数でのインタラクションテストはUIコンポーネントをテストするための素晴らしい手法です。ここで紹介したもの以外にも、さまざまなことができます。もっと深く学ぶには<a href="https://storybook.js.org/docs/react/writing-tests/interaction-testing">公式ドキュメント</a>を読むことをお勧めします。
<br />
テストをさらにもっと深く知るためには、<a href="/ui-testing-handbook">Testing Handbook</a> をチェックしてみてください。これは開発ワークフローを加速させるために、スケーラブルなフロントエンドチームが採用しているテスト戦略について解説しています。
</div>

![Storybook test runner successfully runs all tests](/intro-to-storybook/storybook-test-runner-execution.png)

成功です！これで、すべてのストーリーがエラーなくレンダリングされ、すべてのテストが自動的に通過するかどうか検証するためのツールができました。さらに、テストが失敗した場合、失敗したストーリーをブラウザで開くリンクを提供してくれます。

## コンポーネント駆動開発

まず、一番下の `Task` から始めて、`TaskList` を作り、画面全体の UI ができました。`InboxScreen` では繋がれたコンポーネントを含み、一緒にストーリーも作成しました。

<video autoPlay muted playsInline loop style="width:480px; height:auto; margin: 0 auto;">
  <source
    src="/intro-to-storybook/component-driven-development-optimized.mp4"
    type="video/mp4"
  />
</video>

[**コンポーネント駆動開発**](https://www.componentdriven.org/) (CDD) はコンポーネント階層を上がるごとに少しずつ複雑性を拡張します。利点としては、開発プロセスに集中できること、UI の組み合わせの網羅性を向上できること、が挙げられます。要するに、CDD によって、高品質で複雑な UI を作ることができます。

まだ終わりではありません。UI を作成しても作業は終わりません。長期間にわたり耐久性を維持できるようにしなければなりません。

<div class="aside">
💡 Git へのコミットを忘れずに行ってください！
</div>
