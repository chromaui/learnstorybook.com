---
title: 'Aansluiten data'
tocTitle: 'Data'
description: 'Leer hoe je data kunt doorgeven aan je UI component'
commit: '94b134e'
---

Tot nu toe hebben we geïsoleerde stateless componenten gemaakt - geweldig voor Storybook, maar uiteindelijk niet nuttig totdat we ze wat data geven in onze app.

Deze tutorial richt zich niet op de details van het bouwen van een app, dus we zullen hier niet dieper op ingaan. Maar we zullen wel even de tijd nemen om te kijken naar een algemeen patroon om data door te geven met containercomponenten.

## Container componenten

Onze `TaskList` component zoals momenteel geschreven is 'presentational' (zie [deze blogpost](https://medium.com/@dan_abramov/smart-and-dumb-components-7ca2f9a7c7d0)) omdat deze niet praat met iets extern behalve zijn eigen implementatie. Om data erin te krijgen, hebben we een "container" nodig.

Dit voorbeeld gebruikt [Redux](https://redux.js.org/), de meest populaire React library voor het opslaan van data, om een eenvoudig data model voor onze app te bouwen. Het hier gebruikte patroon is echter net zo goed van toepassing op andere data management libraries zoals [Apollo](https://www.apollographql.com/client/) en [MobX](https://mobx.js.org/).

Voeg een nieuwe dependency aan `package.json` toe met:

```bash
yarn add react-redux redux
```

Eerst zullen we een eenvoudige Redux store bouwen die reageert op acties die de status van taken veranderen, in een bestand met de naam `lib/redux.js` in de folder`src` (opzettelijk eenvoudig gehouden):

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

Vervolgens zullen we de default export van de component `TaskList` bijwerken om verbinding te maken met de Redux store en de taken te renderen waarin we geïnteresseerd zijn:

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

In dit stadium werken onze Storybook testen niet meer, omdat de `TaskList` nu een container is en geen props meer verwacht, maar in plaats daarvan verbinding maakt met de store en de props instelt op de component `PureTaskList` die wordt gewrapt.

We kunnen dit probleem echter eenvoudig oplossen door simpelweg de `PureTaskList` - de presentional component, waaraan we zojuist het `export` statement in de vorige stap hebben toegevoegd - in onze Storybook stories te renderen:

```javascript
// src/components/TaskList.stories.js

import React from 'react';
import { storiesOf } from '@storybook/react';

import { PureTaskList } from './TaskList';
import { task, actions } from './Task.stories';

export const defaultTasks = [
  { ...task, id: '1', title: 'Task 1' },
  { ...task, id: '2', title: 'Task 2' },
  { ...task, id: '3', title: 'Task 3' },
  { ...task, id: '4', title: 'Task 4' },
  { ...task, id: '5', title: 'Task 5' },
  { ...task, id: '6', title: 'Task 6' },
];

export const withPinnedTasks = [
  ...defaultTasks.slice(0, 5),
  { id: '6', title: 'Task 6 (pinned)', state: 'TASK_PINNED' },
];

storiesOf('TaskList', module)
  .addDecorator((story) => <div style={{ padding: '3rem' }}>{story()}</div>)
  .add('default', () => <PureTaskList tasks={defaultTasks} {...actions} />)
  .add('withPinnedTasks', () => <PureTaskList tasks={withPinnedTasks} {...actions} />)
  .add('loading', () => <PureTaskList loading tasks={[]} {...actions} />)
  .add('empty', () => <PureTaskList tasks={[]} {...actions} />);
```

<video autoPlay muted playsInline loop>
  <source
    src="/intro-to-storybook/finished-tasklist-states.mp4"
    type="video/mp4"
  />
</video>

Op een gelijkaardige manier moeten we `PureTaskList` gebruiken in onze Jest testen:

```js
// src/components/TaskList.test.js

import React from 'react';
import ReactDOM from 'react-dom';
import { PureTaskList } from './TaskList';
import { withPinnedTasks } from './TaskList.stories';

it('renders pinned tasks at the start of the list', () => {
  const div = document.createElement('div');
  const events = { onPinTask: jest.fn(), onArchiveTask: jest.fn() };
  ReactDOM.render(<PureTaskList tasks={withPinnedTasks} {...events} />, div);

  // We expect the task titled "Task 6 (pinned)" to be rendered first, not at the end
  const lastTaskInput = div.querySelector('.list-item:nth-child(1) input[value="Task 6 (pinned)"]');
  expect(lastTaskInput).not.toBe(null);

  ReactDOM.unmountComponentAtNode(div);
});
```
