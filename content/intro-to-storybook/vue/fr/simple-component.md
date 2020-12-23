---
title: 'Construire un simple composant'
tocTitle: 'Un simple composant'
description: 'Construire un simple composant en isolation'
commit: 'f03552f'
---

Nous allons construire notre propre interface utilisateur en suivant la méthode [Component-Driven Development](https://www.componentdriven.org/). C'est un processus qui créé des interfaces utilisateurs du début à la fin, en commençant par les composants et terminant avec les écrans. CDD vous aide à adapter la complexité à laquelle vous êtes confronté lors de la création de l'interface utilisateur.

## Tâche

![Composant de taches sous 3 états](/intro-to-storybook/task-states-learnstorybook.png)

`Tâche` est le composant principal de notre application. Chaque tâche affiche s'affiche légèrement différemment en fonction de son état. Nous affichons une case cochée (ou non), quelques informations sur la tâche, et un bouton "épingler", nous permettant de déplacer les tâches dans la liste. Pour mettre en place cela, nous aurons besoin de ces propriétés :

- `titre` – une chaine de caractères décrivant la tâche
- `état` - la liste d'affectation de la tâche ainsi qu'un indicateur de sélection de la coche

Pour débuter la construction du composant `Tâche`, nous écrivons d'abord nos tests d'état correspondant aux différents types de taches visibles ci-dessus. Ensuite, nous utilisons Storybook pour construire le composant de manière isolée avec des données bouchonnées. Nous pourrons “tester visuellement“ l'apparence du composant pour chaque état que nous avons.

Le procédure est similaire au [Test-driven development](https://en.wikipedia.org/wiki/Test-driven_development) (TDD) que nous pouvons appeler “[Visual TDD](https://blog.hichroma.com/visual-test-driven-development-aec1c98bed87)”.

## Configuration

Premièrement, créons le composant Tâche et le fichier story associé : `src/components/Task.vue` et `src/components/Task.stories.js`.

Nous allons commencer avec l'implémentation de base de la `Tâche`, en prenant simplement les attributs dont nous aurons besoin et les deux actions que vous pouvez effectuer sur une tâche (la déplacer entre les listes) :

```html
<!--src/components/Task.vue-->
<template>
  <div class="list-item">
    <input type="text" :readonly="true" :value="this.task.title" />
  </div>
</template>

<script>
  export default {
    name: 'task',
    props: {
      task: {
        type: Object,
        required: true,
        default: () => ({}),
      },
    },
  };
</script>
```

Ci-dessus, nous donnons une structure simple du composant `Tâche` basé sur l'existante structure HTML de l'application Todos.

Ci-dessous nous construisons les trois états de test d'une Tâche dans le fichier story :

```javascript
// src/components/Task.stories.js
import { action } from '@storybook/addon-actions';
import Task from './Task';
export default {
  title: 'Task',
  // Nos exports se terminant par "Data" ne sont pas des stories.
  excludeStories: /.*Data$/,
};
export const actionsData = {
  onPinTask: action('onPinTask'),
  onArchiveTask: action('onArchiveTask'),
};

export const taskData = {
  id: '1',
  title: 'Test Task',
  state: 'Task_INBOX',
  updated_at: new Date(2019, 0, 1, 9, 0),
};

const taskTemplate = `<task :task="task" @archiveTask="onArchiveTask" @pinTask="onPinTask"/>`;

// Etat par défaut d'une tâche
export const Default = () => ({
  components: { Task },
  template: taskTemplate,
  props: {
    task: {
      default: () => taskData,
    },
  },
  methods: actionsData,
});
// Etat épinglé d'une tâche
export const Pinned = () => ({
  components: { Task },
  template: taskTemplate,
  props: {
    task: {
      default: () => ({
        ...taskData,
        state: 'TASK_PINNED',
      }),
    },
  },
  methods: actionsData,
});
// Etat archivé d'une tâche
export const Archived = () => ({
  components: { Task },
  template: taskTemplate,
  props: {
    task: {
      default: () => ({
        ...taskData,
        state: 'TASK_ARCHIVED',
      }),
    },
  },
  methods: actionsData,
});
```

Il y a deux niveaux d'organisation de base dans Storybook : le composant et ses stories enfant. Considérez chaque story comme une permutation d'un composant. Vous pouvez avoir autant de stories par composant que vous le voulez.

- **Composant**
  - Story
  - Story
  - Story

Pour informer Storybook du composant que nous documentons, nous créons un export `default` qui contient :

- `component` -- le composant,
- `title` -- le titre mentionné dans la barre latérale de l'application Storybook,
- `excludeStories` -- informations requises par la story, mais ne doient pas être rendues par l'application Storybook.

Pour définir nos stories, nous exportons une fonction pour chacun de nos états de test pour générer une story. La story est une fonction qui retourne a rendu d'élément (c'est-à-dire une classe de composant avec une liste de propriétés) dans un état donné --- exactement comme un [Composant fonctionnel sans état](https://vuejs.org/v2/guide/render-function.html#Functional-Components).

`action()` nous permet de créer un callback qui apparait dans le panneau des **actions** de l'interface Storybook quand vous cliquez dessus. Quand nous contruisons un bouton d'épingle, nous serons donc capable de déterminer dans l'interface utilisateur de test si un clic sur le bouton a réussi.

Comme nous devons passer le même ensemble d'actions à toutes les permutations de notre composant, une bonne pratique consiste à les regrouper dans une seule variable `actionsData` et de le transmettre dans chaque définition de story (où elles sont disponibles via la propriété `methods`).

Une autre bonne chose à propos du regroupement des `actionsData` dont un composant a besoin, c'est de pouvoir les `exporter`et de les utiliser dans les stories pour les composants qui réutilisent ce composant, comme nous le verrons plus tard.

Lors de la création d'une story, nous utilisons une tâche de base (`taskData`) pour construire la forme de la tâche attendue par le composant. C'est généralement modelisé à partir de réelles données. Encore une fois, l'`export`ation de cette forme nous permettra de la réutiliser dans d'autres stories comme nous le verrons.

<div class="aside">
Les <a href="https://storybook.js.org/addons/introduction/#2-native-addons"><b>actions</b></a> vous aident à vérifier les interactions lors de la création des composants d'interface utilisateur de manière isolée. Souvent, vous n'aurez pas accès aux fonctions et aux états que vous dans le contexte de l'application. Utilisez <code>action()</code> pour les insérer.
</div>

## Configuration

Nous devons effectuer quelques modifications à la configuration de Storybook afin qu'il remarque non seulement nos stories récemment créées, mais aussi nous permettre d'utiliser les fichiers CSS modifiés dans le [chapitre précédent](/vue/fr/get-started).

Commencez par changer votre fichier de configuration Storybook (`.storybook/main.js`) avec ceci :

```javascript
// .storybook/main.js
module.exports = {
  stories: ['../src/components/**/*.stories.js'],
  addons: ['@storybook/addon-actions', '@storybook/addon-links'],
};
```

Après avoir effectué la modification ci-dessus, dans le dossier `.storybook`, ajoutez un nouveau fichier appelé `preview.js` avec ces informations :

```javascript
// .storybook/preview.js
import '../src/index.css';
```

Une fois cela fait, le redémarrage du serveur Storybook devrait générer des cas de test pour les trois états de la tâche :

<video autoPlay muted playsInline controls >
  <source
    src="/intro-to-storybook//inprogress-task-states.mp4"
    type="video/mp4"
  />
</video>

## Construire les états

Maintenant que nous avons Storybook de configuré, que les styles sont importés et que cas de test sont construits, nous pouvons rapidement commencer l'implémentation du code HTML du composant pour correspondre au besoin.

Notre composant est encore assez rudimentaire pour le moment. Nous allons faire quelques modifications pour qu'il corresponde au design attendu sans pour autant rentrer trop dans le détail :

```html
<!--src/components/Task.vue-->
<template>
  <div :class="taskClass">
    <label class="checkbox">
      <input type="checkbox" :checked="isChecked" :disabled="true" name="checked" />
      <span class="checkbox-custom" @click="$emit('archiveTask', task.id)" />
    </label>
    <div class="title">
      <input type="text" :readonly="true" :value="this.task.title" placeholder="Input title" />
    </div>
    <div class="actions">
      <a @click="$emit('pinTask', task.id)" v-if="!isChecked">
        <span class="icon-star" />
      </a>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'task',
    props: {
      task: {
        type: Object,
        required: true,
        default: () => ({
          id: '',
          state: '',
          title: '',
        }),
      },
    },
    computed: {
      taskClass() {
        return `list-item ${this.task.state}`;
      },
      isChecked() {
        return this.task.state === 'TASK_ARCHIVED';
      },
    },
  };
</script>
```

Le code additionnel ci-dessus combiné avec le CSS importé précédemment donne cet interface utilisateur :

<video autoPlay muted playsInline loop>
  <source
    src="/intro-to-storybook/finished-task-states.mp4"
    type="video/mp4"
  />
</video>

## Le composant est construit!

Nous venons de créer un composant sans avoir besoin de serveur ni d'exécuter toute l'application. La prochaine étape consiste à créer les composants Taskbox un par un de la même manière.

Comme vous pouvez le voir, la création de composant isolé est simple et rapide. Nous pouvons nous attendre à produire une interface utilisateur de meilleure qualité avec peu de bug et plus de détail car il est possible de creuser et de tester chaque état possible.

## Tests automatisés

Storybook nous a donné un excellent moyen de tester visuellement notre application durant son développement. Les `stories` nous aideront à nous assurer que nous ne casserons pas notre tâche visuellement pendant le développement de l'application. Cependant, c'est un processus complètement manuel à ce stade, et quelqu'un doit faire l'effort de cliquer sur chaque état de test et s'assurer que le rendu est correct et sans aucune erreur ou avertissement. Ne pouvons-nous pas le faire automatiquement ?

### Tests instantanés

Le test instantané fait référence à la pratique consistant à enregistrer la bonne sortie d'un composant pour une entrée donnée, puis de signaler le composant à chaque fois que la sortie change. Cela complète Storybook, parce que Storybook est un moyen rapide de voir les nouvelles versions d'un composant et de visualiser les changements.

<div class="aside">
Assurez-vous que vos composants gèrent des données qui ne changent pas, afin que vos tests instantanés n'échouent pas à chaque fois. Faites attention à certains éléments, comme les dates ou les valeurs générées aléatoirement.
</div>

Avec le [plugin Storyshots](https://github.com/storybooks/storybook/tree/master/addons/storyshots) un test instantané est créé pour chacune de vos stories. Utilisez-le en ajoutant la dépendance suivante :

```bash
yarn add -D @storybook/addon-storyshots jest-vue-preprocessor
```

Puis créez un fichier `tests/unit/storybook.spec.js` avec le code suivant :

```javascript
// tests/unit/storybook.spec.js
import initStoryshots from '@storybook/addon-storyshots';

initStoryshots();
```

Nous devons ajouter une ligne dans votre `jest.config.js`:

```js

  // jest.config.js
  transformIgnorePatterns: ["/node_modules/(?!(@storybook/.*\\.vue$))"],
```

Une fois toutes les étapes réalisées, nous pouvons exécuter cette commande `yarn test:unit` et voir la sortie suivante :

![Task test runner](/intro-to-storybook/task-testrunner.png)

Nous avons maintenant un test instantané pour chacune de nos stories de notre `Tâche`. Si vous changez l'implémentation de `Tâche`, nous serons notifiés de vérifier les changements.
