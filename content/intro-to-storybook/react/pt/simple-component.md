---
title: 'Construção de um componente simples'
tocTitle: 'Componente simples'
description: 'Construção de um componente simples isolado'
commit: '97d6750'
---

Iremos construir a interface de acordo com a metodologia de [Desenvolvimento orientada a componentes](https://www.componentdriven.org/), ou nativamente por (CDD, Component-Driven Development). É um processo que cria interfaces a partir da "base para o topo", iniciando com componentes e terminando com telas. O DOC (CDD nativamente) ajuda a escalar a complexidade que o programador enfrenta á medida que constrói a interface.

## Tarefa

![Componente Task ao longo de três estados](/intro-to-storybook/task-states-learnstorybook.png)

`Task` é o componente principal da nossa aplicação. Cada tarefa é exibida levemente diferente, dependendo do estado em que se encontra.
Apresentamos uma caixa de confirmação, selecionada (ou não), alguma informação adicional acerca da tarefa e um botão "fixador", que nos permite a movimentação para cima e para baixo das tarefas na lista.
Para que seja possível implementar isto serão necessárias os seguintes adereços (props):

- `title` - um texto (string) que descreve a tarefa
- `state` - qual a lista em que a tarefa se encontra e se está desmarcada?

Com o início da construção de `Task`, primeiro escrevemos nossos testes de estado que correspondem aos diferentes tipos de tarefas descritas acima.
Em seguida, usamos o Storybook para construir o componente de forma isolada, usando dados simulados (mocados). Testaremos manualmente a aparência do componente de acordo com cada estado à medida que avançamos.

## Configuração Inicial

Primeiro, criaremos o componente tarefa e o arquivo de história que o acompanha:
`src/components/Task.js` e `src/components/Task.stories.js`.

Iremos iniciar com uma implementação básica de `Task`, simplesmente pegando os atributos que sabemos que iremos precisar, e as duas ações que podemos realizar em uma tarefa (movê-la entre as listas):

```js:title=src/components/Task.js
import React from 'react';

export default function Task({ task: { id, title, state }, onArchiveTask, onPinTask }) {
  return (
    <div className="list-item">
      <input type="text" value={title} readOnly={true} />
    </div>
  );
}
```

Acima, renderizamos uma marcação direta para `Task` com base na estrutura HTML existente na aplicação Todos.

Abaixo, construímos os três testes dos estados da `Task`no arquivo de história:

```js:title=src/components/Task.stories.js
import React from 'react';

import Task from './Task';

export default {
  component: Task,
  title: 'Task',
};

const Template = args => <Task {...args} />;

export const Default = Template.bind({});
Default.args = {
  task: {
    id: '1',
    title: 'Test Task',
    state: 'TASK_INBOX',
    updatedAt: new Date(2021, 0, 1, 9, 0),
  },
};

export const Pinned = Template.bind({});
Pinned.args = {
  task: {
    ...Default.args.task,
    state: 'TASK_PINNED',
  },
};

export const Archived = Template.bind({});
Archived.args = {
  task: {
    ...Default.args.task,
    state: 'TASK_ARCHIVED',
  },
};
```

Existem dois tipos de organização com Storybook: O componente e suas histórias associadas. Pense em cada história como uma permutação de um componente. Pode-se ter quantas histórias por componente forem necessárias.

- **Component**
  - Story
  - Story
  - Story

Para informar ao Storybook sobre o componente que estamos documentando, criamos um `default export` que contém:

- `component` -- o componente em si,
- `title` -- o nome que irá ser apresentado na barra lateral da aplicação Storybook

Para definir nossas histórias, exportamos uma função para cada um dos casos de teste para gerar uma história. A história é uma função que devolve um elemento renderizado (por exemplo um componente com um conjunto de adereços) num determinado estado -- exatamente tal como um [Componente Funcional](https://reactjs.org/docs/components-and-props.html#function-and-class-components).

Como temos várias permutações de nosso componente, é conveniente atribuí-lo a uma variável `Template`. A introdução desse padrão em suas histórias reduzirá a quantidade de código que você precisa escrever e manter.

<div class="aside">
💡 <code>Template.bind({})</code> é uma técnica <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/bind">padrão do JavaScript</a> para fazer uma cópia de uma função. Usamos essa técnica para permitir que cada história exportada defina suas próprias propriedades, mas use a mesma implementação.
</div>

Para resumir os argumentos ou [`args`](https://storybook.js.org/docs/react/writing-stories/args) nos permitem editar nossos componentes em tempo real com o complemento de controles sem reiniciar o Storybook. Uma vez que o valor do [`args`](https://storybook.js.org/docs/react/writing-stories/args) muda o componente muda.

Ao criar uma história, usamos um argumento de tarefa base para construir a forma da tarefa que o componente espera. Isso normalmente é modelado a partir da aparência dos dados verdadeiros. Novamente, `export`-ando esta forma nos permitirá reutilizá-la em histórias posteriores, como veremos.

<div class="aside">
    <a href="https://storybook.js.org/docs/react/essentials/actions"><b>Ações</b></a> ajudam na verificação das interações quando são construídos componentes de interface isolados. Na grande maioria das vezes não existirá qualquer tipo de acesso ao estado e funções definidas no contexto da aplicação. Como tal é preferível o uso de<code>action()</code> para esta situação.
</div>
//TOdo: continuar daqui!!
## Configuração

É necessário efetuar algumas alterações á configuração do Storybook, de forma que saiba não só onde procurar onde estão as estórias que acabámos de criar, mas também usar o CSS que foi adicionado no [capítulo anterior](/intro-to-storybook/react/pt/get-started).

Vamos começar por alterar o ficheiro de configuração do Storybook(`.storybook/main.js`) para o seguinte:

```javascript
// .storybook/main.js

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

```javascript
// .storybook/preview.js

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

```javascript
// src/components/Task.js

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

```bash
yarn add -D @storybook/addon-storyshots react-test-renderer
```

Quando esta operação terminar, será necessário criar o ficheiro `src/storybook.test.js` com o seguinte conteúdo:

```javascript
// src/storybook.test.js

import initStoryshots from '@storybook/addon-storyshots';
initStoryshots();
```

E é só isto, podemos agora executar o comando `yarn test` e verificar o seguinte resultado:

![Task test runner](/intro-to-storybook/task-testrunner.png)

Temos à nossa disposição um teste de snapshot para cada uma das estórias da `Task`. Se a implementação da `Task` for alterada, será apresentada uma notificação para serem verificadas a alterações que foram feitas.
