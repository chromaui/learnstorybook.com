---
title: 'Assembler un composant composite'
tocTitle: 'Composant composite'
description: 'Assembler un composant composite à partir de composants plus simples'
commit: 'ef6a2ed'
---

Le dernier chapitre, nous avons construit notre premier composant; ce chapitre étend ce que nous avons appris pour construire TaskList, une liste de tâches. Combinons les composants ensemble et voyons ce qui se passe lorsque plus de complexité est introduite.

## Tasklist

Taskbox met l'accent sur les tâches épinglées en les positionnant au-dessus des tâches par défaut. Cela donne deux variantes de la liste des tâches pour lesquelles vous devez créer des histoires: les éléments par défaut et les éléments par défaut et épinglés.

![tâches par défault et épinglées](/intro-to-storybook/tasklist-states-1.png)

Étant donné que les données de `Task` peuvent être envoyées de manière asynchrone, nous avons **également** besoin d'un état de chargement à rendre en l'absence de connexion. De plus, un état vide est requis lorsqu'il n'y a pas de tâches.

![Composant vide et liste de tâches en cours de chargement](/intro-to-storybook/tasklist-states-2.png)

## Obtenir la configuration

Un composant composite n’est pas très différent des composants de base qu’il contient. Créez un composant `TaskList` et un fichier d'histoire associé: `src/components/TaskList.vue` et `src/components/TaskList.stories.js`.

Commencez par une implémentation approximative de `Tasklist`. Vous devrez importer le composant `Task` et transmettre les attributs et les actions en tant qu'entrées.

```html:title=src/components/TaskList.vue
<template>
  <div class="list-items">
    <template v-if="loading">
      loading
    </template>
    <template v-else-if="isEmpty">
      empty
    </template>
    <template v-else>
      <Task v-for="task in tasks" :key="task.id" :task="task" v-on="$listeners" />
    </template>
  </div>
</template>

<script>
  import Task from './Task';
  export default {
    name: 'TaskList',
    components: { Task },
    props: {
      tasks: { type: Array, required: true, default: () => [] },
      loading: { type: Boolean, default: false },
    },
    computed: {
      isEmpty() {
        return this.tasks.length === 0;
      },
    },
  };
</script>
```

Créez ensuite les états de `Tasklist` dans le fichier de l'histoire.

```js:title=src/components/TaskList.stories.js
import TaskList from './TaskList';
import * as TaskStories from './Task.stories';

export default {
  component: TaskList,
  title: 'TaskList',
  decorators: [() => '<div style="padding: 3rem;"><story /></div>'],
};

const Template = (args, { argTypes }) => ({
  components: { TaskList },
  props: Object.keys(argTypes),
  // Nous réutilisons nos actions de task.stories.js
  methods: TaskStories.actionsData,
  template: '<TaskList v-bind="$props" @pin-task="onPinTask" @archive-task="onArchiveTask" />',
});

export const Default = Template.bind({});
Default.args = {
  // Shaping the stories through args composition.
  // The data was inherited from the Default story in task.stories.js.
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
💡 Les <a href="https://storybook.js.org/docs/vue/writing-stories/decorators"><b>décorateurs</b></a> sont un moyen de fournir des enveloppes arbitraires aux histoires. Dans ce cas, nous utilisons une `clé` décoratrice sur l'exportation par défaut pour ajouter un `remplissage` autour du composant rendu. Ils peuvent également être utilisés pour encapsuler des stories dans des "fournisseurs" - c'est-à-dire des composants de bibliothèque qui définissent le contexte.
</div>

En important des `TaskStories`, nous avons pu [composer](https://storybook.js.org/docs/vue/writing-stories/args#args-composition) les arguments (args pour faire court) dans nos histoires avec un minimum d'effort. La manière dont les données et les actions (rappels bouchonnés) attendus par les deux composants sont préservées.

Vérifiez maintenant Storybook pour les nouvelles histoires de `Tasklist`.

<video autoPlay muted playsInline loop>
  <source
    src="/intro-to-storybook/inprogress-tasklist-states.mp4"
    type="video/mp4"
  />
</video>

## Construire les états

Notre composant est encore difficile, mais nous avons maintenant une idée des histoires sur lesquelles travailler. Vous pensez peut-être que le wrapper `.list-items est` trop simpliste. Vous avez raison: dans la plupart des cas, nous ne créerions pas de nouveau composant uniquement pour ajouter un wrapper. Mais la **vraie complexité** du composant `TaskList` est révélée dans les cas marginaux `WithPinnedTasks`, `loading` et `empty`.

```diff:title=src/components/TaskList.vue
<template>
  <div class="list-items">
    <template v-if="loading">
+     <div v-for="n in 6" :key="n" class="loading-item">
+       <span class="glow-checkbox" />
+       <span class="glow-text"> <span>Loading</span> <span>cool</span> <span>state</span> </span>
+     </div>
    </template>

    <div v-else-if="isEmpty" class="list-items">
+     <div class="wrapper-message">
+       <span class="icon-check" />
+       <div class="title-message">You have no tasks</div>
+       <div class="subtitle-message">Sit back and relax</div>
+     </div>
    </div>

    <template v-else>
+     <Task v-for="task in tasksInOrder" :key="task.id" :task="task" v-on="$listeners" />
    </template>
  </div>
</template>

<script>
  import Task from './Task';
  export default {
    name: 'TaskList',
    components: { Task },
    props: {
      tasks: { type: Array, required: true, default: () => [] },
      loading: { type: Boolean, default: false },
    },
    computed: {
+     tasksInOrder() {
+       return [
+         ...this.tasks.filter(t => t.state === 'TASK_PINNED'),
+         ...this.tasks.filter(t => t.state !== 'TASK_PINNED'),
+       ];
+     },
      isEmpty() {
        return this.tasks.length === 0;
      },
    },
  };
</script>
```

Les ajouts ont entraînés l'interface utilisateur suivante:

<video autoPlay muted playsInline loop>
  <source
    src="/intro-to-storybook/finished-tasklist-states.mp4"
    type="video/mp4"
  />
</video>

Notez la position de l'élément épinglé dans la liste. Nous voulons que l'élément épinglé s'affiche en haut de la liste pour en faire une priorité pour nos utilisateurs.

## Tests automatisés

Dans le chapitre précédent, nous avons appris à créer des histoires de tests instantanés à l'aide de Storyshots. Avec `Task`, il n'y avait pas beaucoup de complexité à tester au-delà de son rendu OK. Puisque `TaskList` ajoute une autre couche de complexité, nous voulons vérifier que certaines entrées produisent certaines sorties de manière à pouvoir être testées automatiquement. Pour ce faire, nous allons créer des tests unitaires en utilisant [Jest](https://facebook.github.io/jest/) couplé à un moteur de rendu de test.

![Logo Jest](/intro-to-storybook/logo-jest.png)

### Tests unitaires avec Jest

Les histoires de storybook associées à des tests visuels manuels et à des tests d'instantanés (voir ci-dessus) contribuent grandement à éviter les bogues de l'interface utilisateur. Si les histoires couvrent une grande variété de cas d'utilisation de composants et que nous utilisons des outils qui garantissent qu'un humain vérifie tout changement dans l'histoire, les erreurs sont beaucoup moins probables.

Cependant, parfois, le diable est dans les détails. Un framework de test explicite sur ces détails est nécessaire. Ce qui nous amène aux tests unitaires.

Dans notre cas, nous voulons que notre `TaskList` affiche toutes les tâches épinglées **avant** les tâches non épinglées qui sont passées dans la propriété `tasks`. Bien que nous ayons une histoire (`WithPinnedTasks`) pour tester ce scénario exact; il peut être ambigu pour un réviseur humain que si le composant **arrête** d'ordonner les tâches comme celle-ci, c'est un bug. Il ne crie certainement pas **"Faux !"** à l'œil occasionnel.

Ainsi, pour éviter ce problème, nous pouvons utiliser Jest pour rendre l'histoire dans le DOM et exécuter du code d'interrogation DOM pour vérifier les principales caractéristiques de la sortie.

Créez un fichier de test appelé `tests/unit/TaskList.spec.js`. Ici, nous allons construire nos tests qui font des affirmations sur la sortie.
parfois

```js:title=tests/unit/TaskList.spec.js
import Vue from 'vue';

import TaskList from '../../src/components/TaskList.vue';

import { WithPinnedTasks } from '../../src/components/TaskList.stories';

it('rend les tâches épinglées au début de la liste', () => {
  // rendu Tasklist
  const Constructor = Vue.extend(TaskList);
  const vm = new Constructor({
    // ... en utilisant WithPinnedTasks.args
    propsData: WithPinnedTasks.args,
  }).$mount();
  const firstTaskPinned = vm.$el.querySelector('.list-item:nth-child(1).TASK_PINNED');

  // Nous nous attendons à ce que la tâche épinglée soit rendue en premier, pas à la fin
  expect(firstTaskPinned).not.toBe(null);
});
```

![TaskList test runner](/intro-to-storybook/tasklist-testrunner.png)

Notez que nous avons été en mesure de réutiliser la liste de tâches `withPinnedTasksData` à la fois dans l'histoire et dans le test unitaire; de cette manière, nous pouvons continuer à exploiter une ressource existante (les exemples qui représentent des configurations intéressantes d'un composant) de plus en plus de façons.

Notez également que ce test est assez fragile. Il est possible qu'à mesure que le projet mûrit et que l'implémentation exacte de `Task` change - peut-être en utilisant un nom de classe différent - le test échoue et doit être mis à jour. Ce n'est pas nécessairement un problème, mais plutôt une indication de faire preuve de prudence en utilisant les tests unitaires pour l'interface utilisateur. Ils ne sont pas faciles à entretenir. Fiez-vous plutôt à la régression visuelle, instantanée et visuelle (voir [le chapitre de tests](/vue/fr/test/) lorsque cela est possible.

<div class="aside">
💡 N'oubliez pas de valider vos modifications avec git !
</div>
