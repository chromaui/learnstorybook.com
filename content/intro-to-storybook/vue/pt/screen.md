---
title: 'Construção de um ecrã'
tocTitle: 'Ecrãs'
description: 'Construção de um ecrã a partir de componentes'
---

Tem sido focada a construção de interfaces de utilizador da base para o topo.
Começando de forma simples e sendo adicionada complexidade á medida que a aplicação é desenvolvida. Com isto permitiu que cada componente fosse desenvolvido de forma isolada, definindo quais os requisitos de dados e "brincar" com ele no Storybook. Isto tudo sem a necessidade de instanciar um servidor ou ser necessária a construção de ecrãs!

Neste capitulo, irá ser acrescida um pouco mais a sofisticação, através da composição de diversos componentes, originando um ecrã, que será desenvolvido no Storybook.

## Componentes contentores agrupados

Visto que a aplicação é deveras simples, o ecrã a ser construído é bastante trivial, simplesmente envolvendo o componente `TaskList` (que fornece os seus dados via Vuex), a um qualquer layout e extraindo o campo `erro` oriundo da loja (assumindo que este irá ser definido caso exista algum problema na ligação ao servidor). Dentro da pasta `src/components/` vai ser adicionado o ficheiro `PureInboxScreen.vue`:

```html
<!--src/components/PureInboxScreen.vue-->
<template>
  <div>
    <div class="page lists-show" v-if="error">
      <div class="wrapper-message">
        <span class="icon-face-sad" />
        <div class="title-message">Oh no!</div>
        <div class="subtitle-message">Something went wrong</div>
      </div>
    </div>
    <div class="page lists-show" v-else>
      <nav>
        <h1 class="title-page">
          <span class="title-wrapper">Taskbox</span>
        </h1>
      </nav>
      <task-list />
    </div>
  </div>
</template>

<script>
  import TaskList from './TaskList.vue';

  export default {
    name: 'pure-inbox-screen',
    props: {
      error: {
        type: Boolean,
        default: false,
      },
    },
    components: {
      TaskList,
    },
  };
</script>
```

Em seguida, podemos criar um contentor, que neste caso obtém os dados para o `PureInboxScreen` localizado em `src/components/InboxScreen.vue`:

```html
<!--src/components/InboxScreen.vue-->
<template>
  <div>
    <pure-inbox-screen :error="error" />
  </div>
</template>

<script>
  import PureInboxScreen from './PureInboxScreen';
  import { mapState } from 'vuex';

  export default {
    name: 'inbox-screen',
    components: {
      PureInboxScreen,
    },
    computed: {
      ...mapState(['error']),
    },
  };
</script>
```

Vai ser necessário alterar o componente `App` de forma a ser possível renderizar o `InboxScreen` (eventualmente iria ser usado um roteador para escolher o ecrã apropriado, mas não é necessário preocupar-nos com isto agora):

```html
<!--src/App.vue-->
<template>
  <div id="app">
    <inbox-screen />
  </div>
</template>

<script>
  import store from './store';
  import InboxScreen from './components/InboxScreen.vue';
  export default {
    name: 'app',
    store,
    components: {
      InboxScreen,
    },
  };
</script>
<style>
  @import './index.css';
</style>
```

No entanto as coisas irão tornar-se interessantes ao renderizar-se a estória no Storybook.

Tal como visto anteriormente, o componente `TaskList` é um **contentor** que renderiza o componente de apresentação `PureTaskList`. Por definição estes componentes, os componentes contentor não podem ser renderizados de forma isolada, estes encontram-se "á espera" de um determinado contexto ou ligação a um serviço. O que isto significa, é que para ser feita a renderização de um contentor em Storybook, é necessário simular o contexto ou serviço necessário (ou seja, providenciar uma versão fingida).

Ao colocar-se a `TaskList` no Storybook, foi possível fugir a este problema através da renderização do `PureTaskList` e com isto evitando o contentor por completo.
Irá ser feito algo similar para o `PureInboxScreen` no Storybook também.

No entanto para o `PureInboxScreen` existe um problema, isto porque apesar deste ser de apresentação, o seu "filho", ou seja a `TaskList` não o é. De certa forma o `PureInboxScreen` foi poluído pelo "container-ness". Com isto quando forem adicionadas as estórias ao ficheiro `src/components/PureInboxScreen.stories.js`:

```javascript
//src/components/PureInboxScreen.stories.js
import PureInboxScreen from './PureInboxScreen.vue';
export default {
  title: 'PureInboxScreen',
};

// inbox screen default state
export const Default = () => ({
  components: { PureInboxScreen },
  template: `<pure-inbox-screen/>`,
});

// inbox screen error state
export const error = () => ({
  components: { PureInboxScreen },
  template: `<pure-inbox-screen :error="true"/>`,
});
```

Pode verificar-se que apesar da estória `error` funcionar corretamente, existe um problema na estória `Default`, isto porque a `TaskList` não tem uma loja Vuex á qual conectar-se. (Poderão surgir problemas similares ao testar o `PureInboxScreen` com um teste unitário).

![Inbox quebrada](/intro-to-storybook/broken-inboxscreen-vue.png)

Uma forma de evitar este tipo de situações, consiste em evitar por completo a renderização de componentes contentor em qualquer lado na aplicação com a exceção do mais alto nível e injetar os dados ao longo da hierarquia de componentes.

No entanto, algum programador **irá querer** renderizar contentores num nível mais baixo na hierarquia de componentes. Já que pretendemos renderizar a maioria da aplicação no Storybook (sim queremos!), é necessária uma solução para esta situação.

<div class="aside">
    Como aparte, a transmissão de dados ao longo da hierarquia é uma abordagem legitima, particularmente quando é utilizado <a href="http://graphql.org/">GrapQL</a>. Foi desta forma que foi construido o <a href="https://www.chromatic.com">Chromatic</a>, juntamente com mais de 800+ estórias.
</div>

## Fornecer contexto ás estórias

As boas notícias é que é extremamente fácil injetar uma loja Vuex através de uma estória ao componente `PureInboxScreen`! Pode ser instanciada uma nova loja no ficheiro de estória e fornecê-la como contexto da estória:

```javascript
//src/components/PureInboxScreen.stories.js
import Vue from 'vue';
import Vuex from 'vuex';
import PureInboxScreen from './PureInboxScreen.vue';
import { action } from '@storybook/addon-actions';
import { defaultTasksData } from './PureTaskList.stories';
Vue.use(Vuex);
export const store = new Vuex.Store({
  state: {
    tasks: defaultTasksData,
  },
  actions: {
    pinTask(_, id) {
      action('pinTask')(id);
    },
    archiveTask(_, id) {
      action('archiveTask')(id);
    },
  },
});
export default {
  title: 'PureInboxScreen',
  excludeStories: /.*store$/,
};
export const Default = () => ({
  components: { PureInboxScreen },
  template: `<pure-inbox-screen/>`,
  store,
});
// tasklist with pinned tasks
export const error = () => ({
  components: { PureInboxScreen },
  template: `<pure-inbox-screen :error="true"/>`,
});
```

Existem abordagens semelhantes de forma a fornecer contextos simulados para outras bibliotecas de dados tal como [Apollo](https://www.npmjs.com/package/apollo-storybook-decorator), [Relay](https://github.com/orta/react-storybooks-relay-container) assim como outras.

A iteração de estados no Storybook faz com que seja bastante fácil testar, se for feito corretamente:

<video autoPlay muted playsInline loop >

  <source
    src="/intro-to-storybook/finished-inboxscreen-states.mp4"
    type="video/mp4"
  />
</video>

## Desenvolvimento orientado a Componentes

Começou-se do fundo com `Task`, prosseguindo para `TaskList` e agora chegou-se ao ecrã geral do interface de utilizador. O `InboxScreen`, acomoda um componente contentor que foi adicionado e inclui também estórias que o acompanham.

<video autoPlay muted playsInline loop style="width:480px; height:auto; margin: 0 auto;">
  <source
    src="/intro-to-storybook/component-driven-development-optimized.mp4"
    type="video/mp4"
  />
</video>

[**Component-Driven Development**](https://www.componentdriven.org/) permite a expansão gradual da complexidade á medida que se prossegue de forma ascendente na hierarquia de componentes. Dos benefícios ao utilizar-se esta abordagem, estão o processo de desenvolvimento focado e cobertura adicional das permutações possíveis do interface de utilizador.
Resumidamente esta abordagem ajuda na produção de interfaces de utilizador de uma qualidade extrema e assim como complexidade.

Ainda não finalizamos, o trabalho não acaba quando o interface de utilizador estiver construído. É necessário garantir que resiste ao teste do tempo.
