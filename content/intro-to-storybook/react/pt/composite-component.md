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

O markup adicional irá resultar na seguinte interface (UI):

<video autoPlay muted playsInline loop>
  <source
    src="/intro-to-storybook/finished-tasklist-states-6-0.mp4"
    type="video/mp4"
  />
</video>

Repare na posição do item que está fixado na lista. Pretende-se que este item seja renderizado no topo da lista para torná-lo uma prioridade para nossos usuários.

## Requisitos de dados e adereços

Conforme o componente cresce, os requisitos de entrada também aumentam. Defina os requisitos de prop de `TaskList`. Como a `Task` é um componente filho, certifique-se de fornecer dados no formato correto para renderizá-lo. Para economizar tempo e dor de cabeça, reutilize os propTypes que você definiu na `Task` anterior.

```diff:title=src/components/TaskList.js
import React from 'react';
import PropTypes from 'prop-types';

import Task from './Task';

export default function TaskList() {
  ...
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

## Testes automatizados

No capítulo anterior, aprendemos a usar o Storyshots para efetuar testes de snapshot. Com o componente `Task` não existia muita complexidade para testar além do sucesso da renderização. Visto que o componente `TaskList` adiciona uma camada extra de complexidade, pretende-se verificar que determinados valores de entrada produzam determinados valores de saída de uma forma passível de teste automático. Para tal irão ser criados testes unitários utilizando [React Testing Library](https://testing-library.com/docs/react-testing-library/intro) and [@storybook/testing-react](https://storybook.js.org/addons/@storybook/testing-react).

![Testing library logo](/intro-to-storybook/testinglibrary-image.jpeg)

## Testes unitários com React Testing Library

As histórias criadas com o Storybook, testes manuais e testes de snapshot irão prevenir largamente problemas futuros na interface (UI). Se as histórias abrangerem uma ampla variedade de casos de uso do componente e forem usadas ferramentas que garantem que um humano verifique qualquer mudança na história, os erros serão muito menos prováveis.

No entanto, por vezes o diabo encontra-se nos detalhes. É necessária uma estrutura de teste que seja explícita sobre esses detalhes. O que nos leva aos testes unitários.

Neste caso pretende-se que o nosso `TaskList` faça a renderização das tarefas que foram fixadas **antes** das não fixadas que são fornecidas ao adereço (prop) `tasks`.
Apesar de existir uma história (`withPinnedTasks`) que testa este cenário em particular; este poderá levar a alguma ambiguidade da parte humana, ou seja se o componente **parar** de ordenar as tarefas desta forma, logo existe um problema. Mas ao olho destreinado não irá gritar **"Erro!"**.

De forma a evitar este problema em concreto, podemos usar o React Testing Library, de forma que este renderize a história na DOM e execute algum código de consulta DOM para verificar os recursos salientes da saída.

Crie um arquivo de teste chamado `src/components/TaskList.test.js`. Aqui, estarão contidos os testes que irão fazer asserções sobre do valor de saída.

```js:title=src/components/TaskList.test.js
import { render } from '@testing-library/react';

import { composeStories } from '@storybook/testing-react';

import * as TaskListStories from './TaskList.stories'; //👈  Our stories imported here

//👇 composeStories will process all information related to the component (e.g., args)
const { WithPinnedTasks } = composeStories(TaskListStories);

it('renders pinned tasks at the start of the list', () => {
  const { container } = render(<WithPinnedTasks />);

  expect(
    container.querySelector('.list-item:nth-child(1) input[value="Task 6 (pinned)"]')
  ).not.toBe(null);
});
```

<div class="aside">
💡 <a href="">@storybook/testing-react</a> é um ótimo complemento que permite reutilizar suas histórias do Storybook em seus testes unitários. Ao reutilizar suas histórias em seus testes, você tem um catálogo de cenários de componentes prontos para serem testados. Além disso, todos os argumentos, decoradores e outras informações de sua história serão compostos por esta biblioteca. Como você acabou de ver, tudo o que você precisa fazer em seus testes é selecionar qual história renderizar.
</div>

![TaskList test runner](/intro-to-storybook/tasklist-testrunner.png)

Podemos verificar que foi possível reutilizar história `withPinnedTasks` em nosso teste de unidade; desta forma podemos continuar a aproveitar um recurso existente (os exemplos que representam configurações de um componente) de várias maneiras.

Observe também que este teste é bastante frágil. É possível que á medida que o projeto amadurece, a implementação concreta do componente `Task` seja alterada; isto quer pelo uso de uma classe com um nome diferente ou um elemento `textarea` ao invés de um `input`-- com isto, este teste específico irá falhar e será necessária uma atualização. Isto não é necessariamente um problema, mas um indicador para ser cuidadoso no uso liberal de testes unitários para a interface (UI). Visto que não são de fácil manutenção. Ao invés deste tipo de testes, é preferível depender de testes visuais, snapshot ou de regressão visual (ver [capitulo de testes](/intro-to-storybook/react/en/test/)) sempre que for possível.

<div class="aside">
💡 Não se esqueça de confirmar suas alterações com o git!
</div>
