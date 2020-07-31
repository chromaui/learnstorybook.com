---
title: 'Introducir datos'
tocTitle: 'Datos'
description: 'Aprende como introducir datos a tus componentes UI'
---

Hasta ahora hemos creado componentes aislados sin estado, muy útiles para Storybook, pero finalmente no son útiles hasta que les proporcionemos algunos datos en nuestra aplicación.

Este tutorial no se centra en los detalles de la construcción de una aplicación, por lo que no profundizaremos en esos detalles aquí. Pero, nos tomaremos un momento para observar un patrón común para introducir datos con componentes contenedores.

## Componentes contenedores

Nuestro componente `TaskList` como lo hemos escrito es de “presentación” (ver [artículo al respecto](https://medium.com/@dan_abramov/smart-and-dumb-components-7ca2f9a7c7d0)), en el sentido que no se comunica con nada externo a su implementación. Para poder pasarle datos, necesitaremos un "contenedor".

Este ejemplo utiliza [Svelte Stores](https://svelte.dev/docs#svelte_store), API de administración de datos predeterminada de Svelte para crear un modelo simple de datos para la aplicación. De todos modos, el patrón que utilizaremos también se aplica a otras librerías de manejo de datos como [Apollo](https://www.apollographql.com/client/) y [MobX](https://mobx.js.org/).

Primero construiremos un store Svelte estandar que responda a acciones que cambien el estado de las tareas, en un archivo llamado `src/store.js` (intencionalmente simple):

```javascript
// src/store.js

// A simple Svelte store implementation with update methods and initial data.
// A true app would be more complex and separated into different files.

import { writable } from 'svelte/store';

const TaskBox = () => {
  // creates a new writable store populated with some initial data
  const { subscribe, update } = writable([
    { id: '1', title: 'Something', state: 'TASK_INBOX' },
    { id: '2', title: 'Something more', state: 'TASK_INBOX' },
    { id: '3', title: 'Something else', state: 'TASK_INBOX' },
    { id: '4', title: 'Something again', state: 'TASK_INBOX' },
  ]);

  return {
    subscribe,
    // method to archive a task, think of a action with redux or Vuex
    archiveTask: id =>
      update(tasks =>
        tasks.map(task => (task.id === id ? { ...task, state: 'TASK_ARCHIVED' } : task))
      ),
    // method to archive a task, think of a action with redux or Vuex
    pinTask: id =>
      update(tasks =>
        tasks.map(task => (task.id === id ? { ...task, state: 'TASK_PINNED' } : task))
      ),
  };
};
export const taskStore = TaskBox();
//
```

Luego se cambiará el componente `TaskList` para leer los datos del store. Pero primero, pasemos nuestra versión del componente existente al archivo `src/components/PureTaskList.svelte`, y envolverlo con un contenedor.

En `src/components/PureTaskList.svelte`:

```html
<!--This file moved from TaskList.svelte-->
<script>
  import Task from './Task.svelte';
  import LoadingRow from './LoadingRow.svelte';
  export let loading = false;
  export let tasks = [];
  $: noTasks = tasks.length === 0;
  $: emptyTasks = tasks.length === 0 && !loading;
  $: tasksInOrder = [
    ...tasks.filter(t => t.state === 'TASK_PINNED'),
    ...tasks.filter(t => t.state !== 'TASK_PINNED'),
  ];
</script>

{#if loading}
<div class="list-items">
  <LoadingRow />
  <LoadingRow />
  <LoadingRow />
  <LoadingRow />
  <LoadingRow />
</div>
{/if} 
{#if noTasks && !loading}
<div class="list-items">
  <div class="wrapper-message">
    <span class="icon-check" />
    <div class="title-message">You have no tasks</div>
    <div class="subtitle-message">Sit back and relax</div>
  </div>
</div>
{/if} 
{#each tasksInOrder as task}
<Task {task} on:onPinTask on:onArchiveTask />
{/each}
```

En `src/components/TaskList.svelte`:

```html
<script>
  import PureTaskList from './PureTaskList.svelte';
  import { taskStore } from '../store';
  function onPinTask(event) {
    taskStore.pinTask(event.detail.id);
  }
  function onArchiveTask(event) {
    taskStore.archiveTask(event.detail.id);
  }
</script>

<div>
  <PureTaskList
    tasks={$taskStore}
    on:onPinTask={onPinTask}
    on:onArchiveTask={onArchiveTask}
  />
</div>
```

La razón para mantener separada la versión de la `TaskList` es porque es más fácil de probar y aislar. Como no depende de la presencia de un store, es mucho más fácil tratar desde una perspectiva de prueba. Cambiemos el nombre de `src/components/TaskList.stories.js` a`src/components/PureTaskList.stories.js`, con esto garantizamos que nuestras stories usen la versión actual:

```javascript
import PureTaskList from './PureTaskList.svelte';
import { taskData, actionsData } from './Task.stories';
export default {
  title: 'PureTaskList',
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
// default TaskList state
export const Default = () => ({
  Component: PureTaskList,
  props: {
    tasks: defaultTasksData,
  },
  on: {
    ...actionsData,
  },
});

export const WithPinnedTasks = () => ({
  Component: PureTaskList,
  props: {
    tasks: withPinnedTasksData,
  },
  on: {
    ...actionsData,
  },
});
export const Loading = () => ({
  Component: PureTaskList,
  props: {
    loading: true,
  },
});
export const Empty = () => ({
  Component: PureTaskList,
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
import PureTaskList from './PureTaskList.svelte';
import { render } from '@testing-library/svelte';
import { withPinnedTasksData } from './PureTaskList.stories'

test('TaskList', async () => {
  const { container } = await render(PureTaskList, {
    props: {
      tasks: withPinnedTasksData
    },
  });
  expect(container.firstChild.children[0].classList.contains('TASK_PINNED')).toBe(true);
});
```

<div class="aside">Si sus pruebas de instantáneas fallan en esta etapa, debe actualizar las instantáneas existentes ejecutando el script de prueba con el indicador -u. O cree un nuevo script para abordar este problema.</div>
