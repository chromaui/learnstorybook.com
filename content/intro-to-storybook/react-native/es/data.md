---
title: 'Introducir datos'
tocTitle: 'Datos'
description: 'Aprende como introducir datos a tus componentes UI'
---

Hasta ahora hemos creado componentes aislados sin estado, muy útiles para Storybook, pero finalmente no son útiles hasta que les proporcionemos algunos datos en nuestra aplicación.

Este tutorial no se centra en los detalles de la construcción de una aplicación, por lo que no profundizaremos en esos detalles aquí. Pero, nos tomaremos un momento para observar un patrón común para introducir datos con componentes contenedores.

## Componentes contenedores

Nuestro componente `TaskList` como lo hemos escrito es de “presentación” (ver [artículo al respecto](https://medium.com/@dan_abramov/smart-and-dumb-components-7ca2f9a7c7d0)), en el sentido que no se comunica con nada externo a su implementación. Para poder pasarle datos, necesitaremos un "contenedor".

Este ejemplo utiliza [Redux](https://redux.js.org/), la librería mas popular de React para almacenar datos, que básicamente nos permite crear un modelo simple de datos para la aplicación. De todos modos, el patrón que utilizaremos también se aplica a otras librerías de manejo de datos como [Apollo](https://www.apollographql.com/client/) y [MobX](https://mobx.js.org/).

Agregue las dependencias necesarias a su proyecto con:

```bash
yarn add react-redux redux
```

Primero, construiremos un store Redux estándar que responda a acciones que cambien el estado de las tareas, en un archivo llamado `lib/redux.js` (intencionalmente simple):

```javascript

// lib/redux.js

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

Luego se cambiará el componente `TaskList` para leer los datos del store. Pero primero, pasemos nuestra versión del componente existente al archivo `components/PureTaskList.js` que luego se incluirá en un contenedor.

En `components/PureTaskList.js`:

```javascript

//components/PureTaskList.js
import * as React from 'react';
import PropTypes from 'prop-types';
import Task from './Task';
import PercolateIcons from '../constants/Percolate';
import LoadingRow from './LoadingRow';
import { FlatList, Text, SafeAreaView, View } from 'react-native';
import { styles } from '../constants/globalStyles';

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

export default PureTaskList;
```

En `components/TaskList.js`:

```javascript

// components/TaskList.js
import * as React from 'react';
import PureTaskList from './PureTaskList';
import { connect } from 'react-redux';
import { archiveTask, pinTask } from '../lib/redux';

function TaskList({ tasks, onPinTask, onArchiveTask }) {
  const events = {
    onPinTask,
    onArchiveTask,
  };

  return <PureTaskList tasks={tasks} {...events} />;
}
export default connect(
  ({ tasks }) => ({
    tasks: tasks.filter(t => t.state === 'TASK_INBOX' || t.state === 'TASK_PINNED'),
  }),
  dispatch => ({
    onArchiveTask: id => dispatch(archiveTask(id)),
    onPinTask: id => dispatch(pinTask(id)),
  })
)(TaskList);
```

La razón para mantener separada la versión de la `TaskList` es porque es más fácil de probar y aislar. Como no depende de la presencia de un store, es mucho más fácil tratar desde una perspectiva de prueba. Cambiemos el nombre de `components/TaskList.stories.js` a `components/PureTaskList.stories.js`, con esto garantizamos que nuestras stories usen la versión actual:

```javascript

// components/PureTaskList.stories.js
import * as React from 'react';
import { View } from 'react-native';
import { styles } from '../constants/globalStyles';
import { storiesOf } from '@storybook/react-native';
import { task, actions } from './Task.stories';
import PureTaskList from './PureTaskList';

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

storiesOf('PureTaskList', module)
  .addDecorator(story => <View style={[styles.TaskBox, { padding: 48 }]}>{story()}</View>)
  .add('default', () => <PureTaskList tasks={defaultTasks} {...actions} />)
  .add('withPinnedTasks', () => <PureTaskList tasks={withPinnedTasks} {...actions} />)
  .add('loading', () => <PureTaskList loading tasks={[]} {...actions} />)
  .add('empty', () => <PureTaskList tasks={[]} {...actions} />);
```

<div class="aside"><p>No olvide actualizar el archivo de configuración Storybook (en<code>storybook/index.js</code> ) para reflejar estos cambios.</p></div>

<video autoPlay muted playsInline loop>
  <source
    src="/intro-to-storybook/finished-tasklist-states.mp4"
    type="video/mp4"
  />
</video>

Del mismo modo, necesitamos usar `PureTaskList` en nuestra prueba de Jest:

```javascript

// components/__tests__/TaskList.test.js
import * as React from 'react';
import {create} from 'react-test-renderer';
import PureTaskList from '../PureTaskList';
import { withPinnedTasks } from '../PureTaskList.stories';
import Task from '../Task';
describe('TaskList', () => {
    it('renders pinned tasks at the start of the list', () => {
        const events = { onPinTask: jest.fn(), onArchiveTask: jest.fn() };
        const tree = renderer.create(<PureTaskList tasks={withPinnedTasks} {...events} />);
        const rootElement= tree.root;
        const listofTasks= rootElement.findAllByType(Task);
        expect(listofTasks[0].props.task.title).toBe('Task 6 (pinned)');
    });
});
```

<div class="aside">Si sus pruebas de instantáneas fallan en esta etapa, debe actualizar las instantáneas existentes ejecutando el script de prueba con el indicador -u. O cree un nuevo script para abordar este problema.</div>
