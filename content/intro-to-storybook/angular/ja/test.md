---
title: 'UI コンポーネントをテストする'
tocTitle: 'テスト'
description: 'UI コンポーネントのテスト手法について学びましょう'
---

Storybook のチュートリアルをテスト抜きには終われません。テストは高品質な UI を作成するのに必要なことです。疎結合なシステムにおいては、些細な変更で大きなリグレッション (手戻り) をもたらすことがあるのです。既に 3 種類のテストについて学びました:

- **手動テスト**では、コンポーネントの正しさを開発者が手動で確認します。コンポーネントを作成する際、見た目が問題ないかチェックするのに役立ちます。
- **スナップショットテスト**では、Storyshots を使用し、コンポーネントのマークアップを記録します。描画時のエラーや警告の原因となるマークアップの変更を常に把握するのに役立ちます。
- **単体テスト**では、Jest を使用し、コンポーネントへの決まった入力より同様の出力が出ていることを確認します。コンポーネントの機能性をテストするのに優れています。

## 「でも、見た目は大丈夫？」

残念ながら、前述のテスト方法だけでは UI のバグを防ぎきれません。UI というのは主観的なものなので、テストが厄介なのです。手動テストは、その名の通り、手動です。UI のスナップショットテストでは多数の偽陽性を発生させてしまいます。ピクセルレベルの単体テストは価値があまりありません。Storybook のテスト戦略には視覚的なリグレッションテストが不可欠です。

## Storybook 向けのビジュアルテスト

視覚的なリグレッションテスト (ビジュアルテスト) は、見た目の変更を検出するために設計されています。ビジュアルテストはコミット毎に各ストーリーのスクリーンショットを撮って、前のコミットと比較して変更点を探します。レイアウトや色、サイズ、コントラストといった表示要素の確認にとても適しています。

<video autoPlay muted playsInline loop style="width:480px; margin: 0 auto;">
  <source
    src="/intro-to-storybook/visual-regression-testing.mp4"
    type="video/mp4"
  />
</video>

Storybook は視覚的なリグレッションテスト用の素晴らしいツールです。Storybook において、すべてのストーリーはテスト仕様となるからです。ストーリーを書くたび、仕様が無料でついてきます！

視覚的なリグレッションテスト向けのツールは多々あります。Storybook のメンテナーが作成した無料のホスティングサービスである [**Chromatic**](https://www.chromatic.com/?utm_source=storybook_website&utm_medium=link&utm_campaign=storybook) がおすすめです。Chromatic はクラウド上でビジュアルテストを並列実行します。[前の章](/intro-to-storybook/angular/ja/deploy/)で見たように Storybook をインターネット上に発行出来ます。

## UI の変更を検知する

視覚的なリグレッションテストでは UI コードにより描画されたイメージが基準となるイメージと比較されます。ツールが UI の変更が検知したら、教えてくれます。

それでは、`Task` コンポーネントの背景を変更し、どう動くのか見てみましょう。

変更する前に新しいブランチを作成します:

```shell
git checkout -b change-task-background
```

`TaskComponent` を以下のように変更します:

```diff:title=src/app/components/task.component.ts
<input
  type="text"
  [value]="task?.title"
  readonly="true"
  placeholder="Input title"
+ style="background-color: red;"
/>
```

これでタスクの背景色が変更されます。

![task background change](/intro-to-storybook/chromatic-task-change.png)

この変更をステージングします:

```shell
git add .
```

コミットします:

```shell
git commit -m “change task background to red”
```

そして変更をリモートリポジトリーにプッシュします:

```shell
git push -u origin change-task-background
```

最後に、GitHub のリポジトリーを開き `change-task-background` ブランチのプルリクエストを作成します。

![GitHub にタスクの PR を作成する](/github/pull-request-background.png)

プルリクエストに適切な説明を書き、`Create pull request` をクリックしてください。ページの下部に表示された「🟡 UI Tests」の PR チェックをクリックして下さい。

![GitHub にタスクの PR が作成された](/github/pull-request-background-ok.png)

これで先のコミットによって検出された UI の変更が見られます。

![Chromatic が変更を検知した](/intro-to-storybook/chromatic-catch-changes.png)

とてもたくさん変更されていますね！`Task` はコンポーネント階層で `TaskList` と `InboxScreen` の子供なので、少しの変更で雪だるま式に大規模なリグレッションが発生します。このような状況となるからこそ、テストメソッドの他に視覚的なリグレッションテストが必要となるのです。

![UI のちょっとした変更で大きなリグレッションが発生](/intro-to-storybook/minor-major-regressions.gif)

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

UI の変更をレビューしたら、その変更で意図せずバグを混入させていないことがわかっているので、自信をもってマージできます。赤色の背景が気に入ったのであれば、変更を受け入れ、そうでなければ元の状態に戻します。

![マージの準備ができた変更内容](/intro-to-storybook/chromatic-review-finished.png)

Storybook はコンポーネントを**作る**のに役立ち、テストはコンポーネントを**保つ**のに役立ちます。手動テスト、スナップショットテスト、単体テスト、ビジュアルテストの 4 種類をこのチュートリアルで学びました。最後の 3 種類は、今設定したように、CI に追加することで自動化することができます。これによりコンポーネントのバグに気づかないことを心配をせずにリリースできます。このワークフロー全体は以下の図の通りです。

![視覚的なリグレッションテストのワークフロー](/intro-to-storybook/cdd-review-workflow.png)
