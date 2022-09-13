---
title: 'Ligação de dados'
tocTitle: 'Dados'
description: 'Aprenda a efetuar a ligação de dados ao seu componente de interface de utilizador'
commit: '022ac7c'
---

Até agora foram criados componentes sem estado e isolados, o que é fantástico para Storybook, mas em última análise não são úteis até que for fornecido algum tipo de dados da aplicação

Este tutorial não foca particularmente na construção de uma aplicação, como tal não vamos aprofundar muito este aspeto. Mas será feito um aparte para olhar para um padrão comum para ligação de dados com componentes contentor.

## Componentes contentor

O componente `TaskList` na sua presente forma é um componente de "apresentação" (ver [este post no blog](https://medium.com/@dan_abramov/smart-and-dumb-components-7ca2f9a7c7d0)), de forma que este não comunica com nada externo além de si.
Para conter dados, irá ser necessário um "contentor".

Este exemplo utiliza [Vuex](https://vuex.vuejs.org), que é a biblioteca mais popular quando se pretende guardar dados, ou construir um modelo de dados para a aplicação.
No entanto o padrão a ser usado aqui, pode ser aplicado a outras bibliotecas de gestão de dados tal como [Apollo](https://www.apollographql.com/client/) e [MobX](https://mobx.js.org/).

Adiciona-se a nova dependência com:

```shell
yarn add vuex
```

Num ficheiro denominado `src/store.js` vai ser implementada uma loja Vuex padrão, que irá reagir ao desencadear de ações que alteram o estado das tarefas.

```js:title=src/store.js
import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    tasks: [
      { id: '1', title: 'Something', state: 'TASK_INBOX' },
      { id: '2', title: 'Something more', state: 'TASK_INBOX' },
      { id: '3', title: 'Something else', state: 'TASK_INBOX' },
      { id: '4', title: 'Something again', state: 'TASK_INBOX' },
    ],
  },
  mutations: {
    ARCHIVE_TASK(state, id) {
      state.tasks.find((task) => task.id === id).state = 'TASK_ARCHIVED';
    },
    PIN_TASK(state, id) {
      state.tasks.find((task) => task.id === id).state = 'TASK_PINNED';
    },
  },
  actions: {
    archiveTask({ commit }, id) {
      commit('ARCHIVE_TASK', id);
    },
    pinTask({ commit }, id) {
      commit('PIN_TASK', id);
    },
  },
});
```

Para ser possível conectar a nossa aplicação á loja recém criada e fornecer dados á hierarquia de componentes de forma extremamente fácil, o componente de topo (`src/App.vue`) vai ser alterado para:

```html:title=src/App.vue
<template>
  <div id="app">
    <task-list />
  </div>
</template>

<script>
  import store from './store';
  import TaskList from './components/TaskList.vue';

  export default {
    name: 'app',
    store,
    components: {
      TaskList,
    },
  };
</script>
<style>
  @import './index.css';
</style>
```

Em seguida o componente `Tasklist` irá ser alterado, para receber dados oriundos da loja.
Mas primeiro, vamos mover a versão existente do componente que é considerada de apresentação, para o ficheiro `src/components/PureTaskList.vue` (renomeando o componente para `pure-task-list` ) que será posteriormente envolvido num contentor.

No ficheiro `src/components/PureTaskList.vue`:

```html:title=src/components/PureTaskList.vue
<template>
<!--same content as before-->
</template>
<script>
import Task from "./Task";
export default {
  name: "pure-task-list",
  ...
}
```

No ficheiro `src/components/TaskList.vue`:

```html:title=src/components/TaskList.vue
<template>
  <div>
    <pure-task-list :tasks="tasks" @archiveTask="archiveTask" @pinTask="pinTask" />
  </div>
</template>

<script>
  import PureTaskList from './PureTaskList';
  import { mapState, mapActions } from 'vuex';

  export default {
    name: 'task-list',
    components: {
      PureTaskList,
    },
    methods: {
      ...mapActions(['archiveTask', 'pinTask']),
    },
    computed: {
      ...mapState(['tasks']),
    },
  };
</script>
```

A razão porque irá ser mantida a versão de apresentação do `TaskList` em separado, não é nada mais nada menos pelo facto que é porque é mais fácil para testar e isolar. Visto que não depende da existência de uma loja, logo torna-se mais fácil de lidar do ponto de vista de testes. O ficheiro de estórias `src/components/TaskList.stories.js` vai ser renomeado também para `src/components/PureTaskList.stories.js`, com isto garantimos que as nossas estórias usam a versão de apresentação:

```js:title=src/components/PureTaskList.stories.js
import PureTaskList from './PureTaskList';
import { taskData, actionsData } from './Task.stories';

const paddedList = () => {
  return {
    template: '<div style="padding: 3rem;"><story/></div>',
  };
};
export default {
  title: 'TaskList',
  excludeStories: /.*Data$/,
  decorators: [paddedList],
};

export const defaultTasksData = [
  { ...taskData, id: '1', title: 'Task 1' },
  { ...taskData, id: '2', title: 'Task 2' },
  { ...taskData, id: '3', title: 'Task 3' },
  { ...taskData, id: '4', title: 'Task 4' },
  { ...taskData, id: '5', title: 'Task 5' },
  { ...taskData, id: '6', title: 'Task 6' },
];
export const withPinnedTasksData = [
  ...defaultTasksData.slice(0, 5),
  { id: '6', title: 'Task 6 (pinned)', state: 'TASK_PINNED' },
];
export const Default = () => ({
  components: { PureTaskList },
  template: `<pure-task-list :tasks="tasks" @archiveTask="onArchiveTask" @pinTask="onPinTask"/>`,
  props: {
    tasks: {
      default: () => defaultTasksData,
    },
  },
  methods: actionsData,
});
// tasklist with pinned tasks
export const WithPinnedTasks = () => ({
  components: { PureTaskList },
  template: `<pure-task-list :tasks="tasks" @archiveTask="onArchiveTask" @pinTask="onPinTask"/>`,
  props: {
    tasks: {
      default: () => withPinnedTasksData,
    },
  },
  methods: actionsData,
});
// tasklist in loading state
export const Loading = () => ({
  components: { PureTaskList },
  template: `<pure-task-list loading @archiveTask="onArchiveTask" @pinTask="onPinTask"/>`,
  methods: actionsData,
});
// tasklist no tasks
export const Empty = () => ({
  components: { PureTaskList },
  template: `<pure-task-list @archiveTask="onArchiveTask" @pinTask="onPinTask"/>`,
  methods: actionsData,
});
```

<video autoPlay muted playsInline loop>
  <source
    src="/intro-to-storybook/finished-tasklist-states.mp4"
    type="video/mp4"
  />
</video>

Similarmente, será usado o `PureTaskList` nos testes com Jest:

```js:title=tests/unit/PureTaskList.spec.js
import Vue from 'vue';
import PureTaskList from '../../src/components/PureTaskList.vue';
import { withPinnedTasksData } from '../../src/components/PureTaskList.stories';

it('renders pinned tasks at the start of the list', () => {
  const Constructor = Vue.extend(PureTaskList);
  const vm = new Constructor({
    propsData: { tasks: withPinnedTasksData },
  }).$mount();
  const lastTaskInput = vm.$el.querySelector('.list-item:nth-child(1).TASK_PINNED');

  // We expect the pinned task to be rendered first, not at the end
  expect(lastTaskInput).not.toBe(null);
});
```

<div class="aside">Se os testes snapshot falharem, deverá ter que atualizar os snapshots existentes, executando o comando de testes de novo com a flag -u. Ou criar um novo script para lidar esta situação.</div>
