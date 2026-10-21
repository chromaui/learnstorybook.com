---
title: 'アクセシビリティテスト'
tocTitle: 'アクセシビリティテスト'
description: 'アクセシビリティテストをワークフローに組み込む方法を学びましょう'
commit: 'c73e174'
---

ここまで、機能やビジュアルテストに重点を置きながら、段階的に複雑な要素を組みながら UI コンポーネントを構築してきました。しかし、UI 開発において重要な側面であるアクセシビリティについてはまだ対応できていません。

## なぜアクセシビリティ (A11y) が重要なのか？

アクセシビリティとは、視覚、聴覚、運動、認知などの障がいを持つユーザーを含め、すべてのユーザーがコンポーネントを効果的に操作できるようにすることです。アクセシビリティは正しいことであるだけでなく、法的要件や業界標準に基づいてますます義務化されています。これらの要件を踏まえ、アクセシビリティの問題を早い段階で頻繁にテストする必要があります。

## Storybook でアクセシビリティの問題を検知する

Storybook には[アクセシビリティアドオン](https://storybook.js.org/addons/@storybook/addon-a11y) (A11y) が用意されており、コンポーネントのアクセシビリティをテストするのに役立ちます。[axe-core](https://github.com/dequelabs/axe-core) をベースに構築されており、[WCAG の問題の最大 57%](https://www.deque.com/blog/automated-testing-study-identifies-57-percent-of-digital-accessibility-issues/) を検知できます。

どのように動作するか見てみましょう！以下のコマンドでアドオンをインストールします:

```shell
yarn exec storybook add @storybook/addon-a11y
```

<div class="aside">

💡 Storybook の `add` コマンドは、アドオンのインストールと設定を自動化します。利用可能な他のコマンドについては、[公式ドキュメント](https://storybook.js.org/docs/api/cli-options)を参照してください。

</div>

Storybook を再起動すると、UI に新しいアドオンが有効になっているのが確認できます。

![Storybook で Task のアクセシビリティの問題を表示](/intro-to-storybook/accessibility-issue-task-non-react-9-0.png)

ストーリーを順番に確認すると、あるテスト状態においてアドオンがアクセシビリティの問題を検出していることがわかります。[**色のコントラスト**](https://dequeuniversity.com/rules/axe/4.10/color-contrast?application=axeAPI)に関する違反は、タスクのタイトルと背景の間に十分なコントラストがないことを意味しています。アプリケーションの CSS（`src/index.css`）でテキストの色をより暗いグレーに変更することで、すぐに修正できます。

```diff:title=src/index.css
.list-item.TASK_ARCHIVED input[type="text"] {
- color: #a0aec0;
+ color: #4a5568;
  text-decoration: line-through;
}
```

これで完了です。UI のアクセシビリティを確保するための最初のステップを踏み出しました。しかし、まだ作業は終わりではありません。アクセシビリティが保たれた UI を維持することは継続的なプロセスであり、アプリが進化して UI が複雑になっても、新たなアクセシビリティの問題が導入されてリグレッションが発生しないように常に監視し続ける必要があります。

## Chromatic によるアクセシビリティテスト

Storybook のアクセシビリティアドオンを使えば、開発中にアクセシビリティの問題をテストして即座にフィードバックを得ることができます。しかし、アクセシビリティの問題を追跡し続けることは難しく、どの問題を優先的に対処すべきかを判断するには専門的な取り組みが必要になることもあります。ここで Chromatic が役立ちます。すでに見てきたように、Chromatic はコンポーネントの[ビジュアルテスト](/intro-to-storybook/vue/ja/test/)を行い、リグレッションを防ぐのに役立ちました。Chromatic の[アクセシビリティテスト機能](https://www.chromatic.com/docs/accessibility)を使って、UI のアクセシビリティを維持し、新しい違反を誤って導入しないようにしましょう。

### アクセシビリティテストを有効にする

Chromatic のプロジェクトに移動し、**Manage** ページを開きます。**Enable** ボタンをクリックして、プロジェクトのアクセシビリティテストを有効にします。

![Chromatic のアクセシビリティテストを有効化](/intro-to-storybook/chromatic-a11y-tests-enabled.png)

### アクセシビリティテストを実行する

アクセシビリティテストを有効にし、CSS のコントラストの問題を修正したので、変更をプッシュして新しい Chromatic ビルドをトリガーしましょう。

```shell:clipboard=false
git add .
git commit -m "Fix color contrast accessibility violation"
git push
```

Chromatic が実行されると、[アクセシビリティのベースライン](https://www.chromatic.com/docs/accessibility/#what-is-an-accessibility-baseline)が確立されます。これは、今後のテストが結果を比較するための基準となるものです。これにより、新たなリグレッションを導入することなく、アクセシビリティの問題をより効果的に優先順位付けし、対処し、修正できるようになります。

<!--

TODO: Follow up with Design for an updated asset
 - Needs a React and non-React version to ensure parity with the tutorial
 -->

![Chromatic のアクセシビリティテスト付きビルド](/intro-to-storybook/chromatic-build-a11y-tests-non-react.png)

これで、開発の各段階で UI のアクセシビリティを確保するワークフローを構築できました。Storybook は開発中のアクセシビリティの問題を検知し、Chromatic はアクセシビリティのリグレッションを追跡して、時間をかけて段階的に修正しやすくしてくれます。
