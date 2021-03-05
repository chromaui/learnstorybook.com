---
title: 'React 向け Storybook のチュートリアル'
tocTitle: 'はじめに'
description: '開発環境に Storybook を導入しましょう'
commit: 'ac1ec13'
---

Storybook は開発時にアプリケーションと並行して動きます。Storybook を使用することで、UI コンポーネントをビジネスロジックやコンテキストから切り離して開発できるようになります。この文書は React 向けです。他にも [React Native](/intro-to-storybook/react-native/en/get-started)、[Vue](/intro-to-storybook/vue/en/get-started)、[Angular](/intro-to-storybook/angular/en/get-started)、[Svelte](/intro-to-storybook/svelte/en/get-started)、[Ember](/intro-to-storybook/ember/en/get-started) 向けのバージョンがあります。

![Storybook と開発中のアプリの関係](/intro-to-storybook/storybook-relationship.jpg)

## React 向けの Storybook を構築する

Storybook を開発プロセスに組み込むにあたり、いくつかの手順を踏む必要があります。まずは、[Create React App](https://github.com/facebook/create-react-app) (CRA) を使用してアプリケーションを作成し、[Storybook](https://storybook.js.org/) とテストフレームワークの [Jest](https://facebook.github.io/jest/) を有効にしましょう。それでは、次のコマンドを実行してください:

```bash
# アプリケーションを作成する:
npx create-react-app taskbox

cd taskbox

# Storybook を追加する:
npx -p @storybook/cli sb init
```

<div class="aside">
このチュートリアルでは、コマンドの実行には基本的に <code>yarn</code> を使用します。
もし <code>yarn</code> ではなく <code>npm</code> を使用したい場合には、上記のコマンドに <code>--use-npm</code> フラグをつけることで、CRA および Storybook の設定を変更することができます。<code>npm</code> を使用してチュートリアルを進めても問題ありませんが、使用するコマンドを <code>npm</code> に合わせて調整するのを忘れないようにしましょう。
</div>

プロジェクトのルートフォルダーに `.env` という名前で、以下の内容のファイルを作成してください:

```
SKIP_PREFLIGHT_CHECK=true
```

それでは、作成したアプリケーションが問題なく動くことを次のコマンドで確認しましょう:

```bash
# ターミナルでテストランナー (Jest) を開始する:
yarn test --watchAll

# ポート 6006 でコンポーネントエクスプローラーを起動する:
yarn storybook

# ポート 3000 でフロントエンドアプリケーションを起動する:
yarn start
```

<div class="aside">
テストのコマンドに <code>--watchAll</code> フラグを付けているのに気づいたでしょうか。これは間違いではありません。このフラグを付けることにより、すべてのテストが実行され、アプリケーションに問題ないことを確実にできます。チュートリアルを進めると、別のテストシナリオも出てきます。必要ならばこのフラグを <code>package.json</code> のテストコマンドに追加することで、テストスイートのすべてのテストが実行されるようになります。
</div>

フロントエンド開発の 3 つのモード: 自動化されたテスト (Jest)、コンポーネント開発 (Storybook)、アプリケーション自体

![3 つのモード](/intro-to-storybook/app-three-modalities.png)

作業をする対象に応じて、このモードのうち 1 つまたは複数を同時に動かしながら作業します。今は単一の UI コンポーネントを作るのに集中するため、Storybook を動かすことにしましょう。

## CSS を再利用する

Taskbox はデザイン要素を [GraphQL と React のチュートリアル](https://www.chromatic.com/blog/graphql-react-tutorial-part-1-6)より再利用しますので、このチュートリアルでは、CSS を書く必要はありません。[このコンパイル済み CSS ファイル](https://github.com/chromaui/learnstorybook-code/blob/master/src/index.css) をコピーして `src/index.css` に貼り付けてください。

![Taskbox の UI](/intro-to-storybook/ss-browserchrome-taskbox-learnstorybook.png)

<div class="aside">
スタイルをカスタマイズしたければ、LESS のソースファイルが<a href="https://github.com/chromaui/learnstorybook-code/tree/master/src/style">ここ</a>にあります。
</div>

## アセットを追加する

狙い通りのデザインにするためには、フォントとアイコンのフォルダーをダウンロードし、`src/assets` フォルダーに配置する必要があります。次のコマンドを実行してください:

```bash
npx degit chromaui/learnstorybook-code/src/assets/font src/assets/font
npx degit chromaui/learnstorybook-code/src/assets/icon src/assets/icon
```

<div class="aside">
ここでは GitHub からフォルダーをダウンロードするのに <a href="https://github.com/Rich-Harris/degit">degit</a> を使用しています。手動でダウンロードしたければ、それぞれのフォルダーは<a href="https://github.com/chromaui/learnstorybook-code/tree/master/src/assets">こちら</a>にあります。
</div>

以上です。これでアプリケーションの設定が完了しました。

## 変更をコミットする

プロジェクトを初期化したとき、Create React App (CRA) が既にローカルリポジトリーを作ってくれています。この段階で、最初のコミットにファイルを追加しても問題ありません。

次のコマンドを実行し、今までの変更を追加して、コミットしましょう。

```shell
$ git add .
```

次に以下を実行します:

```shell
$ git commit -m "first commit"
```

それでは最初のコンポーネントを作り始めましょう！
