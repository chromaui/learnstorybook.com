---
title: 'Assembler un composant complexe'
tocTitle: 'Composant complexe'
description: 'Assembler un composant complexe à partir de composants plus simples'
commit: '73d7821'
---

Dans le précédent chapitre, nous avons construit notre premier composant. Ce chapitre prolonge ce que nous avons appris pour construire une liste de tâches (`Tasklist`). Combinons les composants ensemble et voyons ce qui se passe lorsque nous introduisons plus de complexité.

## Tasklist (Liste de tâches)

Taskbox met l'accent sur les tâches épinglées en les positionnant au-dessus des tâches par défaut. Cela donne deux variantes de la `TaskList` pour laquelle vous devez créer des stories: les tâches par défaut et les tâches épinglées.

![Tâches par défaut et tâches épinglées](/intro-to-storybook/tasklist-states-1.png)

Comme les données de `Task` peuvent être envoyées de manière asynchrone, nous avons **aussi** besoin d'un état de chargement à rendre en l'absence de connexion. De plus, un état vide est nécessaire lorsqu'il n'y a pas de tâches.

![Les tâches vides et en cours de chargement](/intro-to-storybook/tasklist-states-2.png)

## Se préparer

Un composant complexe n'est pas très différent des composants de base qu'il contient. Créez un composant `TaskList` et sa story associée: `src/components/TaskList.js` et `src/components/TaskList.stories.js`.

Commencez par une implémentation simpliste de la `TaskList`. Vous devrez importer le composant `Task` de la version précédente, puis lui passer les attributs et les actions en entrée.

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

Ensuite, créez les états de test de la `Tasklist` dans la story.

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
  // The data was inherited from the Default story in Task.stories.js.
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
<a href="https://storybook.js.org/docs/react/writing-stories/decorators"><b>Les décorateurs</b></a> sont un moyen de fournir une encapsulation arbitraire aux stories. Dans notre cas, nous utilisons une clé (`key`) de décorateur dans l'export par défaut pour ajouter du `padding` autour du composant rendu. Ils peuvent également être utilisés pour encapsuler des stories dans des "providers" - c'est-à-dire des composants de bibliothèque qui définissent le contexte de React.
</div>

En important `TaskStories`, nous avons pu [composer](https://storybook.js.org/docs/react/writing-stories/args#args-composition) les arguments (args pour faire court) de nos stories avec un minimum d'effort. De cette façon, les données et les actions (callbacks simulés) attendues par les deux composants sont préservées.

Maintenant, regardez les nouvelles stories de la `TaskList` dans Storybook.

<video autoPlay muted playsInline loop>
  <source
    src="/intro-to-storybook/inprogress-tasklist-states-6-0.mp4"
    type="video/mp4"
  />
</video>

## Construire les états

Notre composant est encore rudimentaire, mais nous avons maintenant une idée des stories à travailler. Vous pensez peut-être que la présentation de la `.list-items` est trop simpliste. Vous avez raison - dans la plupart des cas, nous ne créerions pas un nouveau composant juste pour ajouter une enveloppe. Mais la **réelle complexité** du composant `TaskList` est révélée dans les cas particuliers `withPinnedTasks`, `loading`, et `empty`.

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

  const tasksInOrder = [
    ...tasks.filter((t) => t.state === "TASK_PINNED"),
    ...tasks.filter((t) => t.state !== "TASK_PINNED"),
  ];
  return (
    <div className="list-items">
      {tasksInOrder.map((task) => (
        <Task key={task.id} task={task} {...events} />
      ))}
    </div>
  );
}
```

Les balises ajoutées donnent l'interface suivante :

<video autoPlay muted playsInline loop>
  <source
    src="/intro-to-storybook/finished-tasklist-states-6-0.mp4"
    type="video/mp4"
  />
</video>

Notez la position de l'élément épinglé dans la liste. Nous voulons que l'élément épinglé soit placé en haut de la liste pour qu'il devienne une priorité pour nos utilisateurs.

## Données requises et props

Au fur et à mesure que le composant grossit, le nombre de données à l'entrée augmente également. Définissez les exigences en matière de props de la `TaskList`. Comme `Task` est un composant enfant, assurez-vous de fournir des données de la bonne manière pour le rendu. Pour gagner du temps et épargner des soucis, réutilisez les `propTypes` que vous avez définis dans `Task` précédemment.

```diff:title=src/components/TaskList.js
import React from 'react';
+ import PropTypes from 'prop-types';

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

  const tasksInOrder = [
    ...tasks.filter((t) => t.state === "TASK_PINNED"),
    ...tasks.filter((t) => t.state !== "TASK_PINNED"),
  ];
  return (
    <div className="list-items">
      {tasksInOrder.map((task) => (
        <Task key={task.id} task={task} {...events} />
      ))}
    </div>
  );
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

<div class="aside">
💡 N'oubliez pas de commiter vos changements avec git!
</div>
