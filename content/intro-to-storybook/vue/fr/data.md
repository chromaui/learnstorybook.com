---
title: 'Intégrer des données'
tocTitle: 'Les données'
description: 'Apprendre comment intégrer des données dans votre composant d interface utilisateur'
commit: 'fa1c954'
---

Jusqu'à présent, nous avons créé des composants isolés sans état - parfait pour Storybook, mais finalement pas utiles jusqu'à ce que nous leur donnions des données dans notre application.

Ce tutoriel ne se concentre pas sur les détails de la création d'une application, nous ne creuserons donc pas ces détails ici.

## Composant de conteneur

Notre composant `TaskList` tel qu'il est écrit est "de présentation" (voir [cet article de blog](https://medium.com/@dan_abramov/smart-and-dumb-components-7ca2f9a7c7d0)), du fait qu'il ne communique pas avec des composants externes. Pour obtenir des données, nous avons besoin d'un "conteneur".

Cet exemple utilise [Vuex](https://vuex.vuejs.org), librairie de gestion des données par défaut de Vue, pour créer un modèle de données simple pour notre application. Cependant, le modèle utilisé ici s'applique tout aussi bien à d'autres librairies de gestion de données comme [Apollo](https://www.apollographql.com/client/) et [MobX](https://mobx.js.org/).

Pour commencer, installez vuex avec :

```bash
yarn add vuex
```

Dans un fichier `src/store.js` nous allons construire un magasin standard Vuex qui répond aux actions qui changeront les états des tâches :

```javascript
// src/store.js
import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    tasks: [
      { id: '1', title: 'Quelque chose', state: 'TASK_INBOX' },
      { id: '2', title: 'Quelque chose de plus', state: 'TASK_INBOX' },
      { id: '3', title: 'Autre chose', state: 'TASK_INBOX' },
      { id: '4', title: 'Encore quelque chose', state: 'TASK_INBOX' },
    ],
  },
  mutations: {
    ARCHIVE_TASK(state, id) {
      state.tasks.find(task => task.id === id).state = 'TASK_ARCHIVED';
    },
    PIN_TASK(state, id) {
      state.tasks.find(task => task.id === id).state = 'TASK_PINNED';
    },
  },
  actions: {
    archiveTask({ commit }, id) {
      commit('ARCHIVE_TASK', id);
    },
    pinTask({ commit }, id) {
      commit('PIN_TASK', id);
    },
  },
});
```

Dans notre composant d'application de niveau supérieur (src / App.vue), nous pouvons connecter le magasin à notre hiérarchie de composants assez facilement

Dans notre composant de plus haut niveau (`src/App.vue`), nous pouvons connecter le magasin à notre hiérarchie de composants assez facilement:

```html
<!--src/App.vue-->
<template>
  <div id="app">
    <task-list />
  </div>
</template>

<script>
  import store from './store';
  import TaskList from './components/TaskList.vue';

  export default {
    name: 'app',
    store,
    components: {
      TaskList,
    },
  };
</script>
<style>
  @import './index.css';
</style>
```

Ensuite nous mettrons à jour notre `TaskList` pour lire les données du magasin. Commençons par déplacer notre version de présentation existante dans le fichier `src/components/PureTaskList.vue` (renommant le composant en `pure-task-list`), et enveloppons-le avec un conteneur.

Dans `src/components/PureTaskList.vue`:

```html

<!--src/components/PureTaskList.vue-->
<template>
<!--same content as before-->
</template>

<script>
import Task from "./Task";
export default {
  name: "pure-task-list",
  ...
}
```

In `src/components/TaskList.vue`:

```html
<!--src/components/TaskList.vue`-->
<template>
  <div>
    <pure-task-list :tasks="tasks" @archiveTask="archiveTask" @pinTask="pinTask" />
  </div>
</template>

<script>
  import PureTaskList from './PureTaskList';
  import { mapState, mapActions } from 'vuex';

  export default {
    name: 'task-list',
    components: {
      PureTaskList,
    },
    methods: {
      ...mapActions(['archiveTask', 'pinTask']),
    },
    computed: {
      ...mapState(['tasks']),
    },
  };
</script>
```

La raison pour laquelle la version de présentation de `TaskList` est séparée est qu'il est plus facile à tester et à isoler. Comme il ne dépend pas de la présence d'un magasin, il est beaucoup plus facile de le gérer du point de vue des tests. Renommons `src/components/TaskList.stories.js` en `src/components/PureTaskList.stories.js`, et assurons nous que nos stories utilisent la version de présentation :

```javascript
//src/components/PureTaskList.stories.js
import PureTaskList from './PureTaskList';
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

export const Default = () => ({
  components: { PureTaskList },
  template: `<pure-task-list :tasks="tasks" @archiveTask="onArchiveTask" @pinTask="onPinTask"/>`,
  props: {
    tasks: {
      default: () => defaultTasksData,
    },
  },
  methods: actionsData,
});
// liste de tâches avec des tâches épinglées
export const WithPinnedTasks = () => ({
  components: { PureTaskList },
  template: `<pure-task-list :tasks="tasks" @archiveTask="onArchiveTask" @pinTask="onPinTask"/>`,
  props: {
    tasks: {
      default: () => withPinnedTasksData,
    },
  },
  methods: actionsData,
});
// liste de tâches en état de chargement
export const Loading = () => ({
  components: { PureTaskList },
  template: `<pure-task-list loading @archiveTask="onArchiveTask" @pinTask="onPinTask"/>`,
  methods: actionsData,
});
// liste de tâches sans tâche
export const Empty = () => ({
  components: { PureTaskList },
  template: `<pure-task-list @archiveTask="onArchiveTask" @pinTask="onPinTask"/>`,
  methods: actionsData,
});
```

<video autoPlay muted playsInline loop>
  <source
    src="/intro-to-storybook/finished-tasklist-states.mp4"
    type="video/mp4"
  />
</video>

De même, nous devons utiliser `PureTaskList` dans notre test Jest :

```js
//tests/unit/TaskList.spec.js
import Vue from 'vue';
import PureTaskList from '../../src/components/PureTaskList.vue';
import { withPinnedTasksData } from '../../src/components/PureTaskList.stories';

it('affiche les tâches épinglées au début de la liste', () => {
  const Constructor = Vue.extend(PureTaskList);
  const vm = new Constructor({
    propsData: { tasks: withPinnedTasksData },
  }).$mount();
  const lastTaskInput = vm.$el.querySelector('.list-item:nth-child(1).TASK_PINNED');

  // Nous nous attendons à ce que la tâche épinglée soit affichée en premier, pas à la fin
  expect(lastTaskInput).not.toBe(null);
});
```

<div class="aside">Si vos tests instantanés échouent à ce stade, vous devez mettre à jour les existants en exécutant le script de test avec l'indicateur -u. Ou créez un nouveau script pour résoudre ce problème.</div>
