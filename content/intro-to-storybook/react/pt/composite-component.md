---
title: 'Construção de um componente composto'
tocTitle: 'Componente composto'
description: 'Construção de um componente composto a partir de componentes simples'
commit: 'f9b2cfb'
---

No capitulo anterior, construímos o nosso primeiro componente, neste capítulo iremos estender o que aprendemos para construir nossa TaskList, ou seja uma lista de Tasks. Vamos combinar componentes e ver o que acontece quando mais complexidade é introduzida.

## TaskList

A Taskbox dá prioridade as tarefas que foram fixadas (pinned), através do seu posicionamento acima das tarefas do tipo padrão (default).
Isto gera duas variações da `TaskList`, para as quais você precisa criar histórias:
itens padrões (default) e itens fixados (pinned).

![Tarefas padrão e fixadas](/intro-to-storybook/tasklist-states-1.png)

Como os dados da `Task` podem ser enviados de forma assíncrona, **também** será necessário um estado de carregamento (loading) no componente para lidar com a renderização na ausência de uma conexão. E além deste, um estado vazio (empty) é necessário quando não há tarefas.

![Tarefas vazias e carregamento](/intro-to-storybook/tasklist-states-2.png)

## Preparação

Um componente composto não é muito diferente dos componentes básicos que ele contém. Comece por criar um componente `TaskList` e o ficheiro história que o acompanha em:
`src/components/TaskList.js` e `src/components/TaskList.stories.js`.

Comece com uma implementação básica da `TaskList`. Será necessário importar o componente `Task` criado anteriormente e passar os atributos e as ações como inputs.

```js:title=src/components/TaskList.js
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

Em seguida iremos criar os estados de teste do `TaskList` no seu arquivo de história.

```js:title=src/components/TaskList.stories.js
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
💡 Os <a href="https://storybook.js.org/docs/react/writing-stories/decorators"><b>Decoradores</b></a>, oferecem uma forma de envolver arbitráriamente as histórias. Neste caso, estamos usando um decorador `key` na exportação padrão para adicionar algum `padding` em torno do componente renderizado. Mas também podem ser usados para envolver as histórias definidas em "providers", ou seja, bibliotecas ou componentes que usam o contexto React.
</div>

Ao importar `TaskStories`, fomos capazes de [compor](https://storybook.js.org/docs/react/writing-stories/args#args-composition) os argumentos (abreviação de args) em nossas histórias com o mínimo de esforço. Dessa forma, os dados e ações (callbacks simulados) esperados por ambos os componentes são preservados.

Agora verifique o Storybook com as histórias novas associadas á `Tasklist`.

<video autoPlay muted playsInline loop>
  <source
    src="/intro-to-storybook/inprogress-tasklist-states-6-0.mp4"
    type="video/mp4"
  />
</video>

## Definir os estados

O componente ainda se encontra num estado bruto, mas já temos uma ideia de quais são as estórias com que temos que trabalhar. Poderá estar a pensar que ao usar-se o `.list-items` no componente como invólucro é deveras simples. Mas tem razão, na maioria dos casos não iria ser criado um novo componente somente para adicionar um invólucro. A **verdadeira complexidade** do componente `TaskList` é revelada com os casos extremos `WithPinnedTasks`, `loading` e `empty`.

```javascript
// src/components/TaskList.js

import React from 'react';

import Task from './Task';

function TaskList({ loading, tasks, onPinTask, onArchiveTask }) {
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

export default TaskList;
```

O markup adicional irá resultar no seguinte interface de utilizador:

<video autoPlay muted playsInline loop>
  <source
    src="/intro-to-storybook/finished-tasklist-states.mp4"
    type="video/mp4"
  />
</video>

Repare na posição do item que está confirmado na lista. Pretende-se que este item seja renderizado no topo da lista e torná-lo uma prioridade aos utilizadores.

## Requisitos de dados e adereços

À medida que o componente tem tendência em crescer, o mesmo irá acontecer com os seus requisitos. Visto que `Task` é um componente filho, é necessário fornecer os dados estruturados corretamente ao componente `TaskList` de forma que possa ser renderizado corretamente.
De forma a poupar tempo podemos reutilizar os adereços (propTypes) que foram definidos anteriormente no componente `Task`.

```javascript
// src/components/TaskList.js

import React from 'react';
import PropTypes from 'prop-types';

import Task from './Task';

function TaskList() {
  ...
}


TaskList.propTypes = {
  loading: PropTypes.bool,
  tasks: PropTypes.arrayOf(Task.propTypes.task).isRequired,
  onPinTask: PropTypes.func.isRequired,
  onArchiveTask: PropTypes.func.isRequired,
};

TaskList.defaultProps = {
  loading: false,
};

export default TaskList;
```

## Testes automatizados

No capítulo anterior, aprendemos a usar o Storyshots para efetuar testes snapshot nas estórias. Com o componente `Task` não existia muita complexidade para testar além do sucesso da renderização. Visto que o componente `TaskList` adiciona uma camada extra de complexidade, pretende-se verificar que determinados valores de entrada produzam determinados valores de saída, isto implementado de forma responsável para os testes automáticos. Para tal irão ser criados testes unitários utilizando [Jest](https://facebook.github.io/jest/) em conjunção com um renderizador de testes.

![Jest logo](/intro-to-storybook/logo-jest.png)

## Testes unitários com Jest

As estórias criadas com o Storybook em conjunção com os testes visuais manuais e testes de snapshot (tal como mencionado acima) irão prevenir em larga escala problemas futuros no interface de utilizador. Se as estórias definidas abrangerem uma ampla variedade de casos do componente e forem usadas ferramentas que garantam verificações por parte humana, irá resultar num decréscimo de erros.

No entanto, por vezes o diabo encontra-se nos detalhes. É necessária uma framework de testes explicita acerca deste tipo de detalhes. O que nos leva aos testes unitários.

Neste caso pretende-se que o nosso `TaskList` faça a renderização de quaisquer tarefas que foram confirmadas **antes** das não confirmadas que são fornecidas ao adereço (prop) `tasks`.
Apesar de existir uma estória (`withPinnedTasks`) que testa este cenário em particular; este poderá levar a alguma ambiguidade da parte humana, ou seja se o componente **parar** de ordenar as tarefas desta forma, logo existe um problema. Mas ao olho destreinado não irá gritar **"Erro!"**.

De forma a evitar este problema em concreto, podemos usar o Jest, de forma que este renderize a estória na DOM e efetue pesquisas de forma a verificar o output.

Iremos começar por criar um ficheiro de testes denominado `TaskList.test.js`. Neste ficheiro estarão contidos os testes que irão fazer asserções acerca do valor de saída.

```javascript
// src/components/TaskList.test.js

import React from 'react';
import ReactDOM from 'react-dom';
import { WithPinnedTasks } from './TaskList.stories';

it('renders pinned tasks at the start of the list', () => {
  const div = document.createElement('div');
  ReactDOM.render(<WithPinnedTasks />, div);

  // We expect the task titled "Task 6 (pinned)" to be rendered first, not at the end
  const lastTaskInput = div.querySelector('.list-item:nth-child(1) input[value="Task 6 (pinned)"]');
  expect(lastTaskInput).not.toBe(null);

  ReactDOM.unmountComponentAtNode(div);
});
```

![Execução de testes da TaskList](/intro-to-storybook/tasklist-testrunner.png)

Podemos verificar que foi possível reutilizar a lista de tarefas `withPinnedTasks` quer na estória, quer no teste unitário. Desta forma podemos continuar a aproveitar um recurso existente (os exemplos que representam configurações de um componente) de cada vez mais formas.

Mas também que este teste é algo frágil. É possível que á medida que o projeto amadurece, a implementação concreta do componente `Task` seja alterada; isto quer pelo uso de uma classe com um nome diferente ou um elemento `textarea` ao invés de um `input`, por exemplo--com isto, este teste específico irá falhar e será necessária uma atualização. Isto não é necessariamente um problema, mas um indicador para ser cuidadoso no uso liberal de testes unitários para o interface de utilizador. Visto que não são de fácil manutenção. Ao invés deste tipo de testes, é preferível depender de testes visuais, snapshot ou de regressão visual (ver [capitulo de testes](/intro-to-storybook/react/pt/test/)) sempre que for possível.
