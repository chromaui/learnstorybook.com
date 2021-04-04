---
title: 'Storybook をデプロイする'
tocTitle: 'デプロイ'
description: 'Storybook をインターネット上にデプロイする方法を学びましょう'
commit: '8652d73'
---

ここまで、ローカルの開発マシンでコンポーネントを作成してきました。しかし、ある時点で、フィードバックを得るためにチームに作業を共有しなければならないこともあるでしょう。チームメートに UI の実装をレビューしてもらうため、Storybook をインターネット上にデプロイしてみましょう。

## 静的サイトとしてエクスポートする

Storybook をデプロイするには、まず静的サイトとしてエクスポートします。この機能はすでに組み込まれて、使える状態となっているので、設定について気にする必要はありません。

`yarn build-storybook` を実行すると、`storybook-static` ディレクトリーに Storybook が静的サイトとして出力されますので、静的サイトのホスティングサービスのデプロイ出来ます。

## Storybook を発行する

このチュートリアルでは、Storybook のメンテナーが作成した、無料のホスティングサービスである <a href="https://www.chromatic.com/">Chromatic</a> を使用します。Chromatic を使えば、クラウド上に Storybook を安全に、デプロイしホストすることができます。

### GitHub にリポジトリーを作成する

デプロイの前に、リモートのバージョン管理サービスへローカルのコードを同期しなければなりません。[はじめにの章](/intro-to-storybook/react/ja/get-started/)で Create React App (CRA) でプロジェクトを初期化した際に、ローカルのリポジトリーはすでに作成されています。また、この段階でリモートリポジトリーにプッシュできるコミットがあるはずです。

[ここから](https://github.com/new) GitHub にアクセスし、リポジトリーを作りましょう。リポジトリーの名前はローカルと同じく「taskbox」とします。

![GitHub のセットアップ](/intro-to-storybook/github-create-taskbox.png)

新しいリポジトリーを作ったら origin の URL をコピーして、次のコマンドを実行し、ローカルの Git プロジェクトにリモートを追加します:

```bash
$ git remote add origin https://github.com/<your username>/taskbox.git
```

最後にローカルリポジトリーを GitHub のリモートリポジトリーにプッシュします:

```bash
$ git push -u origin main
```

### Chromatic を使う

パッケージを開発時の依存関係に追加します。

```bash
yarn add -D chromatic
```

パッケージをインストールしたら、GitHub のアカウントを使用して [Chromatic にログイン](https://www.chromatic.com/start)します。(Chromatic は一部のアクセス許可を要求します。) 「taskbox」という名前でプロジェクトを作成し、GitHub のリポジトリーと同期させます。

ログインしたら `Choose from GitHub` をクリックし、リポジトリーを選択します。

<video autoPlay muted playsInline loop style="width:520px; margin: 0 auto;">
  <source
    src="/intro-to-storybook/chromatic-setup-learnstorybook.mp4"
    type="video/mp4"
  />
</video>

作成したプロジェクト用に生成された一意の `project-token` をコピーします。次に、Storybook をビルドし、デプロイするため、以下のコマンドを実行します。その際、コマンドの `<project-token>` の場所にコピーしたトークンを貼り付けてください。

```bash
yarn chromatic --project-token=<project-token>
```

![Chromatic を実行する](/intro-to-storybook/chromatic-manual-storybook-console-log.png)

実行が完了すると、Storybook が発行されて、`https://random-uuid.chromatic.com` のようなリンクができます。このリンクをチームに共有すれば、フィードバックが得られるでしょう。

![Chromatic パッケージを使用してデプロイされた Storybook](/intro-to-storybook/chromatic-manual-storybook-deploy-6-0.png)

やりました！Storybook が一つのコマンドだけで発行できました。ですが、UI を実装し、フィードバックを得たいと思ったときに、毎回コマンドを手動実行するのは非効率です。理想的なのは、コードをプッシュすると自動的に最新のコンポーネントが発行されることです。それには、Storybook を継続的にデプロイしていく必要があります。

## Chromatic を使用した継続的デプロイメント

もうプロジェクトは GitHub にホストされているので、Storybook を自動的にデプロイする継続的インテグレーション (CI) が使用できます。[GitHub アクション](https://github.com/features/actions)は GitHub に組み込まれている CI サービスで、自動発行が簡単にできます。

### Storybook をデプロイするために GitHub アクションを追加する

プロジェクトのルートフォルダーに `.github` というフォルダーを作成し、さらにその中に `workflows` というフォルダーを作成します。

`chromatic.yml` を以下の内容で新規に作成します。`project-token` を先ほどのトークンで置き換えてください。

```yaml
# .github/workflows/chromatic.yml

# Workflow name
name: 'Chromatic Deployment'

# Event for the workflow
on: push

# List of jobs
jobs:
  test:
    # Operating System
    runs-on: ubuntu-latest
    # Job steps
    steps:
      - uses: actions/checkout@v1
      - run: yarn
        #👇 Adds Chromatic as a step in the workflow
      - uses: chromaui/action@v1
        # Options required for Chromatic's GitHub Action
        with:
          #👇 Chromatic projectToken, see https://storybook.js.org/tutorials/intro-to-storybook/react/en/deploy/ to obtain it
          projectToken: project-token
          token: ${{ secrets.GITHUB_TOKEN }}
```

<div class="aside">
<p>簡潔にするため <a href="https://help.github.com/ja/actions/configuring-and-managing-workflows/creating-and-storing-encrypted-secrets">GitHub secrets</a> には言及していません。GitHub secrets は GitHub によって提供されるセキュアな環境変数なので、<code>project-token</code> をハードコードする必要はありません。</p>
</div>

### アクションをコミットする

コマンドラインで以下のコマンドを実行し、今までの内容をステージングします:

```bash
git add .
```

さらに以下のコマンドでコミットします:

```bash
git commit -m "GitHub action setup"
```

最後にリモートリポジトリーにプッシュします:

```bash
git push origin main
```

一度 GitHub アクションをセットアップすれば、コードをプッシュする度に Chromatic にデプロイされます。Chromatic のプロジェクトのビルド画面で発行されたすべての Storybook を確認できます。

![Chromatic のユーザーダッシュボード](/intro-to-storybook/chromatic-user-dashboard.png)

リストの一番上にある最新のビルドをクリックしてください。

次に `View Storybook` ボタンをクリックすれば、最新の Storybook を見ることができます。

![Chromatic の Storybook のリンク](/intro-to-storybook/chromatic-build-storybook-link.png)

このリンクをチームメンバーに共有しましょう。これは標準的な開発プロセスや、単に作業を公開するのに便利です 💅
