---
title: '組織を横断してUIを配布する'
tocTitle: '配布'
description: '他のアプリへデザインシステムをパッケージングしインポートする方法を学ぶ'
commit: 'bba7cb0'
---

アーキテクチャの観点から、デザインシステムはれっきとした別なフロントエンドの依存関係です。moment や lodash のような人気の依存関係と何ら違いはありません。UI コンポーネントはコードであり、コードの再利用に築かれた技術に頼ることができます。

本章は UI コンポーネントのパッケージングから他のアプリへのインポートまでデザインシステムの配布をデモンストレーションします。またバージョン管理とリリースを流れ化する時間節約のテクニックも明らかにします。

![Propagate components to sites](/design-systems-for-developers/design-system-propagation.png)

## デザインシステムをパッケージ化する

組織は様々なアプリに渡り数千もの UI コンポーネントを持っています。以前、私たちはデザインシステムに最も共通するコンポーネントを抽出しました、今度はそれらのコンポーネントアプリへ再導入する必要があります。

私たちのデザインシステムは Javascript のパッケージマネージャである npm を使って配布、バージョン管理、依存関係管理を制御しています。

デザインシステムのパッケージングには多くの有効な方法があります。Gander at design systems from Lonely Planet、Auth0、Salesforce、GitHub、Microsoft にアプローチの多様さを見ます。一方の皆さんは分割したパッケージとして各コンポーネントを配布し、他方では一つのパッケージに全てのコンポーネントを送り出しています。

生まれたてのデザインシステムにとって、最も直接的な方法は次をカプセル化する単一バージョンのパッケージを発行することです:

- 🏗 共通 UI コンポーネント
- 🎨 デザイントークン (スタイル変数、として知られる)
- 📕 ドキュメンテーション

![Package a design system](/design-systems-for-developers/design-system-package.jpg)

## エクスポートのためデザインシステムを準備する

デザインシステムの出発点に [Create React App](https://github.com/facebook/create-react-app) (CRA) を使ったため、まだ初期アプリの跡が残っています。これからそれらをきれいにしましょう。

最初に、より説明的に README.md を更新します。

```markdown:title=README.md
# Storybook design system tutorial

The Storybook design system tutorial is a subset of the full [Storybook design system](https://github.com/storybookjs/design-system/), created as a learning resource for those interested in learning how to write and publish a design system using best in practice techniques.

Learn more in [Storybook tutorials](https://storybook.js.org/tutorials/).
```

それから、`src/index.js`ファイルを作成してデザインシステムのために共通のエントリーポイントを作成しましょう。このファイルから、すべてのデザイントークンとコンポーネントをエクスポートします。

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

いくつか追加の開発パッケージが必要で、ビルドプロセスの手助けに [`@babel/cli`](https://www.npmjs.com/package/@babel/cli) と [`cross-env`](https://www.npmjs.com/package/cross-env) を使います。

コマンドラインで、次のコマンドを発行します:

```shell
yarn add --dev @babel/cli cross-env
```

パッケージをインストールしたら、ビルドプロセスを実装する必要があります。

ありがたいことに、Create React App (CRA) はすでにこちらを引き受けています。すでにある`build`スクリプトを使って`dist`ディレクトリへデザインシステムをビルドします:

```json:title=package.json
{
  "scripts": {
    "build": "cross-env BABEL_ENV=production babel src -d dist"
  }
}
```

ビルドプロセスが実装されました。微調整が必要です。`package.json`内に`babel`キーを配置し次のように更新してください:

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

これで`yarn build`を実行して`dist`ディレクトリへコードをビルドできます -- `.gitignore`にこのディレクトリを加えるべきでしょう、そうして間違えてコミットしないようにします:

```
// ..
dist
```

#### 発行のためパッケージメタデータを追加する

パッケージの使用者が全ての必要な情報を確認するために`package.json`に変更が必要です。最も簡単な方法は単純に`yarn init`--発行のためにパッケージを初期化するコマンド、を実行します:

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

コマンドは上記一覧の質問をたずねます、いくつかは前もって埋められており、他は考える必要があります。npm のパッケージに固有の名前 (`learnstorybook-design-system`は使用できないでしょう --`@your-npm-username/learnstorybook-design-system`が良い選択です) 。

概して、質問の結果新しい値で`package.json`を更新します:

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
💡 簡潔さを目的に<a href="https://docs.npmjs.com/creating-and-publishing-scoped-public-packages">パッケージスコープ</a>には触れませんでした。スコープの利用は衝突することなく別のユーザーや組織による同じ名前のパッケージの作成を可能にします。
</div>

さあパッケージを準備しました、これで初めて npm へ発行できます！

## Auto を使ったリリース管理

npm へリリースを発行するため、私たちはまた変更を記述したチェンジログの更新、意味のあるバージョン番号の設定、リポジトリのコミットにバージョン番号をリンクさせる git タグの作成プロセスを使います。これら全てを手助けするために、[Auto](https://github.com/intuit/auto)という特定の用途にデザインされたオープンソースツールを使います。

Auto をインストールしましょう:

```shell
yarn add --dev auto
```

Auto はリリース管理周りの各種共通タスクが使えるコマンドラインツールです。[ドキュメンテーションサイト](https://intuit.github.io/auto/)で Auto の詳細を学ぶことができます。

#### GitHub と npm のトークンを取得する

次の幾つかのステップで、Auto は GitHub と npm と対話します。適切に動作させるために、個人のアクセストークンが必要です。GitHub は[このページ](https://github.com/settings/tokens)で取得することができます。トークンは`repo`スコープが必要です。

npm は、こちらの URL でトークンを作成することができます: https://www.npmjs.com/settings/&lt;your-username&gt;/tokens.

“Read and Publish”パーミッションが必要になるでしょう。

プロジェクトの`.env`ファイルにトークンを追加しましょう:

```
GH_TOKEN=<value you just got from GitHub>
NPM_TOKEN=<value you just got from npm>
```

`.gitignore`に上記ファイルを追加することで、全てのユーザーに見えるオープンソースリポジトリへこの値を間違えてプッシュしないことを確実にします！これはきわめて重要です。他のメンテナーがローカルのパッケージを発行する必要がある場合(後ほどプルリクエストがデフォルトブランチへマージされる時に自動的な発行を設定します)、このプロセスにしたがい彼ら自身の`.env`ファイルに設定するべきです:

```
dist
.env
```

#### GitHub にラベルを作成する

Auto で最初に必要なのは GitHub にラベルのセットを作成することです。 将来これらのラベルをパッケージの変更の際(次の章を見てください)に使い、そして`auto`が実用的にパッケージのバージョンを更新しチェンジログとリリースノートを作らせることができます。

```bash
yarn auto create-labels
```

GitHub を確認すると、`auto`が使わせたいラベルのセットが見えます:

![Set of labels created on GitHub by auto](/design-systems-for-developers/github-auto-labels.png)

マージする前に次のラベルのうちひとつを将来の PR(プルリクエスト)全てにタグ付けすべきです:`major`、`minor`、`patch`、`skip-release`、 `prerelease`、`internal`、`documentation`

#### Auto で自動的に最初のリリースを発行する

この先、`auto`スクリプトを介して新しいバージョン番号を計算しますが、最初のリリースのために、何をしているのか理解するために手動でコマンドを実行しましょう:

```shell
yarn auto changelog
```

上記コマンドは現時点で作成したすべてコミットの長いチェンジログ (そしてデフォルトブランチにプッシュしてきた警告も、それは近いうちに止めるべきでしょう) を生成します。

自動生成されるチェンジログは有用ですが、それだけに失いたくないものなので、手動で編集してユーザーに最も役に立つ方法でメッセージを作り上げるのは良い考えです。この場合、ユーザーは開発過程のコミットすべてを知る必要はありません。最初の v0.1.0 バージョンのための良い簡単なメッセージを作成しましょう:

```shell
git reset HEAD^
```

それからチェンジログを更新してコミットしましょう:

```
# v0.1.0 (Tue Mar 09 2021)

- Created first version of the design system, with `Avatar`, `Badge`, `Button`, `Icon` and `Link` components.

#### Authors: 1

- [your-username](https://github.com/your-username)
```

チェンジログを git へ追加しましょう。`[skip ci]`を使って CI プラットフォームにこれらのコミットを無視していることに注意してください、でなければ構築と発行のループになってしまいます。

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
💡 パッケージの発行に <a href="https://classic.yarnpkg.com/en/docs/cli/">yarn</a> を使っているなら適切なコマンドを適用することを忘れないでください。 
</div>

そして Auto を使って GitHub 上にリリースを作成します:

```shell
git push --follow-tags origin main
yarn auto release
```

やりました！上手くパッケージを npm へ発行し GitHub 上にリリースを作成しました(幸運にも！)。

![Package published on npm](/design-systems-for-developers/npm-published-package.png)

![Release published to GitHub](/design-systems-for-developers/github-published-release.png)

(`auto`が最初のリリースのためにリリースノートを自動生成しましたが、最初のバージョンのためにそれらを理解しやすいよう編集したことに留意してください)。

#### Auto を利用するためにスクリプトを設定する

この先パッケージを発行したい時に同じプロセスを踏むために Auto を設定しましょう。次のスクリプトを`package.json`に追加します:

```json:title=package.json
{
  "scripts": {
    "release": "auto shipit --base-branch=main"
  }
}
```

これで、`yarn release`を実行すると、自動化された形式で上記で実行したすべてのステップ (自動生成されたチェンジログの使用を除いて) を通します。デフォルトブランチの全てのコミットが発行されます。

おめでとうございます！デザインシステムのリリースを自動的に発行するための基盤を設定しました。今度は継続的インテグレーションでリリースを自動化する方法を学びましょう。

## 自動的にリリースを発行する

継続的インテグレーションのために GitHub アクションを使います。けれど進める前に、アクションがアクセスできるように GitHub と NPM トークンを前もって安全に格納する必要があります。

#### GitHub シークレットにトークンを追加する

GitHub シークレットはリポジトリに機密情報の格納を許可します。ブラウザのウィンドウで、あなたの GitHub リポジトリを開きます。

⚙️ 設定タブをクリックしてサイドバーのシークレットリンクをクリックします。次の画面が見えます:

![Empty GitHub secrets page](/design-systems-for-developers/github-empty-secrets-page.png)

**New secret**ボタンを押してください。名前に `NPM_TOKEN` を使い本章で先ほど取得したトークンを貼り付けます。

![Filled GitHub secrets form](/design-systems-for-developers/github-secrets-form-filled.png)

リポジトリに npm シークレットを追加すると、`secrets.NPM_TOKEN`としてアクセスできるようになります。あなたの GitHub トークンに別のシークレットを設定する必要はありません。すべての GitHub ユーザーはアカウントに紐づく`secrets.GITHUB_TOKEN`を自動的に取得します。

#### GitHub アクションを使ってリリースを自動化する

プルリクエストをする度に、デザインシステムを自動的に発行したいものです。先に<a href="https://storybook.js.org/tutorials/design-systems-for-developers/react/en/review/#publish-storybook">Storybook の発行</a>で使った同じフォルダに`push.yml`という新しいファイルを作成し次の内容を追加します:

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

上手くいきました！これでデフォルトブランチへ PR (プルリクエスト) をマージするたび、自動的に新しいバージョンを発行し、追加したラベルによる適切なバージョン番号を加算します。

<div class="aside">💡 成長するデザインシステムに役立つ多くの特徴とインテグレーションのすべてをカバーしませんでした。<a href="https://github.com/intuit/auto">こちらの</a>ドキュメントを参照してください。</div>

![Import the design system](/design-systems-for-developers/design-system-import.png)

## アプリにデザインシステムをインポートする

これでデザインシステムが依存関係をインストールしたオンライン上にあり UI コンポーネントの利用が明らかとなりました。

#### サンプルアプリを取得する

このチュートリアルの最初で、React と Styled Components を含む人気のフロントエンドスタックを標準化しました。それはサンプルアプリもまたデザインシステムの最大限の利点を得るために React と Styled Components を使う必要があることを意味します。

<div class="aside">💡 Svelte や Webコンポーネントのような他の有望な手段がフレームワークに依存しない UIコンポーネントを送り出すことを可能にするかもしれません。けれども、それらは比較的新しく、明文化されず、ひろく採用されていません、そのため本ガイドにはまだ含まれていません。</div>

サンプルアプリは[コンポーネント駆動開発](https://www.componentdriven.org/)、コンポーネントに始まりページで終わる下層から UI を開発するためのアプリ開発手法、を促進するために Storybook を使います。デモの最中 2 つの Storybook を並行して実行します、ひとつはサンプルアプリでもう一つはデザインシステムです。

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

サンプルアプリが使う簡単なコンポーネントのストーリーを実行している Storybook が見えるでしょう:

![Initial storybook for example app](/design-systems-for-developers/example-app-starting-storybook-6-0.png)

<h4>デザインシステムを統合する</h4>

私たちのデザインシステムの Storybook を発行しました。それをサンプルアプリに追加しましょう。サンプルアプリの`.storybook/main.js`へ次の内容を追加しましょう:

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
💡 <code>refs</code>キーを<code>.storybook/main.js</code>に追加して、複数のStorybookをひとつに<a href="https://storybook.js.org/docs/react/workflows/storybook-composition">構成</a>できます。これは複数のプロジェクト広がったり異なる技術スタックを使ったりする大きなプロジェクトで働くときに役に立ちます。
</div>

これでサンプルアプリを開発中にデザインシステムのコンポーネントとドキュメントを閲覧することができます。フィーチャー開発の間デザインシステムを陳列することは開発者が自前で開発して時間を浪費することなく既存のコンポーネントを再利用する可能性を高めます。

必要なものが揃いました、デザインシステムを追加し使う時です。ターミナルで次のコマンドを実行します:

```shell
yarn add @your-npm-username/learnstorybook-design-system
```

デザインで定義した同じグローバルスタイルを使う必要があります、そのため[`.storybook/preview.js`](https://storybook.js.org/docs/react/configure/overview#configure-story-rendering)コンフィグファイルを更新し [global decorator](https://storybook.js.org/docs/react/writing-stories/decorators#global-decorators) を追加する必要があります。

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

サンプルアプリの`UserItem`コンポーネントにデザインシステムの`Avatar`コンポーネントを使います。`UserItem`はユーザー、名前とプロフィール写真を含む、についての情報を描画します。

エディターで、`src/components/UserItem.js`にある`UserItem`を開きます。また、Storybook の`UserItem`を選択してホットモジュールリロードで即座に手掛けるコードの変更を見ます。

Avatar コンポーネントをインポートします。

```js:title=src/components/UserItem.js
import { Avatar } from '@your-npm-username/learnstorybook-design-system';
```

ユーザー名のそばに Abatar を描画したいと思います。

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

保存に続いて、`UserItem`コンポーネントは新しいアバターコンポーネントを表示するために Storybook 内で更新します。`UserItem`は`UserList`コンポーネントの一部なので、`UserList`内でも`Avatar`が見えます。

![Example app using the Design System](/design-systems-for-developers/example-app-storybook-using-design-system-6-0.png)

ほらありましたね！サンプルアプリにデザインシステムコンポーネントをインポートしました。デザインシステムにてアバターコンポーネントに対して更新を発行すればいつでも、その変更はパッケージの更新時にサンプルアプリにも反映されます。

![Distribute design systems](/design-systems-for-developers/design-system-propagation-storybook.png)

## デザインシステムのワークフローをマスターする

デザインシステムのワークフローは Storybook に UI コンポーネントの開発に始まりクライアントアプリへそれを配布することで終わります。もっともそれがすべてではありません。デザインシステムは変わり続けるプロダクト要件を提供するために継続して進化しなければなりません、仕事はまさに始まったばかりなのです。

第 8 章は当ガイドで作成したエンド・ツー・エンドのデザインシステムを説明します。どのように UI の変更がデザインシステムから外へ伝播するのか見てゆきます。
