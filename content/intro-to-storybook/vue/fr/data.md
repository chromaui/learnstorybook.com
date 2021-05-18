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
import { createStore } from 'vuex';

export default createStore({
  state: {
    tasks: [
      { id: '1', title: 'Something', state: 'TASK_INBOX' },
      { id: '2', title: 'Something more', state: 'TASK_INBOX' },
      { id: '3', title: 'Something else', state: 'TASK_INBOX' },
      { id: '4', title: 'Something again', state: 'TASK_INBOX' },
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

Ensuite, nous devrons mettre à jour le point d'entrée de notre application ((`src/main.js`) afin de pouvoir connecter le magasin à notre hiérarchie de composants assez rapidement :

```diff:title=src/main.js
import { createApp } from 'vue';

import App from './App.vue';

+ import store from './store';

- createApp(App).mount('#app')
+ createApp(App).use(store).mount('#app')
```

Une fois que nous avons connecté le magasin à notre application, nous devons mettre à jour le composant d'application de niveau supérieur (`src/App.vue`) pour afficher notre composant TaskList :

```diff:title=src/App.vue
<template>
- <img alt="Vue logo" src="./assets/logo.png">
- <HelloWorld msg="Welcome to Your Vue.js App"/>
+ <div id="app">
+   <task-list />
+ </div>
</template>

<script>
- import HelloWorld from './components/HelloWorld.vue'
+ import TaskList from './components/TaskList.vue';

export default {
  name: 'App',
  components: {
-   HelloWorld
+   TaskList
  }
}
</script>

<style>
@import "./index.css";
</style>
```

Ensuite, nous mettrons à jour notre `TaskList` pour lire les données en dehors du magasin. Commençons par déplacer notre version de présentation existante vers le fichier `src/components/PureTaskList.vue` (en renommant le composant `PureTaskList`), et enveloppons-le avec un conteneur.

Dans `src/components/PureTaskList.vue` :

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

Dans `src/components/TaskList.vue` :

```html:title=src/components/TaskList.vue
<template>
  <PureTaskList :tasks="tasks" @archive-task="archiveTask" @pin-task="pinTask" />
</template>

<script>
  import PureTaskList from './PureTaskList';

  import { computed } from 'vue';

  import { useStore } from 'vuex';

  export default {
    components: { PureTaskList },
    setup() {
      //👇 Creates a store instance
      const store = useStore();

      //👇 Retrieves the tasks from the store's state
      const tasks = computed(() => store.state.tasks);

      //👇 Dispatches the actions back to the store
      const archiveTask = task => store.dispatch('archiveTask', task);
      const pinTask = task => store.dispatch('pinTask', task);

      return {
        tasks,
        archiveTask,
        pinTask,
      };
    },
  };
</script>
```

La raison pour laquelle la version de présentation de `TaskList` est séparée est qu'il est plus facile à tester et à isoler. Comme il ne dépend pas de la présence d'un magasin, il est beaucoup plus facile de le gérer du point de vue des tests. Renommons `src/components/TaskList.stories.js` en `src/components/PureTaskList.stories.js`, et assurons nous que nos stories utilisent la version de présentation :

```diff:title=src/components/PureTaskList.stories.js
+ import PureTaskList from './PureTaskList.vue';

import * as TaskStories from './Task.stories';

export default {
+ component: PureTaskList,
+ title: 'PureTaskList',
  decorators: [
    () => ({ template: '<div style="margin: 3em;"><story/></div>' }),
  ],
  argTypes: {
    onPinTask: {},
    onArchiveTask: {},
  },
};

const Template = (args, { argTypes }) => ({
+ components: { PureTaskList },
 setup() {
    return { args, ...TaskStories.actionsData };
  },
+ template: '<PureTaskList v-bind="args" />',
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

<video autoPlay muted playsInline loop>
  <source
    src="/intro-to-storybook/finished-tasklist-states-6-0.mp4"
    type="video/mp4"
  />
</video>

De même, nous devons utiliser `PureTaskList` dans notre test Jest :

```diff:title=tests/unit/PureTaskList.spec.js
import { mount } from '@vue/test-utils';

- import TaskList from '../../src/components/TaskList.vue';

+ import PureTaskList from '../../src/components/PureTaskList.vue';

//👇 Our story imported here
- import { WithPinnedTasks } from '../src/components/TaskList.stories.js';

+ import { WithPinnedTasks } from '../../src/components/PureTaskList.stories';

it('renders pinned tasks at the start of the list', () => {
  // render PureTaskList
- const wrapper = mount(TaskList, {
-   //👇 Story's args used with our test
-   propsData: WithPinnedTasks.args,
- });
+ const wrapper = mount(PureTaskList, {
+   propsData: WithPinnedTasks.args,
+ });

  const firstPinnedTask = wrapper.find('.list-item:nth-child(1).TASK_PINNED');
  expect(firstPinnedTask).not.toBe(null);
});
```

<div class="aside">
💡 Avec ce changement, vos instantanés nécessiteront une mise à jour. Relancez la commande de test avec l'indicateur <code>-u</code> pour les mettre à jour. N'oubliez pas non plus de valider vos modifications avec git !
</div>
