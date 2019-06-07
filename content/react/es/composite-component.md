---
title: "Ensamblar un componente compuesto"
tocTitle: "Componente Compuesto"
description: "Ensamblar un componente compuesto a partir de componentes simples"
commit: 8db511e
---

En el último capítulo construimos nuestro primer componente; este capítulo extiende lo que aprendimos para construir TaskList, una lista de Tareas. Combinemos componentes en conjunto y veamos qué sucede cuando se añade más complejidad.

## Lista de Tareas

Taskbox enfatiza las tareas ancladas colocándolas por encima de las tareas predeterminadas. Esto produce dos variaciones de `TaskList` para las que necesita crear historias: ítems por defecto e ítems por defecto y anclados.

![default and pinned tasks](/tasklist-states-1.png)

Dado que los datos de `Tareas` pueden enviarse asincrónicamente, **también** necesitamos un estado de cargando para renderizar en ausencia de alguna conexión. Además, también se requiere un estado vacío para cuando no hay tareas.

![empty and loading tasks](/tasklist-states-2.png)

## Empezar la configuración

Un componente compuesto no es muy diferente de los componentes básicos que contiene. Crea un componente `TaskList` y un archivo de historia que lo acompañe: `src/components/TaskList.js` y `src/components/TaskList.stories.js`.

Comienza con una implementación aproximada de la `TaskList`. Necesitarás importar el componente `Tareas` del capítulo anterior y pasarle los atributos y acciones como entrada.

```javascript
import React from "react";

import Task from "./Task";

function TaskList({ loading, tasks, onPinTask, onArchiveTask }) {
  const events = {
    onPinTask,
    onArchiveTask
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

export default TaskList;
```

A continuación, crea los estados de prueba de `Tasklist` en el archivo de historia.

```javascript
import React from "react";
import { storiesOf } from "@storybook/react";

import TaskList from "./TaskList";
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
  .add("default", () => <TaskList tasks={defaultTasks} {...actions} />)
  .add("withPinnedTasks", () => (
    <TaskList tasks={withPinnedTasks} {...actions} />
  ))
  .add("loading", () => <TaskList loading tasks={[]} {...actions} />)
  .add("empty", () => <TaskList tasks={[]} {...actions} />);
```

`addDecorator()` nos permite añadir algún "contexto" al renderizado de cada tarea. En este caso añadimos relleno alrededor de la lista para que sea más fácil de verificar visualmente.

<div class="aside">
Los <a href="https://storybook.js.org/addons/introduction/#1-decorators"><b>Decoradores</b></a> son una forma de proporcionar envoltorios arbitrarios a las historias. En este caso estamos usando un decorador para añadir estilo. También se pueden utilizar para envolver historias en "proveedores", es decir, componentes de la librebría que establecen el contexto de React.
</div>

`createTask()` es una función de ayuda que genera la forma de una Tarea que creamos y exportamos desde el archivo `Task.stories.js`. De manera similar, las `acciones` exportadas de `Task.stories.js` definieron las acciones (comunmente llamadas mockeadas) que espera un componente `Task`, el cual también necesita la `TaskList`.

Ahora revise Storybook para ver las nuevas historias de la lista de tareas.

<video autoPlay muted playsInline loop>
  <source
    src="/inprogress-tasklist-states.mp4"
    type="video/mp4"
  />
</video>

## Construir los estados

Nuestro componente sigue siendo muy rudimentario, pero ahora tenemos una idea de las historias en las que trabajaremos. Podrías estar pensando que el envoltorio de `.list-items` es demasiado simplista. Tienes razón, en la mayoría de los casos no crearíamos un nuevo componente sólo para añadir un envoltorio. Pero la **complejidad real** del componente `TaskList` se revela en los casos extremos `withPinnedTasks`, `loading`, y `empty`.

```javascript
import React from "react";

import Task from "./Task";

function TaskList({ loading, tasks, onPinTask, onArchiveTask }) {
  const events = {
    onPinTask,
    onArchiveTask
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
      <div className="list-items">
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
      <div className="list-items">
        <div className="wrapper-message">
          <span className="icon-check" />
          <div className="title-message">You have no tasks</div>
          <div className="subtitle-message">Sit back and relax</div>
        </div>
      </div>
    );
  }

  const tasksInOrder = [
    ...tasks.filter(t => t.state === "TASK_PINNED"),
    ...tasks.filter(t => t.state !== "TASK_PINNED")
  ];

  return (
    <div className="list-items">
      {tasksInOrder.map(task => (
        <Task key={task.id} task={task} {...events} />
      ))}
    </div>
  );
}

export default TaskList;
```

El etiquetado añadido da como resultado la siguiente interfaz de usuario:

<video autoPlay muted playsInline loop>
  <source
    src="/finished-tasklist-states.mp4"
    type="video/mp4"
  />
</video>

Observa la posición del elemento anclado en la lista. Queremos que el elemento anclado se muestre en la parte superior de la lista para que sea prioritario para nuestros usuarios.

## Requisitos de data y props

A medida que el componente crece, también lo hacen los parámetros de entrada requeridos de `TaskList`. Define las props requeridas de `TaskList`. Debido a que `Task` es un componente hijo, asegúrate de proporcionar los datos en la forma correcta para renderizarlo. Para ahorrar tiempo y dolores de cabeza, reutiliza los propTypes que definiste en `Tareas` anteriormente.

```javascript
import React from 'react';
import PropTypes from 'prop-types';

function TaskList() {
  ...
}


TaskList.propTypes = {
  loading: PropTypes.bool,
  tasks: PropTypes.arrayOf(Task.propTypes.task).isRequired,
  onPinTask: PropTypes.func.isRequired,
  onArchiveTask: PropTypes.func.isRequired,
};

TaskList.defaultProps = {
  loading: false,
};

export default TaskList;
```

## Pruebas automatizadas

En el capítulo anterior aprendimos a capturar historias de prueba utilizando Storyshots. Con el componente `Task` no había mucha complejidad para probar más allá de que se renderice correctamente. Dado que `TaskList` añade otra capa de complejidad, queremos verificar que ciertas entradas produzcan ciertas salidas de una manera adecuada con pruebas automáticas. Para hacer esto crearemos test unitarios utilizando [Jest](https://facebook.github.io/jest/) junto con un renderizador de prueba como [Enzyme](http://airbnb.io/enzyme/).

![Jest logo](/logo-jest.png)

### Test unitarios con Jest

Las historias de Storybook combinadas con pruebas visuales manuales y pruebas de instantáneas (ver arriba) ayudan mucho a evitar errores de interfaz de usuario. Si las historias cubren una amplia variedad de casos de uso de los componentes, y utilizamos herramientas que aseguran que un humano compruebe cualquier cambio en la historia, los errores son mucho menos probables.

Sin embargo, a veces el diablo está en los detalles. Se necesita un framework de pruebas que sea explícito sobre esos detalles. Lo que nos lleva a hacer pruebas unitarias.

En nuestro caso, queremos que nuestra `TaskList` muestre cualquier tarea anclada **antes de** las tareas no ancladas que sean pasadas en la prop `tasks`. Aunque tenemos una historia (`withPinnedTasks`) para probar este escenario exacto; puede ser ambiguo para un revisor humano que si el componente **no** ordena las tareas de esta manera, es un error. Ciertamente no gritará **"¡Mal!"** para el ojo casual.

Por lo tanto, para evitar este problema, podemos usar Jest para renderizar la historia en el DOM y ejecutar algún código de consulta del DOM para verificar las características salientes del resultado.

Crea un archivo de prueba llamado `Task.test.js`. Aquí vamos a construir nuestras pruebas que hacen afirmaciones acerca del resultado.

```javascript
import React from "react";
import ReactDOM from "react-dom";
import TaskList from "./TaskList";
import { withPinnedTasks } from "./TaskList.stories";

it("renders pinned tasks at the start of the list", () => {
  const div = document.createElement("div");
  const events = { onPinTask: jest.fn(), onArchiveTask: jest.fn() };
  ReactDOM.render(<TaskList tasks={withPinnedTasks} {...events} />, div);

  // Esperamos que la tarea titulada "Tarea 6 (anclada)" se ejecute primero, no al final.
  const lastTaskInput = div.querySelector(
    '.list-item:nth-child(1) input[value="Task 6 (pinned)"]'
  );
  expect(lastTaskInput).not.toBe(null);

  ReactDOM.unmountComponentAtNode(div);
});
```

![TaskList test runner](/tasklist-testrunner.png)

Nota que hemos sido capaces de reutilizar la lista de tareas `withPinnedTasks` tanto en la prueba de la historia como en el test unitario; de esta manera podemos continuar aprovechando un recurso existente (los ejemplos que representan configuraciones interesantes de un componente) de más y más maneras.

Note también que esta prueba es bastante frágil. Es posible que a medida que el proyecto madure y que la implementación exacta de la `Tarea` cambie --quizás usando un nombre de clase diferente o un "área de texto" en lugar de un "input" en el etiquetado-- la prueba falle y necesite ser actualizada. Esto no es necesariamente un problema, sino más bien una indicación de que hay que ser bastante cuidadoso usando pruebas unitarias para la UI. No son fáciles de mantener. En su lugar, confía en las pruebas visuales, de instantáneas y de regresión visual (mira el [capitulo sobre las pruebas](/test/)) siempre que te sea posible.
