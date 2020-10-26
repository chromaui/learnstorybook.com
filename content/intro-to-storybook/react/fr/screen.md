---
title: 'Construire un écran'
tocTitle: 'Écrans'
description: 'Construire un écran à partir de composants'
commit: 'c117e09'
---

Nous nous sommes concentrés sur la création d'un UI de bas en haut, en commençant par les plus simples et en ajoutant de la complexité. Cela nous a permis de développer chaque composant séparément, de déterminer ses besoins en données et de jouer avec dans Storybook. Tout cela sans avoir besoin de mettre en place un serveur ou de construire des écrans !

Dans ce chapitre, nous continuons à accroître la sophistication en combinant des composants dans un écran et en développant cet écran dans Storybook.

## Composants de conteneurs imbriqués

Comme notre application est très simple, l'écran que nous allons construire est assez trivial, il suffit d'envelopper le composant `TaskList` (qui fournit ses propres données via Redux) dans une certaine disposition et de tirer un champ d'erreur de haut niveau de Redux (supposons que nous allons définir ce champ si nous avons des problèmes de connexion à notre serveur). Créez `InboxScreen.js` dans votre dossier `components`:

```javascript
// src/components/InboxScreen.js

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import TaskList from './TaskList';

export function PureInboxScreen({ error }) {
  if (error) {
    return (
      <div className="page lists-show">
        <div className="wrapper-message">
          <span className="icon-face-sad" />
          <div className="title-message">Oh no!</div>
          <div className="subtitle-message">Something went wrong</div>
        </div>
      </div>
    );
  }

  return (
    <div className="page lists-show">
      <nav>
        <h1 className="title-page">
          <span className="title-wrapper">Taskbox</span>
        </h1>
      </nav>
      <TaskList />
    </div>
  );
}

PureInboxScreen.propTypes = {
  /** The error message */
  error: PropTypes.string,
};

PureInboxScreen.defaultProps = {
  error: null,
};

export default connect(({ error }) => ({ error }))(PureInboxScreen);
```

Nous changeons également le composant `App` pour rendre le `InboxScreen` (éventuellement nous utiliserions un routeur pour choisir le bon écran, mais ne nous inquiétons pas de cela ici):

```javascript
// src/App.js

import React from 'react';
import { Provider } from 'react-redux';
import store from './lib/redux';

import InboxScreen from './components/InboxScreen';

import './index.css';
function App() {
  return (
    <Provider store={store}>
      <InboxScreen />
    </Provider>
  );
}
export default App;
```

Cependant, c'est dans le rendu du story dans Storybook que les choses deviennent intéressantes.

Comme nous l'avons vu précédemment, le composant `TaskList` est un **conteneur** qui rend le composant de présentation `PureTaskList`. Par définition, les composants de conteneur ne peuvent pas être simplement rendus de manière isolée ; ils s'attendent à recevoir un contexte ou à être connectés à un service. Cela signifie que pour rendre un conteneur dans Storybook, nous devons nous simuler (c'est-à-dire fournir une fausse version) du contexte ou du service dont il a besoin.

Lorsque nous avons placé la `TaskList` dans Storybook, nous avons pu éviter ce problème en rendant simplement la `PureTaskList` et en évitant le conteneur. Nous allons faire quelque chose de similaire et rendre le `PureInboxScreen` dans Storybook également.

Cependant, pour le `PureInboxScreen`, nous avons un problème car, bien que le `PureInboxScreen` lui-même soit présenté, son enfant, la `TaskList`, ne l'est pas. Dans un sens, le `PureInboxScreen` a été pollué par son caractère "conteneur". Ainsi, lorsque nous mettons en place nos stories dans `InboxScreen.stories.js`:

```javascript
// src/components/InboxScreen.stories.js

import React from 'react';

import { PureInboxScreen } from './InboxScreen';

export default {
  component: PureInboxScreen,
  title: 'InboxScreen',
};

const Template = args => <PureInboxScreen {...args} />;

export const Default = Template.bind({});

export const Error = Template.bind({});
Error.args = {
  error: 'Something',
};
```

Nous constatons que, bien que le story `error` fonctionne très bien, nous avons un problème dans le story `défaut`, car la `TaskList` n'a pas de magasin Redux auquel se connecter. (Vous rencontrerez également des problèmes similaires lorsque vous essaierez de tester le `PureInboxScreen` avec un test unitaire).

![Boîte de réception non opérationnelle](/intro-to-storybook/broken-inboxscreen.png)

Une façon de contourner ce problème est de ne jamais rendre les composants conteneurs dans votre application, sauf au plus haut niveau, et de transmettre toutes les données requises en descendant dans la hiérarchie des composants.

Cependant, les développeurs **devront** inévitablement rendre les conteneurs plus bas dans la hiérarchie des composants. Si nous voulons rendre la plupart ou la totalité de l'application dans Storybook (c'est ce que nous voulons !), nous devons trouver une solution à ce problème.

<div class="aside">
Soit dit en passant, la transmission de données en descendant dans la hiérarchie est une approche légitime, surtout lorsqu'on utilise <a href="http://graphql.org/">GraphQL</a>. C'est ainsi que nous avons construit <a href="https://www.chromatic.com">Chromatique</a> à côté de plus de 800 story.
</div>

## Fournir un contexte aux décorateurs

La bonne nouvelle, c'est qu'il est facile de fournir un stockage Redux à `InboxScreen` dans un story! Il suffit d'utiliser une version fictive du stockage Redux fournie par un décorateur:

```javascript
// src/components/InboxScreen.stories.js

import React from 'react';
import { action } from '@storybook/addon-actions';
import { Provider } from 'react-redux';

import { PureInboxScreen } from './InboxScreen';
import { defaultTasksData } from './TaskList.stories';

export default {
  component: PureInboxScreen,
  title: 'InboxScreen',
  decorators: [story => <Provider store={store}>{story()}</Provider>],
};

// A super-simple mock of a redux store
const store = {
  getState: () => {
    return {
      tasks: defaultTasksData,
    };
  },
  subscribe: () => 0,
  dispatch: action('dispatch'),
};

export const Default = () => <PureInboxScreen />;

export const Error = () => <PureInboxScreen error="Something" />;
```

Des approches similaires existent pour fournir un contexte simulé pour d'autres bibliothèques de données, telles que [Apollo](https://www.npmjs.com/package/apollo-storybook-decorator), [Relay](https://github.com/orta/react-storybooks-relay-container) et autres.

En parcourant les États dans Storybook, il est facile de vérifier que nous avons fait cela correctement:

<video autoPlay muted playsInline loop >

  <source
    src="/intro-to-storybook/finished-inboxscreen-states-6-0.mp4"
    type="video/mp4"
  />
</video>

## Component-Driven Development

Nous avons commencé par le bas avec `Task`, puis nous sommes passés à `TaskList`, maintenant nous sommes ici avec un UI sur tout l'écran. Notre `InboxScreen` contient un composant conteneur emboîté et inclut des story en accompagnement.

<video autoPlay muted playsInline loop style="width:480px; height:auto; margin: 0 auto;">
  <source
    src="/intro-to-storybook/component-driven-development-optimized.mp4"
    type="video/mp4"
  />
</video>

[**Component-Driven Development**](https://www.componentdriven.org/) vous permet d'accroître progressivement la complexité à mesure que vous montez dans la hiérarchie des composants. Parmi les avantages, citons un processus de développement plus ciblé et une couverture accrue de toutes les permutations possibles de l'UI. En bref, le CDD vous aide à construire des interfaces utilisateur de meilleure qualité et plus complexes.

Nous n'avons pas encore terminé - le travail ne s'arrête pas à la construction de l'UI. Nous devons également veiller à ce qu'elle reste durable dans le temps.
