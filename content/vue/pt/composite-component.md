---
title: "Construção de um componente composto"
tocTitle: "Componente composto"
description: "Construção de um componente composto a partir de componentes simples"
---

No capitulo anterior, construímos o nosso primeiro componente, neste capitulo iremos estender o que foi dito até agora, para que possamos construir a nossa TaskList, ou seja uma lista de Tasks. Vamos combinar componentes e ver o que irá acontecer quando é adicionada alguma complexidade.

## Tasklist

A Taskbox dá prioridade a tarefas que foram confirmadas através do seu posicionamento acima de quaisquer outras.
Isto gera duas variantes da `TaskList`, para o qual será necessária a criação de estórias:
os itens normais e itens normais e itens confirmados.

![tarefas confirmadas e padrão](/tasklist-states-1.png)

Visto que os dados para a `Task` podem ser enviados de forma assíncrona, **irá ser** necessário um estado no componente para lidar com a ausência de qualquer tipo de conexão. E além deste um estado extra para lidar com a inexistência de tarefas.

![Tarefas vazias e carregamento](/tasklist-states-2.png)

## Preparação

Um componente composto não é em nada diferente do componente básico contido dentro deste. Comece por criar um componente `TaskList` e o ficheiro estória que o acompanha em: 
`src/components/TaskList.vue` e `src/components/TaskList.stories.js` respetivamente.

Comece por uma implementação em bruto da `TaskList`. Será necessário importar o componente `Task` criado anteriormente e injetar os atributos e as respetivas ações como inputs.

```html
<template>
  <div>
    <div class="list-items" v-if="loading"> loading </div>
    <div class="list-items" v-if="noTasks && !this.loading">empty </div>
    <div class="list-items" v-if="showTasks">
      <task v-for="(task, index) in tasks" :key="index" :task="task"
        @archiveTask="$emit('archiveTask', $event)" @pinTask="$emit('pinTask', $event)"/>
    </div>
  </div>
</template>

<script>
import Task from "./Task";
export default {
  name: "task-list",
  props: {
    loading: {
      type: Boolean,
      default: false
    },
    tasks: {
      type: Array,
      default() {
        return [];
      }
    }
  },
  components: {
    Task
  },
  computed: {
    noTasks() {
      return this.tasks.length === 0;
    },
    showTasks() {
      return !this.loading && !this.noTasks;
    }
  }
};
</script>
```

Em seguida iremos criar os estados de teste do `TaskList` no ficheiro de estórias respetivo.

```javascript
import { storiesOf } from '@storybook/vue';
import { task } from './Task.stories';

import TaskList from './TaskList';
import { methods } from './Task.stories';

export const defaultTaskList = [
  { ...task, id: '1', title: 'Task 1' },
  { ...task, id: '2', title: 'Task 2' },
  { ...task, id: '3', title: 'Task 3' },
  { ...task, id: '4', title: 'Task 4' },
  { ...task, id: '5', title: 'Task 5' },
  { ...task, id: '6', title: 'Task 6' },
];

export const withPinnedTasks = [
  ...defaultTaskList.slice(0, 5),
  { id: '6', title: 'Task 6 (pinned)', state: 'TASK_PINNED' },
];

const paddedList = () => {
  return {
    template: '<div style="padding: 3rem;"><story/></div>',
  };
};

storiesOf('TaskList', module)
  .addDecorator(paddedList)
  .add('default', () => ({
    components: { TaskList },
    template: `<task-list :tasks="tasks" @archiveTask="onArchiveTask" @pinTask="onPinTask"/>`,
    data: () => ({
      tasks: defaultTaskList,
    }),
    methods,
  }))
  .add('withPinnedTasks', () => ({
    components: { TaskList },
    template: `<task-list :tasks="tasks" @archiveTask="onArchiveTask" @pinTask="onPinTask"/>`,
    data: () => ({
      tasks: withPinnedTasks,
    }),
    methods,
  }))
  .add('loading', () => ({
    components: { TaskList },
    template: `<task-list loading @archiveTask="onArchiveTask" @pinTask="onPinTask"/>`,
    methods,
  }))
  .add('empty', () => ({
    components: { TaskList },
    template: `<task-list  @archiveTask="onArchiveTask" @pinTask="onPinTask"/>`,
    methods,
  }));
```

A função `addDecorator()` permite que seja adicionado algum "contexto" á renderização de cada tarefa. Neste caso a lista é envolvida com um ligeiro preenchimento, de forma que seja possível ser feita uma verificação visual com maior eficácia.

<div class="aside">
    Os <a href="https://storybook.js.org/addons/introduction/#1-decorators"><b>Decoradores</b></a>, oferecem uma forma de embrulho arbitrária ás estórias. Neste caso estamos a usar um decorador para gerar elementos de estilo. Mas podem ser usados para adicionar outras formas de contexto aos componentes, tal como irá ser visto posteriormente.
</div>

Com a importação da `task` para este ficheiro, está a ser adicionada a forma que uma `Task` assume, isto a partir do ficheiro `Task.stories.js` criado anteriormente.
Como tal também os `methods` que irão definir quais as ações (através de uma callback simulada) que o componente `Task` se encontra á espera. 

Estes também necessários á `TaskList`.

Pode agora verificar-se o Storybook com as estórias novas associadas á `Tasklist`.

<video autoPlay muted playsInline loop>
  <source
    src="/inprogress-tasklist-states.mp4"
    type="video/mp4"
  />
</video>

## Definir os estados

O componente ainda se encontra num estado bruto, mas já temos uma ideia de quais são as estórias com que temos que trabalhar. Poderá estar a pensar que o embrulho `.list-items` é deveras simples. Mas tem razão, na maioria dos casos não iria ser criado um novo componente somente para adicionar um embrulho. A **verdadeira complexidade** do componente `TaskList` é revelada com os casos extremos `withPinnedTasks`, `loading` e `empty`.

```html
<template>
  <div>
    <div v-if="loading">
      <div class="loading-item" v-for="(n, index) in 5" :key="index">
        <span class="glow-checkbox" />
        <span class="glow-text">
          <span>Loading</span> <span>cool</span> <span>state</span>
        </span>
      </div>
    </div>
    <div class="list-items" v-if="noTasks && !this.loading">
      <div class="wrapper-message">
        <span class="icon-check" />
        <div class="title-message">You have no tasks</div>
        <div class="subtitle-message">Sit back and relax</div>
      </div>
    </div>
    <div class="list-items" v-if="showTasks">
      <task v-for="(task, index) in tasksInOrder" :key="index" :task="task"
        @archiveTask="$emit('archiveTask', $event)" @pinTask="$emit('pinTask', $event)"/>
    </div>
  </div>
</template>

<script>
import Task from "./Task";
export default {
  name: "task-list",
  props: {
    loading: {
      type: Boolean,
      default: false
    },
    tasks: {
      type: Array,
      default() {
        return [];
      }
    }
  },
  components: {
    Task
  },
  computed: {
    noTasks() {
      return this.tasks.length === 0;
    },
    showTasks() {
      return !this.loading && !this.noTasks;
    },
    tasksInOrder() {
      return [
        ...this.tasks.filter(t => t.state === "TASK_PINNED"),
        ...this.tasks.filter(t => t.state !== "TASK_PINNED")
      ];
    }
  }
};
</script>
```

O markup adicional irá resultar no seguinte interface de utilizador:

<video autoPlay muted playsInline loop>
  <source
    src="/finished-tasklist-states.mp4"
    type="video/mp4"
  />
</video>

Reparem na posição do item confirmado na lista. Pretende-se que este item seja renderizado no topo da lista e torná-lo uma prioridade aos utilizadores.

## Testes automatizados

No capítulo anterior, aprendeu-se a usar o Storyshots para implementar estórias para testes snapshot. Com o componente `Task` não existia muita complexidade para testar além do sucesso da renderização. Visto que o componente `TaskList` adiciona uma camada extra de complexidade, pretende-se verificar que determinados valores de entrada produzam determinados valores de saída, isto implementado de forma responsável para os testes automáticos. Para tal irão ser criados testes unitários utilizando [Jest](https://facebook.github.io/jest/) em conjunção com um renderizador de testes como por exemplo [Enzyme](http://airbnb.io/enzyme/)

![Jest logo](/logo-jest.png)

## Testes unitários com Jest

As estórias criadas com o Storybook em conjunção com os testes visuais manuais e testes de snapshot (tal como mencionado acima) irão prevenir em larga escala problemas futuros no interface de utilizador. Se as estórias definidas abrangerem uma ampla variedade de casos do componente e forem usadas ferramentas que garantam verificações por parte humana, irá resultar num decréscimo de erros. 

No entanto, por vezes o diabo encontra-se nos detalhes. É necessária uma framework de testes explicita acerca deste tipo de detalhes. O que nos leva aos testes unitários. 

Neste caso pretende-se que o nosso `TaskList` faça a renderização de quaisquer tarefas que foram confirmadas **antes** das não confirmadas que são fornecidas ao adereço (prop) `tasks`. 
Apesar de existir uma estória (`withPinnedTasks`) que testa este cenário em particular; este poderá levar a alguma ambiguidade da parte humana, ou seja se o componente **parar** de ordenar as tarefas desta forma, logo existe um problema. Mas ao olho destreinado não irá gritar **"Erro!"**.

De forma a evitar este problema em concreto, podemos usar o Jest, de forma que este renderize a estória na DOM e efetue pesquisas de forma a verificar o output.

Iremos começar por criar um ficheiro de testes denominado `tests/unit/TaskList.spec.js`. Neste ficheiro estarão contidos os testes que irão fazer asserções acerca do valor de saída.

```javascript
import Vue from 'vue';
import TaskList from '../../src/components/TaskList.vue';
import { withPinnedTasks } from '../../src/components/TaskList.stories';

it('renders pinned tasks at the start of the list', () => {
  const Constructor = Vue.extend(TaskList);
  const vm = new Constructor({
    propsData: { tasks: withPinnedTasks },
  }).$mount();
  const lastTaskInput = vm.$el.querySelector('.list-item:nth-child(1).TASK_PINNED');

  // We expect the pinned task to be rendered first, not at the end
  expect(lastTaskInput).not.toBe(null);
});
```

![Execução de testes da TaskList](/tasklist-testrunner.png)

Podemos verificar que foi possível reutilizar a lista de tarefas `withPinnedTasks` quer na estória, quer no teste unitário. Desta forma podemos continuar a aproveitar um recurso existente (os exemplos que representam configurações de um componente) de cada vez mais formas. 

Mas também que este teste é algo frágil. É possível que á medida que o projeto amadurece, a implementação concreta do componente `Task` seja alterada --isto quer pelo uso de uma classe com um nome diferente, por exemplo-- com isto, este teste específico irá falhar e será necessária uma atualização. Isto não é necessariamente um problema, mas um indicador para ser cuidadoso no uso liberal de testes unitários para o interface de utilizador. Visto que não são de fácil manutenção. Ao invés deste tipo de testes, é preferível depender de testes visuais, snapshot ou de regressão visual (ver [capitulo de testes](/vue/pt/test/)) sempre que for possível.