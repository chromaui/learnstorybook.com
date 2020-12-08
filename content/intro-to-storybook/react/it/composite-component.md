---
title: 'Assembla un componente composito'
tocTitle: 'Componente composito'
description: 'Assembla un componente composito con componenti più semplici'
commit: '3ebec05'
---

Nell'ultimo capitolo abbiamo costruito il nostro primo componente; questo capitolo amplia quello che abbiamo imparato per costruire la TaskList, una lista di Tasks. Andiamo a combinare insieme i componenti e vediamo cosa succede quando una maggior complessità è introdotta.  

## Tasklist

La Taskbox da enfasi alle attività "bloccate" (pinned) posizionandole sopra le attività predefinite. Questo produce due varianti di `TaskList` perciò devi creare storie per: gli elementi predefiniti e per gli elementi "bloccati".  

![task predefiniti e bloccati](/intro-to-storybook/tasklist-states-1.png)

Poiché i dati di `Task` possono essere spediti in maniera asincrona, abbiamo **anche** bisogno di uno stato loading da visualizzare in assenza di una connessione. In aggiunta, uno stato vuoto è richiesto quando non ci sono task.  

![task vuoti e loading](/intro-to-storybook/tasklist-states-2.png)

## Effettua il setup

Un componente composito non è molto differente dai componenti basilari che contiene. Crea un componente `TaskList` e un file story abbinato: `src/components/TaskList.js` e `src/components/TaskList.stories.js`.

Inizia  con un'implementazione abbozzata di `TaskList`. Per prima cosa avrai bisogno di importare il componente `Task`  e passare gli attributi e le azioni come input.

```javascript
// src/components/TaskList.js

import React from 'react';

import Task from './Task';

export default function TaskList({ loading, tasks, onPinTask, onArchiveTask }) {
  const events = {
    onPinTask,
    onArchiveTask,
  };

  if (loading) {
    return <div className="list-items">loading</div>;
  }

  if (tasks.length === 0) {
    return <div className="list-items">empty</div>;
  }

  return (
    <div className="list-items">
      {tasks.map(task => (
        <Task key={task.id} task={task} {...events} />
      ))}
    </div>
  );
}
```

Quindi crea gli stati di test per `Tasklist` nel file della storia.

```javascript
// src/components/TaskList.stories.js

import React from 'react';

import TaskList from './TaskList';
import * as TaskStories from './Task.stories';

export default {
  component: TaskList,
  title: 'TaskList',
  decorators: [story => <div style={{ padding: '3rem' }}>{story()}</div>],
};

const Template = args => <TaskList {...args} />;

export const Default = Template.bind({});
Default.args = {
  // Shaping the stories through args composition.
  // The data was inherited from the Default story in task.stories.js.
  tasks: [
    { ...TaskStories.Default.args.task, id: '1', title: 'Task 1' },
    { ...TaskStories.Default.args.task, id: '2', title: 'Task 2' },
    { ...TaskStories.Default.args.task, id: '3', title: 'Task 3' },
    { ...TaskStories.Default.args.task, id: '4', title: 'Task 4' },
    { ...TaskStories.Default.args.task, id: '5', title: 'Task 5' },
    { ...TaskStories.Default.args.task, id: '6', title: 'Task 6' },
  ],
};

export const WithPinnedTasks = Template.bind({});
WithPinnedTasks.args = {
  // Shaping the stories through args composition.
  // Inherited data coming from the Default story.
  tasks: [
    ...Default.args.tasks.slice(0, 5),
    { id: '6', title: 'Task 6 (pinned)', state: 'TASK_PINNED' },
  ],
};

export const Loading = Template.bind({});
Loading.args = {
  tasks: [],
  loading: true,
};

export const Empty = Template.bind({});
Empty.args = {
  // Shaping the stories through args composition.
  // Inherited data coming from the Loading story.
  ...Loading.args,
  loading: false,
};
```

<div class="aside">
I <a href="https://storybook.js.org/docs/react/writing-stories/decorators"><b>Decoratori</b></a> sono un modo per fornire wrapper arbitrari alle storie. In questo caso useremo un decoratore `key` sull'esportazione di default per aggiungere alcuni `padding` attorno al componente renderizzato. Possono essere usati anche per wrappare le storie in “provider” –es: componenti della libreria che impostano il contesto di React.
</div>

Importando `TaskStories`, siano in grado di [comporre (compose)](https://storybook.js.org/docs/react/writing-stories/args#args-composition) gli argomenti (args in breve) nelle nostre storie con il minimo sforzo. In questo modo i dati e le azioni (mocked callbacks) previste da entrambi i componenti sono mantenuti.

<!--
`taskData` supplies the shape of a `Task` that we created and exported from the `Task.stories.js` file. Similarly, `actionsData` defines the actions (mocked callbacks) that a `Task` component expects, which the `TaskList` also needs. -->

Ora controlla Storybook per le nuove storie di `TaskList`.

<video autoPlay muted playsInline loop>
  <source
    src="/intro-to-storybook/inprogress-tasklist-states-6-0.mp4"
    type="video/mp4"
  />
</video>

## Costruisci gli stati

Il nostro componente è ancora approssimativo, ma ora abbiamo un idea delle storie su cui andare a lavorare. Potresti pensare che il wrapper `.list-items` sia eccessivamente semplicistico. Hai ragione: nella maggior parte dei casi non creeremo un nuovo componente solo per aggiungere un wrapper. Però la **vera complessità** del componente `TaskList` viene rivelata nei casi limite `withPinnedTasks`, `loading`, e `empty`.

```javascript
// src/components/TaskList.js

import React from 'react';

import Task from './Task';

export default function TaskList({ loading, tasks, onPinTask, onArchiveTask }) {
  const events = {
    onPinTask,
    onArchiveTask,
  };

  const LoadingRow = (
    <div className="loading-item">
      <span className="glow-checkbox" />
      <span className="glow-text">
        <span>Loading</span> <span>cool</span> <span>state</span>
      </span>
    </div>
  );
  if (loading) {
    return (
      <div className="list-items">
        {LoadingRow}
        {LoadingRow}
        {LoadingRow}
        {LoadingRow}
        {LoadingRow}
        {LoadingRow}
      </div>
    );
  }
  if (tasks.length === 0) {
    return (
      <div className="list-items">
        <div className="wrapper-message">
          <span className="icon-check" />
          <div className="title-message">You have no tasks</div>
          <div className="subtitle-message">Sit back and relax</div>
        </div>
      </div>
    );
  }
  const tasksInOrder = [
    ...tasks.filter(t => t.state === 'TASK_PINNED'),
    ...tasks.filter(t => t.state !== 'TASK_PINNED'),
  ];
  return (
    <div className="list-items">
      {tasksInOrder.map(task => (
        <Task key={task.id} task={task} {...events} />
      ))}
    </div>
  );
}
```

Il markup aggiunto risulta nella seguente UI:

<video autoPlay muted playsInline loop>
  <source
    src="/intro-to-storybook/finished-tasklist-states-6-0.mp4"
    type="video/mp4"
  />
</video>

Nota la posizione dell'elemento bloccato nella lista. Noi vogliamo che l'elemento bloccato sia visualizzato in cima alla lista per renderlo una priorità per i nostri utenti.

## Requisiti dei dati e props

Man mano che il componente cresce, crescono anche i requisiti di input. Definisci i requisiti delle proprietà di `TaskList`. Poiché `Task` è un child component, assicurati di fornire i dati nella forma corretta per renderizzarli. Per risparmiare tempo e grattacapi, riusa le propTypes che hai definito prima in `Task`.

```javascript
// src/components/TaskList.js

import React from 'react';
import PropTypes from 'prop-types';

import Task from './Task';

export default function TaskList() {
  ...
}

TaskList.propTypes = {
  /** Checks if it's in loading state */
  loading: PropTypes.bool,
  /** The list of tasks */
  tasks: PropTypes.arrayOf(Task.propTypes.task).isRequired,
  /** Event to change the task to pinned */
  onPinTask: PropTypes.func,
  /** Event to change the task to archived */
  onArchiveTask: PropTypes.func,
};
TaskList.defaultProps = {
  loading: false,
};
```

## Test automatici

Nel capitolo precedente noi abbiamo appreso come creare degli snapshot delle storie di test utilizzando Storyshots. Con `Task` non c'era molta complessità da testare oltre a quella di verificare che sia visualizzato correttamente. Poiché `TaskList` aggiunge un altro livello di complessità vogliamo verificare che certi input producano determinati output in una maniera disponibile ai test automatici. Per fare questo creeremo unit test usando [Jest](https://facebook.github.io/jest/) accoppiato con un test renderer.

![Jest logo](/intro-to-storybook/logo-jest.png)

### Test unitari con Jest

Le storie di Storybook, i test manuali e gli snapshot test contribuiscono notevolmente ad evitare i bug della UI. Se le storie coprono un'ampia varietà di casi d'uso dei componenti e utilizziamo tool che assicurano che un essere umano controlli qualsiasi modifica alla storia, gli errori sono molto meno probabili.

In ogni caso, alcune volte il diavolo è nei dettagli. E' necessario un framework di test che sia esplicito su questi dettagli. Il che ci porta ai test unitari.

Nel nostro caso, vogliamo che la nostra `TaskList` visualizzi i task bloccati **prima** dei task sbloccati che sono stati passati nella prop `tasks`. Sebbene noi abbiamo una storia (`WithPinnedTasks`) per testare questo preciso scenario, può essere ambiguo per un revisore umano che se il componente **smette** di ordinare i task in questo modo, questo è un bug. Certamente non griderà **“Sbagliato!”** a un'occhiata casuale.

Quindi, per evitare questo problema, possiamo usare Jest per visualizzare la storia nel DOM ed eseguire alcune interrogazioni DOM per verificare le caratteristiche salienti dell'output. La cosa bella del formato della storia è che possiamo semplicemente importare la storia nei nostri test e visualizzare lì!

Crea un file di test chiamato `src/components/TaskList.test.js`. Qui creremo i nostri test che faranno assunzioni sull'output.

```javascript
// src/components/TaskList.test.js

import React from 'react';
import ReactDOM from 'react-dom';
import '@testing-library/jest-dom/extend-expect';

import { WithPinnedTasks } from './TaskList.stories';

it('renders pinned tasks at the start of the list', () => {
  const div = document.createElement('div');
  // Our story will be used for the test.
  // With the arguments that were created.
  ReactDOM.render(<WithPinnedTasks {...WithPinnedTasks.args} />, div);

  // We expect the task titled "Task 6 (pinned)" to be rendered first, not at the end
  const lastTaskInput = div.querySelector('.list-item:nth-child(1) input[value="Task 6 (pinned)"]');
  expect(lastTaskInput).not.toBe(null);

  ReactDOM.unmountComponentAtNode(div);
});
```

![TaskList test runner](/intro-to-storybook/tasklist-testrunner.png)

Tieni presente che siamo stati in grado di riusare la storia `WithPinnedTasks` nel nostro test unitario; in questo modo possiamo continuare a sfruttare una risorsa esistente (gli esempi che rappresentano configurazioni interessanti del componente) in molti modi.

Fai caso inoltre che questo testo è tranquillamente fragile. E' possibile che man mano che il progetto matura e l'esatta implementazione di `Task` cambi --forse sarà usata un differente classname o una `textarea` invece che un `input`--il test fallità, e tu avrai bisogno di aggiornarlo. Non è necessariamente un problema, ma piuttosto un indicatore di fare attenzione a utilizzare liberamente un test unitario per la UI. Non sono facili da mantenere. Fai invece affidamento su test manuali, snapshot e regressioni visive (vedi [capitolo test](/test/)) dei test ove possibile.
