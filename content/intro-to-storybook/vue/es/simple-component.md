---
title: 'Construye un componente simples'
tocTitle: 'Componente Simples'
description: 'Construye un componente simple en aislamiento'
commit: 'c350cdf'
---

Construiremos nuestra UI siguiendo la metodología (CDD) [Component-Driven Development](https://www.componentdriven.org/). Es un proceso que construye UIs de “abajo hacia arriba”, empezando con los componentes y terminando con las vistas. CDD te ayudará a escalar la cantidad de complejidad con la que te enfrentas a medida que construyes la UI.

## Task - Tarea

![Task component in three states](/intro-to-storybook/task-states-learnstorybook.png)

`Task` (o Tarea) es el componente principal en nuestra app. Cada tarea se muestra de forma ligeramente diferente según el estado en el que se encuentre. Mostramos un checkbox marcado (o no marcado), información sobre la tarea y un botón “pin” que nos permite mover la tarea hacia arriba o abajo en la lista de tareas. Poniendo esto en conjunto, necesitaremos estas propiedades -props- :

- `title` – un string que describe la tarea
- `state` - ¿en qué lista se encuentra la tarea actualmente y está marcado el checkbox?

A medida que comencemos a construir `Task`, primero escribiremos nuestras pruebas para los estados que corresponden a los distintos tipos de tareas descritas anteriormente. Luego, utilizamos Storybook para construir el componente de forma aislada usando datos de prueba. Vamos a “testear visualmente” la apariencia del componente a medida que cambiemos cada estado.

Este proceso es similar a [Test-driven development](https://en.wikipedia.org/wiki/Test-driven_development) (TDD) al que podemos llamar “[Visual TDD](https://www.chromatic.com/blog/visual-test-driven-development)”.

## Ajustes iniciales

Primero, vamos a crear el componente Task y el archivo de historias de Storybook que lo acompaña: `src/components/Task.js` y `src/components/Task.stories.js`.

Comenzaremos con una implementación básica de `Task`, simplemente teniendo en cuenta los atributos que sabemos que necesitaremos:

```html:title=src/components/Task.vue
<template>
  <div class="list-item">
    <input type="text" readonly :value="task.title" />
  </div>
</template>
<script>
  export default {
    name: 'Task',
    props: {
      task: {
        type: Object,
        required: true,
        default: () => ({ id: '', state: '', title: '' }),
        validator: task => ['id', 'state', 'title'].every(key => key in task),
      },
    },
  };
</script>
```

Arriba, renderizamos directamente `Task` basándonos en la estructura HTML existente de la app Todos.

A continuación creamos los tres estados de prueba de Task dentro del archivo de historia:

```js:title=src/components/Task.stories.js
import Task from './Task';
import { action } from '@storybook/addon-actions';
export default {
  title: 'Task',
  component: Task,
  // Our exports that end in "Data" are not stories.
  excludeStories: /.*Data$/,
};
export const actionsData = {
  onPinTask: action('pin-task'),
  onArchiveTask: action('archive-task'),
};
const Template = (args, { argTypes }) => ({
  components: { Task },
  props: Object.keys(argTypes),
  methods: actionsData,
  template: '<Task v-bind="$props" @pin-task="onPinTask" @archive-task="onArchiveTask" />',
});
export const Default = Template.bind({});
Default.args = {
  task: {
    id: '1',
    title: 'Test Task',
    state: 'TASK_INBOX',
    updatedAt: new Date(2018, 0, 1, 9, 0),
  },
};
export const Pinned = Template.bind({});
Pinned.args = {
  task: {
    ...Default.args.task,
    state: 'TASK_PINNED',
  },
};
export const Archived = Template.bind({});
Archived.args = {
  task: {
    ...Default.args.task,
    state: 'TASK_ARCHIVED',
  },
};
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

Para definir nuestras historias, exportamos una función para cada uno de nuestros estados de prueba para generar una historia. La historia es una función que devuelve un elemento renderizado (es decir, un componente con un conjunto de props) en un estado dado, exactamente como un [Componente funcional sin estado](https://vuejs.org/v2/guide/render-function.html#Functional-Components).

Como tenemos múltiples permutaciones de nuestro componente, es conveniente asignarlo a una variable `Template`. La introducción de este patrón en sus historias reducirá la cantidad de código que necesita escribir y mantener.

<div class="aside">
💡 <code>Template.bind({})</code> es una <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/bind">técnica estándar de JavaScript</a> para hacer una copia de una función. Usamos esta técnica para permitir que cada historia exportada establezca sus propias propiedades, pero usamos la misma implementación.
</div>

Los argumentos o [`args`](https://storybook.js.org/docs/vue/writing-stories/args) para abreviar, nos permiten editar en vivo nuestros componentes con el complemento de controles sin reiniciar Storybook. Una vez que un valor de [`args`](https://storybook.js.org/docs/vue/writing-stories/args) cambia, también cambia el componente.

Al crear una historia usamos un argumento de `task` base para construir la forma de la tarea que espera el componente. Esto generalmente se modela a partir de cómo se ven los datos reales. De nuevo, exportar esta forma nos permitirá reutilizarla en historias posteriores, como veremos.

`action()` nos permite crear un callback que aparecerá en el panel **actions** de la UI de Storybook cuando es cliqueado. Entonces, cuando construyamos un botón pin, podremos determinar en la UI de prueba si un click en el botón es exitoso o no.

Como necesitamos pasar el mismo conjunto de acciones a todas las permutaciones de nuestro componente, es conveniente agruparlas en una sola variable de `actionsData` y usarlas para pasarlas a la definición de nuestra historia cada vez (donde se accede a través de la propiedad `methods`).

Otra cosa interesante acerca de agrupar las `actionsData` que un componente necesita, es que puedes usar `export` y utilizarlas en historias para otros componentes que reutilicen este componente, como veremos luego.

<div class="aside">
💡 Las <a href="https://storybook.js.org/docs/vue/essentials/actions"><b>Acciones</b></a> ayudan a verificar las interacciones cuando creamos componentes UI en aislamiento. A menudo no tendrás acceso a las funciones y el estado que tienes en el contexto de la aplicación. Utiliza <code>action()</code> para agregarlas.
</div>

## Configuración

Es necesario realizar algunos cambios en los archivos de configuración de Storybook para que no solo note nuestras historias creadas recientemente y nos permita usar el archivo CSS de la aplicación (ubicado en `src/index.css`).

Comencemos cambiando el archivo de configuración de Storybook (`.storybook/main.js`) a lo siguiente:

```diff:title=.storybook/main.js
module.exports = {
+ stories: ['../src/components/**/*.stories.js'],
  addons: ['@storybook/addon-links', '@storybook/addon-essentials'],
};
```

Después de hacer este cambio, una vez más dentro de la carpeta `.storybook`, cambie el archivo `preview.js` con el siguiente contenido:

```diff:title=.storybook/preview.js
+ import '../src/index.css';
//👇 Configures Storybook to log the actions( onArchiveTask and onPinTask ) in the UI.
export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
};
```

[`parametros`](https://storybook.js.org/docs/vue/writing-stories/parameters) se utilizan normalmente para controlar el comportamiento de las funciones y complementos de Storybook. En nuestro caso, los usaremos para configurar cómo se manejan las `acciones` (callbacks simulados).

`accciones` nos permite crear devoluciones de llamada que aparecen en el panel de **acciones** de la interfaz de usuario de Storybook cuando se hace clic en él. Por lo tanto, cuando creamos un botón de marcador, podremos determinar en la IU de prueba si el clic de un botón es exitoso.

Una vez que hayamos hecho esto, reiniciando el servidor de Storybook debería producir casos de prueba para los tres estados de Task:

<video autoPlay muted playsInline controls >
  <source
    src="/intro-to-storybook//inprogress-task-states.mp4"
    type="video/mp4"
  />
</video>

## Construyendo los estados

Ahora tenemos configurado Storybook, los estilos importados y los casos de prueba construidos; podemos comenzar rápidamente el trabajo de implementar el HTML del componente para que coincida con el diseño.

Nuestro componente todavía es bastante rudimentario en este momento. Vamos a hacer algunos cambios para que coincida con el diseño previsto sin entrar en demasiados detalles:

```diff:title=src/components/Task.vue
<template>
+ <div class="list-item" :class="task.state">
+  <label class="checkbox">
+    <input type="checkbox" :checked="isChecked" disabled name="checked" />
+    <span class="checkbox-custom" @click="$emit('archive-task', task.id)" />
+  </label>
+  <div class="title">
+    <input type="text" :value="task.title" readonly placeholder="Input title" />
+  </div>
+  <div class="actions">
+   <a v-if="!isChecked" @click="$emit('pin-task', task.id)">
+    <span class="icon-star" />
+   </a>
+  </div>
+ </div>
</template>
<script>
  export default {
    name: 'Task',
    props: {
      task: {
        type: Object,
        required: true,
        default: () => ({ id: '', state: '', title: '' }),
        validator: task => ['id', 'state', 'title'].every(key => key in task),
      },
    },
+   computed: {
+     isChecked() {
+       return this.task.state === 'TASK_ARCHIVED';
+     },
+   },
  };
</script>
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
💡 Asegúrese de que sus componentes muestren datos que no cambien, para que sus pruebas de instantáneas no fallen cada vez. Tenga cuidado con cosas como fechas o valores generados aleatoriamente.
</div>

Con el [complemento Storyshots](https://github.com/storybooks/storybook/tree/master/addons/storyshots) se crea una prueba de instantánea para cada una de las historias. Úselo agregando las siguientes dependencias en modo desarrollo:

```shell
yarn add -D @storybook/addon-storyshots jest-vue-preprocessor
```

Luego crea un archivo `tests/unit/storybook.spec.js` con el siguiente contenido:

```js:title=tests/unit/storybook.spec.js
import initStoryshots from '@storybook/addon-storyshots';
initStoryshots();
```

Finalmente, necesitamos agregar una línea a nuestro `jest.config.js`:

```diff:title=jest.config.js
module.exports = {
  ...
+ transformIgnorePatterns: ["/node_modules/(?!(@storybook/.*\\.vue$))"],
};
```

Una vez hecho lo anterior, podemos ejecutar `yarn test:unit` y veremos el siguiente resultado:

![Task test runner](/intro-to-storybook/task-testrunner.png)

Ahora tenemos una prueba de instantánea para cada una de las historias de `Task`. Si cambiamos la implementación de `Task`, se nos pedirá que verifiquemos los cambios.

<div class="aside">
💡 ¡No olvides confirmar tus cambios con git!
</div>
