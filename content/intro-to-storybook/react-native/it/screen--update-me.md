---
title: 'Costruisci una schermata'
tocTitle: 'Schermate'
description: 'Costruisci una schermata da componenti'
---

Ci siamo concentrati sulla costruzione di interfacce utente dal basso verso l'alto, partendo da piccole e aggiungendo complessità. Farlo ci ha permesso di sviluppare ogni componente in isolamento, capire le sue esigenze di dati e giocare con esso in Storybook. Tutto senza dover avviare un server o costruire schermate!

In questo capitolo continuiamo ad aumentare la sofisticatezza combinando i componenti in una schermata e sviluppando quella schermata in Storybook.

## Componenti contenitore annidati

Poiché la nostra app è molto semplice, la schermata che costruiremo è piuttosto banale: si limita ad avvolgere il componente `TaskList` (che fornisce i propri dati tramite Redux) in un po' di layout ed estrae un campo `error` di primo livello da redux (supponiamo di impostare questo campo se abbiamo qualche problema di connessione al nostro server). Crea `PureInboxScreen.js` nella tua cartella `components`:

```js:title=components/PureInboxScreen.js
import * as React from 'react';
import PropTypes from 'prop-types';
import PercolateIcons from '../constants/Percolate';
import TaskList from './TaskList';
import { Text, SafeAreaView, View } from 'react-native';
import { styles } from '../constants/globalStyles';

const PureInboxScreen = ({ error }) => {
  if (error) {
    return (
      <SafeAreaView style={styles.PageListsShow}>
        <View style={styles.WrapperMessage}>
          <PercolateIcons name="face-sad" size={64} color={'#2cc5d2'} />
          <Text style={styles.TitleMessage}>Oh no!</Text>
          <Text style={styles.SubtitleMessage}>Something went wrong</Text>
        </View>
      </SafeAreaView>
    );
  }
  return (
    <SafeAreaView style={styles.PageListsShow}>
      <View style={[styles.titlepage, styles.PageListsShowhead]}>
        <Text numberOfLines={1} style={styles.TitleWrapper}>
          Taskbox
        </Text>
      </View>
      <TaskList />
    </SafeAreaView>
  );
};
PureInboxScreen.propTypes = {
  error: PropTypes.string,
};

PureInboxScreen.defaultProps = {
  error: null,
};

export default PureInboxScreen;
```

Creiamo poi un contenitore che recupera i dati per `PureInboxScreen` in `screens/InboxScreen.js`

```js:title=screens/InboxScreen.js
import * as React from 'react';
import { connect } from 'react-redux';
import PureInboxScreen from '../components/PureInboxScreen';

const InboxScreen = ({ error }) => {
  return <PureInboxScreen error={error} />;
};

export default connect(({ error }) => ({ error }))(InboxScreen);
```

Modifichiamo anche il componente `HomeScreen` per renderizzare `InboxScreen` (alla fine useremmo una struttura più complessa per scegliere la schermata corretta, ma qui non preoccupiamocene):

```js:title=screens/HomeScreen.js
import * as React from 'react';
import { Provider } from 'react-redux';
import store from '../lib/redux';

import InboxScreen from './InboxScreen';

export default function HomeScreen() {
  return (
    <Provider store={store}>
      <InboxScreen />
    </Provider>
  );
}
```

Tuttavia, le cose diventano interessanti quando si tratta di renderizzare la storia in Storybook.

Come abbiamo visto in precedenza, il componente `TaskList` è un **contenitore** che renderizza il componente di presentazione `PureTaskList`. Per definizione i componenti contenitore non possono essere semplicemente renderizzati in isolamento; si aspettano di ricevere un contesto o di connettersi a un servizio. Questo significa che, per renderizzare un contenitore in Storybook, dobbiamo simulare (cioè fornire una versione fittizia) il contesto o il servizio richiesto.

Quando abbiamo inserito `TaskList` in Storybook, siamo riusciti a evitare questo problema semplicemente renderizzando `PureTaskList` ed evitando il contenitore. Faremo qualcosa di simile e renderizzeremo anche `PureInboxScreen` in Storybook.

Tuttavia, con `PureInboxScreen` abbiamo un problema: sebbene `PureInboxScreen` stesso sia di presentazione, il suo figlio, `TaskList`, non lo è. In un certo senso `PureInboxScreen` è stato "contaminato" dalla natura di contenitore. Quindi, quando impostiamo le nostre storie in `PureInboxScreen.stories.js`:

```js:title=components/PureInboxScreen.stories.js
import * as React from 'react';
import { storiesOf } from '@storybook/react-native';
import PureInboxScreen from './PureInboxScreen';

storiesOf('PureInboxScreen', module)
  .add('default', () => <PureInboxScreen />)
  .add('error', () => <PureInboxScreen error="Something" />);
```

Vediamo che, sebbene la storia `error` funzioni correttamente, abbiamo un problema nella storia `default`, perché `TaskList` non ha nessuno store Redux a cui connettersi. (Incontreresti problemi simili anche cercando di testare `PureInboxScreen` con un unit test).

![Inbox rotta](/intro-to-storybook/broken-inboxscreen.png)

Un modo per evitare questo problema è non renderizzare mai componenti contenitore in nessun punto della tua app, tranne al livello più alto, e passare invece tutti i requisiti di dati lungo la gerarchia dei componenti.

Tuttavia, gli sviluppatori **dovranno** inevitabilmente renderizzare contenitori più in basso nella gerarchia dei componenti. Se vogliamo renderizzare la maggior parte, o tutta, l'app in Storybook (e lo vogliamo!), abbiamo bisogno di una soluzione a questo problema.

<div class="aside">
Detto per inciso, passare i dati lungo la gerarchia è un approccio legittimo, specialmente quando si usa <a href="http://graphql.org/">GraphQL</a>. È così che abbiamo costruito <a href="https://www.chromatic.com/?utm_source=storybook_website&utm_medium=link&utm_campaign=storybook">Chromatic</a> insieme a più di 800 storie.
</div>

## Fornire il contesto con i decoratori

La buona notizia è che è facile fornire uno store Redux a `PureInboxScreen` in una storia! Possiamo semplicemente usare una versione simulata dello store Redux fornita in un decoratore:

```js:title=components/PureInboxScreen.stories.js
import * as React from 'react';
import { storiesOf } from '@storybook/react-native';
import { action } from '@storybook/addon-actions';
import { Provider } from 'react-redux';
import { defaultTasks } from './PureTaskList.stories';
import PureInboxScreen from './PureInboxScreen';

// A super-simple mock of a redux store
const store = {
  getState: () => {
    return {
      tasks: defaultTasks,
    };
  },
  subscribe: () => 0,
  dispatch: action('dispatch'),
};

storiesOf('PureInboxScreen', module)
  .addDecorator((story) => <Provider store={store}>{story()}</Provider>)
  .add('default', () => <PureInboxScreen />)
  .add('error', () => <PureInboxScreen error="Something" />);
```

Esistono approcci simili per fornire un contesto simulato per altre librerie di dati, come [Apollo](https://www.npmjs.com/package/apollo-storybook-decorator), [Relay](https://github.com/orta/react-storybooks-relay-container) e altre.

Scorrere gli stati in Storybook rende facile verificare che l'abbiamo fatto correttamente:

<video autoPlay muted playsInline loop >

  <source
    src="/intro-to-storybook/finished-inboxscreen-states.mp4"
    type="video/mp4"
  />
</video>

## Sviluppo guidato dai componenti

Siamo partiti dal basso con `Task`, poi siamo passati a `TaskList`, e ora siamo arrivati a un'intera interfaccia utente di schermata. Il nostro `InboxScreen` ospita un componente contenitore annidato e include le storie di accompagnamento.

<video autoPlay muted playsInline loop style="width:480px; height:auto; margin: 0 auto;">
  <source
    src="/intro-to-storybook/component-driven-development-optimized.mp4"
    type="video/mp4"
  />
</video>

Lo [**Sviluppo guidato dai componenti**](https://www.componentdriven.org/) ti permette di espandere gradualmente la complessità mentre sali nella gerarchia dei componenti. Tra i vantaggi ci sono un processo di sviluppo più focalizzato e una copertura maggiore di tutte le possibili permutazioni dell'UI. In breve, il CDD ti aiuta a costruire interfacce utente di qualità superiore e più complesse.

Non abbiamo ancora finito - il lavoro non termina quando l'UI è costruita. Dobbiamo anche assicurarci che rimanga solida nel tempo.
