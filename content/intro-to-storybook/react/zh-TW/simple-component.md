---
title: '打造簡易元件'
tocTitle: '簡易元件'
description: '打造獨立的簡易元件'
commit: 'c07ce59'
---

我們會按照[元件驅動開發](https://www.componentdriven.org/) (CDD) 方法論來打造 UI，是「由下而上」的流程。從元件開始，一路至各種畫面。CDD 在打造 UI 時，面臨不斷擴大的複雜程度很有幫助。

## 工作事項 (Task)

![工作事項元件的三種狀態](/intro-to-storybook/task-states-learnstorybook.png)

`Task` 是應用程式裡的核心元件。每個工作事項只會根據它的狀態，而有一些外觀上的不同。顯示有打鉤（沒打鉤）狀態的 checkbox、工作事項的資訊和可以在清單上把工作事項上下移動的「標記」按鈕 。這樣子，props 就會有：

- `title` - 描述工作事項的字串
- `state` - 工作事項目前所屬清單，以及是完成的嗎？

開始打造 `Task` 的時候，首先要撰寫狀態的測試，對應上面提到工作事項的類型。接著，使用模擬資料在 Storybook 打造獨立元件。執行每個狀態時，元件的外觀是手動進行測試。

## 做好準備

首先，新增工作項目元件，還有搭檔的 story 檔案：`src/components/Task.js` 和 `src/components/Task.stories.js`。

一開始，先做好 `Task` 的基礎設定，只需帶入知道會用到的屬性，還有兩個在工作事項可以執行的動作（在清單之間移動）：

```js:title=src/components/Task.js
import React from 'react';

export default function Task({ task: { id, title, state }, onArchiveTask, onPinTask }) {
  return (
    <div className="list-item">
      <input type="text" value={title} readOnly={true} />
    </div>
  );
}
```

在上面，我們根據待辦事項 app 現有的 HTML 結構，把 `Task` 語法直覺地 render 出來。

接下來，要在 story 檔案蓋出工作事項的 3 種測試狀態：

```js:title=src/components/Task.stories.js
import React from 'react';

import Task from './Task';

export default {
  component: Task,
  title: 'Task',
};

const Template = args => <Task {...args} />;

export const Default = Template.bind({});
Default.args = {
  task: {
    id: '1',
    title: 'Test Task',
    state: 'TASK_INBOX',
    updatedAt: new Date(2021, 0, 1, 9, 0),
  },
};

export const Pinned = Template.bind({});
Pinned.args = {
  task: {
    ...Default.args.task,
    state: 'TASK_PINNED',
  },
};

export const Archived = Template.bind({});
Archived.args = {
  task: {
    ...Default.args.task,
    state: 'TASK_ARCHIVED',
  },
};
```

在 Storybook，組織方式有兩個基本階層：元件和其子 story。把每個 story 想成是該元件的排列 (permutation)。只要有必要，每個元件可以有無限多個 story。

- **元件**
  - Story
  - Story
  - Story

為了要讓 Storybook 知道正在撰寫文件的元件，先做好 `default` export，包含：

- `component` -- 元件它本人；
- `title` -- 在 Storybook app 側邊欄找到元件的名字。

若要定義出各式各樣的 story，就為每個要測試的狀態 export 函式，以此產生 story。Story 就是根據設定好的狀態，回傳 render 出元素的函式（也就是有一組 prop 的元件），這跟 [Functional Component](https://reactjs.org/docs/components-and-props.html#function-and-class-components) 一樣。

既然已經排列出元件，賦值給稱為 `Template` 的變數會很方便。採用這樣的模式來做 story 可以減少撰寫和維護程式碼的份量。

<div class="aside">
💡 <code>Template.bind({})</code> 是 <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/bind">標準的 JavaScript</a> 技巧，用來複製函式。此技巧是用來讓每個輸出的 story 可以設定各自的參數，但使用完全相同的方法。
</div>

參數，或簡稱為 [`args`](https://storybook.js.org/docs/react/writing-stories/args)，可以透過 Controls 外掛即時更新元件，而且不用重啟 Storybook。一旦 [`args`](https://storybook.js.org/docs/react/writing-stories/args) 值改變了，元件也跟著變。

在新增 story 的時候，會用到基本的 `task` 參數，來蓋出元件應該要有的工作事項外觀。通常，是根據真實資料的模樣進行模擬。這裡還是一樣，以這樣的結構來輸出，讓我們可以在之後做的 story 重複使用，接下來還會有。

<div class="aside">
💡 在打造各自獨立的 UI 元件時，<a href="https://storybook.js.org/docs/react/essentials/actions"><b>Actions</b></a> 協助驗證互動。有時候，app 裡有些無法讀到的函式和狀態，若想放進來，就要使用 <code>action()</code>。
</div>

## 設定

Storybook 的設定還要做些更新，不僅能夠顯示新增的 story，還可以使用應用程式的 CSS 檔案（位置在 `src/index.css`）。

一開始，先把 Storybook 設定檔 (`.storybook/main.js`) 改為：

```diff:title=.storybook/main.js
module.exports = {
- stories: [
-   '../src/**/*.stories.mdx',
-   '../src/**/*.stories.@(js|jsx|ts|tsx)'
- ],
+ stories: ['../src/components/**/*.stories.js'],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/preset-create-react-app',
  ],
};
```

以上更新完成之後，在 `.storybook` 資料夾裡的 `preview.js` 改成：

```diff:title=.storybook/preview.js
+ import '../src/index.css';

//👇 Configures Storybook to log the actions( onArchiveTask and onPinTask ) in the UI.
export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
};
```

[`parameter`](https://storybook.js.org/docs/react/writing-stories/parameters) 通常使用在控制 Storybook 功能和 addon 的行為。在這裡，是為了要用來設定 `action`（模擬 callback）的處理方式。

按下 `action` 後，就可以在 Storybook UI 裡的 **actions** 區塊產生 callback。因此，在做圖釘按鈕時，就可以在測試 UI 看出點擊按鈕是否成功。

做好這些事情後，重新開啟 Storybook 伺服器，就應該會產生 3 種 Task 狀態的測試案例：

<video autoPlay muted playsInline loop>
  <source
    src="/intro-to-storybook/inprogress-task-states-6-0.mp4"
    type="video/mp4"
  />
</video>

## 建立狀態

既然已經設定好 Storybook、加入樣式，也做好測試案例，就可以迅速開始製作符合設計的元件 HTML。

現在，元件還是最基本的。首先，先寫下符合設計的程式碼，但不必非常仔細：

```js:title=src/components/Task.js
import React from 'react';

export default function Task({ task: { id, title, state }, onArchiveTask, onPinTask }) {
  return (
    <div className={`list-item ${state}`}>
      <label className="checkbox">
        <input
          type="checkbox"
          defaultChecked={state === 'TASK_ARCHIVED'}
          disabled={true}
          name="checked"
        />
        <span className="checkbox-custom" onClick={() => onArchiveTask(id)} />
      </label>
      <div className="title">
        <input type="text" value={title} readOnly={true} placeholder="Input title" />
      </div>

      <div className="actions" onClick={event => event.stopPropagation()}>
        {state !== 'TASK_ARCHIVED' && (
          // eslint-disable-next-line jsx-a11y/anchor-is-valid
          <a onClick={() => onPinTask(id)}>
            <span className={`icon-star`} />
          </a>
        )}
      </div>
    </div>
  );
}
```

上面出現的語法結合之前匯入的 CSS，就會產生以下 UI：

<video autoPlay muted playsInline loop>
  <source
    src="/intro-to-storybook/finished-task-states-6-0.mp4"
    type="video/mp4"
  />
</video>

## 指定必備資料

為了符合元件應該有的資料樣貌，使用 `propTypes` 是最佳作法。不僅讓本身就是文件說明，也對儘早察覺問題有幫助。

```diff:title=src/components/Task.js
import React from 'react';
import PropTypes from 'prop-types';

export default function Task({ task: { id, title, state }, onArchiveTask, onPinTask }) {
  // ...
}

+ Task.propTypes = {
+  /** Composition of the task */
+  task: PropTypes.shape({
+    /** Id of the task */
+    id: PropTypes.string.isRequired,
+    /** Title of the task */
+    title: PropTypes.string.isRequired,
+    /** Current state of the task */
+    state: PropTypes.string.isRequired,
+  }),
+  /** Event to change the task to archived */
+  onArchiveTask: PropTypes.func,
+  /** Event to change the task to pinned */
+  onPinTask: PropTypes.func,
+ };
```

現在，若 Task 元件使用方式錯了，就會在開發環境出現警告。

<div class="aside">
💡 另一種達成相同目的的方式，是使用像是 TypeScript 這樣的 JavaScript 型別系統，為元件的 properties 增加 type。
</div>

## 完成元件！

我們已經成功打造出不必依靠伺服器，或得在整組前端應用程式運行的元件。下一步，是用類似的節奏，逐一蓋出剩下的 Taskbox 元件。

可見著手打造獨立的元件非常簡單且迅速。可以預期因為能深入探查和測試各種狀態，而能建立更高品質、更少 bug 且更精美的 UI。

## 自動化測試

Storybook 讓我們在建造應用程式的 UI 過程中，方便進行手動測試。Story 可以協助確保在持續開發 App 的過程中不會搞壞 Task 的外觀。只不過，這時候是完全是手動的流程，得要花時間點選每個測試狀態，確保沒有錯誤或警告的正常顯示。難道就不能自動進行嗎？

### 快照測試

快照測試的意思是：記錄元件在接到輸入後的「已知、正常」輸出，並且在之後有變化時標出該元件。這樣補足了 Storybook，因為是查看新版本元件、檢視改變的快速方法。

<div class="aside">
💡 確保元件輸出的資料不會變，快照測試才不會每次都失敗。請注意日期或隨機產生的數值。
</div>

使用 [Storyshots addon](https://github.com/storybooks/storybook/tree/master/addons/storyshots) 就可以為每個 story 做好快照測試。加入以下的開發套件即可：

```bash
yarn add -D @storybook/addon-storyshots react-test-renderer
```

接著，新增有以下內容的 `src/storybook.test.js` 檔案：

```js:title=src/storybook.test.js
import initStoryshots from '@storybook/addon-storyshots';
initStoryshots();
```

這樣就完成了，執行 `yarn test` 可以看到以下的結果：

![Task test runner](/intro-to-storybook/task-testrunner.png)

現在，我們有每個 `Task` story 的快照測試。只要 `Task` 的作法改變了，就會接到要驗證更變的提示。

<div class="aside">
💡 別忘了在 git 提交改好的東西！
</div>
