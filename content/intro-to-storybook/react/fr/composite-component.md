---
title: 'Assembler un composant complexe'
tocTitle: 'Composant complexe'
description: 'Assembler un composant complexe à partir de composants plus simples'
commit: 'c43580d'
---

Dans le précédent chapitre nous avons construit notre premier composant; ce chapitre prolonge ce que nous avons appris pour construire la TaskList, une liste de tâches. Combinons les composants ensemble et voyons ce qui se passe lorsqu'on introduit plus de complexité.

## Tasklist(Liste des tâches)

Taskbox met l'accent sur les tâches épinglées en les positionnant au-dessus des tâches par défaut. Cela donne deux variantes de la `TaskList` pour laquelle vous devez créer des histoires: les éléments par défaut et les éléments par défaut et épinglés.

![tâches par défaut et tâches épinglées](/intro-to-storybook/tasklist-states-1.png)

Comme les données de `Task` peuvent être envoyées de manière asynchrone, nous avons **aussi** besoin d'un état de chargement à rendre en l'absence de connexion. De plus, un état vide est nécessaire lorsqu'il n'y a pas de tâches.

![les tâches vides et en cours de chargement](/intro-to-storybook/tasklist-states-2.png)

## Se préparer

Un composant complexe n'est pas très différent des composants de base qu'il contient. Créez un composant `TaskList` et un fichier d'accompagnement : `src/components/TaskList.js` et `src/components/TaskList.stories.js`.

Commencez par une implémentation grossière de la `TaskList`. Vous devrez importer le composant `Task` de la version précédente et lui passer les attributs et les actions en entrée.

```javascript
// src/components/TaskList.js

import React from 'react';

import Task from './Task';

function TaskList({ loading, tasks, onPinTask, onArchiveTask }) {
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

export default TaskList;
```

Next create `Tasklist`’s test states in the story file.

```javascript
// src/components/TaskList.stories.js

import React from 'react';

import TaskList from './TaskList';
import { taskData, actionsData } from './Task.stories';

export default {
  component: TaskList,
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

export const Default = () => <TaskList tasks={defaultTasksData} {...actionsData} />;

export const WithPinnedTasks = () => <TaskList tasks={withPinnedTasksData} {...actionsData} />;

export const Loading = () => <TaskList loading tasks={[]} {...actionsData} />;

export const Empty = () => <TaskList tasks={[]} {...actionsData} />;
```

<div class="aside">
<a href="https://storybook.js.org/addons/introduction/#1-decorators"><b>Les décorateurs</b></a> sont un moyen de fournir un encapsulation arbitraire aux story. Dans ce cas, nous utilisons une `key` (clé) de décorateur sur le default export pour ajouter du `padding` autour du composant rendu. Ils peuvent également être utilisés pour encapsuler des story dans des "providers" - c'est-à-dire des composants de bibliothèque qui définissent le contexte de React.
</div>

`taskData` fournit la forme d'une `Task` que nous avons créée et exportée à partir du fichier `Task.stories.js`. De même, `actionsData` définit les actions (mocked callbacks) qu'attend un composant `Task`, dont la `TaskList` a également besoin.

Maintenant, regardez dans Storybook pour les nouvelles story de la `TaskList`.

<video autoPlay muted playsInline loop>
  <source
    src="/intro-to-storybook/inprogress-tasklist-states.mp4"
    type="video/mp4"
  />
</video>

## Construire les États

Notre composant est encore rudimentaire, mais nous avons maintenant une idée des story à travailler. Vous pensez peut-être que la présentation de la `.list-items` est trop simpliste. Vous avez raison - dans la plupart des cas, nous ne créerions pas un nouveau composant juste pour ajouter une enveloppe. Mais la **réelle complexité** du composant `TaskList` est révélée dans les cas particuliers `withPinnedTasks`, `loading`, et `empty`.

```javascript
// src/components/TaskList.js

import React from 'react';

import Task from './Task';

function TaskList({ loading, tasks, onPinTask, onArchiveTask }) {
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
      <div className="list-items">
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
      <div className="list-items">
        <div className="wrapper-message">
          <span className="icon-check" />
          <div className="title-message">You have no tasks</div>
          <div className="subtitle-message">Sit back and relax</div>
        </div>
      </div>
    );
  }

  const tasksInOrder = [
    ...tasks.filter(t => t.state === 'TASK_PINNED'),
    ...tasks.filter(t => t.state !== 'TASK_PINNED'),
  ];

  return (
    <div className="list-items">
      {tasksInOrder.map(task => (
        <Task key={task.id} task={task} {...events} />
      ))}
    </div>
  );
}

export default TaskList;
```

Les balises ajoutées donnent l'UI (User Interface) suivante :

<video autoPlay muted playsInline loop>
  <source
    src="/intro-to-storybook/finished-tasklist-states.mp4"
    type="video/mp4"
  />
</video>

Notez la position de l'élément épinglé dans la liste. Nous voulons que l'élément épinglé soit placé en haut de la liste pour qu'il devienne une priorité pour nos utilisateurs.

## Données requises et props

Au fur et à mesure que le composant grossit, les quantités de données a l'entrée(input requirements) augmentent également. Définissez les exigences en matière de props de la `TaskList`. Comme `Task` est un composant enfant, assurez-vous de fournir des données dans la bonne forme pour le rendu. Pour gagner du temps et épargner des soucis, réutilisez les propTypes que vous avez définis dans `Task` plus tôt.

```javascript
// src/components/TaskList.js

import React from 'react';
import PropTypes from 'prop-types';

import Task from './Task';

function TaskList() {
  ...
}


TaskList.propTypes = {
  loading: PropTypes.bool,
  tasks: PropTypes.arrayOf(Task.propTypes.task).isRequired,
  onPinTask: PropTypes.func.isRequired,
  onArchiveTask: PropTypes.func.isRequired,
};

TaskList.defaultProps = {
  loading: false,
};

export default TaskList;
```

## Tests automatisés

Dans le chapitre précédent, nous avons appris à faire des captures instantanées de story de test à l'aide de Storyshots. Avec `Task`, il n'y avait pas beaucoup de complexité à tester au-delà du rendu finale de la story. Comme `TaskList` ajoute une nouvelle couche de complexité, nous voulons vérifier que certains inputs produisent certains outputs qui se prêtent aux tests automatique. Pour ce faire, nous allons créer des tests unitaires en utilisant [Jest](https://facebook.github.io/jest/) couplé avec un moteur de rendu de test.

![Jest logo](/intro-to-storybook/logo-jest.png)

### Tests unitaires avec Jest

Les story de Storybook, les tests manuels et les capture instantanés contribuent largement à éviter les bogues d'UI. Si les story couvrent une grande variété de cas d'utilisation des composants, et que nous utilisons des outils qui garantissent qu'un humain vérifie toute modification des story, les erreurs sont beaucoup moins probables.

Cependant, le diable se cache parfois dans les détails. Un framework de test qui soit explicite sur ces détails est nécessaire. Ce qui nous amène aux tests unitaires.

Dans notre cas, nous voulons que notre `TaskList` rende toute tâche épinglée **avant** toute tâche non épinglée qu'elle a passée dans le props `tasks`. Bien que nous ayons une story (`WithPinnedTasks`) pour tester ce scénario exact, si le composant **arrête** d'ordonner les tâches comme ceci, un examinateur humain ne pourra pas voir du premier coup d'oeil qu'il s'agit d'un bug..

Donc, pour éviter ce problème, nous pouvons utiliser Jest pour générer la story dans le DOM et exécuter des requêtes sur ce DOM pour vérifier les caractéristiques principales du composant sur ce rendu.
L'avantage du format utilisé pour les story, est que nous pouvons simplement importer une story dans nos tests et l'afficher directement dedans!

Créez un fichier de test appelé `src/components/TaskList.test.js`. Ici, nous allons construire nos tests qui font des assertions sur le resultat.

```javascript
// src/components/TaskList.test.js

import React from 'react';
import ReactDOM from 'react-dom';
import { WithPinnedTasks } from './TaskList.stories';

it('renders pinned tasks at the start of the list', () => {
  const div = document.createElement('div');
  ReactDOM.render(<WithPinnedTasks />, div);

  // We expect the task titled "Task 6 (pinned)" to be rendered first, not at the end
  const lastTaskInput = div.querySelector('.list-item:nth-child(1) input[value="Task 6 (pinned)"]');
  expect(lastTaskInput).not.toBe(null);

  ReactDOM.unmountComponentAtNode(div);
});
```

![TaskList test runner](/intro-to-storybook/tasklist-testrunner.png)

Notez que nous avons pu réutiliser la story `WithPinnedTasks` dans notre test unitaire; de cette façon, nous pouvons continuer à exploiter une ressource existante (les exemples représentant des configurations intéressantes d'un composant) de nombreuses façons.

Notez également que ce test est assez fragile. Il est possible qu'à mesure que le projet mûrit, et que l'implémentation exacte de la `Task` change --peut-être en utilisant un nom de classe différent ou une `textarea` plutôt qu'une `input`-- le test échouera, et devra être mis à jour. Ce n'est pas nécessairement un problème, mais plutôt une indication qu'il faut faire attention à utiliser généreusement les tests unitaires pour l'UI. Ils ne sont pas faciles à maintenir. Utilisez plutôt des tests manuels, des captures instantanées et la régression visuelle (voir [chapitre sur les tests](/test/)) lorsque c'est possible.
