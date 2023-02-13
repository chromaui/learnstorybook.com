---
title: 'Introducir datos'
tocTitle: 'Datos'
description: 'Aprende como introducir datos a tus componentes UI'
commit: '94b134e'
---

Hasta ahora hemos creado componentes aislados sin estado, muy útiles para Storybook, pero finalmente no son útiles hasta que les proporcionemos algunos datos en nuestra aplicación.

Este tutorial no se centra en los detalles de la construcción de una aplicación, por lo que no profundizaremos en esos detalles aquí. Pero, nos tomaremos un momento para observar un patrón común para introducir datos con componentes contenedores.

## Componentes contenedores

Nuestro componente `TaskList` como lo hemos escrito es de “presentación” (ver [artículo al respecto](https://medium.com/@dan_abramov/smart-and-dumb-components-7ca2f9a7c7d0)), en el sentido que no se comunica con nada externo a su implementación. Para poder pasarle datos, necesitaremos un "contenedor".

Este ejemplo utiliza [Redux Toolkit](https://redux-toolkit.js.org/), el conjunto de herramientas más efectivo para desarrollar aplicaciones para almacenar datos con [Redux](https://redux.js.org/), para construir un modelo de datos para nuestra aplicación. Sin embargo, el patrón que utilizaremos también se aplica a aquí se aplica a otras librerías de manejo de datos como [Apollo](https://www.apollographql.com/client/) y [MobX](https://mobx.js.org/).

Agrega las dependencias necesarias a tu proyecto con:

```shell
yarn add @reduxjs/toolkit react-redux
```

Primero construiremos un simple store Redux que responde a acciones que cambian el estado de una tarea, en un archivo llamado `store.js` dentro del folder `src/lib`, (intencionalmente lo mantendremos simple):

```js:title=src/lib/store.js

/* Una implementación simple de los store/actions/reducer de Redux.
 * Una verdadera aplicación sería más compleja y se dividiría en diferentes archivos.
 */
import { configureStore, createSlice } from '@reduxjs/toolkit';
/*
 * El estado inicial de nuestro store cuando la aplicación carga.
 * Usualmente obtendrías esto de un servidor. No nos preocupemos por eso ahora.
 */
const defaultTasks = [
  { id: '1', title: 'Something', state: 'TASK_INBOX' },
  { id: '2', title: 'Something more', state: 'TASK_INBOX' },
  { id: '3', title: 'Something else', state: 'TASK_INBOX' },
  { id: '4', title: 'Something again', state: 'TASK_INBOX' },
];
const TaskBoxData = {
  tasks: defaultTasks,
  status: 'idle',
  error: null,
};
/*
 * La tienda se crea aquí
 * Puedes aprender más de "slices" de Redux Toolkit en la documentación:
 * https://redux-toolkit.js.org/api/createSlice
 */
const TasksSlice = createSlice({
  name: 'taskbox',
  initialState: TaskBoxData,
  reducers: {
    updateTaskState: (state, action) => {
      const { id, newTaskState } = action.payload;
      const task = state.tasks.findIndex((task) => task.id === id);
      if (task >= 0) {
        state.tasks[task].state = newTaskState;
      }
    },
  },
});
// Las acciones contenidas en el slice se exportan para su uso en nuestros componentes
export const { updateTaskState } = TasksSlice.actions;
/*
 * La configuración del store de nuestra aplicación va aquí.
 * Lee más sobre configureStore de Redux en la documentación:
 * https://redux-toolkit.js.org/api/configureStore
 */
const store = configureStore({
  reducer: {
    taskbox: TasksSlice.reducer,
  },
});
export default store;
```

Luego actualizaremos nuestro componente `TaskList` para conectarnos al store de Redux y renderizar las tareas en las que estamos interesados:

```js:title=src/components/TaskList.js
import React from 'react';
import Task from './Task';
import { useDispatch, useSelector } from 'react-redux';
import { updateTaskState } from '../lib/store';
export default function TaskList() {
  // Estamos recuperando el estado del store
  const tasks = useSelector((state) => {
    const tasksInOrder = [
      ...state.taskbox.tasks.filter((t) => t.state === 'TASK_PINNED'),
      ...state.taskbox.tasks.filter((t) => t.state !== 'TASK_PINNED'),
    ];
    const filteredTasks = tasksInOrder.filter(
      (t) => t.state === 'TASK_INBOX' || t.state === 'TASK_PINNED'
    );
    return filteredTasks;
  });
  const { status } = useSelector((state) => state.taskbox);
  const dispatch = useDispatch();
  const pinTask = (value) => {
    // Estamos despachando el evento Pinned (anclado) de regreso a nuestro store
    dispatch(updateTaskState({ id: value, newTaskState: 'TASK_PINNED' }));
  };
  const archiveTask = (value) => {
    // Estamos despachando el evento Archived (archivado) de regreso a nuestro store
    dispatch(updateTaskState({ id: value, newTaskState: 'TASK_ARCHIVED' }));
  };
  const LoadingRow = (
    <div className="loading-item">
      <span className="glow-checkbox" />
      <span className="glow-text">
        <span>Loading</span> <span>cool</span> <span>state</span>
      </span>
    </div>
  );
  if (status === 'loading') {
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
  return (
    <div className="list-items" data-testid="success" key={"success"}>
      {tasks.map((task) => (
        <Task
          key={task.id}
          task={task}
          onPinTask={(task) => pinTask(task)}
          onArchiveTask={(task) => archiveTask(task)}
        />
      ))}
    </div>
  );
}
```
Ahora que tenemos algunos datos reales que llenan nuestro componente obtenidos del store de Redux, podríamos haberlo conectado a `src/App.js` y renderizar el componente allí. Pero por ahora, dejemos de hacer eso y continuaremos con nuestro viaje basado en componentes.

No te preocupes por eso. Nos ocuparemos de ello en el próximo capítulo.

## Proveyendo contexto con decoradores

Nuestras historias de Storybook han dejado de funcionar con este cambio, porque nuestro `TaskList` ahora es un componente conectado, ya que depende de un store de Redux para recuperar y actualizar nuestras tareas.

![Broken tasklist](/intro-to-storybook/broken-tasklist-optimized.png)

Podemos utilizar varios enfoques para resolver este problema. Ya que nuestra aplicación es bastante sencilla, podemos confiar de un decorador, similar a lo que hicimos en el [capítulo anterior](/intro-to-storybook/react/en/composite-component) y proporcionar un store simulada en nuestras historias de Storybook:

```js:title=src/components/TaskList.stories.js
import React from 'react';
import TaskList from './TaskList';
import * as TaskStories from './Task.stories';
import { Provider } from 'react-redux';
import { configureStore, createSlice } from '@reduxjs/toolkit';
// Una simulación super sencilla del estado del store
export const MockedState = {
  tasks: [
    { ...TaskStories.Default.args.task, id: '1', title: 'Task 1' },
    { ...TaskStories.Default.args.task, id: '2', title: 'Task 2' },
    { ...TaskStories.Default.args.task, id: '3', title: 'Task 3' },
    { ...TaskStories.Default.args.task, id: '4', title: 'Task 4' },
    { ...TaskStories.Default.args.task, id: '5', title: 'Task 5' },
    { ...TaskStories.Default.args.task, id: '6', title: 'Task 6' },
  ],
  status: 'idle',
  error: null,
};
// Una simulación super sencilla del store de redux
const Mockstore = ({ taskboxState, children }) => (
  <Provider
    store={configureStore({
      reducer: {
        taskbox: createSlice({
          name: 'taskbox',
          initialState: taskboxState,
          reducers: {
            updateTaskState: (state, action) => {
              const { id, newTaskState } = action.payload;
              const task = state.tasks.findIndex((task) => task.id === id);
              if (task >= 0) {
                state.tasks[task].state = newTaskState;
              }
            },
          },
        }).reducer,
      },
    })}
  >
    {children}
  </Provider>
);
export default {
  component: TaskList,
  title: 'TaskList',
  decorators: [(story) => <div style={{ padding: "3rem" }}>{story()}</div>],
  excludeStories: /.*MockedState$/,
};
const Template = () => <TaskList />;
export const Default = Template.bind({});
Default.decorators = [
  (story) => <Mockstore taskboxState={MockedState}>{story()}</Mockstore>,
];
export const WithPinnedTasks = Template.bind({});
WithPinnedTasks.decorators = [
  (story) => {
    const pinnedtasks = [
      ...MockedState.tasks.slice(0, 5),
      { id: '6', title: 'Task 6 (pinned)', state: 'TASK_PINNED' },
    ];
    return (
      <Mockstore
        taskboxState={{
          ...MockedState,
          tasks: pinnedtasks,
        }}
      >
        {story()}
      </Mockstore>
    );
  },
];
export const Loading = Template.bind({});
Loading.decorators = [
  (story) => (
    <Mockstore
      taskboxState={{
        ...MockedState,
        status: 'loading',
      }}
    >
      {story()}
    </Mockstore>
  ),
];
export const Empty = Template.bind({});
Empty.decorators = [
  (story) => (
    <Mockstore
      taskboxState={{
        ...MockedState,
        tasks: [],
      }}
    >
      {story()}
    </Mockstore>
  ),
];
```


<div class="aside">
💡 <code>excludeStories</code> es un campo de configuración de Storybook que evita que nuestro estado simulado sea tratado como una historia. Puedes leer más sobre este campo en la <a href="https://storybook.js.org/docs/react/api/csf">documentación de Storybook</a>.
</div>

<video autoPlay muted playsInline loop>
  <source
    src="/intro-to-storybook/finished-tasklist-states-6-4-optimized.mp4"
    type="video/mp4"
  />
</video>

<div class="aside">
💡 No olvides hacer commit para guardar tus cambios con git!
</div>

Éxito! Estamos justo donde comenzamos, nuestro Storybook ahora está funcionando y podemos ver cómo podemos suministrar datos a un componente conectado. En el próximo capítulo tomaremos lo que hemos aprendido aquí y lo aplicaremos a una pantalla.
