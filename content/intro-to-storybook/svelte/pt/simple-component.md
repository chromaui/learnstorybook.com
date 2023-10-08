---
title: 'Construção de um componente simples'
tocTitle: 'Componente simples'
description: 'Construção de um componente simples isolado'
---

Nós iremos construir nossa interface de usuário (UI) de acordo com a metodologia de [Desenvolvimento orientado a componentes](https://www.componentdriven.org/) (nativamente CDD, ou Component-Driven Development). É um processo que constrói interfaces de usuário "a partir da base para o topo", iniciando com componentes e terminando com telas. Esta metodologia ajuda a escalar a complexidade encarada ao construir a interface de usuário.

## Tarefa

![Componente Task ao longo de três estados](/intro-to-storybook/task-states-learnstorybook.png)

A `Task` (tarefa) é o componente central de nossa aplicação. Cada tarefa é apresentada de forma diferente dependendo do estado em que se encontra. É mostrada uma _checkbox_ marcada (ou não), algumas informações sobre a tarefa e um botão de "fixar", que permite mover a tarefa para cima e para baixo ao longo da lista. Para combinar tudo isso, serão necessários as seguintes propriedades (props):

- `title` - uma string que descreve a tarefa
- `state` - qual a lista em que a tarefa se encontra, e ela está marcada?

Á medida que construimos a `Task`, é necessário definir os três estados que correspondem os três tipos de tarefa delineados acima.
Em seguida usa-se o Storybook para construir este componente isolado, usando dados predefinidos. Irá "testar-se visualmente" a aparência do componente para cada estado á medida que prosseguimos.

## Configuração Inicial

Primeiro, vamos criar o componente tarefa e o arquivo de estória (_story_) que o acompanha:
`src/components/Task.svelte` e `src/components/Task.stories.js`.

Começaremos com uma implementação rudimentar da `Task`, recebendo os atributos que sabemos que iremos precisar e as duas ações que podem ser realizadas em uma tarefa (a movimentação entre listas):

```html:title=src/components/Task.svelte
<script>
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();

  // event handler for Pin Task
  function PinTask() {
    dispatch('onPinTask', {
      id: task.id,
    });
  }

  // event handler for Archive Task
  function ArchiveTask() {
    dispatch('onArchiveTask', {
      id: task.id,
    });
  }

  // Task props
  export let task = {
    id: '',
    title: '',
    state: '',
  };
</script>

<div class="list-item">
  <label for="title" aria-label={task.title}>
    <input type="text" value={task.title} name="title" readonly />
  </label>
</div>
```

Acima, renderizamos código HTML básico para `Task` com base na estrutura HTML existente da aplicação Todos

Abaixo construimos os três estados de teste da Task no arquivo de estória:

```js:title=src/components/Task.stories.js
import Task from './Task.svelte';

import { action } from '@storybook/addon-actions';

export const actionsData = {
  onPinTask: action('onPinTask'),
  onArchiveTask: action('onArchiveTask'),
};

export default {
  component: Task,
  title: 'Task',
  excludeStories: /.*Data$/,
  //👇 The argTypes are included so that they are properly displayed in the Actions Panel
  argTypes: {
    onPinTask: { action: 'onPinTask' },
    onArchiveTask: { action: 'onArchiveTask' },
  },
};

const Template = ({ onArchiveTask, onPinTask, ...args }) => ({
  Component: Task,
  props: args,
  on: {
    ...actionsData,
  },
});

export const Default = Template.bind({});
Default.args = {
  task: {
    id: '1',
    title: 'Test Task',
    state: 'TASK_INBOX',
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

Existem dois níveis básicos de organização no Storybook: os componentes e seus estórias associados. Cada estória deve ser pensado como uma permutação de um componente. É possivel ter tantas estórias por componente quanto necessárias.

- **Component**
  - Story
  - Story
  - Story

Para informar o Storybook sobre o componente que estamos documentando, criamos um export `default` que contém:

To tell Storybook about the component we are documenting, we create a `default` export that contains:

- `component` -- o componente em si,
- `title` -- o nome que irá ser apresentado na barra lateral da aplicação Storybook,
- `excludeStories` -- informação que é necessária à estória, mas que não deverá ser renderizada pela aplicação Storybook.
- `argTypes` -- especifique o comportamento dos [args](https://storybook.js.org/docs/svelte/api/argtypes) em cada estória.

To define our stories, we export a function for each of our test states to generate a story. The story is a function that returns a rendered element (i.e., a component class with a set of props) in a given state.

Para definir as nossas estórias, exportamos uma função para cada um dos casos de teste. A estória é uma função que retorna um elemento renderizado (por exemplo um componente com um conjunto de propriedades) num determinado estado.

Como temos múltiplas permutações de nosso componente, é conveniente atribuí-lo à variável `Template`. Introduzir este padrão a suas estórias reduzirá a quantidade de código a se escrever e manter.

<div class="aside">
💡 <code>Template.bind({})</code> é uma <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/bind">técnica padrão JavaScript</a> para criar uma cópia de uma função. Usamos esta técnica para permitir que cada estória defina suas próprias propriedades, mas use a mesma implementação.
</div>

Argumentos (ou [`args`](https://storybook.js.org/docs/react/writing-stories/args)) nos permitem editar nossos componentes em tempo real com a extensão de controles sem reiniciar o Storybook. Assim que o valor de [`args`](https://storybook.js.org/docs/react/writing-stories/args) mudar, o componente também o faz.

Quando criamos uma estória, usamos o arg `task` base para delinear o formato da tarefa que o componente espera, geralmente baseada no formato real dos dados.


`action()` nos permite criar uma chamada de retorno (callback) que aparece no painel **actions** da interface de usuário do Storybook quando clicado. Então, quando construirmos um botão de fixação, poderemos determinar se um clique no botão foi bem-sucedido na interface do usuário.

Para que possamos passar o mesmo conjunto de ações para todas as permutações do nosso componente, é conveniente agrupá-las em uma única variável `actionsData` e passá-las para a definição da nossa história cada vez.

Outra coisa interessante sobre agrupar o `actionsData` que um componente precisa é que você pode realizar o `export` deles usá-los em estórias para componentes que reutilizam este componente, como veremos mais tarde.

<div class="aside">
💡 <a href="https://storybook.js.org/docs/svelte/essentials/actions"><b>Ações</b></a> ajudam na verificação das interações quando são construídos componentes de interface de utilizador isolados. Frequentemente não existirá qualquer tipo de acesso ao estado e funções definidas no contexto da aplicação. Como tal é preferível o uso de<code>action()</code> para esta situação.
</div>

## Configuração

Precisaremos mudar algumas coisas nos arquivos de configuração do Storybook para que nossas estórias criadas sejam percebidas e possamos utilizar o arquivo CSS da aplicação (localizado em `src/index.css`)

Vamos começar por alterar o arquivo de configuração do Storybook(`.storybook/main.js`) para o seguinte:

```diff:title=.storybook/main.js
// .storybook/main.js

module.exports = {
- stories: [
-   '../src/**/*.stories.mdx',
-   '../src/**/*.stories.@(js|jsx|ts|tsx)'
- ],
+ stories: ['../src/components/**/*.stories.js'],
  staticDirs: ['../public'],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-svelte-csf',
    '@storybook/addon-interactions',
  ],
  features: {
    postcss: false,
    interactionsDebugger: true,
  },
  framework: '@storybook/svelte',
  core: {
    builder: '@storybook/builder-webpack4',
  },
};
```

Após efetuar esta alteração, na pasta `.storybook`, crie um novo arquivo chamado `preview.js` com o seguinte conteúdo:

```diff:title=.storybook/preview.js
+ import '../src/index.css';

//👇 Configures Storybook to log the actions( onArchiveTask and onPinTask ) in the UI.
export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
};
```

[`parameters`](https://storybook.js.org/docs/svelte/writing-stories/parameters) (parâmetros) geralmente são usados para controlar o comportamento das funcionalidades do Storybook. Neste caso, serão usados para configurar como as `actions` (funções de callback simuladas) são tratadas.

`actions` permitem criar callbacks que aparecem no painel de ações da interface do usuário do Storybook quando clicados. Então, quando construirmos um botão de fixação da tarefa, poderemos determinar se um clique no botão foi bem-sucedido na interface do usuário.

Quando isso tiver sido feito, reiniciar o servidor Storybook deve fornecer casos de teste para os três estados da Task:

<video autoPlay muted playsInline loop>
  <source
    src="/intro-to-storybook/inprogress-task-states-6-0.mp4"
    type="video/mp4"
  />
</video>

## Construindo os estados

Agora que temos o Storybook configurado, estilos importados e casos de uso delineados, podemos rapidamente iniciar a implementação do HTML do componente para combinar com o projeto de design.

No momento, o componente ainda é rudimentar. Primeiro, escreva o código que implementa o design sem entrar muito em detalhes:

```html:title=src/components/Task.svelte
<script>
  import { createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher();

  // Event handler for Pin Task
  function PinTask() {
    dispatch("onPinTask", {
      id: task.id,
    });
  }
  // Event handler for Archive Task
  function ArchiveTask() {
    dispatch("onArchiveTask", {
      id: task.id,
    });
  }

  // Task props
  export let task = {
    id: "",
    title: "",
    state: "",
  };

  // Reactive declaration (computed prop in other frameworks)
  $: isChecked = task.state === "TASK_ARCHIVED";
</script>

<div class="list-item {task.state}">
  <label for="checked" class="checkbox" aria-label={`archiveTask-${task.id}`}>
    <input
      type="checkbox"
      checked={isChecked}
      disabled
      name="checked"
      id={`archiveTask-${task.id}`}
    />
    <span class="checkbox-custom" on:click={ArchiveTask} />
  </label>
  <label for="title" aria-label={task.title} class="title">
    <input
      type="text"
      value={task.title}
      readonly
      name="title"
      placeholder="Input title"
    />
  </label>
  {#if task.state !== "TASK_ARCHIVED"}
    <button
      class="pin-button"
      on:click|preventDefault={PinTask}
      id={`pinTask-${task.id}`}
      aria-label={`pinTask-${task.id}`}
    >
      <span class="icon-star" />
    </button>
  {/if}
</div>
```

A combinação da marcação adicional acima com o CSS que importamos anteriormente resulta na interface a seguir:

<video autoPlay muted playsInline loop>
  <source
    src="/intro-to-storybook/finished-task-states-6-0.mp4"
    type="video/mp4"
  />
</video>

## Componente construído!

Construímos com sucesso um componente, sem ser necessário um servidor ou que seja necessário executar a aplicação frontend inteira. O próximo passo é construir os componentes restantes da Taskbox um por um de forma similar.

Como se pode ver, começar a construir componentes de forma isolada é fácil e rápido.
Com isto espera-se que seja possível construir um interface de usuário de qualidade superior com menos problemas e maior polimento pelo fato de ser possível se aprofundar e testar todos os casos possíveis.

## Detectar problemas de acessibilidade

Testes de acessibilidade se referem à prática de auditar o DOM renderizado com ferramentas automatizadas a partir de um conjunto de heurísticas baseadas nas [regras de WCAG](https://www.w3.org/WAI/standards-guidelines/wcag/) e outras boas práticas aceitas na indústria. Eles agem como a primeira linha de controle de qualidade para capturar violações gritantes de acessibilidade, garantindo que uma aplicação é usável pelo maior número de pessoas possível, incluindo pessoas com deficiências de visão, problemas de audição ou condições cognitivas diversas.

O Storybook inclui uma [extensão de acessibilidade oficial](https://storybook.js.org/addons/@storybook/addon-a11y). Habilitada por [Deque's axe-core](https://github.com/dequelabs/axe-core), pode detectar até [57% dos problemas de WCAG](https://www.deque.com/blog/automated-testing-study-identifies-57-percent-of-digital-accessibility-issues/).****

Vamos ver como funciona! Execute o comando a seguir para instalar a extensão:

```shell
yarn add --dev @storybook/addon-a11y
```

Então, atualize seu arquivo de configuração Storybook (`.storybook/main.js`) para habilitá-lo:


```diff:title=.storybook/main.js
module.exports = {
  stories: ['../src/components/**/*.stories.js'],
  staticDirs: ['../public'],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-svelte-csf',
    '@storybook/addon-interactions',
+   '@storybook/addon-a11y',
  ],
  features: {
    postcss: false,
    interactionsDebugger: true,
  },
  framework: '@storybook/svelte',
  core: {
    builder: '@storybook/builder-webpack4',
  },
};
```

![Problema de acessbilidade de Task no Storybook](/intro-to-storybook/finished-task-states-accessibility-issue.png)

Navegando nossas estórias, podemos ver que a extensão encontrou um problema de acessibilidade com um de nossos casos de teste. A mensagem [**"Elements must have sufficient color contrast"**](https://dequeuniversity.com/rules/axe/4.4/color-contrast?application=axeAPI) em suma significa que não há contraste suficiente entre o título da tarefa e o funco. Podemos rapidamente consertar este problema mudando a cor do texto para um cinza mais escuro no CSS de nossa aplicação. (localizado em `src/index.css`).


```diff:title=src/index.css
.list-item.TASK_ARCHIVED input[type="text"] {
- color: #a0aec0;
+ color: #4a5568;
  text-decoration: line-through;
}
```

É isso! Demos o primeiro passo para gantir que nossa interface de usuário se torne acessível. À medida que aumentamos a complexidade de nossa aplicação, podemos repetir este processi para todos os outros componentes sem a necessidade de utilizar outras ferramentas e ambientes de teste adicionais.

<div class="aside">
  Não esqueça de realizar o commit de suas mudanças com git!
</div>
