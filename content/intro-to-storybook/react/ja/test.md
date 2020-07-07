---
title: 'UI コンポーネントをテストする'
tocTitle: 'テスト'
description: 'UI コンポーネントのテストについて学びます'
commit: '3e283f7'
---

Storybook のチュートリアルをテスト抜きには終われません。テストは高品質な UI を作成するのに必要なことです。疎結合なシステムにおいては、些細な変更で大きなリグレッションをもたらすことがあるのです。既に 3 種類のテストについて学びました:

- **視覚的なテスト** コンポーネントの正しさを開発者が手動で確認します。コンポーネントを作成する際、見た目が問題ないかチェックするのに役立ちます。
- **スナップショットテスト** Storyshots を使用し、コンポーネントのマークアップを記録します。描画時のエラーや警告の原因となるマークアップの変更を常に把握するのに役立ちます。
- **単体テスト** Jest を使用し、コンポーネントへの決まった入力より同様の出力が出ていることを確認します。コンポーネントの機能性をテストするのに優れています。

## 「でも、見た目は大丈夫？」

残念ながら、前述のテスト方法だけでは UI のバグを防ぎきれません。UI のデザインというのは主観的で、ごくわずかな変更で全く異なってしまうことがあるため、テストが厄介なのです。視覚的なテストは手動に頼りすぎており、スナップショットテストは UI では多数の偽陽性を発生させ、ピクセルレベルの単体テストの価値はとても低いものです。Storybook でのテスト戦略には視覚的なリグレッションテストが必要です。

## Storybook 向けの視覚的なリグレッションテスト

視覚的なリグレッションテストは見た目の変更を検出するように設計されています。コミット毎にすべてのストーリーのスクリーンショットを撮り、前のコミットと比較して変更点を探します。レイアウトや色、サイズ、コントラストといった表示要素の確認にとても適しています。

<video autoPlay muted playsInline loop style="width:480px; margin: 0 auto;">
  <source
    src="/intro-to-storybook/visual-regression-testing.mp4"
    type="video/mp4"
  />
</video>

Storybook は視覚的なリグレッションテスト用の素晴らしいツールです。Storybook において、すべてのストーリーはテスト仕様となるからです。ストーリーを書くたび、仕様が無料でもらえるようなものです！

視覚的なリグレッションテスト向けのツールは多々あります。熟練したチーム向けには、Storybook のメンテナーが作成したアドオンでクラウドでテストが実行される [**Chromatic**](https://www.chromatic.com/) がおすすめです。

## 視覚的なリグレッションテストのセットアップ

Chromatic はクラウド上でテストとレビューができる、手間いらずの Storybook アドオンです。有料サービス (無料のトライアルもあります) なので、万人向けではありません。けれど、Chromatic は無料で試せる、製造時の視覚的なリグレッションテストのワークフローの例となるでしょう。それでは見てみましょう。

### Git を最新化する

Create React App がすでに Git のリポジトリーを作っているはずなので、変更したところをステージングしてみましょう:

```bash
$ git add -A
```

そして、ファイルをコミットします。

```bash
$ git commit -m "taskbox UI"
```

### Chromatic を使う

パッケージを依存関係に追加します。

```bash
yarn add -D chromatic
```

このアドオンの素晴らしいところは、Git の履歴を使って UI コンポーネントを追跡してくれることです。

次に GitHub のアカウントを使用して [Chromatic にログイン](https://www.chromatic.com/start)します。(Chromatic は一部のアクセス許可を要求します。) 「taskbox」という名前でプロジェクトを作成し、一意な `project-token` をコピーします。

<video autoPlay muted playsInline loop style="width:520px; margin: 0 auto;">
  <source
    src="/intro-to-storybook/chromatic-setup-learnstorybook.mp4"
    type="video/mp4"
  />
</video>

Storybook で視覚的なリグレッションテストをセットアップするには以下の Chromatic テストコマンドを実行します。コマンドの `<project-token>` の場所に先ほどコピーした一意なトークンを追加してください。

```bash
npx chromatic --project-token=<project-token>
```

<div class="aside">
もし Storybook のビルドスクリプトを変更している場合はこのコマンドに<a href="https://www.chromatic.com/docs/setup#command-options">オプション</a>を追加する必要があるかもしれません。
</div>

最初のテストが終わったら、ストーリーのテスト基準が出来上がります。つまり、それぞれのストーリーのスクリーンショットが「良い」状態となるのです。以降のストーリーへの変更はこの基準をもとに比較されます。

![Chromatic の基準](/intro-to-storybook/chromatic-baselines.png)

## UI の変更を検知する

視覚的なリグレッションテストは UI コードにより描画されたイメージが基準となるイメージと比較されることにより成り立ちます。もし UI の変更が検知されたら、通知が来ます。`Task` コンポーネントの背景を変更して確認してみましょう。

![コードの変更点](/intro-to-storybook/chromatic-change-to-task-component.png)

この変更でタスクの背景色が変わります。

![タスクの背景の変更](/intro-to-storybook/chromatic-task-change.png)

先ほどのコマンドを使用してもう一度 Chromatic テストを実行します。

```bash
npx chromatic --project-token=<project-token>
```

リンクをクリックすれば、Web ページで変更内容が見られます。

![Chromatic で見る UI の変更内容](/intro-to-storybook/chromatic-catch-changes.png)

とてもたくさん変更されていますね！`Task` はコンポーネント階層で `TaskList` と `InboxScreen` の子供なので、少しの変更で雪だるま式に大規模なリグレッションが発生します。このような状況となるからこそ、テストメソッドの他に視覚的なリグレッションテストが必要となるのです。

![UI minor tweaks major regressions](/intro-to-storybook/minor-major-regressions.gif)

## 変更をレビューする

視覚的なリグレッションテストはコンポーネントが意図せず変更されていないことを保障します。しかし、その変更が意図的であるかどうかを判別するのは、やはり人になります。

もし意図的な変更であるならば、基準を更新すれば、最新のストーリーが今後の比較に使用されるようになります。そうでなければ、修正が必要です。

<video autoPlay muted playsInline loop style="width:480px; margin: 0 auto;">
  <source
    src="/intro-to-storybook/website-workflow-review-merge-optimized.mp4"
    type="video/mp4"
  />
</video>

モダンなアプリケーションはコンポーネントから作られていますので、コンポーネントのレベルでテストするのが重要です。そうすることで、他のコンポーネントの変更による影響を受けた画面や複合的なコンポーネントではなく、変化の原因であるコンポーネントを特定するのに役立ちます。

## 変更をマージする

UI の変更をレビューしたら、その変更でバグが起きていないことがわかり、自信をもってマージできます。赤色の背景が気に入ったのであれば、変更を受け入れ、そうでなければ元の状態に戻します。

![マージの準備ができた変更内容](/intro-to-storybook/chromatic-review-finished.png)

Storybook はコンポーネントを**作る**のに役立ち、テストはコンポーネントを**保つ**のに役立ちます。視覚的なテスト、スナップショットテスト、単体テスト、視覚的なリグレッションテストの 4 種類をこのチュートリアルで学びました。最後の 3 つは CI スクリプトに追加することで自動化することができます。これによりコンポーネントのバグに気づかないことを心配をせずにリリースできます。このワークフロー全体は以下の図の通りです。

![視覚的なリグレッションテストのワークフロー](/intro-to-storybook/cdd-review-workflow.png)
