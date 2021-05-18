---
title: 'Modules complémentaires'
tocTitle: 'Modules complémentaires'
description: 'Apprenez à intégrer et à utiliser des modules complémentaires à l aide d un exemple populaire'
commit: '035d245'
---

Storybook dispose d'un solide écosystème de [modules complémentaires (ou addons)](https://storybook.js.org/docs/vue/configure/storybook-addons) que vous pouvez utiliser pour améliorer l'expérience des développeurs pour tous les membres de votre équipe. Regardez-les tous [ici](https://storybook.js.org/addons).

Si vous avez suivi ce tutoriel de manière linéaire, nous avons référencé plusieurs addons jusqu'à présent, et vous en aurez déjà implémenté un dans le [chapitre Test](/vue/fr/test/).

Il existe des addons pour chaque cas d'utilisation possible. Il faudrait une éternité pour tout écrire. Intégrons l'un des addons les plus populaires: [Controls](https://storybook.js.org/docs/vue/essentials/controls).

## Qu'est-ce que Controls?

Controls permett aux concepteurs et aux développeurs d'explorer facilement le comportement des composants _en jouant_ avec ses arguments. Aucun code requis. Contrôles crée un panneau complémentaire à côté de vos histoires, afin que vous puissiez modifier leurs arguments en direct.

Les nouvelles installations de Storybook incluent des contrôles prêts à l'emploi. Aucune configuration supplémentaire nécessaire.

<video autoPlay muted playsInline loop>
  <source
    src="/intro-to-storybook/controls-in-action.mp4"
    type="video/mp4"
  />
</video>

## Les addons débloquent de nouveaux workflows de Storybook

Storybook est un merveilleux [environnement de développement axé sur les composants](https://www.componentdriven.org/). L'addon Controls fait évoluer Storybook en un outil de documentation interactif.

### Utilisation de Controls pour rechercher des cas aux extrêmes

Avec Controls, les ingénieurs d'assurance qualité, les ingénieurs d'interface utilisateur ou toute autre partie prenante peuvent pousser le composant à la limite! Prenons l'exemple suivant, qu'arriverait-il à notre `Task` si nous ajoutions une chaîne de caractères **MASSIVE**?

![Oh no! The far right content is cut-off!](/intro-to-storybook/task-edge-case.png)

Ce n'est pas bon ! Il semble que le texte déborde au-delà des limites du composant `Task`.

Controls nous a permis de vérifier rapidement les différentes entrées d'un composant. Dans ce cas, une longue chaîne de caractères. Cela réduit le travail requis pour découvrir les problèmes d'interface utilisateur.

Corrigeons maintenant le problème de débordement en ajoutant un style à `Task.vue` :

```diff:title=src/components/Task.vue
<input
  type="text"
  :value="task.title"
  readonly
  placeholder="Input title"
+ style="text-overflow: ellipsis;"
/>
```

![C'est mieux.](/intro-to-storybook/edge-case-solved-with-controls.png)

Problème résolu ! Le texte est maintenant tronqué lorsqu'il atteint la limite de la zone des tâches à l'aide d'une belle ellipse.

### Ajouter une nouvelle histoire pour éviter les régressions

À l'avenir, nous pourrons reproduire manuellement ce problème en entrant la même chaîne via Controls. Mais il est plus facile d'écrire une histoire qui présente ce cas de pointe. Cela élargit la couverture de nos tests de régression et décrit clairement les limites du ou des composants pour le reste de l'équipe.

Ajouter une nouvelle histoire pour la longue casse de texte dans `Task.stories.js` :

```js:title=src/components/Task.stories.js
const longTitleString = `This task's name is absurdly large. In fact, I think if I keep going I might end up with content overflow. What will happen? The star that represents a pinned task could have text overlapping. The text could cut-off abruptly when it reaches the star. I hope not!`;

export const LongTitle = Template.bind({});
LongTitle.args = {
  task: {
    ...Default.args.task,
    title: longTitleString,
  },
};
```

Maintenant, nous pouvons reproduire et travailler sur ce cas d'utilisation en toute simplicité.

<video autoPlay muted playsInline loop>
  <source
    src="/intro-to-storybook/task-stories-long-title.mp4"
    type="video/mp4"
  />
</video>

Si nous effectuons des [tests visuels](/intro-to-storybook/vue/fr/test/), nous serons également informés si la solution d'ellipse se brise. Les bordures obscures risquent d'être oubliées sans couverture de test !

### Fusionner les modifications

💡 N'oubliez pas de fusionner vos modifications avec git !

<div class="aside"><p>
Controls est un excellent moyen de faire jouer les non-développeurs avec vos composants et vos histoires, et bien plus que ce que nous avons vu ici, nous vous recommandons de lire la <a href="https://storybook.js.org/docs/vue/essentials/controls">documentation officielle</a> pour en savoir plus. Cependant, il existe de nombreuses autres façons de personnaliser Storybook pour l'adapter à votre flux de travail avec des modules complémentaires. Dans le chapitre bonus de <a href="/intro-to-storybook/vue/en/creating-addons">création d'addons</a>, nous vous apprendrons cela, en créant un addon qui vous aidera à dynamiser votre flux de travail de développement.</p></div>
