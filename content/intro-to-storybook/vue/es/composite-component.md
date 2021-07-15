---
title: 'Ensamblar un componente compuesto'
tocTitle: 'Componente Compuesto'
description: 'Ensamblar un componente compuesto a partir de componentes simples'
commit: 'ef6a2ed'
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

```html:title=src/components/TaskList.vue
<template>
  <div class="list-items">
    <template v-if="loading">
      loading
    </template>
    <template v-else-if="isEmpty">
      empty
    </template>
    <template v-else>
      <Task v-for="task in tasks" :key="task.id" :task="task" v-on="$listeners" />
    </template>
  </div>
</template>
<script>
  import Task from './Task';
  export default {
    name: 'TaskList',
    components: { Task },
    props: {
      tasks: { type: Array, required: true, default: () => [] },
      loading: { type: Boolean, default: false },
    },
    computed: {
      isEmpty() {
        return this.tasks.length === 0;
      },
    },
  };
</script>
```

A continuación, crea los estados de prueba de `Tasklist` en el archivo de historia.

```js:title=src/components/TaskList.stories.js
import TaskList from './TaskList';
import * as TaskStories from './Task.stories';
export default {
  component: TaskList,
  title: 'TaskList',
  decorators: [() => '<div style="padding: 3rem;"><story /></div>'],
};
const Template = (args, { argTypes }) => ({
  components: { TaskList },
  props: Object.keys(argTypes),
  // We are reusing our actions from task.stories.js
  methods: TaskStories.actionsData,
  template: '<TaskList v-bind="$props" @pin-task="onPinTask" @archive-task="onArchiveTask" />',
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

<div class="aside">
💡 Los <a href="https://storybook.js.org/docs/vue/writing-stories/decorators"><b>Decoradores</b></a> son una forma de proporcionar envoltorios arbitrarios a las historias. En este caso estamos usando un decorador en la exportación predeterminada para añadir estilo. También se pueden usar para agregar otro contexto a los componentes, como veremos más adelante.
</div>

Al importar `TaskStories`, pudimos [componer](https://storybook.js.org/docs/vue/writing-stories/args#args-composition) los argumentos (args para abreviar) en nuestras historias con un mínimo esfuerzo. De esa forma, se conservan los datos y las acciones (callbacks simulados) que esperan ambos componentes.

Ahora hay que revisar Storybook para ver las nuevas historias de `TaskList`.

<video autoPlay muted playsInline loop>
  <source
    src="/intro-to-storybook/inprogress-tasklist-states.mp4"
    type="video/mp4"
  />
</video>

## Construir los estados

Nuestro componente sigue siendo muy rudimentario, pero ahora tenemos una idea de las historias en las que trabajaremos. Podrías estar pensando que el envoltorio de `.list-items` es demasiado simplista. Tienes razón, en la mayoría de los casos no crearíamos un nuevo componente sólo para añadir un envoltorio. Pero la **complejidad real** del componente `TaskList` se revela en los casos extremos `WithPinnedTasks`, `loading`, y `empty`.

```diff:title=src/components/TaskList.vue
<template>
  <div class="list-items">
    <template v-if="loading">
+     <div v-for="n in 6" :key="n" class="loading-item">
+       <span class="glow-checkbox" />
+       <span class="glow-text"> <span>Loading</span> <span>cool</span> <span>state</span> </span>
+     </div>
    </template>
    <div v-else-if="isEmpty" class="list-items">
+     <div class="wrapper-message">
+       <span class="icon-check" />
+       <div class="title-message">You have no tasks</div>
+       <div class="subtitle-message">Sit back and relax</div>
+     </div>
    </div>
    <template v-else>
+     <Task v-for="task in tasksInOrder" :key="task.id" :task="task" v-on="$listeners" />
    </template>
  </div>
</template>
<script>
  import Task from './Task';
  export default {
    name: 'TaskList',
    components: { Task },
    props: {
      tasks: { type: Array, required: true, default: () => [] },
      loading: { type: Boolean, default: false },
    },
    computed: {
+     tasksInOrder() {
+       return [
+         ...this.tasks.filter(t => t.state === 'TASK_PINNED'),
+         ...this.tasks.filter(t => t.state !== 'TASK_PINNED'),
+       ];
+     },
      isEmpty() {
        return this.tasks.length === 0;
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

Por lo tanto, para evitar este problema, podemos usar Jest para hacer la historia en el DOM y ejecutar algún código de consulta del DOM para verificar las características salientes del resultado. Lo bueno del formato de la historia es que simplemente podemos importar la historia en nuestras pruebas y reproducirla allí.

Crea un archivo de prueba llamado `tests/unit/TaskList.spec.js`. Aquí vamos a construir nuestras pruebas que hacen afirmaciones acerca del resultado.

```js:title=tests/unit/TaskList.spec.js
import Vue from 'vue';
import TaskList from '../../src/components/TaskList.vue';

//👇 Our story imported here
import { WithPinnedTasks } from '../../src/components/TaskList.stories';
it('renders pinned tasks at the start of the list', () => {
  // render Tasklist
  const Constructor = Vue.extend(TaskList);
  const vm = new Constructor({
    //👇 Story's args used with our test
    propsData: WithPinnedTasks.args,
  }).$mount();
  const firstTaskPinned = vm.$el.querySelector('.list-item:nth-child(1).TASK_PINNED');
  // We expect the pinned task to be rendered first, not at the end
  expect(firstTaskPinned).not.toBe(null);
});
```

![TaskList test runner](/intro-to-storybook/tasklist-testrunner.png)

Nota que hemos sido capaces de reutilizar la lista de tareas `withPinnedTasksData` tanto en la prueba de la historia como en el test unitario; de esta manera podemos continuar aprovechando un recurso existente (los ejemplos que representan configuraciones interesantes de un componente) de más y más maneras.

Nota también que esta prueba es bastante frágil. Es posible que a medida que el proyecto madure y que la implementación exacta de `Task` cambie --quizás usando un nombre de clase diferente--la prueba falle y necesite ser actualizada. Esto no es necesariamente un problema, sino más bien una indicación de que hay que ser bastante cuidadoso usando pruebas unitarias para la UI. No son fáciles de mantener. En su lugar, confía en las pruebas visuales, de instantáneas y de regresión visual (mira el [capitulo sobre las pruebas](/intro-to-storybook/vue/es/test/)) siempre que te sea posible.

<div class="aside">
💡 ¡No olvides confirmar tus cambios con git!
</div>
