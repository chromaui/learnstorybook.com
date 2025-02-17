---
title: 'Ensamblar un componente compuesto'
tocTitle: 'Componente Compuesto'
description: 'Ensamblar un componente compuesto a partir de componentes simples'
commit: 'cfa25b6'
---

En el capítulo anterior, construimos nuestro primer componente; en este capítulo, ampliamos lo que aprendimos para construir TaskList, una lista de Tasks. Vamos a combinar componentes y ver qué sucede cuando introducimos más complejidad.

## Lista de Tareas (TaskList)

Taskbox enfatiza las tareas ancladas colocándolas por encima de las tareas predeterminadas. Esto produce dos variaciones de `TaskList` para las que necesitas crear historias: ítems predeterminados y anclados.

![default and pinned tasks](/intro-to-storybook/tasklist-states-1.png)

Dado que los datos de `Task` pueden enviarse asincrónicamente, **también** necesitamos un estado de carga para renderizar en ausencia de alguna conexión. Además, también se requiere un estado vacío para cuando no hay tareas.

![empty and loading tasks](/intro-to-storybook/tasklist-states-2.png)

## Empezar la configuración

Un componente compuesto no es muy diferente de los componentes básicos que contiene. Crea un componente `TaskList` y un archivo de historia que lo acompañe: `src/components/TaskList.jsx` y `src/components/TaskList.stories.jsx`.

Comienza con una implementación básica del `TaskList`. Necesitarás importar el componente `Task` del capítulo anterior y pasar los atributos y acciones como entradas.

```jsx:title=src/components/TaskList.jsx
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

A continuación, crea los estados de prueba de `Tasklist` en el archivo de historias.

```jsx:title=src/components/TaskList.stories.jsx
import TaskList from './TaskList';

import * as TaskStories from './Task.stories';

export default {
  component: TaskList,
  title: 'TaskList',
  decorators: [(story) => <div style={{ margin: '3rem' }}>{story()}</div>],
  tags: ['autodocs'],
  args: {
    ...TaskStories.ActionsData,
  },
};

export const Default = {
  args: {
    // Shaping the stories through args composition.
    // The data was inherited from the Default story in Task.stories.jsx.
    tasks: [
      { ...TaskStories.Default.args.task, id: '1', title: 'Task 1' },
      { ...TaskStories.Default.args.task, id: '2', title: 'Task 2' },
      { ...TaskStories.Default.args.task, id: '3', title: 'Task 3' },
      { ...TaskStories.Default.args.task, id: '4', title: 'Task 4' },
      { ...TaskStories.Default.args.task, id: '5', title: 'Task 5' },
      { ...TaskStories.Default.args.task, id: '6', title: 'Task 6' },
    ],
  },
};

export const WithPinnedTasks = {
  args: {
    tasks: [
      ...Default.args.tasks.slice(0, 5),
      { id: '6', title: 'Task 6 (pinned)', state: 'TASK_PINNED' },
    ],
  },
};

export const Loading = {
  args: {
    tasks: [],
    loading: true,
  },
};

export const Empty = {
  args: {
    // Shaping the stories through args composition.
    // Inherited data coming from the Loading story.
    ...Loading.args,
    loading: false,
  },
};
```

<div class="aside">

💡 [**Decoradores**](https://storybook.js.org/docs/writing-stories/decorators) son una forma de proporcionar envoltorios arbitrarios a las historias. En este caso, estamos usando una clave de decorador en el default export para añadir un `margin` alrededor del componente renderizado. También se pueden utilizar para envolver historias en "proveedores", es decir, componentes de la librería que establecen el contexto de React.

</div>

Al importar `TaskStories`, pudimos [componer](https://storybook.js.org/docs/react/writing-stories/args#args-composition) los argumentos (o args) en nuestras historias con poco esfuerzo. De esa forma, se conservan los datos y las acciones (llamadas simuladas) que esperan ambos componentes.

Ahora hay que revisar Storybook para ver las nuevas historias de `TaskList`.

<video autoPlay muted playsInline loop>
  <source
    src="/intro-to-storybook/inprogress-tasklist-states-7-0.mp4"
    type="video/mp4"
  />
</video>

## Construir los estados

Nuestro componente todavía es rudimentario, pero ahora tenemos una idea de las historias en las que trabajaremos. Puede que estés pensando que el envoltorio de `.list-items` es demasiado simplista. Tienes razón: en la mayoría de los casos no crearíamos un nuevo componente sólo para añadir un envoltorio. Pero la **verdadera complejidad** del componente `TaskList` se revela en los casos extremos `withPinnedTasks`, `loading`, y `empty`.

```jsx:title=src/components/TaskList.jsx
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
    ...tasks.filter((t) => t.state === 'TASK_PINNED'),
    ...tasks.filter((t) => t.state !== 'TASK_PINNED'),
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

Este nuevo código da como resultado la siguiente UI:

<video autoPlay muted playsInline loop>
  <source
    src="/intro-to-storybook/finished-tasklist-states-7-0.mp4"
    type="video/mp4"
  />
</video>

Observa la posición del elemento anclado en la lista. Queremos que el elemento anclado se muestre en la parte superior de la lista para que sea prioritario para nuestros usuarios.

## Requisitos de data y props

A medida que el componente crece, también lo hacen los parámetros de entrada requeridos de `TaskList`. Define las props requeridas de `TaskList`. Debido a que `Task` es un componente hijo, asegúrate de proporcionar los datos en la forma correcta para renderizarlo. Para ahorrar tiempo y dolores de cabeza, reutiliza los `propTypes` que definimos en `Task` anteriormente.

```diff:title=src/components/TaskList.jsx
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
    ...tasks.filter((t) => t.state === 'TASK_PINNED'),
    ...tasks.filter((t) => t.state !== 'TASK_PINNED'),
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
+  /** Checks if it's in loading state */
+  loading: PropTypes.bool,
+  /** The list of tasks */
+  tasks: PropTypes.arrayOf(Task.propTypes.task).isRequired,
+  /** Event to change the task to pinned */
+  onPinTask: PropTypes.func,
+  /** Event to change the task to archived */
+  onArchiveTask: PropTypes.func,
+ };
+ TaskList.defaultProps = {
+  loading: false,
+ };
```

<div class="aside">
💡¡No olvides hacer commit para guardar tus cambios con git!
</div>
