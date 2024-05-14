---
title: 'Costruisci una schermata'
tocTitle: 'Schermate'
description: 'Costruisci una schermata da componenti'
commit: 'af51337'
---

Ci siamo concentrati sulla costruzione di interfacce utente dal basso verso l'alto, partendo da piccole e aggiungendo complessità. Farlo ci ha permesso di sviluppare ogni componente in isolamento, capire le sue esigenze di dati e giocare con esso in Storybook. Tutto senza dover avviare un server o costruire schermate!

In questo capitolo, continuiamo ad aumentare la sofisticatezza combinando i componenti in una schermata e sviluppando quella schermata in Storybook.

## Componenti del contenitore annidati

Siccome la nostra applicazione è semplice, lo schermo che costruiremo è abbastanza banale, semplicemente avvolgendo il componente `TaskList` (che fornisce i propri dati tramite Pinia) in qualche layout e lancia un `errore di primo livello` fuori dallo store (supponendo di impostare quel campo se abbiamo qualche problema di connessione al nostro server). Creiamo un `PureInboxScreen.vue` di presentazione nella cartella `src/components/` :

```html:title=src/components/PureInboxScreen.vue
<template>
  <div>
    <div v-if="error" class="page lists-show">
      <div class="wrapper-message">
        <span class="icon-face-sad" />
        <p class="title-message">Oh no!</p>
        <p class="subtitle-message">Something went wrong</p>
      </div>
    </div>
    <div v-else class="page lists-show">
      <nav>
        <h1 class="title-page">Taskbox</h1>
      </nav>
      <TaskList />
    </div>
  </div>
</template>

<script>
import TaskList from './TaskList.vue';
export default {
  name: 'PureInboxScreen',
  components: { TaskList },
  props: {
    error: { type: Boolean, default: false },
  },
};
</script>
```

Poi, possiamo creare un contenitore, che di nuovo prende i dati per la `PureInboxScreen` in `src/components/InboxScreen.vue`:

```html:title=src/components/InboxScreen.vue
<template>
  <PureInboxScreen :error="isError" />
</template>

<script>
import PureInboxScreen from './PureInboxScreen.vue';

import { computed } from 'vue';

import { useTaskStore } from '../store';

export default {
  name: 'InboxScreen',
  components: { PureInboxScreen },
  setup() {
    //👇 Creates a store instance
    const store = useTaskStore();

    //👇 Retrieves the error from the store's state
    const isError = computed(() => store.status==='error');
    return {
      isError,
    };
  },
};
</script>
```

Successivamente, dovremo aggiornare il punto di ingresso della nostra app (`src/main.js`) in modo da poter collegare lo store nella nostra gerarchia di componenti velocemente:

```diff:title=src/main.js
import { createApp } from 'vue';
+ import { createPinia } from 'pinia';

import App from './App.vue';

- createApp(App).mount('#app')
+ createApp(App).use(createPinia()).mount('#app');
```

Dobbiamo anche cambiare il componente `App` per rendere la `InboxScreen` (alla fine, useremmo un router per scegliere la schermata corretta, ma non preoccupiamoci di questo ora):

```html:title=src/App.vue
<script setup>
import InboxScreen from './components/InboxScreen.vue';
</script>

<template>
  <div id="app">
    <InboxScreen />
  </div>
</template>

<style>
@import './index.css';
</style>
```

Tuttavia, le cose diventano interessanti quando si tratta di renderizzare la storia in Storybook.

Come abbiamo visto in precedenza, il componente `TaskList` è un *container** che renderizza il componente di presentazione `PureTaskList`. Per definizione, i componenti del container non possono essere semplicemente renderrizzati in modo isolato; si aspettano di essere passati a qualche contesto o connessi a un servizio. Ciò significa che per renderizzare un contenitore in Storybook, dobbiamo simulare (cioè fornire una versione finta) il contesto o il servizio che richiede.

Posizionando la `TaskList` in Storybook, siamo stati in grado di evitare questo problema semplicemente renderizzando la `PureTaskList` ed evitando il contenitore. Faremo qualcosa di simile e renderizzeremo anche il `PureInboxScreen` in Storybook.

Mettendo la `TaskList` in Storybook, siamo stati in grado di schivare questo problema semplicemente renderizzando la `PureTaskList` ed evitando il contenitore. Faremo qualcosa di simile e rendere il `PureInboxScreen` in Storybook anche.

Tuttavia, abbiamo un problema con la `PureInboxScreen` perché anche se la `PureInboxScreen` stessa è presentazionale, il figlio, `TaskList`, non lo è. In un certo senso, il `PureInboxScreen` è stato inquinato dal fatto di non avere un contenitore. Così quando abbiamo impostato le nostre storie in `src/components/PureInboxScreen.stories.js`:

```js:title=src/components/PureInboxScreen.stories.js
import PureInboxScreen from './PureInboxScreen.vue';

export default {
  component: PureInboxScreen,
  title: 'PureInboxScreen',
  tags: ['autodocs'],
};

export const Default = {};

export const Error = {
  args: { error: true },
};

```

Vediamo che anche se la storia d'`errore` funziona bene, abbiamo un problema nella storia `default` perché la `TaskList` non ha lo store di Pinia per connettersi.

![Inbox rotto](/intro-to-storybook/pure-inboxscreen-vue-pinia-tasks-issue.png)

Un modo per eludere questo problema è quello di non renderizzare mai i componenti del contenitore in qualsiasi punto della vostra applicazione, tranne al più alto livello e invece passare tutti i dati necessari lungo la gerarchia dei componenti.

Tuttavia, gli sviluppatori **dovranno** inevitabilmente renderizzare i contenitori più in basso nella gerarchia dei componenti. Se vogliamo renderizzare la maggior parte dell'app o tutta in Storybook (lo vogliamo!), abbiamo bisogno di una soluzione a questo problema.

<div class="aside">
💡 Come suggerimento aggiuntivo, un altro approccio valido sarebbe quello di passare i dati lungo la gerarchia, specialmente quando si utilizza <a href="http://graphql.org/">GraphQL</a>. È così che abbiamo costruito <a href="https://www.chromatic.com/?utm_source=storybook_website&utm_medium=link&utm_campaign=storybook">Chromatic</a> insieme a più di 800 storie.
</div>

## Fornire contesto alle storie

La buona notizia è che è facile collegare Storybook ad uno store Pinia e riutilizzarlo tra storie! Possiamo
aggiornare il nostro file di configurazione `.storybook/preview.js` e fare affidamento sulla funzione `setup` di Storybook per registrare il nostro negozio Pinia:

```diff:title=.storybook/preview.js
+ import { setup } from '@storybook/vue3';

+ import { createPinia } from 'pinia';

import '../src/index.css';

//👇 Registers a global Pinia instance inside Storybook to be consumed by existing stories
+ setup((app) => {
+   app.use(createPinia());
+ });

/** @type { import('@storybook/vue3').Preview } */
const preview = {
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
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

Approcci simili esistono per fornire un contesto finto per altre librerie di dati, come [Apollo](https://www.npmjs.com/package/apollo-storybook-decorator), [Relay](https://github.com/orta/react-storybooks-relay-container) e altre.

Scorrere attraverso gli stati di Storybook rende facile testare, abbiamo fatto questo correttamente:

<video autoPlay muted playsInline loop >

  <source
    src="/intro-to-storybook/finished-pureinboxscreen-states-7-0.mp4"
    type="video/mp4"
  />
</video>

## Test sulle interazioni

Finora, siamo stati in grado di costruire un'applicazione completamente funzionale partendo da zero, iniziando da un semplice componente fino ad arrivare a una schermata, testando continuamente ogni modifica con le nostre storie. Ma ogni nuova storia richiede anche un controllo manuale su tutte le altre storie per assicurarsi che l'interfaccia utente non si rompa. È un sacco di lavoro extra.

Non possiamo automatizzare questo flusso di lavoro e testare automaticamente le interazioni dei nostri componenti?

### Scrivi un test di interazione usando la funzione play

Gli strumenti di Storybook [`play`](https://storybook.js.org/docs/vue/writing-stories/play-function) e [`@storybook/addon-interactions`](https://storybook.js.org/docs/vue/writing-tests/interaction-testing) ci aiutano in questo. Una funzione play include piccoli frammenti di codice che vengono eseguiti dopo il rendering della storia.

La funzione play ci aiuta a verificare cosa succede all'UI quando i task vengono aggiornati. Utilizza API DOM indipendenti dal framework, il che significa che possiamo scrivere storie con la funzione play per interagire con l'UI e simulare il comportamento umano indipendentemente dal framework frontend utilizzato.

L'`@storybook/addon-interactions` ci aiuta a visualizzare i nostri test in Storybook, fornendo un flusso passo-passo. Offre anche un pratico set di controlli dell'interfaccia utente per mettere in pausa, riprendere, riavvolgere e passare attraverso ogni interazione.

Vediamolo in azione! Aggiorna la tua storia `PureInboxScreen` appena creata e configura le interazioni del componente aggiungendo quanto segue:

```diff:title=src/components/PureInboxScreen.stories.js
import PureInboxScreen from './PureInboxScreen.vue';

+ import { fireEvent, within } from '@storybook/test';

export default {
  component: PureInboxScreen,
  title: 'PureInboxScreen',
  tags: ['autodocs'],
};

export const Default = {};

export const Error = {
  args: { error: true },
};

+ export const WithInteractions = {
+  play: async ({ canvasElement }) => {
+    const canvas = within(canvasElement);
+    // Simulates pinning the first task
+    await fireEvent.click(canvas.getByLabelText('pinTask-1'));
+    // Simulates pinning the third task
+    await fireEvent.click(canvas.getByLabelText('pinTask-3'));
+  },
+ };
```

<div class="aside">

💡 Il pacchetto `@storybook/test` sostituisce i pacchetti di test `@storybook/jest` e `@storybook/testing-library` offrendo una dimensione bundle più piccola e un'API più semplice basata sul pacchetto [Vitest](https://vitest.dev/).

</div>

Controlla la storia `Default`. Clicca sul pannello `Interactions` per vedere l'elenco delle interazioni all'interno della funzione play della storia.

<video autoPlay muted playsInline loop>
  <source
    src="/intro-to-storybook/storybook-pureinboxscreen-interactive-stories.mp4"
    type="video/mp4"
  />
</video>

### Automatizzare i test con il test runner

Con la funzione play di Storybook, siamo riusciti a evitare il nostro problema, permettendoci di interagire con la nostra UI e di controllare rapidamente come reagisce se aggiorniamo i nostri task—mantenendo l'UI coerente senza sforzo manuale aggiuntivo.

Tuttavia, se osserviamo più da vicino il nostro Storybook, possiamo vedere che esegue i test di interazione solo quando visualizziamo la storia. Quindi, dovremmo comunque passare attraverso ogni storia per eseguire tutti i controlli se apportiamo una modifica. Non potremmo automatizzarlo?

La buona notizia è che possiamo! Il [test runner](https://storybook.js.org/docs/vue/writing-tests/test-runner) di Storybook ci permette di fare proprio questo. È uno strumento autonomo—alimentato da [Playwright](https://playwright.dev/)—che esegue tutti i nostri test di interazione e individua le storie rotte.

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
💡 Il testing delle interazioni con la funzione play è un modo fantastico per testare i tuoi componenti UI. Può fare molto di più di quanto abbiamo visto qui; ti consigliamo di leggere la <a href="https://storybook.js.org/docs/vue/writing-tests/interaction-testing">documentazione ufficiale</a> per saperne di più.
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
