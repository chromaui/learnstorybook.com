---
title: 'Construye un componente simples'
tocTitle: 'Componente Simples'
description: 'Construye un componente simple en aislamiento'
---

Construiremos nuestra UI siguiendo la metodología (CDD) [Component-Driven Development](https://www.componentdriven.org/). Es un proceso que construye UIs de “abajo hacia arriba”, empezando con los componentes y terminando con las vistas. CDD te ayudará a escalar la cantidad de complejidad con la que te enfrentas a medida que construyes la UI.

## Task - Tarea

![Task component in three states](/intro-to-storybook/task-states-learnstorybook.png)

`Task` (o Tarea) es el componente principal en nuestra app. Cada tarea se muestra de forma ligeramente diferente según el estado en el que se encuentre. Mostramos un checkbox marcado (o no marcado), información sobre la tarea y un botón “pin” que nos permite mover la tarea hacia arriba o abajo en la lista de tareas. Poniendo esto en conjunto, necesitaremos estas propiedades -props- :

- `title` – un string que describe la tarea
- `state` - ¿en qué lista se encuentra la tarea actualmente y está marcado el checkbox?

A medida que comencemos a construir `Task`, primero escribiremos nuestras pruebas para los estados que corresponden a los distintos tipos de tareas descritas anteriormente. Luego, utilizamos Storybook para construir el componente de forma aislada usando datos de prueba. Vamos a “testear visualmente” la apariencia del componente a medida que cambiemos cada estado.

Este proceso es similar a [Test-driven development](https://en.wikipedia.org/wiki/Test-driven_development) (TDD) al que podemos llamar “[Visual TDD](https://blog.hichroma.com/visual-test-driven-development-aec1c98bed87)”.

## Ajustes iniciales

Primero, vamos a crear el componente Task y el archivo de historias de Storybook que lo acompaña: `src/components/Task.svelte` y `src/components/Task.stories.js`.

Comenzaremos con una implementación básica de `Task`, simplemente teniendo en cuenta los atributos que sabemos que necesitaremos y las dos acciones que puedes realizar con una tarea (para moverla entre las listas):

```html
<!--src/components/Task.svelte-->
<script>
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();

  // event handler for Pin Task
  function PinTask() {
    dispatch('onPinTask', {
      id: task.id,
    });
  }

  // event handler for Archive Task
  function ArchiveTask() {
    dispatch('onArchiveTask', {
      id: task.id,
    });
  }

  // Task props
  export let task = {
    id: '',
    title: '',
    state: '',
    updated_at: new Date(2019, 0, 1, 9, 0),
  };
</script>

<div class="list-item">
  <input type="text" value="{task.title}" readonly />
</div>
```

Arriba, renderizamos directamente `Task` basándonos en la estructura HTML existente de la app Todos.

A continuación creamos los tres estados de prueba de Task dentro del archivo de historia:

```javascript
// src/components/Task.stories.js
import Task from './Task.svelte';
import { action } from '@storybook/addon-actions';
export default {
  title: 'Task',
  excludeStories: /.*Data$/,
};

export const actionsData = {
  onPinTask: action('onPinTask'),
  onArchiveTask: action('onArchiveTask'),
};

export const taskData = {
  id: '1',
  title: 'Test Task',
  state: 'Task_INBOX',
  updated_at: new Date(2019, 0, 1, 9, 0),
};

// default task state
export const Default = () => ({
  Component: Task,
  props: {
    task: taskData,
  },
  on: {
    ...actionsData,
  },
});
// pinned task state
export const Pinned = () => ({
  Component: Task,
  props: {
    task: {
      ...taskData,
      state: 'TASK_PINNED',
    },
  },
  on: {
    ...actionsData,
  },
});
// archived task state
export const Archived = () => ({
  Component: Task,
  props: {
    task: {
      ...taskData,
      state: 'TASK_ARCHIVED',
    },
  },
  on: {
    ...actionsData,
  },
});
```

Existen dos niveles básicos de organización en Storybook. El componente y sus historias hijas. Piensa en cada historia como una permutación posible del componente. Puedes tener tantas historias por componente como se necesite.

- **Component**
  - Story
  - Story
  - Story

Para decirle a Storybook sobre el componente que estamos documentando, creamos un `default export` que contiene:

- `component` -- el componente en sí mismo,
- `title` -- cómo referirse al componente en la barra lateral de la aplicación Storybook,
- `excludeStories` -- información requerida por la historia, pero no debe ser presentada por la aplicación Storybook.

Para definir nuestras historias, exportamos una función para cada uno de nuestros estados de prueba para generar una historia. La historia es una función que devuelve un elemento renderizado (es decir, un componente con un conjunto de props) en un estado dado.

`action()` nos permite crear un callback que aparecerá en el panel **actions** de la UI de Storybook cuando es cliqueado. Entonces, cuando construyamos un botón pin, podremos determinar en la UI de prueba si un click en el botón es exitoso o no.

Como necesitamos pasar el mismo conjunto de acciones a todas las permutaciones de nuestro componente, es conveniente agruparlas en una sola variable de `actionsData` y usarlas para pasarlas a la definición de nuestra historia cada vez (donde se accederá cuando se invoque la función `dispatch`).

Otra cosa interesante acerca de agrupar las `actionsData` que un componente necesita, es que puedes usar `export` y utilizarlas en historias para otros componentes que reutilicen este componente, como veremos luego.

Al crear una historia utilizamos una historia base (`taskData`) para construir la forma de la task que el componente espera. Esto generalmente se modela a partir del aspecto de los datos verdaderos. Nuevamente, `export`-ando esta función nos permitirá reutilizarla en historias posteriores, como veremos.

<div class="aside">
Las <a href="https://storybook.js.org/addons/introduction/#2-native-addons"><b>Acciones</b></a> ayudan a verificar las interacciones cuando creamos componentes UI en aislamiento. A menudo no tendrás acceso a las funciones y el estado que tienes en el contexto de la aplicación. Utiliza <code>action()</code> para agregarlas.
</div>

## Configuración

Es necesario realizar algunos cambios en la configuración del Storybook, para que sepa no solo dónde buscar las historias que acabamos de crear, sino también usar el CSS que se agregó en el [capítulo anterior](/svelte/es/get-started).

Comencemos cambiando el archivo de configuración de Storybook (`.storybook/main.js`) a lo siguiente:

```javascript
// .storybook/main.js
module.exports = {
  stories: ['../src/components/**/*.stories.js'],
  addons: ['@storybook/addon-actions', '@storybook/addon-links'],
};
```

Después de hacer este cambio, una vez más dentro de la carpeta `.storybook`, cree un nuevo archivo llamado `preview.js` con el siguiente contenido:

```javascript
// .storybook/preview.js
import '../public/global.css';
```

Una vez que hayamos hecho esto, reiniciando el servidor de Storybook debería producir casos de prueba para los tres estados de Task:

<video autoPlay muted playsInline loop>
  <source
    src="/intro-to-storybook//inprogress-task-states.mp4"
    type="video/mp4"
  />
</video>

## Construyendo los estados

Ahora tenemos configurado Storybook, los estilos importados y los casos de prueba construidos; podemos comenzar rápidamente el trabajo de implementar el HTML del componente para que coincida con el diseño.

Nuestro componente todavía es bastante rudimentario en este momento. Vamos a hacer algunos cambios para que coincida con el diseño previsto sin entrar en demasiados detalles:

```html
<!--src/components/Task.svelte-->

<script>
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();

  // event handler for Pin Task
  function PinTask() {
    dispatch('onPinTask', {
      id: task.id,
    });
  }
  // event handler for Archive Task
  function ArchiveTask() {
    dispatch('onArchiveTask', {
      id: task.id,
    });
  }

  // Task props
  export let task = {
    id: '',
    title: '',
    state: '',
    updated_at: new Date(2019, 0, 1, 9, 0),
  };

  // reactive declaration (computed prop in other frameworks)
  $: isChecked = task.state === 'TASK_ARCHIVED';
</script>
<div class="{`list-item" ${task.state}`}>
  <label class="checkbox">
    <input type="checkbox" checked="{isChecked}" disabled name="checked" />
    <span class="checkbox-custom" on:click="{ArchiveTask}" />
  </label>
  <div class="title">
    <input type="text" readonly value="{task.title}" placeholder="Input title" />
  </div>
  <div class="actions">
    {#if task.state !== 'TASK_ARCHIVED'}
    <a href="/" on:click|preventDefault="{PinTask}">
      <span class="icon-star" />
    </a>
    {/if}
  </div>
</div>
```

El maquetado adicional de arriba, combinado con el CSS que hemos importado antes, produce la siguiente UI:

<video autoPlay muted playsInline loop>
  <source
    src="/intro-to-storybook/finished-task-states.mp4"
    type="video/mp4"
  />
</video>

## Componente construido!

Ahora hemos construido con éxito un componente sin necesidad de un servidor o sin ejecutar toda la aplicación frontend. El siguiente paso es construir los componentes restantes de la Taskbox, uno por uno de manera similar.

Como puedes ver, comenzar a construir componentes de forma aislada es fácil y rápido. Podemos esperar producir una UI de mayor calidad con menos errores y más pulida porque es posible profundizar y probar todos los estados posibles.

## Pruebas automatizadas

Storybook nos dio una excelente manera de probar visualmente nuestra aplicación durante su construcción. Las 'historias' ayudarán a asegurar que no rompamos nuestra Task visualmente, a medida que continuamos desarrollando la aplicación. Sin embargo, en esta etapa, es un proceso completamente manual y alguien tiene que hacer el esfuerzo de hacer clic en cada estado de prueba y asegurarse de que se visualice bien y sin errores ni advertencias. ¿No podemos hacer eso automáticamente?

### Pruebas de instantáneas

La prueba de instantáneas se refiere a la práctica de registrar la salida "correcta" de un componente para una entrada dada y luego en el futuro marcar el componente siempre que la salida cambie. Esto complementa a Storybook, porque es una manera rápida de ver la nueva versión de un componente y verificar los cambios.

<div class="aside">
Asegúrese de que sus componentes muestren datos que no cambien, para que sus pruebas de instantáneas no fallen cada vez. Tenga cuidado con cosas como fechas o valores generados aleatoriamente.
</div>

Con el [complemento Storyshots](https://github.com/storybooks/storybook/tree/master/addons/storyshots) se crea una prueba de instantánea para cada una de las historias. Úselo agregando la siguiente dependencia en modo desarrollo:

```bash
npm install -D @storybook/addon-storyshots
```

Luego crea un archivo `src/storybook.test.js` con el siguiente contenido:

```javascript
// src/storybook.test.js
import initStoryshots from '@storybook/addon-storyshots';

initStoryshots();
```

Finalmente, necesitamos hacer un pequeño ajuste a nuestro campo `jest` en `package.json`:

```json
{
  .....
  "jest":{
    "transform": {
      "^.+\\.js$": "babel-jest",
      "^.+\\.stories\\.[jt]sx?$": "<rootDir>node_modules/@storybook/addon-storyshots/injectFileName",
      "^.+\\.svelte$": "jest-transform-svelte"
    },
    "setupFilesAfterEnv": [
      "@testing-library/jest-dom/extend-expect"
    ],
  }
}
```

Una vez hecho lo anterior, podemos ejecutar `npm run test` y veremos el siguiente resultado:

![Task test runner](/intro-to-storybook/task-testrunner.png)

Ahora tenemos una prueba de instantánea para cada una de las historias de `Task`. Si cambiamos la implementación de `Task`, se nos pedirá que verifiquemos los cambios.
