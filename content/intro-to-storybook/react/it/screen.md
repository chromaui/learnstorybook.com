---
title: 'Costruisci una schermata'
tocTitle: 'Schermate'
description: 'Costruisci una schermata da componenti'
commit: 'bb2471f'
---

Ci siamo concentrati sulla costruzione di interfacce utente dal basso verso l'alto, partendo da piccole e aggiungendo complessità. Farlo ci ha permesso di sviluppare ogni componente in isolamento, capire le sue esigenze di dati e giocare con esso in Storybook. Tutto senza dover avviare un server o costruire schermate!

In questo capitolo, continuiamo ad aumentare la sofisticatezza combinando i componenti in una schermata e sviluppando quella schermata in Storybook.

## Schermate collegate

Poiché la nostra app è semplice, la schermata che costruiremo è piuttosto banale, semplicemente recuperando dati da un'API remota, avvolgendo il componente `TaskList` (che fornisce i propri dati da Redux) e tirando fuori un campo `error` di livello superiore da Redux.

Inizieremo aggiornando il nostro Redux store (in `src/lib/store.js`) per connettersi a un'API remota e gestire i vari stati per la nostra applicazione (cioè, `error`, `succeeded`):

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
  status: 'idle',
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

Ora che abbiamo aggiornato il nostro store per recuperare i dati da un endpoint API remoto e lo abbiamo preparato per gestire i vari stati della nostra app, creiamo il nostro `InboxScreen.jsx` nella directory `src/components`:

```jsx:title=src/components/InboxScreen.jsx
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

Dovremo anche modificare il nostro componente `App` per renderizzare `InboxScreen`. Alla fine, useremmo un router per scegliere la schermata corretta, ma non preoccupiamoci di questo ora.

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

Tuttavia, le cose diventano interessanti quando si tratta di renderizzare la storia in Storybook.

Come abbiamo visto in precedenza, il componente `TaskList` è ora un componente **connesso** e si basa su un Redux store per renderizzare i task. Poiché anche il nostro `InboxScreen` è un componente connesso, faremo qualcosa di simile e forniremo uno store alla storia. Quindi, quando impostiamo le nostre storie in `InboxScreen.stories.js`:

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

Possiamo rapidamente individuare un problema con la storia dell'`errore`. Invece di mostrare il giusto stato, mostra una lista di task. Un modo per aggirare questo problema sarebbe fornire una versione simulata per ciascuno stato, simile a quanto abbiamo fatto nel capitolo precedente. Invece, useremo una nota libreria di mocking delle API insieme a un addon di Storybook per aiutarci a risolvere questo problema.

![Stato schermata inbox rotta](/intro-to-storybook/broken-inbox-error-state-7-0-optimized.png)

## Simulazione dei Servizi API

Poiché la nostra applicazione è piuttosto semplice e non dipende troppo dalle chiamate API remote, useremo [Mock Service Worker](https://mswjs.io/) e [l'addon MSW di Storybook](https://storybook.js.org/addons/msw-storybook-addon). Mock Service Worker è una libreria di mocking delle API. Si basa sui service worker per catturare le richieste di rete e fornire dati simulati nelle risposte.

Quando abbiamo impostato la nostra app nella [sezione Introduzione](/intro-to-storybook/react/en/get-started), entrambi i pacchetti sono stati anche installati. Tutto ciò che rimane è configurarli e aggiornare le nostre storie per utilizzarli.

Nel tuo terminale, esegui il seguente comando per generare un service worker generico all'interno della tua cartella `public`:

```shell
yarn init-msw
```

Successivamente, dovremo aggiornare il nostro file `.storybook/preview.js` e inizializzare le librerie:

```diff:title=.storybook/preview.js
import '../src/index.css';

+ // Registers the msw addon
+ import { initialize, mswDecorator } from 'msw-storybook-addon';

+ // Initialize MSW
+ initialize();

//👇 Configures Storybook to log the actions( onArchiveTask and onPinTask ) in the UI.
/** @type { import('@storybook/react').Preview } */
const preview = {
+ decorators: [mswDecorator],
  parameters: {
    actions: { argTypesRegex: "^on[A-Z].*" },
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

Infine, aggiorna le storie di `InboxScreen` e includi un [parametro](https://storybook.js.org/docs/react/writing-stories/parameters) che simula le chiamate API remote:

```diff:title=src/components/InboxScreen.stories.jsx
import InboxScreen from './InboxScreen';
import store from '../lib/store';
+ import { rest } from 'msw';
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
+       rest.get(
+         'https://jsonplaceholder.typicode.com/todos?userId=1',
+         (req, res, ctx) => {
+           return res(ctx.json(MockedState.tasks));
+         }
+       ),
+     ],
+   },
+ },
};
export const Error = {
+ parameters: {
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
+ },
};
```

<div class="aside">
💡 Come suggerimento aggiuntivo, un altro approccio valido sarebbe quello di passare i dati lungo la gerarchia, specialmente quando si utilizza <a href="http://graphql.org/">GraphQL</a>. È così che abbiamo costruito <a href="https://www.chromatic.com/?utm_source=storybook_website&utm_medium=link&utm_campaign=storybook">Chromatic</a> insieme a più di 800 storie.
</div>

Controlla il tuo Storybook e vedrai che la storia `error` ora funziona come previsto. MSW ha intercettato la nostra chiamata API remota e fornito la risposta appropriata.

<video autoPlay muted playsInline loop>
  <source
    src="/intro-to-storybook/inbox-screen-with-working-msw-addon-optimized-7.0.mp4"
    type="video/mp4"
  />
</video>

## Test sulle interazioni

Finora, siamo stati in grado di costruire un'applicazione completamente funzionale partendo da zero, iniziando da un semplice componente fino ad arrivare a una schermata, testando continuamente ogni modifica con le nostre storie. Ma ogni nuova storia richiede anche un controllo manuale su tutte le altre storie per assicurarsi che l'interfaccia utente non si rompa. È un sacco di lavoro extra.

Non possiamo automatizzare questo flusso di lavoro e testare automaticamente le interazioni dei nostri componenti?

### Scrivi un test di interazione usando la funzione play

Gli strumenti di Storybook [`play`](https://storybook.js.org/docs/react/writing-stories/play-function) e [`@storybook/addon-interactions`](https://storybook.js.org/docs/react/writing-tests/interaction-testing) ci aiutano in questo. Una funzione play include piccoli frammenti di codice che vengono eseguiti dopo il rendering della storia.

La funzione play ci aiuta a verificare cosa succede all'UI quando i task vengono aggiornati. Utilizza API DOM indipendenti dal framework, il che significa che possiamo scrivere storie con la funzione play per interagire con l'UI e simulare il comportamento umano indipendentemente dal framework frontend utilizzato.

L'`@storybook/addon-interactions` ci aiuta a visualizzare i nostri test in Storybook, fornendo un flusso passo-passo. Offre anche un pratico set di controlli dell'interfaccia utente per mettere in pausa, riprendere, riavvolgere e passare attraverso ogni interazione.

Vediamolo in azione! Aggiorna la tua storia `InboxScreen` appena creata e configura le interazioni del componente aggiungendo quanto segue:

```diff:title=src/components/InboxScreen.stories.jsx
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
  tags: ['autodocs'],
};

export const Default = {
  parameters: {
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
        rest.get(
          'https://jsonplaceholder.typicode.com/todos?userId=1',
          (req, res, ctx) => {
            return res(ctx.status(403));
          }
        ),
      ],
    },
  },
};
```

Controlla la storia `Default`. Clicca sul pannello `Interazioni` per vedere l'elenco delle interazioni all'interno della funzione play della storia.

<video autoPlay muted playsInline loop>
  <source
    src="/intro-to-storybook/storybook-interactive-stories-play-function-7-0.mp4"
    type="video/mp4"
  />
</video>

### Automatizzare i test con il test runner

Con la funzione play di Storybook, siamo riusciti a evitare il nostro problema, permettendoci di interagire con la nostra UI e di controllare rapidamente come reagisce se aggiorniamo i nostri task—mantenendo l'UI coerente senza sforzo manuale aggiuntivo.

Tuttavia, se osserviamo più da vicino il nostro Storybook, possiamo vedere che esegue i test di interazione solo quando visualizziamo la storia. Quindi, dovremmo comunque passare attraverso ogni storia per eseguire tutti i controlli se apportiamo una modifica. Non potremmo automatizzarlo?

La buona notizia è che possiamo! Il [test runner](https://storybook.js.org/docs/react/writing-tests/test-runner) di Storybook ci permette di fare proprio questo. È uno strumento autonomo—alimentato da [Playwright](https://playwright.dev/)—che esegue tutti i nostri test di interazione e individua le storie rotte.

Vediamo come funziona! Esegui il seguente comando per installarlo:

```shell
yarn add --dev @storybook/test-runner
```

Successivamente, aggiorna la sezione `scripts` del tuo `package.json` e aggiungi un nuovo task di test:

```json:clipboard=false
{
  "scripts": {
    "test-storybook": "test-storybook"
  }
}
```

Infine, con il tuo Storybook in esecuzione, apri una nuova finestra del terminale ed esegui il seguente comando:

```shell
yarn test-storybook --watch
```

<div class="aside">
💡 Il testing delle interazioni con la funzione play è un modo fantastico per testare i tuoi componenti UI. Può fare molto di più di quanto abbiamo visto qui; ti consigliamo di leggere la <a href="https://storybook.js.org/docs/react/writing-tests/interaction-testing">documentazione ufficiale</a> per saperne di più.
<br />
Per un'analisi ancora più approfondita sui test, dai un'occhiata al <a href="/ui-testing-handbook">Manuale dei Test</a>. Copre le strategie di test utilizzate dai team di frontend scalabili per potenziare il tuo flusso di lavoro di sviluppo.
</div>

![Il test runner di Storybook esegue con successo tutti i test](/intro-to-storybook/storybook-test-runner-execution.png)

Successo! Ora abbiamo uno strumento che ci aiuta a verificare se tutte le nostre storie vengono renderizzate senza errori e tutte le asserzioni passano automaticamente. Inoltre, se un test fallisce, fornirà un link che apre la storia fallita nel browser.

## Sviluppo guidato dai componenti

Abbiamo iniziato dal basso con `Task`, poi siamo passati a `TaskList`, e ora siamo qui con un'intera interfaccia utente della schermata. Il nostro `InboxScreen` ospita componenti connessi e include storie di accompagnamento.

<video autoPlay muted playsInline loop style="width:480px; height:auto; margin: 0 auto;">
  <source
    src="/intro-to-storybook/component-driven-development-optimized.mp4"
    type="video/mp4"
  />
</video>

[**Sviluppo guidato dai componenti**](https://www.componentdriven.org/) ti permette di espandere gradualmente la complessità mentre sali nella gerarchia dei componenti. Tra i vantaggi ci sono un processo di sviluppo più focalizzato e una copertura maggiore di tutte le possibili permutazioni dell'UI. In breve, il CDD ti aiuta a costruire interfacce utente di qualità superiore e più complesse.

Non abbiamo ancora finito - il lavoro non termina quando l'UI è costruita. Dobbiamo anche assicurarci che rimanga solida nel tempo.

<div class="aside">
💡 Non dimenticare di committare le tue modifiche con git!
</div>
