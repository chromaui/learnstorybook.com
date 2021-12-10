---
title: 'Addons'
tocTitle: 'Addons'
description: 'Apprenez comment intégrer et utiliser les addons en utilisant un exemple populaire'
commit: 'b878a40'
---

Storybook dispose d'un système robuste d'[addons](https://storybook.js.org/docs/react/configure/storybook-addons) avec lequel vous pouvez améliorer l'expérience des développeurs pour
tout le monde dans votre équipe. Consultez-les tous [ici](https://storybook.js.org/addons)

Si vous avez suivi ce tutoriel de manière linéaire, nous avons référencé plusieurs addons jusqu'à présent, et vous en aurez déjà implémenté un dans le [chapitre Test](/intro-to-storybook/react/fr/test/).

Il existe des addons pour chaque cas d'utilisation possible. Il faudrait une éternité pour les décrire tous. Intégrons l'un des addons les plus populaires : [Controls](https://storybook.js.org/docs/react/essentials/controls).

## C'est quoi Controls?

Controls permet aux designers et aux développeurs d'explorer facilement le comportement du composant en _jouant_ avec ses arguments. Aucun code n'est nécessaire. Controls crée un panneau additionnel à côté de vos stories, afin que vous puissiez modifier leurs arguments en temps réel.

Les nouvelles installations de Storybook comprennent Controls prêt à l'emploi. Aucune configuration supplémentaire n'est nécessaire.

<video autoPlay muted playsInline loop>
  <source
    src="/intro-to-storybook/controls-in-action.mp4"
    type="video/mp4"
  />
</video>

## Les addons déverrouillent les nouveaux flux de travail de Storybook

Storybook est un merveilleux [environnement de développement axé sur les composants](https://www.componentdriven.org/). L'addon Controls fait évoluer Storybook en un outil de documentation interactif.

### Utiliser Controls pour trouver les cas limites

Grâce aux ingénieurs en AQ de Controls, les ingénieurs UI ou tout autre intervenant peuvent pousser le composant à sa limite! Considérons l'exemple suivant, qu'arriverait-il à notre `Task` si nous ajoutions une chaîne **MASSIVE** ?

![Oh non! le contenu à l'extrême droite est coupé](/intro-to-storybook/task-edge-case.png)

Ce n'est pas juste ! Il semble que le texte déborde les limites de la composante Task.

Controls nous a permis de vérifier rapidement les différentes entrées d'un composant. Dans ce cas, une longue chaîne. Cela réduit le travail nécessaire pour découvrir les problèmes d'UI.

Maintenant, réglons le problème du débordement en ajoutant un style à `Task.js`:

```js
// src/components/Task.js

<input
  type="text"
  value={title}
  readOnly={true}
  placeholder="Input title"
  style={{ textOverflow: 'ellipsis' }}
/>
```

![That's better.](/intro-to-storybook/edge-case-solved-with-controls.png)

Problème résolu! Le texte est maintenant tronqué lorsqu'il atteint la limite de la zone de Task à l'aide d'une belle ellipse.

### Ajouter un nouveau story pour éviter les régressions

À l'avenir, nous pourrons reproduire ce problème manuellement en entrant la même chaîne de caractères via Controls. Mais il est plus facile d'écrire un story qui met en valeur ce cas limite. Cela élargit la couverture de notre test de régression et définit clairement les limites du ou des composants pour le reste de l'équipe.

Ajoutez un nouveau story pour le cas du texte long dans `Task.stories.js`:

```js
// src/components/Task.stories.js

const longTitleString = `This task's name is absurdly large. In fact, I think if I keep going I might end up with content overflow. What will happen? The star that represents a pinned task could have text overlapping. The text could cut-off abruptly when it reaches the star. I hope not!`;

export const LongTitle = Template.bind({});
LongTitle.args = {
  task: {
    ...Default.args.task,
    title: longTitleString,
  },
};
```

Nous pouvons maintenant reproduire et travailler sur ce cas limite avec facilité.

<video autoPlay muted playsInline loop>
  <source
    src="/intro-to-storybook/task-stories-long-title.mp4"
    type="video/mp4"
  />
</video>

Si nous faisons un [test visuel](/intro-to-storybook/react/fr/test/), nous serons également informés si la solution elliptique se brise. Les cas limites obscurs sont susceptibles d'être oubliés sans la couverture de test!

### Fusionner les changements

N'oubliez pas de fusionner vos changements avec git!

<div class="aside"><p>Controls est un excellent moyen de faire jouer les non-développeurs avec vos composants et vos story, et bien plus que ce que nous avons vu ici, nous vous recommandons de lire la <a href="https://storybook.js.org/docs/react/essentials/controls">documentation officielle</a> pour en savoir plus. Cependant, il existe de nombreuses autres façons de personnaliser Storybook pour l'adapter à votre flux de travail grâce à des addons. Dans le <a href="/create-an-addon/react/en/introduction/">créer des addons guider</a>, nous vous apprendrons qu'en créant un addon qui vous aidera à surcharger votre flux de travail de développement.</p></div>
