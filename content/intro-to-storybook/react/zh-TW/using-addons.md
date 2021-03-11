---
title: '外掛'
tocTitle: '外掛'
description: '了解整合、使用熱門功能：Control 外掛的方法'
commit: 'a23f4d0'
---

Storybook 有精美的[外掛](https://storybook.js.org/docs/react/configure/storybook-addons)生態系，可以用來加強團隊裡的開發者體驗。[在這裡](https://storybook.js.org/addons)可以翻閱。

If you've been following along with this tutorial, you've already encountered multiple addons, and set one up in the [Testing](/intro-to-storybook/react/en/test/) chapter.

There are addons for every possible use case. It would take forever to write about them all. Let's integrate one of the most popular addons: [Controls](https://storybook.js.org/docs/react/essentials/controls).

## Controls 是什麼？

Controls 讓設計師和開發者可以輕易地探索元件行為，只要把玩參數即可，不必寫程式。Controls 是 story 旁邊新增的區塊，因此可以即時編輯參數。

Storybook 一出廠就有安裝好的 Controls。毋需額外設定。

<video autoPlay muted playsInline loop>
  <source
    src="/intro-to-storybook/controls-in-action.mp4"
    type="video/mp4"
  />
</video>

## 外掛讓 Storybook 解鎖新的工作流程

Storybook 是擅長以[元件為基礎的開發環境](https://www.componentdriven.org/)。Controls 外掛讓 Storybook 進化為互動式文件工具。

### 用 Controls 找出極端案例

有了 Controls，品管工程師、UI 工程師或其他利害關係人就可以把元件推向極致！請想想以下的範例：如果在 Task 增加**超大**一串字？

![喔不！右邊的內容被截斷了！](/intro-to-storybook/task-edge-case.png)

這就不對勁了啊！文字已經超出 Task 元件的邊界。

Controls 可以快速驗證輸入進元件的內容。這裡用超長字串當作範例，減少察覺 UI 問題得花的工。

現在，在 `Task.js` 加入樣式，修正超出範圍的問題。

```diff:title=src/components/Task.js
<input
  type="text"
  value={title}
  readOnly={true}
  placeholder="Input title"
+ style={{ textOverflow: 'ellipsis' }}
/>
```

![這樣好多了。](/intro-to-storybook/edge-case-solved-with-controls.png)

搞定了！文字達到 Task 範圍的邊界時，會有個帥氣的省略符號。

### 以另一組 story 避免影響已完成的地方

之後在 Controls 輸入相同字串，就可以手動重現問題。不過，只要展示出這樣的極端案例，就會更輕鬆。回歸測試的涵蓋範圍增加了，也為團隊其他人明確指出元件的限制。

在 `Task.stories.js`，以另一組 story 新增長文字的情況：

```js:title=src/components/Task.stories.js
const longTitleString = `This task's name is absurdly large. In fact, I think if I keep going I might end up with content overflow. What will happen? The star that represents a pinned task could have text overlapping. The text could cut-off abruptly when it reaches the star. I hope not!`;

export const LongTitle = Template.bind({});
LongTitle.args = {
  task: {
    ...Default.args.task,
    title: longTitleString,
  },
};
```

可以重製極端案例後，處理起來就輕鬆了。

<video autoPlay muted playsInline loop>
  <source
    src="/intro-to-storybook/task-stories-long-title.mp4"
    type="video/mp4"
  />
</video>

如果進行的是[視覺測試](/intro-to-storybook/react/en/test/)，只要省略的作法壞了，也會看得到。若沒有加上測試，少見的極端案例很容易忘記！

<div class="aside"><p>💡 Controls 可以讓非開發者輕鬆把玩元件和 story。本文所提到的只是一小部分，建議在<a href="https://storybook.js.org/docs/react/essentials/controls">官方文件</a>深入閱讀。然而，外掛還有更多讓你自訂 Storybook，得以符合工作流程的方法。在打造外掛的指南，就會教你如何<a href="/create-an-addon/react/en/introduction/">自製外掛</a>，讓開發工作流程更有威力。</p></div>

### 合併

別忘了在 git 把更新的東西合併！
