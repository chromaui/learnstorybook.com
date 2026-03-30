---
title: 'Передача данных'
tocTitle: 'Данные'
description: 'Узнайте как передать данные UI-компоненту'
commit: '94b134e'
---

До сих пор мы создавали изолированные компоненты без статического состояния - это хорошо для Storybook, но в конечном счете бесполезно, пока мы не предоставим им какие-либо данные в нашем приложении.

В этом руководстве не рассматриваются особенности создания приложения, поэтому мы не будем углубляться в эти детали. Но мы уделим немного времени рассмотрению общего шаблона для подключения данных к подключаемым компонентам.

## Присоединённые компоненты

На данный момент, наш компонент `TaskList`, является "презентационным", т.е. он не взаимодействует ни с чем внешним, кроме своей собственной реализации. Нам нужно подключить его к поставщику данных, чтобы получить данные.

Чтобы построить простую модель данных для нашего приложения мы будем использовать [Redux Toolkit](https://redux-toolkit.js.org/). Это эффективный набор инструментов для разработки приложений которые хранят данные с помощью [Redux](https://redux.js.org/). Однако используемый здесь паттерн также применим и к другим библиотекам управления данными, таким как [Apollo](https://www.apollographql.com/client/) и [MobX](https://mobx.js.org/).

Добавьте необходимые зависимости в ваш проект с помощью команды:

```bash
yarn add @reduxjs/toolkit react-redux
```

Сначала мы создадим простое хранилище Redux, которое реагирует на действия, изменяющие состояние задачи, в файле `store.js` в каталоге `src/lib` (намеренно оставленном простым):

```js:title=src/lib/store.js
/* Простая имплементация redux store/actions/reducer.
 * В настоящем приложении хранилище будет сложнее и разбито на отдельные файлы.
 */
import { configureStore, createSlice } from '@reduxjs/toolkit';

/*
 * Начальное состояние нашего приложения, когда оно будет загружено.
 * Обычно, вы будете получать данные от сервера. Давайте не беспокоиться об этом сейчас.
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
 * Хранилище создано тут.
 * Вы можете узнать больше о Redux Toolkit слайсах в документации:
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

// Экшены, содержащиеся в слайсах экспортированы для использования в наших компонентах.
export const { updateTaskState } = TasksSlice.actions;

/*
 * Конфигурация хранилища нашего приложения начинается отсюда.
 * Узнать больше о configureStore можно в документации Redux:
 * https://redux-toolkit.js.org/api/configureStore
 */
const store = configureStore({
  reducer: {
    taskbox: TasksSlice.reducer,
  },
});

export default store;
```

Затем мы изменим наш компонент `TaskList`, подключив его к хранилищу Redux и отрендерим задачи, в которых мы заинтересованы:

```js:title=src/components/TaskList.js
import React from 'react';
import Task from './Task';
import { useDispatch, useSelector } from 'react-redux';
import { updateTaskState } from '../lib/store';

export default function TaskList() {
  // Получаем наше состояние из хранилища
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
    // Отправляем событие Pinned обратно в наше хранилище
    dispatch(updateTaskState({ id: value, newTaskState: 'TASK_PINNED' }));
  };
  const archiveTask = (value) => {
    // Отправляем событие Archive обратно в наше хранилище
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
          <p className="title-message">You have no tasks</p>
          <p className="subtitle-message">Sit back and relax</p>
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

Теперь, когда у нас есть некоторые фактические данные, заполняющие наш компонент, полученные из хранилища Redux, мы могли бы подключить их к `src/App.js` и отрендерить компонент там. Но пока давайте воздержимся от этого и продолжим наш путь, основанный на компонентах.

Не беспокойтесь об этом. Мы позаботимся об этом в следующей главе.

## Supplying context with decorators

С этим изменением, наши истории Storybook перестали работать, потому что наш `Tasklist` теперь подключен, и полагается на хранилище Redux для получения и обновления наших задач.

![Сломанный список задач](/intro-to-storybook/broken-tasklist-optimized.png)

Мы можем использовать различные подходы для решения этой проблемы. Поскольку наше приложение довольно простое, мы можем использовать декоратор, подобный тому, что мы делали в [предыдущей главе](/intro-to-storybook/react/en/composite-component), и предоставить замоканное хранилище в наших историях Storybook:

```js:title=src/components/TaskList.stories.js
import React from 'react';

import TaskList from './TaskList';
import * as TaskStories from './Task.stories';

import { Provider } from 'react-redux';

import { configureStore, createSlice } from '@reduxjs/toolkit';

// Суперпростой мок состояния нашего хранилища.
export const MockedState = {
  tasks: [
    { ...TaskStories.Default.args.task, id: '1', title: 'Task 1' },
    { ...TaskStories.Default.args.task, id: '2', title: 'Task 2' },
    { ...TaskStories.Default.args.task, id: '3', title: 'Task 3' },
    { ...TaskStories.Default.args.task, id: '4', title: 'Task 4' },
    { ...TaskStories.Default.args.task, id: '5', title: 'Task 5' },
    { ...TaskStories.Default.args.task, id: '6', title: 'Task 6' },
  ],
  status: 'idle',
  error: null,
};

// Суперпростой мок redux-хранилища.
const Mockstore = ({ taskboxState, children }) => (
  <Provider
    store={configureStore({
      reducer: {
        taskbox: createSlice({
          name: 'taskbox',
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

export default {
  component: TaskList,
  title: 'TaskList',
  decorators: [(story) => <div style={{ padding: "3rem" }}>{story()}</div>],
  excludeStories: /.*MockedState$/,
};

const Template = () => <TaskList />;

export const Default = Template.bind({});
Default.decorators = [
  (story) => <Mockstore taskboxState={MockedState}>{story()}</Mockstore>,
];

export const WithPinnedTasks = Template.bind({});
WithPinnedTasks.decorators = [
  (story) => {
    const pinnedtasks = [
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
];

export const Loading = Template.bind({});
Loading.decorators = [
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
];

export const Empty = Template.bind({});
Empty.decorators = [
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
];
```

<div class="aside">
💡 <code>excludeStories</code> это поле конфигурации Storybook, которое запрещает рассматривать наше замоканное состояние как историю. Подробнее об этом поле вы можете прочитать в <a href="https://storybook.js.org/docs/react/api/csf">документации Storybook</a>.
</div>

<video autoPlay muted playsInline loop>
  <source
    src="/intro-to-storybook/finished-tasklist-states-6-4-optimized.mp4"
    type="video/mp4"
  />
</video>

<div class="aside">
💡 Не забудьте зафиксировать свои изменения с помощью git!
</div>

Успех! Мы вернулись к тому, с чего начали, наш Storybook теперь работает, и мы можем видеть, как мы можем поставлять данные в подключенный компонент. В следующей главе мы возьмем то, чему научились здесь, и применим это к экрану.
