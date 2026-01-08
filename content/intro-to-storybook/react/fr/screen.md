---
title: 'Construire un écran'
tocTitle: 'Écrans'
description: 'Construire un écran à partir de composants'
commit: '12a7932'
---

Nous nous sommes concentrés sur la création d'une UI de bas en haut, en commençant simplement et en ajoutant de la complexité. Cela nous a permis de développer chaque composant séparément, de déterminer ses besoins en données et de jouer avec dans Storybook. Tout cela sans avoir besoin de mettre en place un serveur ou de construire des écrans!

Dans ce chapitre, nous continuons à accroître la sophistication en combinant des composants dans un écran et en développant cet écran dans Storybook.

## Composants connectés

Comme notre application est très simple, l'écran que nous allons construire est assez trivial, nous allons récupérer la donnée à partir d'une API, utiliser le composant `TaskList` (qui récupère ses propres données de Redux) puis développer un champ venant de Redux.

Nous allons commencer par mettre à jour notre store Redux (dans `src/lib/store.js`) pour connecter l'API and gérer les différents états pour notre application (ici `error`, `succeeded`):

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

Maintenant que nous avons mis à jour notre store pour récupérer les données de l'API et que nous gérons les différents états de notre application, nous pouvons créer `InboxScreen.jsx` dans le dossier `src/components`:

```jsx:title=src/components/InboxScreen.jsx
import { useEffect } from 'react';

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

Nous avons aussi besoin de changer le composant `App` pour rendre le `InboxScreen` (nous utiliserons à la fin un routeur pour choisir le bon écran, mais ne nous inquiétons pas de cela ici):

```diff:title=src/App.jsx
- import { useState } from 'react'
- import reactLogo from './assets/react.svg'
- import viteLogo from '/vite.svg'
- import './App.css'

+ import './index.css';
+ import store from './lib/store';

+ import { Provider } from 'react-redux';
+ import InboxScreen from './components/InboxScreen';

function App() {
- const [count, setCount] = useState(0)
  return (
-   <div className="App">
-     <div>
-       <a href="https://vitejs.dev" target="_blank">
-         <img src={viteLogo} className="logo" alt="Vite logo" />
-       </a>
-       <a href="https://reactjs.org" target="_blank">
-         <img src={reactLogo} className="logo react" alt="React logo" />
-       </a>
-     </div>
-     <h1>Vite + React</h1>
-     <div className="card">
-       <button onClick={() => setCount((count) => count + 1)}>
-         count is {count}
-       </button>
-       <p>
-         Edit <code>src/App.jsx</code> and save to test HMR
-       </p>
-     </div>
-     <p className="read-the-docs">
-       Click on the Vite and React logos to learn more
-     </p>
-   </div>
+   <Provider store={store}>
+     <InboxScreen />
+   </Provider>
  );
}
export default App;
```

Cependant, c'est dans le rendu de la story dans Storybook que les choses deviennent intéressantes.

Comme nous l'avons vu précédemment, le composant `TaskList` est un composant **connecté** et se fonde sur le store Redux pour rendre ses tâches. Comme `InboxScreen` est aussi un composant connecté, nous allons faire un travail similaire et fournir un store à la story. Voici comment rendre les stories dans `InboxScreen.stories.jsx`:

```jsx:title=src/components/InboxScreen.stories.jsx
import InboxScreen from './InboxScreen';
import store from '../lib/store';

import { Provider } from 'react-redux';

export default {
  component: InboxScreen,
  title: 'InboxScreen',
  decorators: [(story) => <Provider store={store}>{story()}</Provider>],
  tags: ['autodocs'],
};

export const Default = {};

export const Error = {};
```

Nous pouvons constater une erreur dans la story de `error`. Au lieu d'afficher le bon état, il montre une liste de tâches. Une manière de corriger ce problème est de fournir une version simulée (qu'on appelle un "mock") de chaque étape, comme nous avons fait dans le chapitre précédent. Ici, pour nous aider à corriger cette erreur, nous allons utiliser une librairie de simulation d'API bien connue, grâce à un addon de Storybook.

![Boîte de réception non opérationnelle](/intro-to-storybook/broken-inbox-error-state-optimized.png)

## Simuler les services de l'API

Comme notre application est assez simpliste et ne dépend pas trop des appels à des API, nous allons utiliser [Mock Service Worker](https://mswjs.io/) et [Storybook's MSW addon](https://storybook.js.org/addons/msw-storybook-addon). Mock Service Worker est une librairie de simulation d'API. Il se repose sur les service workers pour capturer les appels faits au réseau et fournir des données simulées en réponse.

Quand nous avons initialisé notre application dans [Débuter](/intro-to-storybook/react/fr/get-started/), ces deux librairies ont été installées. Il reste alors à les configurer et mettre à jour nos stories pour les utiliser.

Dans votre terminal, exécutez les commandes suivants pour générer un service worker générique à l'intérieur du dossier `public`:

```shell
yarn init-msw
```

Ensuite, nous devons mettre à jour `.storybook/preview.js` et les initialiser:

```diff:title=.storybook/preview.js
import '../src/index.css';

// Registers the msw addon
+ import { initialize, mswLoader } from 'msw-storybook-addon';

// Initialize MSW
+ initialize();

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
+ loaders: [mswLoader],
};

export default preview;
```

Enfin, mettez à jour les stories de `InboxScreen` en incluant un [paramètre](https://storybook.js.org/docs/react/writing-stories/parameters) qui simule les appels à l'API:

```diff:title=src/components/InboxScreen.stories.jsx
import InboxScreen from './InboxScreen';

import store from '../lib/store';

+ import { http, HttpResponse } from 'msw';

+ import { MockedState } from './TaskList.stories';

import { Provider } from 'react-redux';

export default {
  component: InboxScreen,
  title: 'InboxScreen',
  decorators: [(story) => <Provider store={store}>{story()}</Provider>],
  tags: ['autodocs'],
};

export const Default = {
+ parameters: {
+   msw: {
+     handlers: [
+       http.get('https://jsonplaceholder.typicode.com/todos?userId=1', () => {
+         return HttpResponse.json(MockedState.tasks);
+       }),
+     ],
+   },
+ },
};

export const Error = {
+ parameters: {
+   msw: {
+     handlers: [
+       http.get('https://jsonplaceholder.typicode.com/todos?userId=1', () => {
+         return new HttpResponse(null, {
+           status: 403,
+         });
+       }),
+     ],
+   },
+ },
};
```

<div class="aside">

💡 En complément, une autre approche valable serait de passer la donnée à travers la hiérarchie des composants, d'autant plus si vous utilisez [GraphQL](http://graphql.org/). C'est comment nous avons construit [Chromatic](https://www.chromatic.com/?utm_source=storybook_website&utm_medium=link&utm_campaign=storybook) à travers plus de 800 stories.

</div>

Regardez votre Storybook, et vous verrez que la story `error` fonctionne dorénavant comme prévue. MSW a intercepté notre appel à l'API et a fourni la réponse adéquate.

<video autoPlay muted playsInline loop>
  <source
    src="/intro-to-storybook/inbox-screen-with-working-msw-addon-optimized-7.0.mp4"
    type="video/mp4"
  />
</video>

## Tests des composants

Jusque là, nous avons été capable de construire une application fonctionnelle, en construisant de simples composants jusqu'à un écran, en testant continuellement les changements grâce à nos stories. Mais chaque nouvelle story nécessite aussi une vérification manuelle sur les autres stories, pour s'assurer que l'interface utilisateur n'a pas été changé. Ceci donne beaucoup de travail supplémentaire.

Ne pouvons-nous pas automatiser ce flux et tester nos interactions entre les composants de manière automatique?

### Écrire un test de composant en utilisant la fonction play

La fonction [`play`](https://storybook.js.org/docs/writing-stories/play-function) de Storybook et [`@storybook/addon-interactions`](https://storybook.js.org/docs/writing-tests/component-testing) nous aident avec cela. Une fonction play inclut de petits extraits de code qui s'exécutent après le rendu de la story.

La fonction play nous aide à vérifier les changements d'UI quand les tâches sont mises à jour. Elle utilise les API du DOM, agnostiques du type de librairie utilisé, ce qui signifie que nous pouvons écrire des stories avec cette fonction pour interagir avec l'UI et simuler des actions utilisateurs, quelque soit la librarie front utilisée.

L'addon `@storybook/addon-interactions` nous aide à visualiser nos tests dans Storybook, en fournissant un flux étape par étape. Il offre aussi un ensemble de contrôles de l'UI, comme pause, recommencer, revenir en arrière, et parcourir chaque intéraction.

Regardons cela! Mettez à jour votre nouvelle story `InboxScreen`, et créer les interactions avec le composant en ajoutant le code suivant:

```diff:title=src/components/InboxScreen.stories.jsx
import InboxScreen from './InboxScreen';

import store from '../lib/store';

import { http, HttpResponse } from 'msw';

import { MockedState } from './TaskList.stories';

import { Provider } from 'react-redux';

+ import {
+  fireEvent,
+  waitFor,
+  within,
+  waitForElementToBeRemoved
+ } from '@storybook/test';

export default {
  component: InboxScreen,
  title: 'InboxScreen',
  decorators: [(story) => <Provider store={store}>{story()}</Provider>],
  tags: ['autodocs'],
};

export const Default = {
  parameters: {
    msw: {
      handlers: [
        http.get('https://jsonplaceholder.typicode.com/todos?userId=1', () => {
          return HttpResponse.json(MockedState.tasks);
        }),
      ],
    },
  },
+ play: async ({ canvasElement }) => {
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
+ },
};

export const Error = {
  parameters: {
    msw: {
      handlers: [
        http.get('https://jsonplaceholder.typicode.com/todos?userId=1', () => {
          return new HttpResponse(null, {
            status: 403,
          });
        }),
      ],
    },
  },
};
```

<div class="aside">

💡 Le package `@storybook/test` remplace les packages de test `@storybook/jest` et `@storybook/testing-library`, offrant une taille de bundle plus petite et une API plus simple basée sur le package [Vitest](https://vitest.dev/).

</div>

Regardez la story `Default` . Cliquer sur le section `Interactions` pour voir la liste des interactions de votre fonction play de votre story.

<video autoPlay muted playsInline loop>
  <source
    src="/intro-to-storybook/storybook-interactive-stories-play-function-7-0.mp4"
    type="video/mp4"
  />
</video>

### Automatiser les tests avec le lanceur de tests

Avec la fonction play de Storybook, nous sommes capables de répondre à notre problème, en interagissant avec l'UI et rapidement regarder les impacts sur l'interface utilisateur quand nous mettons à jour les tâches.

Mais si nous regardons de plus près notre Storybook,les tests d'interactions ne se lancent que quand nous regardons la story. Ainsi, nous devons toujours revenir sur chaque story dès que nous faisons un changement. Ne pourrions-nous pas automatiser cela?

La bonne nouvelle est que nous pouvons! Le [lanceur de test](https://storybook.js.org/docs/react/writing-tests/test-runner) de Storybook nous permet de faire cela. Il s'agit d'un outil lancé par [Playwright](https://playwright.dev/) — qui lance tous les tests d'interactions et reconnait les stories qui ont été cassées.

Regardons comment cela marche! Lancez la commande suivante et installez la librarie:

```shell
yarn add --dev @storybook/test-runner
```

Ensuite, mettez à jour `package.json`, section `scripts` et ajouter une nouvelle tâche de test:

```json:clipboard=false
{
  "scripts": {
    "test-storybook": "test-storybook"
  }
}
```

Enfin, avec votre Storybook lancé, ouvrez un terminal et lancez la commande suivante:

```shell
yarn test-storybook --watch
```

<div class="aside">

💡 Les tests d'interactions avec la fonction play sont une manière fantastique de tester vos composants d'UI. Ils peuvent faire plein plus que ce que nous avons parcouru. Nous vous encourageons à lire la [documentation officielle](https://storybook.js.org/docs/writing-tests/component-testing) pour en savoir plus.

Pour creuser encore plus les tests, vous pouvez lire le [Guide des Tests](/ui-testing-handbook/). Il agrège les stratégies de tests utilisées par les équipes front reconnues afin de vous faire accélérer votre flux de développement.

</div>

![Le lanceur de test Storybook a lancé tous les tests](/intro-to-storybook/storybook-test-runner-execution.png)

Félicitations! Maintenant nous avons un outil qui nous aide à vérifier si nos stories sont lancées sans erreurs et de manière automatique. De plus, si un test casse, il nous fournira un lien qui ouvre la story cassée dans un navigateur.

## Component-Driven Development

Nous avons commencé du bas avec une `Task`, puis progressé avec `TaskList`, et maintenant nous avons un écran entier. Notre `InboxScreen` utilisent des composants connectés avec leur stories associées.

<video autoPlay muted playsInline loop style="width:480px; height:auto; margin: 0 auto;">
  <source
    src="/intro-to-storybook/component-driven-development-optimized.mp4"
    type="video/mp4"
  />
</video>

[**Le Component-Driven Development**](https://www.componentdriven.org/) vous permet d'accroître progressivement la complexité à mesure que vous montez dans la hiérarchie des composants. Parmi les avantages, citons un processus de développement plus ciblé et une couverture accrue de toutes les permutations possibles de l'UI. En bref, le CDD vous aide à construire des interfaces utilisateur de meilleure qualité et plus complexes.

Nous n'avons pas encore terminé - le travail ne s'arrête pas à la construction de l'UI. Nous devons également veiller à ce qu'elle reste durable dans le temps.

<div class="aside">
💡 N'oubliez pas de commiter vos changements avec git !
</div>
