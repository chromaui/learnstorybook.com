---
title: 'Créer un simple composant'
tocTitle: 'Simple composant'
description: 'Créer un simple composant en isolation'
commit: '428c6f2'
---

Nous allons construire notre UI en suivant la méthode [de développement orienté composant](https://www.componentdriven.org/) (CDD). Il s'agit d'un processus qui construit les interfaces utilisateur de "bas en haut" en commençant par les composants et en terminant par les écrans. Le CDD vous permet d'évaluer le degré de complexité auquel vous êtes confronté lors de la construction de l'UI.

## Tâche (Task)

![Les trois états du composant Tâche](/intro-to-storybook/task-states-learnstorybook.png)

`Task` (Tâche) est le composant principal de notre application. Chaque tâche s'affiche avec une légère différence selon l'état dans lequel elle se trouve. Nous affichons une case cochée (ou non cochée), des informations sur la tâche et un bouton "épingle", qui nous permet de déplacer les tâches de haut en bas de la liste. Pour mettre tout cela en place, nous aurons besoin de ces props:

- `title` – un string (chaîne de caractères) décrivant la tâche
- `state` - sur quelle liste se trouve actuellement la tâche et est-elle cochée?

Lorsque nous commençons à construire une `Task`, nous écrivons d'abord nos tests d'états pour les différents types de tâches décrits ci-dessus. Ensuite, nous utilisons Storybook pour construire le composant de façon isolée en utilisant des données simulées. Nous testerons manuellement l'apparence du composant en fonction de chaque état au fur et à mesure.

## Préparer le terrain

Tout d'abord, créons la composante "tâche" et le fichier story qui l'accompagne : `src/components/Task.js` et `src/components/Task.stories.js`.

Nous commencerons par une implémentation standard de `Task`, en prenant simplement en compte les attributs dont nous savons que nous en aurons besoin et les deux actions que vous pouvez entreprendre sur une tâche (pour la déplacer entre les listes) :

```js:title=src/components/Task.js
import React from 'react';

export default function Task({ task: { id, title, state }, onArchiveTask, onPinTask }) {
  return (
    <div className="list-item">
      <label htmlFor="title" aria-label={title}>
        <input type="text" value={title} readOnly={true} name="title" />
      </label>
    </div>
  );
}
```

Ci-dessus, nous rendons un balisage simple pour `Task` fondé sur la structure HTML existante de l'application Todos.

Ci-dessous, nous allons construire les trois états de test de Task dans le fichier story:

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

Il y a deux niveaux d'organisation de base dans Storybook: le composant et ses stories enfants. Considérez chaque story comme une permutation d'un composant. Vous pouvez avoir autant de story par composant que vous en voulez.

- **Composant**
  - Story
  - Story
  - Story

Pour informer Storybook sur le composant que nous documentons, nous créons un export `default` qui contient:

- `component`: le composant lui-même
- `title`: Comment faire référence au composant dans la barre latérale de l'application Storybook

Pour définir nos stories, nous exportons une fonction pour chacun de nos états tests afin de générer une story. La story est une fonction qui renvoie un élément qui a été rendu (c'est-à-dire un composant avec un ensemble de props) dans un état donné --exactement comme un [Composant fonctionnel](https://reactjs.org/docs/components-and-props.html#function-and-class-components).

Comme nous avons plusieurs permutations de notre composant, il est pratique de lui assigner une variable `Template`. L'introduction de ce schéma dans vos stories réduira la quantité de code que vous devez écrire et maintenir.

<div class="aside">
💡 <code>Template.bind({})</code> est une technique <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/bind">standard JavaScript</a> permettant de faire une copie d'une fonction. Nous utilisons cette technique pour permettre à chaque story exportée de définir ses propres propriétés, mais en utilisant la même implémentation.
</div>

Les arguments ou [`args`](https://storybook.js.org/docs/react/writing-stories/args) pour faire court, nous permettent d'éditer en temps réel nos composants avec l'addon de contrôles sans avoir à redémarrer Storybook. Quand la valeur d'un [`args`](https://storybook.js.org/docs/react/writing-stories/args) change, le composant change aussi.

Lors de la création d'une story, nous utilisons un argument de base `task` pour construire la forme de la tâche que le composant attend. Cette tâche est généralement modélisée à partir de ce à quoi ressemblent les données réelles. Encore une fois, `exporter` cette forme nous permettra de la réutiliser dans des stories ultérieures, comme nous le verrons.

<div class="aside">
💡 Les <a href="https://storybook.js.org/docs/react/essentials/actions"><b>actions</b></a> vous aident à vérifier les interactions lors de la construction des composants de l'UI en isolation. Souvent, vous n'aurez pas accès aux fonctions et à l'état dont vous disposez dans le contexte de l'application. Utilisez <code>action()</code> pour les simuler.
</div>

## Configuration

Nous devrons apporter quelques modifications à la configuration du Storybook pour qu'il remarque non seulement nos stories récemment créées, mais nous permette également d'utiliser le fichier CSS de l'application (situé dans `src/index.css`).

Commencez par modifier le fichier de configuration de votre Storybook (`.storybook/main.js`) comme suit:

```diff:title=.storybook/main.js
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
    '@storybook/preset-create-react-app',
    '@storybook/addon-interactions',
  ],
  framework: '@storybook/react',
  core: {
    builder: '@storybook/builder-webpack5',
  },
  features: {
    interactionsDebugger: true,
  },
};
```

Après avoir effectué la modification ci-dessus, dans le dossier `storybook`, changez votre `preview.js` en ce qui suit:

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

Les [`parameters`](https://storybook.js.org/docs/react/writing-stories/parameters) sont généralement utilisés pour contrôler le comportement des fonctionnalités et des addons de Storybook. Dans notre cas, nous allons les utiliser pour configurer la manière dont les `actions` (les callbacks simulés) sont gérées.

Les `actions` nous permettent de créer des callbacks qui apparaissent dans la section **actions** de Storybook lorsqu'on clique dessus. Ainsi, lorsque nous construisons un bouton d'épingle, nous pourrons déterminer si un clic de bouton est réussi dans l'interface.

Une fois que nous aurons fait cela, le redémarrage du serveur Storybook devrait permettre d'obtenir des cas de test pour les trois états de Task:

<video autoPlay muted playsInline loop>
  <source
    src="/intro-to-storybook/inprogress-task-states-6-0.mp4"
    type="video/mp4"
  />
</video>

## Construire les états

Maintenant que nous avons configuré Storybook, importé des styles et élaboré des scénarios de test, nous pouvons rapidement commencer à implémenter le HTML du composant pour qu'il corresponde au design.

Le composant est encore basique pour le moment. Tout d'abord, écrivons le code qui permettra de réaliser la conception sans trop entrer dans les détails:

```js:title=src/components/Task.js
import React from 'react';

export default function Task({ task: { id, title, state }, onArchiveTask, onPinTask }) {
  return (
    <div className={`list-item ${state}`}>
      <label
        htmlFor="checked"
        aria-label={`archiveTask-${id}`}
        className="checkbox"
      >
        <input
          type="checkbox"
          disabled={true}
          name="checked"
          id={`archiveTask-${id}`}
          checked={state === "TASK_ARCHIVED"}
        />
        <span
          className="checkbox-custom"
          onClick={() => onArchiveTask(id)}
        />
      </label>

      <label htmlFor="title" aria-label={title} className="title">
        <input
          type="text"
          value={title}
          readOnly={true}
          name="title"
          placeholder="Input title"
        />
      </label>

      {state !== "TASK_ARCHIVED" && (
        <button
          className="pin-button"
          onClick={() => onPinTask(id)}
          id={`pinTask-${id}`}
          aria-label={`pinTask-${id}`}
          key={`pinTask-${id}`}
        >
          <span className={`icon-star`} />
        </button>
      )}
    </div>
  );
}
```

Le balisage supplémentaire ci-dessus, combiné avec le CSS que nous avons importé précédemment, donne l'UI suivante:

<video autoPlay muted playsInline loop>
  <source
    src="/intro-to-storybook/finished-task-states-6-0.mp4"
    type="video/mp4"
  />
</video>

## Préciser les exigences en matière de données

Une bonne pratique de React consiste à utiliser les `propTypes` pour spécifier la forme des données qu'un composant attend. Non seulement il s'agit d'une méthode d'auto-documentation, mais elle permet également de détecter les problèmes en amont.

```diff:title=src/components/Task.js
import React from 'react';
+ import PropTypes from 'prop-types';

export default function Task({ task: { id, title, state }, onArchiveTask, onPinTask }) {
  return (
    <div className={`list-item ${state}`}>
      <label
        htmlFor="checked"
        aria-label={`archiveTask-${id}`}
        className="checkbox"
      >
        <input
          type="checkbox"
          disabled={true}
          name="checked"
          id={`archiveTask-${id}`}
          checked={state === "TASK_ARCHIVED"}
        />
        <span
          className="checkbox-custom"
          onClick={() => onArchiveTask(id)}
        />
      </label>

      <label htmlFor="title" aria-label={title} className="title">
        <input
          type="text"
          value={title}
          readOnly={true}
          name="title"
          placeholder="Input title"
        />
      </label>

      {state !== "TASK_ARCHIVED" && (
        <button
          className="pin-button"
          onClick={() => onPinTask(id)}
          id={`pinTask-${id}`}
          aria-label={`pinTask-${id}`}
          key={`pinTask-${id}`}
        >
          <span className={`icon-star`} />
        </button>
      )}
    </div>
  );
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

Désormais, un avertissement apparaîtra en mode développement si le composant Task est mal utilisé.

<div class="aside">
💡 Une autre façon d'atteindre le même objectif est d'utiliser un système de typage JavaScript comme TypeScript et créer un type pour les propriétés du composant.
</div>

## Composant construit!

Nous avons maintenant réussi à créer un composant sans avoir besoin d'un serveur ou d'exécuter toute l'application front-end. L'étape suivante consiste à construire les autres composants de la Taskbox un par un, de manière similaire.

Comme vous pouvez le voir, il est facile et rapide de commencer à construire des composants de manière isolée. Nous pouvons nous attendre à produire une interface utilisateur de meilleure qualité avec moins de bogues et plus de peaufinage car il est possible de se pencher et de tester tous les états possibles.

## Voir les problèmes d'accessibilité

Les tests d'accessibilité font référence à une pratique d'audit du DOM avec des outils automatisés pour détecter un ensemble d'heuristiques fondés sur les règles [WCAG](https://www.w3.org/WAI/standards-guidelines/wcag/) et d'autres bonnes pratiques accéptées par l'industrie. Ils agissent comme une premiere action pour vous assurer que votre application soit utilisable pour la maximum de personnes possibles, incluant les mal voyants, les mal entendants ou des personnes ayant des problèmes cognitifs.

Storybook inclut un [addon d'accessibilité officiel](https://storybook.js.org/addons/@storybook/addon-a11y). Fondé sur [axe-core](https://github.com/dequelabs/axe-core) de Deque, il peut analyser jusqu'à [57% des problèmes WCAG](https://www.deque.com/blog/automated-testing-study-identifies-57-percent-of-digital-accessibility-issues/).

Regardons comment cela marche! Executez la commande suivante pour installer l'addon:

```shell
yarn add --dev @storybook/addon-a11y
```

Ensuite, mettez à jour le fichier de configuration de Storybook (`.storybook/main.js`):

```diff:title=.storybook/main.js
module.exports = {
  stories: ['../src/components/**/*.stories.js'],
  staticDirs: ['../public'],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/preset-create-react-app',
    '@storybook/addon-interactions',
+   '@storybook/addon-a11y',
  ],
  framework: '@storybook/react',
  core: {
    builder: '@storybook/builder-webpack5',
  },
  features: {
    interactionsDebugger: true,
  },
};
```

![Problème d'accessibilité de Task dans Storybook](/intro-to-storybook/finished-task-states-accessibility-issue.png)

A travers nos stories, nous pouvons voir que l'addon a trouvé un problème d'accessibilité dans l'un de nos tests d'états. Le message [**"Elements must have sufficient color contrast"**](https://dequeuniversity.com/rules/axe/4.4/color-contrast?application=axeAPI) signifie qu'il n'y a pas assez de contraste entre le titre de la tâche et la couleur de fond. Nous pouvons rapidement corriger cela en changeant la couleur du texte vers un gris plus noir dans le CSS (situé dans `src/index.css`).

```diff:title=src/index.css
.list-item.TASK_ARCHIVED input[type="text"] {
- color: #a0aec0;
+ color: #4a5568;
  text-decoration: line-through;
}
```

Ca y est! Nous avons fait un premier pas pour rendre notre application accessible. En continuant à ajouter de la complexité à notre application, nous pouvons répéter ce process pour tous les autres composants sans besoin de rajouter des outils additionnels ou des environnements de tests.

<div class="aside">
💡 N'oubliez pas de commiter vos changements dans git!
</div>
