---
title: '데이터 연결하기'
tocTitle: '데이터'
description: 'UI 컴포넌트에 데이터를 연결하는 방법을 배워보세요'
commit: '5da7c68'
---

지금까지 우리는 독립된 환경에서 상태를 가지지 않는(stateless) 컴포넌트를 만들어보았습니다. 이는 스토리북(Storybook)에는 적합하지만 앱에 데이터를 제공하기 전까지는 유용하지 않습니다.

이번 튜토리얼에서는 앱 제작의 세부 사항에 중점을 두지 않기 때문에 자세히 설명하지 않을 것입니다. 그보다 컨테이너 컴포넌트(container components)에 데이터를 연결하는 일반적인 패턴을 살펴보도록 하겠습니다.

## 컨테이너 컴포넌트

현재 구현된 `TaskList`는 외부와 어떠한 소통도 하지 않기 때문에 “표상적(presentational)”이라고 할 수 있습니다. ([이 블로그 포스트](https://medium.com/@dan_abramov/smart-and-dumb-components-7ca2f9a7c7d0)를 참조해 주세요. 데이터를 얻기 위해서는 “컨테이너(container)”가 필요합니다.)

이 예제는 [Redux](https://redux.js.org/)로 데이터를 저장하기 위해 가장 효과적인 도구 집합(toolset)인 [Redux Toolkit](https://redux-toolkit.js.org/)를 사용하여 앱의 간단한 데이터 모델을 만듭니다. 여기서 사용된 패턴은 [Apollo](https://www.apollographql.com/client/)와 [MobX](https://mobx.js.org/) 같은 다른 데이터 관리 라이브러리에도 적용됩니다.

프로젝트에 필수 의존성(dependency)을 다음과 같이 설치해 주세요.

```bash
yarn add @reduxjs/toolkit react-redux
```

먼저 `src/lib` 폴더의 `store.js` 파일(의도적으로 단순하게 작성함)에서 task의 상태(state)를 변경하는 동작에 반응하는 간단한 리덕스(Redux) 저장소를 구성해 보겠습니다.

```js:title=src/lib/store.js
/* A simple redux store/actions/reducer implementation.
 * A true app would be more complex and separated into different files.
 */
import { configureStore, createSlice } from '@reduxjs/toolkit';

/*
 * The initial state of our store when the app loads.
 * Usually, you would fetch this from a server. Let's not worry about that now
 */
const defaultTasks = [
  { id: '1', title: 'Something', state: 'TASK_INBOX' },
  { id: '2', title: 'Something more', state: 'TASK_INBOX' },
  { id: '3', title: 'Something else', state: 'TASK_INBOX' },
  { id: '4', title: 'Something again', state: 'TASK_INBOX' },
];
const TaskBoxData = {
  tasks: defaultTasks,
  status: 'idle',
  error: null,
};

/*
 * The store is created here.
 * You can read more about Redux Toolkit's slices in the docs:
 * https://redux-toolkit.js.org/api/createSlice
 */
const TasksSlice = createSlice({
  name: 'taskbox',
  initialState: TaskBoxData,
  reducers: {
    updateTaskState: (state, action) => {
      const { id, newTaskState } = action.payload;
      const task = state.tasks.findIndex((task) => task.id === id);
      if (task >= 0) {
        state.tasks[task].state = newTaskState;
      }
    },
  },
});

// The actions contained in the slice are exported for usage in our components
export const { updateTaskState } = TasksSlice.actions;

/*
 * Our app's store configuration goes here.
 * Read more about Redux's configureStore in the docs:
 * https://redux-toolkit.js.org/api/configureStore
 */
const store = configureStore({
  reducer: {
    taskbox: TasksSlice.reducer,
  },
});

export default store;
```

다음 `TaskList` 컴포넌트를 Redux store와 연결하고, 알고자 하는 task들을 렌더링 하기 위해 업데이트합니다.

```js:title=src/components/TaskList.js
import React from 'react';
import Task from './Task';
import { useDispatch, useSelector } from 'react-redux';
import { updateTaskState } from '../lib/store';

export default function TaskList() {
  // We're retrieving our state from the store
  const tasks = useSelector((state) => {
    const tasksInOrder = [
      ...state.taskbox.tasks.filter((t) => t.state === 'TASK_PINNED'),
      ...state.taskbox.tasks.filter((t) => t.state !== 'TASK_PINNED'),
    ];
    const filteredTasks = tasksInOrder.filter(
      (t) => t.state === 'TASK_INBOX' || t.state === 'TASK_PINNED'
    );
    return filteredTasks;
  });

  const { status } = useSelector((state) => state.taskbox);

  const dispatch = useDispatch();

  const pinTask = (value) => {
    // We're dispatching the Pinned event back to our store
    dispatch(updateTaskState({ id: value, newTaskState: 'TASK_PINNED' }));
  };
  const archiveTask = (value) => {
    // We're dispatching the Archive event back to our store
    dispatch(updateTaskState({ id: value, newTaskState: 'TASK_ARCHIVED' }));
  };
  const LoadingRow = (
    <div className="loading-item">
      <span className="glow-checkbox" />
      <span className="glow-text">
        <span>Loading</span> <span>cool</span> <span>state</span>
      </span>
    </div>
  );
  if (status === 'loading') {
    return (
      <div className="list-items" data-testid="loading" key={"loading"}>
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
      <div className="list-items" key={"empty"} data-testid="empty">
        <div className="wrapper-message">
          <span className="icon-check" />
          <div className="title-message">You have no tasks</div>
          <div className="subtitle-message">Sit back and relax</div>
        </div>
      </div>
    );
  }

  return (
    <div className="list-items" data-testid="success" key={"success"}>
      {tasks.map((task) => (
        <Task
          key={task.id}
          task={task}
          onPinTask={(task) => pinTask(task)}
          onArchiveTask={(task) => archiveTask(task)}
        />
      ))}
    </div>
  );
}
```

이제 컴포넌트를 생성할 실제 데이터를 리덕스에서 받았으므로, 이를 `src/app.js`에 연결하여 컴포넌트를 렌더링 할 수 있습니다. 그러나 지금은 먼저 컴포넌트 중심의 여정을 계속해나가도록 하겠습니다.

그에 대한 내용은 다음 챕터에서 다룰 것이므로 걱정하지 않으셔도 됩니다.

## 데코레이터로 컨텍스트 제공하기

이 단계에서 `TaskList`는 컨테이너이며 더 이상 어떠한 props도 받지 않기 때문에 스토리북 테스트는 작동을 멈추었을 것입니다. 대신 `TaskList`는 Redux store에 연결하고 이를 감싸는 `PureTaskList`에서 props를 설정합니다.

하지만 이전 단계에서 진행한 스토리북 스토리의 `export` 구문에 `PureTaskList`(표상적인 컴포넌트)를 간단하게 렌더링함으로써 이러한 문제를 쉽게 해결할 수 있습니다.

```diff:title=src/components/TaskList.stories.js
import React from 'react';

+ import { PureTaskList } from './TaskList';
import * as TaskStories from './Task.stories';

export default {
+ component: PureTaskList,
  title: 'TaskList',
  decorators: [(story) => <div style={{ padding: '3rem' }}>{story()}</div>],
};

const Template = (args) => <PureTaskList {...args} />;

export const Default = Template.bind({});
Default.args = {
  // 인수(args) 컴포지션을 통해 스토리를 구성합니다.
  // 이 데이터는 task.stories.js의 Default story를 상속받았습니다.
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
  // 인수(args) 컴포지션을 통해 스토리를 구성합니다.
  // 위의 Default story에서 상속받은 데이터입니다.
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
  // 인수(args) 컴포지션을 통해 스토리를 구성합니다.
  // 위의 Loading story에서 상속받은 데이터입니다.
  ...Loading.args,
  loading: false,
};
```

<video autoPlay muted playsInline loop>
  <source
    src="/intro-to-storybook/finished-tasklist-states.mp4"
    type="video/mp4"
  />
</video>

<div class="aside">
💡 변경과 함께 모든 테스트를 업데이트해야 합니다. <code>-u</code> 플래그와 함께 import 문을 업데이트하고 테스트 커맨드를 재실행하세요. 깃(Git)에 변경한 내역들을 commit 하는 것도 잊지 마세요!
</div>
