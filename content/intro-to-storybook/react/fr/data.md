---
title: 'Transmettre des données'
tocTitle: 'Données'
description: "Apprenez comment transmettre des données à votre composant d'interface d'utilisateur"
commit: '87a5a91'
---

Jusqu'à présent, nous avons créé des composants isolés et sans états - très bien pour Storybook, mais finalement inutiles tant que nous ne fournissons pas de données dans notre application.

Ce tutoriel ne se concentre pas sur les détails de la création d'une application, c'est pourquoi nous n'entrerons pas dans ces détails ici. Mais nous allons prendre un moment pour examiner un modèle classique de récupération de données avec des composants connectés.

## Composants connectés

Notre composant `TaskList` tel qu'il est actuellement écrit est dit "présentationnel" dans la mesure où il n'interagit avec aucun élément extérieur à sa propre implémentation. Pour y introduire des données, nous avons besoin d'un fournisseur de données.

Cet exemple utilise [Redux Toolkit](https://redux-toolkit.js.org/), la librarie d'outils la plus populaire pour le stockage de données avec [Redux](https://redux.js.org/), pour construire un modèle de données simple pour notre application. Cependant, le modèle utilisé ici s'applique tout aussi bien à d'autres bibliothèques de gestion de données comme [Apollo](https://www.apollographql.com/client/) et [MobX](https://mobx.js.org/).

Ajoutez les dependencies nécessaires à votre projet avec:

```shell
yarn add @reduxjs/toolkit react-redux
```

Nous allons d'abord construire un store Redux simple qui répond aux actions de changement d'état des tâches, dans un fichier `store.js` situé dans le dossier `src/lib` (intentionnellement simple):

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

Ensuite, mettons à jour le composant `TaskList` pour se connecter au store Redux et rendre les tâches qui nous intéressent:

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

Maintenant que nous avons des vraies données qui alimentent notre composant, obtenues à partir du store Redux, nous aurions pu le connecter à `src/App.js` et y rendre le composant. Mais pour l'instant, attendons un peu et continuons notre voyage à travers les composants.

Ne vous inquiétez pas, nous nous en occuperons dans le prochain chapitre.

## Définir un contexte avec des décorateurs

À ce stade, les stories de notre Storybook ne fonctionnent plus, car la `TaskList` est dorénavant un composant connecté qui s'appuie sur un store Redux pour récupérer et rendre nos tâches.

![Tasklist cassée](/intro-to-storybook/broken-tasklist-optimized.png)

Il y a plusieurs approches pour résoudre ce problème. Comme notre application est assez simple, nous pouvons utiliser un décorateur, comme lors du [précédent chapitre](/intro-to-storybook/react/fr/composite-component) et utiliser un store Redux simulé dans nos stories Storybook:

```js:title=src/components/TaskList.stories.js
import React from 'react';

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
💡 <code>excludeStories</code> est un champ de la configuration Storybook qui empêche notre état simulé d'être traité comme une story. Vous pouvez en savoir plus sur ce champ dans la <a href="https://storybook.js.org/docs/react/api/csf">documentation Storybook</a>.
</div>

<video autoPlay muted playsInline loop>
  <source
    src="/intro-to-storybook/finished-tasklist-states-6-4-optimized.mp4"
    type="video/mp4"
  />
</video>

<div class="aside">
💡 N'oubliez pas de commiter vos changements avec git!
</div>

Félicitations ! Nous sommes de nouveau opérationnel, notre Storybook fonctionne, et nous sommes capables de récupérer de la donnée à travers un composant connecté. Dans le prochain chapitre, nous utiliserons ce que nous avons appris and nous l'appliquerons à un écran.
