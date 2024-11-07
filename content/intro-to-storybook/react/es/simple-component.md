---
title: 'Construye un componente simple'
tocTitle: 'Componente Simple'
description: 'Construye un componente simple en aislamiento'
commit: '9b36e1a'
---

Construiremos nuestra UI siguiendo la metodología (CDD) [Component-Driven Development](https://www.componentdriven.org/). Es un proceso que construye UIs de “abajo hacia arriba”, empezando con los componentes y terminando con las pantallas. CDD te ayuda a escalar la cantidad de complejidad con la que te enfrentas a medida que construyes la UI.

## Task - Tarea

![Task component in three states](/intro-to-storybook/task-states-learnstorybook.png)

`Task` (o Tarea) es el componente principal de nuestra aplicación. Cada tarea se muestra de forma ligeramente diferente según el estado en el que se encuentre. Mostramos un checkbox marcado (o no marcado), información sobre la tarea y un botón “pin” que nos permite mover la tarea hacia arriba o abajo en la lista de tareas. Para lograr esto, necesitaremos estas propiedades (props) :

- `title` – un string que describe la tarea
- `state` - ¿en qué lista se encuentra la tarea actualmente y está marcado el checkbox?

A medida que comencemos a construir `Task`, primero escribiremos nuestros tests para los estados que corresponden a los distintos tipos de tareas descritas anteriormente. Luego, utilizamos Storybook para construir el componente de forma aislada usando datos de prueba. Vamos a “testear visualmente” la apariencia del componente a medida que cambiemos cada estado.

## Ajustes iniciales

Primero, vamos a crear el componente Task y el archivo de historias de Storybook que lo acompaña: `src/components/Task.js` y `src/components/Task.stories.jsx`.

Comenzaremos con una implementación básica de `Task`, simplemente teniendo en cuenta los atributos que sabemos que necesitaremos y las dos acciones que puedes realizar con una tarea (para moverla entre las listas):

```jsx:title=src/components/Task.jsx
export default function Task({ task: { id, title, state }, onArchiveTask, onPinTask }) {
  return (
    <div className="list-item">
      <label htmlFor={`title-${id}`} aria-label={title}>
        <input type="text" value={title} readOnly={true} name="title" id={`title-${id}`} />
      </label>
    </div>
  );
}
```

Arriba, renderizamos directamente `Task` basándonos en la estructura HTML existente de la app Todos.

A continuación creamos los tres estados de prueba de `Task` dentro del archivo de historia:

```jsx:title=src/components/Task.stories.jsx
import { fn } from "@storybook/test";

import Task from './Task';

export const ActionsData = {
  onArchiveTask: fn(),
  onPinTask: fn(),
};

export default {
  component: Task,
  title: 'Task',
  tags: ['autodocs'],
  //👇 Our exports that end in "Data" are not stories.
  excludeStories: /.*Data$/,
  args: {
    ...ActionsData,
  },
};

export const Default = {
  args: {
    task: {
      id: '1',
      title: 'Test Task',
      state: 'TASK_INBOX',
    },
  },
};

export const Pinned = {
  args: {
    task: {
      ...Default.args.task,
      state: 'TASK_PINNED',
    },
  },
};

export const Archived = {
  args: {
    task: {
      ...Default.args.task,
      state: 'TASK_ARCHIVED',
    },
  },
};
```

<div class="aside">

💡 Las [**Acciones**](https://storybook.js.org/docs/essentials/actions) ayudan a verificar las interacciones cuando creamos componentes UI en aislamiento. A menudo no tendrás acceso a las funciones y el estado que tienes en el contexto de la aplicación. Utiliza `fn()` para agregarlas.

</div>

Existen dos niveles básicos de organización en Storybook: el componente y sus historias hijas. Piensa en cada historia como una permutación posible del componente. Puedes tener tantas historias por componente como se necesite.

- **Componente**
  - Historia
  - Historia
  - Historia

Para contarle a Storybook sobre el componente que estamos documentando, creamos un export `default` que contiene:

- `component` -- el propio componente
- `title` -- como hacer referencia al componente en el sidebar de la aplicación Storybook
- `tags` -- para generar automáticamente documentación para nuestros componentes
- `excludeStories` -- información adicional requerida por la historia pero que no debe mostrarse en Storybook
- `args` - define la acción [args](https://storybook.js.org/docs/essentials/actions#action-args) que el component espera para simular los eventos personalizados

Para definir nuestras historias, utilizaremos el formato Component Story Format 3 (también conocido como [CSF3](https://storybook.js.org/docs/api/csf) ) para crear cada uno de nuestros casos de prueba. Este formato está diseñado para crear cada uno de nuestros casos de prueba de manera concisa. Al exportar un objeto que contiene cada estado del componente, podemos definir nuestras pruebas de manera más intuitiva y crear y reutilizar historias de manera más eficiente.

Argumentos o [`args`](https://storybook.js.org/docs/writing-stories/args), nos permiten editar en vivo nuestros componentes con el complemento "Controls" sin reiniciar Storybook. Una vez que cambia el valor de un [`arg`](https://storybook.js.org/docs/writing-stories/args), el componente también cambia.

`fn()` nos permite crear llamadas o "callbacks" que aparecen en el panel de **actions** de la UI de Storybook cuando se hace clic. Así que cuando construyamos un botón de pin, podremos determinar si un clic en el botón es exitoso en la interfaz de usuario.

Dado que necesitamos pasar el mismo conjunto de acciones a todas las permutaciones de nuestro componente, es conveniente agruparlas en una única variable `ActionsData` (acciones de data) y pasarlas en nuestra definición de historia cada vez. Otra ventaja de agrupar los `ActionsData` que un componente necesita es que puedes exportarlas y usarlas en historias para componentes que reutilizan este componente, como veremos más adelante.

Al crear una historia utilizamos un argumento base de `task` para construir la forma de la task que el componente espera. Esto generalmente se modela a partir del aspecto de los datos verdaderos. Nuevamente, `export`-ando esta función nos permitirá reutilizarla en historias posteriores, como veremos.

## Configuración

Necesitamos hacer un par de cambios en los archivos de configuración de Storybook para que reconozca nuestras historias recién creadas y nos permita usar el archivo CSS de la aplicación (ubicado en `src/index.css`).

Comenzaremos cambiando tu archivo de configuración de Storybook (`.storybook/main.js`) a lo siguiente:

```diff:title=.storybook/main.js
/** @type { import('@storybook/react-vite').StorybookConfig } */
const config = {
- stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|ts|tsx)'],
+ stories: ['../src/components/**/*.stories.@(js|jsx)'],
  staticDirs: ['../public'],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
  ],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
};
export default config;
```

Una vez que hayamos hecho esto, dentro de la carpeta `.storybook`, cambia tu `preview.js` a lo siguiente:

```diff:title=.storybook/preview.js
+ import '../src/index.css';

//👇 Configures Storybook to log the actions( onArchiveTask and onPinTask ) in the UI.
/** @type { import('@storybook/react').Preview } */
const preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
  },
};

export default preview;
```

Los [`parametros`](https://storybook.js.org/docs/writing-stories/parameters) se utilizan normalmente para controlar el comportamiento de las funciones y complementos (addons) de Storybook. En nuestro caso, no los usaremos para ese propósito. En su lugar, importaremos el archivo CSS de nuestra aplicación.

Una vez que hayamos hecho esto, reiniciar el servidor de Storybook debería producir casos de prueba para los tres estados de Task:

<video autoPlay muted playsInline loop>
  <source
    src="/intro-to-storybook/inprogress-task-states-7-0.mp4"
    type="video/mp4"
  />
</video>

## Construyendo los estados

Ahora que tenemos configurado Storybook, los estilos importados y los casos de prueba creados, podemos comenzar rápidamente a implementar el HTML del componente para que coincida con el diseño.

El componente todavía es básico en este momento. Primero, escribiremos el código que logre el diseño sin entrar en demasiados detalles:

```jsx:title=src/components/Task.jsx
export default function Task({ task: { id, title, state }, onArchiveTask, onPinTask }) {
  return (
    <div className={`list-item ${state}`}>
      <label
        htmlFor={`archiveTask-${id}`}
        aria-label={`archiveTask-${id}`}
        className="checkbox"
      >
        <input
          type="checkbox"
          disabled={true}
          name="checked"
          id={`archiveTask-${id}`}
          checked={state === "TASK_ARCHIVED"}
        />
        <span
          className="checkbox-custom"
          onClick={() => onArchiveTask(id)}
        />
      </label>

      <label htmlFor={`title-${id}`} aria-label={title} className="title">
        <input
          type="text"
          value={title}
          readOnly={true}
          name="title"
          id={`title-${id}`}
          placeholder="Input title"
        />
      </label>
      {state !== "TASK_ARCHIVED" && (
        <button
          className="pin-button"
          onClick={() => onPinTask(id)}
          id={`pinTask-${id}`}
          aria-label={`pinTask-${id}`}
          key={`pinTask-${id}`}
        >
          <span className={`icon-star`} />
        </button>
      )}
    </div>
  );
}
```

El maquetado adicional de arriba, combinado con el CSS que hemos importado antes, produce la siguiente UI:

<video autoPlay muted playsInline loop>
  <source
    src="/intro-to-storybook/finished-task-states-7-0.mp4"
    type="video/mp4"
  />
</video>

## Especificar los requerimientos de datos

Es una buena práctica utilizar `propTypes` en React para especificar la forma de los datos que un componente espera. No sólo se auto documenta, sino que también ayuda a detectar problemas de manera temprana.

```diff:title=src/components/Task.jsx
+ import PropTypes from 'prop-types';

export default function Task({ task: { id, title, state }, onArchiveTask, onPinTask }) {
  return (
    <div className={`list-item ${state}`}>
      <label
        htmlFor={`archiveTask-${id}`}
        aria-label={`archiveTask-${id}`}
        className="checkbox"
      >
        <input
          type="checkbox"
          disabled={true}
          name="checked"
          id={`archiveTask-${id}`}
          checked={state === "TASK_ARCHIVED"}
        />
        <span
          className="checkbox-custom"
          onClick={() => onArchiveTask(id)}
        />
      </label>

      <label htmlFor={`title-${id}`} aria-label={title} className="title">
        <input
          type="text"
          value={title}
          readOnly={true}
          name="title"
          id={`title-${id}`}
          placeholder="Input title"
        />
      </label>
      {state !== "TASK_ARCHIVED" && (
        <button
          className="pin-button"
          onClick={() => onPinTask(id)}
          id={`pinTask-${id}`}
          aria-label={`pinTask-${id}`}
          key={`pinTask-${id}`}
        >
          <span className={`icon-star`} />
        </button>
      )}
    </div>
  );
}
+ Task.propTypes = {
+  /** Composition of the task */
+  task: PropTypes.shape({
+    /** Id of the task */
+    id: PropTypes.string.isRequired,
+    /** Title of the task */
+    title: PropTypes.string.isRequired,
+    /** Current state of the task */
+    state: PropTypes.string.isRequired,
+  }),
+  /** Event to change the task to archived */
+  onArchiveTask: PropTypes.func,
+  /** Event to change the task to pinned */
+  onPinTask: PropTypes.func,
+ };
```

Ahora aparecerá una advertencia en modo desarrollo si se usa incorrectamente el componente Task.

<div class="aside">
💡 Una forma alternativa de lograr el mismo propósito es utilizar un sistema de tipos de JavaScript como TypeScript para crear un tipo para las propiedades del componente.
</div>

## ¡Componente construido!

Ahora hemos construido con éxito un componente sin necesidad de un servidor o sin ejecutar toda la aplicación frontend. El siguiente paso es construir los componentes restantes de la Taskbox, uno por uno de manera similar.

Como puedes ver, comenzar a construir componentes de forma aislada es fácil y rápido. Podemos esperar producir una UI de mayor calidad con menos errores y más elegancia porque es posible profundizar y probar todos los estados posibles.

## Detectar problemas de accesibilidad

Las pruebas de accesibilidad se refieren a la práctica de auditar el DOM renderizado con herramientas automatizadas contra un conjunto de heurísticas basadas en las reglas [WCAG](https://www.w3.org/WAI/standards-guidelines/wcag/) y otras mejores prácticas aceptadas por la industria. Actuán como la primera línea de control de calidad (QA) para detectar infracciones obvias de accesibilidad y aseguran que una aplicación sea utilizable por la mayor cantidad de personas posible, incluidas personas con discapacidades como problemas de visión, problemas auditivos y condiciones cognitivas.

Storybook también tiene un [complemento oficial de accesibilidad](https://storybook.js.org/addons/@storybook/addon-a11y). Desarrollado con el [axe-core](https://github.com/dequelabs/axe-core) de Deque, puede detectar hasta [57% de los problemas de WCAG](https://www.deque.com/blog/automated-testing-study-identifies-57-percent-of-digital-accessibility-issues/).

¡Vamos a ver como funciona! Ejecuta el comando siguiente para instalar el complemento:

```shell
yarn add --dev @storybook/addon-a11y
```

Luego, actualiza tu archivo de configuración de Storybook (`.storybook/main.js`) para activarlo:

```diff:title=.storybook/main.js
/** @type { import('@storybook/react-vite').StorybookConfig } */
const config = {
  stories: ['../src/components/**/*.stories.@(js|jsx)'],
  staticDirs: ['../public'],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
+   '@storybook/addon-a11y',
  ],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
};
export default config;
```

Para terminar, reinicia tu Storybook para ver el nuevo complemento habilitado en la UI.

![Task accessibility issue in Storybook](/intro-to-storybook/finished-task-states-accessibility-issue-7-0.png)

Mirando nuestras historias, podemos ver que el complemento encontró un problema de accesibilidad con uno de nuestros estados de prueba. El mensaje [**"Los elementos deben tener suficiente contraste de color"**](https://dequeuniversity.com/rules/axe/4.4/color-contrast?application=axeAPI), significa que no hay suficiente contraste entre el título de la tarea y el fondo. Podemos solucionarlo rápidamente cambiando el color de texto a un gris más oscuro en el CSS de nuestra aplicación (ubicado en `src/index.css`).

```diff:title=src/index.css
.list-item.TASK_ARCHIVED input[type="text"] {
- color: #a0aec0;
+ color: #4a5568;
  text-decoration: line-through;
}
```

¡Terminamos! Hemos dado el primer paso para garantizar que la UI sea accesible. Mientras continuamos agregando complejidad a nuestra aplicación, podemos repetir este proceso para todos los demás componentes sin necesidad de usar herramientas adicionales o entornos de prueba.

<div class="aside">
💡 ¡No olvides hacer commit para guardar tus cambios con git!
</div>
