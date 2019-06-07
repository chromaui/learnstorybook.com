---
title: "Construye un componente simple"
tocTitle: "Componente Simple"
description: "Construye un componente simple en aislamiento"
commit: 403f19a
---

Construiremos nuestra UI siguiendo la metodología (CDD) [Component-Driven Development](https://blog.hichroma.com/component-driven-development-ce1109d56c8e). Es un proceso que construye UIs de “abajo hacia arriba”, empezando con los componentes y terminando con las vistas. CDD te ayudará a escalar la cantidad de complejidad con la que te enfrentas a medida que construyes la UI.

## Task - Tarea

![Task component in three states](/task-states-learnstorybook.png)

`Task` (o Tarea) es el componente principal en nuestra app. Cada tarea se muestra de forma ligeramente diferente según el estado en el que se encuentre. Mostramos un checkbox marcado (o no marcado), información sobre la tarea y un botón “pin” que nos permite mover la tarea hacia arriba o abajo en la lista de tareas. Poniendo esto en conjunto, necesitaremos estas propiedades -props- :

- `title` – un string que describe la tarea
- `state` - en que lista se encuentra la tarea actualmente? y, está marcado el checkbox?

A medida que comencemos a construir `Task`, primero escribiremos nuestros tests para los estados que corresponden a los distintos tipos de tareas descritas anteriormente. Luego, utilizamos Storybook para construir el componente de forma aislada usando datos de prueba. Vamos a “testear visualmente” la apariencia del componente a medida que cambiemos cada estado.

Este proceso es similar a [Test-driven development](https://en.wikipedia.org/wiki/Test-driven_development) (TDD) al que podemos llamar “[Visual TDD](https://blog.hichroma.com/visual-test-driven-development-aec1c98bed87)”.

## Ajustes iniciales

Primero, vamos a crear el componente Task y el archivo de historias de storybook que lo acompaña: `src/components/Task.js` y `src/components/Task.stories.js`.

Comenzaremos con una implementación básica de `Task`, simplemente teniendo en cuenta los atributos que sabemos que necesitaremos y las dos acciones que puedes realizar con una tarea (para moverla entre las listas):

```javascript
import React from "react";

export default function Task({
  task: { id, title, state },
  onArchiveTask,
  onPinTask
}) {
  return (
    <div className="list-item">
      <input type="text" value={title} readOnly={true} />
    </div>
  );
}
```

Arriba, renderizamos directamente `Task` basándonos en la estructura HTML existente de la app Todos.

A continuación creamos los tres estados de prueba de Task dentro del archivo de historia:

```javascript
import React from "react";
import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";

import Task from "./Task";

export function createTask(attrs) {
  return {
    id: Math.round(Math.random() * 1000000).toString(),
    title: "Test Task",
    state: "TASK_INBOX",
    updatedAt: Date.now(),
    ...attrs
  };
}

export const actions = {
  onPinTask: action("onPinTask"),
  onArchiveTask: action("onArchiveTask")
};

storiesOf("Task", module)
  .add("default", () => (
    <Task task={createTask({ state: "TASK_INBOX" })} {...actions} />
  ))
  .add("pinned", () => (
    <Task task={createTask({ state: "TASK_PINNED" })} {...actions} />
  ))
  .add("archived", () => (
    <Task task={createTask({ state: "TASK_ARCHIVED" })} {...actions} />
  ));
```

Existen dos niveles básicos de organización en Storybook. El componente y sus historias hijas. Piensa en cada historia como una permutación posible del componente. Puedes tener tantas historias por componente como se necesite.

- **Component**
  - Story
  - Story
  - Story

Para iniciar Storybook, primero invocamos a la función `storiesOf()` para registrar el componente. Agregamos un nombre para mostrar el componente, que se muestra en la barra lateral de la aplicación Storybook.

`action()` nos permite crear un callback que aparecerá en el panel **actions** de la UI de Storybook cuando es cliqueado. Entonces, cuando construyamos un botón pin, podremos determinar en la UI de prueba si un click en el botón es exitoso o no.

Como necesitamos pasarle el mismo conjunto de acciones a todas las permutaciones de nuestro componente, es conveniente agruparlas en una sola variable `actions` y utilizar `{...actions}`, la expansión de propiedades de React, para pasarlas todas a la vez. `<Task {...actions}>` es equivalente a `<Task onPinTask={actions.onPinTask} onArchiveTask={actions.onArchiveTask}>`.

Otra cosa positiva acerca de agrupar las `actions` que un componente necesita, es que puedes usar `export` y utilizarlas en historias para otros componentes que reutilicen este componente, como veremos luego.

Para definir nuestras historias, llamamos a `add()` una vez para cada uno de nuestros estados del test para generar una historia. La historia de acción - action story - es una función que retorna un elemento renderizado (es decir, una clase componente con un conjunto de props) en un estado dado---exactamente como en React [Stateless Functional Component](https://reactjs.org/docs/components-and-props.html).

Al crear una historia utilizamos una función auxiliar (`createTask()`) para construir la forma de la task que el componente espera. Esto generalmente se modela a partir del aspecto de los datos verdaderos. Nuevamente, `export`-ando esta función nos permitirá reutilizarla en historias posteriores, como veremos.

<div class="aside">
Las <a href="https://storybook.js.org/addons/introduction/#2-native-addons"><b>Acciones</b></a> ayudan a verificar las interacciones cuando creamos componentes UI en aislamiento. A menudo no tendrás acceso a las funciones y el estado que tienes en el contexto de la aplicación. Utiliza <code>action()</code> para agregarlas.
</div>

## Configuración

También necesitamos hacer un pequeño cambio en la configuración de Storybook (`.storybook/config.js`) para que tenga en cuenta nuestros archivos `.stories.js` y use nuestro archivo CSS. Por defecto, Storybook busca historias en el directorio `/stories`; este tutorial usa un esquema de nombres que es similar al esquema de nombres `.test.js` preferido por CRA para pruebas -tests- automatizadas.

```javascript
import { configure } from "@storybook/react";
import "../src/index.css";

const req = require.context('../src', true, /\.stories.js$/);

function loadStories() {
  req.keys().forEach(filename => req(filename));
}

configure(loadStories, module);
```

Una vez que hayamos hecho esto, reiniciando el servidor de Storybook debería producir casos de prueba para los tres estados de Task:

<video autoPlay muted playsInline controls >
  <source
    src="/inprogress-task-states.mp4"
    type="video/mp4"
  />
</video>

## Construyendo los estados

Ahora tenemos configurado Storybook, los estilos importados y los casos de prueba construidos; podemos comenzar rápidamente el trabajo de implementar el HTML del componente para que coincida con el diseño.

El componente todavía es básico. Primero escribiremos el código que se aproxima al diseño sin entrar en demasiados detalles:

```javascript
import React from "react";

export default function Task({
  task: { id, title, state },
  onArchiveTask,
  onPinTask
}) {
  return (
    <div className={`list-item ${state}`}>
      <label className="checkbox">
        <input
          type="checkbox"
          defaultChecked={state === "TASK_ARCHIVED"}
          disabled={true}
          name="checked"
        />
        <span className="checkbox-custom" onClick={() => onArchiveTask(id)} />
      </label>
      <div className="title">
        <input
          type="text"
          value={title}
          readOnly={true}
          placeholder="Input title"
        />
      </div>

      <div className="actions" onClick={event => event.stopPropagation()}>
        {state !== "TASK_ARCHIVED" && (
          <a onClick={() => onPinTask(id)}>
            <span className={`icon-star`} />
          </a>
        )}
      </div>
    </div>
  );
}
```

El maquetado adicional de arriba, combinado con el CSS que hemos importado antes, produce la siguiente UI:

<video autoPlay muted playsInline loop>
  <source
    src="/finished-task-states.mp4"
    type="video/mp4"
  />
</video>

## Especificar los requerimientos de datos

Es una buena práctica en React utilizar `propTypes` para especificar la forma de los datos que espera recibir un componente. No sólo se auto documenta, sino que también ayuda a detectar problemas rápidamente.

```javascript
import React from 'react';
import PropTypes from 'prop-types';

function Task() {
  ...
}

Task.propTypes = {
  task: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    state: PropTypes.string.isRequired,
  }),
  onArchiveTask: PropTypes.func,
  onPinTask: PropTypes.func,
};

export default Task;
```

Ahora aparecerá una advertencia en modo desarrollo si el componente Task se utiliza incorrectamente.

<div class="aside">
Una forma alternativa de lograr el mismo propósito es utilizando un sistema de tipos de JavaScript como TypeScript, para crear un tipo para las propiedades del componente.
</div>

## Componente construido!

Ahora hemos construido con éxito un componente sin necesidad de un servidor o sin ejecutar toda la aplicación frontend. El siguiente paso es construir los componentes restantes de la Taskbox, uno por uno de manera similar.

Como puedes ver, comenzar a construir componentes de forma aislada es fácil y rápido. Podemos esperar producir una UI de mayor calidad con menos errores y más pulida porque es posible profundizar y probar todos los estados posibles.

## Pruebas automatizadas

Storybook nos dio una excelente manera de probar visualmente nuestra aplicación durante su construcción. Las 'historias' ayudarán a asegurar que no rompamos nuestra Task visualmente, a medida que continuamos desarrollando la aplicación. Sin embargo, en esta etapa, es un proceso completamente manual y alguien tiene que hacer el esfuerzo de hacer clic en cada estado de prueba y asegurarse de que se visualice bien y sin errores ni advertencias. ¿No podemos hacer eso automáticamente?

### Pruebas de instantáneas

La prueba de instantáneas se refiere a la práctica de registrar la salida "correcta" de un componente para una entrada dada y luego en el futuro marcar el componente siempre que la salida cambie. Esto complementa a Storybook, porque es una manera rápida de ver la nueva versión de un componente y verificar los cambios.

Con [Storyshots addon](https://github.com/storybooks/storybook/tree/master/addons/storyshots) se crea una prueba de instantánea para cada una de las historias. Usalo agregando una dependencia en modo desarrollo en el paquete:

```bash
yarn add --dev @storybook/addon-storyshots react-test-renderer
```

Luego crea un archivo `src/storybook.test.js` con el siguiente contenido:

```javascript
import initStoryshots from "@storybook/addon-storyshots";
initStoryshots();
```

Una vez hecho lo anterior, podemos ejecutar `yarn test` y veremos el siguiente resultado:

![Task test runner](/task-testrunner.png)

Ahora tenemos una prueba de instantánea para cada una de las historias de `Task`. Si cambiamos la implementación de `Task`, se nos pedirá que verifiquemos los cambios.
