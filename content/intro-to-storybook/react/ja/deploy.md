---
title: 'Storybook をデプロイする'
tocTitle: 'デプロイ'
description: 'Storybook をインターネット上にデプロイする方法を学びましょう'
---

ここまで、ローカルの開発マシンでコンポーネントを作成してきました。しかし、どこかの時点で、フィードバックを得るために作業を共有しなければならないこともあるでしょう。チームメートに UI の実装をレビューしてもらうため、Storybook をインターネット上にデプロイしてみましょう。

## 静的サイトとしてデプロイする

Storybook をデプロイするには、まず静的サイトとしてエクスポートします。この機能はすでに組み込まれて、使える状態となっているので、設定について気にする必要はありません。

`yarn build-storybook` を実行すると、`storybook-static` ディレクトリーに Storybook が静的サイトとして出力されますので、静的サイトのホスティングサービスのデプロイ出来ます。

## Storybook を発行する

このチュートリアルでは、Storybook のメンテナーが作成した、無料の発行サービスである <a href="https://www.chromatic.com/">Chromatic</a> を使用します。Chromatic を使えば、クラウド上に Storybook を安全に、デプロイしホストすることができます。

### GitHub にリポジトリーを作成する

デプロイの前に、リモートのバージョン管理サービスへローカルのコードを同期しなければなりません。[はじめにの章](/react/ja/get-started/)で Create React App (CRA) でプロジェクトを初期化した際に、ローカルのリポジトリーはすでに作成されていますので、そのままファイルをステージングし、コミット出来ます。

これまでの変更を以下のコマンドを発行し、コミットしましょう。

```bash
$ git add .
```

次に以下を実行します:

```bash
$ git commit -m "taskbox UI"
```

[ここから](https://github.com/new) GitHub にアクセスし、リポジトリーを作りましょう。リポジトリーの名前はローカルと同じく「taskbox」とします。

![GitHub のセットアップ](/intro-to-storybook/github-create-taskbox.png)

新しいリポジトリーを作ったら origin の URL をコピーして、次のコマンドを実行し、ローカルの Git プロジェクトにリモートを追加します:

```bash
$ git remote add origin https://github.com/<your username>/taskbox.git
```

最後にローカルリポジトリーを GitHub のリモートリポジトリーにプッシュします:

```bash
$ git push -u origin master
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
npx chromatic --project-token=<project-token>
```

![Chromatic を実行する](/intro-to-storybook/chromatic-manual-storybook-console-log.png)

実行が完了すると、Storybook が発行されて、`https://random-uuid.chromatic.com` のようなリンクができます。このリンクをチームに共有すれば、フィードバックが得られるでしょう。

![Chromatic パッケージを使用してデプロイされた Storybook](/intro-to-storybook/chromatic-manual-storybook-deploy.png)

やりました！Storybook が一つのコマンドだけで発行できました。UI を実装し、フィードバックを得たいと思ったときに、毎回コマンドを手動実行するのは非効率です。理想的なのは、コードをプッシュすると自動的に最新のコンポーネントが発行されることです。Storybook を継続的にデプロイする必要があります。

## Chromatic を使用した継続的デプロイメント

もうプロジェクトは GitHub にホストされているので、Storybook を自動的にデプロイする継続的インテグレーション (CI) が使用できます。[GitHub アクション](https://github.com/features/actions)は GitHub に組み込まれている CI サービスで、自動発行が簡単にできます。

### Storybook をデプロイするために GitHub アクションを追加する

プロジェクトのルートフォルダーに `.github` というフォルダーを作成し、さらにその中に `workflows` というフォルダーを作成します。

`chromatic.yml` を以下の内容で新規に作成します。`project-token` を先ほどのトークンで置き換えてください。

```yaml
# .github/workflows/chromatic.yml
# アクションの名前
name: 'Chromatic Deployment'
# トリガーを起動するイベント
on: push

# このアクションが何をするのか
jobs:
  test:
    # アクションを実行する OS を指定
    runs-on: ubuntu-latest
    # 実行するステップのリスト
    steps:
      - uses: actions/checkout@v1
      - run: yarn
      - uses: chromaui/action@v1
        # GitHub chromatic アクションに必要なパラメーター
        with:
          # プロジェクトトークンを指定する
          # 取得方法は https://www.learnstorybook.com/intro-to-storybook/react/ja/deploy/ を参照
          projectToken: project-token
          token: ${{ secrets.GITHUB_TOKEN }}
```

<div class="aside">
<p>簡潔にするため <a href="https://help.github.com/en/actions/configuring-and-managing-workflows/creating-and-storing-encrypted-secrets">GitHub secrets</a> には言及していません。GitHub secrets は GitHub によって提供されるセキュアな環境変数なので、<code>project-token</code> をハードコードする必要はありません。</p>
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
git push origin master
```

一度 GitHub アクションをセットアップすれば、コードをプッシュする度に Chromatic にデプロイされます。Chromatic のプロジェクトのビルド画面で発行されたすべての Storybook を確認できます。

![Chromatic のユーザーダッシュボード](/intro-to-storybook/chromatic-user-dashboard.png)

リストの一番上にある最新のビルドをクリックしてください。

次に `View Storybook` ボタンをクリックすれば、最新の Storybook を見ることができます。

![Chromatic の Storybook のリンク](/intro-to-storybook/chromatic-build-storybook-link.png)

<!--
これだけです。必要なのは変更をコミットしてプッシュするだけです。Storybook のデプロイを自動化することに成功しました。
 -->

このリンクをチームメンバーに共有しましょう。これは標準的な開発プロセスや、単に作業を公開するのに便利です 💅
