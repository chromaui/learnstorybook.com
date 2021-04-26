---
title: 'Angular 向け Storybook のチュートリアル'
tocTitle: 'はじめに'
description: '開発環境に Storybook を導入しましょう'
commit: 0818d47
---

Storybook は開発時にアプリケーションと並行して動きます。Storybook を使用することで、UI コンポーネントをビジネスロジックやコンテキストから切り離して開発できるようになります。 この Storybook チュートリアルのバージョンは Angular 向けです。他にも [React](/intro-to-storybook/react/en/get-started)、 [React Native](intro-to-storybook/react-native/en/get-started)、 [Vue](intro-to-storybook/vue/en/get-started)、 [Svelte](intro-to-storybook/svelte/en/get-started) and [Ember](intro-to-storybook/ember/en/get-started) 向けのバージョンがあります。

![Storybook と開発中のアプリの関係](/intro-to-storybook/storybook-relationship.jpg)

## Angular 向けの Storybook を構築する

Storybook を開発プロセスに組み込むにあたり、いくつかの手順を踏む必要があります。まずは、[degit](https://github.com/Rich-Harris/degit) を使用してビルドシステムをセットアップします。このパッケージを使うと、テンプレート (既定の設定で部分的に構築されているアプリケーション) をダウンロードできるので、開発フローを加速できます。

次のコマンドを実行してください。

```bash
# Clone the template
npx degit chromaui/intro-storybook-angular-template taskbox

cd taskbox

# Install dependencies
npm install
```

<div class="aside">
💡 テンプレートにはこのチュートリアルに必要なスタイル、アセット、最低限の設定が含まれています。
</div>

ここでアプリケーションのいくつかの環境が正常に動作しているかクイックに確認できます。

```bash
# Run the test runner (Jest) in a terminal:
npm run test

# Start the component explorer on port 6006:
npm run storybook

# Run the frontend app proper on port 4200:
npm run start
```

フロントエンド開発の 3 つのモード: 自動化されたテスト (Jest)、コンポーネント開発 (Storybook)、アプリケーション自体

![3 つのモード](/intro-to-storybook/app-three-modalities.png)

作業をする対象に応じて、このモードのうち 1 つまたは複数を同時に動かしながら作業します。今は単一の UI コンポーネントを作るのに集中するため、Storybook を動かすことにしましょう。

## 変更をコミットする

この段階で、ローカルのレポジトリーにファイルを追加しても問題ありません。次のコマンドを実行し、レポジトリーの初期化と今までの変更の追加を行い、コミットしましょう。

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
