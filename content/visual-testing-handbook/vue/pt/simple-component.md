---
title: "Construção de um componente siples"
tocTitle: "Componente simples"
description: "Construção de um componente simples isolado"
---

Iremos construir o interface de utilizador de acordo com a metodologia de [Desenvolvimento orientada a componentes](https://blog.hichroma.com/component-driven-development-ce1109d56c8e), ou nativamente por (CDD, Component-Driven Development). É um processo que cria interfaces de utilizador a partir da base para o topo, iniciando com componentes e terminando com ecrãs. O DOC (CDD nativamente) ajuda no escalonamento da complexidade á qual o programador é sujeito á medida que constrói o interface de utilizador.

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
`src/components/Task.vue` e `src/components/Task.stories.js` respetivamente.

Iremos iniciar por uma implementação básica da `Task`, que recebe os atributos conhecidos até agora, assim como as duas ações que podem ser desencadeadas (a movimentação entre listas):

```html
<template>
  <div class="list-item">
    <input type="text" :readonly="true" :value="this.task.title" />
  </div>  
</template>

<script>
export default {
  name: "task",
  props: {
    task: {
      type: Object,
      required: true
    }
  }
};
</script>
```

O bloco de código acima, quando renderizado, não é nada mais nada menos que a estrutura HTML da `Task` na aplicação Todos.

Em seguida irão ser criados os três testes ao estado da tarefa no ficheiro de estórias correspondente:

```javascript
import { storiesOf } from '@storybook/vue';
import { action } from '@storybook/addon-actions';

import Task from './Task';

export const task = {
  id: '1',
  title: 'Test Task',
  state: 'TASK_INBOX',
  updatedAt: new Date(2018, 0, 1, 9, 0),
};

export const methods = {
  onPinTask: action('onPinTask'),
  onArchiveTask: action('onArchiveTask'),
};

storiesOf('Task', module)
  .add('default', () => {
    return {
      components: { Task },
      template: `<task :task="task" @archiveTask="onArchiveTask" @pinTask="onPinTask"/>`,
      data: () => ({ task }),
      methods,
    };
  })
  .add('pinned', () => {
    return {
      components: { Task },
      template: `<task :task="task" @archiveTask="onArchiveTask" @pinTask="onPinTask"/>`,
      data: () => ({ task: { ...task, state: 'TASK_PINNED' } }),
      methods,
    };
  })
  .add('archived', () => {
    return {
      components: { Task },
      template: `<task :task="task" @archiveTask="onArchiveTask" @pinTask="onPinTask"/>`,
      data: () => ({ task: { ...task, state: 'TASK_ARCHIVED' } }),
      methods,
    };
  });
```

Existem dois tipos de organização com Storybook. O componente em si e as estórias associadas. É preferível pensar em cada estória como uma permutação de um componente. Como tal podem existir tantas estórias, tantas as que forem necessárias.

* **Component**
  * Story
  * Story
  * Story

Ao ser invocada a função `storiesOf()`, está a registar-se o componente, e com isto o processo de arranque do Storybook. É adicionado um nome, nome esse que será usado na barra lateral da aplicação Storybook para identificar o componente.

A função `action()` permite a criação de um callback, que irá surgir no painel adequado, ou seja o painel **actions** do interface de utilizador Storybook quando for feito o click. Como tal assim que for criado o botão para afixar tarefas, irá ser possível determinar o sucesso ou não do click no interface de utilizador de testes.

Visto que é necessário fornecer o mesmo conjunto de tarefas a todas as permutações do componente, é extremamente conveniente agrupar numa única variável denominada `methods` e ser fornecida à estória sempre que necessário.

Outro aspeto fantástico ao agrupar os `methods` necessários ao componente, é que os podemos exportar com recurso á clausula `export` de forma que seja possível serem usadas por estórias que reutilizam este componente, tal como se poderá ver futuramente.

Para definir as estórias, invoca-se o metodo `add()`, uma única vez para cada um dos estados de teste, de forma a gerar uma estória. A estória ação é uma função que irá retornar um conjunto de propriedades que definem a estória -- neste caso a cadeia de caracteres `template` em conjunto com `components`, `data` e `methods` que irão ser consumidos pelo template.

Ao ser criada uma estória, é usada uma tarefa base (`task`) para definir a forma da tarefa em questão que é necessária ao componente. Geralmente modelada a partir de dados concretos. Mais uma vez o uso da cláusula `export`, neste caso para a estrutura dos dados irá permitir a sua reutilização em estórias futuras, tal como veremos.

<div class="aside">
    <a href="https://storybook.js.org/addons/introduction/#2-native-addons"><b>Ações</b></a> ajudam na verificação das interações quando são construídos componentes de interface de utilizador isolados. Na grande maioria das vezes não existirá qualquer tipo de acesso ao estado e funções definidas no contexto da aplicação. Como tal é preferível o uso de <code>action()</code> para esta situação.
</div>

## Configuração

Será necessária uma alteração minúscula ao ficheiro de configuração do Storybook (`storybook/config.js`) de forma que este reconheça os ficheiros com extensão `stories.js`, mas também utilize o ficheiro CSS.
Por norma o Storybook pesquisa numa pasta denominada `/stories` para conter as estórias; este tutorial usa uma nomenclatura similar a `.spec.js`, cuja qual favorecida pelo Vue CLI para testes automatizados.

```javascript
import { configure } from '@storybook/vue';

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

## Construção dos estados

Neste momento já possuímos o Storybook configurado, os elementos de estilo importados, assim como os casos de teste, podemos agora iniciar a implementação HTML do componente de forma a igualar o design.

O componente neste momento ainda é bastante básico. Primeiro irá ser definido o código necessário para atingir o design definido, sem que se entre em grande detalhe:

```html
<template>
  <div :class="taskClass">
    <label class="checkbox">
      <input
        type="checkbox"
        :checked="isChecked"
        :disabled="true"
        name="checked"
      />
      <span class="checkbox-custom" @click="$emit('archiveTask', task.id)"/>
    </label>
    <div class="title">
      <input type="text" :readonly="true" :value="this.task.title" placeholder="Input title" />
    </div>
    <div class="actions">
      <a @click="$emit('pinTask', task.id)" v-if="!isChecked">
        <span class="icon-star"/>
      </a>
    </div>
  </div>  
</template>

<script>
export default {
  name: "task",
  props: {
    task: {
      type: Object,
      required: true
    }
  },
  computed: {
    taskClass() {
      return `list-item ${this.task.state}`;
    },
    isChecked() {
      return this.task.state === "TASK_ARCHIVED";
    }
  }
};
</script>
```

O markup adicional descrito acima, combinado com o CSS que foi importado anteriormente irá originar o seguinte interface de utilizador:

<video autoPlay muted playsInline loop>
  <source
    src="/finished-task-states.mp4"
    type="video/mp4"
  />
</video>

## Componente construido!

Foi construído com sucesso, sem ser necessário qualquer tipo de servidor, ou que seja necessário executar a aplicação frontend. O próximo passo é construir os restantes componentes da Taskbox um por um de forma similar.

Como se pode ver, começar a construir componentes isoladamente é fácil e rápido.
Com isto espera-se que seja possível construir um interface de utilizador de qualidade superior com um número de problemas menor e mais polido. Isto devido ao facto que é possível aprofundar e testar qualquer estado possível.

## Testes automatizados

O Storybook oferece uma forma fantástica de testar visualmente a aplicação durante o desenvolvimento. As "estórias" irão garantir que a tarefa não seja visualmente destruída á medida que a aplicação continua a ser desenvolvida. Mas no entanto continua a ser um processo manual neste momento e alguém terá que fazer o esforço de clickar em cada estado de teste de forma a garantir que irá renderizar sem qualquer tipo de problemas. Não poderíamos automatizar isto?

### Testes de snapshot

Este tipo de testes refere-se á pratica de guardar o output considerado "bom" de um determinado componente com base num input e marcar o componente caso o output seja alterado. Isto complementa o Storybook, visto que é uma forma rápida de se visualizar a nova versão de um componente e verificar as alterações.

<div class="aside">
  É necessário garantir que os componentes renderizam dados que não serão alterados, de forma a garantir que os testes snapshot não falhem sempre. É necessário ter atenção a datas ou valores gerados aleatoriamente.
</div>

Com o [extra Storyshots](https://github.com/storybooks/storybook/tree/master/addons/storyshots) é criado um teste de snapshot para cada uma das estórias. Para que este possa ser usado, adiciona-se a dependência de desenvolvimento:

```bash
yarn add --dev @storybook/addon-storyshots jest-vue-preprocessor babel-plugin-require-context-hook
```

Em seguida é criado o ficheiro `tests/unit/storybook.spec.js` com o conteúdo:

```javascript
import registerRequireContextHook from 'babel-plugin-require-context-hook/register';
import initStoryshots from '@storybook/addon-storyshots';

registerRequireContextHook();
initStoryshots();
```

Em seguida terá que se alterar o ficheiro `jest.config.js`:

```js
  transformIgnorePatterns: ["/node_modules/(?!(@storybook/.*\\.vue$))"],
```

E finalmente uma ligeira alteração ao ficheiro `babel.config.js`:

```js
module.exports = api => ({
  presets: ['@vue/app'],
  ...(api.env('test') && { plugins: ['require-context-hook'] }),
});
```

Assim que os passos descritos acima estiverem concluídos, poderá ser executado `yarn test:unit` e constatar o seguinte output:

![Execução testes da Tarefa](/task-testrunner.png)

Com isto encontra-se agora á disposição um teste snapshot para cada uma das estórias `Task`. Se a implementação da `Task` for alterada, será apresentada uma notificação.