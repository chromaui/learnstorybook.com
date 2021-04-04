---
title: 'Introducir datos'
tocTitle: 'Datos'
description: 'Aprende como introducir datos a tus componentes UI'
commit: 'fa1c954'
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

```js:title=src/store.js
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

Luego se cambiará el componente `TaskList` para leer los datos del store. Pero primero, pasemos nuestra versión del componente existente al archivo `src/components/PureTaskList.vue` (renombrar el componente a `PureTaskList`) que luego se incluirá en un contenedor.

En `src/components/PureTaskList.vue`:

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

En `src/components/TaskList.vue`:

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

La razón para mantener separada la versión de la `TaskList` es porque es más fácil de probar y aislar. Como no depende de la presencia de un store, es mucho más fácil tratar desde una perspectiva de prueba. Cambiemos el nombre de `src/components/TaskList.stories.js` a`src/components/PureTaskList.stories.js`, con esto garantizamos que nuestras stories usen la versión actual:

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
    src="/intro-to-storybook/finished-tasklist-states.mp4"
    type="video/mp4"
  />
</video>

Del mismo modo, necesitamos usar `PureTaskList` en nuestra prueba de Jest:

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

<div class="aside">
💡 Con este cambio, sus instantáneas requerirán una actualización. Vuelva a ejecutar el comando de prueba con el indicador <code>-u</code> para actualizarlos. ¡Además, no olvides confirmar tus cambios con git!
</div>
