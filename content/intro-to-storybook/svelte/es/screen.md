---
title: 'Construir una pantalla'
tocTitle: 'Pantallas'
description: 'Construir una pantalla utilizando componentes'
---

Nos hemos concentrado en crear interfaces de usuario desde "abajo hacia arriba"; empezando con los componentes individuales y añadiendo complejidad gradualmente. Esto nos ha permitido desarrollar cada componente de forma aislada, determinar los datos que necesita y jugar con ellos en Storybook. ¡Todo sin necesidad de utilizar un servidor o, siquiera, construir una sola pantalla!

En este capítulo aumentaremos la sofisticación al combinar los componentes que hemos construido en una pantalla y desarrollar esa pantalla dentro de Storybook.

## Componentes "contenedores"

Como nuestra aplicación es muy simple, la pantalla que construiremos es bastante trivial, simplemente envolviendo el componente `TaskList` (que proporciona sus propios datos a través de Svelte Store) en alguna maqueta y sacando un campo `error` de el store (asumamos que pondremos ese campo si tenemos algún problema para conectarnos a nuestro servidor). Ahora crearemos `InboxScreen.svelte` dentro de la carpeta `components`:

```svelte
<!-- src/components/InboxScreen.svelte -->

<script>
  import TaskList from './TaskList.svelte';
  export let error = false;
</script>

<div>
  {#if error}
  <div class="page lists-show">
    <div class="wrapper-message">
      <span class="icon-face-sad" />
      <div class="title-message">Oh no!</div>
      <div class="subtitle-message">Something went wrong</div>
    </div>
  </div>
  {:else}
  <div class="page lists-show">
    <nav>
      <h1 class="title-page">
        <span class="title-wrapper">Taskbox</span>
      </h1>
    </nav>
    <TaskList />
  </div>
  {/if}
</div>
```

Necesitamos actualizar nuestro store (en `src/store.js`) para incluir nuestro nuevo campo `error`, transformándolo en:

```javascript
// src/store.js

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

// store to handle the app state
const appState = () => {
  const { subscribe, update } = writable(false);
  return {
    subscribe,
    error: () => update(error => !error),
  };
};

export const AppStore = appState();
```

También cambiamos nuestro componente `App` para que incluya `InboxScreen` (en una aplicación real esto sería manejado por el enrutador pero podemos obviarlo):

```svelte
<!-- src/App.svelte -->

<script>
  import { AppStore } from './store';
  import InboxScreen from './components/InboxScreen.svelte';
</script>

<InboxScreen error={$AppStore} />
```

<div class="aside">No olvide que también necesita actualizar el componente TaskList para reflejar los cambios realizados en el store.</div>

Sin embargo, al intentar mostrar nuestro componente "contenedor" dentro de Storybook las cosas se ponen interesantes.

Como vimos anteriormente, el componente `TaskList` es un **contenedor** que renderiza el componente de presentación `PureTaskList`. Por definición, los componentes contenedores no pueden renderizarse de manera aislada; esperan que se les pase algún contexto o servicio.

Al colocar la "Lista de tareas" `TaskList` en Storybook, pudimos esquivar este problema simplemente renderizando la `PureTaskList` y evadiendo el contenedor. Haremos algo similar y renderizaremos la `PureInboxScreen` en Storybook también.

Entonces, cuando configuramos nuestras historias en `InboxScreen.stories.js`:

```javascript
// src/components/InboxScreen.stories.js

import InboxScreen from './InboxScreen.svelte';

export default {
  title: 'PureInboxScreen',
  Component: InboxScreen,
};
export const standard = () => ({
  Component: InboxScreen,
});

export const error = () => ({
  Component: InboxScreen,
  props: {
    error: true,
  },
});
```

Vemos que aunque la historia de `error` y `standard` funciona bien. (También encontrarás problemas similares cuando intentes probar la `PureInboxScreen` con un test unitario si no se proporcionan datos como lo hicimos con`TaskList`).

<div class="aside">
Por otro lado, la transmisión de datos a nivel jerárquico es un enfoque legítimo, especialmente cuando utilizas <a href="http://graphql.org/">GraphQL</a>. Así es como hemos construido <a href="https://www.chromatic.com">Chromatic</a> junto a más de 800+ historias.
</div>

Recorrer los estados en Storybook hace que sea fácil comprobar que lo hemos hecho correctamente:

<video autoPlay muted playsInline loop >

  <source
    src="/intro-to-storybook/finished-inboxscreen-states.mp4"
    type="video/mp4"
  />
</video>

## Desarrollo basado en componentes

Empezamos desde abajo con `Task`, luego progresamos a `TaskList`, ahora estamos aquí con una interfaz de usuario de pantalla completa. Nuestra `InboxScreen` contiene un componente de contenedor anidado e incluye historias de acompañamiento.

<video autoPlay muted playsInline loop style="width:480px; height:auto; margin: 0 auto;">
  <source
    src="/intro-to-storybook/component-driven-development-optimized.mp4"
    type="video/mp4"
  />
</video>

[**El desarrollo basado en componentes**](https://blog.hichroma.com/component-driven-development-ce1109d56c8e) te permite expandir gradualmente la complejidad a medida que asciendes en la jerarquía de componentes. Entre los beneficios están un proceso de desarrollo más enfocado y una mayor cobertura de todas las posibles mutaciones de la interfaz de usuario. En resumen, la CDD te ayuda a construir interfaces de usuario de mayor calidad y complejidad.

Aún no hemos terminado, el trabajo no termina cuando se construye la interfaz de usuario. También tenemos que asegurarnos de que siga siendo duradero a lo largo del tiempo.
