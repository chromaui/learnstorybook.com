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

Precisaremos fazer algumas mudanças nos arquivos de configuração do Storybook, de forma que ele saiba não só onde procurar nossas histórias criadas recentemente, mas também nos permita usar o arquivo de CSS do aplicativo (localizado em `src/index.css`).

Comece alterando seu arquivo de configuração do Storybook (`.storybook/main.js`) para o seguinte:

```diff:title=.storybook/main.js
module.exports = {
- stories: [
-   '../src/**/*.stories.mdx',
-   '../src/**/*.stories.@(js|jsx|ts|tsx)'
- ],
+ stories: ['../src/components/**/*.stories.js'],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/preset-create-react-app',
  ],
};
```

Depois de concluir a alteração acima, dentro da pasta `.storybook`, altere o `preview.js` para o seguinte::

```diff:title=.storybook/preview.js
+ import '../src/index.css';

//👇 Configures Storybook to log the actions( onArchiveTask and onPinTask ) in the UI.
export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
};
```

os [`parâmetros`](https://storybook.js.org/docs/react/writing-stories/parameters) são normalmente usados ​​para controlar o comportamento dos recursos e complementos do Storybook. Em nosso caso, vamos usá-los para configurar como as `actions` (callbacks simulados) são tratadas.

`actions` nos permitem criar retornos de chamada que aparecem no painel de **ações** da UI do Storybook quando clicados. Então, quando construímos um botão de fixação, seremos capazes de determinar no teste de UI se um clique de botão foi bem-sucedido.

Depois de fazer isso, reiniciar o servidor do Storybook deve gerar casos de teste para os três estados de Task:

<video autoPlay muted playsInline loop>
  <source
    src="/intro-to-storybook/inprogress-task-states-6-0.mp4"
    type="video/mp4"
  />
</video>

## Construção dos estados

Agora que temos a configuração do Storybook, estilos importados e casos de teste construídos, podemos rapidamente iniciar o trabalho de implementação do HTML do componente para corresponder ao design.

O componente neste momento ainda é básico. Primeiro escreva o código que corresponda ao design, sem entrar em muitos detalhes:

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

      <div className="actions" onClick={event => event.stopPropagation()}>
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

A marcação adicional acima combinada com o CSS que importamos anteriormente produz a seguinte interface:

<video autoPlay muted playsInline loop>
  <source
    src="/intro-to-storybook/finished-task-states-6-0.mp4"
    type="video/mp4"
  />
</video>

## Especificação de requisitos de dados

É uma boa prática usar `propTypes` no React para especificar a forma dos dados que um componente espera. Não é apenas auto documentável, mas também ajuda a detectar problemas o quanto antes.

```diff:title=src/components/Task.js
import React from 'react';
import PropTypes from 'prop-types';

export default function Task({ task: { id, title, state }, onArchiveTask, onPinTask }) {
  // ...
}

+ Task.propTypes = {
+  /** Composition of the task */
+  task: PropTypes.shape({
+    /** Id of the task */
+    id: PropTypes.string.isRequired,
+    /** Title of the task */
+    title: PropTypes.string.isRequired,
+    /** Current state of the task */
+    state: PropTypes.string.isRequired,
+  }),
+  /** Event to change the task to archived */
+  onArchiveTask: PropTypes.func,
+  /** Event to change the task to pinned */
+  onPinTask: PropTypes.func,
+ };
```

Agora, um aviso em desenvolvimento aparecerá se o componente `Task` for mal utilizado.

<div class="aside">
💡 Uma maneira alternativa de atingir o mesmo propósito é usar um sistema de tipo JavaScript como o TypeScript para criar um tipo para as propriedades do componente.
</div>

## Componente construído!

Construímos com sucesso um componente, sem ser necessário qualquer tipo de servidor, ou que seja necessário executar a aplicação frontend. O próximo passo é construir os componentes restantes do Taskbox, um por um, de forma similar.

Como você pode ver, começar a construir componentes isoladamente é fácil e rápido. Podemos esperar produzir uma interface de alta qualidade com menos bugs e mais polimento, porque é possível se aprofundar e testar todos os estados possíveis.

## Testes automatizados

O Storybook nos deu uma ótima maneira de testar manualmente a interface do usuário do nosso aplicativo durante a construção. As "histórias" ajudarão a garantir que não quebremos a aparência de nossa Task à medida que continuamos a desenvolver o aplicativo. No entanto, é um processo totalmente manual neste estágio, e alguém precisa se esforçar para clicar em cada teste de estado para garantir que funcione bem e sem erros ou avisos. Não poderíamos automatizar isto?

## Testes de snapshot

Este tipo de testes refere-se á pratica de guardar o output considerado "bom" de um determinado componente com base num input e sinalizar o componente caso o output seja alterado. Isto complementa o Storybook, visto que é uma forma rápida de se visualizar a nova versão de um componente e verificar as alterações feitas.

<div class="aside">
💡 Certifique-se de que seus componentes renderizam dados que não mudam, para que seus testes de instantâneo não falhem todas as vezes. Fique atento a coisas como datas ou valores gerados aleatoriamente.
</div>

Com o [extra Storyshots](https://github.com/storybooks/storybook/tree/master/addons/storyshots) é criado um teste de snapshot para cada uma das histórias. Use-o adicionando as seguintes dependências de desenvolvimento:

```bash
yarn add -D @storybook/addon-storyshots react-test-renderer
```

Em seguida, crie um arquivo `src/storybook.test.js` com o seguinte:

```js:title=src/storybook.test.js
import initStoryshots from '@storybook/addon-storyshots';
initStoryshots();
```

É isto, podemos agora executar o comando `yarn test` e verificar o seguinte resultado:

![Task test runner](/intro-to-storybook/task-testrunner.png)

Agora temos um teste de snapshot para cada uma das histórias de `Task`. Se a implementação de `Task` for alterada, seremos solicitados a verificar as mudanças.
