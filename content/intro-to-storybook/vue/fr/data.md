---
title: 'Intégrer des données'
tocTitle: 'Les données'
description: 'Apprendre comment intégrer des données dans votre composant d interface utilisateur'
commit: 'bd77a32'
---

Jusqu'à présent, nous avons créé des composants isolés sans état - parfait pour Storybook, mais finalement pas utiles jusqu'à ce que nous leur donnions des données dans notre application.

Ce tutoriel ne se concentre pas sur les détails de la création d'une application, nous ne creuserons donc pas ces détails ici. Mais nous prendrons un moment pour examiner un modèle commun pour relier des données avec des composants de conteneur.

## Composant de conteneur

Notre composant `TaskList` tel qu'il est écrit est "de présentation" (voir [cet article de blog](https://medium.com/@dan_abramov/smart-and-dumb-components-7ca2f9a7c7d0)), du fait qu'il ne communique pas avec des composants externes. Pour obtenir des données, nous avons besoin d'un "conteneur".

Cet exemple utilise [Vuex](https://vuex.vuejs.org), librairie de gestion des données par défaut de Vue, pour créer un modèle de données simple pour notre application. Cependant, le modèle utilisé ici s'applique tout aussi bien à d'autres librairies de gestion de données comme [Apollo](https://www.apollographql.com/client/) et [MobX](https://mobx.js.org/).

Pour commencer, installez vuex avec :

```bash
yarn add vuex@next --save
```

Dans un fichier `src/store.js` nous allons construire un magasin standard Vuex qui répond aux actions qui changeront les états des tâches :

```js:title=src/store.js
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

Dans notre composant de plus haut niveau (`src/App.vue`), nous pouvons connecter le magasin à notre hiérarchie de composants assez facilement :

```html:title=src/App.vue
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

```html:title=src/components/PureTaskList.vue
<template>
  <!-- same content as before -->
</template>

<script>
  import Task from './Task';
  export default {
    name: 'PureTaskList',
    // same content as before
  };
</script>
```

In `src/components/TaskList.vue`:

```html:title=src/components/TaskList.vue
<template>
  <PureTaskList :tasks="tasks" v-on="$listeners" @archive-task="archiveTask" @pin-task="pinTask" />
</template>

<script>
  import PureTaskList from './PureTaskList';
  import { mapState, mapActions } from 'vuex';

  export default {
    components: { PureTaskList },

    methods: mapActions(['archiveTask', 'pinTask']),

    computed: mapState(['tasks']),
  };
</script>
```

La raison pour laquelle la version de présentation de `TaskList` est séparée est qu'il est plus facile à tester et à isoler. Comme il ne dépend pas de la présence d'un magasin, il est beaucoup plus facile de le gérer du point de vue des tests. Renommons `src/components/TaskList.stories.js` en `src/components/PureTaskList.stories.js`, et assurons nous que nos stories utilisent la version de présentation :

```diff:title=src/components/PureTaskList.stories.js
+ import PureTaskList from './PureTaskList';

import * as TaskStories from './Task.stories';

export default {
+ component: PureTaskList,
+ title: 'PureTaskList',
  decorators: [() => '<div style="padding: 3rem;"><story /></div>'],
};

const Template = (args, { argTypes }) => ({
+ components: { PureTaskList },
  props: Object.keys(argTypes),
  // We are reusing our actions from task.stories.js
  methods: TaskStories.actionsData,
+ template: '<PureTaskList v-bind="$props" @pin-task="onPinTask" @archive-task="onArchiveTask" />',
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
  // Inherited data coming from the Default story.stories.js.
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
  // Inherited data coming from the Loading story.stories.js.
  ...Loading.args,
  loading: false,
};
```

<video autoPlay muted playsInline loop>
  <source
    src="/intro-to-storybook/finished-tasklist-states.mp4"
    type="video/mp4"
  />
</video>

De même, nous devons utiliser `PureTaskList` dans notre test Jest :

```diff:title=tests/unit/PureTaskList.spec.js
import Vue from 'vue';

+ import PureTaskList from '../../src/components/PureTaskList.vue';

//👇 Our story imported here
+ import { WithPinnedTasks } from '../../src/components/PureTaskList.stories';

it('renders pinned tasks at the start of the list', () => {
  // render PureTaskList
+ const Constructor = Vue.extend(PureTaskList);
  const vm = new Constructor({
    //👇 Story's args used with our test
    propsData: WithPinnedTasks.args,
  }).$mount();
  const firstTaskPinned = vm.$el.querySelector('.list-item:nth-child(1).TASK_PINNED');

  // We expect the pinned task to be rendered first, not at the end
  expect(firstTaskPinned).not.toBe(null);
});
```

<div class="aside">Si vos tests instantanés échouent à ce stade, vous devez mettre à jour les existants en exécutant le script de test avec l'indicateur -u. Ou créez un nouveau script pour résoudre ce problème.</div>

<div class="aside">
💡 Avec ce changement, vos instantanés nécessiteront une mise à jour. Relancez la commande de test avec l'indicateur <code>-u</code> pour les mettre à jour. N'oubliez pas non plus de valider vos modifications avec git !
</div>
