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

We'll start by updating our Redux store (in `src/lib/store.js`) to connect to a remote API and handle the various states for our application (i.e., `error`, `succeeded`):

Empezamos actualizando nuestro store de Redux (en `src/lib/store.js`) para conectar a una API remota y manejar los diversos estados de nuestra aplicación (es decir, `error`, `succeeded`):

```diff:title=src/lib/store.js
/* Una implementación simple de store/actions/reducer de Redux.
 * Una verdadera aplicación sería más compleja y estaría separada en diferentes archivos.
 */
import {
  configureStore,
  createSlice,
+ createAsyncThunk,
} from '@reduxjs/toolkit';
/*
 * El estado inicial de nuestro store cuando se carga la aplicacion.
 * Normalmente, obtendría esto de un servidor. No nos preocupemos por eso ahora.
 */
const TaskBoxData = {
  tasks: [],
  status: "idle",
  error: null,
};
/*
 * Crea un asyncThunk para recuperar tareas desde un endpoint remoto.
 * Puedes leer más sobre thunks de Redux Toolskit en la documentación:
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
 * El store se crea aquí
 * Puedes leer mas sobre slices de Redux Toolkit en la documentación:
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
   * Extiende el reducer para las acciones async
   * Puedes leer más sobre esto en https://redux-toolkit.js.org/api/createAsyncThunk
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

Ahora que hemos actualizado nuestro store para recuperar datos de un endpoint de una API remota y lo hemos preparado para manejar los diversos estados de nuestra aplicación, vamos a crear nuestro `InboxScreen.js` en el directorio `src/components`:

```js:title=src/components/InboxScreen.js
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTasks } from '../lib/store';
import TaskList from './TaskList';
export default function InboxScreen() {
  const dispatch = useDispatch();
  // Estamos recuperando el campo de error de nuestro store actualizado
  const { error } = useSelector((state) => state.taskbox);
  // El useEffect activa la obtención de datos cuando se monta el componente.
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


También tenemos que cambiar nuestro component `App` para renderizar la pantalla `InboxScreen` (al final usaríamos un router para elegir la pantalla correcta, pero no nos preocupemos por ello aquí):

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

Como vimos anteriormente, el componente `TaskList` ahora es un **contenedor** que depende de un store de Redux para renderizar las tareas. Ya que `InboxScreen` también en un componente contenedor haremos algo similar y proporcionamos un store a la historia. Entonces cuando configuramos nuestras historias en `InboxScreen.stories.js`:

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

We can quickly spot an issue with the `error` story. Instead of displaying the right state, it shows a list of tasks. One way to sidestep this issue would be to provide a mocked version for each state, similar to what we did in the last chapter. Instead, we'll use a well-known API mocking library alongside a Storybook addon to help us solve this issue.

Podemos detectar rápidamente un problema con la historia de `error`. En lugar de mostrar el estado correcto, muestra una lista de tareas. Una formar de evitar este problema sería proporcionar una versión mockeada para cada estado, similar a lo que hicimos en el último capítulo. En lugar de esto, utilizaremos una conocida librería de simulación de API junto con un addon de Storybook para ayudarnos a resolver este problema.

![Broken inbox screen state](/intro-to-storybook/broken-inbox-error-state-optimized.png)

## Simulación de servicios de API


___





Al colocar la "Lista de tareas" `TaskList` en Storybook, pudimos esquivar este problema simplemente renderizando la `PureTaskList` y evadiendo el contenedor. Haremos algo similar y renderizaremos la `PureInboxScreen` en Storybook también.

Sin embargo, para la `PureInboxScreen` tenemos un problema porque aunque la `PureInboxScreen` en si misma es presentacional, su hijo, la `TaskList`, no lo es. En cierto sentido la `PureInboxScreen` ha sido contaminada por la "contenedorización". Así que cuando preparamos nuestras historias:

```js:title=src/components/screens/TaskListScreen.stories.js
import React from 'react';
import { storiesOf } from '@storybook/react';

import { PureInboxScreen } from './InboxScreen';

storiesOf('InboxScreen', module)
  .add('default', () => <PureInboxScreen />)
  .add('error', () => <PureInboxScreen error="Something" />);
```

Vemos que aunque la historia de `error` funciona bien, tenemos un problema en la historia `default`, porque la `TaskList` no tiene una store de Redux a la que conectarse. (También encontrarás problemas similares cuando intentes probar la `PureInboxScreen` con un test unitario).

![Broken inbox](/intro-to-storybook/broken-inboxscreen.png)

Una forma de evitar este problema es nunca renderizar componentes contenedores en ninguna parte de tu aplicación excepto en el nivel más alto y en su lugar pasar todos los datos requeridos bajo la jerarquía de componentes.

Sin embargo, los desarrolladores **necesitarán** inevitablemente renderizar los contenedores más abajo en la jerarquía de componentes. Si queremos renderizar la mayor parte o la totalidad de la aplicación en Storybook (¡lo hacemos!), necesitamos una solución a este problema.

<div class="aside">
Por otro lado, la transmisión de datos a nivel jerárquico es un enfoque legítimo, especialmente cuando utilizas <a href="http://graphql.org/">GraphQL</a>. Así es como hemos construido <a href="https://www.chromatic.com/?utm_source=storybook_website&utm_medium=link&utm_campaign=storybook">Chromatic</a> junto a más de 800+ historias.
</div>

## Suministrando contexto con decoradores

La buena noticia es que es fácil suministrar una store de Redux a la `InboxScreen` en una historia! Podemos usar una versión mockeada de la store de Redux provista en un decorador:

```js:title=src/components/screens/TaskListScreen.stories.js
import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { Provider } from 'react-redux';

import { PureInboxScreen } from './InboxScreen';
import { defaultTasks } from './TaskList.stories';

// Un mock super simple de un store de redux
const store = {
  getState: () => {
    return {
      tasks: defaultTasks,
    };
  },
  subscribe: () => 0,
  dispatch: action('dispatch'),
};

storiesOf('InboxScreen', module)
  .addDecorator((story) => <Provider store={store}>{story()}</Provider>)
  .add('default', () => <PureInboxScreen />)
  .add('error', () => <PureInboxScreen error="Something" />);
```

Existen enfoques similares para proporcionar un contexto simulado para otras bibliotecas de datos, tales como [Apollo](https://www.npmjs.com/package/apollo-storybook-decorator), [Relay](https://github.com/orta/react-storybooks-relay-container) y algunas otras.

Recorrer los estados en Storybook hace que sea fácil comprobar que lo hemos hecho correctamente:

<video autoPlay muted playsInline loop >

  <source
    src="/intro-to-storybook/finished-inboxscreen-states.mp4"
    type="video/mp4"
  />
</video>

## Desarrollo basado en componentes

Empezamos desde abajo con `Task`, luego progresamos a `TaskList`, ahora estamos aquí con una interfaz de usuario de pantalla completa. Nuestra `InboxScreen` contiene un componente de contenedor anidado e incluye historias de acompañamiento.

<video autoPlay muted playsInline loop style="width:480px; height:auto; margin: 0 auto;">
  <source
    src="/intro-to-storybook/component-driven-development-optimized.mp4"
    type="video/mp4"
  />
</video>

[**El desarrollo basado en componentes**](https://www.componentdriven.org/) te permite expandir gradualmente la complejidad a medida que asciendes en la jerarquía de componentes. Entre los beneficios están un proceso de desarrollo más enfocado y una mayor cobertura de todas las posibles mutaciones de la interfaz de usuario. En resumen, la CDD te ayuda a construir interfaces de usuario de mayor calidad y complejidad.

Aún no hemos terminado, el trabajo no termina cuando se construye la interfaz de usuario. También tenemos que asegurarnos de que siga siendo duradero a lo largo del tiempo.
