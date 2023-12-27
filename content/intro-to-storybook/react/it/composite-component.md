---
title: 'Assembla un componente composito'
tocTitle: 'Componente composito'
description: 'Assembla un componente composito da componenti più semplici'
commit: '429780a'
---

Nell'ultimo capitolo, abbiamo costruito il nostro primo componente; questo capitolo estende ciò che abbiamo imparato per realizzare TaskList, una lista di Task. Uniamoli insieme e vediamo cosa succede quando introduciamo più complessità.

## Tasklist

Taskbox enfatizza i task in evidenza posizionandoli sopra i task predefiniti. Ciò produce due variazioni di `TaskList` per cui devi creare storie, elementi predefiniti e in evidenza.

![task predefiniti e in evidenza](/intro-to-storybook/tasklist-states-1.png)

Poiché i dati di `Task` possono essere inviati in modo asincrono, abbiamo **anche** bisogno di uno stato di caricamento da renderizzare in assenza di una connessione. Inoltre, abbiamo bisogno di uno stato vuoto per quando non ci sono task.

![task vuoti e in caricamento](/intro-to-storybook/tasklist-states-2.png)

## Prepariamoci

Un componente composito non è molto diverso dai componenti di base che contiene. Crea un componente `TaskList` e un file di storia associato: `src/components/TaskList.jsx` e `src/components/TaskList.stories.jsx`.

Inizia con un'implementazione approssimativa di `TaskList`. Dovrai importare il componente `Task` di prima e passare gli attributi e le azioni come input.

```jsx:title=src/components/TaskList.jsx
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

Successivamente, crea gli stati di test di `TaskList` nel file di storia.

```jsx:title=src/components/TaskList.stories.jsx
import TaskList from './TaskList';

import * as TaskStories from './Task.stories';

export default {
  component: TaskList,
  title: 'TaskList',
  decorators: [(story) => <div style={{ padding: '3rem' }}>{story()}</div>],
  tags: ['autodocs'],
};

export const Default = {
  args: {
    // Shaping the stories through args composition.
    // The data was inherited from the Default story in Task.stories.jsx.
    tasks: [
      { ...TaskStories.Default.args.task, id: '1', title: 'Task 1' },
      { ...TaskStories.Default.args.task, id: '2', title: 'Task 2' },
      { ...TaskStories.Default.args.task, id: '3', title: 'Task 3' },
      { ...TaskStories.Default.args.task, id: '4', title: 'Task 4' },
      { ...TaskStories.Default.args.task, id: '5', title: 'Task 5' },
      { ...TaskStories.Default.args.task, id: '6', title: 'Task 6' },
    ],
  },
};

export const WithPinnedTasks = {
  args: {
    tasks: [
      ...Default.args.tasks.slice(0, 5),
      { id: '6', title: 'Task 6 (pinned)', state: 'TASK_PINNED' },
    ],
  },
};

export const Loading = {
  args: {
    tasks: [],
    loading: true,
  },
};

export const Empty = {
  args: {
    // Shaping the stories through args composition.
    // Inherited data coming from the Loading story.
    ...Loading.args,
    loading: false,
  },
};
```

<div class="aside">
💡 I <a href="https://storybook.js.org/docs/react/writing-stories/decorators"><b>Decorator</b></a> sono un modo per fornire wrapper arbitrari alle storie. In questo caso, stiamo usando una chiave decorator sull'export predefinito per aggiungere un po' di <code>padding</code> intorno al componente renderizzato. Possono anche essere usati per avvolgere le storie in "provider" - cioè, componenti di libreria che impostano il contesto React.
</div>

Importando `TaskStories`, siamo stati in grado di [comporre](https://storybook.js.org/docs/react/writing-stories/args#args-composition) gli argomenti (args in breve) nelle nostre storie con minimo sforzo. In questo modo, i dati e le azioni (callback simulate) attesi da entrambi i componenti sono conservati.

Ora controlla Storybook per le nuove storie di `TaskList`.

<video autoPlay muted playsInline loop>
  <source
    src="/intro-to-storybook/inprogress-tasklist-states-7-0.mp4"
    type="video/mp4"
  />
</video>

## Sviluppa gli stati

Il nostro componente è ancora grezzo, ma ora abbiamo un'idea delle storie a cui puntare. Potresti pensare che il wrapper `.list-items` sia eccessivamente semplicistico. Hai ragione: nella maggior parte dei casi, non creeremmo un nuovo componente solo per aggiungere un wrapper. Ma la **complessità reale** del componente `TaskList` è rivelata nei casi limite `withPinnedTasks`, `loading` e `empty`.

```jsx:title=src/components/TaskList.jsx
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
      <div className="list-items" data-testid="loading" key={"loading"}>
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
      <div className="list-items" key={"empty"} data-testid="empty">
        <div className="wrapper-message">
          <span className="icon-check" />
          <p className="title-message">You have no tasks</p>
          <p className="subtitle-message">Sit back and relax</p>
        </div>
      </div>
    );
  }

  const tasksInOrder = [
    ...tasks.filter((t) => t.state === 'TASK_PINNED'),
    ...tasks.filter((t) => t.state !== 'TASK_PINNED'),
  ];
  return (
    <div className="list-items">
      {tasksInOrder.map((task) => (
        <Task key={task.id} task={task} {...events} />
      ))}
    </div>
  );
}
```

Il markup aggiunto produce la seguente UI:

<video autoPlay muted playsInline loop>
  <source
    src="/intro-to-storybook/finished-tasklist-states-7-0.mp4"
    type="video/mp4"
  />
</video>

Nota la posizione dell'elemento bloccato nella lista. Vogliamo che l'elemento bloccato venga renderizzato in cima alla lista per renderlo una priorità per i nostri utenti.

## Requisiti dei dati e props

Man mano che il componente cresce, anche i requisiti di input aumentano. Definisci i requisiti delle prop di `TaskList`. Poiché `Task` è un componente figlio, assicurati di fornire dati nella forma giusta per renderizzarlo. Per risparmiare tempo e mal di testa, riutilizza le `propTypes` che hai definito in `Task` in precedenza.

```diff:title=src/components/TaskList.jsx
import React from 'react';
+ import PropTypes from 'prop-types';

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
      <div className="list-items" data-testid="loading" key={"loading"}>
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
      <div className="list-items" key={"empty"} data-testid="empty">
        <div className="wrapper-message">
          <span className="icon-check" />
          <p className="title-message">You have no tasks</p>
          <p className="subtitle-message">Sit back and relax</p>
        </div>
      </div>
    );
  }

  const tasksInOrder = [
    ...tasks.filter((t) => t.state === 'TASK_PINNED'),
    ...tasks.filter((t) => t.state !== 'TASK_PINNED'),
  ];
  return (
    <div className="list-items">
      {tasksInOrder.map((task) => (
        <Task key={task.id} task={task} {...events} />
      ))}
    </div>
  );
}

+ TaskList.propTypes = {
+  /** Checks if it's in loading state */
+  loading: PropTypes.bool,
+  /** The list of tasks */
+  tasks: PropTypes.arrayOf(Task.propTypes.task).isRequired,
+  /** Event to change the task to pinned */
+  onPinTask: PropTypes.func,
+  /** Event to change the task to archived */
+  onArchiveTask: PropTypes.func,
+ };
+ TaskList.defaultProps = {
+  loading: false,
+ };
```

<div class="aside">
💡 Non dimenticare di committare le tue modifiche con git!
</div>
