---
title: 'Costruisci un semplice componente'
tocTitle: 'Componente semplice'
description: 'Costruisci un semplice componente in isolation'
commit: 'f433fe5'
---

Costruiremo la nostra UI seguendo la metologia [Component-Driven Development](https://www.componentdriven.org/) (CDD). Questo è un processo che costruisce le UI dal "basso verso l'altro" iniziando con i componenti e finendo con le schermate. CDD ti aiuta a scalare la complessità che devi affrontare durante la creazione dell'interfaccia utente.  

## Task

![Task componente in tre stati](/intro-to-storybook/task-states-learnstorybook.png)  

`Task` è il principale componente della nostra applicazione. Ciascun task viene visualizzato in maniera leggermente differente a seconda dello stato in cui si trova. Visualizziamo una checkbox selezionata (o deselezionata), alcune informazioni riguardo il task, e un bottone "pin" che ci permette di spostare i task su e giù nella lista. Per mettere insieme tutto questo avremo bisogno di queste proprietà:  

- `title` – una stringa che descrive il task  
- `state` - in quale lista il task è attualmente ed è selezionato?  

Appena iniziamo a costruire `Task`, iniziamo a scrivere gli stati di test che corrispondono ai differenti tipi di task abbozzati sopra. Usiamo, poi, Storybook per costruire il test in isolamento usando dei dati fittizi. Mano a mano che procediamo, testeremo manualmente l'aspetto del componente in base ad ogni stato che assegniamo.  

## Effettua la configurazione

Per prima cosa, creiamo il componente task e il file story relativo: `src/components/Task.js` e `src/components/Task.stories.js`.  

Inizieremo con un'implementazione di base del `Task`, semplicemente prenderemo gli attributi di cui sappiamo aver bisogno e le due azioni che possiamo eseguire su un task (spostare l'elemento tra le liste):  

```javascript
// src/components/Task.js

import React from 'react';

export default function Task({ task: { id, title, state }, onArchiveTask, onPinTask }) {
  return (
    <div className="list-item">
      <input type="text" value={title} readOnly={true} />
    </div>
  );
}
```

Sopra, renderizziamo direttamente il markup per `Task` basato sulla struttura HTML esistente della Todos app.  

Sotto costruiamo i tre stati di test nel file story:  

```javascript
// src/components/Task.stories.js

import React from 'react';

import Task from './Task';

export default {
  component: Task,
  title: 'Task',
};

const Template = args => <Task {...args} />;

export const Default = Template.bind({});
Default.args = {
  task: {
    id: '1',
    title: 'Test Task',
    state: 'TASK_INBOX',
    updatedAt: new Date(2018, 0, 1, 9, 0),
  },
};

export const Pinned = Template.bind({});
Pinned.args = {
  task: {
    ...Default.args.task,
    state: 'TASK_PINNED',
  },
};

export const Archived = Template.bind({});
Archived.args = {
  task: {
    ...Default.args.task,
    state: 'TASK_ARCHIVED',
  },
};
```

Ci sono due elementi base in Storybook: il componente e le sue storie. Pensa a ciascuna storia come alla permutazione (cambio di stato) di un componente. Per ogni componente puoi avere tutte le storie di cui hai bisogno.  

- **Componente**
  - Storia
  - Storia
  - Storia

Per raccontare a Storybook del componente che stiamo documentando, creiamo un export `default` che contiene:  

- `component` -- il componente stesso,
- `title` -- come far riferimento al componente nella barra laterare dell'applicazione Storybook,
- `excludeStories` -- exports nel file story che non dovranno essere mostrati come storie da Storybook.
- `argTypes` -- specifica quali [args](https://storybook.js.org/docs/react/api/argtypes) passare a ciascuna storia.  

Per definire le nostre storie, esportiamo una function per ciascuno dei nostri stati di test in modo da generare una storia. La storia è una function che ritorna un elemento renderizzato (es:. un componente con una serie di props) in un determinato stato---esattamente come uno [Stateless Functional Component](https://reactjs.org/docs/components-and-props.html).  

Dato che abbiamo più permutazioni nel nostro componente, è conveniente assegnarlo ad una variabile `Template`. Introdurre questo pattern nelle nostre storie può ridurre la quantità di codice che dovrai scrivere e mantenere.  

<div class="aside">

`Template.bind({})` è una tecnica [standard JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/bind) per effetuare una copia di una funzione. Usiamo questa tecnica per permettere a ciascuna storia esportata di settare le proprie proprietà, ma usando la stessa implementazione.  

</div>

Gli argomenti, o [`args`](https://storybook.js.org/docs/react/writing-stories/args) per abbreviare, ci permette di modificare al volo i nostri componenti con l'aggiunta di controlli senza riavviare Storybook. Ogni volta che un valore di [`args`](https://storybook.js.org/docs/react/writing-stories/args) cambia di conseguenza modificherà il componente.  

Quando creiamo una storia usiamo un arg `task` di base per dar forma al task che il componente si aspetta. Tipicamente è modellato dal vero aspetto dei dati. Ancora una volta, l'esportazione (`export`) di questa forma ci permetterà di riutilizzarlo nelle storie successive, come vedremo.

<div class="aside">
Le <a href="https://storybook.js.org/docs/react/essentials/actions"><b>Actions</b></a> ti aiutano a verificare le interazioni quando costruisci i componenti della UI in isolazione. Spesso vorrai avere accesso alle funzioni e allo stato che hai nel contesto dell'applicazione. Usa <code>action()</code> per inserirli.
</div>

## Configurazione

Avremo bisogno di un paio di modifiche alla configurazione di Storybook per rilevare le storie appena create e che ci consenta di utilizzare il file CSS modificato nel [capitolo precedente](/react/it/get-started).  

Inizia dal cambiare il file di configurazione Storybook (`.storybook/main.js`) come indicato di seguito:

```javascript
// .storybook/main.js

module.exports = {
  stories: ['../src/components/**/*.stories.js'],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/preset-create-react-app',
  ],
};
```

Dopo aver completato il cambiamento sopra, dentro la cartella `.storybook`, cambia il file `preview.js` nel seguente modo:

```javascript
// .storybook/preview.js

import '../src/index.css';

// Configures Storybook to log the actions(onArchiveTask and onPinTask) in the UI.
export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
};
```

I [`parameters`](https://storybook.js.org/docs/react/writing-stories/parameters) sono tipicamente usati per controllare il comportamente delle feature e addon di Storybook. Nel nostro caso stiamo andando ad usarli per configurare come vengono gestitie le `actions` (mocked callbacks).  

Le `actions` ci permettono di creare callback che appaiono nel pannello **actions** dell'UI di Storybook quando cliccate. Così quando costruiremo un bottone "pin", saremo in grado di determinare nell'UI del test se un click sul bottone è avvenuto.  

Una volta fatto ciò, riavviare il server Storybook dovrebbe produrre casi di test per i tre stati del Task:  

<video autoPlay muted playsInline loop>
  <source
    src="/intro-to-storybook/inprogress-task-states-6-0.mp4"
    type="video/mp4"
  />
</video>

## Costruisci gli stati

Ora che abbiamo instanziato Storybook, importati gli stili e costruiti i casi di test, possiamo iniziare rapidamente il lavoro di implementazione dell'HTML del componente per far corrispondere il design.  

Il componente è ancora basilare. Per prima cosa scrivi il codice per realizzare il design senza andare troppo nel dettaglio:  

```javascript
// src/components/Task.js

import React from 'react';

export default function Task({ task: { id, title, state }, onArchiveTask, onPinTask }) {
  return (
    <div className={`list-item ${state}`}>
      <label className="checkbox">
        <input
          type="checkbox"
          defaultChecked={state === 'TASK_ARCHIVED'}
          disabled={true}
          name="checked"
        />
        <span className="checkbox-custom" onClick={() => onArchiveTask(id)} />
      </label>
      <div className="title">
        <input type="text" value={title} readOnly={true} placeholder="Input title" />
      </div>

      <div className="actions" onClick={event => event.stopPropagation()}>
        {state !== 'TASK_ARCHIVED' && (
          // eslint-disable-next-line jsx-a11y/anchor-is-valid
          <a onClick={() => onPinTask(id)}>
            <span className={`icon-star`} />
          </a>
        )}
      </div>
    </div>
  );
}
```

Il markup aggiuntivo indicato sopra combinato con il CSS che abbiamo importato in precedenza produce la seguente UI:  

<video autoPlay muted playsInline loop>
  <source
    src="/intro-to-storybook/finished-task-states-6-0.mp4"
    type="video/mp4"
  />
</video>

## Specificare i requisiti dei dati

E' prassi utilizzare i `propTypes` in React per specificare la forma dei dati che un componente si aspetta. Non solo si documenta da se, ma ti aiuta anche ad individuare i problemi in anticipo.  

```javascript
// src/components/Task.js

import React from 'react';
import PropTypes from 'prop-types';

export default function Task({ task: { id, title, state }, onArchiveTask, onPinTask }) {
  // ...
}

Task.propTypes = {
  /** Composition of the task */
  task: PropTypes.shape({
    /** Id of the task */
    id: PropTypes.string.isRequired,
    /** Title of the task */
    title: PropTypes.string.isRequired,
    /** Current state of the task */
    state: PropTypes.string.isRequired,
  }),
  /** Event to change the task to archived */
  onArchiveTask: PropTypes.func,
  /** Event to change the task to pinned */
  onPinTask: PropTypes.func,
};
```

Ora in fase di sviluppo verrà mostrato un avviso se il componente Task viene usato in modo sbagliato.  

<div class="aside">
Un metodo alternativo per raggiungere lo stesso scopo è usare un sistema Javascript tipizzato come TypeScript per creare un tipo per le proprietà del componente.
</div>

## Il componente costruito!

Abbiamo realizzato con successo un componente senza bisogno di un server o di eseguire l'intera applicazione frontend. Il prossimo passo consiste nel costruire i restanti componenti del Taskbox uno per uno in modo analogo.  

Come puoi vedere, iniziare a creare componenti in isolazione è facile e veloce. Ci aspettiamo di produrre una UI di alta qualità con meno bug e più puliti perché è possibile andare a fondo e testare ogni possibile stato.  

## Test automatici

Storybook ci fornisce un ottimo modo per testare manualmente la UI della nostra applicazione durante la costruzione. Le ‘storie’ ci aiutano ad assicurarci che non romperemo l'aspetto del Task mentre continuamo lo sviluppo dell'applicazione. In ogni caso, è un processo completamente manuale in questo momento, e qualcuno deve fare lo sforzo di cliccare su ogni stato del test e assicurarsi che sia visualizzato correttamente e senza errori o avvisi. Non possiamo farlo automaticamente?  

### Snapshot testing

Snapshot testing si riferisce alla pratica di registrare l'output "che sappiamo corretto" del componente per un dato input e poi contrassegnare il componente ogni qualvolta l'output cambia in futuro. Questo completa Storybook, perché è un modo rapido per visualizzare la nuova versione di un componente e controllarne i cambiamenti.  

<div class="aside">
Assicurati che i tuoi componenti eseguano il rendering dei dati che non cambiano, cosicché i test dei tuoi snapshot non falliscano ogni volta. Fai attenzione a cose come date o valori generati casualmente.  
</div>

Con gli [Storyshots addon](https://github.com/storybooks/storybook/tree/master/addons/storyshots) un test snapshot è creato per ciascuna delle storie. Usalo aggiungendo le seguenti dipendenze di sviluppo:  

```bash
yarn add -D @storybook/addon-storyshots react-test-renderer
```

Crea poi un file `src/storybook.test.js` con quanto segue:  

```javascript
// src/storybook.test.js  

import initStoryshots from '@storybook/addon-storyshots';  
initStoryshots();  
```

Questo è tutto, esegui `yarn test` e vedi il seguente output:  

![Task test runner](/intro-to-storybook/task-testrunner.png)  

Ora avremo un test snapshot per ciascuno delle nostre storie di `Task`. Se cambiamo l'implementazione di `Task`, ci verrà chiesto di verificare i cambiamenti.  
