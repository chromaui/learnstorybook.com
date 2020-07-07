---
title: 'React 向け Storybook のチュートリアル'
tocTitle: 'はじめに'
description: '開発環境に Storybook を構築します'
commit: '8741257'
---

Storybook は開発時にアプリケーションと並行して動きます。Storybook を使用することで、UI コンポーネントをビジネスロジックやコンテキストから分離して開発ができるようになります。この文書は React 向けです。他にも [React Native](/react-native/en/get-started)、[Vue](/vue/en/get-started)、[Angular](/angular/en/get-started)、[Svelte](/svelte/en/get-started) 向けのバージョンがあります。

![Storybook と開発中のアプリの関係](/intro-to-storybook/storybook-relationship.jpg)

## React 向けの Storybook を構築する

Storybook を開発プロセスに組み込むにあたり、いくつかの手順を踏む必要があります。まずは、[Create React App](https://github.com/facebook/create-react-app) (CRA) を使用してアプリケーションを作成し、[Storybook](https://storybook.js.org/) とテストフレームワークの [Jest](https://facebook.github.io/jest/) を有効にしましょう。それでは、次のコマンドを実行してください。

```bash
# アプリケーションを作成する:
npx create-react-app taskbox

cd taskbox

# Storybook を追加する:
npx -p @storybook/cli sb init
```

<div class="aside">
このチュートリアルでは、コマンドの実行には基本的に <code>yarn</code> を使用します。
もし <code>yarn</code> よりも <code>npm</code> を使用したい場合には、上記のコマンドに <code>--use-npm</code> フラグをつけることで、CRA および Storybook の設定を変更することができます。<code>npm</code> を使用してチュートリアルを進めても問題ありませんが、使用するコマンドを <code>npm</code> に合わせて調整するのを忘れないようにしましょう。
</div>

作成したアプリケーションが問題なく動くことを次のコマンドで確認しましょう。

```bash
# ターミナルでテストランナー (Jest) を開始する:
yarn test --watchAll

# ポート 9009 でコンポーネントエクスプローラーを起動する:
yarn storybook

# ポート 3000 でフロントエンドアプリケーションを起動する:
yarn start
```

<div class="aside"> 
テストのコマンドに <code>--watchAll</code> フラグを付けているのに気づいたでしょうか。これは間違いではありません。このフラグを付けることにより、すべてのテストが実行され、アプリケーションに問題ないことを確実にできます。チュートリアルを進めると、別のテストシナリオも出てきます。必要ならばこのフラグを <code>package.json</code> のテストコマンドに追加することで、テストスイートのすべてのテストが実行されるようになります。
</div>

フロントエンド開発の 3 つのモード: 自動化されたテスト (Jest)、コンポーネント開発 (Storybook)、アプリケーション自体

![3つのモード](/intro-to-storybook/app-three-modalities.png)

作業をする対象に応じて、このモードのうち 1 つまたは複数を同時に動かしながら作業します。今は単一の UI コンポーネントを作るのに集中するため、Storybook を動かすことにしましょう。

## CSS を再利用する

Taskbox はデザイン要素を [GraphQL と React のチュートリアル](https://blog.hichroma.com/graphql-react-tutorial-part-1-6-d0691af25858)より再利用しますので、このチュートリアルでは、CSS を書く必要はありません。[このコンパイル済み CSS ファイル](https://github.com/chromaui/learnstorybook-code/blob/master/src/index.css) をコピーして `src/index.css` として保存してください。

![Taskbox の UI](/intro-to-storybook/ss-browserchrome-taskbox-learnstorybook.png)

<div class="aside">
もしスタイルをカスタマイズしたければ、GitHub のリポジトリに LESS のソースファイルがあります。
</div>

## アセットを追加する

狙い通りのデザインにするためには、フォントとアイコンのフォルダーをダウンロードし、`public` フォルダーに配置する必要があります。

<div class="aside">
<p>以下のコマンドでは GitHub からフォルダーをダウンロードするのに、<code>svn</code> (Subversion) を使用します。Subversion をインストールしていないか、手動でダウンロードしたければ、<a href="https://github.com/chromaui/learnstorybook-code/tree/master/public">こちら</a>から直接ダウンロードできます。</p>
</div>

```bash
svn export https://github.com/chromaui/learnstorybook-code/branches/master/public/icon public/icon
svn export https://github.com/chromaui/learnstorybook-code/branches/master/public/font public/font
```

CSS とアセットを追加すると、アプリケーションの描画が崩れてしまいますが、そのままで問題ありません。今はアプリケーションに手はつけません。まずは一つ目のコンポーネントを作り始めましょう！
