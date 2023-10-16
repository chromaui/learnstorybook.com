---
title: 'Collegare i dati'
tocTitle: 'Dati'
description: 'Impara come collegare i dati al tuo componente UI'
commit: '87a5a91'
---

Finora, abbiamo creato componenti senza stato isolati, ottimi per Storybook, ma alla fine non utili finché non gli forniamo alcuni dati nella nostra app.

Questo tutorial non si concentra sui particolari della costruzione di un'app, quindi non approfondiremo quei dettagli qui. Ma prenderemo un momento per esaminare un modello comune per il collegamento dei dati nei componenti connessi.

## Componenti connessi

Il nostro componente `TaskList` così come è scritto attualmente è "presentazionale", nel senso che non interagisce con nulla di esterno alla sua propria implementazione. Dobbiamo collegarlo a un provider di dati per far entrare i dati al suo interno.

Questo esempio utilizza [Redux Toolkit](https://redux-toolkit.js.org/), il set di strumenti più efficace per sviluppare applicazioni per la memorizzazione dei dati con [Redux](https://redux.js.org/), per costruire un semplice modello di dati per la nostra app. Tuttavia, il modello utilizzato qui si applica altrettanto bene ad altre librerie di gestione dei dati come [Apollo](https://www.apollographql.com/client/) e [MobX](https://mobx.js.org/).

Aggiungi le dipendenze necessarie al tuo progetto con:

```shell
yarn add @reduxjs/toolkit react-redux
```

Prima di tutto, costruiremo un semplice store Redux che risponde alle azioni che cambiano lo stato del task. Questo sarà fatto in un file chiamato `store.js` nella directory `src/lib` (mantenuto intenzionalmente semplice):

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

Poi aggiorneremo il nostro componente `TaskList` per connettersi allo store Redux e renderizzare i task che ci interessano:

```jsx:title=src/components/TaskList.jsx
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

Ora che abbiamo dei dati effettivi che popolano il nostro componente, ottenuti dallo store Redux, avremmo potuto collegarlo a `src/App.js` e renderizzare il componente lì. Ma per ora, rimandiamo questa operazione e continuiamo nel nostro percorso incentrato sui componenti.

Non preoccuparti. Ne terremo conto nel prossimo capitolo.

## Fornire contesto con i decoratori

Le nostre storie di Storybook hanno smesso di funzionare con questa modifica perché il nostro `Tasklist` è ora un componente connesso, dato che si basa su uno store Redux per recuperare e aggiornare i nostri task.

![Tasklist interrotto](/intro-to-storybook/broken-tasklist-7-0-optimized.png)

Possiamo utilizzare vari approcci per risolvere questo problema. Tuttavia, dato che la nostra app è piuttosto semplice, possiamo fare affidamento su un decoratore, in modo simile a quanto fatto nel [capitolo precedente](/intro-to-storybook/react/en/composite-component), e fornire uno store simulato nelle nostre storie di Storybook:

```jsx:title=src/components/TaskList.stories.jsx
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
  ],
  status: 'idle',
  error: null,
};

// A super-simple mock of a redux store
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
  decorators: [(story) => <div style={{ padding: '3rem' }}>{story()}</div>],
  tags: ['autodocs'],
  excludeStories: /.*MockedState$/,
};

export const Default = {
  decorators: [
    (story) => <Mockstore taskboxState={MockedState}>{story()}</Mockstore>,
  ],
};

export const WithPinnedTasks = {
  decorators: [
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
  ],
};

export const Loading = {
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

export const Empty = {
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
💡 <code>excludeStories</code> è un campo di configurazione di Storybook che impedisce al nostro stato simulato di essere trattato come una storia. Puoi saperne di più su questo campo nella [documentazione di Storybook](https://storybook.js.org/docs/react/api/csf).
</div>

<video autoPlay muted playsInline loop>
  <source
    src="/intro-to-storybook/finished-tasklist-states-7-0-optimized.mp4"
    type="video/mp4"
  />
</video>

<div class="aside">
💡 Non dimenticare di committare le tue modifiche con git!
</div>

Successo! Siamo tornati al punto di partenza, il nostro Storybook ora funziona e siamo in grado di vedere come potremmo fornire dati a un componente connesso. Nel prossimo capitolo, prenderemo ciò che abbiamo imparato qui e lo applicheremo a uno schermo.
