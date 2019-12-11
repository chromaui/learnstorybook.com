---
title: 'Construye un componente simple'
tocTitle: 'Componente Simple'
description: 'Construye un componente simple en aislamiento'
commit: b2274bd
---

Construiremos nuestra UI siguiendo la metodología (CDD) [Component-Driven Development](https://blog.hichroma.com/component-driven-development-ce1109d56c8e). Es un proceso que construye UIs de “abajo hacia arriba”, empezando con los componentes y terminando con las vistas. CDD te ayudará a escalar la cantidad de complejidad con la que te enfrentas a medida que construyes la UI.

## Task - Tarea

![Task component in three states](/intro-to-storybook/task-states-learnstorybook.png)

`Task` (o Tarea) es el componente principal en nuestra app. Cada tarea se muestra de forma ligeramente diferente según el estado en el que se encuentre. Mostramos un checkbox marcado (o no marcado), información sobre la tarea y un botón “pin” que nos permite mover la tarea hacia arriba o abajo en la lista de tareas. Poniendo esto en conjunto, necesitaremos estas propiedades -props- :

- `title` – un string que describe la tarea
- `state` - ¿en qué lista se encuentra la tarea actualmente y está marcado el checkbox?

A medida que comencemos a construir `Task`, primero escribiremos nuestras pruebas para los estados que corresponden a los distintos tipos de tareas descritas anteriormente. Luego, utilizamos Storybook para construir el componente de forma aislada usando datos de prueba. Vamos a “testear visualmente” la apariencia del componente a medida que cambiemos cada estado.

Este proceso es similar a [Test-driven development](https://en.wikipedia.org/wiki/Test-driven_development) (TDD) al que podemos llamar “[Visual TDD](https://blog.hichroma.com/visual-test-driven-development-aec1c98bed87)”.

## Ajustes iniciales

Primero, vamos a crear el componente Task y el archivo de historias de storybook que lo acompaña: `src/components/Task.js` y `src/components/Task.stories.js`.

Comenzaremos con una implementación básica de `Task`, simplemente teniendo en cuenta los atributos que sabemos que necesitaremos y las dos acciones que puedes realizar con una tarea (para moverla entre las listas):

```html
<template>
  <div class="list-item">
    <input type="text" :readonly="true" :value="this.task.title" />
  </div>
</template>

<script>
  export default {
    name: 'task',
    props: {
      task: {
        type: Object,
        required: true,
      },
    },
  };
</script>
```

Arriba, renderizamos directamente `Task` basándonos en la estructura HTML existente de la app Todos.

A continuación creamos los tres estados de prueba de Task dentro del archivo de historia:

```javascript
import { storiesOf } from '@storybook/vue';
import { action } from '@storybook/addon-actions';

import Task from './Task';

export const task = {
  id: '1',
  title: 'Test Task',
  state: 'TASK_INBOX',
  updatedAt: new Date(2018, 0, 1, 9, 0),
};

export const methods = {
  onPinTask: action('onPinTask'),
  onArchiveTask: action('onArchiveTask'),
};

storiesOf('Task', module)
  .add('default', () => {
    return {
      components: { Task },
      template: `<task :task="task" @archiveTask="onArchiveTask" @pinTask="onPinTask"/>`,
      data: () => ({ task }),
      methods,
    };
  })
  .add('pinned', () => {
    return {
      components: { Task },
      template: `<task :task="task" @archiveTask="onArchiveTask" @pinTask="onPinTask"/>`,
      data: () => ({ task: { ...task, state: 'TASK_PINNED' } }),
      methods,
    };
  })
  .add('archived', () => {
    return {
      components: { Task },
      template: `<task :task="task" @archiveTask="onArchiveTask" @pinTask="onPinTask"/>`,
      data: () => ({ task: { ...task, state: 'TASK_ARCHIVED' } }),
      methods,
    };
  });
```

Existen dos niveles básicos de organización en Storybook. El componente y sus historias hijas. Piensa en cada historia como una permutación posible del componente. Puedes tener tantas historias por componente como se necesite.

- **Componente**
  - Historia
  - Historia
  - Historia

Para iniciar Storybook, primero invocamos a la función `storiesOf()` para registrar el componente. Agregamos un nombre para mostrar el componente, que se muestra en la barra lateral de la aplicación Storybook.

`action()` nos permite crear un callback que aparecerá en el panel **actions** de la UI de Storybook cuando es cliqueado. Entonces, cuando construyamos un botón pin, podremos determinar en la UI de prueba si un click en el botón es exitoso o no.

Como necesitamos pasar el mismo conjunto de acciones a todas las permutaciones de nuestro componente, es conveniente agruparlas en una sola variable de `methods` y usarlas para pasarlas a la definición de nuestra historia cada vez (donde se accede a través de la propiedad `methods`).

Otra cosa positiva acerca de agrupar las `methods` que un componente necesita, es que puedes usar `export` y utilizarlas en historias para otros componentes que reutilicen este componente, como veremos luego.

Para definir nuestras historias, llamamos a `add()` una vez para cada uno de nuestros estados del test para generar una historia. La historia de acción es una función que devuelve un conjunto de propiedades que definen la historia, en este caso un string de `template` para la historia junto con `components`, `data` y`methods` que consume la plantilla.

Al crear una historia utilizamos una historia base (`task`) para construir la forma de la task que el componente espera. Esto generalmente se modela a partir del aspecto de los datos verdaderos. Nuevamente, `export`-ando esta función nos permitirá reutilizarla en historias posteriores, como veremos.

<div class="aside">
Las <a href="https://storybook.jsF .org/addons/introduction/#2-native-addons"><b>Acciones</b></a> ayudan a verificar las interacciones cuando creamos componentes UI en aislamiento. A menudo no tendrás acceso a las funciones y el estado que tienes en el contexto de la aplicación. Utiliza <code>action()</code> para agregarlas.
</div>

## Configuración

También necesitamos hacer un pequeño cambio en la configuración de Storybook (`.storybook/config.js`) para que tenga en cuenta nuestros archivos `.stories.js` y use nuestro archivo CSS. Por defecto, Storybook busca historias en el directorio `/stories`; este tutorial usa un esquema de nombres que es similar al esquema de nombres `.spec.js` preferido por CRA para pruebas -tests- automatizadas.

```javascript
import { configure } from '@storybook/vue';

import '../src/index.css';

const req = require.context('../src', true, /\.stories.js$/);
function loadStories() {
  req.keys().forEach(filename => req(filename));
}

configure(loadStories, module);
```

Una vez que hayamos hecho esto, reiniciando el servidor de Storybook debería producir casos de prueba para los tres estados de Task:

<video autoPlay muted playsInline controls >
  <source
    src="/intro-to-storybook//inprogress-task-states.mp4"
    type="video/mp4"
  />
</video>

## Construyendo los estados

Ahora tenemos configurado Storybook, los estilos importados y los casos de prueba construidos; podemos comenzar rápidamente el trabajo de implementar el HTML del componente para que coincida con el diseño.

El componente todavía es básico. Primero escribiremos el código que se aproxima al diseño sin entrar en demasiados detalles:

```html
<template>
  <div :class="taskClass">
    <label class="checkbox">
      <input type="checkbox" :checked="isChecked" :disabled="true" name="checked" />
      <span class="checkbox-custom" @click="$emit('archiveTask', task.id)" />
    </label>
    <div class="title">
      <input type="text" :readonly="true" :value="this.task.title" placeholder="Input title" />
    </div>
    <div class="actions">
      <a @click="$emit('pinTask', task.id)" v-if="!isChecked">
        <span class="icon-star" />
      </a>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'task',
    props: {
      task: {
        type: Object,
        required: true,
      },
    },
    computed: {
      taskClass() {
        return `list-item ${this.task.state}`;
      },
      isChecked() {
        return this.task.state === 'TASK_ARCHIVED';
      },
    },
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
Asegúrese de que sus componentes muestren datos que no cambien, para que sus pruebas de instantáneas no fallen cada vez. Tenga cuidado con cosas como fechas o valores generados aleatoriamente.
</div>

Con [Storyshots addon](https://github.com/storybooks/storybook/tree/master/addons/storyshots) se crea una prueba de instantánea para cada una de las historias. Usalo agregando una dependencia en modo desarrollo:

```bash
yarn add --dev @storybook/addon-storyshots jest-vue-preprocessor babel-plugin-require-context-hook
```

Luego crea un archivo `tests/unit/storybook.spec.js` con el siguiente contenido:

```javascript
import registerRequireContextHook from 'babel-plugin-require-context-hook/register';
import initStoryshots from '@storybook/addon-storyshots';

registerRequireContextHook();
initStoryshots();
```

Necesitamos agregar una línea a nuestro `jest.config.js`:

```js
  transformIgnorePatterns: ["/node_modules/(?!(@storybook/.*\\.vue$))"],
```

Finalmente, necesitamos hacer un ajuste a nuestro `babel.config.js`:

```js
module.exports = api => ({
  presets: ['@vue/app'],
  ...(api.env('test') && { plugins: ['require-context-hook'] }),
});
```

Una vez hecho lo anterior, podemos ejecutar `yarn test:unit` y veremos el siguiente resultado:

![Task test runner](/intro-to-storybook/task-testrunner.png)

Ahora tenemos una prueba de instantánea para cada una de las historias de `Task`. Si cambiamos la implementación de `Task`, se nos pedirá que verifiquemos los cambios.
