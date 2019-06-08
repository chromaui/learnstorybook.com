---
title: "組裝複合元件"
tocTitle: "合成元件"
description: "使用更簡單的元件 組裝複合元件"
commit: '8db511e'
---

上一章我們構建了第一個元件; 本章 我們學習 擴充套件構建TaskList的任務列表. 讓我們將 元件組合 在一起,看看在引入更多複雜性時會發生什麼.

## 任務列表

Taskbox 通過將 固定任務 置於預設任務之上 來強調 固定任務. 這產生了兩種變體`TaskList`您需要為以下內容建立故事: 預設專案 以及 預設和 固定專案.

![default and pinned tasks](/tasklist-states-1.png)

`Task`可以非同步傳送資料,我們 **也**需要在沒有連線的情況下 loading 渲染 *右圖*. 此外,當沒有任務時,需要 空狀態 *左圖*.

![empty and loading tasks](/tasklist-states-2.png)

## 獲取設定

複合元件與 其包含的基本元件沒有太大區別. 建立一個`TaskList`元件和 對應的故事檔案: `src/components/TaskList.js`和`src/components/TaskList.stories.js`.

從粗略的實現開始`TaskList`. 你需要匯入早期的`Task`元件,並將 屬性和操作 作為輸入傳遞.

```javascript
import React from 'react';

import Task from './Task';

function TaskList({ loading, tasks, onPinTask, onArchiveTask }) {
  const events = {
    onPinTask,
    onArchiveTask,
  };

  if (loading) {
    return <div className="list-items">loading</div>;
  }

  if (tasks.length === 0) {
    return <div className="list-items">empty</div>;
  }

  return (
    <div className="list-items">
      {tasks.map(task => <Task key={task.id} task={task} {...events} />)}
    </div>
  );
}

export default TaskList;
```

接下來建立`Tasklist`故事檔案中的測試狀態.

```javascript
import React from 'react';
import { storiesOf } from '@storybook/react';

import TaskList from './TaskList';
import { task, actions } from './Task.stories';

export const defaultTasks = [
  { ...task, id: '1', title: 'Task 1' },
  { ...task, id: '2', title: 'Task 2' },
  { ...task, id: '3', title: 'Task 3' },
  { ...task, id: '4', title: 'Task 4' },
  { ...task, id: '5', title: 'Task 5' },
  { ...task, id: '6', title: 'Task 6' },
];

export const withPinnedTasks = [
  ...defaultTasks.slice(0, 5),
  { id: '6', title: 'Task 6 (pinned)', state: 'TASK_PINNED' },
];

storiesOf('TaskList', module)
  .addDecorator(story => <div style={{ padding: '3rem' }}>{story()}</div>)
  .add('default', () => <TaskList tasks={defaultTasks} {...actions} />)
  .add('withPinnedTasks', () => <TaskList tasks={withPinnedTasks} {...actions} />)
  .add('loading', () => <TaskList loading tasks={[]} {...actions} />)
  .add('empty', () => <TaskList tasks={[]} {...actions} />);
```

`addDecorator()`允許我們為每個任務的渲染新增一些"上下文". 在這種情況下,我們在列表周圍新增 *填充-padding*,以便更容易進行 視覺化驗證.

<div class="aside">
<a href="https://storybook.js.org/addons/introduction/#1-decorators"><b>Decorators-裝飾器</b></a> 是一種為 故事 提供任意包裝的方法。 在這種情況下，我們使用裝飾器來新增樣式。 它們還可以用於包裝故事在 <b>"providers" - 設定 React上下文 的庫元件</b>.
</div>

`task`提供一個`Task`的形狀,這是通過我們建立和匯出的`Task.stories.js`檔案. 同樣的,`actions`定義`Task`元件期望的操作 (模擬回撥) ,其中`TaskList`也需要.

現在檢視 Storybook的新內容`TaskList`故事.

<video autoPlay muted playsInline loop>
  <source
    src="/inprogress-tasklist-states.mp4"
    type="video/mp4"
  />
</video>

## 建立狀態

我們的元件仍然很粗糙,但現在我們已經瞭解了 要努力的故事. 你可能會想到`.list-items`包裝過於簡單化. 你是對的 - 在大多數情況下,我們不會只是新增一個包裝器來建立一個新的元件. 但是 **真正的複雜性** 的`TaskList`元件在邊緣情況下會顯示`withPinnedTasks`,`loading`,和`empty`.

```javascript
import React from 'react';

import Task from './Task';

function TaskList({ loading, tasks, onPinTask, onArchiveTask }) {
  const events = {
    onPinTask,
    onArchiveTask,
  };

  const LoadingRow = (
    <div className="loading-item">
      <span className="glow-checkbox" />
      <span className="glow-text">
        <span>Loading</span> <span>cool</span> <span>state</span>
      </span>
    </div>
  );

  if (loading) {
    return (
      <div className="list-items">
        {LoadingRow}
        {LoadingRow}
        {LoadingRow}
        {LoadingRow}
        {LoadingRow}
        {LoadingRow}
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="list-items">
        <div className="wrapper-message">
          <span className="icon-check" />
          <div className="title-message">You have no tasks</div>
          <div className="subtitle-message">Sit back and relax</div>
        </div>
      </div>
    );
  }

  const tasksInOrder = [
    ...tasks.filter(t => t.state === 'TASK_PINNED'), //< ==== 固定頂部
    ...tasks.filter(t => t.state !== 'TASK_PINNED'),
  ];

  return (
    <div className="list-items">
      {tasksInOrder.map(task => <Task key={task.id} task={task} {...events} />)}
    </div>
  );
}

export default TaskList;
```

新增的標記會產生以下UI:

<video autoPlay muted playsInline loop>
  <source
    src="/finished-tasklist-states.mp4"
    type="video/mp4"
  />
</video>

請注意列表中 固定項 的位置. 我們希望固定專案在 列表頂部 呈現,以使其成為我們使用者的優先事項.

## 資料要求和props

隨著元件的增長,輸入要求也在增長. 要求定義`TaskList`的*props*. 因為`Task`是一個子元件,請確保提供 正確形狀的資料 來呈現它. 為了節省時間和頭痛,請重用您定義的早期`Task`的propTypes.

```javascript
import React from 'react';
import PropTypes from 'prop-types';

function TaskList() {
  ...
}


TaskList.propTypes = {
  loading: PropTypes.bool,
  tasks: PropTypes.arrayOf(Task.propTypes.task).isRequired,
  onPinTask: PropTypes.func.isRequired,
  onArchiveTask: PropTypes.func.isRequired,
};

TaskList.defaultProps = {
  loading: false,
};

export default TaskList;
```

## 自動化測試

在上一章中,我們學習瞭如何使用 Storyshots快照測試 故事. `Task`測試沒有太多的複雜性,已然夠用了. 而`TaskList`增加了另一層複雜性,我們希望 以 自動測試 的方式驗證 某些輸入產生某些輸出. 為此,我們將使用建立單 元測試[jest-笑話](https://facebook.github.io/jest/)再加上測試渲染器等[Enzyme](http://airbnb.io/enzyme/).

![Jest logo](/logo-jest.png)

### 用Jest進行單元測試

 Storybook故事 與 手動視覺化測試 和 快照測試 (見上文) 相結合,可以避免 UI錯誤. 如果故事 涵蓋了 各種各樣的元件用例,並且我們使用的工具可以確保 人員檢查故事的任何變化,那麼錯誤的可能性就大大降低.

然而,有時候魔鬼是在細節中. 需要一個明確有關這些細節的測試框架. 這讓我們進行了單元測試.

在我們的例子中,我們希望我們的`TaskList`,在傳遞 不固定tasks 之前,呈現所有固定tasks. 雖然我們有一個故事 (`withPinnedTasks`) 測試這個確切的場景; 但是如果元件停止對 這樣的任務 進行排序，那麼就人類看著來說，這可能是不明確的,*因為只看到表面與操作*, 這是一個bug. 它肯定不會尖叫 **"錯誤!"** 直懟眼睛.

因此,為了避免這個問題,我們可以使用Jest 將故事呈現給`DOM`,並執行一些`DOM`查詢程式碼,來驗證輸出的顯著特徵.

建立一個名為的測試檔案`TaskList.test.js`. 在這裡,我們將構建我們的測試,對輸出進行斷言.

```javascript
import React from 'react';
import ReactDOM from 'react-dom';
import TaskList from './TaskList';
import { withPinnedTasks } from './TaskList.stories';

it('renders pinned tasks at the start of the list', () => {
  const div = document.createElement('div');
  const events = { onPinTask: jest.fn(), onArchiveTask: jest.fn() };
  ReactDOM.render(<TaskList tasks={withPinnedTasks} {...events} />, div);

  // 我們期望首先渲染標題為“任務6（固定）”的任務，而不是最後
  const lastTaskInput = div.querySelector('.list-item:nth-child(1) input[value="Task 6 (pinned)"]');
  expect(lastTaskInput).not.toBe(null);

  ReactDOM.unmountComponentAtNode(div);
});
```

![TaskList test runner](/tasklist-testrunner.png)

請注意,我們已經能夠重用`withPinnedTasks`故事 和 單元測試中的任務列表;通過這種方式,我們可以繼續 以越來越多的方式 利用現有資源 (代表元件的有趣配置的示例) .

另請注意,此測試非常脆弱. 隨著專案的成熟,以及專案的確切實現,這都可能是`Task`的更改 - 可能使用 不同的類名或`textarea`而不是一個`input`- 測試將失敗,需要更新. 這不一定是一個問題,但使用UI的 單元測試 要小心的指示. 它們不容易維護. 替代的是依靠視覺,快照和視覺迴歸 (參見[測試章節](/test/)) 的 Storybook測試. 
