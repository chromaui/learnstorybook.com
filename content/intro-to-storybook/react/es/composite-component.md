---
title: 'Ensamblar un componente compuesto'
tocTitle: 'Componente Compuesto'
description: 'Ensamblar un componente compuesto a partir de componentes simples'
commit: '73d7821'
---

En el último capítulo construimos nuestro primer componente; este capítulo extiende lo que aprendimos para construir `TaskList`, una lista de `Tasks`. Combinemos componentes en conjunto y veamos qué sucede cuando se añade más complejidad.

## Lista de Tareas

Taskbox enfatiza las tareas ancladas colocándolas por encima de las tareas predeterminadas. Esto produce dos variaciones de `TaskList` para las que necesita crear historias: ítems predeterminados y anclados.

![default and pinned tasks](/intro-to-storybook/tasklist-states-1.png)

Dado que los datos de `Task` pueden enviarse asincrónicamente, **también** necesitamos un estado de carga para renderizar en ausencia de alguna conexión. Además, también se requiere un estado vacío para cuando no hay tareas.

![empty and loading tasks](/intro-to-storybook/tasklist-states-2.png)

## Empezar la configuración

Un componente compuesto no es muy diferente de los componentes básicos que contiene. Crea un componente `TaskList` y un archivo de historia que lo acompañe: `src/components/TaskList.js` y `src/components/TaskList.stories.js`.

Comienza con una implementación aproximada de la `TaskList`. Necesitarás importar el componente `Task` del capítulo anterior y pasarle los atributos y acciones como entrada.

```js:title=src/components/TaskList.js
import React from 'react';
import Task from './Task';
export default function TaskList({ loading, tasks, onPinTask, onArchiveTask }) {
  const events = {
    onPinTask,
    onArchiveTask,
  };
  if (loading) {
    return <div className="list-items">loading</div>;
  }
  if (tasks.length === 0) {
    return <div className="list-items">empty</div>;
  }
  return (
    <div className="list-items">
      {tasks.map(task => (
        <Task key={task.id} task={task} {...events} />
      ))}
    </div>
  );
}
```

A continuación, crea los estados de prueba de `Tasklist` en el archivo de historia.

```js:title=src/components/TaskList.stories.js
import React from 'react';
import TaskList from './TaskList';
import * as TaskStories from './Task.stories';
export default {
  component: TaskList,
  title: 'TaskList',
  decorators: [story => <div style={{ padding: '3rem' }}>{story()}</div>],
};
const Template = args => <TaskList {...args} />;
export const Default = Template.bind({});
Default.args = {
  // Dar forma a las historias a través de la composición de args.
  // Los datos se heredaron de la historia predeterminada en Task.stories.js.
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
  // Dar forma a las historias a través de la composición de args.
  // Datos heredados provenientes de la historia Default.
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
  // Dar forma a las historias a través de la composición de args.
  // Datos heredados provenientes de la historia Loading.
  ...Loading.args,
  loading: false,
};
```

<div class="aside">
💡 <a href="https://storybook.js.org/docs/react/writing-stories/decorators"><b>Decoradores</b></a> son una forma de proporcionar envoltorios arbitrarios a las historias. En este caso estamos usando un decorador para añadir algo de <code>padding</code> alrededor del componente renderizado. También se pueden utilizar para envolver historias en "proveedores", es decir, componentes de la librería que establecen el contexto de React.
</div>

Al importar `TaskStories`, pudimos [componer](https://storybook.js.org/docs/react/writing-stories/args#args-composition) los argumentos (o `args`) en nuestras historias con poco esfuerzo. De esa forma, se conservan los datos y las acciones (llamadas simuladas) que esperan ambos componentes.

Ahora hay que revisar Storybook para ver las nuevas historias de `TaskList`.

<video autoPlay muted playsInline loop>
  <source
    src="/intro-to-storybook/inprogress-tasklist-states-6-0.mp4"
    type="video/mp4"
  />
</video>

## Construir los estados

Nuestro componente sigue siendo muy rudimentario, pero ahora tenemos una idea de las historias en las que trabajaremos. Podrías estar pensando que el envoltorio de `.list-items` es demasiado simplista. Tienes razón, en la mayoría de los casos no crearíamos un nuevo componente sólo para añadir un envoltorio. Pero la **complejidad real** del componente `TaskList` se revela en los casos extremos `withPinnedTasks`, `loading`, y `empty`.

```js:title=src/components/TaskList.js
import React from 'react';
import Task from './Task';
export default function TaskList({ loading, tasks, onPinTask, onArchiveTask }) {
  const events = {
    onPinTask,
    onArchiveTask,
  };
  const LoadingRow = (
    <div className="loading-item">
      <span className="glow-checkbox" />
      <span className="glow-text">
        <span>Loading</span> <span>cool</span> <span>state</span>
      </span>
    </div>
  );
  if (loading) {
    return (
      <div className="list-items" data-testid="loading" key={"loading"}>
        {LoadingRow}
        {LoadingRow}
        {LoadingRow}
        {LoadingRow}
        {LoadingRow}
        {LoadingRow}
      </div>
    );
  }
  if (tasks.length === 0) {
    return (
      <div className="list-items" key={"empty"} data-testid="empty">
        <div className="wrapper-message">
          <span className="icon-check" />
          <p className="title-message">You have no tasks</p>
          <p className="subtitle-message">Sit back and relax</p>
        </div>
      </div>
    );
  }
  const tasksInOrder = [
    ...tasks.filter((t) => t.state === "TASK_PINNED"),
    ...tasks.filter((t) => t.state !== "TASK_PINNED"),
  ];
  return (
    <div className="list-items">
      {tasksInOrder.map((task) => (
        <Task key={task.id} task={task} {...events} />
      ))}
    </div>
  );
}
```

Este nuevo código da como resultado la siguiente interfaz de usuario:

<video autoPlay muted playsInline loop>
  <source
    src="/intro-to-storybook/finished-tasklist-states-6-0.mp4"
    type="video/mp4"
  />
</video>

Observa la posición del elemento anclado en la lista. Queremos que el elemento anclado se muestre en la parte superior de la lista para que sea prioritario para nuestros usuarios.

## Requisitos de data y props

A medida que el componente crece, también lo hacen los parámetros de entrada requeridos de `TaskList`. Define las props requeridas de `TaskList`. Debido a que `Task` es un componente hijo, asegúrate de proporcionar los datos en la forma correcta para renderizarlo. Para ahorrar tiempo y dolores de cabeza, reutiliza los `propTypes` que definimos en `Task` anteriormente.

```diff:title=src/components/TaskList.js
import React from 'react';
+ import PropTypes from 'prop-types';
import Task from './Task';
export default function TaskList({ loading, tasks, onPinTask, onArchiveTask }) {
  const events = {
    onPinTask,
    onArchiveTask,
  };
  const LoadingRow = (
    <div className="loading-item">
      <span className="glow-checkbox" />
      <span className="glow-text">
        <span>Loading</span> <span>cool</span> <span>state</span>
      </span>
    </div>
  );
  if (loading) {
    return (
      <div className="list-items" data-testid="loading" key={"loading"}>
        {LoadingRow}
        {LoadingRow}
        {LoadingRow}
        {LoadingRow}
        {LoadingRow}
        {LoadingRow}
      </div>
    );
  }
  if (tasks.length === 0) {
    return (
      <div className="list-items" key={"empty"} data-testid="empty">
        <div className="wrapper-message">
          <span className="icon-check" />
          <p className="title-message">You have no tasks</p>
          <p className="subtitle-message">Sit back and relax</p>
        </div>
      </div>
    );
  }
  const tasksInOrder = [
    ...tasks.filter((t) => t.state === "TASK_PINNED"),
    ...tasks.filter((t) => t.state !== "TASK_PINNED"),
  ];
  return (
    <div className="list-items">
      {tasksInOrder.map((task) => (
        <Task key={task.id} task={task} {...events} />
      ))}
    </div>
  );
}
+ TaskList.propTypes = {
+  /** Comprueba si está en estado de cargando */
+  loading: PropTypes.bool,
+  /** La lista de tareas */
+  tasks: PropTypes.arrayOf(Task.propTypes.task).isRequired,
+  /** Evento para cambiar la tarea a anclada */
+  onPinTask: PropTypes.func,
+  /** Evento para cambiar la tarea a archivada */
+  onArchiveTask: PropTypes.func,
+ };
+ TaskList.defaultProps = {
+  loading: false,
+ };
```

<div class="aside">
💡 No olvides hacer commit para guardar tus cambios con git!
</div>
