---
title: "Construção de um componente siples"
tocTitle: "Componente simples"
description: "Construção de um componente simples isolado"
commit: 403f19a
---

Iremos construir o interface de utilizador de acordo com a metodologia de [Desenvolvimento orientada a componentes](https://blog.hichroma.com/component-driven-development-ce1109d56c8e), ou nativamente por (CDD, Component-Driven Development). É um processo que cria interfaces de utilizador a partir da base para o topo, iniciando com componentes e terminando com ecrãs. O DOC(CDD nativamente) ajuda no escalonamento da complexidade á qual o programador é sujeito á medida que constrói o interface de utilizador.

## Tarefa

![Componente Task ao longo de três estados](/task-states-learnstorybook.png)

`Task` é o componente nuclear da nossa aplicação. Cada tarefa é apresentada de forma diferente dependendo do estado em que se encontra. 
O que vai ser apresentado é uma caixa de confirmação, selecionada (ou não), alguma informação adicional acerca da tarefa e um botão "fixador", que permite a movimentação para cima e para baixo das tarefas ao longo da lista. 
Para que seja possível implementar isto serão necessárias os seguintes adereços (props):

* `title` - uma cadeia de caracteres que descreve a tarefa
* `state` - qual a lista em que a tarefa se encontra e se está confirmada?

Á medida que construimos a `Task`, é necessário definir os três estados que correspondem os três tipos de tarefa delineados acima.
Em seguida usa-se o Storybook para construir este componente isolado, usando dados predefinidos. Irá "testar-se visualmente" a aparência do componente para cada estado á medida que prosseguimos.

Este processo é algo similar ao [Desenvolvimento orientado a testes](https://en.wikipedia.org/wiki/Test-driven_development), ou como é conhecido nativamente (TDD), o que neste caso denominamos de "[DOT Visual](https://blog.hichroma.com/visual-test-driven-development-aec1c98bed87)”, nativamente (Visual TDD).

## Configuração Inicial

Primeiro irá ser criado o componente tarefa e o ficheiro de estórias que o acompanha:
`src/components/Task.js` e `src/components/Task.stories.js` respetivamente.

Iremos iniciar por uma implementação básica da `Task`, que recebe os atributos conhecidos até agora, assim como as duas ações que podem ser desencadeadas (a movimentação entre listas):

```javascript
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

```javascript
import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import Task from './Task';

export const task = {
  id: '1',
  title: 'Test Task',
  state: 'TASK_INBOX',
  updatedAt: new Date(2018, 0, 1, 9, 0),
};

export const actions = {
  onPinTask: action('onPinTask'),
  onArchiveTask: action('onArchiveTask'),
};

storiesOf('Task', module)
  .add('default', () => <Task task={task} {...actions} />)
  .add('pinned', () => <Task task={{ ...task, state: 'TASK_PINNED' }} {...actions} />)
  .add('archived', () => <Task task={{ ...task, state: 'TASK_ARCHIVED' }} {...actions} />);
```

Existem dois tipos de organização com Storybook. O componente em si e as estórias associadas. É preferível pensar em cada estória como uma permutação de um componente. Como tal podem existir tantas estórias, tantas as que forem necessárias.

* **Component**
  * Story
  * Story
  * Story

Ao ser invocada a função `storiesOf()`, está a registar-se o componente, e com isto o processo de arranque do Storybook. É adicionado um nome, nome esse que será usado na barra lateral da aplicação Storybook para identificar o componente.

A função `action()` permite a criação de um callback, que irá surgir no painel adequado, ou seja o painel **actions** do interface de utilizador Storybook quando for feito o click. Como tal assim que for criado o botão para afixar tarefas, irá ser possível determinar o sucesso ou não do click no interface de utilizador de testes.

Visto que é necessário fornecer o mesmo conjunto de tarefas a todas as permutações do componente, é extremamente conveniente agrupar numa única variável denominada `actions` e usar a expansão de adereços (props) em React `{...actions}` de forma que possam ser enviados de uma só vez.
Usar `<Task {...actions}>` não é nada mais nada menos que `<Task onPinTask={actions.onPinTask} onArchiveTask={actions.onArchiveTask}>`.

Outro aspeto fantástico ao agrupar as `actions` necessárias ao componente, é que as podemos exportar com recurso á clausula `export` de forma que seja possível serem usadas por estórias que reutilizam este componente, tal como se poderá ver futuramente.

Para definir as estórias, invoca-se o metodo `add()`, uma única vez para cada um dos estados de teste, de forma a gerar uma estória. A estória ação é uma função que irá retornar um elemento renderizado( ou seja, uma classe de componente com um conjunto de adereços (props)) para um determinado estado, tal como [Componente funcional sem estado](https://reactjs.org/docs/components-and-props.html), ou nativamente (Stateless Functional Component).

Ao ser criada uma estória, é usada uma tarefa base (`task`) para definir a forma da tarefa em questão que é necessária ao componente. Geralmente modelada a partir de dados concretos. Mais uma vez o uso da cláusula `export`, neste caso para a estrutura dos dados irá permitir a sua reutilização em estórias futuras, tal como veremos.

<div class="aside">
    <a href="https://storybook.js.org/addons/introduction/#2-native-addons"><b>Ações</b></a> ajudam na verificação das interações quando são construídos componentes de interface de utilizador isolados. Na grande maioria das vezes não existirá qualquer tipo de acesso ao estado e funções definidas no contexto da aplicação. Como tal é preferível o uso de<code>action()</code> para esta situação.
</div>

## Configuração

Será necessária uma alteração minúscula ao ficheiro de configuração do Storybook (`storybook/config.js`) de forma que este reconheça os ficheiros com extensão `stories.js`, mas também utilize o ficheiro CSS.
Por norma o Storybook pesquisa numa pasta denominada `/stories` para conter as estórias; este tutorial usa uma nomenclatura similar a `.test.js`, cuja qual favorecida pelo CRA para testes automatizados.

```javascript
import { configure } from '@storybook/react';
import '../src/index.css';

const req = require.context('../src', true, /\.stories.js$/);

function loadStories() {
  req.keys().forEach(filename => req(filename));
}

configure(loadStories, module);
```

Após esta alteração, ao ser reiniciado o servidor Storybook, deverá produzir os casos de teste para os três estados definidos para a tarefa:

<video autoPlay muted playsInline controls >
  <source
    src="/inprogress-task-states.mp4"
    type="video/mp4"
  />
</video>


## Especificação de requisitos de dados

É boa prática serem usados `propTypes` React de forma a especificar a forma que os dados tomam para um componente. Não somente é auto documentável, mas ajuda a detectar problemas cedo.

```javascript
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

Com isto irá surgir um aviso no modo de desenvolvimento quando o componente Task for mal utilizado.

<div class="aside">
  Uma forma alternativa de se atingir o mesmo resultado consiste no uso de um sistema de tipos Javascript tal como o TypeScript para criar um determinado tipo para as propriedades do componente.
</div>

## Componente construido!

Foi construído com sucesso, sem ser necessário qualquer tipo de servidor, ou que seja necessário executar a aplicação frontend. O próximo passo é construir os restantes componentes da Taskbox um por um de forma similar.

Como se pode ver, começar a construir componentes isoladamente é fácil e rápido.
Com isto espera-se que seja possível construir um interface de utilizador de qualidade superior com um número de problemas menor e mais polido. Isto devido ao facto que é possível aprofundar e testar qualquer estado possível.

## Testes automatizados

O Storybook oferece uma forma fantástica de testar visualmente a aplicação durante o desenvolvimento. As "estórias" irão garantir que a tarefa não seja visualmente destruída á medida que a aplicação continua a ser desenvolvida. Mas no entanto continua a ser um processo manual neste momento e alguém terá que fazer o esforço de clickar em cada estado de teste de forma a garantir que irá renderizar sem qualquer tipo de problemas. Não poderíamos automatizar isto?

## Testes de snapshot

Este tipo de testes refere-se á pratica de guardar o output considerado "bom" de um determinado componente com base num input e marcar o componente caso o output seja alterado. Isto complementa o Storybook, visto que é uma forma rápida de se visualizar a nova versão de um componente e verificar as alterações.

<div class="aside">
  É necessário garantir que os componentes renderizam dados que não serão alterados, de forma a garantir que os testes snapshot não falhem sempre. É necessário ter atenção a datas ou valores gerados aleatoriamente.
</div>

Com o [extra Storyshots](https://github.com/storybooks/storybook/tree/master/addons/storyshots) é criado um teste de snapshot para cada uma das estórias. Para que este possa ser usado, adiciona-se a dependência de desenvolvimento:

```bash
yarn add --dev @storybook/addon-storyshots react-test-renderer require-context.macro
```

Quando esta operação terminar, será necessário criar o ficheiro `src/storybook.test.js` com o seguinte conteúdo:

```javascript
import initStoryshots from '@storybook/addon-storyshots';
initStoryshots();
```

Será necessário usar uma [macro babel](https://github.com/kentcdodds/babel-plugin-macros), de forma a garantir que `require.context` seja executado pelo Jest (o nosso contexto de testes), para isso atualiza-se o conteúdo do ficheiro `.storybook/config.js` (de forma a que o webpack faça a sua magia):

```js
import { configure } from '@storybook/react';
import requireContext from 'require-context.macro';

import '../src/index.css';

const req = requireContext('../src/components', true, /\.stories\.js$/);

function loadStories() {
  req.keys().forEach(filename => req(filename));
}

configure(loadStories, module);
```

(Note-se que foi substituído `require.context` com uma invocação de `requireContext` importada da macro).

Quando for concluída esta operação, pode ser executado `yarn test` e obter o seguinte output:

![Execução testes da Tarefa](/task-testrunner.png)

Com isto encontra-se agora á disposição um teste snapshot para cada uma das estórias `Task`. Se a implementação da `Task` for alterada, será apresentada uma notificação.