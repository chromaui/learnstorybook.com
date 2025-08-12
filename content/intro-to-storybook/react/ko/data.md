---
title: '데이터 연결하기'
tocTitle: '데이터'
description: 'UI 컴포넌트에 데이터를 연결하는 방법을 배워보세요'
commit: 'acf26d6'
---

지금까지 우리는 독립된 환경에서 상태를 가지지 않는(stateless) 컴포넌트를 만들어보았습니다. 이는 스토리북(Storybook)에는 적합하지만 앱에 데이터를 제공하기 전까지는 유용하지 않습니다.

이번 튜토리얼에서는 앱 제작의 세부 사항에 중점을 두지 않기 때문에 자세히 설명하지 않을 것입니다. 그보다 컨테이너 컴포넌트(container components)에 데이터를 연결하는 일반적인 패턴을 살펴보도록 하겠습니다.

## 컨테이너 컴포넌트

현재 구현된 `TaskList`는 외부와 어떠한 소통도 하지 않기 때문에 “표상적(presentational)”이라고 할 수 있습니다. 데이터를 적용하기 위해 데이터 제공자(data provider)와 연결해야 합니다.

이 예제는 [Redux](https://redux.js.org/)로 데이터를 저장하기 위해 가장 효과적인 도구 집합(toolset)인 [Redux Toolkit](https://redux-toolkit.js.org/)를 사용하여 앱의 간단한 데이터 모델을 만듭니다. 여기서 사용된 패턴은 [Apollo](https://www.apollographql.com/client/)와 [MobX](https://mobx.js.org/) 같은 다른 데이터 관리 라이브러리에도 적용됩니다.

프로젝트에 필수 의존성(dependency)을 다음과 같이 설치해 주세요.

```shell
yarn add @reduxjs/toolkit react-redux
```

먼저 `src/lib` 폴더의 `store.ts` 파일(의도적으로 단순하게 작성함)에서 task의 상태(state)를 변경하는 동작에 반응하는 간단한 리덕스(Redux) 저장소를 구성해 보겠습니다:

```ts:title=src/lib/store.ts
/* A simple redux store/actions/reducer implementation.
 * A true app would be more complex and separated into different files.
 */
import type { TaskData } from '../types';

import { configureStore, createSlice, PayloadAction } from '@reduxjs/toolkit';

interface TaskBoxState {
  tasks: TaskData[];
  status: 'idle' | 'loading' | 'failed';
  error: string | null;
}

/*
 * The initial state of our store when the app loads.
 * Usually, you would fetch this from a server. Let's not worry about that now
 */
const defaultTasks: TaskData[] = [
  { id: '1', title: 'Something', state: 'TASK_INBOX' },
  { id: '2', title: 'Something more', state: 'TASK_INBOX' },
  { id: '3', title: 'Something else', state: 'TASK_INBOX' },
  { id: '4', title: 'Something again', state: 'TASK_INBOX' },
];

const TaskBoxData: TaskBoxState = {
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
    updateTaskState: (
      state,
      action: PayloadAction<{ id: string; newTaskState: TaskData['state'] }>
    ) => {
      const task = state.tasks.find((task) => task.id === action.payload.id);
      if (task) {
        task.state = action.payload.newTaskState;
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

// Define RootState and AppDispatch types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
```

다음 `TaskList` 컴포넌트를 Redux store와 연결하고, 알고자 하는 task들을 렌더링 하기 위해 업데이트합니다:

```tsx:title=src/components/TaskList.tsx
import Task from './Task';

import { useDispatch, useSelector } from 'react-redux';

import { updateTaskState, RootState, AppDispatch } from '../lib/store';

export default function TaskList() {
  // We're retrieving our state from the store
  const tasks = useSelector((state: RootState) => {
    const tasksInOrder = [
      ...state.taskbox.tasks.filter((t) => t.state === 'TASK_PINNED'),
      ...state.taskbox.tasks.filter((t) => t.state !== 'TASK_PINNED'),
    ];
    const filteredTasks = tasksInOrder.filter(
      (t) => t.state === "TASK_INBOX" || t.state === 'TASK_PINNED'
    );
    return filteredTasks;
  });
  const { status } = useSelector((state: RootState) => state.taskbox);
  const dispatch = useDispatch<AppDispatch>();
  const pinTask = (value: string) => {
    // We're dispatching the Pinned event back to our store
    dispatch(updateTaskState({ id: value, newTaskState: 'TASK_PINNED' }));
  };
  const archiveTask = (value: string) => {
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
  if (status === "loading") {
    return (
      <div className="list-items" data-testid="loading" key="loading">
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
      <div className="list-items" key="empty" data-testid="empty">
        <div className="wrapper-message">
          <span className="icon-check" />
          <p className="title-message">You have no tasks</p>
          <p className="subtitle-message">Sit back and relax</p>
        </div>
      </div>
    );
  }

  return (
    <div className="list-items" data-testid="success" key="success">
      {tasks.map((task) => (
        <Task
          key={task.id}
          task={task}
          onPinTask={pinTask}
          onArchiveTask={archiveTask}
        />
      ))}
    </div>
  );
}
```

이제 컴포넌트를 생성할 실제 데이터를 리덕스 스토어에서 받았으므로, 이를 `src/App.tsx`에 연결하여 컴포넌트를 렌더링 할 수 있습니다. 그러나 지금은 먼저 컴포넌트 중심의 여정을 계속해나가도록 하겠습니다.

그에 대한 내용은 다음 챕터에서 다룰 것이므로 걱정하지 않으셔도 됩니다.

## 데코레이터로 컨텍스트 제공하기

이 변경으로 인해 스토리북 스토리가 작동을 멈추게 되었습니다. 왜냐하면 `TaskList`는 이제 리덕스 스토어에 의존하여 task를 가져오고 업데이트하는 연결된 컴포넌트이기 때문에 스토리북 테스트는 작동을 멈추었을 것입니다.

![Broken tasklist](/intro-to-storybook/broken-tasklist-optimized.png)

이 문제를 해결하기 위해 다양한 접근 방식을 사용할 수 있습니다. 우리 앱은 매우 간단하기 때문에 [이전 장](/intro-to-storybook/react/ko/composite-component/)에서 했던 것처럼 데코레이터에 의존하여 스토리북 스토리에서 모의(mocked) 스토어를 제공할 수 있습니다:

```tsx:title=src/components/TaskList.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';

import type { TaskData } from '../types';

import TaskList from './TaskList';

import * as TaskStories from './Task.stories';

import { Provider } from 'react-redux';

import { configureStore, createSlice } from '@reduxjs/toolkit';

// A super-simple mock of the state of the store
export const MockedState = {
  tasks: [
    { ...TaskStories.Default.args.task, id: '1', title: 'Task 1' },
    { ...TaskStories.Default.args.task, id: '2', title: 'Task 2' },
    { ...TaskStories.Default.args.task, id: '3', title: 'Task 3' },
    { ...TaskStories.Default.args.task, id: '4', title: 'Task 4' },
    { ...TaskStories.Default.args.task, id: '5', title: 'Task 5' },
    { ...TaskStories.Default.args.task, id: '6', title: 'Task 6' },
  ] as TaskData[],
  status: 'idle',
  error: null,
};

// A super-simple mock of a redux store
const Mockstore = ({
  taskboxState,
  children,
}: {
  taskboxState: typeof MockedState;
  children: React.ReactNode;
}) => (
  <Provider
    store={configureStore({
      reducer: {
        taskbox: createSlice({
          name: "taskbox",
          initialState: taskboxState,
          reducers: {
            updateTaskState: (state, action) => {
              const { id, newTaskState } = action.payload;
              const task = state.tasks.findIndex((task) => task.id === id);
              if (task >= 0) {
                state.tasks[task].state = newTaskState;
              }
            },
          },
        }).reducer,
      },
    })}
  >
    {children}
  </Provider>
);

const meta = {
  component: TaskList,
  title: 'TaskList',
  decorators: [(story) => <div style={{ margin: '3rem' }}>{story()}</div>],
  tags: ['autodocs'],
  excludeStories: /.*MockedState$/,
} satisfies Meta<typeof TaskList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  decorators: [
    (story) => <Mockstore taskboxState={MockedState}>{story()}</Mockstore>,
  ],
};

export const WithPinnedTasks: Story = {
  decorators: [
    (story) => {
      const pinnedtasks: TaskData[] = [
        ...MockedState.tasks.slice(0, 5),
        { id: '6', title: 'Task 6 (pinned)', state: 'TASK_PINNED' },
      ];

      return (
        <Mockstore
          taskboxState={{
            ...MockedState,
            tasks: pinnedtasks,
          }}
        >
          {story()}
        </Mockstore>
      );
    },
  ],
};

export const Loading: Story = {
  decorators: [
    (story) => (
      <Mockstore
        taskboxState={{
          ...MockedState,
          status: 'loading',
        }}
      >
        {story()}
      </Mockstore>
    ),
  ],
};

export const Empty: Story = {
  decorators: [
    (story) => (
      <Mockstore
        taskboxState={{
          ...MockedState,
          tasks: [],
        }}
      >
        {story()}
      </Mockstore>
    ),
  ],
};
```

<div class="aside">

💡 `excludeStories`는 모의된 상태(mocked state)가 스토리로 처리되는 것을 방지하기 위한 스토리북 구성 필드 입니다. 이 필드에 대한 자세한 내용은 [스토리북 문서](https://storybook.js.org/docs/api/csf)를 참고하세요.

</div>

<video autoPlay muted playsInline loop>
  <source
    src="/intro-to-storybook/finished-tasklist-states-7-0-optimized.mp4"
    type="video/mp4"
  />
</video>

<div class="aside">
💡 깃(Git)에 변경 내역을 commit하는 것을 잊지 마세요!
</div>

성공했습니다! 스토리북이 정상적으로 작동하고 있으며 연결된 컴포넌트에 데이터를 제공할 수있는 방법을 볼 수 있었습니다. 다음 장에서는 배운 내용을 화면에 적용해 보겠습니다.
