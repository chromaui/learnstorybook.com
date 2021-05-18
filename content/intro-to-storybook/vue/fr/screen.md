---
title: 'Construire un écran'
tocTitle: 'Ecrans'
description: 'Construire un écran à partir de composants'
commit: '01ec436'
---

Nous nous sommes concentrés sur la création d'interfaces utilisateur de bas en haut; commencer petit et ajouter de la complexité. Cela nous a permis de développer chaque composant de manière isolée, comprendre ses besoins en données, et jouer avec dans Storybook. Tout cela sans avoir besoin de monter un serveur ou de créer des écrans!

Dans ce chaptre, nous continuons d'améliorer la sophistication en combinant des composants dans un écran et en développant cet écran dans Storybook.

## Composants de conteneurs imbriqués

Comme notre application est très simple, l'écran que nous allons créer est assez trivial, il suffit d'encapsuler le composant conteneur `TaskList` (qui fournit ses propres données via Vuex) dans une mise en page et d'extraire un champ d'erreur de niveau supérieur du magasin (supposons nous allons définir ce champ si nous avons un problème de connexion à notre serveur). Créons une vue `PureInboxScreen.vue` dans votre dossier `src/components/` :

```html:title=src/components/PureInboxScreen.vue
<template>
  <div>
    <div v-if="error" class="page lists-show">
      <div class="wrapper-message">
        <span class="icon-face-sad" />
        <div class="title-message">Oh no!</div>
        <div class="subtitle-message">Something went wrong</div>
      </div>
    </div>
    <div v-else class="page lists-show">
      <nav>
        <h1 class="title-page">
          <span class="title-wrapper">Taskbox</span>
        </h1>
      </nav>
      <TaskList />
    </div>
  </div>
</template>

<script>
  import TaskList from './TaskList.vue';
  export default {
    name: 'PureInboxScreen',
    components: { TaskList },
    props: {
      error: { type: Boolean, default: false },
    },
  };
</script>
```

Ensuite, nous pouvons créer un conteneur, qui récupère à nouveau les données pour `PureInboxScreen` dans `src/components/InboxScreen.vue`:

```html:title=src/components/InboxScreen.vue
<template>
  <PureInboxScreen :error="error" />
</template>

<script>
  import { computed } from 'vue';

  import { useStore } from 'vuex';

  import PureInboxScreen from './PureInboxScreen';

  export default {
    name: 'InboxScreen',
    components: { PureInboxScreen },
    setup() {
      //👇 Creates a store instance
      const store = useStore();

      //👇 Retrieves the error from the store's state
      const error = computed(() => store.state.error);
      return {
        error,
      };
    },
  };
</script>
```

Nous modifions également le composant `App` pour intégrer `InboxScreen` (éventuellement, nous utiliserions un routeur pour choisir le bon écran, mais ne nous inquiétons pas à ce sujet ici) :

```diff:title=src/App.vue
<template>
  <div id="app">
-   <task-list />
+   <InboxScreen />
  </div>
</template>

<script>
- import TaskList from './components/TaskList.vue';
+ import InboxScreen from './components/InboxScreen.vue';
  export default {
    name: 'app',
    components: {
-     TaskList
+     InboxScreen,
    },
  };
</script>

<style>
  @import './index.css';
</style>
```

Cependant, là où les choses deviennent intéressantes, c'est dans le rendu des stories dans Storybook.

Comme nous l'avons vu précédemment, le composant `TaskList` est un **conteneur** qui rend le composant de présentation `PureTaskList`. Par définition, les composants de conteneur ne peuvent pas simplement être rendus isolément; ils s'attendent à recevoir un certain contexte ou à se connecter à un service. Cela signifie que pour rendre un conteneur dans Storybook, nous devons bouchonner (c'est-à-dire fournir une version simulée) le contexte ou le service dont il a besoin.

Lors du placement du composant `TaskList` dans Storybook, nous avons pu éviter ce problème simplement en intégrant le composant `PureTaskList` et en évitant le conteneur. Nous allons faire quelque chose de similaire et rendre le composant `PureInboxScreen` dans Storybook également.

Cependant, pour le composant `PureInboxScreen`, nous avons un problème car bien que le `PureInboxScreen` lui-même soit de présentation, son enfant, le composant `TaskList`, ne l'est pas. Dans un sens, `PureInboxScreen` a été pollué par le "container-ness". Ainsi, lorsque nous configurons nos histoires dans `src/components/PureInboxScreen.stories.js` :

```js:title=src/components/PureInboxScreen.stories.js
import PureInboxScreen from './PureInboxScreen.vue';

export default {
  component: PureInboxScreen,
  title: 'PureInboxScreen',
};

const Template = args => ({
  components: { PureInboxScreen },
  setup() {
    return {
      args,
    };
  },
  template: '<PureInboxScreen v-bind="args" />',
});

export const Default = Template.bind({});

export const Error = Template.bind({});
Error.args = { error: true };
```

Nous voyons que bien que l'histoire `erreor` fonctionne très bien, nous avons un problème dans l'histoire `default`, car le composant `TaskList` n'a pas de magasin Vuex auquel se connecter.

![Broken inbox](/intro-to-storybook/broken-inboxscreen-vue.png)

Une façon d'éviter ce problème consiste à ne jamais afficher les composants de conteneur dans votre application, sauf au niveau le plus élevé et à transmettre à la place toutes les exigences en matière de données dans la hiérarchie des composants.

Cependant, les développeurs **devront** inévitablement rendre les conteneurs plus bas dans la hiérarchie des composants. Si nous voulons afficher la plupart ou la totalité de l'application dans Storybook (nous le faisons!), Nous avons besoin d'une solution à ce problème.

<div class="aside">
💡 En passant, la transmission des données dans la hiérarchie est une approche légitime, en particulier lors de l'utilisation de <a href="http://graphql.org/">GraphQL</a>. C'est ainsi que nous avons construit <a href="https://www.chromatic.com">Chromatic</a> aux côtés de plus de 800 histoires.
</div>

## Fournir du contexte aux histoires

La bonne nouvelle est qu'il est facile de fournir un magasin Vuex au composant `PureInboxScreen` dans une story ! Nous pouvons créer un nouveau magasin dans notre fichier de story et le transmettre comme contexte de la story :

```diff:title=src/components/PureInboxScreen.stories.js
+ import { app } from '@storybook/vue3';

+ import { createStore } from 'vuex';

import PureInboxScreen from './PureInboxScreen.vue';

+ import { action } from '@storybook/addon-actions';
+ import * as TaskListStories from './PureTaskList.stories';

+ const store = createStore({
+   state: {
+     tasks: TaskListStories.Default.args.tasks,
+   },
+   actions: {
+     pinTask(context, id) {
+       action("pin-task")(id);
+     },
+     archiveTask(context, id) {
+       action("archive-task")(id);
+     },
+   },
+ });

+ app.use(store);

export default {
  title: 'PureInboxScreen',
  component: PureInboxScreen,
};

const Template = (args) => ({
  components: { PureInboxScreen },
  setup() {
    return {
      args,
    };
  },
  template: '<PureInboxScreen v-bind="args" />',
});

export const Default = Template.bind({});

export const Error = Template.bind({});
Error.args = { error: true };
```

Des approches similaires existent pour fournir un contexte simulé pour d'autres bibliothèques de données, telles qu'[Apollo](https://www.npmjs.com/package/apollo-storybook-decorator), [Relay](https://github.com/orta/react-storybooks-relay-container) et autres.

En parcourant les états dans Storybook, il est facile de tester que nous avons fait cela correctement:

<video autoPlay muted playsInline loop >

  <source
    src="/intro-to-storybook/finished-inboxscreen-states-6-0.mp4"
    type="video/mp4"
  />
</video>

## Le développement basé sur les composants (Component-Driven Development)

Nous avons commencé par le composant le plus bas avec `Task`, puis nous sommes passés à `TaskList`, maintenant nous sommes ici avec une interface utilisateur à écran complet. Notre `InboxScreen` contient un composant de conteneur imbriqué et comprend des histoires d'accompagnement.

<video autoPlay muted playsInline loop style="width:480px; height:auto; margin: 0 auto;">
  <source
    src="/intro-to-storybook/component-driven-development-optimized.mp4"
    type="video/mp4"
  />
</video>

[**Le développement basé sur les composants (Component-Driven Development)**](https://www.componentdriven.org/) vous permet d'augmenter progressivement la complexité à mesure que vous montez dans la hiérarchie des composants. Parmi les avantages figurent un processus de développement plus ciblé et une couverture accrue de toutes les permutations possibles de l'interface utilisateur. En bref, CDD vous aide à créer des interfaces utilisateur de meilleure qualité et plus complexes.

Nous n'avons pas encore terminé - le travail ne se termine pas lorsque l'interface utilisateur est créée. Nous devons également nous assurer qu'il reste durable dans le temps.

<div class="aside">
💡 N'oubliez pas de valider vos modifications avec git !
</div>
