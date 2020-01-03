---
title: 'Construir una pantalla'
tocTitle: 'Pantallas'
description: 'Construir una pantalla utilizando componentes'
commit: b62db62
---

Nos hemos concentrado en crear interfaces de usuario desde "abajo hacia arriba"; empezando con los componentes individuales y añadiendo complejidad gradualmente. Esto nos ha permitido desarrollar cada componente de forma aislada, determinar los datos que necesita y jugar con ellos en Storybook. ¡Todo sin necesidad de utilizar un servidor o, siquiera, construir una sola pantalla!

En este capítulo aumentaremos la sofisticación al combinar los componentes que hemos construido en una pantalla y desarrollar esa pantalla dentro de Storybook.

## Componentes "contenedores"

Como nuestra aplicación es muy simple, la pantalla que construiremos es bastante trivial, simplemente envolviendo el componente `TaskList` (que proporciona sus propios datos a través de Vuex) en alguna maqueta y sacando un campo `error` de el store (asumamos que pondremos ese campo si tenemos algún problema para conectarnos a nuestro servidor). Ahora crearemos `PureInboxScreen.vue` dentro de la carpeta `src/components/`:

```html
<template>
  <div>
    <div class="page lists-show" v-if="error">
      <div class="wrapper-message">
        <span class="icon-face-sad" />
        <div class="title-message">Oh no!</div>
        <div class="subtitle-message">Something went wrong</div>
      </div>
    </div>
    <div class="page lists-show" v-else>
      <nav>
        <h1 class="title-page">
          <span class="title-wrapper">Taskbox</span>
        </h1>
      </nav>
      <task-list />
    </div>
  </div>
</template>

<script>
  import TaskList from './TaskList.vue';

  export default {
    name: 'pure-inbox-screen',
    props: {
      error: {
        type: Boolean,
        default: false,
      },
    },
    components: {
      TaskList,
    },
  };
</script>
```

Luego, podemos crear un contenedor, que nuevamente toma los datos para `PureInboxScreen` en `src/components/InboxScreen.vue`:

```html
<template>
  <div>
    <pure-inbox-screen :error="error" />
  </div>
</template>

<script>
  import PureInboxScreen from './PureInboxScreen';
  import { mapState } from 'vuex';

  export default {
    name: 'inbox-screen',
    components: {
      PureInboxScreen,
    },
    computed: {
      ...mapState(['error']),
    },
  };
</script>
```

También cambiamos nuestro componente `App` para que incluya `InboxScreen` (en una aplicación real esto sería manejado por el enrutador pero podemos obviarlo):

```html
<template>
  <div id="app">
    <inbox-screen />
  </div>
</template>

<script>
  import store from './store';
  import InboxScreen from './components/InboxScreen.vue';
  export default {
    name: 'app',
    store,
    components: {
      InboxScreen,
    },
  };
</script>
<style>
  @import './index.css';
</style>
```

Sin embargo, al intentar mostrar nuestro componente "contenedor" dentro de Storybook las cosas se ponen interesantes.

Como vimos anteriormente, el componente `TaskList` es un **contenedor** que renderiza el componente de presentación `PureTaskList`. Por definición, los componentes contenedores no pueden renderizarse de manera aislada; esperan que se les pase algún contexto o servicio. Esto significa que para mostrar nuestro componente en Storybook, debemos mockearlo (es decir, proporcionar una versión ficticia) del contexto o servicio que requiere.

Al colocar la "Lista de tareas" `TaskList` en Storybook, pudimos esquivar este problema simplemente renderizando la `PureTaskList` y evadiendo el contenedor. Haremos algo similar y renderizaremos la `PureInboxScreen` en Storybook también.

Sin embargo, para la `PureInboxScreen` tenemos un problema porque aunque la `PureInboxScreen` en si misma es presentacional, su hijo, la `TaskList`, no lo es. En cierto sentido la `PureInboxScreen` ha sido contaminada por la "contenedorización". Entonces, cuando configuramos nuestras historias en `src/components/PureInboxScreen.stories.js`:

```javascript
import PureInboxScreen from './PureInboxScreen.vue';
export default {
  title: 'PureInboxScreen',
};

// inbox screen default state
export const Default = () => ({
  components: { PureInboxScreen },
  template: `<pure-inbox-screen/>`,
});

// inbox screen error state
export const error = () => ({
  components: { PureInboxScreen },
  template: `<pure-inbox-screen :error="true"/>`,
});
```

Vemos que aunque la historia de `error` funciona bien, tenemos un problema en la historia `default`, porque la `TaskList` no tiene una store de Vuex a la que conectarse. (También encontrarás problemas similares cuando intentes probar la `PureInboxScreen` con un test unitario).

![Broken inbox](/intro-to-storybook/broken-inboxscreen.png)

Una forma de evitar este problema es nunca renderizar componentes contenedores en ninguna parte de tu aplicación excepto en el nivel más alto y en su lugar pasar todos los datos requeridos bajo la jerarquía de componentes.

Sin embargo, los desarrolladores **necesitarán** inevitablemente renderizar los contenedores más abajo en la jerarquía de componentes. Si queremos renderizar la mayor parte o la totalidad de la aplicación en Storybook (¡lo hacemos!), necesitamos una solución a este problema.

<div class="aside">
Por otro lado, la transmisión de datos a nivel jerárquico es un enfoque legítimo, especialmente cuando utilizas <a href="http://graphql.org/">GraphQL</a>. Así es como hemos construido <a href="https://www.chromaticqa.com">Chromatic</a> junto a más de 800+ historias.
</div>

## Suministrando contexto con decoradores

La buena noticia es que es fácil suministrar una store de Vuex a la `PureInboxScreen` en una historia! Podemos crear una nueva store en nuestra historia y pasarla como contexto de la historia:

```javascript
import Vue from 'vue';
import Vuex from 'vuex';
import PureInboxScreen from './PureInboxScreen.vue';
import { action } from '@storybook/addon-actions';
import { defaultTasksData } from './PureTaskList.stories';
Vue.use(Vuex);
export const store = new Vuex.Store({
  state: {
    tasks: defaultTasksData,
  },
  actions: {
    pinTask(context, id) {
      action('pinTask')(id);
    },
    archiveTask(context, id) {
      action('archiveTask')(id);
    },
  },
});
export default {
  title: 'PureInboxScreen',
  excludeStories: /.*store$/,
};
export const Default = () => ({
  components: { PureInboxScreen },
  template: `<pure-inbox-screen/>`,
  store,
});
// tasklist with pinned tasks
export const error = () => ({
  components: { PureInboxScreen },
  template: `<pure-inbox-screen :error="true"/>`,
});
```

Existen enfoques similares para proporcionar un contexto simulado para otras bibliotecas de datos, tales como [Apollo](https://www.npmjs.com/package/apollo-storybook-decorator), [Relay](https://github.com/orta/react-storybooks-relay-container) y algunas otras.

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
