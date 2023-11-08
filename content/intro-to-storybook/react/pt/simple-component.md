---
title: 'Construção de um componente simples'
tocTitle: 'Componente simples'
description: 'Construção de um componente simples isolado'
commit: '428c6f2'
---

Iremos construir o interface de utilizador de acordo com a metodologia de [Desenvolvimento orientada a componentes](https://www.componentdriven.org/), ou nativamente por (CDD, Component-Driven Development). É um processo que cria interfaces de utilizador a partir da base para o topo, iniciando com componentes e terminando com ecrãs. O DOC (CDD nativamente) ajuda no escalonamento da complexidade á qual o programador é sujeito á medida que constrói o interface de utilizador.

## Tarefa

![Componente Task ao longo de três estados](/intro-to-storybook/task-states-learnstorybook.png)

A `Task` é o componente nuclear da nossa aplicação. Cada tarefa é apresentada de forma diferente dependendo do estado em que se encontra.
O que vai ser apresentado é uma caixa de confirmação, selecionada (ou não), alguma informação adicional acerca da tarefa e um botão "fixador", que permite a movimentação para cima e para baixo das tarefas ao longo da lista.
Para que seja possível implementar isto serão necessárias os seguintes adereços (props):

- `title` - uma cadeia de caracteres que descreve a tarefa
- `state` - qual a lista em que a tarefa se encontra e se está confirmada?

Á medida que construimos a `Task`, é necessário definir os três estados que correspondem os três tipos de tarefa delineados acima.
Em seguida usa-se o Storybook para construir este componente isolado, usando dados predefinidos. Irá "testar-se visualmente" a aparência do componente para cada estado á medida que prosseguimos.

Este processo é algo similar ao [Desenvolvimento orientado a testes](https://en.wikipedia.org/wiki/Test-driven_development), ou como é conhecido nativamente (TDD), o que neste caso denominamos de "[DOT Visual](https://www.chromatic.com/blog/visual-test-driven-development)”, nativamente (Visual TDD).

## Configuração Inicial

Primeiro irá ser criado o componente tarefa e o ficheiro de estórias que o acompanha:
`src/components/Task.js` e `src/components/Task.stories.js` respetivamente.

Iremos iniciar por uma implementação rudimentar da `Task`, que recebe os atributos conhecidos até agora, assim como as duas ações que podem ser desencadeadas (a movimentação entre listas):

```jsx:title=src/components/Task.js
import React from 'react';

export default function Task({ task: { id, title, state }, onArchiveTask, onPinTask }) {
  return (
    <div className="list-item">
      <input type="text" value={title} readOnly={true} />
    </div>
  );
}
```

O bloco de código acima, quando renderizado, não é nada mais nada menos que a estrutura HTML da `Task` na aplicação Todos.

Em seguida irão ser criados os três testes ao estado da tarefa no ficheiro de estórias correspondente:

```js:title=src/components/Task.stories.js
import React from 'react';
import { action } from '@storybook/addon-actions';

import Task from './Task';

export default {
  component: Task,
  title: 'Task',
  // Our exports that end in "Data" are not stories.
  excludeStories: /.*Data$/,
};

export const taskData = {
  id: '1',
  title: 'Test Task',
  state: 'TASK_INBOX',
  updatedAt: new Date(2018, 0, 1, 9, 0),
};

export const actionsData = {
  onPinTask: action('onPinTask'),
  onArchiveTask: action('onArchiveTask'),
};

export const Default = () => <Task task={{ ...taskData }} {...actionsData} />;

export const Pinned = () => <Task task={{ ...taskData, state: 'TASK_PINNED' }} {...actionsData} />;

export const Archived = () => (
  <Task task={{ ...taskData, state: 'TASK_ARCHIVED' }} {...actionsData} />
);
```

Existem dois tipos de organização com Storybook. O componente em si e as estórias associadas. É preferível pensar em cada estória como uma permutação de um componente. Como tal podem existir tantas estórias, tantas as que forem necessárias.

- **Component**
  - Story
  - Story
  - Story

De forma a informar o Storybook acerca do componente que está a ser documentado, é criado um default export que contém:

- `component` -- o componente em si,
- `title` -- o nome que irá ser apresentado na barra lateral da aplicação Storybook,
- `excludeStories` -- Informação que é necessária à estória, mas que não deverá ser renderizada pela aplicação Storybook.

Para definir as nossas estórias, exportamos uma função para cada um dos casos de teste. A estória não é nada mais nada menos que uma função que devolve um elemento renderizado (por exemplo um componente com um conjunto de adereços) num determinado estado -- exatamente tal como um [Componente Funcional](https://reactjs.org/docs/components-and-props.html#function-and-class-components).

A função `action()` permite a criação de um callback, que irá surgir no painel adequado, ou seja o painel **actions** do interface de utilizador Storybook quando for feito o click. Como tal assim que for criado o botão para afixar tarefas, irá ser possível determinar o sucesso ou não do click no interface de utilizador de testes.

Visto que é necessário fornecer o mesmo conjunto de tarefas a todas as permutações do componente, é extremamente conveniente agrupar numa única variável denominada `actionsData` e usar a expansão de adereços (props) em React `{...actions}` de forma que possam ser enviados de uma só vez.
Usar `<Task {...actions}>` não é nada mais nada menos que `<Task onPinTask={actions.onPinTask} onArchiveTask={actions.onArchiveTask}>`.

Outro aspeto fantástico ao agrupar as `actions` necessárias ao componente na `actionsData`, é que as podemos exportar com recurso à clausula `export` de forma que seja possível serem usadas por estórias que reutilizam este componente, tal como iremos ver posteriormente.

Ao ser criada uma estória, é usada uma tarefa base (`taskData`) para definir a forma da tarefa em questão que é necessária ao componente. Geralmente modelada a partir de dados concretos. Mais uma vez o uso da cláusula `export`, neste caso para a estrutura dos dados irá permitir a sua reutilização em estórias futuras, tal como veremos.

<div class="aside">
    <a href="https://storybook.js.org/docs/react/essentials/actions"><b>Ações</b></a> ajudam na verificação das interações quando são construídos componentes de interface de utilizador isolados. Na grande maioria das vezes não existirá qualquer tipo de acesso ao estado e funções definidas no contexto da aplicação. Como tal é preferível o uso de<code>action()</code> para esta situação.
</div>

## Configuração

É necessário efetuar algumas alterações á configuração do Storybook, de forma que saiba não só onde procurar onde estão as estórias que acabámos de criar, mas também usar o CSS que foi adicionado no [capítulo anterior](/intro-to-storybook/react/pt/get-started).

Vamos começar por alterar o ficheiro de configuração do Storybook(`.storybook/main.js`) para o seguinte:

```js:title=.storybook/main.js
module.exports = {
  //👇 Location of our stories
  stories: ['../src/components/**/*.stories.js'],
  addons: [
    '@storybook/preset-create-react-app',
    '@storybook/addon-actions',
    '@storybook/addon-links',
  ],
};
```

Após efetuar esta alteração, uma vez mais dentro da pasta (ou diretório) `.storybook`, crie um novo ficheiro (ou arquivo) chamado `preview.js` com o seguinte conteúdo:

```js:title=.storybook/preview.js
import '../src/index.css'; //👈 The app's CSS file goes here
```

Após esta alteração, quando reiniciar o servidor Storybook, deverá produzir os casos de teste para os três diferentes estados da tarefa:

<video autoPlay muted playsInline controls >
  <source
    src="/intro-to-storybook//inprogress-task-states.mp4"
    type="video/mp4"
  />
</video>

## Construção dos estados

Neste momento já possuímos o Storybook configurado, os elementos de estilo importados, assim como os casos de teste, podemos agora iniciar a implementação HTML do componente de forma a igualar o design.

O componente neste momento ainda está algo rudimentar. Vamos fazer algumas alterações de forma a atingir o design pretendido, sem entrar em muitos detalhes:

```js:title=src/components/Task.js
import React from 'react';

export default function Task({ task: { id, title, state }, onArchiveTask, onPinTask }) {
  return (
    <div className={`list-item ${state}`}>
      <label className="checkbox">
        <input
          type="checkbox"
          defaultChecked={state === 'TASK_ARCHIVED'}
          disabled={true}
          name="checked"
        />
        <span className="checkbox-custom" onClick={() => onArchiveTask(id)} />
      </label>
      <div className="title">
        <input type="text" value={title} readOnly={true} placeholder="Input title" />
      </div>

      <div className="actions" onClick={(event) => event.stopPropagation()}>
        {state !== 'TASK_ARCHIVED' && (
          // eslint-disable-next-line jsx-a11y/anchor-is-valid
          <a onClick={() => onPinTask(id)}>
            <span className={`icon-star`} />
          </a>
        )}
      </div>
    </div>
  );
}
```

O markup adicional descrito acima, combinado com o CSS que foi importado anteriormente irá originar o seguinte interface de utilizador:

<video autoPlay muted playsInline loop>
  <source
    src="/intro-to-storybook/finished-task-states.mp4"
    type="video/mp4"
  />
</video>

## Especificação de requisitos de dados

É considerada boa prática usar `propTypes` com o React, de forma a especificar a forma que os dados assumem num componente. Não somente é auto documentável, mas ajuda a detetar problemas cedo.

```js:title=src/components/Task.js
import React from 'react';
import PropTypes from 'prop-types';

function Task() {
  ...
}

Task.propTypes = {
  task: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    state: PropTypes.string.isRequired,
  }),
  onArchiveTask: PropTypes.func,
  onPinTask: PropTypes.func,
};

export default Task;
```

Enquanto estivermos a desenvolver o nosso componente irá ser emitido um aviso sempre que o componente não for usado de forma correta.

<div class="aside">
  Uma forma alternativa de se atingir o mesmo resultado consiste no uso de um sistema de tipos Javascript tal como o TypeScript para criar um determinado tipo para as propriedades do componente.
</div>

## Componente construido!

Construímos com sucesso um componente, sem ser necessário qualquer tipo de servidor, ou que seja necessário executar a aplicação frontend. O próximo passo é construir os restantes componentes da Taskbox um por um de forma similar.

Como se pode ver, começar a construir componentes de forma isolada é fácil e rápido.
Com isto espera-se que seja possível construir um interface de utilizador de qualidade superior com um número de problemas menor e mais polido. Isto devido ao facto que é possível aprofundar e testar qualquer estado possível.

## Testes automatizados

O Storybook oferece uma forma fantástica de testar visualmente a aplicação durante o desenvolvimento. As "estórias" irão garantir que a tarefa não seja visualmente destruída á medida que a aplicação continua a ser desenvolvida. Mas no entanto continua a ser um processo manual neste momento e alguém terá que fazer o esforço de clicar em cada estado de teste de forma a garantir que irá renderizar sem qualquer tipo de problemas. Não poderíamos automatizar isto?

## Testes de snapshot

Este tipo de testes refere-se á pratica de guardar o output considerado "bom" de um determinado componente com base num input e marcar o componente caso o output seja alterado. Isto complementa o Storybook, visto que é uma forma rápida de se visualizar a nova versão de um componente e verificar as alterações feitas.

<div class="aside">
  É necessário garantir que os componentes renderizam dados que não serão alterados, de forma a garantir que os testes snapshot não falhem sempre. É necessário ter atenção a datas ou valores gerados aleatoriamente.
</div>

Com o [extra Storyshots](https://github.com/storybooks/storybook/tree/master/addons/storyshots) é criado um teste de snapshot para cada uma das estórias. Para que este possa ser usado, adicionam-se as seguintes dependências de desenvolvimento:

```shell
yarn add -D @storybook/addon-storyshots react-test-renderer
```

Quando esta operação terminar, será necessário criar o ficheiro `src/storybook.test.js` com o seguinte conteúdo:

```js:title=src/storybook.test.js
import initStoryshots from '@storybook/addon-storyshots';
initStoryshots();
```

E é só isto, podemos agora executar o comando `yarn test` e verificar o seguinte resultado:

![Task test runner](/intro-to-storybook/task-testrunner.png)

Temos à nossa disposição um teste de snapshot para cada uma das estórias da `Task`. Se a implementação da `Task` for alterada, será apresentada uma notificação para serem verificadas a alterações que foram feitas.
