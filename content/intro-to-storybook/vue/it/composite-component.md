---
title: 'Assembla un componente composito'
tocTitle: 'Componente composito'
description: 'Assembla un componente composito da componenti più semplici'
commit: '3221bbb'
---

Nell'ultimo capitolo, abbiamo costruito il nostro primo componente; questo capitolo estende ciò che abbiamo imparato per realizzare TaskList, una lista di Task. Uniamoli insieme e vediamo cosa succede quando introduciamo più complessità.

## Tasklist

Taskbox enfatizza i task in evidenza posizionandoli sopra i task predefiniti. Ciò produce due variazioni di `TaskList` per cui devi creare storie, elementi predefiniti e in evidenza.

![task predefiniti e in evidenza](/intro-to-storybook/tasklist-states-1.png)

Poiché i dati di `Task` possono essere inviati in modo asincrono, abbiamo **anche** bisogno di uno stato di caricamento da renderizzare in assenza di una connessione. Inoltre, abbiamo bisogno di uno stato vuoto per quando non ci sono task.

![task vuoti e in caricamento](/intro-to-storybook/tasklist-states-2.png)

## Prepariamoci

Un componente composito non è molto diverso dai componenti di base che contiene. Crea un componente `TaskList` e un file di storia associato: `src/components/TaskList.vue` e `src/components/TaskList.stories.js`.

Inizia con un'implementazione approssimativa di `TaskList`. Dovrai importare il componente `Task` di prima e passare gli attributi e le azioni come input.

```html:title=src/components/TaskList.vue
<template>
  <div class="list-items">
    <template v-if="loading"> loading </template>
    <template v-else-if="isEmpty"> empty </template>
    <template v-else>
      <Task
        v-for="task in tasks"
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
  name: 'TaskList',
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

Successivamente, crea gli stati di test di `TaskList` nel file di storia.

```js:title=src/components/TaskList.stories.js
import TaskList from './TaskList.vue';

import * as TaskStories from './Task.stories';

export default {
  component: TaskList,
  title: 'TaskList',
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

<div class="aside">
💡I <a href="https://storybook.js.org/docs/vue/writing-stories/decorators"><b>Decorator</b></a> sono un modo per fornire wrapper arbitrari alle storie. In questo caso, stiamo usando una chiave decorator sull'export predefinito per aggiungere un po' di <code>margine</code> intorno al componente renderizzato. Ma possono anche essere usati per aggiungere altri contesti ai componenti, come vedremo più avanti.
</div>

Importando `TaskStories`, siamo stati in grado di [comporre](https://storybook.js.org/docs/vue/writing-stories/args#args-composition) gli argomenti (args in breve) nelle nostre storie con minimo sforzo. In questo modo, i dati e le azioni (callback simulate) attesi da entrambi i componenti sono conservati.

Ora controlla Storybook per le nuove storie di `TaskList`.

<video autoPlay muted playsInline loop>
  <source
    src="/intro-to-storybook/inprogress-tasklist-states-7-0.mp4"
    type="video/mp4"
  />
</video>

## Sviluppa gli stati

Il nostro componente è ancora grezzo, ma ora abbiamo un'idea delle storie a cui puntare. Potresti pensare che il wrapper `.list-items` sia eccessivamente semplicistico. Hai ragione: nella maggior parte dei casi, non creeremmo un nuovo componente solo per aggiungere un wrapper. Ma la **complessità reale** del componente `TaskList` è rivelata nei casi limite `withPinnedTasks`, `loading` e `empty`.

```diff:title=src/components/TaskList.vue
<template>
  <div class="list-items">
    <template v-if="loading">
+     <div v-for="n in 6" :key="n" class="loading-item">
+       <span class="glow-checkbox" />
+       <span class="glow-text">
+         <span>Loading</span> <span>cool</span> <span>state</span>
+       </span>
+     </div>
    </template>

    <div v-else-if="isEmpty" class="list-items">
+     <div class="wrapper-message">
+       <span class="icon-check" />
+       <p class="title-message">You have no tasks</p>
+       <p class="subtitle-message">Sit back and relax</p>
+     </div>
    </div>

    <template v-else>
+     <Task
+       v-for="task in tasksInOrder"
+       :key="task.id"
+       :task="task"
+       @archive-task="onArchiveTask"
+       @pin-task="onPinTask"
+     />
   </template>
  </div>
</template>

<script>
import Task from './Task.vue';
import { reactive, computed } from 'vue';

export default {
  name: 'TaskList',
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
+     tasksInOrder:computed(()=>{
+       return [
+         ...props.tasks.filter(t => t.state === 'TASK_PINNED'),
+         ...props.tasks.filter(t => t.state !== 'TASK_PINNED'),
+       ]
+     }),
      /**
       * Event handler for archiving tasks
       */
      onArchiveTask(taskId) {
        emit('archive-task',taskId);
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

Il markup aggiunto produce la seguente UI:

<video autoPlay muted playsInline loop>
  <source
    src="/intro-to-storybook/finished-tasklist-states-7-0.mp4"
    type="video/mp4"
  />
</video>

Nota la posizione dell'elemento bloccato nella lista. Vogliamo che l'elemento bloccato venga renderizzato in cima alla lista per renderlo una priorità per i nostri utenti.

<div class="aside">
💡 Non dimenticare di committare le tue modifiche con git!
</div>
