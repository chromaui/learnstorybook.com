---
title: 'アドオン'
tocTitle: 'アドオン'
description: 'アドオンを組み込んで利用する方法を、人気のある例を使って学びましょう'
commit: 'b3bd2c9'
---

Storybook にはチームの開発効率を向上する堅牢な[アドオン](https://storybook.js.org/docs/angular/configure/storybook-addons)のエコシステムがあります。[こちら](https://storybook.js.org/addons) でアドオンのリストが見られます。

ここまでチュートリアルを進めてきたのであれば、すでにいくつかのアドオンに遭遇し、[テストの章](/intro-to-storybook/angular/ja/test/)では導入もしています。

多様なユースケースに対応するためのアドオンがあるので、それを全て説明することは出来ません。ここでは最も人気のあるアドオンである [コントロールアドオン](https://storybook.js.org/docs/angular/essentials/controls) を導入してみましょう。

## コントロールアドオンとは

コントロールアドオンはデザイナーや、開発者がコードを書かずにパラメータを*いじって遊びながら*コンポーネントの挙動を探求できるようにするアドオンです。このアドオンはストーリーの隣にパネルを表示し、そこから直にコンポーネントの引数を編集できます。

Storybook を新たにインストールすると、はじめからコントロールアドオンが使用可能です。追加で設定する必要はありません。

<video autoPlay muted playsInline loop>
  <source
    src="/intro-to-storybook/controls-in-action.mp4"
    type="video/mp4"
  />
</video>

## アドオンで Storybook の新たなワークフローを開放する

Storybook はすばらしい[コンポーネント駆動開発](https://www.componentdriven.org/)の環境です。コントロールアドオンを使用することで、Storybook はインタラクティブなドキュメンテーションツールに進化します。

## コントロールアドオンをエッジケースを見つけるのに使用する

コントロールアドオンを使用すれば、品質管理者や、UI エンジニアや、その他のステークホルダーがコンポーネントを限界まで操作できます！例えば `TaskComponent` コンポーネントに*大量の*文字列を渡したらどうなるでしょうか。

![しまった！右側の文字列が切れている！](/intro-to-storybook/task-edge-case.png)

これはマズいです。タスクコンポーネントの境界を越えて文字列があふれています。

コントロールアドオンを使用すればコンポーネントにいろいろな入力をして素早く確認できます。今回は長い文字列を入力しました。これで UI の問題を発見する際の作業を減らすことができます。

それでは `task.component.ts` にスタイルを追加して、この文字切れ問題を解決しましょう:

```diff:title=src/app/components/task.component.ts
<input
  type="text"
  [value]="task?.title"
  readonly="true"
  placeholder="Input title"
+ style="text-overflow: ellipsis;"
/>
```

![良くなりました](/intro-to-storybook/edge-case-solved-with-controls.png)

問題は解決しました！文字列がタスクの境界に達したらかっこいい省略記号で切り詰められるようになりました。

## リグレッションを回避するためストーリーを追加する

今後もコントロールアドオンを使用して、手動で同じ入力をすればいつでもこの問題は再現可能です。ですが、このエッジケースに対応するストーリーを書く方が簡単です。ストーリーを書くことにより、リグレッションテストのカバレッジが向上しますし、コンポーネントの限界をチームメンバーに明示することが出来ます。

それでは `task.stories.ts` ファイルに長い文字列が指定された場合のストーリーを追加しましょう:

```ts:title=src/app/components/task.stories.ts
const longTitleString = `This task's name is absurdly large. In fact, I think if I keep going I might end up with content overflow. What will happen? The star that represents a pinned task could have text overlapping. The text could cut-off abruptly when it reaches the star. I hope not!`;

export const LongTitle = Template.bind({});
LongTitle.args = {
  task: {
    ...Default.args.task,
    title: longTitleString,
  },
};
```

これで、このエッジケースをいつでも再現できるようになりました:

<video autoPlay muted playsInline loop>
  <source
    src="/intro-to-storybook/task-stories-long-title.mp4"
    type="video/mp4"
  />
</video>

[ビジュアルテスト](/intro-to-storybook/angular/ja/test/)を使用している場合は、文字の省略が壊れた場合に分かるようになります。このように曖昧なエッジケースはテストなしには忘れてしまいがちです！

<div class="aside">
<p>💡 開発者ではない人でも、コントロールアドオンを使うことでコンポーネントやストーリーを触れるようになります。さらに理解を深めるためには<a href="https://storybook.js.org/docs/angular/essentials/controls">公式のドキュメント</a>を見てください。アドオンを使用して Storybook をカスタマイズする方法は 1 つではありません。
</div>

### 変更をマージする

変更を忘れずに Git にマージしてください！
