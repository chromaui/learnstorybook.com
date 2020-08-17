---
title: 'Transmettre des données'
tocTitle: 'Données'
description: "Apprenez comment transmettre des données à votre composant d'interface d'utilisateur"
commit: 'f05981b'
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

// Une simple mise en œuvre de redux store/actions/réduction.
// Une véritable application serait plus complexe et séparée en différents fichiers.
import { createStore } from 'redux';

// Les actions sont les "noms" des changements qui peuvent arriver au stockage.
export const actions = {
  ARCHIVE_TASK: 'ARCHIVE_TASK',
  PIN_TASK: 'PIN_TASK',
};

// Les créateurs d'actions regroupent les actions avec les données nécessaires à leur exécution
export const archiveTask = id => ({ type: actions.ARCHIVE_TASK, id });
export const pinTask = id => ({ type: actions.PIN_TASK, id });

// Tous nos réducteurs changent simplement l'état d'une seule tâche.
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

// Le réducteur décrit comment le contenu du magasin change pour chaque action
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

// L'état initial de notre stockage lorsque l'application se charge.
// Habituellement, vous le récupérez sur un serveur
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
  loading: PropTypes.bool,
  tasks: PropTypes.arrayOf(Task.propTypes.task).isRequired,
  onPinTask: PropTypes.func.isRequired,
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

À ce stade, les tests de notre Storybook auront cessé de fonctionner, car la `TaskList` est maintenant un conteneur, et n'attend plus de props, elle se connecte au magasin et place les accessoires sur le composant `PureTaskList` qu'elle enveloppe.

Cependant, nous pouvons facilement résoudre ce problème en rendant simplement la `PureTaskList` --le composant de présentation, auquel nous venons d'ajouter la déclaration `export` à l'étape précédente-- dans nos story de Storybook :

```javascript
// src/components/TaskList.stories.js

import React from 'react';

import { PureTaskList } from './TaskList';
import { taskData, actionsData } from './Task.stories';

export default {
  component: PureTaskList,
  title: 'TaskList',
  decorators: [story => <div style={{ padding: '3rem' }}>{story()}</div>],
  excludeStories: /.*Data$/,
};

export const defaultTasksData = [
  { ...taskData, id: '1', title: 'Task 1' },
  { ...taskData, id: '2', title: 'Task 2' },
  { ...taskData, id: '3', title: 'Task 3' },
  { ...taskData, id: '4', title: 'Task 4' },
  { ...taskData, id: '5', title: 'Task 5' },
  { ...taskData, id: '6', title: 'Task 6' },
];

export const withPinnedTasksData = [
  ...defaultTasksData.slice(0, 5),
  { id: '6', title: 'Task 6 (pinned)', state: 'TASK_PINNED' },
];

export const Default = () => <PureTaskList tasks={defaultTasksData} {...actionsData} />;

export const WithPinnedTasks = () => <PureTaskList tasks={withPinnedTasksData} {...actionsData} />;

export const Loading = () => <PureTaskList loading tasks={[]} {...actionsData} />;

export const Empty = () => <PureTaskList tasks={[]} {...actionsData} />;
```

<video autoPlay muted playsInline loop>
  <source
    src="/intro-to-storybook/finished-tasklist-states.mp4"
    type="video/mp4"
  />
</video>

<div class="aside">
Si vos captures instantanées échouent à ce stade, vous devez mettre à jour les capture instantanées existants en exécutant le script de test avec le drapeau <code>-u</code>. De plus, comme notre application se développe progressivement, il serait bon d'exécuter les tests avec le drapeau <code> --watchAll</code> comme mentionné dans la section <a href="/react/en/get-started/">Débuter</a>.
</div>
