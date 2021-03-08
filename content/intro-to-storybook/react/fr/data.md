---
title: 'Transmettre des données'
tocTitle: 'Données'
description: "Apprenez comment transmettre des données à votre composant d'interface d'utilisateur"
commit: 'd2fca1f'
---

Jusqu'à présent, nous avons créé des composants sans état isolés - très bien pour Storybook, mais finalement inutiles tant que nous ne leur fournirons pas quelques données dans notre application.

Ce tutoriel ne se concentre pas sur les détails de la création d'une application, c'est pourquoi nous n'entrerons pas dans ces détails ici. Mais nous allons prendre un moment pour examiner un modèle commun de câblage de données avec des composants conteneur.

## Composants conteneur

Notre composant `TaskList` tel qu'il est actuellement écrit est "présentationnel" (voir [ce post de blog](https://medium.com/@dan_abramov/smart-and-dumb-components-7ca2f9a7c7d0)) dans la mesure où il ne parle à rien d'extérieur à sa propre implémentation. Pour y introduire des données, nous avons besoin d'un "conteneur".

Cet exemple utilise [Redux](https://redux.js.org/), la bibliothèque React la plus populaire pour le stockage de données, pour construire un modèle de données simple pour notre application. Cependant, le modèle utilisé ici s'applique tout aussi bien à d'autres bibliothèques de gestion de données comme [Apollo](https://www.apollographql.com/client/) et [MobX](https://mobx.js.org/).

Ajoutez les dependencies nécessaires à votre projet avec:

```bash
yarn add react-redux redux
```

Nous allons d'abord construire un stockage Redux simple qui répond aux actions qui changent l'état des tâches, dans un fichier appelé `lib/redux.js` dans le dossier `src` (intentionnellement simple):

```javascript
// src/lib/redux.js

// A simple redux store/actions/reducer implementation.
// A true app would be more complex and separated into different files.
import { createStore } from 'redux';

// The actions are the "names" of the changes that can happen to the store
export const actions = {
  ARCHIVE_TASK: 'ARCHIVE_TASK',
  PIN_TASK: 'PIN_TASK',
};

// The action creators bundle actions with the data required to execute them
export const archiveTask = id => ({ type: actions.ARCHIVE_TASK, id });
export const pinTask = id => ({ type: actions.PIN_TASK, id });

// All our reducers simply change the state of a single task.
function taskStateReducer(taskState) {
  return (state, action) => {
    return {
      ...state,
      tasks: state.tasks.map(task =>
        task.id === action.id ? { ...task, state: taskState } : task
      ),
    };
  };
}

// The reducer describes how the contents of the store change for each action
export const reducer = (state, action) => {
  switch (action.type) {
    case actions.ARCHIVE_TASK:
      return taskStateReducer('TASK_ARCHIVED')(state, action);
    case actions.PIN_TASK:
      return taskStateReducer('TASK_PINNED')(state, action);
    default:
      return state;
  }
};

// The initial state of our store when the app loads.
// Usually you would fetch this from a server
const defaultTasks = [
  { id: '1', title: 'Something', state: 'TASK_INBOX' },
  { id: '2', title: 'Something more', state: 'TASK_INBOX' },
  { id: '3', title: 'Something else', state: 'TASK_INBOX' },
  { id: '4', title: 'Something again', state: 'TASK_INBOX' },
];

// We export the constructed redux store
export default createStore(reducer, { tasks: defaultTasks });
```

Ensuite, nous mettrons à jour le default export du composant `TaskList` pour nous connecter au stockage Redux et faire le rendu des tâches qui nous intéressent:

```javascript
// src/components/TaskList.js

import React from 'react';
import PropTypes from 'prop-types';

import Task from './Task';
import { connect } from 'react-redux';
import { archiveTask, pinTask } from '../lib/redux';

export function PureTaskList({ loading, tasks, onPinTask, onArchiveTask }) {
  /* previous implementation of TaskList */
}

PureTaskList.propTypes = {
  /** Checks if it's in loading state */
  loading: PropTypes.bool,
  /** The list of tasks */
  tasks: PropTypes.arrayOf(Task.propTypes.task).isRequired,
  /** Event to change the task to pinned */
  onPinTask: PropTypes.func.isRequired,
  /** Event to change the task to archived */
  onArchiveTask: PropTypes.func.isRequired,
};

PureTaskList.defaultProps = {
  loading: false,
};

export default connect(
  ({ tasks }) => ({
    tasks: tasks.filter(t => t.state === 'TASK_INBOX' || t.state === 'TASK_PINNED'),
  }),
  dispatch => ({
    onArchiveTask: id => dispatch(archiveTask(id)),
    onPinTask: id => dispatch(pinTask(id)),
  })
)(PureTaskList);
```

Maintenant que nous avons de vraies données qui alimentent notre composant, obtenues à partir de Redux, nous aurions pu le connecter à `src/app.js` et y rendre le composant. Mais pour l'instant, nous allons attendre et continuer notre voyage à travers les composants.

Ne vous inquiétez pas, nous nous en occuperons dans le prochain chapitre.

À ce stade, les tests de notre Storybook auront cessé de fonctionner, car la `TaskList` est maintenant un conteneur, et n'attend plus de props, elle se connecte au stockage et place les accessoires sur le composant `PureTaskList` qu'elle enveloppe.

Cependant, nous pouvons facilement résoudre ce problème en rendant simplement la `PureTaskList` --le composant de présentation, auquel nous venons d'ajouter la déclaration `export` à l'étape précédente-- dans nos story de Storybook :

```javascript
// src/components/TaskList.stories.js

import React from 'react';

import { PureTaskList } from './TaskList';
import * as TaskStories from './Task.stories';

export default {
  component: PureTaskList,
  title: 'TaskList',
  decorators: [story => <div style={{ padding: '3rem' }}>{story()}</div>],
};

const Template = args => <PureTaskList {...args} />;

export const Default = Template.bind({});
Default.args = {
  // Shaping the stories through args composition.
  // The data was inherited the Default story in task.stories.js.
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

<video autoPlay muted playsInline loop>
  <source
    src="/intro-to-storybook/finished-tasklist-states-6-0.mp4"
    type="video/mp4"
  />
</video>

<div class="aside">
Si vos captures instantanées échouent à ce stade, vous devez mettre à jour les capture instantanées existants en exécutant le script de test avec le drapeau <code>-u</code>. De plus, comme notre application se développe progressivement, il serait bon d'exécuter les tests avec le drapeau <code> --watchAll</code> comme mentionné dans la section <a href="/intro-to-storybook/react/fr/get-started/">Débuter</a>.
</div>
