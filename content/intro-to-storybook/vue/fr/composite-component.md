---
title: 'Assembler un composant composite'
tocTitle: 'Composant composite'
description: 'Assembler un composant composite à partir de composants plus simples'
commit: '0680725'
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
  <div>
    <div class="list-items" v-if="loading">loading</div>
    <div class="list-items" v-if="noTasks && !this.loading">empty</div>
    <div class="list-items" v-if="showTasks">
      <task
        v-for="(task, index) in tasks"
        :key="index"
        :task="task"
        @archiveTask="$emit('archiveTask', $event)"
        @pinTask="$emit('pinTask', $event)"
      />
    </div>
  </div>
</template>

<script>
  import Task from './Task';
  export default {
    name: 'task-list',
    props: {
      loading: {
        type: Boolean,
        default: false,
      },
      tasks: {
        type: Array,
        default: () => [],
      },
    },
    components: {
      Task,
    },
    computed: {
      noTasks() {
        return this.tasks.length === 0;
      },
      showTasks() {
        return !this.loading && !this.noTasks;
      },
    },
  };
</script>
```

Créez ensuite les états de `Tasklist` dans le fichier de l'histoire.

```js:title=src/components/TaskList.stories.js
import TaskList from './TaskList';
import { taskData, actionsData } from './Task.stories';

const paddedList = () => {
  return {
    template: '<div style="padding: 3rem;"><story/></div>',
  };
};
export default {
  title: 'TaskList',
  excludeStories: /.*Data$/,
  decorators: [paddedList],
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

// Etat de TaskList par défault
export const Default = () => ({
  components: { TaskList },
  template: `<task-list :tasks="tasks" @archiveTask="onArchiveTask" @pinTask="onPinTask"/>`,
  props: {
    tasks: {
      default: () => defaultTasksData,
    },
  },
  methods: actionsData,
});
// Liste de tâches avec des tâches épinglées.
export const WithPinnedTasks = () => ({
  components: { TaskList },
  template: `<task-list :tasks="tasks" @archiveTask="onArchiveTask" @pinTask="onPinTask"/>`,
  props: {
    tasks: {
      default: () => withPinnedTasksData,
    },
  },
  methods: actionsData,
});
// Liste des taĉhes en cours de chargement.
export const Loading = () => ({
  components: { TaskList },
  template: `<task-list loading @archiveTask="onArchiveTask" @pinTask="onPinTask"/>`,
  methods: actionsData,
});
// Liste des taĉhes vide.
export const Empty = () => ({
  components: { TaskList },
  template: `<task-list @archiveTask="onArchiveTask" @pinTask="onPinTask"/>`,
  methods: actionsData,
});
```

<div class="aside">
Les <a href="https://storybook.js.org/docs/vue/writing-stories/decorators"><b>décorateurs</b></a> sont un moyen de fournir des enveloppes arbitraires aux histoires. Dans ce cas, nous utilisons une clé décoratrice dans l'exportation par défaut pour ajouter un style. Mais ils peuvent également être utilisés pour ajouter d'autres contextes aux composants, comme nous le verrons plus tard.
</div>

`taskData` fournit la forme d'une `Task` que nous avons créée et exportée à partir du fichier `Task.stories.js`. De même, `actionsData` définit les actions (bouchonnés) attendues par un composant `Task`, dont la `TaskList` a également besoin.

Vérifiez maintenant Storybook pour les nouvelles histoires de `Tasklist`.

<video autoPlay muted playsInline loop>
  <source
    src="/intro-to-storybook/inprogress-tasklist-states.mp4"
    type="video/mp4"
  />
</video>

## Construire les états

Notre composant est encore difficile, mais nous avons maintenant une idée des histoires sur lesquelles travailler. Vous pensez peut-être que le wrapper `.list-items est` trop simpliste. Vous avez raison: dans la plupart des cas, nous ne créerions pas de nouveau composant uniquement pour ajouter un wrapper. Mais la **vraie complexité** du composant `TaskList` est révélée dans les cas marginaux `WithPinnedTasks`, `loadgin` et `empty`.

```html:title=src/components/TaskList.vue
<template>
  <div>
    <div v-if="loading">
      <div class="loading-item" v-for="(n, index) in 5" :key="index">
        <span class="glow-checkbox" />
        <span class="glow-text"> <span>Loading</span> <span>cool</span> <span>state</span> </span>
      </div>
    </div>
    <div class="list-items" v-if="noTasks && !this.loading">
      <div class="wrapper-message">
        <span class="icon-check" />
        <div class="title-message">You have no tasks</div>
        <div class="subtitle-message">Sit back and relax</div>
      </div>
    </div>
    <div class="list-items" v-if="showTasks">
      <task
        v-for="(task, index) in tasksInOrder"
        :key="index"
        :task="task"
        @archiveTask="$emit('archiveTask', $event)"
        @pinTask="$emit('pinTask', $event)"
      />
    </div>
  </div>
</template>

<script>
  import Task from './Task';
  export default {
    name: 'task-list',
    props: {
      loading: {
        type: Boolean,
        default: false,
      },
      tasks: {
        type: Array,
        default: () => [],
      },
    },
    components: {
      Task,
    },
    computed: {
      noTasks() {
        return this.tasks.length === 0;
      },
      showTasks() {
        return !this.loading && !this.noTasks;
      },
      tasksInOrder() {
        return [
          ...this.tasks.filter((t) => t.state === 'TASK_PINNED'),
          ...this.tasks.filter((t) => t.state !== 'TASK_PINNED'),
        ];
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

Dans notre cas, nous voulons que notre `TaskList` affiche toutes les tâches épinglées **avant** les tâches non épinglées qui sont passées dans la propriété `tasks`. Bien que nous ayons une histoire (`WithPinnedTasks`) pour tester ce scénario exact; il peut être ambigu pour un réviseur humain que si le composant **arrête** d'ordonner les tâches comme celle-ci, c'est un bug. Il ne crie certainement pas **"Faux!"** à l'œil occasionnel.

Ainsi, pour éviter ce problème, nous pouvons utiliser Jest pour rendre l'histoire dans le DOM et exécuter du code d'interrogation DOM pour vérifier les principales caractéristiques de la sortie.

Créez un fichier de test appelé `tests/unit/TaskList.spec.js`. Ici, nous allons construire nos tests qui font des affirmations sur la sortie.
parfois

```js:title=tests/unit/TaskList.spec.js
import Vue from 'vue';
import TaskList from '../../src/components/TaskList.vue';
import { withPinnedTasksData } from '../../src/components/TaskList.stories';

it('renders pinned tasks at the start of the list', () => {
  const Constructor = Vue.extend(TaskList);
  const vm = new Constructor({
    propsData: { tasks: withPinnedTasksData },
  }).$mount();
  const firstTaskPinned = vm.$el.querySelector('.list-item:nth-child(1).TASK_PINNED');

  // Nous nous attendons à ce que la tâche épinglée soit rendue en premier, pas à la fin
  expect(firstTaskPinned).not.toBe(null);
});
```

![TaskList test runner](/intro-to-storybook/tasklist-testrunner.png)

Notez que nous avons été en mesure de réutiliser la liste de tâches `withPinnedTasksData` à la fois dans l'histoire et dans le test unitaire; de cette manière, nous pouvons continuer à exploiter une ressource existante (les exemples qui représentent des configurations intéressantes d'un composant) de plus en plus de façons.

Notez également que ce test est assez fragile. Il est possible qu'à mesure que le projet mûrit et que l'implémentation exacte de `Task` change - peut-être en utilisant un nom de classe différent - le test échoue et doit être mis à jour. Ce n'est pas nécessairement un problème, mais plutôt une indication de faire preuve de prudence en utilisant les tests unitaires pour l'interface utilisateur. Ils ne sont pas faciles à entretenir. Fiez-vous plutôt à la régression visuelle, instantanée et visuelle (voir [le chapitre de tests](/intro-to-storybook/vue/fr/test/) lorsque cela est possible.
