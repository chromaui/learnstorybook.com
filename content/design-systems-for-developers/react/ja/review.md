---
title: 'チームでレビューする'
tocTitle: 'レビュー'
description: '継続的インテグレーションとビジュアルレビューで協働する'
commit: 'fe0944a'
---

第 4 章では、矛盾を減らしてゆくなかでデザインシステムの改善をするための専門的なワークフローを学びます。本章では UI フィードバックの収集とチームで共通認識に到達するためのテクニックを取り扱います。この生産プロセスは Auth0、Shopify、Discovery Network の皆さんに使われています。

## 信頼できる唯一の情報源か単一の障害点か

以前、私はデザインシステムがフロントエンドチームにとって[単一の障害点](https://www.chromatic.com/blog/why-design-systems-are-a-single-point-of-failure)だと書きました。本質的に、デザインシステムは依存すべき対象です。デザインシステムのコンポーネントを変えたら、その変更が依存しているアプリへ伝播します。変更の配布の仕組みは公平です—改善とバグの両方を送り出しているのです。

![Design system dependencies](/design-systems-for-developers/design-system-dependencies.png)

バグはデザインシステムにとって目に見えるリスクのため、それを阻止するために手を尽くします。ささいな調整は雪だるま式に膨れあがり、数えきれない手戻りとなるのです。継続するメンテナンス戦略なくしては、デザインシステムは枯れ果ててしまいます。

> “でも私のマシンでは動いてるけど？！” – みんな

## チームと UI コンポーネントをビジュアルレビューする

ビジュアルレビューはユーザーインターフェイスの振る舞いと審美性を確かめるプロセスです。UI を一人で開発しているときも、チーム内での品質保証をしているときも発生します。

多くの開発者はコードの質を高めるために他の開発者からフィードバックを収集するプロセスであるコードレビューに慣れています。UI コンポーネントはコードを視覚的に表現するので、ビジュアルレビューは UI/UX フィードバックを集めるために必要です。

### 共通の参照先を立ち上げる

node_modules を削除する。パッケージを再インストールする。ローカルストレージをクリアする。クッキーを削除する。こうした行動に馴染みがあるなら、チームメートに最新のコードを参照させるのがどんなに大変か分かるでしょう。みんなが同じ開発環境を持っていないために、本来のバグとローカル環境により引き起こされる問題とを見分ける破目になるのは最悪です。

幸いにも、フロントエンド開発者として、私たちは共通のコンパイルターゲットがあります: ブラウザーです。精通したチームは ビジュアルレビューのための共通の参照先として Storybook をオンライン上に配信し、ローカル開発環境 (何にせよテクニカルサポートがやっかいです) につきものの複雑さを回避します。

![Review your work in the cloud](/design-systems-for-developers/design-system-visual-review.jpg)

現存の UI コンポーネントが URL 経由でアクセス可能であると、ステークホルダーは自身のブラウザーで快適に UI のルック＆フィールを確認できます。それは開発者たち、デザイナーたち、プロジェクトマネージャーたちがローカル開発環境をいじくり回したり、スクリーンショットをやり取りしたり、古いバージョンの UI を参照したりする必要がないことを意味します。

> "それぞれのプルリクエストで Storybook にデプロイすればビジュアルレビューを容易にしプロダクトオーナーがコンポーネントを考え抜く助けとなります。" –Norbert de Langen, Storybook のコア開発者

<h2 id="publish-storybook">Storybook を発行する</h2>

Storybook の開発者により作られた無料の配信サービスである [Chromatic](https://www.chromatic.com/) を用いてビジュアルワークフローをデモンストレーションします。Chromatic を使ってもクラウド上に安全でセキュアに Storybook をデプロイできますが、他のホスティングサービスでも[静的サイトとして Storybook を構築しデプロイする](https://storybook.js.org/docs/react/workflows/publish-storybook)ことは同じくとても簡単です。

### Chromatic を入手する

まず最初に、[chromatic.com](https://chromatic.com) に行きあなたの GitHub アカウントでサインアップします。

![Signing up at Chromatic](/design-systems-for-developers/chromatic-signup.png)

そこから、デザインシステムのリポジトリを選択します。その裏で、アクセス権限の同期とプルリクエストチェックの設定を行います。

<video autoPlay muted playsInline loop style="width:520px; margin: 0 auto;">
  <source
    src="/design-systems-for-developers/chromatic-setup-learnstorybook-design-system.mp4"
    type="video/mp4"
  />
</video>

npm を経由して [chromatic](https://www.npmjs.com/package/chromatic) パッケージをインストールします。

```shell
yarn add --dev chromatic
```

インストールしたら、次のコマンドを実行して Storybook をビルドしデプロイします (直前の操作で Chromatic から提供された`project-token`の使用が必要になるでしょう) :

```shell
npx chromatic --project-token=<project-token>
```

![Chromatic in the command line](/design-systems-for-developers/chromatic-manual-storybook-console-log.png)

提供されるリンクをコピーし新しいブラウザウィンドウにそれを貼り付けて配信された Storybook を閲覧しましょう。ローカル Storybook の開発環境がオンラインでミラーリングされていることが分かるでしょう。

![Storybook built with Chromatic](/design-systems-for-developers/chromatic-published-storybook-6-0.png)

これであなたがローカルで見ているようにチームが実際にレンダリングされた UI コンポーネントをレビューするのが容易になります。そしてこちらが Chromatic で見ることのできる確認画面です。

![Result of our first Chromatic build](/design-systems-for-developers/chromatic-first-build.png)

おめでとうございます！Storybook を配信する基盤をセットアップしたので継続的インテグレーションでさらに良くしていきましょう。

### 継続的インテグレーション

継続的インテグレーションは現代的な Web アプリをメンテナンスするための事実上のやり方です。コードをプッシュするたびにテスト、分析、デプロイのような振る舞いを自動化できます。繰り返しの手作業から私たちの身を守るためにこのテクニックを取り入れます。

私たちは GitHub アクションを使います、適度に利用すれば無料です。同様の原則は他の CI サービスにも適用できます。

`.github`ディレクトリを最上位の階層に加えましょう。それから `workflows` という別のディレクトリを作成します。

以下のような chromatic.yml ファイルを作成します。これにより CI プロセスをどう処理させるかを記述します。今は小さく始めて進むにしたがって改善を続けます:

```yaml:title=.github/workflows/chromatic.yml
# Name of our action
name: 'Chromatic'
# The event that will trigger the action
on: push

# What the action will do
jobs:
  test:
    # The operating system it will run on
    runs-on: ubuntu-latest
    # The list of steps that the action will go through
    steps:
      - uses: actions/checkout@v1
      - run: yarn
        #👇 Adds Chromatic as a step in the workflow
      - uses: chromaui/action@v1
        # Options required for Chromatic's GitHub Action
        with:
          #👇 Chromatic projectToken, see https://storybook.js.org/tutorials/design-systems-for-developers/react/en/review/ to obtain it
          projectToken: ${{ secrets.CHROMATIC_PROJECT_TOKEN }}
          token: ${{ secrets.GITHUB_TOKEN }}
```

<div class="aside"><p>💡 簡潔さのため <a href="https://help.github.com/en/actions/configuring-and-managing-workflows/creating-and-storing-encrypted-secrets">GitHubシークレット</a> には言及しませんでした。シークレットは Github により提供されるセキュアな環境変数であるため<code>project-token</code>をハードコーディングする必要はありません。</p></div>

変更を次のコマンドで追加します:

```shell
git add .
```

それをコミットします:

```shell
git commit -m "Storybook deployment with GitHub action"
```

最後に、次のコマンドでリモートリポジトリへプッシュします:

```shell
git push origin main
```

上手くいきました！私たちの基盤を改善しました。

## チームによるビジュアルレビューを要求する

プルリクエストに UI の変更を含むたびに、ユーザーに対して何が提供されるかステークホルダーに共通理解を得るビジュアルレビューに着手することは有益です。そうすることで、望まれない不意の出来事やコストの高い手戻りが無くなります。

新しいブランチに UI の変更を作成してビジュアルレビューを披露します。

```shell
git checkout -b improve-button
```

最初に、ボタンコンポーネントを微調整します。「ポップにする」とデザイナー達が気に入るでしょう。

```js:title=src/Button.js
// ...
const StyledButton = styled.button`
  border: 10px solid red;
  font-size: 20px;
`;
// ...
```

変更をコミットし GitHub のリポジトリへプッシュします。

```shell
git commit -am "make Button pop"
git push -u origin improve-button
```

GitHub.com へ移動して`improve-button`ブランチのプルリクエストをオープンします。オープンになると、Storybook を発行する CI ジョブが走ります。

![Created a PR in GitHub](/design-systems-for-developers/github-created-pr-actions.png)

ページ下部のプルリクエストチェックの一覧のうち、**Storybook Publish** をクリックして発行された Storybook の新しい変更点を閲覧します。

![Button component changed in deployed site](/design-systems-for-developers/chromatic-deployed-site-with-changed-button.png)

変更があった各コンポーネントとストーリーについて、ブラウザのアドレスバーから URL をコピーしてチームメイトが素早く関連するストーリーをレビューする助けとなるようタスク管理の場所 (GitHub、Asana、Jira、等) に貼り付けます。

![GitHub PR with links to storybook](/design-systems-for-developers/github-created-pr-with-links-actions.png)

チームメイトに課題をアサインし寄せられるフィードバックを確認します。

![Why?!](/design-systems-for-developers/github-visual-review-feedback.gif)

<div class="aside">💡 Chromatic はまた一部有料プロダクトとして完全なUIレビューのワークフローを提供しています。Storybook のリンクを Github のプルリクエストにコピーするテクニックは小規模で (そして Chromatic でなく、Storybook をホストするあらゆるサービスで) 有効ですが、利用頻度が増えてくると、プロセスを自動化するサービスを検討するのが良いかもしれません。</div>

ソフトウェア開発において、大抵の欠陥は伝達ミスに起因しており技術ではありません。ビジュアルレビューはチームがデザインシステムをより早く提供するために開発中に継続的にフィードバックを集める助けとなります。

![Visual review process](/design-systems-for-developers/visual-review-loop.jpg)

> プルリクエスト毎に Storybook を特定の URL にデプロイすることは Shopify のデザインシステムである Polaris でやってきていることで、驚くほど助けになる。 Ben Scott、Shopify エンジニア

## デザインシステムをテストする

ビジュアルレビューは計り知れない価値があります。しかしながら、手作業で数百ものコンポーネントのストーリーをレビューするのは時間がかかります。理想的には、意図的な変更 (追加／改善) だけを見て自動的に意図しないリグレッションを捕捉したいのです。

第 5 章では、ビジュアルレビューの最中のノイズを軽減し時間の経過に耐えうるコンポーネントであることを保証するテスト戦略を紹介します。
