---
title: 'Addons'
tocTitle: 'Addons'
description: 'Apprenez comment intégrer et utiliser les addons en utilisant un exemple populaire'
commit: 'b3bca4a'
---

Storybook dispose d'un système robuste d'[addons](https://storybook.js.org/addons/introduction/) avec lequel vous pouvez améliorer l'expérience des développeurs pour
tout le monde dans votre équipe. Si vous avez suivi ce tutoriel de manière linéaire, nous avons référencé plusieurs addons jusqu'à présent, et vous en aurez déjà implémenté un dans le [chapitre Test](/react/fr/test/).

<div class="aside">
<strong>Recherche d'une liste des addons potentiels?</strong>
<br/>
😍 Vous pouvez voir la liste des addons officiels soutenus et fortement soutenus par la communauté <a href="https://storybook.js.org/addons/addon-gallery/">ici</a>.
</div>

Nous pourrions écrire à tout jamais sur la configuration et l'utilisation des addons pour tous vos cas d'utilisation particuliers. Pour l'instant, travaillons à l'intégration de l'un des addons les plus populaires dans l'écosystème de Storybook : [knobs](https://github.com/storybooks/storybook/tree/master/addons/knobs).

## Configuration de Knobs

Knobs est une ressource incroyable pour les designers et les développeurs qui leur permet d'expérimenter et de jouer avec des composants dans un environnement contrôlé sans avoir besoin de coder ! Vous fournissez essentiellement des champs définis dynamiquement avec lesquels un utilisateur manipule les props qui sont passés aux composants de vos story. Voici ce que nous allons mettre en place...

<video autoPlay muted playsInline loop>
  <source
    src="/intro-to-storybook/addon-knobs-demo.mp4"
    type="video/mp4"
  />
</video>

### Installation

Tout d'abord, nous devrons installer toutes les dependency nécessaires.

```bash
yarn add -D @storybook/addon-knobs
```

Enregistrez Knobs dans votre fichier `.storybook/main.js`.

```javascript
// .storybook/main.js

module.exports = {
  stories: ['../src/components/**/*.stories.js'],
  addons: [
    '@storybook/preset-create-react-app',
    '@storybook/addon-actions',
    '@storybook/addon-knobs',
    '@storybook/addon-links',
  ],
};
```

<div class="aside">
<strong>📝 L'ordre d'enregistrement supplémentaire est important!</strong>
<br/>
L'ordre dans lequel vous énumérerez ces addons vous dictera l'ordre dans lequel ils apparaîtront sous forme d'onglets dans votre panneau d'addons (pour ceux qui y apparaissent).
</div>

C'est tout! Il est temps de l'utiliser dans un story.

### Utilisation

Utilisons le type object knob dans la composante `Task`.

Tout d'abord, importez le décorateur `withKnobs` et le type `object` knob dans `Task.stories.js` :

```javascript
// src/components/Task.stories.js

import React from 'react';
import { action } from '@storybook/addon-actions';
import { withKnobs, object } from '@storybook/addon-knobs/react';
```

<div class="aside">
  Si vous utilisez le langage TypeScript, vous devrez procéder à un petit ajustement des importations.
  Vous devrez utiliser <code>import { withKnobs, object } from '@storybook/addon-knobs'</code> à la place.
</div>

Ensuite, dans le `default` export du fichier `Task.stories.js`, ajoutez `withKnobs`" à la clé `decorators` :

```javascript
// src/components/Task.stories.js

export default {
  component: Task,
  title: 'Task',
  decorators: [withKnobs],
  excludeStories: /.*Data$/,
};
```

Enfin, intégrez le type `object` knob dans le story "par défaut":

```javascript
// src/components/Task.stories.js

export const Default = () => {
  return <Task task={object('task', { ...taskData })} {...actionsData} />;
};
```

Un nouvel onglet "Knobs" devrait maintenant apparaître à côté de l'onglet "Action Logger" dans le volet inférieur.

Comme documenté [ici](https://github.com/storybooks/storybook/tree/master/addons/knobs#object), le type "objet" knob accepte une étiquette et un objet par défaut comme paramètres. Le label est constant et apparaît à gauche d'un champ de texte dans votre panneau d'addons. L'objet que vous avez passé sera représenté sous la forme d'un blob JSON modifiable. Tant que vous soumettez un JSON valide, votre composant s'ajustera en fonction des données transmises à l'objet!

## Les addons font évoluer la portée de votre Storybook

Non seulement votre instance de Storybook sert de merveilleux [environnement CDD](https://www.componentdriven.org/), mais en plus nous fournissons maintenant une source interactive de documentation. Les PropTypes sont géniaux, mais un designer ou quelqu'un de complètement nouveau dans le code d'un composant sera capable de comprendre son comportement très rapidement via Storybook avec l'addon knobs implémenté.

## Utiliser les Knobs pour trouver les cas limites

De plus, grâce à un accès facile à l'édition des données transmises à un composant, les ingénieurs en assurance qualité ou les ingénieurs en IU préventive peuvent désormais pousser un composant à ses limites! Par exemple, qu'arrive-t-il à `Task` si notre élément de liste a une chaîne _MASSIVE_ ?

![Oh non! le contenu à l'extrême droite est coupé](/intro-to-storybook/addon-knobs-demo-edge-case.png) 😥

Grâce à la possibilité d'essayer rapidement différentes entrées d'un composant, nous pouvons trouver et résoudre de tels problèmes avec une relative facilité! Réglons le problème du débordement en ajoutant un style à `Task.js` :

```javascript
// src/components/Task.js

// C'est ce qui constitue le titre de notre tâche. En pratique, nous devrions probablement mettre à jour les styles pour cet élément
// mais pour ce tutoriel, réglons le problème avec un inline style:
<input
  type="text"
  value={title}
  readOnly={true}
  placeholder="Input title"
  style={{ textOverflow: 'ellipsis' }}
/>
```

![C'est bien mieux.](/intro-to-storybook/addon-knobs-demo-edge-case-resolved.png) 👍

## Ajouter un nouveau story pour éviter les régressions

Bien sûr, nous pouvons toujours reproduire ce problème en entrant la même entrée dans les knobs, mais il vaut mieux écrire un story fixe pour cette entrée. Cela augmentera votre test de régression et indiquera clairement les limites du ou des composants au reste de votre équipe.

Ajoutons un story pour le cas du texte long dans Task.stories.js :

```javascript
// src/components/Task.stories.js

const longTitleString = `Le nom de cette tâche est absurdement grand. En fait, je pense que si je continue, je risque de me retrouver avec un débordement de contenu. Que se passera-t-il? L'étoile qui représente une tâche épinglée pourrait avoir du texte qui se chevauche. Le texte pourrait se couper brusquement lorsqu'il atteint l'étoile. J'espère que ce n'est pas le cas!`;

export const LongTitle = () => (
  <Task task={{ ...taskData, title: longTitleString }} {...actionsData} />
);
```

Maintenant que nous avons ajouté l'histoire, nous pouvons reproduire ce cas limite avec facilité chaque fois que nous voulons travailler dessus:

![Le voici dans Storybook.](/intro-to-storybook/addon-knobs-demo-edge-case-in-storybook.png)

Si nous utilisons le [test de régression visuelle](/react/en/test/), nous serons également informés si jamais nous brisons notre solution elliptique. Ces cas de bord obscurs sont toujours susceptibles d'être oubliés!

### Fusionner les changements

N'oubliez pas de fusionner vos changements avec git!

<div class="aside"><p>Comme nous l'avons vu, Knobs est un excellent moyen de faire jouer les non-développeurs avec vos composants et vos story. Cependant, il existe bien d'autres façons de personnaliser Storybook pour l'adapter à votre workflow avec des addons. Dans le chapitre bonus <a href="/intro-to-storybook/react/en/creating-addons">créer des addons</a>, nous vous apprendrons qu'en créant un addon qui vous aidera à optimiser votre workflow de développement.</p></div>
