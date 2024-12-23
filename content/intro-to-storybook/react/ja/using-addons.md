---
title: 'アドオン'
tocTitle: 'アドオン'
description: '人気のコントロールアドオンの使用方法を学びましょう'
commit: 'f89cfe0'
---

Storybook にはチームの開発効率を向上する堅牢な[アドオン](https://storybook.js.org/docs/react/configure/storybook-addons)のエコシステムがあります。[こちら](https://storybook.js.org/addons) でアドオンのリストが見られます。

ここまでチュートリアルを進めてきたのであれば、すでにいくつかのアドオンに遭遇し、[テストの章](/intro-to-storybook/react/ja/test/)では導入もしています。

多様なユースケースに対応するためのアドオンがあるので、それをすべて説明することはできません。ここではもっとも人気のあるアドオンである [コントロールアドオン](https://storybook.js.org/docs/react/essentials/controls) を導入してみましょう。

## コントロールアドオンとは

コントロールアドオンはデザイナーや、開発者がコードを書かずにパラメータを*いじって遊びながら*コンポーネントの挙動を探求できるようにするアドオンです。このアドオンはストーリーの隣にパネルを表示し、そこから直にコンポーネントの引数を編集できます。

Storybook を新たにインストールすると、はじめから Contorls が使用可能です。追加の設定は必要ありません。

<video autoPlay muted playsInline loop>
  <source
    src="/intro-to-storybook/controls-in-action-7-0.mp4"
    type="video/mp4"
  />
</video>

## アドオンで Storybook の新たなワークフローを開放する

Storybook はすばらしい[コンポーネント駆動開発](https://www.componentdriven.org/)の環境です。コントロールアドオンを使用することで、Storybook はインタラクティブなドキュメンテーションツールに進化します。

## コントロールアドオンをエッジケースを見つけるのに使用する

コントロールアドオンを使用すれば、品質管理者や、UI エンジニアや、その他のステークホルダーがコンポーネントを限界まで操作できます！たとえば `Task` コンポーネントに*大量の*文字列を渡したらどうなるでしょうか。

![しまった！右側の文字列が切れている！](/intro-to-storybook/task-edge-case-7-0.png)

これはマズいです。タスクコンポーネントの境界を越えて文字列があふれています。

コントロールアドオンを使用すればコンポーネントにいろいろな入力をして素早く確認できます。今回は長い文字列を入力しました。これで UI の問題を発見する際の作業を減らすことができます。

それでは `Task.jsx` にスタイルを追加して、この文字切れ問題を解決しましょう。

```diff:title=src/components/Task.jsx
import React from 'react';

export default function Task({ task: { id, title, state }, onArchiveTask, onPinTask }) {
  return (
    <div className={`list-item ${state}`}>
      <label
        htmlFor="checked"
        aria-label={`archiveTask-${id}`}
        className="checkbox"
      >
        <input
          type="checkbox"
          disabled={true}
          name="checked"
          id={`archiveTask-${id}`}
          checked={state === "TASK_ARCHIVED"}
        />
        <span
          className="checkbox-custom"
          onClick={() => onArchiveTask(id)}
        />
      </label>

      <label htmlFor="title" aria-label={title} className="title">
        <input
          type="text"
          value={title}
          readOnly={true}
          name="title"
          placeholder="Input title"
+         style={{ textOverflow: 'ellipsis' }}
        />
      </label>

      {state !== "TASK_ARCHIVED" && (
        <button
          className="pin-button"
          onClick={() => onPinTask(id)}
          id={`pinTask-${id}`}
          aria-label={`pinTask-${id}`}
          key={`pinTask-${id}`}
        >
          <span className={`icon-star`} />
        </button>
      )}
    </div>
  );
}
```

![良くなりました](/intro-to-storybook/edge-case-solved-with-controls-7-0.png)

問題が解決しました！文字列が境界に達すると、かっこいい省略記号で切り詰められるようになりました。

## リグレッションを回避するためストーリーを追加する

今後もコントロールアドオンを使用して、手動で同じ入力をすればいつでもこの問題は再現可能です。ですが、このエッジケースに対応するストーリーを書く方が簡単です。ストーリーを書くことにより、リグレッションテストのカバレッジが向上しますし、コンポーネントの限界をチームメンバーに明示できます。

それでは `Task.stories.jsx` ファイルに長い文字列が指定された場合のストーリーを追加しましょう。

```js:title=src/components/Task.stories.jsx
const longTitleString = `This task's name is absurdly large. In fact, I think if I keep going I might end up with content overflow. What will happen? The star that represents a pinned task could have text overlapping. The text could cut-off abruptly when it reaches the star. I hope not!`;

export const LongTitle = {
  args: {
    task: {
      ...Default.args.task,
      title: longTitleString,
    },
  },
};
```

これで、このエッジケースをいつでも再現できるようになりました。

<video autoPlay muted playsInline loop>
  <source
    src="/intro-to-storybook/task-stories-long-title-7-0.mp4"
    type="video/mp4"
  />
</video>

[ビジュアルテスト](/intro-to-storybook/react/ja/test/)を使用している場合は、文字の省略が壊れた場合にわかるようになります。このように曖昧なエッジケースはテストなしには忘れてしまいがちです！

<div class="aside"><p>💡 開発者でない人でも、コントロールアドオンを使うことでコンポーネントやストーリーを触れるようになります。さらに理解を深めるためには<a href="https://storybook.js.org/docs/react/essentials/controls">公式ドキュメント</a>を参照してください。アドオンを使用して Storybook をカスタマイズする方法は 1 つではありません。おまけの章である、<a href="https://storybook.js.org/docs/react/addons/writing-addons/">アドオンを作る</a>ではアドオンを使用して開発を加速する方法を説明します。</p></div>

<div class="aside">
💡 Git へのコミットを忘れずに行ってください！
</div>
