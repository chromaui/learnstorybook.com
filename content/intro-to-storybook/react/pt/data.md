---
title: 'Ligação de dados'
tocTitle: 'Dados'
description: 'Aprenda a efetuar a ligação de dados ao seu componente de interface de utilizador'
commit: 'f9eaeef'
---

Até agora foram criados componentes sem estado e isolados, o que é fantástico para Storybook, mas em última análise não são úteis até que for fornecido algum tipo de dados da aplicação

Este tutorial não foca particularmente na construção de uma aplicação, como tal não vamos aprofundar muito este aspeto. Mas será feito um aparte para olhar para um padrão comum para ligação de dados com componentes contentor.

## Componentes contentor

O componente `TaskList` na sua presente forma é um componente de "apresentação" (ver [este post no blog](https://medium.com/@dan_abramov/smart-and-dumb-components-7ca2f9a7c7d0)), de forma que este não comunica com nada externo além de si.
Para conter dados, irá ser necessário um "contentor".

Este exemplo utiliza [Redux](https://redux.js.org/), que é a biblioteca mais popular quando se pretende guardar dados, ou construir um modelo de dados para a aplicação.
No entanto o padrão a ser usado aqui, pode ser aplicado a outras bibliotecas de gestão de dados tal como [Apollo](https://www.apollographql.com/client/) e [MobX](https://mobx.js.org/).

Adicione as dependências necessárias ao projeto através de:

```shell
yarn add react-redux redux
```

Irá ser construída (intencionalmente definida de forma simples) uma loja Redux, que responde ao desencadear de ações que alteram o estado das tarefas. Isto no ficheiro `lib/redux.js`, contido dentro de `src`

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

Em seguida o componente `Tasklist` irá ser alterado, para receber dados oriundos da loja e apresentar as tarefas que pretendemos:

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

Nesta altura os testes com Storybook terão deixado de funcionar, visto que `TaskList` é agora um contentor e como tal não está á espera de receber qualquer tipo de adereços (props), ao invés disso conecta-se á loja e define os adereços (props) para o componente `PureTaskList` que está a envolver.

No entanto este problema pode ser resolvido com relativa facilidade, ao renderizar-se o componente de apresentação `PureTaskList` nas estórias do Storybook:

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
Se os testes snapshot falharem, deverá ter que atualizar os snapshots existentes, executando o comando de testes de novo com a flag -u. Como a nossa aplicação está a crescer exponencialmente, poderá ser agora um bom momento para executar os testes com a opção <code> --watchAll</code> tal como mencionado na <a href="/intro-to-storybook/react/pt/get-started">introdução</a>
</div>
