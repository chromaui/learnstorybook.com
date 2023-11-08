---
title: '組織を横断してUIを配布する'
tocTitle: '配布'
description: 'デザインシステムをパッケージングし他のアプリへインポートする方法を学ぶ'
commit: 'dabd221'
---

アーキテクチャの観点から、デザインシステムはさらに別のフロントエンドの依存関係です。moment や lodash のような人気の依存関係とまったく違いがありません。UI コンポーネントはコードであり、コードの再利用を基盤とした技術に頼ることができます。

本章は UI コンポーネントのパッケージングから他のアプリへのインポートまでデザインシステムの配布をデモンストレーションします。またバージョニングとリリースを合理化する時間節約のテクニックも明らかにします。

![Propagate components to sites](/design-systems-for-developers/design-system-propagation.png)

## デザインシステムをパッケージ化する

組織はさまざまなアプリにまたがり数千もの UI コンポーネントを持っています。以前、私たちはデザインシステムに最も共通するコンポーネントを抽出しました。今度はそれらのコンポーネントをアプリへ再導入する必要があります。

私たちのデザインシステムは Javascript のパッケージマネージャである npm を使って配布、バージョニング、依存関係をコントロールします。

デザインシステムのパッケージングには多くの有効な手段があります。Lonely Planet、Auth0、Salesforce、GitHub、Microsoft のデザインシステムからアプローチの多様さがうかがえます。各コンポーネントを分割したパッケージとして配布する人がいれば、全てのコンポーネントを一つのパッケージで送り出す人もいます。

初期のデザインシステムにとって、最も端的な手段はカプセル化した単一バージョンのパッケージを発行することです:

- 🏗 共通 UI コンポーネント
- 🎨 デザイントークン (別称、スタイル変数)
- 📕 ドキュメンテーション

![Package a design system](/design-systems-for-developers/design-system-package.jpg)

## デザインシステムをエクスポートするために準備する

デザインシステムの起点として [Create React App](https://github.com/facebook/create-react-app) (CRA) を使ったため、まだ初期アプリの形跡が残っています。今からそれをきれいにしましょう。

まず、README.md の内容をより説明的に更新します。

```markdown:title=README.md
# Storybook design system tutorial

The Storybook design system tutorial is a subset of the full [Storybook design system](https://github.com/storybookjs/design-system/), created as a learning resource for those interested in learning how to write and publish a design system using best in practice techniques.

Learn more in [Storybook tutorials](https://storybook.js.org/tutorials/).
```

それから、`src/index.js` ファイルを作成してデザインシステム向けに共通のエントリーポイントを作成しましょう。このファイルから、すべてのデザイントークンとコンポーネントをエクスポートします。

```js:title=src/index.js
import * as styles from './shared/styles';
import * as global from './shared/global';
import * as animation from './shared/animation';
import * as icons from './shared/icons';

export { styles, global, animation, icons };

export * from './Avatar';
export * from './Badge';
export * from './Button';
export * from './Icon';
export * from './Link';
```

いくつか追加の開発パッケージが必要で、ビルドプロセスの補助に [`@babel/cli`](https://www.npmjs.com/package/@babel/cli) と [`cross-env`](https://www.npmjs.com/package/cross-env) を使います。

コマンドラインで、次のコマンドを実行します:

```shell
yarn add --dev @babel/cli cross-env
```

パッケージをインストールしたら、ビルドプロセスを実装する必要があります。

ありがたいことに、Create React App (CRA) はすでにビルドプロセスを処理しています。既存の `build` スクリプトを使って `dist` ディレクトリへデザインシステムをビルドします:

```json:title=package.json
{
  "scripts": {
    "build": "cross-env BABEL_ENV=production babel src -d dist"
  }
}
```

ビルドプロセスの実装にともない、微調整が必要です。`package.json` 内に `babel` キーを記載し次のように更新してください:

```json:title=package.json
{
  "babel": {
    "presets": [
      [
        "react-app",
        {
          "absoluteRuntime": false
        }
      ]
    ]
  }
}
```

これで `yarn build` を実行して `dist` ディレクトリへコードをビルドできます — `.gitignore` にこのディレクトリを加えるべきです、そうして誤ってコミットしないようにします:

```
// ..
dist
```

#### 発行のためパッケージメタデータを追加する

パッケージの利用者が必要な情報を全て確認するために `package.json` に変更が必要です。最も簡単な方法は単純に `yarn init` — 発行のためにパッケージを初期化するコマンドを実行します:

```shell
# Initializes a scoped package
yarn init --scope=@your-npm-username

yarn init v1.22.5
question name (learnstorybook-design-system): @your-npm-username/learnstorybook-design-system
question version (0.1.0):
question description (Learn Storybook design system):Storybook design systems tutorial
question entry point (dist/index.js):
question repository url (https://github.com/your-username/learnstorybook-design-system.git):
question author (your-npm-username <your-email-address@email-provider.com>):
question license (MIT):
question private: no
```

コマンドはひと通り質問をします。いくつかは回答があらかじめ埋められており、その他は考える必要があります。npm のパッケージに固有の名前を選ぶ必要があります (`learnstorybook-design-system` は使用できないでしょう — `@your-npm-username/learnstorybook-design-system` が良い選択です) 。

まとめると、質問の回答を受けて新しい値で `package.json` が更新されます:

```json:title=package.json
{
  "name": "@your-npm-username/learnstorybook-design-system",
  "description": "Storybook design systems tutorial",
  "version": "0.1.0",
  "license": "MIT",
  "main": "dist/index.js",
  "repository": "https://github.com/your-username/learnstorybook-design-system.git"
  // ...
}
```

<div class="aside">
💡 説明を分かりやすくするため<a href="https://docs.npmjs.com/creating-and-publishing-scoped-public-packages">パッケージスコープ</a>には触れませんでした。スコープを利用すると別のユーザーや組織により作成された同じ名前のパッケージと衝突せずにパッケージを作成できます。
</div>

さあパッケージを準備しました。これで初めて npm へパッケージを発行できます！

## Auto を使ったリリース管理

npm へリリースを発行するため、私たちはまた変更を記述した変更履歴の更新、意味のあるバージョン番号の設定、リポジトリのコミットのバージョン番号とリンクさせる git タグの作成といったプロセスを使います。これら全てを補助するために、[Auto](https://github.com/intuit/auto) という特定の用途にデザインされたオープンソースツールを使います。

Auto をインストールしましょう:

```shell
yarn add --dev auto
```

Auto はリリース管理まわりの各種共通タスクが使えるコマンドラインツールです。[ドキュメンテーションサイト](https://intuit.github.io/auto/)で Auto の詳細を学ぶことができます。

#### GitHub と npm のトークンを取得する

次のいくつかのステップで、Auto は GitHub 、npm とやり取りします。正しく動作させるために、パーソナルアクセストークンが必要です。GitHub は[このページ](https://github.com/settings/tokens)で発行されるトークンのうちひとつを取得することができます。トークンには `repo` スコープが必要です。

npm は、こちらの URL でトークンを作成することができます: https://www.npmjs.com/settings/&lt;your-username&gt;/tokens.

“Read and Publish” パーミッションが必要になるでしょう。

プロジェクトの `.env` ファイルにトークンを追加しましょう:

```
GH_TOKEN=<value you just got from GitHub>
NPM_TOKEN=<value you just got from npm>
```

`.gitignore` に上記ファイルを追加することで、全てのユーザーに見えるオープンソースリポジトリへこの値をうっかりプッシュしないことを確実にします！これはきわめて重要です。他のメンテナーがローカルのパッケージを発行する必要がある場合 (後ほどプルリクエストがデフォルトブランチへマージされる時に自動的な発行を設定します)、このプロセスにしたがい彼ら自身の `.env` ファイルに設定するべきです:

```
dist
.env
```

#### GitHub にラベルを作成する

Auto で最初に必要なのは GitHub にラベルのセットを作成することです。 将来これらのラベルをパッケージの変更のさい (次の章を見てください) に使い、`auto` が実用的にパッケージのバージョンを更新し変更履歴とリリースノートを作らせることができます。

```bash
yarn auto create-labels
```

GitHub をチェックすると、`auto` が使わせたいラベルのセットが確認できます:

![Set of labels created on GitHub by auto](/design-systems-for-developers/github-auto-labels.png)

マージする前に次のラベルのうちひとつを今後のプルリクエストすべてにタグ付けすべきです: `major`、`minor`、`patch`、`skip-release`、 `prerelease`、`internal`、`documentation`

#### 手動で Auto を用いて最初のリリースを発行する

この先、`auto` スクリプトを介して新しいバージョン番号を計算しますが、最初のリリースに向け、何をしているのか理解するために手動でコマンドを実行しましょう。最初の変更履歴のエントリーを生成します:

```shell
yarn auto changelog
```

上記コマンドは現時点で作成した各コミットの長い変更履歴を生成します (それとデフォルトブランチにプッシュしてきた警告も生成します。これは近いうちに止めるべきでしょう)。

自動生成された変更履歴があるのは便利ですが、見落としがないように、手動で編集してユーザーに最も役に立つ方法でメッセージを作成するのは良い考えです。この場合、ユーザーは開発過程のコミットをすべて知る必要はありません。最初の v0.1.0 バージョンのための良い簡潔なメッセージを作成しましょう (ただし変更は保持します):

```shell
git reset HEAD^
```

それから変更履歴を更新してコミットしましょう:

```
# v0.1.0 (Tue Mar 09 2021)

- Created first version of the design system, with `Avatar`, `Badge`, `Button`, `Icon` and `Link` components.

#### Authors: 1

- [your-username](https://github.com/your-username)
```

変更履歴を git へ追加しましょう。`[skip ci]` を使って CI プラットフォームにこれらのコミットを無視していることに注意してください、でなければビルドと発行のループになってしまいます。

```shell
git add CHANGELOG.md
git commit -m "Changelog for v0.1.0 [skip ci]"
```

これで発行できます:

```shell
npm --allow-same-version version 0.1.0 -m "Bump version to: %s [skip ci]"
npm publish --access=public
```

<div class="aside">
💡 パッケージの発行に <a href="https://classic.yarnpkg.com/en/docs/cli/">yarn</a> を使っている場合は、それに応じて適切なコマンドを調整することを忘れないでください。 
</div>

そして Auto を使って GitHub 上にリリースを作成します:

```shell
git push --follow-tags origin main
yarn auto release
```

やりました！無事にパッケージを npm へ発行し GitHub にリリースを作成しました (幸運にも！)。

![Package published on npm](/design-systems-for-developers/npm-published-package.png)

![Release published to GitHub](/design-systems-for-developers/github-published-release.png)

(なお、最初のリリースでは `auto` がリリースノートを自動生成しましたが、最初のバージョンで意味が分かるよう編集しました)。

#### Auto を利用するためにスクリプトを設定する

今後パッケージを発行したい時に同じプロセスを踏むために Auto を設定しましょう。次のスクリプトを `package.json` に追加します:

```json:title=package.json
{
  "scripts": {
    "release": "auto shipit --base-branch=main"
  }
}
```

これで、`yarn release` を実行すると、上で実行したすべてのステップ (自動生成された変更履歴の使用を除く) を自動で実行することになります。デフォルトブランチの全てのコミットが発行されます。

おめでとうございます！デザインシステムのリリースを手動で発行するための基盤をセットアップしました。継続的インテグレーションでリリースを自動化する方法を学びましょう。

## 自動的にリリースを発行する

継続的インテグレーションには GitHub アクションを使います。しかし進める前に、先ほどの GitHub と NPM トークンを安全に格納して Actions がアクセスできるようにする必要があります。

#### GitHub Secrets にトークンを追加する

GitHub Secrets はリポジトリに機密情報の格納を許可します。ブラウザのウィンドウで、あなたの GitHub リポジトリを開きます。

⚙️ 設定タブをクリックしてサイドバーのシークレットリンクをクリックします。以下の画面が表示されます:

![Empty GitHub secrets page](/design-systems-for-developers/github-empty-secrets-page.png)

**New secret** ボタンを押してください。名前に `NPM_TOKEN` を使い本章で先ほどの npm から取得したトークンを貼り付けます。

![Filled GitHub secrets form](/design-systems-for-developers/github-secrets-form-filled.png)

リポジトリに npm シークレットを追加すると、`secrets.NPM_TOKEN` でアクセスできるようになります。あなたの GitHub トークンに別のシークレットをセットアップする必要はありません。すべての GitHub ユーザーはアカウントに紐づく `secrets.GITHUB_TOKEN` を自動的に取得します。

#### GitHub アクションを使ってリリースを自動化する

プルリクエストをするたびに、デザインシステムを自動的に発行したいものです。先に<a href="https://storybook.js.org/tutorials/design-systems-for-developers/react/en/review/#publish-storybook">Storybook の発行</a>で使った同じフォルダに `push.yml` という新しいファイルを作成し次の内容を追加します:

```yml:title=.github/workflows/push.yml
# Name of our action
name: Release

# The event that will trigger the action
on:
  push:
    branches: [main]

# what the action will do
jobs:
  release:
    # The operating system it will run on
    runs-on: ubuntu-latest
    # This check needs to be in place to prevent a publish loop with auto and github actions
    if: "!contains(github.event.head_commit.message, 'ci skip') && !contains(github.event.head_commit.message, 'skip ci')"
    # The list of steps that the action will go through
    steps:
      - uses: actions/checkout@v2
      - name: Prepare repository
        run: git fetch --unshallow --tags
      - name: Use Node.js 12.x
        uses: actions/setup-node@v1
        with:
          node-version: 12.x
      - name: Cache node modules
        uses: actions/cache@v1
        with:
          path: node_modules
          key: yarn-deps-${{ hashFiles('yarn.lock') }}
          restore-keys: |
            yarn-deps-${{ hashFiles('yarn.lock') }}
      - name: Create Release
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          #👇 npm token, see https://storybook.js.org/tutorials/design-systems-for-developers/react/en/distribute/ to obtain it
          NPM_TOKEN: ${{ secrets.NPM_TOKEN }}
        run: |
          yarn install --frozen-lockfile
          yarn build
          yarn release
```

保存してリモートリポジトリへ変更をコミットします。

上手くいきました！これでデフォルトブランチへプルリクエストをマージするたび、自動的に新しいバージョンを発行し、追加したラベルによる適切なバージョン番号を加算します。

<div class="aside">💡 成長するデザインシステムに役立つ多くの機能とインテグレーションのすべてをカバーしたわけではありません。<a href="https://github.com/intuit/auto">こちらの</a>ドキュメントを参照してください。</div>

![Import the design system](/design-systems-for-developers/design-system-import.png)

## アプリにデザインシステムをインポートする

これでデザインシステムがオンラインになったので、依存関係をインストールし UI コンポーネントを利用するのは簡単なことです。

#### サンプルアプリを取得する

このチュートリアルの最初で、React と Styled Components を含む人気のフロントエンドスタックを標準化しました。それはサンプルアプリもまたデザインシステムのすべての利点を得るために React と Styled Components を使う必要があることになります。

<div class="aside">💡 Svelte や Webコンポーネントのような他の有望な手段がフレームワークに依存しない UI コンポーネントの出荷を可能にするかもしれません。しかし、それらは比較的新しく、文書化されておらず、また広く採用されていないため、まだこのガイドには含まれていません。</div>

サンプルアプリはコンポーネントから始まりページで終わる UI を下層から開発するためのアプリ開発手法である[コンポーネント駆動開発](https://www.componentdriven.org/)を促進するために Storybook を使います。デモの中で 2 つの Storybook を並行して実行します。ひとつはサンプルアプリでもう一つはデザインシステムです。

次のコマンドを実行してサンプルアプリをセットアップします:

```shell
# Clones the files locally
npx degit chromaui/learnstorybook-design-system-example-app example-app

cd example-app

# Install the dependencies
yarn install

## Start Storybook
yarn storybook
```

アプリが使うシンプルなコンポーネントのストーリーが表示され Storybook が実行されているのが確認できるはずです:

![Initial storybook for example app](/design-systems-for-developers/example-app-starting-storybook-6-0.png)

<h4>デザインシステムの統合</h4>

私たちのデザインシステムの Storybook を発行しました。それをサンプルアプリに追加しましょう。サンプルアプリの `.storybook/main.js` に次の内容を更新すればそれが可能になります:

```diff:title=.storybook/main.js
// .storybook/main.js

module.exports = {
  stories: ['../src/**/*.stories.@(js|jsx|ts|tsx)'],
+ refs: {
+   'design-system': {
+     title: 'My design system',
+     //👇 The url provided by Chromatic when it was deployed
+     url: 'https://your-published-url.chromatic.com',
+   },
+ },
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/preset-create-react-app',
  ],
  framework: '@storybook/react',
  staticDirs: ['../public'],
};
```

<video autoPlay muted playsInline loop>
  <source
    src="/design-systems-for-developers/storybook-composition-6-0.mp4"
    type="video/mp4"
  />
</video>

<div class="aside">
💡 <code>refs</code>キーを<code>.storybook/main.js</code>に追加して、複数のStorybookをひとつに<a href="https://storybook.js.org/docs/react/workflows/storybook-composition">構成</a>できます。これは複数のリポジトリに分散していたり、異なる技術スタックを使ったりするような大きなプロジェクトで作業する場合に便利です。
</div>

これでサンプルアプリを開発中にデザインシステムのコンポーネントとドキュメントを閲覧することができます。機能開発のさいデザインシステムを公開することで開発者が独自に開発して時間を浪費することなく既存のコンポーネントを再利用する可能性を高めます。

必要なものが揃いました、デザインシステムを追加し使う時です。ターミナルで次のコマンドを実行します:

```shell
yarn add @your-npm-username/learnstorybook-design-system
```

デザインシステムで定義した同じグローバルスタイルを使う必要があります。そのため[`.storybook/preview.js`](https://storybook.js.org/docs/react/configure/overview#configure-story-rendering)コンフィグファイルを更新し [global decorator](https://storybook.js.org/docs/react/writing-stories/decorators#global-decorators) を追加する必要があります。

```js:title=.storybook/preview.js
import React from 'react';

// The styles imported from the design system.
import { global as designSystemGlobal } from '@your-npm-username/learnstorybook-design-system';

const { GlobalStyle } = designSystemGlobal;

/*
 * Adds a global decorator to include the imported styles from the design system.
 * More on Storybook decorators at:
 * https://storybook.js.org/docs/react/writing-stories/decorators#global-decorators
 */
export const decorators = [
  Story => (
    <>
      <GlobalStyle />
      <Story />
    </>
  ),
];
/*
 * More on Storybook parameters at:
 * https://storybook.js.org/docs/react/writing-stories/parameters#global-parameters
 */
export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
};
```

![Example app storybook with design system stories](/design-systems-for-developers/example-app-storybook-with-design-system-stories-6-0.png)

サンプルアプリの `UserItem` コンポーネントにデザインシステムの `Avatar` コンポーネントを使います。`UserItem` は名前とプロフィール写真を含むユーザーについての情報を描画します。

エディターで、`src/components/UserItem.js` にある `UserItem` を開きます。また、Storybook の `UserItem` を選択して、これから行うコードの変更をホットモジュールリロードで即座に確認することができます。

Avatar コンポーネントをインポートします。

```js:title=src/components/UserItem.js
import { Avatar } from '@your-npm-username/learnstorybook-design-system';
```

ユーザー名のそばに Avatar を描画したいと思います。

```diff:title=src/components/UserItem.js
import React from 'react';

import styled from 'styled-components';

+ import { Avatar } from '@your-npm-username/learnstorybook-design-system';

const Container = styled.div`
  background: #eee;
  margin-bottom: 1em;
  padding: 0.5em;
`;

- const Avatar = styled.img`
-   border: 1px solid black;
-   width: 30px;
-   height: 30px;
-   margin-right: 0.5em;
- `;

const Name = styled.span`
  color: #333;
  font-size: 16px;
`;

export default ({ user: { name, avatarUrl } }) => (
  <Container>
+   <Avatar username={name} src={avatarUrl} />
    <Name>{name}</Name>
  </Container>
);
```

保存すると、Storybook の `UserItem` コンポーネントが更新され新しいアバターコンポーネントが表示されます。`UserItem` は `UserList` コンポーネントの一部なので、`UserList` でも `Avatar` が確認できます。

![Example app using the Design System](/design-systems-for-developers/example-app-storybook-using-design-system-6-0.png)

ほらありましたね！サンプルアプリにデザインシステムのコンポーネントをインポートしました。デザインシステムでアバターコンポーネントに対して更新を発行すればいつでも、その変更もまたパッケージの更新時にサンプルアプリに反映されます。

![Distribute design systems](/design-systems-for-developers/design-system-propagation-storybook.png)

## デザインシステムのワークフローをマスターする

デザインシステムのワークフローは Storybook で UI コンポーネントの開発をすることから始まりクライアントアプリへ配布することで終わります。もっともそれがすべてではありません。デザインシステムは変わり続けるプロダクト要件を満たすために継続して進化しなければなりません。私たちの仕事はまだ始まったばかりなのです。

第 8 章は当ガイドで作成したエンド・ツー・エンドのデザインシステムを説明します。UI の変化がデザインシステムからどのように波及するのか見てゆきます。
