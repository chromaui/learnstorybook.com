---
title: 'Collegare i dati'
tocTitle: 'Dati'
description: 'Impara come collegare i dati al tuo componente UI'
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

Per prima cosa, costruiremo un semplice store Redux che risponde alle azioni che cambiano lo stato del task, in un file chiamato `store.js` nella root del nostro progetto.

```js:title=store.js
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

```js:title=components/TaskList.jsx
import { Task } from './Task';
import { FlatList, Text, View } from 'react-native';
import { LoadingRow } from './LoadingRow';
import { MaterialIcons } from '@expo/vector-icons';
import { styles } from './styles';
import { useDispatch, useSelector } from 'react-redux';
import { updateTaskState } from '../store';

export const TaskList = () => {
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

  if (status === "loading") {
    return (
      <View style={[styles.listItems, { justifyContent: "center" }]}>
        <LoadingRow />
        <LoadingRow />
        <LoadingRow />
        <LoadingRow />
        <LoadingRow />
        <LoadingRow />
      </View>
    );
  }

  if (tasks.length === 0) {
    return (
      <View style={styles.listItems}>
        <View style={styles.wrapperMessage}>
          <MaterialIcons name="check" size={64} color={"#2cc5d2"} />
          <Text style={styles.titleMessage}>You have no tasks</Text>
          <Text style={styles.subtitleMessage}>Sit back and relax</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.listItems}>
      <FlatList
        data={tasks}
        keyExtractor={(task) => task.id}
        renderItem={({ item }) => (
          <Task
            key={item.id}
            task={item}
            onPinTask={(task) => pinTask(task)}
            onArchiveTask={(task) => archiveTask(task)}
          />
        )}
      />
    </View>
  );
};
```

Ora che abbiamo dei dati effettivi che popolano il nostro componente, ottenuti dallo store Redux, avremmo potuto collegarlo alla nostra app `App.jsx` e renderizzare il componente lì. Ma per ora, rimandiamo questa operazione e continuiamo nel nostro percorso incentrato sui componenti.

## Fornire contesto con i decoratori

Le nostre storie di Storybook hanno smesso di funzionare con questa modifica perché il nostro `Tasklist` è ora un componente connesso, dato che si basa su uno store Redux per recuperare e aggiornare i nostri task.

<img src="/intro-to-storybook/react-native-broken-tasklist.png" alt="schermata di errore" height="600">

Possiamo utilizzare vari approcci per risolvere questo problema. Tuttavia, dato che la nostra app è piuttosto semplice, possiamo fare affidamento su un decoratore, simile a quanto fatto nel [capitolo precedente](/intro-to-storybook/react-native/it/composite-component/), e fornire uno store simulato nelle nostre storie di Storybook:

```js:title=src/components/TaskList.stories.jsx
import { TaskList } from './TaskList';
import { Default as TaskStory } from './Task.stories';
import { View } from 'react-native';
import { Provider } from 'react-redux';

import { configureStore, createSlice } from '@reduxjs/toolkit';

// A super-simple mock of the state of the store
const MockedState = {
  tasks: [
    { ...TaskStory.args.task, id: '1', title: 'Task 1' },
    { ...TaskStory.args.task, id: '2', title: 'Task 2' },
    { ...TaskStory.args.task, id: '3', title: 'Task 3' },
    { ...TaskStory.args.task, id: '4', title: 'Task 4' },
    { ...TaskStory.args.task, id: '5', title: 'Task 5' },
    { ...TaskStory.args.task, id: '6', title: 'Task 6' },
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
  decorators: [
    (Story) => (
      <View style={{ padding: 42, flex: 1 }}>
        <Story />
      </View>
    ),
  ],
  argTypes: {
    onPinTask: { action: 'onPinTask' },
    onArchiveTask: { action: 'onArchiveTask' },
  },
};

export const Default = {
  decorators: [
    (story) => <Mockstore taskboxState={MockedState}>{story()}</Mockstore>,
  ],
  args: {
    // Shaping the stories through args composition.
    // The data was inherited from the Default story in Task.stories.js.
    tasks: [
      { ...TaskStory.args.task, id: '1', title: 'Task 1' },
      { ...TaskStory.args.task, id: '2', title: 'Task 2' },
      { ...TaskStory.args.task, id: '3', title: 'Task 3' },
      { ...TaskStory.args.task, id: '4', title: 'Task 4' },
      { ...TaskStory.args.task, id: '5', title: 'Task 5' },
      { ...TaskStory.args.task, id: '6', title: 'Task 6' },
    ],
  },
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
  args: {
    // Shaping the stories through args composition.
    // Inherited data coming from the Default story.
    tasks: [
      ...Default.args.tasks.slice(0, 5),
      { id: '6', title: 'Task 6 (pinned)', state: 'TASK_PINNED' },
    ],
  },
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
  args: {
    tasks: [],
    loading: true,
  },
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
  args: {
    // Shaping the stories through args composition.
    // Inherited data coming from the Loading story.
    ...Loading.args,
    loading: false,
  },
};
```

<div class="aside">
💡 Non dimenticare di committare le tue modifiche con git!
</div>

Successo! Siamo tornati al punto di partenza, il nostro Storybook ora funziona e siamo in grado di vedere come potremmo fornire dati a un componente connesso.

![Componenti TaskList](/intro-to-storybook/react-native-finished-tasklist-states.gif)
