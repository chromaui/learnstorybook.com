---
title: '画面を作る'
tocTitle: '画面'
description: 'コンポーネントをまとめて画面を作りましょう'
commit: 'bb2471f'
---

今までボトムアップ (小さく始めてから複雑性を追加していく) で UI の作成に集中してきました。ボトムアップで作業することで、Storybook で遊びながら、それぞれのコンポーネントを切り離された環境で、それぞれに必要なデータを考えながら開発することができました。サーバーを立ち上げたり、画面を作ったりする必要は全くありませんでした！

この章では Storybook を使用して、コンポーネントを組み合わせて画面を作り、完成度を高めていきます。

## 繋がれた画面

このアプリケーションはとても単純なので、作る画面は些細なものです。リモート API からデータを取得し、(Redux から自分でデータを取得する) `TaskList` をラップして、Redux からの `error` フィールドを追加するだけです。

まず、リモート API に接続して様々な状態 (すなわち、`error`、`succeeded`) をアプリケーションで扱えるようにするために、Redux ストア (`src/lib/store.js` 内) をアップデートするところから始めましょう:

```diff:title=src/lib/store.js
/* A simple redux store/actions/reducer implementation.
 * A true app would be more complex and separated into different files.
 */
import {
  configureStore,
  createSlice,
+ createAsyncThunk,
} from '@reduxjs/toolkit';

/*
 * The initial state of our store when the app loads.
 * Usually, you would fetch this from a server. Let's not worry about that now
 */

const TaskBoxData = {
  tasks: [],
  status: "idle",
  error: null,
};

/*
 * Creates an asyncThunk to fetch tasks from a remote endpoint.
 * You can read more about Redux Toolkit's thunks in the docs:
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
 * The store is created here.
 * You can read more about Redux Toolkit's slices in the docs:
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
   * Extends the reducer for the async actions
   * You can read more about it at https://redux-toolkit.js.org/api/createAsyncThunk
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

// The actions contained in the slice are exported for usage in our components
export const { updateTaskState } = TasksSlice.actions;

/*
 * Our app's store configuration goes here.
 * Read more about Redux's configureStore in the docs:
 * https://redux-toolkit.js.org/api/configureStore
 */
const store = configureStore({
  reducer: {
    taskbox: TasksSlice.reducer,
  },
});

export default store;
```

リモート API エンドポイントからデータを取得するようにストアを更新し、アプリのさまざまな状態を処理できるように準備したので、`InboxScreen.js` を `src/components` ディレクトリに作成しましょう:

```js:title=src/components/InboxScreen.js
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
```

さらに、`App` コンポーネントを `InboxScreen` を描画するように変更します (いずれはルーターにどの画面を表示するか決めてもらいますが、今は気にしないでください):

```diff:title=src/App.js
- import logo from './logo.svg';
- import './App.css';
+ import './index.css';
+ import store from './lib/store';

+ import { Provider } from 'react-redux';
+ import InboxScreen from './components/InboxScreen';

function App() {
  return (
-   <div className="App">
-     <header className="App-header">
-       <img src={logo} className="App-logo" alt="logo" />
-       <p>
-         Edit <code>src/App.js</code> and save to reload.
-       </p>
-       <a
-         className="App-link"
-         href="https://reactjs.org"
-         target="_blank"
-         rel="noopener noreferrer"
-       >
-         Learn React
-       </a>
-     </header>
-   </div>
+   <Provider store={store}>
+     <InboxScreen />
+   </Provider>
  );
}
export default App;
```

しかし、面白くなるのは Storybook でストーリーをレンダリングするときです。

前回見たように、`TaskList` コンポーネントは現在 **接続された** コンポーネントで、タスクのレンダリングは Redux ストアに依存しています。`InboxScreen` も接続されたコンポーネントなので、同じように、ストーリーにストアを渡します。以下のように `InboxScreen.stories.js` でストーリーを設定します:

```js:title=src/components/InboxScreen.stories.js
import React from 'react';

import InboxScreen from './InboxScreen';
import store from '../lib/store';

import { Provider } from 'react-redux';

export default {
  component: InboxScreen,
  title: 'InboxScreen',
  decorators: [(story) => <Provider store={store}>{story()}</Provider>],
};

const Template = () => <InboxScreen />;

export const Default = Template.bind({});
export const Error = Template.bind({});
```

私たちは `error` ストーリーですぐに問題を発見することができます。正しい状態が表示されず、タスクのリストが表示されます。この問題を回避する 1 つの方法は、前章で行ったように各状態に対してモックされたバージョンを提供することです。その代わりに、よく知られた API モッキングライブラリを Storybook アドオンと一緒に使用して、この問題を解決するのに役立てます。

![壊れた Inbox 画面の状態](/intro-to-storybook/broken-inbox-error-state-optimized.png)

## API をモックする

今回のアプリケーションは単純で、リモート API 呼び出しにあまり依存しないので、[Mock Service Worker](https://mswjs.io/) と [Storybook's MSW addon](https://storybook.js.org/addons/msw-storybook-addon) を使用することにします。Mock Service Worker は、API モックライブラリです。Service Worker に依存してネットワークリクエストを捕捉し、モックデータをレスポンスします。

[Get started section](/intro-to-storybook/react/en/get-started) でアプリケーションをセットアップすると、両方のパッケージともインストールされます。あとは、それらを設定しストーリーを更新して使用するのみです。

ターミナルで以下のコマンドを実行し、`public` フォルダの中にサービスワーカーを生成します。:

```shell
yarn init-msw
```

その後、`.storybook/preview.js` をアップデートしてそれらを初期化する必要があります:

```diff:title=.storybook/preview.js
import '../src/index.css';

+ // Registers the msw addon
+ import { initialize, mswDecorator } from 'msw-storybook-addon';

+ // Initialize MSW
+ initialize();

+ // Provide the MSW addon decorator globally
+ export const decorators = [mswDecorator];

//👇 Configures Storybook to log the actions( onArchiveTask and onPinTask ) in the UI.
export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
};
```

最後に、`InboxScreen` のストーリーを更新し、リモート API 呼び出しをモックする [parameter](https://storybook.js.org/docs/react/writing-stories/parameters) を組み込みます:

```diff:title=src/components/InboxScreen.stories.js
import React from 'react';

import InboxScreen from './InboxScreen';
import store from '../lib/store';
+ import { rest } from 'msw';
+ import { MockedState } from './TaskList.stories';
import { Provider } from 'react-redux';

export default {
  component: InboxScreen,
  title: 'InboxScreen',
  decorators: [(story) => <Provider store={store}>{story()}</Provider>],
};

const Template = () => <InboxScreen />;

export const Default = Template.bind({});
+ Default.parameters = {
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
+ };

export const Error = Template.bind({});
+ Error.parameters = {
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
+ };
```

<div class="aside">
補足として、データを下の階層に渡していくことは正当な手法です。<a href="http://graphql.org/">GraphQL</a> を使う場合は特に。<a href="https://www.chromatic.com/?utm_source=storybook_website&utm_medium=link&utm_campaign=storybook">Chromatic</a> を作る際にはこの手法で 800 以上のストーリーを作成しました。

</div>

Storybook で `error` ストーリーが意図したように動作していることが確認できます。 MSW がリモート API をインターセプトして、適切なレスポンスを返しました。

<video autoPlay muted playsInline loop>
  <source
    src="/intro-to-storybook/inbox-screen-with-working-msw-addon-optimized.mp4"
    type="video/mp4"
  />
</video>

## インタラクションテスト

これまでで、シンプルなコンポーネントから画面まで、完全に機能するアプリケーションを作り上げ、ストーリーを用いてそれぞれの変更を継続的にテストすることができるようになりました。しかし、新しいストーリーを作るたびに、UI が壊れていないかどうか、他のすべてのストーリーを手作業でチェックする必要もあります。これは、とても大変な作業です。

この作業や操作を自動化することはできないのでしょうか？

### play 関数を使ったインタラクションテスト

Storybook の [`play`](https://storybook.js.org/docs/react/writing-stories/play-function) 関数と [`@storybook/addon-interactions`](https://storybook.js.org/docs/react/writing-tests/interaction-testing) が役立ちます。play 関数はストーリーのレンダリング後に実行される小さなコードスニペットを含んでいます。

play 関数はタスクが更新されたときに UI に何が起こるかを検証するのに役立ちます。フレームワークに依存しない DOM API を使用しています。つまり、 play 関数を使って UI を操作し、人間の行動をシミュレートするストーリーを、フロントエンドのフレームワークに関係なく書くことができるのです。

`@storybook/addon-interactions`は、一つ一つのステップごとに Storybook のテストを可視化するのに役立ちます。さらに、各インタラクションの一時停止、再開、巻き戻し、ステップ実行といった便利な UI の制御機能が備わっています。

実際に動かしてみましょう！以下のようにして新しく作成された `InboxScreen` ストーリーを更新し、コンポーネント操作を追加してみましょう:

```diff:title=src/components/InboxScreen.stories.js
import React from 'react';

import InboxScreen from './InboxScreen';

import store from '../lib/store';
import { rest } from 'msw';
import { MockedState } from './TaskList.stories';
import { Provider } from 'react-redux';

+ import {
+  fireEvent,
+  within,
+  waitFor,
+  waitForElementToBeRemoved
+ } from '@storybook/testing-library';

export default {
  component: InboxScreen,
  title: 'InboxScreen',
  decorators: [(story) => <Provider store={store}>{story()}</Provider>],
};

const Template = () => <InboxScreen />;

export const Default = Template.bind({});
Default.parameters = {
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
};

+ Default.play = async ({ canvasElement }) => {
+   const canvas = within(canvasElement);
+   // Waits for the component to transition from the loading state
+   await waitForElementToBeRemoved(await canvas.findByTestId('loading'));
+   // Waits for the component to be updated based on the store
+   await waitFor(async () => {
+     // Simulates pinning the first task
+     await fireEvent.click(canvas.getByLabelText('pinTask-1'));
+     // Simulates pinning the third task
+     await fireEvent.click(canvas.getByLabelText('pinTask-3'));
+   });
+ };
```

新しく作成したストーリーを確認します。`Interactions` パネルをクリックすると、ストーリーの play 関数内のインタラクションのリストが表示されます。

<video autoPlay muted playsInline loop>
  <source
    src="/intro-to-storybook/storybook-interactive-stories-play-function-6-4.mp4"
    type="video/mp4"
  />
</video>

### テスト自動化

play 関数を利用して、UI を操作し、タスクを更新した場合の反応を素早く確認することができます。これによって、余計な手間をかけずに UI の一貫性を保つことができます。

しかし、Storybook をよく見ると、ストーリーを見るときだけインタラクションテストが実行されることがわかります。そのため、変更時に各ストーリーを全てチェックしなければなりません。これは自動化できないのでしょうか？

可能です！Storybook の[テストランナー](https://storybook.js.org/docs/react/writing-tests/test-runner)は可能にしてくれます。それは [Playwright](https://playwright.dev/) によって実現されたスタンドアロンなパッケージで、全てのインタラクションテストを実行し、壊れたストーリーを検知してくれます。

それではどのように動くのかみてみましょう！次のコマンドでインストールして走らせます:

```bash
yarn add --dev @storybook/test-runner
```

次に、 `package.json` の `scripts` をアップデートし、新しいテストタスクを追加してください:

```json
{
  "scripts": {
    "test-storybook": "test-storybook"
  }
}
```

最後に、Storybook を起動し、新しいターミナルで以下のコマンドを実行してください:

```bash
yarn test-storybook --watch
```

<div class="aside">
💡 play 関数でのインタラクションテストはUIコンポーネントをテストするための素晴らしい手法です。ここで紹介したもの以外にも、さまざまなことができます。もっと深く学ぶには<a href="https://storybook.js.org/docs/react/writing-tests/interaction-testing">公式ドキュメント</a>を読むことをお勧めします。
<br />
テストをさらにもっと深く知るためには、<a href="/ui-testing-handbook">Testing Handbook</a> をチェックしてみてください。これは開発ワークフローを加速させるために、スケーラブルなフロントエンドチームが採用しているテスト戦略について解説しています。
</div>

![Storybook test runner successfully runs all tests](/intro-to-storybook/storybook-test-runner-execution.png)

成功です！これで、全てのストーリーがエラーなくレンダリングされ、全てのテストが自動的に通過するかどうか検証するためのツールができました。さらに、テストが失敗した場合、失敗したストーリーをブラウザで開くリンクを提供してくれます。

## コンポーネント駆動開発

まず、一番下の `Task` から始めて、`TaskList` を作り、画面全体の UI が出来ました。`InboxScreen` では繋がれたコンポーネントを含み、一緒にストーリーも作成しました。

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
