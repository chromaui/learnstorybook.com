---
title: '打造簡易元件'
tocTitle: '簡易元件'
description: '打造獨立的簡易元件'
commit: '97d6750'
---

我們會按照[元件驅動開發](https://www.componentdriven.org/) (CDD) 方法論來打造 UI，是「由下而上」的流程。從元件開始，一路至各種畫面。CDD 在打造 UI 時，面臨不斷擴大的複雜程度很有幫助。

## 工作事項 (Task)

![工作事項元件的三種狀態](/intro-to-storybook/task-states-learnstorybook.png)

`工作事項`是應用程式裡的核心元件。每個工作事項只會根據它的狀態，而有一些外觀上的不同。顯示有打鉤（沒打鉤）狀態的 checkbox、工作事項的資訊和可以在清單上把工作事項上下移動的「標記」按鈕 。這樣子，props 就會有：

- `title` - 描述工作事項的字串
- `state` - 工作事項目前所屬清單，以及是完成的嗎？

開始打造`工作事項`的時候，首先要撰寫狀態的測試，對應上面提到工作事項的類型。接著，使用模擬資料在 Storybook 打造獨立元件。執行每個狀態時，元件的外觀是手動進行測試。

## 做好準備

首先，新增工作項目元件，還有搭檔的 story 檔案：`src/components/Task.js` 和 `src/components/Task.stories.js`。

一開始，先做好`工作事項`的基礎設定，只需帶入知道會用到的屬性，還有兩個在工作事項可以執行的動作（在清單之間移動）：

```javascript
// src/components/Task.js

import React from 'react';

export default function Task({ task: { id, title, state }, onArchiveTask, onPinTask }) {
  return (
    <div className="list-item">
      <input type="text" value={title} readOnly={true} />
    </div>
  );
}
```

在上面，我們根據待辦事項 app 現有的 HTML 結構，把`工作事項`語法直覺地 render 出來。

接下來，要在 story 檔案蓋出工作事項的 3 種測試狀態：

```javascript
// src/components/Task.stories.js

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
    updatedAt: new Date(2018, 0, 1, 9, 0),
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
- `title` -- 在 Storybook app 側邊欄找到元件的名字；
- `excludeStories` -- story 檔案裡的 export，但不應被 Storybook render 為 story；
- `argTypes` -- 設定每個 story 的[參數](https://storybook.js.org/docs/react/api/argtypes)行為。

要開始 Storybook,我們先運`行 註冊元件的`storiesOf()`函式. 我們為元件新增 _顯示名稱 - Storybook 應用程式側欄上顯示的名稱_.

`action()`允許我們建立一個回撥, 當在 Storybook UI 的面板中 單擊這個 **action** 時 回撥觸發. 因此,當我們構建一個 pin 按鈕 時,我們將能夠在 測試 UI 中 確定按鈕單擊 是否成功.

由於我們需要將 相同的一組操作 傳遞給 元件的所有排列,因此將它們捆綁到`actions`變數 並 使用 React`{...actions}`的`porps`擴充套件以立即傳遞它們. `<Task {...actions}>`相當於`<Task onPinTask={actions.onPinTask} onArchiveTask={actions.onArchiveTask}>`.

關於捆綁`actions`的另一個好處就是,你可以`export-暴露`它們,用於重用該元件的元件,我們稍後會看到.

為了定義我們的故事,我們用`add()`,一次一個為我們的每個測試狀態生成一個故事. `add`第二個引數是一個函式,它返回一個給定狀態的渲染元素 (即帶有一組`props`的元件類) - 就像一個 React[無狀態功能元件](https://reactjs.org/docs/components-and-props.html#function-and-class-components).

在建立故事時,我們使用基本任務 (`task`) 構建元件期望的 任務的形狀. 這通常是 根據真實資料的模型建模的. 再次,正如我們所看到的,`export`這種形狀將使我們能夠在以後的故事中重複使用它.

<div class="aside">
<a href="https://storybook.js.org/docs/react/essentials/actions"><b>Actions</b></a> 幫助您在隔離構建UI元件時 驗證互動. 通常，您無法訪問應用程式上下文中的函式和狀態。 使用 <code>action()</code> 將它們存入.
</div>

## 配置

我們還必須對 Storybook 的配置設定 (`.storybook/config.js`) 做一個小改動,讓它注意到我們的`.stories.js`檔案並使用我們的 CSS 檔案. 預設情況下, Storybook 會查詢故事`/stories`目錄; 本教程使用類似於`.test.js`的命名方案, 這個命令是 **CRA** 贊成的用於自動化測試的方案.

```javascript
import { configure } from '@storybook/react';
import '../src/index.css';

const req = require.context('../src', true, /\.stories.js$/);

function loadStories() {
  req.keys().forEach(filename => req(filename));
}

configure(loadStories, module);
```

完成此操作後,重新啟動 Storybook 伺服器 應該會產生 三個任務狀態的測試用例:

<video autoPlay muted playsInline controls >
  <source
    src="/intro-to-storybook//inprogress-task-states.mp4"
    type="video/mp4"
  />
</video>

## 建立狀態

現在我們有 Storybook 設定,匯入的樣式和構建的測試用例,我們可以快速開始實現元件的 HTML,以匹配設計.

該元件目前仍然是基本的. 首先編寫實現設計的程式碼,不用過多細節:

```javascript
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
          <a onClick={() => onPinTask(id)}>
            <span className={`icon-star`} />
          </a>
        )}
      </div>
    </div>
  );
}
```

上面的附加 markup 與我們之前匯入的 CSS 相結合,產生以下 UI:

<video autoPlay muted playsInline loop>
  <source
    src="/intro-to-storybook/finished-task-states.mp4"
    type="video/mp4"
  />
</video>

## 特別資料要求

最好的做法是`propTypes`在 React 中 指定元件所需的 資料形狀. 它不僅可以自我記錄,還有助於及早發現問題.

```javascript
import React from 'react';
import PropTypes from 'prop-types';

function Task() {
  ...
}

Task.propTypes = {
  task: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    state: PropTypes.string.isRequired,
  }),
  onArchiveTask: PropTypes.func,
  onPinTask: PropTypes.func,
};

export default Task;
```

現在,如果任務元件被濫用,則會出現開發警告.

<div class="aside">
另一種實現方法是使用 類似TypeScript的JavaScript型別系統 來為元件屬性 建立型別。
</div>

## 元件構建!

我們現在已成功構建了一個元件,沒用到伺服器或執行整個前端應用程式. 下一步是以類似的方式逐個構建剩餘的 Taskbox 元件.

如您所見,開始單獨構建元件非常簡單快捷. 我們可以期望生成更高質量的 UI,減少錯誤和更多打磨,因為它可以挖掘並測試每個可能的狀態.

## 自動化測試

Storybook 為我們提供了一種在施工期間,`視覺化`測試我們的應用程式.在我們繼續開發應用程式時,"故事"將有助於確保我們不會在視覺上打破我們的任務.
但是,在這個階段,這是一個完全手動的過程,有人必須努力點選每個測試狀態,並確保它呈現良好且沒有錯誤或警告.
我們不能自動這樣做嗎?

### 快照測試

快照測試是指,記錄 帶一定輸入的元件的"已知良好"輸出,然後,將來 輸出發生變化時標記元件 的做法.
這補充了 Storybook,因為快照 是檢視 元件新版本 並 檢查更改的快速方法.

<div class="aside">
確保您的元件呈現 <b>不變</b> 的資料，以便每次快照測試都不會失敗。 注意日期或隨機生成的值等內容。
</div>

需要[Storyshots 外掛](https://github.com/storybooks/storybook/tree/master/addons/storyshots)為每個故事建立 快照測試.
通過新增開發依賴項來使用它:

```bash
yarn add --dev @storybook/addon-storyshots react-test-renderer
```

然後建立一個`src/storybook.test.js`檔案中包含以下內容:

```javascript
import initStoryshots from '@storybook/addon-storyshots';
initStoryshots();
```

完成上述操作後,我們就可以運行了`yarn test`並看到以下輸出:

![Task test runner](/intro-to-storybook/task-testrunner.png)

我們現在為每個`Task`故事進行快照測試. 如果我們改變了`Task`的實現,我們會提示您驗證更改.
