---
title: "Ligação de dados"
tocTitle: "Dados"
description: "Aprendizagem da metodologia de ligação de dados ao componente interface utilizador"
---

Até agora foram criados componentes sem estado e isolados, o que é fantástico para Storybook, mas em última análise não são úteis até que for fornecido algum tipo de dados da aplicação

Este tutorial não foca particularmente na construção de uma aplicação, como tal não vamos aprofundar muito este aspeto. Mas será feito um aparte para olhar para um padrão comum para ligação de dados com componentes contentor.

## Componentes contentor

O componente `TaskList` na sua presente forma é um componente de "apresentação" (ver [este post no blog](https://medium.com/@dan_abramov/smart-and-dumb-components-7ca2f9a7c7d0)), de forma que este não comunica com nada externo além de si.
Para conter dados, irá ser necessário um "contentor".

Este exemplo utiliza [Vuex](https://vuex.vuejs.org), que é a biblioteca mais popular quando se pretende guardar dados, ou construir um modelo de dados para a aplicação.
No entanto o padrão a ser usado aqui, pode ser aplicado a outras bibliotecas de gestão de dados tal como [Apollo](https://www.apollographql.com/client/) e [MobX](https://mobx.js.org/).

Adiciona-se a nova dependência ao `package.json` com:

```bash
yarn add vuex
```

Irá ser construída (intencionalmente definida de forma simples) uma loja Vuex, que responde ao desencadear de ações que alteram o estado das tarefas. Isto no ficheiro `src/store.js`:

```javascript
import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    tasks: [
      { id: "1", title: "Something", state: "TASK_INBOX" },
      { id: "2", title: "Something more", state: "TASK_INBOX" },
      { id: "3", title: "Something else", state: "TASK_INBOX" },
      { id: "4", title: "Something again", state: "TASK_INBOX" }
    ]
  },
  mutations: {
    ARCHIVE_TASK(state, id) {
      state.tasks.find(task => task.id === id).state = "TASK_ARCHIVED";
    },
    PIN_TASK(state, id) {
      state.tasks.find(task => task.id === id).state = "TASK_PINNED";
    }
  },
  actions: {
    archiveTask({ commit }, id) {
      commit("ARCHIVE_TASK", id);
    },
    pinTask({ commit }, id) {
      commit("PIN_TASK", id);
    }
  }
});
```

Em seguida o componente de topo (`src/App.vue`) vai ser atualizado de forma que seja possível conectar á loja e fornecer os dados à hierarquia de componentes de forma extremamente fácil:

```html
<template>
  <div id="app">
    <task-list />
  </div>
</template>

<script>
  import store from "./store";
  import TaskList from "./components/TaskList.vue";
  import "../src/index.css";

  export default {
    name: "app",
    store,
    components: {
      TaskList
    }
  };
</script>
```

Em seguida é atualizado o componente `Tasklist`, de forma que este receba os dados oriundos da loja.
Em primeiro lugar, irá ser movida a versão de apresentação do componente para o ficheiro `src/components/PureTaskList.vue` ( renomeando o componente para `pure-task-list` ) e este será envolvido num contentor.

No ficheiro `src/components/PureTaskList.vue`:

```html
/* This file moved from TaskList.vue */
<template>/* as before */

<script>
import Task from "./Task";
export default {
  name: "pure-task-list",
  ...
}
```

No ficheiro `src/components/TaskList.vue`:

```html
<template>
  <div>
    <pure-task-list :tasks="tasks" />
  </div>
</template>

<script>
  import PureTaskList from "./PureTaskList";
  import { mapState } from "vuex";

  export default {
    name: "task-list",
    components: {
      PureTaskList
    },
    computed: {
      ...mapState(["tasks"])
    }
  };
</script>
```

A razão porque irá ser mantida a versão de apresentação do `TaskList` em separado, é porque é mais fácil para testar e isolar. Visto que não depende da existência de uma loja, logo torna-se mais fácil de lidar do ponto de vista de testes. Irá ser renomeado `src/components/TaskList.stories.js` para `src/components/PureTaskList.stories.js` e com isto garantir que as nossas estórias usam a versão de apresentação:

```javascript
import { storiesOf } from "@storybook/vue";
import { task } from "./Task.stories";

import PureTaskList from "./PureTaskList";
import { methods } from "./Task.stories";

export const defaultTaskList = [
  { ...task, id: "1", title: "Task 1" },
  { ...task, id: "2", title: "Task 2" },
  { ...task, id: "3", title: "Task 3" },
  { ...task, id: "4", title: "Task 4" },
  { ...task, id: "5", title: "Task 5" },
  { ...task, id: "6", title: "Task 6" }
];

export const withPinnedTasks = [
  ...defaultTaskList.slice(0, 5),
  { id: "6", title: "Task 6 (pinned)", state: "TASK_PINNED" }
];

const paddedList = () => {
  return {
    template: '<div style="padding: 3rem;"><story/></div>'
  };
};

storiesOf("PureTaskList", module)
  .addDecorator(paddedList)
  .add("default", () => ({
    components: { PureTaskList },
    template: `<pure-task-list :tasks="tasks" @archiveTask="onArchiveTask" @pinTask="onPinTask"/>`,
    data: () => ({
      tasks: defaultTaskList
    }),
    methods
  }))
  .add("withPinnedTasks", () => ({
    components: { PureTaskList },
    template: `<pure-task-list :tasks="tasks" @archiveTask="onArchiveTask" @pinTask="onPinTask"/>`,
    data: () => ({
      tasks: withPinnedTasks
    }),
    methods
  }))
  .add("loading", () => ({
    components: { PureTaskList },
    template: `<pure-task-list loading @archiveTask="onArchiveTask" @pinTask="onPinTask"/>`,
    methods
  }))
  .add("empty", () => ({
    components: { PureTaskList },
    template: `<pure-task-list  @archiveTask="onArchiveTask" @pinTask="onPinTask"/>`,
    methods
  }));
```

<video autoPlay muted playsInline loop>
  <source
    src="/finished-tasklist-states.mp4"
    type="video/mp4"
  />
</video>

Similarmente, será usado o `PureTaskList` nos testes com Jest:

```js
import Vue from "vue";
import PureTaskList from "../../src/components/PureTaskList.vue";
import { withPinnedTasks } from "../../src/components/PureTaskList.stories";

it("renders pinned tasks at the start of the list", () => {
  const Constructor = Vue.extend(PureTaskList);
  const vm = new Constructor({
    propsData: { tasks: withPinnedTasks }
  }).$mount();
  const lastTaskInput = vm.$el.querySelector(
    ".list-item:nth-child(1).TASK_PINNED"
  );

  // We expect the pinned task to be rendered first, not at the end
  expect(lastTaskInput).not.toBe(null);
});
```
