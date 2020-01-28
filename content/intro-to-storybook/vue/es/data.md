---
title: 'Introducir datos'
tocTitle: 'Datos'
description: 'Aprende como introducir datos a tus componentes UI'
commit: 28bc240
---

Hasta ahora hemos creado componentes aislados sin estado, muy útiles para Storybook, pero finalmente no son útiles hasta que les proporcionemos algunos datos en nuestra aplicación.

Este tutorial no se centra en los detalles de la construcción de una aplicación, por lo que no profundizaremos en esos detalles aquí. Pero, nos tomaremos un momento para observar un patrón común para introducir datos con componentes contenedores.

## Componentes contenedores

Nuestro componente `TaskList` como lo hemos escrito es de “presentación” (ver [artículo al respecto](https://medium.com/@dan_abramov/smart-and-dumb-components-7ca2f9a7c7d0)), en el sentido que no se comunica con nada externo a su implementación. Para poder pasarle datos, necesitaremos un "contenedor".

Este ejemplo utiliza [Vuex](https://vuex.vuejs.org), la librería mas popular de Vue para almacenar datos, que básicamente nos permite crear un modelo simple de datos para la aplicación. De todos modos, el patrón que utilizaremos también se aplica a otras librerías de manejo de datos como [Apollo](https://www.apollographql.com/client/) y [MobX](https://mobx.js.org/).

Primero, instala vuex con:

```bash
yarn add vuex
```

En un archivo llamado `src/store.js`, se implementará un store Vuex estándar que responda a acciones que cambiarán el estado de las tareas:

```javascript

// src/store.js
import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
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

Para poder conectar nuestra aplicación al store recién creado y proporcionar datos a la jerarquía de componentes con bastante facilidad, el componente superior (`src/App.vue`) se cambiará a:

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

Luego se cambiará el componente `TaskList` para leer los datos del store. Pero primero, pasemos nuestra versión del componente existente al archivo `src/components/PureTaskList.vue` (renombrar el componente a `pure-task-list`) que luego se incluirá en un contenedor.

En `src/components/PureTaskList.vue`:

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

En `src/components/TaskList.vue`:

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

La razón para mantener separada la versión de la `TaskList` es porque es más fácil de probar y aislar. Como no depende de la presencia de un store, es mucho más fácil tratar desde una perspectiva de prueba. Cambiemos el nombre de `src/components/TaskList.stories.js` a`src/components/PureTaskList.stories.js`, con esto garantizamos que nuestras stories usen la versión actual:

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
      default: () => withPinnedTasksData
    },
  },
  methods: actionsData,
});
// tasklist with pinned tasks
export const WithPinnedTasks = () => ({
  components: { PureTaskList },
  template: `<pure-task-list :tasks="tasks" @archiveTask="onArchiveTask" @pinTask="onPinTask"/>`,
  props: {
    tasks: {
      default: () => withPinnedTasksData
    },
  },
  methods: actionsData,
});
// tasklist in loading state
export const Loading = () => ({
  components: { PureTaskList },
  template: `<pure-task-list loading @archiveTask="onArchiveTask" @pinTask="onPinTask"/>`,
  methods: actionsData,
});
// tasklist no tasks
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

Del mismo modo, necesitamos usar `PureTaskList` en nuestra prueba de Jest:

```js

//tests/unit/TaskList.spec.js
import Vue from 'vue';
import PureTaskList from '../../src/components/PureTaskList.vue';
import { withPinnedTasksData } from '../../src/components/PureTaskList.stories';

it('renders pinned tasks at the start of the list', () => {
  const Constructor = Vue.extend(PureTaskList);
  const vm = new Constructor({
    propsData: { tasks: withPinnedTasksData },
  }).$mount();
  const lastTaskInput = vm.$el.querySelector('.list-item:nth-child(1).TASK_PINNED');

  //Esperamos que la tarea anclada se represente primero, no al final
  expect(lastTaskInput).not.toBe(null);
});
```

<div class="aside">Si sus pruebas de instantáneas fallan en esta etapa, debe actualizar las instantáneas existentes ejecutando el script de prueba con el indicador -u. O cree un nuevo script para abordar este problema.</div>
