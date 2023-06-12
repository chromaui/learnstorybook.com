---
title: 'Daten einbinden'
tocTitle: 'Daten'
description: 'Lerne, Daten in deine UI-Komponente einzubinden'
commit: '87a5a91'
---

Bisher haben wir isolierte, zustandslose Komponenten erstellt - perfekt für Storybook, aber letztlich nutzlos, bis wir ihnen einige Daten in unserer App zur Verfügung stellen.

Dieses Tutorial beschäftigt sich nicht mit den Details der Entwicklung einer App, daher werden wir hierauf nicht näher eingehen. Aber wir nehmen uns einen Moment Zeit, um ein übliches Vorgehen für das Einbinden von Daten mithilfe von Container-Komponenten zu beleuchten.

## Container-Komponenten

So wie unsere `TaskList` aktuell geschrieben ist, ist sie insofern eine rein "darstellende" Komponente (siehe [diesen Blog Beitrag](https://medium.com/@dan_abramov/smart-and-dumb-components-7ca2f9a7c7d0)), als dass sie in ihrer eigenen Implementierung nicht mit externen Schnittstellen spricht. Um Daten in die Komponente zu bekommen, benötigen wir einen "Container".

Dieses Beispiel nutzt [Redux](https://redux.js.org/), die bekannteste React-Bibliothek zum Vorhalten von Daten, um ein einfaches Datenmodell für unsere App zu bauen. Das darin verwendete Pattern lässt sich aber auch auf andere Bibliotheken anwenden, wie z.B. [Apollo](https://www.apollographql.com/client/) und [MobX](https://mobx.js.org/).

Füge eine neue Abhängigkeit zur `package.json` hinzu mit:

```shell
yarn add react-redux redux
```

Als Erstes konstruieren wir einen einfachen Redux Store, der auf Actions reagiert, die den Zustand von Aufgaben verändern. Dazu legen wir die Datei `src/lib/redux.js` an (absichtlich einfach gehalten):

```js:title=src/lib/redux.js
// A simple redux store/actions/reducer implementation.
// A true app would be more complex and separated into different files.
import { createStore } from 'redux';

// The actions are the "names" of the changes that can happen to the store
export const actions = {
  ARCHIVE_TASK: 'ARCHIVE_TASK',
  PIN_TASK: 'PIN_TASK',
};

// The action creators bundle actions with the data required to execute them
export const archiveTask = (id) => ({ type: actions.ARCHIVE_TASK, id });
export const pinTask = (id) => ({ type: actions.PIN_TASK, id });

// All our reducers simply change the state of a single task.
function taskStateReducer(taskState) {
  return (state, action) => {
    return {
      ...state,
      tasks: state.tasks.map((task) =>
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

Anschließend aktualisieren wir den `default`-Export der `TaskList`-Komponente, damit dieser sich zum Redux Store verbindet, und die Aufgaben rendert, die uns interessieren:

```js:title=src/components/TaskList.js
import React from 'react';
import PropTypes from 'prop-types';

import Task from './Task';
import { connect } from 'react-redux';
import { archiveTask, pinTask } from '../lib/redux';

export function PureTaskList({ loading, tasks, onPinTask, onArchiveTask }) {
  /* previous implementation of TaskList */
}

PureTaskList.propTypes = {
  loading: PropTypes.bool,
  tasks: PropTypes.arrayOf(Task.propTypes.task).isRequired,
  onPinTask: PropTypes.func.isRequired,
  onArchiveTask: PropTypes.func.isRequired,
};

PureTaskList.defaultProps = {
  loading: false,
};

export default connect(
  ({ tasks }) => ({
    tasks: tasks.filter((t) => t.state === 'TASK_INBOX' || t.state === 'TASK_PINNED'),
  }),
  (dispatch) => ({
    onArchiveTask: (id) => dispatch(archiveTask(id)),
    onPinTask: (id) => dispatch(pinTask(id)),
  })
)(PureTaskList);
```

Ab jetzt werden unsere Storybook Tests fehlschlagen, da die `TaskList` jetzt ein Container ist und keine Props mehr erwartet. Stattdessen verbindet er sich mit dem Store und übergibt Props an die `PureTaskList`-Komponente, die er umschließt.

Dieses Problem lässt sich aber leicht lösen, indem wir einfach die `PureTaskList` -- die darstellende Komponente, der wir im vorherigen Schritt ja ein `export`-Statement hinzugefügt haben -- in unseren Storybook-Stories rendern:

```js:title=src/components/TaskList.stories.js
import React from 'react';

import { PureTaskList } from './TaskList';
import { taskData, actionsData } from './Task.stories';

export default {
  component: PureTaskList,
  title: 'TaskList',
  decorators: [(story) => <div style={{ padding: '3rem' }}>{story()}</div>],
  excludeStories: /.*Data$/,
};

export const defaultTasksData = [
  { ...taskData, id: '1', title: 'Task 1' },
  { ...taskData, id: '2', title: 'Task 2' },
  { ...taskData, id: '3', title: 'Task 3' },
  { ...taskData, id: '4', title: 'Task 4' },
  { ...taskData, id: '5', title: 'Task 5' },
  { ...taskData, id: '6', title: 'Task 6' },
];

export const withPinnedTasksData = [
  ...defaultTasksData.slice(0, 5),
  { id: '6', title: 'Task 6 (pinned)', state: 'TASK_PINNED' },
];

export const Default = () => <PureTaskList tasks={defaultTasksData} {...actionsData} />;

export const WithPinnedTasks = () => <PureTaskList tasks={withPinnedTasksData} {...actionsData} />;

export const Loading = () => <PureTaskList loading tasks={[]} {...actionsData} />;

export const Empty = () => <PureTaskList tasks={[]} {...actionsData} />;
```

<video autoPlay muted playsInline loop>
  <source
    src="/intro-to-storybook/finished-tasklist-states.mp4"
    type="video/mp4"
  />
</video>

<div class="aside">
Sollten deine Snapshot Tests nun fehlschlagen, musst du die bestehenden Snapshots aktualisieren, indem du das Test-Script mit dem Flag <code>-u</code> ausführst.
</div>
