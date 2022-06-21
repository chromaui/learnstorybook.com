---
title: '組裝複合元件'
tocTitle: '複合元件'
description: '從較為簡易的元件，組裝複合元件'
commit: '73d7821'
---

上個章節，我們打造出第 1 個元件，而在這章延伸已經學到的，做出 TaskList，也就是 1 組 Task。接著，開始動手把元件組裝起來，看看更複雜的時候會發生什麼事情。

## Tasklist

Taskbox 將置頂任務放置在一般任務上方來加強。因此讓 `TaskList` 產生 2 種得做成 story 的樣式：預設與置頂。

![預設與置頂的任務](/intro-to-storybook/tasklist-states-1.png)

因為 `Task` 的資料可以非同步送出，因此**也要** 渲染在沒有連線時，讀取中狀態。還有，沒任務的時候也要做空白狀態。

![空白與讀取中的任務](/intro-to-storybook/tasklist-states-2.png)

## 準備好設定

複合元件跟它包含的基本元件沒什麼差別。新增 `TaskLis` 元件，還有對應的 story 檔案：`src/components/TaskList.js` 和 `src/components/TaskList.stories.js`。

一開始的 `TaskList` 只要粗淺做一下即可。得要匯入先前的 `Task` 元件，傳入屬性和 actions。

```js:title=src/components/TaskList.js
import React from 'react';

import Task from './Task';

export default function TaskList({ loading, tasks, onPinTask, onArchiveTask }) {
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
      {tasks.map(task => (
        <Task key={task.id} task={task} {...events} />
      ))}
    </div>
  );
}
```

接著，在 story 檔案新增 `Tasklist` 測試的狀態。

```js:title=src/components/TaskList.stories.js
import React from 'react';

import TaskList from './TaskList';
import * as TaskStories from './Task.stories';

export default {
  component: TaskList,
  title: 'TaskList',
  decorators: [story => <div style={{ padding: '3rem' }}>{story()}</div>],
};

const Template = args => <TaskList {...args} />;

export const Default = Template.bind({});
Default.args = {
  // Shaping the stories through args composition.
  // The data was inherited from the Default story in task.stories.js.
  tasks: [
    { ...TaskStories.Default.args.task, id: '1', title: 'Task 1' },
    { ...TaskStories.Default.args.task, id: '2', title: 'Task 2' },
    { ...TaskStories.Default.args.task, id: '3', title: 'Task 3' },
    { ...TaskStories.Default.args.task, id: '4', title: 'Task 4' },
    { ...TaskStories.Default.args.task, id: '5', title: 'Task 5' },
    { ...TaskStories.Default.args.task, id: '6', title: 'Task 6' },
  ],
};

export const WithPinnedTasks = Template.bind({});
WithPinnedTasks.args = {
  // Shaping the stories through args composition.
  // Inherited data coming from the Default story.
  tasks: [
    ...Default.args.tasks.slice(0, 5),
    { id: '6', title: 'Task 6 (pinned)', state: 'TASK_PINNED' },
  ],
};

export const Loading = Template.bind({});
Loading.args = {
  tasks: [],
  loading: true,
};

export const Empty = Template.bind({});
Empty.args = {
  // Shaping the stories through args composition.
  // Inherited data coming from the Loading story.
  ...Loading.args,
  loading: false,
};
```

<div class="aside">
💡 <a href="https://storybook.js.org/docs/react/writing-stories/decorators"><b>Decorators</b></a> 是一種為 story 提供臨時 wrapper 的方法。在這裡，預設 export 使用名為 key 的 decorator，會在渲染出來的元件新增一些 padding 環繞。它們也可以用在 provider 包住 story — 也就是已經設定 React context 的 library 元件。
</div>

因為匯入了 `TaskStories`，就可以用最小力氣在[組合](https://storybook.js.org/docs/react/writing-stories/args#args-composition) story 的參數（英文簡稱 args）。這樣子，兩邊元件都要使用的資料和 action（虛構的 callback）都保留起來了。

現在，看看 Storybook 裡，新的 story：`TaskList`。

<video autoPlay muted playsInline loop>
  <source
    src="/intro-to-storybook/inprogress-tasklist-states-6-0.mp4"
    type="video/mp4"
  />
</video>

## 打造狀態 (States)

元件還很粗糙，但已經知道 story 要怎麼繼續進行。你可能覺得 wrapper：`.list-items` 太過於簡樸。沒錯，大多數的情況下並不會為了把東西包起來，就做新元件。`TaskList` 元件**真正複雜**的地方在 `withPinnedTasks`、`loading` 和 `empty` 等極端案例才會出現。

```js:title=src/components/TaskList.js
import React from 'react';

import Task from './Task';

export default function TaskList({ loading, tasks, onPinTask, onArchiveTask }) {
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
    ...tasks.filter(t => t.state === 'TASK_PINNED'),
    ...tasks.filter(t => t.state !== 'TASK_PINNED'),
  ];
  return (
    <div className="list-items">
      {tasksInOrder.map(task => (
        <Task key={task.id} task={task} {...events} />
      ))}
    </div>
  );
}
```

新增的語法產生以下 UI：

<video autoPlay muted playsInline loop>
  <source
    src="/intro-to-storybook/finished-tasklist-states-6-0.mp4"
    type="video/mp4"
  />
</video>

請注意清單裡的置頂項目。為了讓使用者覺得這比較重要，就要把置頂項目顯示在清單的頂部。

## 資料需求與 Props

隨著元件逐漸龐大，所需傳入的資料也是。請定義 `TaskList` 的 prop 需求，由於 `Task` 是子元件，要確認提供渲染的資料是否正確。為了輕鬆省時，要重複利用先前在 `Task` 定義的 propTypes。

```diff:title=src/components/TaskList.js
import React from 'react';
import PropTypes from 'prop-types';

import Task from './Task';

export default function TaskList() {
  ...
}

+ TaskList.propTypes = {
+  /** Checks if it's in loading state */
+  loading: PropTypes.bool,
+  /** The list of tasks */
+  tasks: PropTypes.arrayOf(Task.propTypes.task).isRequired,
+  /** Event to change the task to pinned */
+  onPinTask: PropTypes.func,
+  /** Event to change the task to archived */
+  onArchiveTask: PropTypes.func,
+ };
+ TaskList.defaultProps = {
+  loading: false,
+ };
```

## 自動測試

在上一章學到使用 Storyshot 為 story 進行快照測試。那時候，要測試 Task 渲染是否 OK 並不複雜。而 TaskList 增加另一層複雜度之後，就會想要相容自動測試，驗證特定輸入是否可以產生特定輸出。因此，要以 [React Testing Library](https://testing-library.com/docs/react-testing-library/intro) 和 [@storybook/testing-react](https://storybook.js.org/addons/@storybook/testing-react)，建立單元測試。

![Testing library logo](/intro-to-storybook/testinglibrary-image.jpeg)

### 以 React Testing Library 進行單元測試

Storybook 的 story、手動測試和快照測試已經能夠盡可能避免 UI 臭蟲。如果 story 涵蓋的元件使用情境已經廣泛，並且使用以人類進行檢查 story 變動的工具，錯誤就可能會比較少。

然而，有時候魔鬼就是藏在細節裡，得要有讓細節顯而易見的測試框架，讓我們把目光放到單元測試。

現在的情況是，已經傳入 `tasks` 這個 props 的 `TaskList` 裡，將置頂任務在沒有置頂的**前面**渲染出來。即使已經有 `WithPinnedTasks` 這個 story，就是用來測試這情境。如果元件**不再**以如此方式排列任務，也就是出現臭蟲了，對於以人力來檢查來說，仍是模糊的。它絕對不會對大家的目光大喊**「出錯了」**！

因此，為了避免這問題，可以使用 React Testing Library 來把 story 渲染至 DOM，然後執行一些 DOM 查詢程式碼，驗證結果的顯著特徵。story 格式的好處，是可以只要匯入測試裡的 story，然後就輸出了。

新增名為 `src/components/TaskList.test.js` 的測試檔案。在這裡，要打造有明確結果的測試。

```js:title=src/components/TaskList.test.js
import { render } from '@testing-library/react';

import { composeStories } from '@storybook/testing-react';

import * as TaskListStories from './TaskList.stories'; //👈  Our stories imported here

//👇 composeStories will process all information related to the component (e.g., args)
const { WithPinnedTasks } = composeStories(TaskListStories);

it('renders pinned tasks at the start of the list', () => {
  const { container } = render(<WithPinnedTasks />);

  expect(
    container.querySelector('.list-item:nth-child(1) input[value="Task 6 (pinned)"]')
  ).not.toBe(null);
});
```

<div class="aside">
💡 <a href="">@storybook/testing-react</a> 是可以在單元測試裡重複利用 Storybook story 的優秀外掛。在測試裡重複利用 story，就是準備好一整組元件情境目錄可供測試。同時，所有 story 裡的參數、decorator 和其他訊息也在此資源庫產生。就如同所見，在測試裡只要選擇要渲染的 story。
</div>

![TaskList 測試的 runner](/intro-to-storybook/tasklist-testrunner.png)

請記得，其實已經可以在單元測試重複使用 `WithPinnedTasks` 這個 story。這作法讓我們持續以各種方式利用現有資源（可以展示元件各種有趣設定的範例）。

還要注意，這裡的測試還不夠完善。隨著專案成熟，很可能 `Task` 的實作工法就改變了：也許是使用不同 classname 或以 `textarea` 取代 `input`，就會讓測試失敗，必須得更新。有時候，這並不會是問題，但在 UI 使用單元測試，明確標示出值得注意的地方會更好，維護起來並不容易。要不然，有必要的地方也是可以使用手動、快照與視覺回溯測試（見[測試](/intro-to-storybook/react/zh-TW/test/)章節）。

<div class="aside">
💡 別忘了在 git 提交改好的東西！
</div>
