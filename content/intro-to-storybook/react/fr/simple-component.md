---
title: 'Créer un simple composant'
tocTitle: 'Simple composant'
description: 'Créer un simple composant en isolation'
commit: '3d9cd8c'
---

Nous allons construire notre interface utilisateur(UI) en suivant la méthode [Component-Driven Development](https://blog.hichroma.com/component-driven-development-ce1109d56c8e) (CDD). Il s'agit d'un processus qui construit les interfaces utilisateur de "bas en haut" en commençant par les composants et en terminant par les écrans. Le CDD vous permet d'évaluer le degré de complexité auquel vous êtes confronté lors de la construction de l'interface utilisateur(UI).

## Tâche(Task)

![Les trois états du composant Tâche](/intro-to-storybook/task-states-learnstorybook.png)

`Task` (Tâche) est le composant principal dans notre application. Chaque tâche s'affiche avec une légère différence selon l'état dans lequel elle se trouve. Nous affichons une case cochée (ou non cochée), des informations sur la tâche et un bouton "épingle", qui nous permet de déplacer les tâches de haut en bas de la liste. Pour mettre tout cela en place, nous aurons besoin de ces props:

- `title` – un string (chaîne de caractères) décrivant la tâche
- `state` - sur quelle liste se trouve actuellement la tâche et est-elle cochée ?

Lorsque nous commençons à construire une `Task` (Tâche), nous écrivons d'abord nos tests d'états pour les différents types de tâches décrits ci-dessus. Ensuite, nous utilisons Storybook pour construire le composant de façon isolée en utilisant des données simulées. Nous testerons manuellement l'apparence du composant en fonction de chaque état au fur et à mesure.

## Préparer le terrain

Tout d'abord, créons la composante "tâche" et le fichier story qui l'accompagne : `src/components/Task.js` et `src/components/Task.stories.js`.

Nous commencerons par une mise en œuvre de base de `Task` (Tâche), en prenant simplement en compte les attributs dont nous savons que nous en aurons besoin et les deux actions que vous pouvez entreprendre sur une tâche (pour la déplacer entre les listes) :

```javascript
// src/components/Task.js

import React from 'react';

export default function Task({ task: { id, title, state }, onArchiveTask, onPinTask }) {
  return (
    <div className="list-item">
      <input type="text" value={title} readOnly={true} />
    </div>
  );
}
```

Ci-dessus, nous rendons un balisage simple pour `Task` basé sur la structure HTML existante de l'application Todos.

Ci-dessous, nous allons construire les trois états de test de Task dans le fichier story:

```javascript
// src/components/Task.stories.js

import React from 'react';
import { action } from '@storybook/addon-actions';

import Task from './Task';

export default {
  component: Task,
  title: 'Task',
  // Our exports that end in "Data" are not stories.
  excludeStories: /.*Data$/,
};

export const taskData = {
  id: '1',
  title: 'Test Task',
  state: 'TASK_INBOX',
  updatedAt: new Date(2018, 0, 1, 9, 0),
};

export const actionsData = {
  onPinTask: action('onPinTask'),
  onArchiveTask: action('onArchiveTask'),
};

export const Default = () => <Task task={{ ...taskData }} {...actionsData} />;

export const Pinned = () => <Task task={{ ...taskData, state: 'TASK_PINNED' }} {...actionsData} />;

export const Archived = () => (
  <Task task={{ ...taskData, state: 'TASK_ARCHIVED' }} {...actionsData} />
);
```

Il y a deux niveaux d'organisation de base dans Storybook : le composant et ses story enfants. Considérez chaque story comme une permutation d'un composant. Vous pouvez avoir autant de story par composant que vous en voulez.

- **Composant**
  - Story
  - Story
  - Story

Pour informer Storybook sur le composant que nous documentons, nous créons un `default` export qui contient :

- `component` -- le composant lui-même,
- `title` -- comment faire référence au composant dans la barre latérale de l'application Storybook,
- `excludeStories` -- les export dans le fichier story qui ne doivent pas être rendues comme des story par Storybook.

Pour définir nos histoires, nous exportons une fonction pour chacun de nos états tests afin de générer une story.
Le story est une fonction qui renvoie un élément qui a été rendu (c'est-à-dire un composant avec un ensemble de props) dans un état donné--exactement comme un [Stateless Functional Component](https://reactjs.org/docs/components-and-props.html).

`action()` nous permet de créer un callback qui apparaît dans le panneau d'**actions** de l'interface utilisateur du Storybook lorsqu'on clique dessus. Ainsi, lorsque nous construisons un bouton d'épingle, nous pourrons déterminer dans l'interface de test si un clic de bouton est réussi.

Comme nous avons besoin de passer le même ensemble d'actions à toutes les permutations de notre composant, il est pratique de les regrouper en une seule variable `actionsData` et d'utiliser l'expansion de props `{...actionsData}` de React pour les passer toutes en même temps. `<Task {...actionsData}>` est équivalent à `<Task onPinTask={actionsData.onPinTask} onArchiveTask={actionsData.onArchiveTask}>`.

Un autre avantage de regrouper les actions dans `ActionsData` est que vous pouvez `export` cette variable et utiliser les actions dans les story pour des composants qui réutilisent ce composant, comme nous le verrons plus tard.

Lors de la création d'une story, nous utilisons une tâche de base (`taskData`) pour construire la forme de la tâche que le composant attend. Cette tâche est généralement modélisée à partir de ce à quoi ressemblent les données réelles. Encore une fois, `export`-er cette forme nous permettra de la réutiliser dans des histoires ultérieures, comme nous le verrons.

<div class="aside">
<a href="https://storybook.js.org/addons/introduction/#2-native-addons"><b>Actions</b></a> vous aident à vérifier les interactions lors de la construction des composants de l'interface utilisateur en isolation. Souvent, vous n'aurez pas accès aux fonctions et à l'état dont vous disposez dans le contexte de l'application. Utilisez <code>action()</code> pour les simuler.
</div>

## Configuration

Nous devrons apporter quelques modifications à la configuration du Storybook pour qu'il remarque non seulement nos story récemment créées, mais nous permette également d'utiliser le fichier CSS qui a été modifié dans le [chapitre précédent](/react/en/get-started).

Commencez par modifier le fichier de configuration de votre Storybook (`.storybook/main.js`) comme suit :

```javascript
// .storybook/main.js

module.exports = {
  stories: ['../src/components/**/*.stories.js'],
  addons: [
    '@storybook/preset-create-react-app',
    '@storybook/addon-actions',
    '@storybook/addon-links',
  ],
};
```

Après avoir effectué la modification ci-dessus, dans le dossier `storybook`, ajoutez un nouveau fichier appelé `preview.js` avec ce qui suit :

```javascript
// .storybook/preview.js

import '../src/index.css';
```

Une fois que nous aurons fait cela, le redémarrage du serveur Storybook devrait permettre d'obtenir des cas de test pour les trois états de la tâche(Task) :

<video autoPlay muted playsInline loop>
  <source
    src="/intro-to-storybook//inprogress-task-states.mp4"
    type="video/mp4"
  />
</video>

## Construire les États

Maintenant que nous avons configuré Storybook, importé des styles et élaboré des scénarios de test, nous pouvons rapidement commencer à mettre en œuvre le HTML du composant pour qu'il corresponde au design.

Le composant est encore basique pour le moment. Tout d'abord, écrivons le code qui permettra de réaliser la conception sans trop entrer dans les détails:

```javascript
// src/components/Task.js

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

La balisage supplémentaire ci-dessus, combiné avec le CSS que nous avons importé précédemment, donne l'interface utilisateur suivante :

<video autoPlay muted playsInline loop>
  <source
    src="/intro-to-storybook/finished-task-states.mp4"
    type="video/mp4"
  />
</video>

## Préciser les exigences en matière de données

La meilleure pratique consiste à utiliser les "propTypes" dans React pour spécifier la forme des données qu'un composant attend. Non seulement il s'agit d'une méthode d'auto-documentation, mais elle permet également de détecter les problèmes à un stade précoce.

```javascript
// src/components/Task.js

import React from 'react';
import PropTypes from 'prop-types';

export default function Task({ task: { id, title, state }, onArchiveTask, onPinTask }) {
  // ...
}

Task.propTypes = {
  task: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    state: PropTypes.string.isRequired,
  }),
  onArchiveTask: PropTypes.func,
  onPinTask: PropTypes.func,
};
```

Désormais, un avertissement apparaîtra en mode développement si la composante "Tache"(Task) est mal utilisée.

<div class="aside">
Une autre façon d'atteindre le même objectif est d'utiliser un système de typage JavaScript comme TypeScript pour créer un type pour les propriétés du composant.
</div>

## Composant construit !

Nous avons maintenant réussi à créer un composant sans avoir besoin d'un serveur ou d'exécuter toute l'application front-end. L'étape suivante consiste à construire les autres composants de la Taskbox un par un, de manière similaire.

Comme vous pouvez le voir, il est facile et rapide de commencer à construire des composants de manière isolée. Nous pouvons nous attendre à produire une interface utilisateur de meilleure qualité avec moins de bogues et plus de peaufinage car il est possible de se pencher et de tester tous les états possibles.

## Tests automatisés

Storybook nous a donné un excellent moyen de tester manuellement l'interface utilisateur de notre application pendant la construction. Les " story " nous aideront à ne pas déformer l'apparence de notre tâche pendant que nous continuons à développer l'application. Cependant, il s'agit d'un processus entièrement manuel à ce stade, et quelqu'un doit faire l'effort de cliquer sur chaque état de test et de s'assurer que le rendu est bon et sans erreurs ou avertissements. Ne pouvons-nous pas faire cela automatiquement?

### Capture instantanée

La capture instantanée est une pratique qui consiste à enregistrer le "bon" résultat connue d'un composant pour une entrée donnée et à signaler le composant chaque fois que le résultat change à l'avenir. Cela complémente le Storybook, car c'est un moyen rapide de visualiser la nouvelle version d'un composant et de vérifier les changements.

<div class="aside">
Assurez-vous que vos composants rendent des données qui ne changent pas, afin que vos captures instantanées n'échouent pas à chaque fois. Faites attention à des éléments comme les dates ou les valeurs générées de manière aléatoire.
</div>

Avec le [Storyshots addon](https://github.com/storybooks/storybook/tree/master/addons/storyshots), une capture d'instantané est créé pour chacune des story. Utilisez-le en ajoutant les dependencies de développement suivantes :

```bash
yarn add -D @storybook/addon-storyshots react-test-renderer
```

Créez ensuite un fichier `src/storybook.test.js` contenant ce qui suit:

```javascript
// src/storybook.test.js

import initStoryshots from '@storybook/addon-storyshots';
initStoryshots();
```

C'est tout, nous pouvons faire un `yarn test` et voir le résultat suivant:

![Task test runner](/intro-to-storybook/task-testrunner.png)

Nous avons maintenant une capture instantanée pour chacune de nos "Tâches"(Task). Si nous modifions l'implémentation de la `Task`, nous serons invités à vérifier les changements.
