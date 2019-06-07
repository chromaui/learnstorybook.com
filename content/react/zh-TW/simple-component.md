---
title: "構建一個簡單的元件"
tocTitle: "簡單 元件"
description: "單獨構建一個簡單的元件"
commit: 403f19a
---

我們將按照[元件驅動開發](https://blog.hichroma.com/component-driven-development-ce1109d56c8e) (CDD) 方法論來 構建我們的 UI. 這是一個從"自下而上"開始構建 UI 的過程,從元件開始到整個頁面結束. CDD 可幫助您在構建 UI 時,擺列您所面臨的複雜程度.

## 任務-Task

![Task component in three states](/task-states-learnstorybook.png)

`Task`是我們的應用程式的核心元件. 每個任務的顯示略有不同,具體取決於它所處的`狀態-state`. 我們顯示一個選中 (或未選中) 複選框,一些有關任務的資訊,以及一個"pin"按鈕,允許我們在列表中上下移動任務. 為了把各個它們擺在一起,我們需要下面的 **props**:

- `title` - 描述任務的字串

- `state` - 哪個列表是當前的任務,是否已檢查?

在我們開始構建`Task`時,我們首先編寫 與 上面草圖中不同型別的任務 相對應的測試狀態. 然後我們使用 Storybook 模擬資料 隔離對應狀態元件. 我們將"視覺測試"元件在每個狀態下的外觀.

這個過程類似於[測試驅動的開發(TDD)](https://en.wikipedia.org/wiki/Test-driven_development),我們可以稱之為["Visual-虛擬 TDD"](https://blog.hichroma.com/visual-test-driven-development-aec1c98bed87)

## 獲取設定

首先,讓我們建立任務元件 及 其附帶的 _storybook-故事_ 檔案:

`src/components/Task.js`和`src/components/Task.stories.js`

我們將從基本實現開始,簡單傳入我們需要的`屬性-props` 以及 您可以對任務執行的兩個`on`操作 (在列表之間移動它) :

```javascript
import React from "react";

export default function Task({
  task: { id, title, state },
  onArchiveTask,
  onPinTask
}) {
  return (
    <div className="list-item">
      <input type="text" value={title} readOnly={true} />
    </div>
  );
}
```

上面,我們基於 Todos 應用程式現有 HTML 結構 為 `Task`提供簡單的 markup .

下面, 我們在 故事檔案中 構建 Task 的 三個測試狀態:

```javascript
import React from "react";
import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";

import Task from "./Task";

export const task = {
  id: "1",
  title: "Test Task",
  state: "TASK_INBOX",
  updatedAt: new Date(2018, 0, 1, 9, 0)
};

export const actions = {
  onPinTask: action("onPinTask"),
  onArchiveTask: action("onArchiveTask")
};

storiesOf("Task", module)
  .add("default", () => <Task task={task} {...actions} />)
  .add("pinned", () => (
    <Task task={{ ...task, state: "TASK_PINNED" }} {...actions} />
  ))
  .add("archived", () => (
    <Task task={{ ...task, state: "TASK_ARCHIVED" }} {...actions} />
  ));
```

Storybook 中有兩個基本的組織級別.

該元件 及 其 child 故事.

將每個故事 視為元件的排列. 您可以根據需要為每個元件 建立 儘可能多的故事.

- **元件**
  - 故事
  - 故事
  - 故事

要開始 Storybook,我們先運`行 註冊元件的`storiesOf()`函式. 我們為元件新增 _顯示名稱 - Storybook 應用程式側欄上顯示的名稱_.

`action()`允許我們建立一個回撥, 當在 Storybook UI 的面板中 單擊這個 **action** 時 回撥觸發. 因此,當我們構建一個 pin 按鈕 時,我們將能夠在 測試 UI 中 確定按鈕單擊 是否成功.

由於我們需要將 相同的一組操作 傳遞給 元件的所有排列,因此將它們捆綁到`actions`變數 並 使用 React`{...actions}`的`porps`擴充套件以立即傳遞它們. `<Task {...actions}>`相當於`<Task onPinTask={actions.onPinTask} onArchiveTask={actions.onArchiveTask}>`.

關於捆綁`actions`的另一個好處就是,你可以`export-暴露`它們,用於重用該元件的元件,我們稍後會看到.

為了定義我們的故事,我們用`add()`,一次一個為我們的每個測試狀態生成一個故事. `add`第二個引數是一個函式,它返回一個給定狀態的渲染元素 (即帶有一組`props`的元件類) - 就像一個 React[無狀態功能元件](https://reactjs.org/docs/components-and-props.html).

在建立故事時,我們使用基本任務 (`task`) 構建元件期望的 任務的形狀. 這通常是 根據真實資料的模型建模的. 再次,正如我們所看到的,`export`這種形狀將使我們能夠在以後的故事中重複使用它.

<div class="aside">
<a href="https://storybook.js.org/addons/introduction/#2-native-addons"><b>Actions</b></a> 幫助您在隔離構建UI元件時 驗證互動. 通常，您無法訪問應用程式上下文中的函式和狀態。 使用 <code>action()</code> 將它們存入.
</div>

## 配置

我們還必須對 Storybook 的配置設定 (`.storybook/config.js`) 做一個小改動,讓它注意到我們的`.stories.js`檔案並使用我們的 CSS 檔案. 預設情況下, Storybook 會查詢故事`/stories`目錄; 本教程使用類似於`.test.js`的命名方案, 這個命令是 **CRA** 贊成的用於自動化測試的方案.

```javascript
import { configure } from "@storybook/react";
import "../src/index.css";

const req = require.context('../src', true, /\.stories.js$/);

function loadStories() {
  req.keys().forEach(filename => req(filename));
}

configure(loadStories, module);
```

完成此操作後,重新啟動 Storybook 伺服器 應該會產生 三個任務狀態的測試用例:

<video autoPlay muted playsInline controls >
  <source
    src="/inprogress-task-states.mp4"
    type="video/mp4"
  />
</video>

## 建立狀態

現在我們有 Storybook 設定,匯入的樣式和構建的測試用例,我們可以快速開始實現元件的 HTML,以匹配設計.

該元件目前仍然是基本的. 首先編寫實現設計的程式碼,不用過多細節:

```javascript
import React from "react";

export default function Task({
  task: { id, title, state },
  onArchiveTask,
  onPinTask
}) {
  return (
    <div className={`list-item ${state}`}>
      <label className="checkbox">
        <input
          type="checkbox"
          defaultChecked={state === "TASK_ARCHIVED"}
          disabled={true}
          name="checked"
        />
        <span className="checkbox-custom" onClick={() => onArchiveTask(id)} />
      </label>
      <div className="title">
        <input
          type="text"
          value={title}
          readOnly={true}
          placeholder="Input title"
        />
      </div>

      <div className="actions" onClick={event => event.stopPropagation()}>
        {state !== "TASK_ARCHIVED" && (
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
    src="/finished-task-states.mp4"
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
import initStoryshots from "@storybook/addon-storyshots";
initStoryshots();
```

完成上述操作後,我們就可以運行了`yarn test`並看到以下輸出:

![Task test runner](/task-testrunner.png)

我們現在為每個`Task`故事進行快照測試. 如果我們改變了`Task`的實現,我們會提示您驗證更改.
