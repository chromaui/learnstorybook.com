---
title: 'Angular 向け Storybook のチュートリアル'
tocTitle: 'はじめに'
description: '開発環境に Storybook を導入しましょう'
commit: 0818d47
---

Storybook は開発時にアプリケーションと並行して動きます。Storybook を使用することで、UI コンポーネントをビジネスロジックやコンテキストから切り離して開発できるようになります。 この文書は Angular 向けです。他にも [React](/react/en/get-started), [React Native](/react-native/en/get-started), [Vue](/vue/en/get-started), [Svelte](/svelte/en/get-started) and [Ember](/ember/en/get-started) 向けのバージョンがあります。

![Storybook と開発中のアプリの関係](/intro-to-storybook/storybook-relationship.jpg)

## Angular 向けの Storybook を構築する

Storybook を開発プロセスに組み込むにあたり、いくつかの手順を踏む必要があります。まずは、[degit](https://github.com/Rich-Harris/degit) を使用してビルドシステムをセットアップします。このパッケージを使うと、テンプレート(既定の設定で部分的に構築されているアプリケーション)をダウンロードできるので、開発フローを加速できます。

次のコマンドを実行してください。

```bash
# テンプレートをクローン
npx degit chromaui/intro-storybook-angular-template taskbox

cd taskbox

# 依存ライブラリをインストール
npm install
```

<div class="aside">
テンプレートにはこのチュートリアルに必要なスタイル、アセット、最低限の設定が含まれています。
</div>

ここでアプリケーションのいくつかの環境が正常に動作しているかクイックに確認できます。

```bash
# ターミナルでテストランナー(Jest)を実行する:
npm run test

# 6006番ポートでコンポーネントエクスプローラーを起動する:
npm run storybook

# 4200番ポートでフロントエンドアプリを通常通り実行する:
npm run start
```

フロントエンド開発の 3 つのモード: 自動化されたテスト (Jest)、コンポーネント開発 (Storybook)、アプリケーション自体

![3 つのモード](/intro-to-storybook/app-three-modalities.png)

作業をする対象に応じて、このモードのうち 1 つまたは複数を同時に動かしながら作業します。今は単一の UI コンポーネントを作るのに集中するため、Storybook を動かすことにしましょう。

## 変更をコミットする

この段階で、最初のコミットにファイルを追加しても問題ありません。

次のコマンドを実行し、レポジトリの初期化と今までの変更の追加を行い、コミットしましょう。

```shell
git init
```

次に:

```shell
git add .
```

最後に:

```shell
git commit -m "first commit"
```

それでは最初のコンポーネントを作り始めましょう！