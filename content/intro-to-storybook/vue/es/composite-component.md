---
title: 'Ensamblar un componente compuesto'
tocTitle: 'Componente Compuesto'
description: 'Ensamblar un componente compuesto a partir de componentes simples'
commit: '98335e5'
---

En el último capítulo construimos nuestro primer componente; este capítulo extiende lo que aprendimos para construir TaskList, una lista de Tasks (o Tareas). Combinemos componentes en conjunto y veamos qué sucede cuando se añade más complejidad.

## Lista de Tareas

Taskbox enfatiza las tareas ancladas colocándolas por encima de las tareas predeterminadas. Esto produce dos variaciones de `TaskList` para las que necesita crear historias: ítems por defecto e ítems por defecto y anclados.

![default and pinned tasks](/intro-to-storybook/tasklist-states-1.png)

Dado que los datos de `Task` pueden enviarse asincrónicamente, **también** necesitamos un estado de cargando para renderizar en ausencia de alguna conexión. Además, también se requiere un estado vacío para cuando no hay tareas.

![empty and loading tasks](/intro-to-storybook/tasklist-states-2.png)

## Empezar la configuración

Un componente compuesto no es muy diferente de los componentes básicos que contiene. Crea un componente `TaskList` y un archivo de historia que lo acompañe: `src/components/TaskList.vue` y `src/components/TaskList.stories.js`.

Comienza con una implementación aproximada de la `TaskList`. Necesitarás importar el componente `Task` del capítulo anterior y pasarle los atributos y acciones como entrada.

```html
<!--src/components/TaskList.vue-->
<template>
  <div>
    <div class="list-items" v-if="loading">loading</div>
    <div class="list-items" v-if="noTasks && !this.loading">empty</div>
    <div class="list-items" v-if="showTasks">
      <task
        v-for="(task, index) in tasks"
        :key="index"
        :task="task"
        @archiveTask="$emit('archiveTask', $event)"
        @pinTask="$emit('pinTask', $event)"
      />
    </div>
  </div>
</template>

<script>
  import Task from './Task';
  export default {
    name: 'task-list',
    props: {
      loading: {
        type: Boolean,
        default: false,
      },
      tasks: {
        type: Array,
        default: () => [],
      },
    },
    components: {
      Task,
    },
    computed: {
      noTasks() {
        return this.tasks.length === 0;
      },
      showTasks() {
        return !this.loading && !this.noTasks;
      },
    },
  };
</script>
```

A continuación, crea los estados de prueba de `Tasklist` en el archivo de historia.

```javascript
//src/components/TaskList.stories.js
import TaskList from './TaskList';
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

// default TaskList state
export const Default = () => ({
  components: { TaskList },
  template: `<task-list :tasks="tasks" @archiveTask="onArchiveTask" @pinTask="onPinTask"/>`,
  props: {
    tasks: {
      default: () => defaultTasksData,
    },
  },
  methods: actionsData,
});
// tasklist with pinned tasks
export const WithPinnedTasks = () => ({
  components: { TaskList },
  template: `<task-list :tasks="tasks" @archiveTask="onArchiveTask" @pinTask="onPinTask"/>`,
  props: {
    tasks: {
      default: () => withPinnedTasksData,
    },
  },
  methods: actionsData,
});
// tasklist in loading state
export const Loading = () => ({
  components: { TaskList },
  template: `<task-list loading @archiveTask="onArchiveTask" @pinTask="onPinTask"/>`,
  methods: actionsData,
});
// tasklist no tasks
export const Empty = () => ({
  components: { TaskList },
  template: `<task-list @archiveTask="onArchiveTask" @pinTask="onPinTask"/>`,
  methods: actionsData,
});
```

<div class="aside">
    Los <a href="https://storybook.js.org/docs/vue/writing-stories/decorators"><b>Decoradores</b></a> son una forma de proporcionar envoltorios arbitrarios a las historias. En este caso estamos usando un decorador en la exportacion predeterminada para añadir estilo. También se pueden usar para agregar otro contexto a los componentes, como veremos más adelante.
</div>

`taskData` provee la forma de un `Task` que creamos y exportamos desde el archivo `Task.stories.js`. De manera similar, `actionsData` define las acciones (llamadas simuladas) que espera un componente `Task`, el cual también necesita la `TaskList`.

Ahora hay que revisar Storybook para ver las nuevas historias de `TaskList`.

<video autoPlay muted playsInline loop>
  <source
    src="/intro-to-storybook/inprogress-tasklist-states.mp4"
    type="video/mp4"
  />
</video>

## Construir los estados

Nuestro componente sigue siendo muy rudimentario, pero ahora tenemos una idea de las historias en las que trabajaremos. Podrías estar pensando que el envoltorio de `.list-items` es demasiado simplista. Tienes razón, en la mayoría de los casos no crearíamos un nuevo componente sólo para añadir un envoltorio. Pero la **complejidad real** del componente `TaskList` se revela en los casos extremos `WithPinnedTasks`, `loading`, y `empty`.

```html
<!--src/components/TaskList.vue-->
<template>
  <div>
    <div v-if="loading">
      <div class="loading-item" v-for="(n, index) in 5" :key="index">
        <span class="glow-checkbox" />
        <span class="glow-text"> <span>Loading</span> <span>cool</span> <span>state</span> </span>
      </div>
    </div>
    <div class="list-items" v-if="noTasks && !this.loading">
      <div class="wrapper-message">
        <span class="icon-check" />
        <div class="title-message">You have no tasks</div>
        <div class="subtitle-message">Sit back and relax</div>
      </div>
    </div>
    <div class="list-items" v-if="showTasks">
      <task
        v-for="(task, index) in tasksInOrder"
        :key="index"
        :task="task"
        @archiveTask="$emit('archiveTask', $event)"
        @pinTask="$emit('pinTask', $event)"
      />
    </div>
  </div>
</template>

<script>
  import Task from './Task';
  export default {
    name: 'task-list',
    props: {
      loading: {
        type: Boolean,
        default: false,
      },
      tasks: {
        type: Array,
        default: () => [],
      },
    },
    components: {
      Task,
    },
    computed: {
      noTasks() {
        return this.tasks.length === 0;
      },
      showTasks() {
        return !this.loading && !this.noTasks;
      },
      tasksInOrder() {
        return [
          ...this.tasks.filter(t => t.state === 'TASK_PINNED'),
          ...this.tasks.filter(t => t.state !== 'TASK_PINNED'),
        ];
      },
    },
  };
</script>
```

El etiquetado añadido da como resultado la siguiente interfaz de usuario:

<video autoPlay muted playsInline loop>
  <source
    src="/intro-to-storybook/finished-tasklist-states.mp4"
    type="video/mp4"
  />
</video>

Observa la posición del elemento anclado en la lista. Queremos que el elemento anclado se muestre en la parte superior de la lista para que sea prioritario para nuestros usuarios.

## Pruebas automatizadas

En el capítulo anterior aprendimos a capturar historias de prueba utilizando Storyshots. Con el componente `Task` no había mucha complejidad para probar más allá de que se renderice correctamente. Dado que `TaskList` añade otra capa de complejidad, queremos verificar que ciertas entradas produzcan ciertas salidas de una manera adecuada con pruebas automáticas. Para hacer esto crearemos test unitarios utilizando [Jest](https://facebook.github.io/jest/) junto con un renderizador de prueba.

![Jest logo](/intro-to-storybook/logo-jest.png)

### Test unitarios con Jest

Las historias de Storybook combinadas con pruebas visuales manuales y pruebas de instantáneas (ver arriba) ayudan mucho a evitar errores de interfaz de usuario. Si las historias cubren una amplia variedad de casos de uso de los componentes, y utilizamos herramientas que aseguran que un humano compruebe cualquier cambio en la historia, los errores son mucho menos probables.

Sin embargo, a veces el diablo está en los detalles. Se necesita un framework de pruebas que sea explícito sobre esos detalles. Lo que nos lleva a hacer pruebas unitarias.

En nuestro caso, queremos que nuestra `TaskList` muestre cualquier tarea anclada **antes de** las tareas no ancladas que sean pasadas en la prop `tasks`. Aunque tenemos una historia (`WithPinnedTasks`) para probar este escenario exacto; puede ser ambiguo para un revisor humano que si el componente **no** ordena las tareas de esta manera, es un error. Ciertamente no gritará **"¡Mal!"** para el ojo casual.

Por lo tanto, para evitar este problema, podemos usar Jest para renderizar la historia en el DOM y ejecutar algún código de consulta del DOM para verificar las características salientes del resultado.

Crea un archivo de prueba llamado `src/components/TaskList.test.js`. Aquí vamos a construir nuestras pruebas que hacen afirmaciones acerca del resultado.

```javascript
//tests/unit/TaskList.spec.js

import Vue from 'vue';
import TaskList from '../../src/components/TaskList.vue';
import { withPinnedTasksData } from '../../src/components/TaskList.stories';

it('renders pinned tasks at the start of the list', () => {
  const Constructor = Vue.extend(TaskList);
  const vm = new Constructor({
    propsData: { tasks: withPinnedTasksData },
  }).$mount();
  const firstTaskPinned = vm.$el.querySelector('.list-item:nth-child(1).TASK_PINNED');

  // We expect the pinned task to be rendered first, not at the end
  expect(firstTaskPinned).not.toBe(null);
});
```

![TaskList test runner](/intro-to-storybook/tasklist-testrunner.png)

Nota que hemos sido capaces de reutilizar la lista de tareas `withPinnedTasksData` tanto en la prueba de la historia como en el test unitario; de esta manera podemos continuar aprovechando un recurso existente (los ejemplos que representan configuraciones interesantes de un componente) de más y más maneras.

Nota también que esta prueba es bastante frágil. Es posible que a medida que el proyecto madure y que la implementación exacta de `Task` cambie --quizás usando un nombre de clase diferente--la prueba falle y necesite ser actualizada. Esto no es necesariamente un problema, sino más bien una indicación de que hay que ser bastante cuidadoso usando pruebas unitarias para la UI. No son fáciles de mantener. En su lugar, confía en las pruebas visuales, de instantáneas y de regresión visual (mira el [capitulo sobre las pruebas](/intro-to-storybook/vue/es/test/)) siempre que te sea posible.
