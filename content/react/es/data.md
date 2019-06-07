---
title: "Introducir datos"
tocTitle: "Datos"
description: "Aprende como introducir datos a tus componentes UI"
commit: 9c50472
---

Hasta ahora hemos creado componentes aislados sin estado, muy útiles para Storybook, pero finalmente no son útiles hasta que les proporcionemos algunos datos en nuestra aplicación.

Este tutorial no se centra en los detalles de la construcción de una aplicación, por lo que no profundizaremos en esos detalles aquí. Pero, nos tomaremos un momento para observar un patrón común para introducir datos con componentes contenedores.

## Componentes contenedores

Nuestro componente `TaskList` como lo hemos escrito es de “presentación” (ver [artículo al respecto](https://medium.com/@dan_abramov/smart-and-dumb-components-7ca2f9a7c7d0)), en el sentido que no se comunica con nada externo a su implementación. Para poder pasarle datos, necesitaremos un "contenedor".

Este ejemplo utiliza [Redux](https://redux.js.org/), la librería mas popular de React para almacenar datos, que básicamente nos permite crear un modelo simple de datos para la aplicación. De todos modos, el patrón que utilizaremos también se aplica a otras librerías de manejo de datos como [Apollo](https://www.apollographql.com/client/) y [MobX](https://mobx.js.org/).

Agrega una nueva dependencia en `package.json` con:

```bash
yarn add react-redux
```

Primero construiremos un simple store Redux que responde a acciones que cambian el estado de una tarea, en un archivo llamado `lib/redux.js`, (intencionalmente lo mantendremos simple):

```javascript
// Una implementación simple de los store/actions/reducer de Redux.
// Una verdadera aplicación sería más compleja y se dividiría en diferentes archivos.
import { createStore } from "redux";

// Las acciones son los "nombres" de los cambios que pueden ocurrir en el store.
export const actions = {
  ARCHIVE_TASK: "ARCHIVE_TASK",
  PIN_TASK: "PIN_TASK"
};

// Los creadores de acciones son la forma en que se agrupan las acciones con los datos necesarios para ejecutarlas.
export const archiveTask = id => ({ type: actions.ARCHIVE_TASK, id });
export const pinTask = id => ({ type: actions.PIN_TASK, id });

// Todos nuestros reducers simplemente cambian el estado de una sola tarea.
function taskStateReducer(taskState) {
  return (state, action) => {
    return {
      ...state,
      tasks: state.tasks.map(task =>
        task.id === action.id ? { ...task, state: taskState } : task
      )
    };
  };
}

// El reducer describe como los contenidos del store cambian por cada acción.
export const reducer = (state, action) => {
  switch (action.type) {
    case actions.ARCHIVE_TASK:
      return taskStateReducer("TASK_ARCHIVED")(state, action);
    case actions.PIN_TASK:
      return taskStateReducer("TASK_PINNED")(state, action);
    default:
      return state;
  }
};

// El estado inicial de nuestro store cuando la app carga.
// Usualmente obtendrías esto de un servidor.
const defaultTasks = [
  { id: "1", title: "Something", state: "TASK_INBOX" },
  { id: "2", title: "Something more", state: "TASK_INBOX" },
  { id: "3", title: "Something else", state: "TASK_INBOX" },
  { id: "4", title: "Something again", state: "TASK_INBOX" }
];

// Exportamos el store de redux construido.
export default createStore(reducer, { tasks: defaultTasks });
```

Luego actualizaremos lo exportado por defecto en el componente `TaskList` para conectarlo al Store de Redux y renderizar las tareas en las que estamos interesados.

```javascript
import React from "react";
import PropTypes from "prop-types";

import Task from "./Task";
import { connect } from "react-redux";
import { archiveTask, pinTask, snoozeTask } from "../lib/redux";

export function PureTaskList({ tasks, onPinTask, onArchiveTask }) {
  /* antigua implementación de TaskList */
}

PureTaskList.propTypes = {
  loading: PropTypes.bool,
  tasks: PropTypes.arrayOf(Task.propTypes.task).isRequired,
  onPinTask: PropTypes.func.isRequired,
  onArchiveTask: PropTypes.func.isRequired
};

PureTaskList.defaultProps = {
  loading: false
};

export default connect(
  ({ tasks }) => ({
    tasks: tasks.filter(
      t => t.state === "TASK_INBOX" || t.state === "TASK_PINNED"
    )
  }),
  dispatch => ({
    onArchiveTask: id => dispatch(archiveTask(id)),
    onPinTask: id => dispatch(pinTask(id))
  })
)(PureTaskList);
```

En esta etapa, nuestras pruebas de Storybook habrán dejado de funcionar, ya que la `TaskList` ahora es un contenedor y ya no espera ninguna de las props pasadas como parámetros, sino que se conecta a la store y establece las props en el componente `PureTaskList` que envuelve.

Sin embargo, podemos resolver este problema fácilmente renderizando `PureTaskList` --el componente de presentación-- en nuestras historias de Storybook:

```javascript
import React from "react";
import { storiesOf } from "@storybook/react";

import { PureTaskList } from "./TaskList";
import { createTask, actions } from "./Task.stories";

export const defaultTasks = [
  createTask({ state: "TASK_INBOX" }),
  createTask({ state: "TASK_INBOX" }),
  createTask({ state: "TASK_INBOX" }),
  createTask({ state: "TASK_INBOX" }),
  createTask({ state: "TASK_INBOX" }),
  createTask({ state: "TASK_INBOX" })
];

export const withPinnedTasks = [
  createTask({ title: "Task 1", state: "TASK_INBOX" }),
  createTask({ title: "Task 2", state: "TASK_INBOX" }),
  createTask({ title: "Task 3", state: "TASK_INBOX" }),
  createTask({ title: "Task 4", state: "TASK_INBOX" }),
  createTask({ title: "Task 5", state: "TASK_INBOX" }),
  createTask({ title: "Task 6 (pinned)", state: "TASK_PINNED" })
];

storiesOf("TaskList", module)
  .addDecorator(story => <div style={{ padding: "3rem" }}>{story()}</div>)
  .add("default", () => <PureTaskList tasks={defaultTasks} {...actions} />)
  .add("withPinnedTasks", () => (
    <PureTaskList tasks={withPinnedTasks} {...actions} />
  ))
  .add("loading", () => <PureTaskList loading tasks={[]} {...actions} />)
  .add("empty", () => <PureTaskList tasks={[]} {...actions} />);
```

<video autoPlay muted playsInline loop>
  <source
    src="/finished-tasklist-states.mp4"
    type="video/mp4"
  />
</video>
