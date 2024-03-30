---
title: 'Costruisci un componente semplice'
tocTitle: 'Componente semplice'
description: 'Costruisci un componente semplice in isolamento'
commit: 'b586083'
---

Costruiremo la nostra UI seguendo una metodologia [Component-Driven Development](https://www.componentdriven.org/) (CDD). È un processo che costruisce le UI dal "basso verso l'alto", partendo dai componenti e terminando con gli schermi. Il CDD ti aiuta a gestire l'ammontare di complessità a cui sei sottoposto mentre costruisci la UI.

## Task

![Componente Task in tre stati](/intro-to-storybook/task-states-learnstorybook-accessible.png)

`Task` è il componente principale della nostra app. Ogni task viene visualizzato leggermente diversamente a seconda dello stato in cui si trova. Visualizziamo una casella di controllo selezionata (o deselezionata), alcune informazioni sul task e un pulsante "pin", che ci permette di spostare i task su e giù nella lista. Mettendo insieme tutto ciò, avremo bisogno di queste props:

- `titolo` - una stringa che descrive il task
- `stato` - in quale lista si trova attualmente il task, ed è stato completato?

Quando iniziamo a creare `Task`, scriviamo prima i nostri stati di test che corrispondono ai diversi tipi di attività delineati sopra. Quindi utilizziamo Storybook per creare il componente in isolamento utilizzando dati simulati. Testeremo manualmente l'aspetto del componente in base a ciascuno stato man mano che procediamo.

## Configurazione Iniziale

Prima di tutto, creiamo il componente del task e il relativo file di storia: `src/components/Task.vue` e `src/components/Task.stories.js`.

Inizieremo con una implementazione di base del `Task`, prendendo semplicemente gli attributi che sappiamo ci serviranno e le due azioni che puoi fare su un compito (per spostarlo tra le liste):

```html:title=src/components/Task.vue
<template>
  <div class="list-item">
    <label for="title" :aria-label="task.title">
      <input type="text" readonly :value="task.title" id="title" name="title" />
    </label>
  </div>
</template>

<script>
export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: 'Task',
  props: {
    task: {
      type: Object,
      required: true,
      default: () => ({ id: '', state: '', title: '' }),
      validator: (task) => ['id', 'state', 'title'].every((key) => key in task)
    }
  }
}
</script>
```

Sopra, mostriamo un markup semplice per `Task` basato sulla struttura HTML esistente dell'applicazione Todos.

Di seguito costruiamo i tre stati di test di Task nel file della storia:

```js:title=src/components/Task.stories.js
import Task from './Task.vue';

import { action } from '@storybook/addon-actions';

export default {
  component: Task,
  title: 'Task',
  tags: ['autodocs'],
  //👇 Our events will be mapped in Storybook UI
  argTypes: {
    onPinTask: {},
    onArchiveTask: {},
  },
  //👇 Our exports that end in "Data" are not stories.
  excludeStories: /.*Data$/,
};

export const actionsData = {
  onPinTask: action('pin-task'),
  onArchiveTask: action('archive-task'),
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
💡 <a href="https://storybook.js.org/docs/vue/essentials/actions">Le <b>Actions</b></a> aiutano a verificare le interazioni durante la costruzione di componenti UI in isolamento. Spesso non avrai accesso alle funzioni e allo stato che hai nel contesto dell'app. Usa <code>action()</code> per simularle.
</div>

Ci sono due livelli base di organizzazione in Storybook: il componente e le sue storie figlie. Pensa a ogni storia come a una permutazione di un componente. Puoi avere quante storie per componente ti servono.

- **Componente**
  - Storia
  - Storia
  - Storia

Per informare Storybook sul componente che stiamo documentando e testando, creiamo un `export` predefinito che contiene:

- `component` -- il componente stesso
- `title` -- come raggruppare o categorizzare il componente nella barra laterale di Storybook
- `tags` -- per generare automaticamente la documentazione per i nostri componenti
- `excludeStories`-- informazioni aggiuntive richieste dalla storia, ma che non devono essere mostrate in Storybook
- `argTypes` -- specifica il comportamento degli [args](https://storybook.js.org/docs/vue/api/argtypes) in ciascuna storia

Per definire le nostre storie, useremo il Component Story Format 3 (noto anche come [CSF3](https://storybook.js.org/docs/vue/api/csf)) per costruire ciascuno dei nostri casi di test. Questo formato è progettato per costruire ciascuno dei nostri casi di test in modo conciso. Esportando un oggetto contenente ciascuno stato del componente, possiamo definire i nostri test in modo più intuitivo e creare e riutilizzare le storie in modo più efficiente.

Gli argomenti o [`args`](https://storybook.js.org/docs/vue/writing-stories/args) ci permettono di modificare dal vivo i nostri componenti con l'addon dei controlli senza dover riavviare Storybook. Una volta che un valore di [`args`](https://storybook.js.org/docs/vue/writing-stories/args) cambia, anche il componente cambia.

`action()` ci permettono di creare callback che appaiono nel pannello **actions** dell'interfaccia utente di Storybook quando vengono cliccate. Quindi, quando costruiamo un pulsante aggiungi, saremo in grado di determinare se un clic sul pulsante è stato eseguito con successo nell'interfaccia utente.

Poiché abbiamo bisogno di passare lo stesso insieme di azioni a tutte le permutazioni del nostro componente, è conveniente raggrupparle in una singola variabile `actionsData` e passarle nella nostra definizione di storia ogni volta. Un'altra cosa bella di raggruppare le `actionsData` di cui un componente ha bisogno è che puoi esportarle e usarle in storie per componenti che riutilizzano questo componente, come vedremo più avanti.

Quando creiamo una storia, usiamo un argomento `task` di base per costruire la forma del compito che il componente si aspetta. Tipicamente modellato da come appare effettivamente il dato. Ancora una volta, esportare questa forma ci permetterà di riutilizzarla nelle storie successive, come vedremo.

## Configurazione

Dovremo apportare un paio di modifiche ai file di configurazione di Storybook in modo che noti le nostre storie recentemente create e ci permetta di utilizzare il file CSS dell'applicazione (situato in `src/index.css`).

Inizia modificando il tuo file di configurazione di Storybook (`.storybook/main.js`) come segue:

```diff:title=.storybook/main.js
/** @type { import('@storybook/vue3-vite').StorybookConfig } */
const config = {
- stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|ts|tsx)'],
+ stories: ['../src/components/**/*.stories.js'],
  staticDirs: ['../public'],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
  ],
  framework: {
    name: '@storybook/vue3-vite',
    options: {},
  },
  docs: {
    autodocs: 'tag',
  },
};
export default config;
```

Dopo aver completato la modifica sopra, all'interno della cartella `.storybook`, modifica il tuo file `preview.js` come segue:

```diff:title=.storybook/preview.js
+ import '../src/index.css';

//👇 Configures Storybook to log the actions( onArchiveTask and onPinTask ) in the UI.
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

I [`parameters`](https://storybook.js.org/docs/vue/writing-stories/parameters) sono tipicamente utilizzati per controllare il comportamento delle funzionalità e degli addon di Storybook. Nel nostro caso, li useremo per configurare come vengono gestite le `actions` (callback simulate).

Le `actions` ci permettono di creare callback che appaiono nel pannello **actions** dell'interfaccia utente di Storybook quando vengono cliccate. Quindi, quando costruiamo un pulsante aggiungi, saremo in grado di determinare se un clic sul pulsante è stato eseguito con successo nell'interfaccia utente.

Una volta fatto ciò, riavviando il server di Storybook dovrebbero apparire i casi di test per i tre stati del Task:

<video autoPlay muted playsInline loop>
  <source
    src="/intro-to-storybook/inprogress-task-states-7-0.mp4"
    type="video/mp4"
  />
</video>

## Sviluppo degli Stati

Ora che abbiamo configurato Storybook, importato gli stili e creato i casi di test, possiamo iniziare rapidamente a implementare l'HTML del componente per farlo corrispondere al design.

Il componente è ancora rudimentale al momento. Prima di tutto, scrivi il codice che raggiunge il design senza entrare troppo nei dettagli:

```html:title=src/components/Task.vue
<template>
  <div :class="classes">
    <label
      :for="'checked' + task.id"
      :aria-label="'archiveTask-' + task.id"
      class="checkbox"
    >
      <input
        type="checkbox"
        :checked="isChecked"
        disabled
        :name="'checked' + task.id"
        :id="'archiveTask-' + task.id"
      />
      <span class="checkbox-custom" @click="archiveTask" />
    </label>
    <label :for="'title-' + task.id" :aria-label="task.title" class="title">
      <input
        type="text"
        readonly
        :value="task.title"
        :id="'title-' + task.id"
        name="title"
        placeholder="Input title"
      />
    </label>
    <button
      v-if="!isChecked"
      class="pin-button"
      @click="pinTask"
      :id="'pinTask-' + task.id"
      :aria-label="'pinTask-' + task.id"
    >
      <span class="icon-star" />
    </button>
  </div>
</template>

<script>
import { reactive, computed } from 'vue';

export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: 'Task',
  props: {
    task: {
      type: Object,
      required: true,
      default: () => ({ id: '', state: '', title: '' }),
      validator: task => ['id', 'state', 'title'].every(key => key in task),
    },
  },
  emits: ['archive-task', 'pin-task'],

  setup(props, { emit }) {
    props = reactive(props);
    return {
      classes: computed(() => ({
        'list-item TASK_INBOX': props.task.state === 'TASK_INBOX',
        'list-item TASK_PINNED': props.task.state === 'TASK_PINNED',
        'list-item TASK_ARCHIVED': props.task.state === 'TASK_ARCHIVED',
      })),
      /**
       * Computed property for checking the state of the task
       */
      isChecked: computed(() => props.task.state === 'TASK_ARCHIVED'),
      /**
       * Event handler for archiving tasks
       */
      archiveTask() {
        emit('archive-task', props.task.id);
      },
      /**
       * Event handler for pinning tasks
       */
      pinTask() {
        emit('pin-task', props.task.id);
      },
    };
  },
};
</script>
```

Il markup aggiuntivo di cui sopra, combinato con il CSS che abbiamo importato in precedenza, produce la seguente interfaccia utente:

<video autoPlay muted playsInline loop>
  <source
    src="/intro-to-storybook/finished-task-states-7-0.mp4"
    type="video/mp4"
  />
</video>

## Componente Costruito!

Abbiamo ora costruito con successo un componente senza aver bisogno di un server o di eseguire l'intera applicazione frontend. Il passo successivo è costruire uno per uno i restanti componenti di Taskbox in modo simile.

Come puoi vedere, iniziare a costruire componenti in isolamento è facile e veloce. Possiamo aspettarci di produrre un'interfaccia utente di maggiore qualità con meno bug e più rifinita perché è possibile approfondire e testare ogni stato possibile.

## Individuare Problemi di Accessibilità

I test di accessibilità si riferiscono alla pratica di esaminare il DOM renderizzato con strumenti automatizzati rispetto a un insieme di euristiche basate su regole [WCAG](https://www.w3.org/WAI/standards-guidelines/wcag/) e altre best practice accettate dall'industria. Agiscono come prima linea di QA per individuare evidenti violazioni dell'accessibilità, garantendo che un'applicazione sia utilizzabile dal maggior numero possibile di persone, inclusi individui con disabilità come problemi di vista, udito e condizioni cognitive.

Storybook include un [addon ufficiale per l'accessibilità](https://storybook.js.org/addons/@storybook/addon-a11y). Alimentato da Deque's [axe-core](https://github.com/dequelabs/axe-core), può individuare fino al [57% dei problemi WCAG](https://www.deque.com/blog/automated-testing-study-identifies-57-percent-of-digital-accessibility-issues/).

Vediamo come funziona! Esegui il seguente comando per installare l'addon:

```shell
yarn add --dev @storybook/addon-a11y
```

Poi, aggiorna il tuo file di configurazione di Storybook (`.storybook/main.js`) per abilitarlo:

```diff:title=.storybook/main.js
/** @type { import('@storybook/vue3-vite').StorybookConfig } */
const config = {
  stories: ['../src/components/**/*.stories.js'],
  staticDirs: ['../public'],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
+   '@storybook/addon-a11y',
  ],
  framework: {
    name: '@storybook/vue3-vite',
    options: {},
  },
  docs: {
    autodocs: 'tag',
  },
};
export default config;
```

![Problema di accessibilità del Task in Storybook](/intro-to-storybook/finished-task-states-accessibility-issue-7-0.png)

Scorrendo le nostre storie, possiamo vedere che l'addon ha individuato un problema di accessibilità in uno dei nostri stati di test. Il messaggio [**"Gli elementi devono avere un contrasto di colore sufficiente"**](https://dequeuniversity.com/rules/axe/4.4/color-contrast?application=axeAPI) significa essenzialmente che non c'è abbastanza contrasto tra il titolo del task e lo sfondo. Possiamo correggerlo rapidamente cambiando il colore del testo in un grigio più scuro nel CSS della nostra applicazione (situato in `src/index.css`).

```diff:title=src/index.css
.list-item.TASK_ARCHIVED input[type="text"] {
- color: #a0aec0;
+ color: #4a5568;
  text-decoration: line-through;
}
```

Ecco fatto! Abbiamo compiuto il primo passo per garantire che l'interfaccia utente sia accessibile. Man mano che continuiamo ad aggiungere complessità alla nostra applicazione, possiamo ripetere questo processo per tutti gli altri componenti senza dover avviare strumenti o ambienti di test aggiuntivi.

<div class="aside">
💡 Non dimenticare di committare le tue modifiche con git!
</div>
