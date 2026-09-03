---
title: 'Costruisci un componente semplice'
tocTitle: 'Componente semplice'
description: 'Costruisci un componente semplice in isolamento'
---

Costruiremo la nostra UI seguendo una metodologia [Component-Driven Development](https://www.componentdriven.org/) (CDD). È un processo che costruisce le UI dal "basso verso l'alto", partendo dai componenti e terminando con gli schermi. Il CDD ti aiuta a gestire l'ammontare di complessità a cui sei sottoposto mentre costruisci la UI.

## Task

![Componente Task in tre stati](/intro-to-storybook/task-states-learnstorybook.png)

`Task` è il componente principale della nostra app. Ogni task viene visualizzato leggermente diversamente a seconda dello stato in cui si trova. Visualizziamo una casella di controllo selezionata (o deselezionata), alcune informazioni sul task e un pulsante "pin", che ci permette di spostare i task su e giù nella lista. Mettendo insieme tutto ciò, avremo bisogno di queste props:

- `title` – una stringa che descrive il task
- `state` - in quale lista si trova attualmente il task, ed è stato completato?

Quando iniziamo a creare `Task`, scriviamo prima i nostri stati di test che corrispondono ai diversi tipi di task delineati sopra. Quindi utilizziamo Storybook per creare il componente in isolamento utilizzando dati simulati. Testeremo "visivamente" l'aspetto del componente in base a ciascuno stato man mano che procediamo.

Questo processo è simile al [Test-driven development](https://en.wikipedia.org/wiki/Test-driven_development) (TDD), che possiamo chiamare "[Visual TDD](https://www.chromatic.com/blog/how-to-run-visual-regression-tests-in-2023/)".

## Configurazione iniziale

Apriamo `.storybook/main.js` e diamo un'occhiata

```js:title=.storybook/main.js
module.exports = {
  stories: ['../components/**/*.stories.?(ts|tsx|js|jsx)'],
  addons: [
    '@storybook/addon-ondevice-controls',
    '@storybook/addon-ondevice-actions',
  ],
};
```

Se controlli la proprietà `stories`, vedrai che Storybook cerca le storie nella cartella `components`.

In Storybook per React Native, a causa delle attuali limitazioni del bundler Metro, ci basiamo sulla configurazione in `main.js` per generare un file chiamato `storybook.requires`, che viene utilizzato per caricare tutte le nostre storie e addon nel progetto. Questo file viene generato automaticamente quando esegui `yarn storybook` per avviare Storybook.

<div class="aside">

💡 Puoi anche generare manualmente il file `storybook.requires` eseguendo `yarn storybook-generate`. Tuttavia, non dovresti aver bisogno di ricreare questo file a meno che non noti che una storia non viene caricata o che una modifica alla configurazione di `main.js` non si riflette nel tuo Storybook. Per saperne di più su come viene generato il file `storybook.requires`, puoi consultare la funzione `withStorybook` nel tuo file `metro.config.js`.

</div>

Ora creiamo il componente del task e il relativo file di storia: `components/Task.jsx` e `components/Task.stories.jsx`.

Inizieremo con un'implementazione di base del `Task`, prendendo semplicemente gli attributi che sappiamo ci serviranno e le due azioni che puoi eseguire su un task (per spostarlo tra le liste):

```jsx:title=components/Task.jsx
import { StyleSheet, TextInput, View } from 'react-native';
import { styles } from './styles';

export const Task = ({
  task: { id, title, state },
  onArchiveTask,
  onPinTask,
}) => {
  return (
    <View style={styles.listItem}>
      <TextInput value={title} editable={false} />
    </View>
  );
};
```

Ora aggiungi il file di storia:

```jsx:title=components/Task.stories.jsx
import { Task } from './Task';

export default {
  title: 'Task',
  component: Task,
  argTypes: {
    onPinTask: { action: 'onPinTask' },
    onArchiveTask: { action: 'onArchiveTask' },
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
  args: { task: { ...Default.args.task, state: 'TASK_PINNED' } },
};

export const Archived = {
  args: { task: { ...Default.args.task, state: 'TASK_ARCHIVED' } },
};
```

Nei nostri file di storia utilizziamo una sintassi chiamata Component Story Format (CSF). Questa sintassi rende più facile scrivere le storie ed è supportata dalle ultime versioni di Storybook.

Ci sono due livelli base di organizzazione in Storybook: il componente e le sue storie figlie. Pensa a ogni storia come a una permutazione di un componente. Puoi avere quante storie per componente ti servono.

- **Componente**
  - Storia
  - Storia
  - Storia

Per informare Storybook sul componente che stiamo documentando, creiamo un `export` predefinito che contiene:

- `component` -- il componente stesso
- `title` -- come fare riferimento al componente nella barra laterale dell'app Storybook
- `argTypes` -- ci permette di specificare i tipi dei nostri args; qui lo utilizziamo per definire le actions, che verranno registrate ogni volta che quell'interazione ha luogo

Per definire le nostre storie esportiamo un oggetto con una proprietà `args`. Gli argomenti, o [`args`](https://storybook.js.org/docs/react/writing-stories/args) in breve, ci permettono di modificare dal vivo i nostri componenti con l'addon dei controlli senza dover riavviare Storybook. Una volta che un valore di [`args`](https://storybook.js.org/docs/react/writing-stories/args) cambia, anche il componente cambia.

Quando creiamo una storia, usiamo un argomento `task` di base per costruire la forma del task che il componente si aspetta. Tipicamente modellato da come appare effettivamente il dato. Ancora una volta, esportare questa forma ci permetterà di riutilizzarla nelle storie successive, come vedremo.

Ora che abbiamo impostato le basi, rieseguiamo `yarn storybook` per vedere le nostre modifiche. Se hai già Storybook in esecuzione, puoi anche eseguire `yarn storybook-generate` per rigenerare il file `storybook.requires`.

Dovresti vedere una UI simile a questa:
![una gif che mostra il componente task in Storybook](/intro-to-storybook/react-native-task-component.gif)

Puoi utilizzare il menu nella parte inferiore dello schermo per aprire il menu di navigazione e toccare per passare da una storia all'altra. Puoi poi toccare altrove o scorrere verso il basso per chiudere il menu. Troverai gli addon premendo l'icona all'estrema destra della barra inferiore.

## Sviluppo degli stati

Ora possiamo iniziare a costruire il nostro componente per farlo corrispondere al design.

Il componente è ancora rudimentale al momento. Prima di tutto, scrivi il codice che raggiunge il design senza entrare troppo nei dettagli:

```jsx:title=components/Task.jsx
import { MaterialIcons } from '@expo/vector-icons';
import { StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import { styles } from './styles';

export const Task = ({
  task: { id, title, state },
  onArchiveTask,
  onPinTask,
}) => {
  return (
    <View style={styles.listItem}>
      <TouchableOpacity onPress={() => onArchiveTask(id)}>
        {state !== "TASK_ARCHIVED" ? (
          <MaterialIcons
            name="check-box-outline-blank"
            size={24}
            color="#26c6da"
          />
        ) : (
          <MaterialIcons name="check-box" size={24} color="#26c6da" />
        )}
      </TouchableOpacity>
      <TextInput
        placeholder="Input Title"
        value={title}
        editable={false}
        style={
          state === "TASK_ARCHIVED"
            ? styles.listItemInputTaskArchived
            : styles.listItemInputTask
        }
      />
      <TouchableOpacity onPress={() => onPinTask(id)}>
        <MaterialIcons
          name="star"
          size={24}
          color={state !== "TASK_PINNED" ? "#eee" : "#26c6da"}
        />
      </TouchableOpacity>
    </View>
  );
};
```

Quando hai finito, dovrebbe apparire così:

![una gif che mostra il componente task in Storybook](/intro-to-storybook/react-native-task-component-completed.gif)

## Componente costruito!

Abbiamo ora costruito con successo un componente senza aver bisogno di un server o di eseguire l'intera applicazione. Il passo successivo è costruire, uno per uno, i restanti componenti di Taskbox in modo simile.

Come puoi vedere, iniziare a costruire componenti in isolamento è facile e veloce. Possiamo aspettarci di produrre un'interfaccia utente di maggiore qualità con meno bug e più rifinita perché è possibile approfondire e testare ogni stato possibile.

<div class="aside">
💡 Non dimenticare di committare le tue modifiche con git!
</div>
