---
title: 'おまけ: アドオンを作る'
tocTitle: 'おまけ: アドオンを作る'
description: '開発を加速させるアドオンを自分で作る方法を学びましょう'
commit: 'bebba5d'
---

既に、Storybook の特徴的な機能である、堅牢な[アドオン](https://storybook.js.org/docs/react/configure/storybook-addons)のエコシステムを紹介しました。アドオンを使用することで、開発効率とワークフローが向上します。

このおまけの章では自分でアドオンを作る方法について見ていきます。アドオンを作るのは困難だと思われるかもしれませんが、そうでもありません。少し手順を踏めば、アドオンを書き始めることができます。

しかし、まずは今から作るアドオンがどういうものか俯瞰してみましょう。

## 作成するアドオンについて

今回の例では、すでに存在する UI コンポーネントに関連したデザインアセットがあると仮定します。しかし、Storybook の UI を見てもデザインアセットとコンポーネントの関連が見えません。どうすればよいでしょうか。

これから作るアドオンにどういった機能があればよいのか定義してみましょう:

- パネルにデザインアセットを表示する
- イメージを表示できるようにして、URL も埋め込めるようにする
- 複数のテーマやバージョンがあることを考慮し、複数のアセットに対応する

ストーリーとアセットの紐づけには Storybook の機能である [parameters](https://storybook.js.org/docs/react/writing-stories/parameters#story-parameters) を使用します。parameters はストーリーに追加のメタデータを設定することができます。

```javascript
// YourComponent.js

export default {
  title: 'Your component',
  decorators: [
    /*...*/
  ],
  parameters: {
    assets: ['path/to/your/asset.png'],
  },
  //
};
```

## セットアップ

これから作るアドオンがどういうものかを説明したので、作業を始めていきましょう。

プロジェクトのルートフォルダーに `.babelrc` という新しいファイルを作り、以下の内容を記述します:

```json
{
  "presets": [
    [
      "@babel/preset-env",
      {
        "targets": {
          "node": "current"
        }
      }
    ],
    "@babel/preset-react"
  ]
}
```

このファイルを追加することで、アドオン向けの正しいプリセットとオプションが指定されます。

次に `.storybook` フォルダーに `design-addon` フォルダーを作成し、さらにその中に `register.js` というファイルを作ります。

これだけです。これでアドオンの作成準備が整いました。

<div class="aside">
ここでは <code>.storybook</code> フォルダーをアドオンの配置場所として使用します。その理由は直接的なアプローチをとることで複雑になりすぎないようにするためです。実際のアドオンを作成するならば、別のパッケージに移動させ、独自のファイルとフォルダーの構成にするべきでしょう。
</div>

## アドオンを書く

今追加したファイルに以下のコードを記述します:

```javascript
//.storybook/design-addon/register.js

import React from 'react';
import { AddonPanel } from '@storybook/components';
import { addons, types } from '@storybook/addons';

addons.register('my/design-addon', () => {
  addons.add('design-addon/panel', {
    title: 'assets',
    type: types.PANEL,
    render: ({ active, key }) => (
      <AddonPanel active={active} key={key}>
        implement
      </AddonPanel>
    ),
  });
});
```

これが作業を始める際の、典型的なボイラープレートコードです。このコードが何をしているのかというと:

- Storybook に新しいアドオンを登録する
- 新しい UI 要素をオプション (アドオンを説明するタイトルと要素の種類) と共に追加し、暫定的にテキストを表示する

この時点では Storybook を起動しても、アドオンは見えません。前に Knobs アドオンを追加したのと同じように、`.storybook/main.js` ファイルに登録用のコードを追加する必要があります。以下の内容を現在の `addons` リストに追加しましょう:

```js
// .storybook/main.js
module.exports = {
  stories: ['../src/components/**/*.stories.js'],
  addons: [
    // same as before
    './.storybook/design-addon/register.js', // our addon
  ],
};
```

![Storybook 内で動くデザインアセットアドオン](/intro-to-storybook/create-addon-design-assets-added.png)

動きました！Storybook の UI に作成したアドオンが追加されています。

<div class="aside">
Storybook には、パネルだけではなく、様々な種類の UI コンポーネントを追加できます。すべてではありませんが、ほとんどの UI コンポーネントは既に @storybook/components パッケージ内にありますので、UI を実装する手間を省き、機能を作りこむことに集中することができます。
</div>

### Content コンポーネントを作成する

最初の目標は完了しました。次の目標に取り掛かりましょう。

次の目標を完了させるため、インポートを変更し、アセットの情報を表示する新しいコンポーネントを導入する必要があります。

アドオンファイルを以下のように変更します:

```javascript
//.storybook/design-addon/register.js

import React, { Fragment } from 'react';
/* same as before */
import { useParameter } from '@storybook/api';

const Content = () => {
  const results = useParameter('assets', []); // story's parameter being retrieved here
  return (
    <Fragment>
      {results.length ? (
        <ol>
          {results.map(i => (
            <li>{i}</li>
          ))}
        </ol>
      ) : null}
    </Fragment>
  );
};
```

これで、コンポーネントを作り、インポートを変更しました。あとはパネルにコンポーネントを接続すれば、ストーリーに関連のある情報を表示できるアドオンとなることでしょう。

最終的なコードは以下のようになるでしょう:

```javascript
//.storybook/design-addon/register.js

import React, { Fragment } from 'react';
import { AddonPanel } from '@storybook/components';
import { useParameter } from '@storybook/api';
import { addons, types } from '@storybook/addons';

const Content = () => {
  const results = useParameter('assets', []); // story's parameter being retrieved here
  return (
    <Fragment>
      {results.length ? (
        <ol>
          {results.map(i => (
            <li>{i}</li>
          ))}
        </ol>
      ) : null}
    </Fragment>
  );
};

addons.register('my/design-addon', () => {
  addons.add('design-addon/panel', {
    title: 'assets',
    type: types.PANEL,
    render: ({ active, key }) => (
      <AddonPanel active={active} key={key}>
        <Content />
      </AddonPanel>
    ),
  });
});
```

[useParameter](https://storybook.js.org/docs/react/api/addons-api#useparameter) を使用していることに注目してください。この便利なフックは各ストーリーに設定された `parameters` オプションを読み取ることが可能です。このアドオンでは単一または複数のアセットへのパスが指定されます。実際の効果は後ほど確認しましょう。

### ストーリーにアドオンを使用する

必要なピースはすべて組み立てました。しかし、実際に動かして何かを表示させるにはどうすればよいでしょうか。

使うためには `Task.stories.js` ファイルにちょっとした変更を加え、[parameters](https://storybook.js.org/docs/react/writing-stories/parameters) オプションを追加します。

```javascript
// src/components/Task.stories.js

export default {
  component: Task,
  title: 'Task',
  parameters: {
    assets: [
      'path/to/your/asset.png',
      'path/to/another/asset.png',
      'path/to/yet/another/asset.png',
    ],
  },
  argTypes: {
    /* ...actionsData, */
    backgroundColor: { control: 'color' },
  },
};
/* same as before  */
```

それでは Storybook を再起動してタスクのストーリーを選択してみましょう。すると以下のようになります:

![Storybook のストーリーがデザインアセットアドオンとともに表示されている](/intro-to-storybook/create-addon-design-assets-inside-story.png)

### アドオンにコンテンツを表示する

ここまで来るとアドオンが動いているのがわかります。さらに `Content` コンポーネントを変更し、実際にイメージを表示してみましょう:

```javascript
//.storybook/design-addon/register.js

import React, { Fragment } from 'react';
import { AddonPanel } from '@storybook/components';
import { useParameter, useStorybookState } from '@storybook/api';
import { addons, types } from '@storybook/addons';
import { styled } from '@storybook/theming';

const getUrl = input => {
  return typeof input === 'string' ? input : input.url;
};

const Iframe = styled.iframe({
  width: '100%',
  height: '100%',
  border: '0 none',
});
const Img = styled.img({
  width: '100%',
  height: '100%',
  border: '0 none',
  objectFit: 'contain',
});

const Asset = ({ url }) => {
  if (!url) {
    return null;
  }
  if (url.match(/\.(png|gif|jpeg|tiff|svg|anpg|webp)/)) {
    // do image viewer
    return <Img alt="" src={url} />;
  }

  return <Iframe title={url} src={url} />;
};

const Content = () => {
  // story's parameter being retrieved here
  const results = useParameter('assets', []);
  // the id of story retrieved from Storybook global state
  const { storyId } = useStorybookState();

  if (results.length === 0) {
    return null;
  }

  const url = getUrl(results[0]).replace('{id}', storyId);

  return (
    <Fragment>
      <Asset url={url} />
    </Fragment>
  );
};
```

コードを見てみましょう。`@storybook/theming` パッケージの `styled` タグを使用しています。これを使用することで Storybook のテーマとアドオンの UI をカスタマイズすることができます。[`useStorybookState`](https://storybook.js.org/docs/react/api/addons-api#usestorybookstate) は Storybook の内部状態にアクセスするためのフックで、どんな些細な情報でも取得することができます。この例では、各ストーリーに付けられた ID を取得するのに使用しています。

### 実際のアセットを表示する

実際にアセットをアドオンに表示させるには、アセットを `public` フォルダーにコピーし、ここまでの変更を反映し、ストーリーの `parameters` オプションを変更しなければなりません。

Storybook が変更を検知し、アセットをロードします。今のところ最初のアセットしか表示出来ません。

![実際のアセットがロードされた](/intro-to-storybook/design-assets-image-loaded.png)

## ステートフルなアドオン

最初に挙げた目標を確認してみましょう:

- ✔️ パネルにデザインアセットを表示する
- ✔️ イメージを表示できるようにして、URL も埋め込めるようにする
- ❌ 複数のテーマやバージョンがあることを考慮し、複数のアセットに対応する

もうすぐ完了ですね。残り一つです。

最後の目標を完了するには、状態を保持することが必要です。React の `useState` フックを使用してもいいですし、コンポーネントを class コンポーネントに変更し `this.setState()` を使用してもいいでしょう。しかし今回は Storybook の `useAddonState` を使用します。これはアドオンの状態を永続化する手段を提供してくれるので、状態を永続化するコードを書かなくて済みます。さらに Storybook の他の UI 要素である `ActionBar` を使用しアイテムの切り替えを可能にします。

それではインポートを変更しましょう:

```javascript
//.storybook/design-addon/register.js

import { useParameter, useStorybookState, useAddonState } from '@storybook/api';
import { AddonPanel, ActionBar } from '@storybook/components';
/* same as before */
```

そして `Content` コンポーネントを変更し、アセットを切り替えられるようにしましょう:

```javascript
//.storybook/design-addon/register.js

const Content = () => {
  // story's parameter being retrieved here
  const results = useParameter('assets', []);
  // addon state being persisted here
  const [selected, setSelected] = useAddonState('my/design-addon', 0);
  // the id of the story retrieved from Storybook global state
  const { storyId } = useStorybookState();

  if (results.length === 0) {
    return null;
  }

  if (results.length && !results[selected]) {
    setSelected(0);
    return null;
  }

  const url = getUrl(results[selected]).replace('{id}', storyId);
  return (
    <Fragment>
      <Asset url={url} />
      {results.length > 1 ? (
        <ActionBar
          actionItems={results.map((i, index) => ({
            title: typeof i === 'string' ? `asset #${index + 1}` : i.name,
            onClick: () => setSelected(index),
          }))}
        />
      ) : null}
    </Fragment>
  );
};
```

## アドオンの完成

UI コンポーネントに関連するデザインアセットを表示するという、実際に使える Storybook アドオンを作るために、やるべきことを全て達成しました。

<details>
  <summary>この例で作成したコード全体を参照するにはクリックしてください</summary>

```javascript
// .storybook/design-addon/register.js

import React, { Fragment } from 'react';

import { useParameter, useStorybookState, useAddonState } from '@storybook/api';
import { addons, types } from '@storybook/addons';
import { AddonPanel, ActionBar } from '@storybook/components';
import { styled } from '@storybook/theming';

const getUrl = input => {
  return typeof input === 'string' ? input : input.url;
};

const Iframe = styled.iframe({
  width: '100%',
  height: '100%',
  border: '0 none',
});
const Img = styled.img({
  width: '100%',
  height: '100%',
  border: '0 none',
  objectFit: 'contain',
});

const Asset = ({ url }) => {
  if (!url) {
    return null;
  }
  if (url.match(/\.(png|gif|jpeg|tiff|svg|anpg|webp)/)) {
    return <Img alt="" src={url} />;
  }

  return <Iframe title={url} src={url} />;
};

const Content = () => {
  const results = useParameter('assets', []); // story's parameter being retrieved here
  const [selected, setSelected] = useAddonState('my/design-addon', 0); // addon state being persisted here
  const { storyId } = useStorybookState(); // the story«s unique identifier being retrieved from Storybook global state

  if (results.length === 0) {
    return null;
  }

  if (results.length && !results[selected]) {
    setSelected(0);
    return null;
  }

  const url = getUrl(results[selected]).replace('{id}', storyId);

  return (
    <Fragment>
      <Asset url={url} />
      {results.length > 1 ? (
        <ActionBar
          actionItems={results.map((i, index) => ({
            title: typeof i === 'string' ? `asset #${index + 1}` : i.name,
            onClick: () => setSelected(index),
          }))}
        />
      ) : null}
    </Fragment>
  );
};

addons.register('my/design-addon', () => {
  addons.add('design-addon/panel', {
    title: 'assets',
    type: types.PANEL,
    render: ({ active, key }) => (
      <AddonPanel active={active} key={key}>
        <Content />
      </AddonPanel>
    ),
  });
});
```

</details>

## 次にやること

アドオンの作成で次にやることは、チームや、コミュニティが使えるようにパッケージ化して使えるようにすることでしょう。

しかし、それはこのチュートリアルの範囲を超えてしまいます。このチュートリアルでは、Stoybook API を使用して、カスタムアドオンを作成することで、開発のワークフローを向上できることを示しました。

さらにアドオンをカスタマイズしたい場合は以下を参照してください:

- [Storybook のツールバーにボタンを追加する](https://github.com/storybookjs/storybook/blob/next/addons/viewport/src/register.tsx#L8-L15)
- [チャネルを通して iframe と通信する](https://github.com/storybookjs/storybook/blob/next/dev-kits/addon-roundtrip/README.md)
- [コマンドと結果を送信する](https://github.com/storybookjs/storybook/tree/next/addons/events)
- [コンポーネントから出力された HTML/CSS を解析する](https://github.com/storybookjs/storybook/tree/next/addons/a11y)
- [コンポーネントをラップしてデータを再描画する](https://github.com/storybookjs/storybook/tree/next/addons/knobs)
- [DOM のイベントを発火させ、DOM を変更する](https://github.com/storybookjs/storybook/tree/next/addons/events)
- [テストを実行する](https://github.com/storybookjs/storybook/tree/next/addons/jest)

などなど！

<div class="aside">
新しいアドオンを作成して、そのアドオンをフィーチャーして欲しいと思ったら、気軽に Storybook のドキュメントにプルリクエストを送ってください。
</div>

### 開発キット

アドオンの開発を加速させるために、Storybook チームでは複数の開発キットを用意しています。

これらのパッケージはアドオンの開発を始めるための、スターターキットになっています。
今回作成したアドオンはそのうちの一つである `addon-parameters` 開発キットを元に作成しました。

開発キットは以下のリンクを参照してください:
https://github.com/storybookjs/storybook/tree/next/dev-kits

今後も開発キットを増やしていく予定です。

## チーム内でアドオンを共有する

ワークフローにアドオンを使用することで、時間を節約することができますが、技術者ではないチームメートやレビュアーがその恩恵を受けるのが難しい場合もあります。Storybook を動かせない環境の人もいるのです。それが Storybook をみんなが見られるようにオンラインで公開する理由です。次の章では、それをやりましょう！
