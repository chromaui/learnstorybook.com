---
title: 'UIコンポーネントを構築する'
tocTitle: '構築'
description: 'Storybookをセットアップしデザインシステムコンポーネントを構築してカタログ化する'
commit: 'a45c546'
---

第 3 章で、Storybook、最も普及しているコンポーネントエクスプローラ、で基礎的なデザインシステムの道具化を始めるためのセットアップを行います。当ガイドのゴールは専門的なチームがデザインシステムをどのように構築しているかを披露し、またコードの簡潔化、時間を節約する Storybook のアドオン、ディレクトリ構造のような洗練された具体例に焦点を当てます。

![Where Storybook fits in](/design-systems-for-developers/design-system-framework-storybook.jpg)

## コードフォーマットと清潔に保つための静的解析(linting)

デザインシステムは協働的です、そのため構文を統制し書式を標準化するツールが貢献の質を向上させるために備わっています。ツールでコードの一貫性を強制することは手作業でコードをきれいにするより労力をかけず、やりくり上手なデザインシステムの著者にとって有益です。

当チュートリアルで、私たちはエディタに[VSCode](https://code.visualstudio.com/)を使いますが、[Atom](https://atom.io/)、[Sublime](https://www.sublimetext.com/)、[IntelliJ](https://www.jetbrains.com/idea/)のような他のモダンエディタにも同様の方針を適用できます。

プロジェクトに Prettier を加えエディタを適切にセットアップする場合は、あまり考える必要のない一貫したフォーマッティングを手に入れるべきです：

```shell
yarn add --dev prettier
```

始めて Prettier を使うなら、エディタ向けにそれをセットアップする必要があるかもしれません。VSCode で、Prettier アドオンをインストールしてください：

![Prettier addon for VSCode](/design-systems-for-developers/prettier-addon.png)

まだ実施していなければセーブ時にフォーマット`editor.formatOnSave`を有効にしてください。Prettier をインストールすると、ファイルを保存する度にコードが自動フォーマットされるのが分かります。

## Storybook をインストール

Storybook は独立して UI コンポーネントを開発するための業界標準の[コンポーネントエクスプローラ](https://www.chromatic.com/blog/ui-component-explorers---your-new-favorite-tool)です。デザインシステムは UI コンポーネントに焦点を当てているため、Storybook はそのユースケースに理想のツールです。以下の特徴があります：

- 📕UI コンポーネントの一覧化
- 📄 ストーリーとしてコンポーネントのバリエーションを保存
- ⚡️ ホットモジュールリロードのような開発者体験のツール化
- 🛠 React を含む、多くのビューレイヤーをサポート

Storybook をインストールし実行します。

```shell
# Storybookをインストール
npx sb init

# 開発モードでStorybookを開始
yarn storybook
```

こちらの画面が見えるでしょう：

![Initial Storybook UI](/design-systems-for-developers/storybook-initial-6-0.png)

いいですね、コンポーネントエクスプローラをセットアップしました！

アプリケーションに Storybook をインストールするたびに、`stories`フォルダ内にいくつかのサンプルを追加します。興味があれば、それを探索してみてください。しかし私たちのデザインシステムには必要ないでしょうから、`stories`ディレクトリを削除しても問題ありません。

さてあなたの Storybook は次のようになっているでしょう(フォントスタイルがやや小さくなっているのに気づきます、例として、「Avatar：Initials」ストーリーを見てください)：

<video autoPlay muted playsInline loop>
  <source
    src="/design-systems-for-developers/storybook-initial-stories-without-styles-6-0.mp4"
    type="video/mp4"
  />
</video>

#### グローバルスタイルを追加する

私たちのデザインシステムにはコンポーネントを正しく描画するためにドキュメントに適用するグローバルスタイル(CSS リセット)が必要です。Styled Components のグローバルスタイルタグで簡単に追加できます。次のように`src/shared/global.js`ファイルを更新します：

```diff:title=src/shared/global.js
import { createGlobalStyle, css } from 'styled-components';

import { color, typography } from './styles';

+ export const fontUrl = 'https://fonts.googleapis.com/css?family=Nunito+Sans:400,700,800,900';

export const bodyStyles = css`
  /* Same as before */
`;

export const GlobalStyle = createGlobalStyle`
 body {
   ${bodyStyles}
 }`;
```

Storybook で`GlobalStyle`「コンポーネント」を使うために、[デコレーター](https://storybook.js.org/docs/react/writing-stories/decorators) (コンポーネントラッパー)を使うことができます。アプリでは、トップレベルのアプリレイアウトにそれを配置するでしょうが、Storybook では、プレビューコンフィグファイル[`.storybook/preview.js`](https://storybook.js.org/docs/react/configure/overview#configure-story-rendering)を使って全てのストーリーをラップします。

```diff:title=.storybook/preview.js
+ import React from 'react';

+ import { GlobalStyle } from '../src/shared/global';

/*
 * 全てのストーリーにスタイルを適用するグローバルデコレーター
 * 詳細はこちらを参照:
 * https://storybook.js.org/docs/react/writing-stories/decorators#global-decorators
 */
+ export const decorators = [
+   Story => (
+     <>
+       <GlobalStyle />
+       <Story />
+     </>
+   ),
+ ];

/*
 * グローバルパラメータについてはこちらを参照:
 * https://storybook.js.org/docs/react/writing-stories/parameters#global-parameters
 */
export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
};
```

デコレーターはどんなストーリーを選択しても`GlobalStyle`の描画を保証します。

<div class="aside">💡 デコレーターの<code><></code>は打ち間違えではありません--これは<a href="https://reactjs.org/docs/fragments.html">React Fragment</a>というもので不必要な別のHTMLタグのアウトプットを避けるためここで使用しています。</div>

#### フォントタグを追加する

私たちのデザインシステムはまたアプリにロードした Nunito Sans フォントに依存しています。その実現はアプリのフレームワーク(それについて[ここで](https://github.com/storybookjs/design-system#font-loading)読めます)によりますが、Storybook では、最も簡単な方法はファイル、 [`.storybook/preview-head.html`](https://storybook.js.org/docs/react/configure/story-rendering#adding-to-head)を作成し、ページの`<head>`に直接`<link>`タグを追加することです：

```html:title=.storybook/preview-head.html
<link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Nunito+Sans:400,700,800,900" />
```

Storybook では次のように見えるはずです。グローバルフォントスタイルを追加しましたので「T」が sans-serif になっているのが分かります。

![Storybook with global styles loaded](/design-systems-for-developers/storybook-global-styles-6-0.png)

## アドオンで Storybook を強化する

Storybook は大規模コミュニティにより作られた強力な[アドオンエコシステム](https://storybook.js.org/addons)を含んでいます。実践的な開発者にとって、カスタムツールを私たち自身で作成(それは時間がかかるでしょう)するよりエコシステムを使ってワークフローを組み立てる方が簡単です。

<h4 id="storybook-addon-actions">双方向性(インタラクティビティ)を検証するActionsアドオン</h4>

[アクションアドオン](https://storybook.js.org/docs/react/essentials/actions)はボタンやリンクのようなインタラクティブな要素でアクションが振る舞われると Storybook で UI フィードバックを提供してくれます。アクションはデフォルトで Storybook にインストールされており、コンポーネントにコールバックプロパティとして「アクション」を渡すだけで使えます。

私たちのボタン要素で使ってみましょう、それはクリックに反応するラッパーコンポーネントを任意で取ります：

```js:title=src/Button.stories.js
import React from 'react';

import styled from 'styled-components';

// ユーザーがボタンをクリックすると、「action()」をトリガーし、
// 最終的にStorybookのアドオンパネル内に表示されます。
function ButtonWrapper(props) {
  return <CustomButton {...props} />;
}

export const buttonWrapper = (args) => (
  return <CustomButton {...props}/>;
// … etc ..
)
```

<video autoPlay muted playsInline loop>
  <source
    src="/design-systems-for-developers/storybook-addon-actions-6-0.mp4"
    type="video/mp4"
  />
</video>

<h4 id="storybook-addon-controls">コンポーネントをストレステストするためのControls</h4>

インストールしたばかりの Storybook には[コントロールアドオン](https://storybook.js.org/docs/react/essentials/controls)がすでにインストール不要で設定されています。

アドオンは Storybook の UI でコンポーネントのインプット(プロパティ)を動的にインタラクションできるようにします。あなたは[arguments](https://storybook.js.org/docs/react/writing-stories/args)(または短縮形で args)を介してコンポーネントに複数の値を提供し UI に適用できます。argument の値を適用してデザインシステムの作成者がストレステストコンポーネントのインプット(プロパティ)を行う手助けをします。またデザインシステムの利用者が各インプット(プロパティ)がコンポーネントにどう影響するのか組み込む前に理解するのを試す機能を提供します。

`src/Avatar.stories.js`にある`Avatar`コンポーネントに新しいストーリーを加えるとどうなるか見てみましょう：

```js:title=src/Avatar.stories.js
import React from 'react';

import { Avatar } from './Avatar';

export default {
  title: 'Design System/Avatar',
  component: Avatar,
  /*
   * StorybookのargTypesについての詳細はこちら:
   * https://storybook.js.org/docs/react/api/argtypes
   */
  argTypes: {
    size: {
      control: {
        type: 'select',
      },
      options: ['tiny', 'small', 'medium', 'large'],
    },
  },
};

// 他のAvatarストーリー

/*
 * Controlsを使った新しいストーリー
 * Storybookのtemplatesについての詳細はこちら:
 * https://storybook.js.org/docs/react/writing-stories/introduction#using-args
 */
const Template = args => <Avatar {...args} />;

export const Controls = Template.bind({});
/*
 * argsの詳細はこちら:
 * https://storybook.js.org/docs/react/writing-stories/args
 */
Controls.args = {
  loading: false,
  size: 'tiny',
  username: 'Dominic Nguyen',
  src: 'https://avatars2.githubusercontent.com/u/263385',
};
```

アドオンパネルの Controls タブを見てください。Controls はプロパティを適用するグラフィカル UI を自動生成します。例えば、「size」セレクト要素が提供されている Avatar のサイズ`tiny`、`small`、`medium`、`large`を通しで確認できます。残りのコンポーネントプロパティ(“loading”、“username”、“src”)も同様に、コンポーネントのストレステストにユーザフレンドリーな方法を提供してくれます。

<video autoPlay muted playsInline loop>
  <source
    src="/design-systems-for-developers/storybook-addon-controls-6-0.mp4"
    type="video/mp4"
  />
</video>

かと言って、Controls はストーリーを置き換えません。想定される状態を陳列してコンポーネントとストーリーのエッジケースを探すことに優れています。

<h4>addon-interactionsを使った対話型のストーリー</h4>

私たちは[Controls](#storybook-addon-controls)のアドオンを使ってどのように Storybook のアドオンがエッジケースを探す手助けをし[Actions](#storybook-addon-actions)アドオンを使ってコンポーネントがインタラクションした時にどのように振る舞うのかを見てきました。それでも、ストーリーを追加した各バリエーションで、手動で確認してデザインシステムが壊れないかを見なければなりません。[`@storybook/addon-interactions`](https://storybook.js.org/addons/@storybook/addon-interactions/)アドオンを追加してどのようにこれを自動化するか見てみましょう、それから`play`ファンクションを使いコンポーネントとインタラクションします：

次のコマンドを実行してアドオンと依存関係をインストールします：

```shell
yarn add --dev @storybook/addon-interactions @storybook/testing-library
```

次に、Storybook の設定ファイル(この場合は、`.storybook/main.js`)に登録します：

```diff:title=./storybook/main.js
module.exports = {
  stories: [
     '../src/**/*.stories.mdx',
     '../src/**/*.stories.@(js|jsx|ts|tsx)',
  ],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/preset-create-react-app',
+   '@storybook/addon-interactions',
  ],
  framework: "@storybook/react",
  staticDirs: ["../public"],
};
```

では、`Button`に新しいストーリーを追加してどう動くか見てみましょう：

```diff:title=src/Button.stories.js
import React from 'react';
import styled from 'styled-components';
+ import { userEvent, within } from '@storybook/testing-library';
import { Button } from './Button';
import { StoryLinkWrapper } from './StoryLinkWrapper';
export default {
  title: 'Design System/Button',
  component: Button,
};

// 他のButtonストーリー

+ // playファンクションを使った新しいストーリー
+ export const WithInteractions = () => (
+   <Button
+     ButtonWrapper={StoryLinkWrapper}
+     appearance="primary"
+     href="http://storybook.js.org">
+       Button
+    </Button>
+ );
+ WithInteractions.play = async ({ canvasElement }) => {
+   // Assigns canvas to the component root element
+   const canvas = within(canvasElement);
+   await userEvent.click(canvas.getByRole("link"));
+ };

+ WithInteractions.storyName = "button with interactions";
```

<div class="aside">
 💡 Playファンクションは1度ストーリーを描画する小さなスニペットで、<code>addon-interactions</code>により付加され、人が操作することなくそれ以外のやり方では不可能なシナリオをテストできます。詳しくは<a href="https://storybook.js.org/docs/react/writing-stories/play-function">公式ドキュメント</a>を参照ください。
</div>

新しいストーリーを選択していかにコンポーネントがデザインシステムを人の操作に頼らないより強じんでバグの無い一歩先の一貫性あるものとして動くのかを確認しましょう。

<video autoPlay muted playsInline loop>
  <source
    src="/design-systems-for-developers/storybook-button-interactive-stories.mp4"
    type="video/mp4"
  />
</video>
後の章でアクセシビリティとドキュメントのアドオンについて確認します。

> “Storybook はチームがビジネスロジックと複雑なシステムにつまづくことなく UI コンポーネントをデザインし、構築し、組織化(それもフルスクリーンで！)できる強力なフロントエンド作業環境だ。” – Brad Frost、Atomic Design の著者

## メンテナンス自動化の方法を学ぶ

さあこれで私たちのデザインシステムコンポーネントが Storybook に入りました、業界標準のデザインシステムを作るもう一歩先のステップを踏んだのです。今がリモートリポジトリに成果をコミットする素晴らしい瞬間です。そしてメンテナンスの進行を簡素化する自動化ツールについて考えることができます。

デザインシステムも、全てのソフトウェアのように、発展するものです。課題はデザインシステムが成長にしたがい UI コンポーネントが期待通りルック＆フィールの維持を保証することです。

第 4 章では、継続的改善と協働のためデザインシステムをオンラインで自動配信する方法を学びます。
