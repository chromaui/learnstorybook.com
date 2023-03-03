---
title: 'Construir una pantalla'
tocTitle: 'Pantallas'
description: 'Construir una pantalla con componentes'
commit: 'e6e6cae'
---

Nos hemos concentrado en crear interfaces de usuario de abajo hacia arriba; comenzando por lo pequeño y añadiendo complejidad. Esto nos ha permitido desarrollar cada componente de forma aislada, determinar los datos que necesita y jugar con ellos en Storybook. Todo sin necesidad de levantar un servidor o construir pantallas!

En este capítulo continuaremos aumentando la sofisticación combinando componentes en una pantalla y desarrollando esa pantalla en Storybook.

## Componentes de contenedor anidados

Como nuestra aplicación es muy simple, la pantalla que construiremos es bastante trivial, simplemente obteniendo datos de una API remota, envolviendo el componente `TaskList` (que proporciona sus propios datos a través de Redux) y sacando un campo `error` de primer nivel de Redux.

Empezamos actualizando nuestro store de Redux (en `src/lib/store.js`) para conectar a una API remota y manejar los diversos estados de nuestra aplicación (por ejemplo, `error`, `succeeded`):

```diff:title=src/lib/store.js
/* A simple redux store/actions/reducer implementation.
 * A true app would be more complex and separated into different files.
 */
import {
  configureStore,
  createSlice,
+ createAsyncThunk,
} from '@reduxjs/toolkit';

/*
 * The initial state of our store when the app loads.
 * Usually, you would fetch this from a server. Let's not worry about that now
 */

const TaskBoxData = {
  tasks: [],
  status: "idle",
  error: null,
};

/*
 * Creates an asyncThunk to fetch tasks from a remote endpoint.
 * You can read more about Redux Toolkit's thunks in the docs:
 * https://redux-toolkit.js.org/api/createAsyncThunk
 */
+ export const fetchTasks = createAsyncThunk('todos/fetchTodos', async () => {
+   const response = await fetch(
+     'https://jsonplaceholder.typicode.com/todos?userId=1'
+   );
+   const data = await response.json();
+   const result = data.map((task) => ({
+     id: `${task.id}`,
+     title: task.title,
+     state: task.completed ? 'TASK_ARCHIVED' : 'TASK_INBOX',
+   }));
+   return result;
+ });

/*
 * The store is created here.
 * You can read more about Redux Toolkit's slices in the docs:
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
  /*
   * Extends the reducer for the async actions
   * You can read more about it at https://redux-toolkit.js.org/api/createAsyncThunk
   */
+  extraReducers(builder) {
+    builder
+    .addCase(fetchTasks.pending, (state) => {
+      state.status = 'loading';
+      state.error = null;
+      state.tasks = [];
+    })
+    .addCase(fetchTasks.fulfilled, (state, action) => {
+      state.status = 'succeeded';
+      state.error = null;
+      // Add any fetched tasks to the array
+      state.tasks = action.payload;
+     })
+    .addCase(fetchTasks.rejected, (state) => {
+      state.status = 'failed';
+      state.error = "Something went wrong";
+      state.tasks = [];
+    });
+ },
});

// The actions contained in the slice are exported for usage in our components
export const { updateTaskState } = TasksSlice.actions;

/*
 * Our app's store configuration goes here.
 * Read more about Redux's configureStore in the docs:
 * https://redux-toolkit.js.org/api/configureStore
 */
const store = configureStore({
  reducer: {
    taskbox: TasksSlice.reducer,
  },
});

export default store;
```

Ahora que hemos actualizado nuestro store para recuperar los datos desde un endpoint de una API remota y lo hemos preparado para manejar los diversos estados de nuestra aplicación, vamos a crear nuestro `InboxScreen.js` en el directorio `src/components`:

```js:title=src/components/InboxScreen.js
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTasks } from '../lib/store';
import TaskList from './TaskList';

export default function InboxScreen() {
  const dispatch = useDispatch();
  // We're retrieving the error field from our updated store
  const { error } = useSelector((state) => state.taskbox);
  // The useEffect triggers the data fetching when the component is mounted
  useEffect(() => {
    dispatch(fetchTasks());
  }, []);

  if (error) {
    return (
      <div className="page lists-show">
        <div className="wrapper-message">
          <span className="icon-face-sad" />
          <p className="title-message">Oh no!</p>
          <p className="subtitle-message">Something went wrong</p>
        </div>
      </div>
    );
  }
  return (
    <div className="page lists-show">
      <nav>
        <h1 className="title-page">Taskbox</h1>
      </nav>
      <TaskList />
    </div>
  );
}
```

También tenemos que cambiar nuestro componente `App` para renderizar la pantalla `InboxScreen` (al final usaríamos un router para elegir la pantalla correcta, pero no nos preocupemos por ello aquí):

```diff:title=src/App.js
- import logo from './logo.svg';
- import './App.css';
+ import './index.css';
+ import store from './lib/store';

+ import { Provider } from 'react-redux';
+ import InboxScreen from './components/InboxScreen';

function App() {
  return (
-   <div className="App">
-     <header className="App-header">
-       <img src={logo} className="App-logo" alt="logo" />
-       <p>
-         Edit <code>src/App.js</code> and save to reload.
-       </p>
-       <a
-         className="App-link"
-         href="https://reactjs.org"
-         target="_blank"
-         rel="noopener noreferrer"
-       >
-         Learn React
-       </a>
-     </header>
-   </div>
+   <Provider store={store}>
+     <InboxScreen />
+   </Provider>
  );
}
export default App;
```

Sin embargo, donde las cosas se ponen interesantes es en la renderización de la historia en Storybook.

Como vimos anteriormente, el componente `TaskList` ahora es un **contenedor** que depende de un store de Redux para renderizar las tareas. Como `InboxScreen` también es un componente contenedor, haremos algo similar y proporcionaremos un store a la historia. Entonces cuando configuramos nuestras historias en `InboxScreen.stories.js`:

```js:title=src/components/InboxScreen.stories.js
import React from 'react';

import InboxScreen from './InboxScreen';
import store from '../lib/store';

import { Provider } from 'react-redux';

export default {
  component: InboxScreen,
  title: 'InboxScreen',
  decorators: [(story) => <Provider store={store}>{story()}</Provider>],
};

const Template = () => <InboxScreen />;

export const Default = Template.bind({});
export const Error = Template.bind({});
```

Podemos detectar rápidamente un problema con la historia de `error`. En lugar de mostrar el estado correcto, muestra una lista de tareas. Una formar de evitar este problema sería proporcionar una versión simulada para cada estado, similar a lo que hicimos en el último capítulo. En lugar de esto, utilizaremos una conocida librería de simulación de API junto con un complemento de Storybook para ayudarnos a resolver este problema.

![Broken inbox screen state](/intro-to-storybook/broken-inbox-error-state-optimized.png)

## Simulación de servicios de API

Ya que nuestra aplicación es bastante sencilla y no depende mucho en llamadas APIs remotas vamos a utilizar [Mock Service Worker](https://mswjs.io/) y el [complemento de Storybook "MSW"](https://storybook.js.org/addons/msw-storybook-addon). Mock Service Worker es una librería de simulación de API. Depende de Service Workers para capturar solicitudes de red y proporciona datos simulados en las respuestas.

Cuando configuramos nuestra aplicación en [la sección Empezando](/intro-to-storybook/react/es/get-started) se instalaron ambos paquetes. Solo queda configurarlos y actualizar nuestras historias para usarlos.

En tu terminal, ejecuta el siguiente comando para generar un Service Worker genérico dentro de tu carpeta `public`:

```shell
yarn init-msw
```

Luego, necesitamos actualizar nuestro `.storybook/preview.js` e inicializarlos:

```diff:title=.storybook/preview.js
import '../src/index.css';

+ // Registers the msw addon
+ import { initialize, mswDecorator } from 'msw-storybook-addon';

+ // Initialize MSW
+ initialize();

+ // Provide the MSW addon decorator globally
+ export const decorators = [mswDecorator];

//👇 Configures Storybook to log the actions( onArchiveTask and onPinTask ) in the UI.
export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
};
```

Por último, actualiza las historias `InboxScreen` y incluye un [parámetro](https://storybook.js.org/docs/react/writing-stories/parameters) que simula las llamadas API remotas:

```diff:title=src/components/InboxScreen.stories.js
import React from 'react';

import InboxScreen from './InboxScreen';
import store from '../lib/store';
+ import { rest } from 'msw';
+ import { MockedState } from './TaskList.stories';
import { Provider } from 'react-redux';

export default {
  component: InboxScreen,
  title: 'InboxScreen',
  decorators: [(story) => <Provider store={store}>{story()}</Provider>],
};

const Template = () => <InboxScreen />;

export const Default = Template.bind({});
+ Default.parameters = {
+   msw: {
+     handlers: [
+       rest.get(
+         'https://jsonplaceholder.typicode.com/todos?userId=1',
+         (req, res, ctx) => {
+           return res(ctx.json(MockedState.tasks));
+         }
+       ),
+     ],
+   },
+ };

export const Error = Template.bind({});
+ Error.parameters = {
+   msw: {
+     handlers: [
+       rest.get(
+         'https://jsonplaceholder.typicode.com/todos?userId=1',
+         (req, res, ctx) => {
+           return res(ctx.status(403));
+         }
+       ),
+     ],
+   },
+ };
```

<div class="aside">
💡 Aparte, otro enfoque viable sería pasar datos a la jerarquía, especialmente cuando se usa <a href="http://graphql.org/">GraphQL</a>. Es como hemos construido <a href="https://www.chromatic.com/?utm_source=storybook_website&utm_medium=link&utm_campaign=storybook">Chromatic</a> junto con más de 800 historias.
</div>

Revisa tu Storybook y vas a ver que la historia de `error` está funcionando. MSW interceptó nuestra llamada API remota y proporcionó la respuesta adecuada.

<video autoPlay muted playsInline loop>
  <source
    src="/intro-to-storybook/inbox-screen-with-working-msw-addon-optimized.mp4"
    type="video/mp4"
  />
</video>

## Pruebas de interacción

Hasta ahora, hemos podido crear una aplicación completamente funcional desde cero, empezando desde un componente simple hasta una pantalla y probando continuamente cada cambio usando nuestras historias. Pero cada nueva historia también requiere una verificación manual de todas las demás historias para asegurar que la interfaz de usuario no se rompa. Eso es mucho trabajo extra.

¿No podemos automatizar este flujo de trabajo y probar las interacciones de nuestros componentes automáticamente?

### Escribe una prueba de interacción usando la función "play"

Una función [`play`](https://storybook.js.org/docs/react/writing-stories/play-function) de Storybook y [`@storybook/addon-interactions`](https://storybook.js.org/docs/react/writing-tests/interaction-testing) nos ayuda con esto. Una función `play` incluye pequeños fragmentos de código que se ejecutan después de que se renderiza la historia.

La función play nos ayuda a verificar lo que sucede a la interfaz de usuario cuando se actualizan las tareas. Usa APIs del DOM que son "framework-agnostic", lo que significa que podemos escribir historias con la función play para interactuar con la interfaz de usuario y simular el comportamiento humano sin importar el framework del frontend.

`@storybook/addon-interactions` nos ayuda a visualizar nuestras pruebas en Storybook, dando un flujo paso a paso. También ofrece un práctico conjunto de controles de IU para pausar, continuar, retroceder y pasar paso a paso cada interacción.

Veámoslo en acción! Actualiza tu historia `InboxScreen` recién creada y configura las interacciones de componentes agregando lo siguiente:

```diff:title=src/components/InboxScreen.stories.js
import React from 'react';

import InboxScreen from './InboxScreen';

import store from '../lib/store';
import { rest } from 'msw';
import { MockedState } from './TaskList.stories';
import { Provider } from 'react-redux';

+ import {
+  fireEvent,
+  within,
+  waitFor,
+  waitForElementToBeRemoved
+ } from '@storybook/testing-library';

export default {
  component: InboxScreen,
  title: 'InboxScreen',
  decorators: [(story) => <Provider store={store}>{story()}</Provider>],
};

const Template = () => <InboxScreen />;

export const Default = Template.bind({});
Default.parameters = {
  msw: {
    handlers: [
      rest.get(
        'https://jsonplaceholder.typicode.com/todos?userId=1',
        (req, res, ctx) => {
          return res(ctx.json(MockedState.tasks));
        }
      ),
    ],
  },
};

+ Default.play = async ({ canvasElement }) => {
+   const canvas = within(canvasElement);
+   // Waits for the component to transition from the loading state
+   await waitForElementToBeRemoved(await canvas.findByTestId('loading'));
+   // Waits for the component to be updated based on the store
+   await waitFor(async () => {
+     // Simulates pinning the first task
+     await fireEvent.click(canvas.getByLabelText('pinTask-1'));
+     // Simulates pinning the third task
+     await fireEvent.click(canvas.getByLabelText('pinTask-3'));
+   });
+ };

export const Error = Template.bind({});
Error.parameters = {
  msw: {
    handlers: [
      rest.get(
        'https://jsonplaceholder.typicode.com/todos?userId=1',
        (req, res, ctx) => {
          return res(ctx.status(403));
        }
       ),
    ],
  },
};
```

Revisa la historia `Default`. Haz click en el panel de `Interactions` para ver la lista de interacciones dentro de la función play de la historia.

<video autoPlay muted playsInline loop>
  <source
    src="/intro-to-storybook/storybook-interactive-stories-play-function-6-4.mp4"
    type="video/mp4"
  />
</video>

### Automatizar pruebas con el corredor de pruebas

Con la función de `play` de Storybook, pudimos eludir nuestro problema, permitiéndonos interactuar con nuestra interfaz de usuario y verificar rápidamente cómo responde si actualizamos nuestras tareas, manteniendo la interfaz de usuario consistente sin ningún esfuerzo manual adicional.

Pero, si miramos a Storybook más a fondo, podemos ver que solo ejecuta las pruebas de interacción al ver la historia. Por lo tanto, todavía tendríamos que revisar cada historia para ejecutar todas los checks si hacemos un cambio. ¿No podríamos automatizarlo?

La buena noticia es que podemos! El [corredor de prueba](https://storybook.js.org/docs/react/writing-tests/test-runner) de Storybook nos permite hacer precisamente eso. Es una utilidad independiente accionado por [Playwright](https://playwright.dev/) que ejecuta todas nuestras pruebas de interacciones y detecta historias rotas.

Vamos a ver cómo funciona. Ejecuta el siguiente comando para instalarlo:

```shell
yarn add --dev @storybook/test-runner
```

Luego, actualiza tu `package.json` `scripts` y añade una nueva tarea de prueba:

```json:clipboard=false
{
  "scripts": {
    "test-storybook": "test-storybook"
  }
}
```

Por último, con Storybook corriendo, abre una nueva ventana de teminal y ejecuta el siguiente comando:

```shell
yarn test-storybook --watch
```

<div class="aside">
💡 Las pruebas de interacción con la función play son una forma fantástica para probar los componentes de la interfaz de usuario. Puede hacer mucho más de lo que hemos visto aquí. Recomendamos leer la <a href="https://storybook.js.org/docs/react/writing-tests/interaction-testing">documentación oficial</a> para aprender más al respecto.
<br />
Para profundizar aún más en las pruebas, puedes mirar el <a href="/ui-testing-handbook">Manual de pruebas</a>. Cubre las estrategias de prueba utilizadas por los equipos de front-end escalados para potenciar tu flujo de trabajo de desarrollo.
</div>

![Storybook test runner successfully runs all tests](/intro-to-storybook/storybook-test-runner-execution.png)

Éxito! Ahora tenemos una herramienta que nos ayuda a verificar si todas nuestras historias se renderizan sin errores y si todas las afirmaciones pasan automáticamente. Además, si una prueba falla, nos proporcionará un enlace en que abre la historia fallida en el navegador.

## Desarrollo basado en componentes

Empezamos desde abajo con `Task`, luego progresamos a `TaskList`, ahora estamos aquí con una interfaz de usuario de pantalla completa. Nuestra `InboxScreen` contiene un componente de contenedor anidado e incluye historias de acompañamiento.

<video autoPlay muted playsInline loop style="width:480px; height:auto; margin: 0 auto;">
  <source
    src="/intro-to-storybook/component-driven-development-optimized.mp4"
    type="video/mp4"
  />
</video>

[**El desarrollo basado en componentes (CDD)**](https://www.componentdriven.org/) te permite expandir gradualmente la complejidad a medida que asciendes en la jerarquía de componentes. Entre los beneficios están un proceso de desarrollo más enfocado y una mayor cobertura de todas las posibles mutaciones de la interfaz de usuario. En resumen, el CDD te ayuda a construir interfaces de usuario de mayor calidad y complejidad.

Aún no hemos terminado, el trabajo no termina cuando se construye la interfaz de usuario. También tenemos que asegurarnos de que siga siendo duradero a lo largo del tiempo.

<div class="aside">
💡 No olvides hacer commit para guardar tus cambios con git!
</div>
