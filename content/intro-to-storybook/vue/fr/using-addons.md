---
title: 'Modules complémentaires'
tocTitle: 'Modules complémentaires'
description: 'Apprenez à intégrer et à utiliser des modules complémentaires à l aide d un exemple populaire'
---

Storybook dispose d'un système robuste de [modules complémentaires](https://storybook.js.org/addons/introduction/) avec lequel vous pouvez améliorer l'expérience des développeurs pour toute votre équipe. Si vous avez suivi ce tutoriel de manière linéaire, nous avons référencé plusieurs addons jusqu'à présent, et vous en aurez déjà implémenté un dans le [chapitre Test](/vue/en/test/)..

<div class="aside">
<strong>Vous recherchez une liste de modules complémentaires potentiels?</strong>
<br/>
😍 Vous pouvez voir la liste des modules complémentaires officiellement supportés et fortement soutenu par la communauté <a href="https://storybook.js.org/addons/addon-gallery/">ici</a>.
</div>

Nous pourrions écrire éternellement sur la configuration et l'utilisation des modules complémentaires pour tous vos cas d'utilisation particuliers. Pour l'instant, travaillons à l'intégration de l'un des modules complémentaires les plus populaires de l'écosystème de Storybook: [knobs](https://github.com/storybooks/storybook/tree/master/addons/knobs).

## Configuration de Knobs

Knobs est une ressource incroyable pour les concepteurs et les développeurs pour expérimenter et jouer avec des composants dans un environnement contrôlé sans avoir besoin de coder! Vous fournissez essentiellement des champs définis dynamiquement avec lesquels un utilisateur manipule les accessoires transmis aux composants de vos histoires. Voici ce que nous allons mettre en œuvre ...

<video autoPlay muted playsInline loop>
  <source
    src="/intro-to-storybook/addon-knobs-demo.mp4"
    type="video/mp4"
  />
</video>

### Installation

Tout d'abord, nous devrons l'ajouter en tant que dépendance.

```bash
yarn add -D @storybook/addon-knobs
```

Enregistrez Knobs dans votre fichier `.storybook/main.js`.

```javascript
// .storybook/main.js

module.exports = {
  stories: ['../src/components/**/*.stories.js'],
  addons: ['@storybook/addon-actions', '@storybook/addon-knobs', '@storybook/addon-links'],
};
```

<div class="aside">
<strong>📝 L'ordre d'enregistrement des addons est important!</strong>
<br/>
L'ordre dans lequel vous listez ces addons dictera l'ordre dans lequel ils apparaissent sous forme d'onglets sur votre panneau d'extension (pour ceux qui y apparaissent).
</div>

C'est tout! Il est temps de l'utiliser dans une histoire.

### Utilisation

Utilisons le type de bouton d'objet dans le composant `Task`.

Tout d'abord, importez le décorateur `withKnobs` et l'`objet` knob dans `Task.stories.js`:

```javascript
// src/components/Task.stories.js
import { action } from '@storybook/addon-actions';
import { withKnobs, object } from '@storybook/addon-knobs';
```

Ensuite, dans l'exportation par `défaut` du fichier `Task.stories`, ajoutez `withKnobs` à la clé `decorators`:

```javascript
// src/components/Task.stories.js

export default {
  title: 'Task',
  decorators: [withKnobs],
  // pareil qu'avant
};
```

Enfin, intégrez l'`objet` know dans l'histoire "par défaut":

```javascript
// src/components/Task.stories.js

// état de la tâche par défaut
export const Default = () => ({
  components: { Task },
  template: taskTemplate,
  props: {
    task: {
      default: object('task', { ...taskData }),
    },
  },
  methods: actionsData,
});

// pareil qu'avant
```

Maintenant, un nouvel onglet "Knobs" devrait apparaître à côté de l'onglet "Action Logger" dans le volet du bas.

Comme documenté [ici](https://github.com/storybooks/storybook/tree/master/addons/knobs#object), l'`objet` know accepte une étiquette et un objet par défaut comme paramètres. L'étiquette est constante et apparaît à gauche d'un champ de texte dans votre panneau de modules complémentaires. L'objet que vous avez transmis sera représenté sous la forme d'un objet blob JSON modifiable. Tant que vous soumettez un JSON valide, votre composant s'ajustera en fonction des données transmises à l'objet!

## Les modules complémentaires font évoluer la portée de votre livre de contes

Non seulement votre instance Storybook sert d'[environnement CDD](https://blog.hichroma.com/component-driven-development-ce1109d56c8e) merveilleux, mais nous fournissons maintenant une source de documentation interactive. Les PropTypes sont excellents, mais un concepteur ou quelqu'un de complètement nouveau dans le code d'un composant sera capable de comprendre son comportement très rapidement via Storybook avec l'addon de boutons implémenté.

## Utilisation de Knobs pour rechercher les cas aux limites

De plus, avec un accès facile à l'édition des données transmises à un composant, les ingénieurs d'assurance qualité ou les ingénieurs d'interface utilisateur préventifs peuvent désormais pousser un composant à la limite! À titre d'exemple, qu'arrive-t-il à `Task` si notre élément de liste a une chaîne _MASSIVE_?

![Oh non! Le contenu à l'extrême droite est coupé!](/intro-to-storybook/addon-knobs-demo-edge-case.png) 😥

Grâce à la possibilité d'essayer rapidement différentes entrées d'un composant, nous pouvons trouver et résoudre de tels problèmes avec une relative facilité! Résolvons le problème de débordement en ajoutant un style à `Task.vue`:

```html
<!--src/components/Task.vue>-->

<!-- Ceci est l'entrée pour notre titre de tâche. 
    En pratique, nous mettrions probablement à jour les styles de cet élément mais pour ce tutoriel, 
    résolvons le problème avec un style en ligne:-->
<input
  type="text"
  :readonly="true"
  :value="this.task.title"
  placeholder="Input title"
  style="text-overflow: ellipsis;"
/>
```

![C'est mieux.](/intro-to-storybook/addon-knobs-demo-edge-case-resolved.png) 👍

## Ajout d'une nouvelle histoire pour éviter les régressions

Bien sûr, nous pouvons toujours reproduire ce problème en entrant la même entrée dans les boutons, mais il est préférable d'écrire une histoire fixe pour cette entrée. Cela augmentera vos tests de régression et définira clairement les limites du ou des composants au reste de votre équipe.

Ajoutons une histoire pour le cas de texte long dans `Task.stories.js`:

```javascript
// src/components/Task.stories.js

const longTitle = `This task's name is absurdly large. In fact, I think if I keep going I might end up with content overflow. What will happen? The star that represents a pinned task could have text overlapping. The text could cut-off abruptly when it reaches the star. I hope not!`;

// pareil qu'avant

export const LongTitle = () => ({
  components: { Task },
  template: taskTemplate,
  props: {
    task: {
      default: () => ({
        ...taskData,
        title: longTitle,
      }),
    },
  },
  methods: actionsData,
});
```

Maintenant que nous avons ajouté l'histoire, nous pouvons reproduire ce test aux limites avec facilité chaque fois que nous voulons travailler dessus:

![Le voici dans Storybook.](/intro-to-storybook/addon-knobs-demo-edge-case-in-storybook.png)

Si nous utilisons des [tests de régression visuelle](/vue/fr/test/), nous serons également informés si jamais nous cassons notre solution d'ellipse. Ces bordures obscures sont toujours susceptibles d'être oubliées!

### Fusionner les modifications

N'oubliez pas de fusionner vos modifications avec git!

## Partager des modules complémentaires avec l'équipe

Knobs est un excellent moyen de faire jouer les non-développeurs avec vos composants et vos histoires. Cependant, il peut être difficile pour eux d'exécuter le livre d'histoires sur leur machine locale. C'est pourquoi déployer votre livre d'histoires sur un site en ligne peut être très utile. Dans le prochain chapitre, nous ferons exactement cela!
