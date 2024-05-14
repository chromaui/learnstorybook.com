---
title: 'Collegare i dati'
tocTitle: 'Dati'
description: 'Impara come collegare i dati al tuo componente UI'
commit: '30e306d'
---

Finora, abbiamo creato componenti senza stato isolati, ottimi per Storybook, ma alla fine non utili finché non gli forniamo alcuni dati nella nostra app.

Questo tutorial non si concentra sui particolari della costruzione di un'app, quindi non approfondiremo quei dettagli qui. Ma prenderemo un momento per esaminare un modello comune per il collegamento dei dati nei componenti connessi.

## Componenti connessi

Il nostro componente `TaskList` così come è scritto attualmente è "presentazionale", nel senso che non interagisce con nulla di esterno alla sua propria implementazione. Per far entrare i dati al suo interno, abbiamo bisogno di un “contenitore”.

Questo esempio utilizza [Pinia](https://pinia.vuejs.org/), la libreria default di Vue per la gestione dei dati, per creare un modello di dati semplice per la nostra app. Tuttavia, il modello utilizzato qui si applica altrettanto bene ad altre librerie di gestione dei dati come [Apollo](https://www.apollographql.com/client/) e [MobX](https://mobx.js.org/).

Aggiungi le dipendenze necessarie al tuo progetto con:

```shell
yarn add pinia
```

Prima di tutto, costruiremo un semplice store di Pinia che risponde alle azioni che cambiano lo stato del task in un file chiamato `store.js` nella stessa directory `src` (mantenuto intenzionalmente semplice):

```js:title=src/store.js
/* A simple Pinia store/actions implementation.
 * A true app would be more complex and separated into different files.
 */
import { defineStore } from 'pinia';

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

/*
 * The store is created here.
 * You can read more about Pinia defineStore in the docs:
 * https://pinia.vuejs.org/core-concepts/
 */
export const useTaskStore = defineStore({
  id: 'taskbox',
  state: () => ({
    tasks: defaultTasks,
    status: 'idle',
    error: null,
  }),
  actions: {
    archiveTask(id) {
      const task = this.tasks.find((task) => task.id === id);
      if (task) {
        task.state = 'TASK_ARCHIVED';
      }
    },
    pinTask(id) {
      const task = this.tasks.find((task) => task.id === id);
      if (task) {
        task.state = 'TASK_PINNED';
      }
    },
  },
  getters: {
    getFilteredTasks: (state) => {
      const filteredTasks = state.tasks.filter(
        (t) => t.state === 'TASK_INBOX' || t.state === 'TASK_PINNED'
      );
      return filteredTasks;
    },
  },
});
```

Poi aggiorneremo la nostra `Tasklist` per leggere i dati fuori dallo store. Per prima cosa spostiamo la nostra versione presentazionale esistente nel file `src/components/PureTaskList.vue` (rinominando il componente in `PureTaskList`) e avvolgiamola con un contenitore.

In `src/components/PureTaskList.vue`:

```html:title=src/components/PureTaskList.vue
<template>
  <div class="list-items">
    <template v-if="loading">
      <div v-for="n in 6" :key="n" class="loading-item">
        <span class="glow-checkbox" />
        <span class="glow-text">
          <span>Loading</span> <span>cool</span> <span>state</span>
        </span>
      </div>
    </template>

    <div v-else-if="isEmpty" class="list-items">
      <div class="wrapper-message">
        <span class="icon-check" />
        <p class="title-message">You have no tasks</p>
        <p class="subtitle-message">Sit back and relax</p>
      </div>
    </div>

    <template v-else>
      <Task
        v-for="task in tasksInOrder"
        :key="task.id"
        :task="task"
        @archive-task="onArchiveTask"
        @pin-task="onPinTask"
      />
    </template>
  </div>
</template>
<script>
import Task from './Task.vue';
import { reactive, computed } from 'vue';

export default {
  name: 'PureTaskList',
  components: { Task },
  props: {
    tasks: { type: Array, required: true, default: () => [] },
    loading: { type: Boolean, default: false },
  },
  emits: ['archive-task', 'pin-task'],

  setup(props, { emit }) {
    props = reactive(props);
    return {
      isEmpty: computed(() => props.tasks.length === 0),
      tasksInOrder: computed(() => {
        return [
          ...props.tasks.filter((t) => t.state === 'TASK_PINNED'),
          ...props.tasks.filter((t) => t.state !== 'TASK_PINNED'),
        ];
      }),
      /**
       * Event handler for archiving tasks
       */
      onArchiveTask(taskId) {
        emit('archive-task', taskId);
      },
      /**
       * Event handler for pinning tasks
       */
      onPinTask(taskId) {
        emit('pin-task', taskId);
      },
    };
  },
};
</script>
```

In `src/components/TaskList.vue`:

```html:title=src/components/TaskList.vue
<template>
  <PureTaskList :tasks="tasks" @archive-task="archiveTask" @pin-task="pinTask" />
</template>

<script>
import PureTaskList from './PureTaskList.vue';

import { computed } from 'vue';

import { useTaskStore } from '../store';

export default {
  components: { PureTaskList },
  name: 'TaskList',
  setup() {
    //👇 Creates a store instance
    const store = useTaskStore();

    //👇 Retrieves the tasks from the store's state auxiliary getter function
    const tasks = computed(() => store.getFilteredTasks);

    //👇 Dispatches the actions back to the store
    const archiveTask = (task) => store.archiveTask(task);
    const pinTask = (task) => store.pinTask(task);

    return {
      tasks,
      archiveTask,
      pinTask,
    };
  },
};
</script>
```

La ragione per mantenere la versione presentazionale della `TaskList` separata è che è più facile da testare e isolare. Poiché non si basa sulla presenza di uno store, è molto più facile da affrontare da una prospettiva di test. Rinominiamo `src/components/TaskList.stories.js` in `src/components/PureTaskList.stories.js` e assicuriamoci che le nostre storie usino la versione presentazionale:

```diff:title=src/components/PureTaskList.stories.js
+ import PureTaskList from './PureTaskList.vue';

import * as TaskStories from './Task.stories';

export default {
+ component: PureTaskList,
+ title: 'PureTaskList',
  tags: ['autodocs'],
  decorators: [() => ({ template: '<div style="margin: 3em;"><story/></div>' })],
  argTypes: {
    onPinTask: {},
    onArchiveTask: {},
  },
};

export const Default = {
  args: {
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
  },
};

export const WithPinnedTasks = {
  args: {
    // Shaping the stories through args composition.
    // Inherited data coming from the Default story.
    tasks: [
      ...Default.args.tasks.slice(0, 5),
      { id: '6', title: 'Task 6 (pinned)', state: 'TASK_PINNED' },
    ],
  },
};

export const Loading = {
  args: {
    tasks: [],
    loading: true,
  },
};

export const Empty = {
  args: {
    // Shaping the stories through args composition.
    // Inherited data coming from the Loading story.
    ...Loading.args,
    loading: false,
  },
};
```

<video autoPlay muted playsInline loop>
  <source
    src="/intro-to-storybook/finished-puretasklist-states-7-0.mp4"
    type="video/mp4"
  />
</video>

<div class="aside">
💡 Non dimenticare di committare le tue modifiche con git!
</div>

Ora che abbiamo alcuni dati reali che popolano il nostro componente, ottenuti dallo store Pinia, potremmo collegarlo a `src/App.vue` e renderizzarlo lì. Non preoccuparti. Ce ne occuperemo nel prossimo capitolo.
