---
title: "Construção de um componente composto"
tocTitle: "Componente composto"
description: "Construção de um componente composto a partir de componentes simples"
commit: 8db511e
---

No capitulo anterior, construímos o nosso primeiro componente, neste capitulo iremos estender o que foi dito até agora, para que possamos construir a nossa TaskList, ou seja uma lista de Tasks. Vamos combinar componentes e ver o que irá acontecer quando é adicionada alguma complexidade.

## TaskList

A Taskbox dá prioridade a tarefas que foram confirmadas através do seu posicionamento acima de quaisquer outras.
Isto gera duas variações da `TaskList`, para o qual será necessária a criação de estórias:
os itens normais e itens normais e itens confirmados.

![tarefas confirmadas e padrão](/tasklist-states-1.png)

Visto que os dados para a `Task` podem ser enviados de forma assíncrona, **irá ser** necessário um estado no componente para lidar com a ausência de qualquer tipo de conexão. E além deste um estado extra para lidar com a inexistência de tarefas.

![Tarefas vazias e carregamento](/tasklist-states-2.png)

## Preparação

Um componente composto não é em nada diferente do componente básico contido dentro deste. Comece por criar um componente `TaskList` e o ficheiro estória que o acompanha em:
`src/components/TaskList.js` e `src/components/TaskList.stories.js` respetivamente.

Comece por uma implementação em bruto da `TaskList`. Será necessário importar o componente `Task` criado anteriormente e injetar os atributos e as respetivas ações como inputs.

```javascript
import React from "react";

import Task from "./Task";

function TaskList({ loading, tasks, onPinTask, onArchiveTask }) {
  const events = {
    onPinTask,
    onArchiveTask
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

export default TaskList;
```

Em seguida iremos criar os estados de teste do `TaskList` no ficheiro de estórias respetivo.

```javascript
import React from "react";
import { storiesOf } from "@storybook/react";

import TaskList from "./TaskList";
import { task, actions } from "./Task.stories";

export const defaultTasks = [
  { ...task, id: "1", title: "Task 1" },
  { ...task, id: "2", title: "Task 2" },
  { ...task, id: "3", title: "Task 3" },
  { ...task, id: "4", title: "Task 4" },
  { ...task, id: "5", title: "Task 5" },
  { ...task, id: "6", title: "Task 6" }
];

export const withPinnedTasks = [
  ...defaultTasks.slice(0, 5),
  { id: "6", title: "Task 6 (pinned)", state: "TASK_PINNED" }
];

storiesOf("TaskList", module)
  .addDecorator(story => <div style={{ padding: "3rem" }}>{story()}</div>)
  .add("default", () => <TaskList tasks={defaultTasks} {...actions} />)
  .add("withPinnedTasks", () => (
    <TaskList tasks={withPinnedTasks} {...actions} />
  ))
  .add("loading", () => <TaskList loading tasks={[]} {...actions} />)
  .add("empty", () => <TaskList tasks={[]} {...actions} />);
```

A função `addDecorator()` permite que seja adicionado algum "contexto" á renderização de cada tarefa. Neste caso a lista é envolvida com um ligeiro preenchimento, de forma que seja possível ser feita uma verificação visual com maior eficácia.

<div class="aside">
    Os <a href="https://storybook.js.org/addons/introduction/#1-decorators"><b>Decoradores</b></a>, oferecem uma forma de embrulho arbitrária ás estórias. Neste caso estamos a usar um decorador para gerar elementos de estilo. Mas podem ser usados para envolver as estórias definidas em "providers", nomeadamente, bibliotecas ou componentes que usam o contexto React.
</div>

O adereço `task` irá definir a forma da `Task` que foi criada e exportada a partir do ficheiro `Task.stories.js`. E como tal, as `actions` irão definir quais as ações (através de uma callback simulada) que o componente `Task` se encontra á espera. Cujas quais também necessárias á `TaskList`.

Pode agora verificar-se o Storybook com as estórias novas associadas á `Tasklist`.

<video autoPlay muted playsInline loop>
  <source
    src="/inprogress-tasklist-states.mp4"
    type="video/mp4"
  />
</video>

## Definir os estados

O componente ainda se encontra num estado bruto, mas temos já uma ideia de quais são as estórias com que temos que trabalhar. Poderá estar a pensar que o embrulho `.list-items` é deveras simples. Mas tem razão, na maioria dos casos não iria ser criado um novo componente somente para adicionar um embrulho. A **verdadeira complexidade** do componente `TaskList` é revelada com os casos extremos `withPinnedTasks`, `loading` e `empty`.

```javascript
import React from "react";

import Task from "./Task";

function TaskList({ loading, tasks, onPinTask, onArchiveTask }) {
  const events = {
    onPinTask,
    onArchiveTask
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
    ...tasks.filter(t => t.state === "TASK_PINNED"),
    ...tasks.filter(t => t.state !== "TASK_PINNED")
  ];

  return (
    <div className="list-items">
      {tasksInOrder.map(task => (
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
    src="/finished-tasklist-states.mp4"
    type="video/mp4"
  />
</video>

Reparem na posição do item confirmado na lista. Pretende-se que este item seja renderizado no topo da lista e torná-lo uma prioridade aos utilizadores.

## Requisitos de dados e adereços

Á medida que o componente tem tendência em crescer, o mesmo irá acontecer com os seus requisitos. Visto que `Task` é um componente filho, é necessário fornecer os dados estruturados correctamente ao componente `TaskList` de forma que possa ser renderizado correctamente.
De forma a poupar tempo podemos reutilizar os adereços (propTypes) que foram definidos anteriormente no componente `Task`.

```javascript
import React from 'react';
import PropTypes from 'prop-types';

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

No capitulo anterior, aprendeu-se a usar o Storyshots para implementar estórias de testes snapshot. Com o componente `Task` não existia muita complexidade para testar além do sucesso da renderização. Visto que o componente `TaskList` adiciona uma camada extra de complexidade, pretende-se verificar que determinados valores de entrada produzam determinados valores de saída, isto implementado de forma responsável para os testes automáticos. Para tal irão ser criados testes unitários utilizando [Jest](https://facebook.github.io/jest/) em conjunção com um renderizador de testes como por exemplo [Enzyme](http://airbnb.io/enzyme/).

![Jest logo](/logo-jest.png)

## Testes unitários com Jest

As estórias criadas com o Storybook em conjunção com os testes visuais manuais e testes de snapshot (tal como mencionado acima) irão prevenir em larga escala problemas futuros no interface de utilizador. Se as estórias definidas abrangerem uma ampla variedade de casos do componente e forem usadas ferramentas que garantam verificações por parte humana, irá resultar num decréscimo de erros.

No entanto, por vezes o diabo encontra-se nos detalhes. É necessária uma framework de testes explicita acerca deste tipo de detalhes. O que nos leva aos testes unitários.

Neste caso pretende-se que o nosso `TaskList` faça a renderização de quaisquer tarefas que foram confirmadas **antes** das não confirmadas que são fornecidas ao adereço (prop) `tasks`.
Apesar de existir uma estória (`withPinnedTasks`) que testa este cenário em particular; este poderá levar a alguma ambiguidade da parte humana, ou seja se o componente **parar** de ordenar as tarefas desta forma, logo existe um problema. Mas ao olho destreinado não irá gritar **"Erro!"**.

De forma a evitar este problema em concreto, podemos usar o Jest, de forma que este renderize a estória na DOM e efetue pesquisas de forma a verificar o output.

Iremos começar por criar um ficheiro de testes denominado `TaskList.test.js`. Neste ficheiro estarão contidos os testes que irão fazer asserções acerca do valor de saída.

```javascript
import React from "react";
import ReactDOM from "react-dom";
import TaskList from "./TaskList";
import { withPinnedTasks } from "./TaskList.stories";

it("renders pinned tasks at the start of the list", () => {
  const div = document.createElement("div");
  const events = { onPinTask: jest.fn(), onArchiveTask: jest.fn() };
  ReactDOM.render(<TaskList tasks={withPinnedTasks} {...events} />, div);

  // We expect the task titled "Task 6 (pinned)" to be rendered first, not at the end
  const lastTaskInput = div.querySelector(
    '.list-item:nth-child(1) input[value="Task 6 (pinned)"]'
  );
  expect(lastTaskInput).not.toBe(null);

  ReactDOM.unmountComponentAtNode(div);
});
```

![Execução de testes da TaskList](/tasklist-testrunner.png)

Podemos verificar que foi possível reutilizar a lista de tarefas `withPinnedTasks` quer na estória, quer no teste unitário. Desta forma podemos continuar a aproveitar um recurso existente(os exemplos que representam configurações de um componente) de cada vez mais formas.

Mas também que este teste é algo frágil. É possível que á medida que o projeto amadurece, a implementação concreta do componente `Task` seja alterada; isto quer pelo uso de uma classe com um nome diferente ou um elemento `textarea` ao invés de um `input`, por exemplo--com isto, este teste específico irá falhar e será necessária uma atualização. Isto não é necessariamente um problema, mas um indicador para ser cuidadoso no uso liberal de testes unitários para o interface de utilizador. Visto que não são de fácil manutenção. Ao invés deste tipo de testes, é preferível depender de testes visuais, snapshot ou de regressão visual (ver [capitulo de testes](/react/pt/test/)) sempre que for possível.
