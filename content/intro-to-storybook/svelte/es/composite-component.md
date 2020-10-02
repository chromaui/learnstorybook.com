---
title: 'Ensamblar un componente compuesto'
tocTitle: 'Componente Compuesto'
description: 'Ensamblar un componente compuesto a partir de componentes simples'
---

En el último capítulo construimos nuestro primer componente; este capítulo extiende lo que aprendimos para construir TaskList, una lista de Tasks (o Tareas). Combinemos componentes en conjunto y veamos qué sucede cuando se añade más complejidad.

## Lista de Tareas

Taskbox enfatiza las tareas ancladas colocándolas por encima de las tareas predeterminadas. Esto produce dos variaciones de `TaskList` para las que necesita crear historias: ítems por defecto e ítems por defecto y anclados.

![default and pinned tasks](/intro-to-storybook/tasklist-states-1.png)

Dado que los datos de `Task` pueden enviarse asincrónicamente, **también** necesitamos un estado de cargando para renderizar en ausencia de alguna conexión. Además, también se requiere un estado vacío para cuando no hay tareas.

![empty and loading tasks](/intro-to-storybook/tasklist-states-2.png)

## Empezar la configuración

Un componente compuesto no es muy diferente de los componentes básicos que contiene. Crea un componente `TaskList` y un archivo de historia que lo acompañe: `src/components/TaskList.svelte` y `src/components/TaskList.stories.js`.

Comienza con una implementación aproximada de la `TaskList`. Necesitarás importar el componente `Task` del capítulo anterior y pasarle los atributos y acciones como entrada.

```html
<!--src/components/TaskList.svelte-->

<script>
  import Task from './Task.svelte';
  export let loading = false;
  export let tasks = [];

  // reactive declarations (computed prop in other frameworks)
  $: noTasks = tasks.length === 0;
  $: emptyTasks = tasks.length === 0 && !loading;
</script>
{#if loading}
  <div class="list-items">loading</div>
{/if}
{#if emptyTasks}
  <div class="list-items">empty</div>
{/if} 
{#each tasks as task}
  <Task {task} on:onPinTask on:onArchiveTask />
{/each}
```

A continuación, crea los estados de prueba de `Tasklist` en el archivo de historia.

```javascript
// src/components/TaskList.stories.js
import TaskList from "./TaskList.svelte";
import { taskData, actionsData } from "./Task.stories";
export default {
  title: "TaskList",
  excludeStories: /.*Data$/
};

export const defaultTasksData = [
  { ...taskData, id: "1", title: "Task 1" },
  { ...taskData, id: "2", title: "Task 2" },
  { ...taskData, id: "3", title: "Task 3" },
  { ...taskData, id: "4", title: "Task 4" },
  { ...taskData, id: "5", title: "Task 5" },
  { ...taskData, id: "6", title: "Task 6" }
];
export const withPinnedTasksData = [
  ...defaultTasksData.slice(0, 5),
  { id: "6", title: "Task 6 (pinned)", state: "TASK_PINNED" }
];

// default TaskList state
export const Default = () => ({
  Component: TaskList,
   props: {
    tasks: defaultTasksData
  },
  on: {
    ...actionsData
  }
});
// tasklist with pinned tasks
export const WithPinnedTasks = () => ({
  Component: TaskList,
  props: {
    tasks: withPinnedTasksData
  },
  on: {
    ...actionsData
  }
});
// tasklist in loading state
export const Loading = () => ({
  Component: TaskList,
  props: {
    loading: true
  },
});
// tasklist no tasks
export const Empty = () => ({
  Component: TaskList,
}); 
```

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

Para el caso del borde de carga, crearemos un nuevo componente que mostrará el marcado correcto.

Cree un nuevo archivo llamado `LoadingRow.svelte` y agregue el siguiente marcado:

```html
<!--src/components/LoadingRow.svelte-->
<div class="loading-item">
  <span class="glow-checkbox" />
  <span class="glow-text">
    <span>Loading</span>
    <span>cool</span>
    <span>state</span>
  </span>
</div>
```

Y actualice `TaskList.svelte` a lo siguiente:

```html
<!--src/components/TaskList.svelte-->

<script>
  import Task from './Task.svelte';
  import LoadingRow from './LoadingRow.svelte';
  export let loading = false;
  export let tasks = [];

  // reactive declaration (computed prop in other frameworks)
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
{#if tasks.length === 0 && !loading}
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

El marcado agregado da como resultado la siguiente UI:

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
// src/components/TaskList.test.js
import TaskList from './TaskList.svelte';
import { render } from '@testing-library/svelte';
import { withPinnedTasksData } from './TaskList.stories'
test('TaskList ', async () => {
  const { container } = await render(TaskList, {
    props: {
      tasks: withPinnedTasksData,
    },
  });
  expect(container.firstChild.children[0].classList.contains('TASK_PINNED')).toBe(true);
});
```

![TaskList test runner](/intro-to-storybook/tasklist-testrunner.png)

Nota que hemos sido capaces de reutilizar la lista de tareas `withPinnedTasksData` tanto en la prueba de la historia como en el test unitario; de esta manera podemos continuar aprovechando un recurso existente (los ejemplos que representan configuraciones interesantes de un componente) de más y más maneras.

Nota también que esta prueba es bastante frágil. Es posible que a medida que el proyecto madure y que la implementación exacta de `Task` cambie --quizás usando un nombre de clase diferente--la prueba falle y necesite ser actualizada. Esto no es necesariamente un problema, sino más bien una indicación de que hay que ser bastante cuidadoso usando pruebas unitarias para la UI. No son fáciles de mantener. En su lugar, confía en las pruebas visuales, de instantáneas y de regresión visual (mira el [capitulo sobre las pruebas](/svelte/es/test/)) siempre que te sea posible.
