---
title: 'Costruisci una scermata'
tocTitle: 'Schermate'
description: 'Costruisci una schermata con i componenti'
commit: '46f29e3'
---

Ci siamo concentrati nella costruzione della UI dal basso verso l'alto; abbiamo iniziato dal piccolo ed abbiamo aggiunto complessità. Procedere in questo modo ci ha permesso di sviluppare ciascun componente in isolamento, immaginare i dati di cui ha bisogno e ci abbiamo giocato con Storybook. Tutto senza il bisogno di installare un server o costruire schermate!

In questo capitolo continueremo ad incrementare la complessità combinando i componenti in una schermata e svilupperemo quella schermata in Storybook.

## Componenti del contenitore annidati

Poiché la nostra app è molto semplice, lo schermo che costruiremo è piuttosto banale, semplicemente avvolgendo il componente `TaskList` (che fornisce i propri dati tramite Redux) in un layout e estraendo un campo di primo livello` error` da redux ( supponiamo di impostare quel campo se abbiamo qualche problema di connessione al nostro server). Crea `InboxScreen.js` nella tua cartella` components`:

## Componenti del contenitore annidati

Siccome la nostra app è molto semplice, la schermata che costruiremo è piuttosto banale, semplicemente avvolgiamo il componente `TaskList` (che fornisce i propri dati attraverso Redux) in un layout ed estraiamo da redux un campo di primo livello `error` (presupponiamo di impostare quel campo se abbiamo qualche problema di connessione al nostro server). Crea `InboxScreen.js` nella tua cartella `components`:

```js:title=src/components/InboxScreen.js
import React from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';

import TaskList from './TaskList';

export function PureInboxScreen({ error }) {
  if (error) {
    return (
      <div className="page lists-show">
        <div className="wrapper-message">
          <span className="icon-face-sad" />
          <div className="title-message">Oh no!</div>
          <div className="subtitle-message">Something went wrong</div>
        </div>
      </div>
    );
  }
  return (
    <div className="page lists-show">
      <nav>
        <h1 className="title-page">
          <span className="title-wrapper">Taskbox</span>
        </h1>
      </nav>
      <TaskList />
    </div>
  );
}

PureInboxScreen.propTypes = {
  /** The error message */
  error: PropTypes.string,
};

PureInboxScreen.defaultProps = {
  error: null,
};

export default connect(({ error }) => ({ error }))(PureInboxScreen);
```

Modifichiamo anche il componente `App` per renderizzare `InboxScreen` (eventualmente noi useremo un router per scegliere la corretta schermata, ma per ora non ce ne preoccupiamo):

```js:title=src/App.js
import { Provider } from 'react-redux';
import store from './lib/redux';

import InboxScreen from './components/InboxScreen';

import './index.css';

function App() {
  return (
    <Provider store={store}>
      <InboxScreen />
    </Provider>
  );
}
export default App;
```

In ogni caso le cose si fanno interessanti quando renderizziamo la storia in Storybook.

Come abbiamo visto in precedena, il componente `TaskList` è un **container** che renderizza il componente di presentazione `PureTaskList`. Per definizione i componenti contenitori non possono essere semplicemente renderizzati in isolamento; si aspettano che venga trasmesso loro un contesto o che si connettano ad un servizio. Questo significa che per visualizzare un componente contenitore in Storybook, dobbiamo per forza mockare (ovvero fornire una versione fittizia) del contesto o del servizio che è richiesto.

Quando inseriamo `TaskList` in Storybook, siamo stati in grado di schivare questo problema semplicemente renderizzando `PureTaskList` ed evitando il contenitore. Fare qualcosa di simile e visualizzeremo allo stesso modo `PureInboxScreen` in Storybook.

Tuttavia per `PureInboxScreen` abbiamo comunque un problema nonostante `PureInboxScreen` sia di presentazione, il componente figlio, `TaskList`, non lo è. In un certo senso `PureInboxScreen` è stato sporcato dalla “conteinerizzazione”. Così quando settiamo le nostre storie in `InboxScreen.stories.js`:

```js:title=src/components/InboxScreen.stories.js
import React from 'react';

import { PureInboxScreen } from './InboxScreen';

export default {
  component: PureInboxScreen,
  title: 'InboxScreen',
};

const Template = args => <PureInboxScreen {...args} />;

export const Default = Template.bind({});

export const Error = Template.bind({});
Error.args = {
  error: 'Something',
};
```

Vediamo che sebbene la story `error` funzioni bene, abbiamo un problema nella `default` story, perché il `TaskList` non ha un archivio Redux a cui connettersi. (Potresti incontrare problemi simili anche quando provi a testare `PureInboxScreen` con uno unit test).

![Broken inbox](/intro-to-storybook/broken-inboxscreen.png)

Una maniera per eludere questo problema consiste nel non eseguire mai il rendering dei componenti del contenitore ovunque nella tua app eccetto al più alto livello e al contrario passare tutti i dati richiesti attraverso la gerarchia dei componenti.

Tuttavia, gli sviluppatori **dovranno** inevitabilmente eseguire il rendering dei contenitori in basso nella gerarchia dei componenti. Se vogliamo mostrare tutta o la maggior parte dell'app in Storybook (e noi lo facciamo!), abbiamo bisogno di una soluzione a questo problema.

<div class="aside">
💡 Detto a margine, passare i dati lungo tutta la gerarchia è un approccio legittimo, soprattutto quando si utilizza <a href="http://graphql.org/">GraphQL</a>. E' così che abbiamo costruito <a href="https://www.chromatic.com">Chromatic</a> insieme ad oltre 800 story.
</div>

## Fornire contesto con i decoratori

La buona notizia è che è facile fornire uno store Redux in una story di `InboxScreen`! Noi possiamo giusto usare una versione mockata dello store Redux in un decorator:

```diff:title=src/components/InboxScreen.stories.js
import React from 'react';
+ import { Provider } from 'react-redux';

import { PureInboxScreen } from './InboxScreen';

+ import { action } from '@storybook/addon-actions';

+ import * as TaskListStories from './TaskList.stories';

+ // A super-simple mock of a redux store
+ const store = {
+   getState: () => {
+    return {
+      tasks: TaskListStories.Default.args.tasks,
+    };
+   },
+   subscribe: () => 0,
+   dispatch: action('dispatch'),
+ };

export default {
  component: PureInboxScreen,
+ decorators: [story => <Provider store={store}>{story()}</Provider>],
  title: 'InboxScreen',
};

const Template = args => <PureInboxScreen {...args} />;

export const Default = Template.bind({});

export const Error = Template.bind({});
Error.args = {
  error: 'Something',
};
```

Esistono approcci simili per fornire contesti mockati per altre librerie di dati, come [Apollo](https://www.npmjs.com/package/apollo-storybook-decorator), [Relay](https://github.com/orta/react-storybooks-relay-container) ed altre.

Ciclare attraverso gli stati in Storybook rende semplice testare correttamente quello che abbiamo fatto:

<video autoPlay muted playsInline loop >

  <source
    src="/intro-to-storybook/finished-inboxscreen-states-6-0.mp4"
    type="video/mp4"
  />
</video>

## Sviluppo basato sui componenti

Siamo partiti dal basso con `Task`, poi siamo passati progressivamente a `TaskList`, ora siamo qui con un'intera schermata UI. Il nostro `InboxScreen` ospita un componente contenitore innestato e include delle story di accompagnamento.

<video autoPlay muted playsInline loop style="width:480px; height:auto; margin: 0 auto;">
  <source
    src="/intro-to-storybook/component-driven-development-optimized.mp4"
    type="video/mp4"
  />
</video>

Il [**Component-Driven Development**](https://www.componentdriven.org/) (sviluppo basato sui componenti) ci consente di espandere gradualmente la complessità man mano che si sale nella gerarchia dei componenti. Tra i vantaggi vi sono un processo di sviluppo più mirato e una maggiore copertura di tutte le possibili modifiche dell'interfaccia utente. In breve CDD ci aiuta a costruire interfacce utente più complesse e di qualità superiore.

Non abbiamo ancora finito - il lavoro non termina quando abbiamo costruito la UI. Dobbiamo ancora assicurarci che rimanga durevole nel tempo.

<div class="aside">
💡 Non dimenticare di committare i tuoi cambiamenti con git!
</div>
