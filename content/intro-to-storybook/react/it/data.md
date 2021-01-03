---
title: 'Collegare i dati'
tocTitle: 'I dati'
description: 'Impara come collegare i dati ai componenti della tua UI'
commit: '97fc9a6'
---

Finora abbiamo creato componenti senza stato (*stateless*) isolati, ottimi per Storybook, ma alla fine senza utilità finché non forniamo loro dei dati della nostra applicazione.  

Questo tutorial non si concentra sui particolari della creazione di un'app, perciò non approfondiremo qui questi dettagli. Tuttavia ci prenderemo un momento per guardare a dei tipici schemi per il collegamento dei dati.  

## Container component

Il nostro componente `TaskList` è attualmente scritto come *presentational component* (vedi [il post](https://medium.com/@dan_abramov/smart-and-dumb-components-7ca2f9a7c7d0)) in quanto non comunica con i componenti esterni alla propria implementazione. Per passargli dei dati dovremo creare un "contenitore" (*container component*).  

Questo esempio usa [Redux](https://redux.js.org/), la più popolare libreria React per archiviare i dati, per creare un semplice modello di dati per la nostra app. In ogni caso il *pattern* qui riportato si applicata anche ad altre librerie di gestione dei dati come [Apollo](https://www.apollographql.com/client/) e [MobX](https://mobx.js.org/).  

Aggiungi le dipendenze necessarie al tuo progetto con il comando:  

```bash
yarn add react-redux redux
```

Per prima cosa costruiremo un semplice archivio Redux che risponde alle azioni per cambiare lo stato delle attività, in un file chiamato `lib/redux.js` nella cartella `src` (volutamente semplice):

```javascript
// src/lib/redux.js

// A simple redux store/actions/reducer implementation.
// A true app would be more complex and separated into different files.
import { createStore } from 'redux';

// The actions are the "names" of the changes that can happen to the store
export const actions = {
  ARCHIVE_TASK: 'ARCHIVE_TASK',
  PIN_TASK: 'PIN_TASK',
};

// The action creators bundle actions with the data required to execute them
export const archiveTask = id => ({ type: actions.ARCHIVE_TASK, id });
export const pinTask = id => ({ type: actions.PIN_TASK, id });

// All our reducers simply change the state of a single task.
function taskStateReducer(taskState) {
  return (state, action) => {
    return {
      ...state,
      tasks: state.tasks.map(task =>
        task.id === action.id ? { ...task, state: taskState } : task
      ),
    };
  };
}

// The reducer describes how the contents of the store change for each action
export const reducer = (state, action) => {
  switch (action.type) {
    case actions.ARCHIVE_TASK:
      return taskStateReducer('TASK_ARCHIVED')(state, action);
    case actions.PIN_TASK:
      return taskStateReducer('TASK_PINNED')(state, action);
    default:
      return state;
  }
};

// The initial state of our store when the app loads.
// Usually you would fetch this from a server
const defaultTasks = [
  { id: '1', title: 'Something', state: 'TASK_INBOX' },
  { id: '2', title: 'Something more', state: 'TASK_INBOX' },
  { id: '3', title: 'Something else', state: 'TASK_INBOX' },
  { id: '4', title: 'Something again', state: 'TASK_INBOX' },
];

// We export the constructed redux store
export default createStore(reducer, { tasks: defaultTasks });
```

Quindi modificheremo l'esportazione predefinita dal componente `TaskList` per connetterci all'archivio Redux e fare il rendering delle attività che ci interessano:  

```javascript
// src/components/TaskList.js

import React from 'react';
import PropTypes from 'prop-types';

import Task from './Task';
import { connect } from 'react-redux';
import { archiveTask, pinTask } from '../lib/redux';

export function PureTaskList({ loading, tasks, onPinTask, onArchiveTask }) {
  /* previous implementation of TaskList */
}

PureTaskList.propTypes = {
  /** Checks if it's in loading state */
  loading: PropTypes.bool,
  /** The list of tasks */
  tasks: PropTypes.arrayOf(Task.propTypes.task).isRequired,
  /** Event to change the task to pinned */
  onPinTask: PropTypes.func.isRequired,
  /** Event to change the task to archived */
  onArchiveTask: PropTypes.func.isRequired,
};

PureTaskList.defaultProps = {
  loading: false,
};

export default connect(
  ({ tasks }) => ({
    tasks: tasks.filter(t => t.state === 'TASK_INBOX' || t.state === 'TASK_PINNED'),
  }),
  dispatch => ({
    onArchiveTask: id => dispatch(archiveTask(id)),
    onPinTask: id => dispatch(pinTask(id)),
  })
)(PureTaskList);
```
Ora che abbiamo alcuni dati reali che popolano il nostro componente, ottenuti da Redux, potremmo collegarli a `src/app.js` e renderizzare il componente da qui. Però ora eviteremo di farlo e continueremo il nostro percorso guidato dai componenti (*component-driven*).

Non temere, ce ne occuperemo nel prossimo capitolo.

In questa fase, i nostri test Storybook smetteranno di funzionare perché `TaskList` è ora un container e non si aspetta più nessuna *props*. Invece `TaskList` si connette allo *store* e imposta le *props* sul componente `PureTaskList` che lo include.  

In ogni caso possiamo facilmente risolvere questo problema semplicemente renderizzando `PureTaskList`, il componente di presentazione (*presentational component*), a cui abbiamo appena aggiunto l'istruzione `export`, del passaggio precedente, alle nostre storie Storybook:  

```javascript
// src/components/TaskList.stories.js

import React from 'react';

import { PureTaskList } from './TaskList';
import * as TaskStories from './Task.stories';

export default {
  component: PureTaskList,
  title: 'TaskList',
  decorators: [story => <div style={{ padding: '3rem' }}>{story()}</div>],
};

const Template = args => <PureTaskList {...args} />;

export const Default = Template.bind({});
Default.args = {
  // Shaping the stories through args composition.
  // The data was inherited the Default story in task.stories.js.
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

<video autoPlay muted playsInline loop>
  <source
    src="/intro-to-storybook/finished-tasklist-states-6-0.mp4"
    type="video/mp4"
  />
</video>

<div class="aside">
I snapshot test dovrebbero fallire in questa fase, dovrai aggiornare gli snapshot esistenti eseguendo lo script di test con il flag <code>-u</code>. Inoltre, poiché la nostra app sta progressivamente crescendo, sarebbe un buon momento per aggiungere il flag <code> --watchAll</code> quando eseguiamo i nostri test, come menzionato nella sezione <a href="/react/it/get-started/">Per iniziare</a>.
</div>


