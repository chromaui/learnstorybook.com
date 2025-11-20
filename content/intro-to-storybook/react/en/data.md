---
title: 'Wire in data'
tocTitle: 'Data'
description: 'Learn how to wire in data to your UI component'
commit: 'f9eaeef'
---

So far, we have created isolated stateless components-–great for Storybook, but ultimately not helpful until we give them some data in our app.

This tutorial doesn’t focus on the particulars of building an app, so we won’t dig into those details here. But we will take a moment to look at a common pattern for wiring in data into connected components.

## Connected components

Our `TaskList` component as currently written is “presentational” in that it doesn’t talk to anything external to its own implementation. We need to wire it to a data provider to get data into it.

This example uses [Redux Toolkit](https://redux-toolkit.js.org/), the most effective toolset for developing applications for storing data with [Redux](https://redux.js.org/), to build a simple data model for our app. However, the pattern used here applies just as well to other data management libraries like [Apollo](https://www.apollographql.com/client/) and [MobX](https://mobx.js.org/).

Add the necessary dependencies to your project with:

```shell
yarn add @reduxjs/toolkit react-redux
```

First, we’ll construct a simple Redux store that responds to actions that change the task's state in a file called `store.ts` in the `src/lib` directory (intentionally kept simple):

```ts:title=src/lib/store.ts
/* A simple redux store/actions/reducer implementation.
 * A true app would be more complex and separated into different files.
 */
import type { TaskData } from '../types';

import { configureStore, createSlice, PayloadAction } from '@reduxjs/toolkit';

interface TaskBoxState {
  tasks: TaskData[];
  status: 'idle' | 'loading' | 'failed' | 'succeeded';
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

Then we’ll update our `TaskList` component to connect to the Redux store and render the tasks we are interested in:

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

Now that we have some actual data populating our component, obtained from the Redux store, we could have wired it to `src/App.tsx` and render the component there. But for now, let's hold off doing that and continue on our component-driven journey.

Don't worry about it. We'll take care of it in the next chapter.

## Supplying context with decorators

Our Storybook stories have stopped working with this change because our `Tasklist` is now a connected component since it relies on a Redux store to retrieve and update our tasks.

<!--
  TODO: Follow up with Design for an updated asset
 -->

![Broken tasklist](/intro-to-storybook/broken-tasklist-9-0-optimized.png)

We can use various approaches to solve this issue. Still, as our app is pretty straightforward, we can rely on a decorator, similar to what we did in the [previous chapter](/intro-to-storybook/react/en/composite-component/) and provide a mocked store-- in our Storybook stories:

```tsx:title=src/components/TaskList.stories.tsx
import type { Meta, StoryObj } from '@storybook/react-vite';

import type { TaskData } from '../types';

import { Provider } from 'react-redux';

import { configureStore, createSlice } from '@reduxjs/toolkit';

import TaskList from './TaskList';

import * as TaskStories from './Task.stories';

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

💡 `excludeStories` is a Storybook configuration field that prevents our mocked state to be treated as a story. You can read more about this field in the [Storybook documentation](https://storybook.js.org/docs/api/csf).

</div>

<video autoPlay muted playsInline loop>
  <source
    src="/intro-to-storybook/finished-tasklist-states-9-0-optimized.mp4"
    type="video/mp4"
  />
</video>

<div class="aside">
💡 Don't forget to commit your changes with git!
</div>

Success! We're right where we started, our Storybook is now working, and we're able to see how we could supply data into a connected component. In the next chapter, we'll take what we've learned here and apply it to a screen.
