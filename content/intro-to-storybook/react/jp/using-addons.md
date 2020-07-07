---
title: 'アドオン'
tocTitle: 'アドオン'
description: 'アドオンの使い方と導入方法を一般的な例で学ぶ'
commit: 'b3bca4a'
---

Storybook はチームメンバーの開発を向上する堅牢な[アドオン](https://storybook.js.org/addons/introduction/)のシステムを誇っています。ここまでチュートリアルを進めてきたのであればいくつかのアドオンをすでに見ており、[テストの章](/react/en/test/)では実際に使用していることでしょう。

<div class="aside">
<strong>アドオンの一覧を見たいですか？</strong>
<br/>
😍 公式にサポートされているアドオンや、コミュニティに強くサポートされているアドオンの一覧は<a href="https://storybook.js.org/addons/addon-gallery/">ここ</a>から見ることができます。
</div>

全てのアドオンの使用方法や設定方法、特定のユースケースを書きつくすことは出来ませんので、Storybook のエコシステムの中で最も人気のアドオンである [Knobs](https://github.com/storybooks/storybook/tree/master/addons/knobs) を例にとって見てみましょう。

## Knobs を導入する

Knobs は、デザイナーや開発者がコードを書かずにコンポーネントで実験したり、触ったりできるようにするアドオンです。ストーリーに描画されるコンポーネントに対し、ユーザーが操作し、動的に定義可能なプロパティを渡せます。これが今から実装しようとするものです:

<video autoPlay muted playsInline loop>
  <source
    src="/intro-to-storybook/addon-knobs-demo.mp4"
    type="video/mp4"
  />
</video>

### 導入方法

まずは、依存関係を追加します。

```bash
yarn add -D @storybook/addon-knobs
```

`.storybook/main.js` ファイルに Knobs を登録します。

```javascript
// .storybook/main.js

module.exports = {
  stories: ['../src/components/**/*.stories.js'],
  addons: [
    '@storybook/preset-create-react-app',
    '@storybook/addon-actions',
    '@storybook/addon-knobs',
    '@storybook/addon-links',
  ],
};
```

<div class="aside">
<strong>📝 アドオンの記述順序には意味があります！</strong>
<br/>
アドオンを記載した順序はアドオンのパネル (パネルが表示されるアドオンの場合) のタブ順になります。
</div>

以上です。ストーリーで使ってみましょう。

### 使い方

`Task` コンポーネントに Knobs のオブジェクトを使ってみましょう。

まず、Knobs の `withKnobs` デコレーターと `object` を `Task.stories.js` でインポートします。

```javascript
// src/components/Task.stories.js

import React from 'react';
import { action } from '@storybook/addon-actions';
import { withKnobs, object } from '@storybook/addon-knobs/react';
```

<div class="aside">
もし、TypeScript を使用しているのであれば、すこし調整が必要です。
上記のインポートの代わりに、<code>import { withKnobs, object } from '@storybook/addon-knobs'</code> と書いてください。
</div>

次に、`Task.stories.js` ファイルのデフォルトエクスポートの `decorators` キーに `withKnobs` を書いてください:

```javascript
// src/components/Task.stories.js

export default {
  component: Task,
  title: 'Task',
  decorators: [withKnobs],
  excludeStories: /.*Data$/,
};
```

最後に、Default ストーリーに `object` を使い Knobs にオブジェクトを渡します:

```javascript
// src/components/Task.stories.js

export const Default = () => {
  return <Task task={object('task', { ...taskData })} {...actionsData} />;
};
```

すると、「Knobs」という新しいタブが画面下部の「Action Logger」タブの隣に表示されます。

[ここ](https://github.com/storybooks/storybook/tree/master/addons/knobs#object)に書かれているように、`object` にはラベルとデフォルトのオブジェクトを引数として受け取ります。ラベルはアドオンパネルのテキストエリアの隣に表示されます。デフォルトのオブジェクトはテキストエリアに編集可能な JSON として表示されます。JSON として正しい値を記載している限り、コンポーネントはそのデータに合わせて表示されます。

## Storybook の範囲をアドオンが進化させる

Storybook が優れた [CDD の開発環境](https://blog.hichroma.com/component-driven-development-ce1109d56c8e)を提供するだけでなく、対話的なドキュメントとしても使えます。PropType も素晴らしいものですが、Knobs が実装された Storybook ならばデザイナーや、コンポーネントのコードを知らない人にとってコンポーネントの振る舞いを簡単に知る手段となります。

## Knobs をエッジケースを見つけるのに使用する

さらに、コンポーネントに渡されるデータを簡単に編集できるので、品質管理者や、UI 検査のエンジニアがコンポーネントを限界まで操作できます！例えば `Task` コンポーネントに*大量の*文字列を渡したらどうなるでしょうか。

![しまった！右側の文字列が切れている！](/intro-to-storybook/addon-knobs-demo-edge-case.png) 😥

コンポーネントにいろいろな入力を素早く渡せるので、比較的簡単に問題を見つけ、直すことができます。`Task.js` にスタイルを追加してこの問題を解決しましょう:

```javascript
// src/components/Task.js

// これはタスクのタイトルとなる input タグです。実際にはこの要素のスタイル自体を更新するべきでしょうが
// このチュートリアルではインラインスタイルとして問題を解決しましょう
<input
  type="text"
  value={title}
  readOnly={true}
  placeholder="Input title"
  style={{ textOverflow: 'ellipsis' }}
/>
```

![良くなりました](/intro-to-storybook/addon-knobs-demo-edge-case-resolved.png) 👍

## リグレッションを回避するためストーリーを追加する

Knobs に同じ入力をすればいつでもこの問題は再現可能ですが、この入力に対応するストーリーを書くほうがよいでしょう。ストーリーを書くことにより、リグレッションテストが向上しますし、コンポーネントの限界をチームメンバーに明示することが出来ます。

それでは `Task.stories.js` ファイルに長い文字列が指定された場合のストーリーを追加しましょう:

```javascript
// src/components/Task.stories.js

const longTitleString = `This task's name is absurdly large. In fact, I think if I keep going I might end up with content overflow. What will happen? The star that represents a pinned task could have text overlapping. The text could cut-off abruptly when it reaches the star. I hope not!`;

export const LongTitle = () => (
  <Task task={{ ...taskData, title: longTitleString }} {...actionsData} />
);
```

ストーリーを追加したので、このエッジケースをいつでも再現できるようになりました:

![Storybook で再現したエッジケース](/intro-to-storybook/addon-knobs-demo-edge-case-in-storybook.png)

[視覚的なリグレッションテスト](/react/ja/test/)を使用している場合は、今後文字の切り出しが壊れた場合に分かるようになります。このように曖昧なエッジケースは忘れてしまいがちです。

### 変更をマージする

変更を忘れずに Git にマージしてください！

## 自分でアドオンを作る

Knobs が開発者ではない人にもコンポーネントやストーリーに触れるようにすることを見てきました。アドオンを使えば、自分たちのワークフローに合わせて Storybook をカスタマイズしていけます。次の章では、開発と並行して静的なデザインを見せるアドオンの作り方を説明します。
