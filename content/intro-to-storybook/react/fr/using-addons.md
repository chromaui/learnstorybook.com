---
title: 'Addons'
tocTitle: 'Addons'
description: 'Apprenez comment intégrer et utiliser le populaire addon Controls'
commit: 'f89cfe0'
---

Storybook dispose d'un système robuste d'[addons](https://storybook.js.org/docs/react/configure/storybook-addons) avec lequel vous pouvez améliorer l'expérience de développement de toute votre équipe. Consultez-les tous [ici](https://storybook.js.org/addons)

Si vous avez suivi ce tutoriel, nous avons déjà référencé plusieurs addons, et vous en avez déjà implémenté un dans le chapitre [Test](/intro-to-storybook/react/fr/test/).

Il existe des addons pour chaque cas d'utilisation possible. Il faudrait une éternité pour les décrire tous. Intégrons l'un des addons les plus populaires : [Controls](https://storybook.js.org/docs/react/essentials/controls).

## C'est quoi Controls?

Controls permet aux designers et aux développeurs d'explorer facilement le comportement du composant en _jouant_ avec ses arguments. Aucun code n'est nécessaire. Controls crée un panneau additionnel à côté de vos stories, afin que vous puissiez modifier leurs arguments en temps réel.

Les nouvelles installations de Storybook comprennent Controls prêt à l'emploi. Aucune configuration supplémentaire n'est nécessaire.

<video autoPlay muted playsInline loop>
  <source
    src="/intro-to-storybook/controls-in-action-6-4.mp4"
    type="video/mp4"
  />
</video>

## Les addons déverrouillent de nouveaux flux de travail de Storybook

Storybook est un merveilleux [environnement de développement axé sur les composants](https://www.componentdriven.org/). L'addon Controls fait évoluer Storybook en un outil de documentation interactif.

### Utiliser Controls pour trouver les cas limites

Avec Controls, les analystes en QA, les designers ou tout autre intervenant peuvent pousser le composant à sa limite! Considérons l'exemple suivant, qu'arriverait-il à notre `Task` si nous ajoutions une chaîne de caractères **GIGANTESQUE** ?

![Oh non! le contenu à l'extrême droite est coupé](/intro-to-storybook/task-edge-case-6-4.png)

Ce n'est pas correct! Il semble que le texte déborde les limites du composant Task.

Controls nous a permis de vérifier rapidement les différentes entrées d'un composant --dans ce cas, une longue chaîne. Cela réduit le travail nécessaire pour découvrir les problèmes d'UI.

Maintenant, réglons le problème du débordement en ajoutant un style à `Task.js`:

```diff:title=src/components/Task.js
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
+         style={{ textOverflow: 'ellipsis' }}
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

![C'est mieux.](/intro-to-storybook/edge-case-solved-with-controls-6-4.png)

Problème résolu! Le texte est maintenant tronqué lorsqu'il atteint la limite de la zone de la tâche grâce à une belle ellipse.

### Ajouter une nouvelle story pour éviter les régressions

À l'avenir, nous pourrons reproduire ce problème manuellement en entrant la même chaîne de caractères via Controls. Mais il est plus facile d'écrire une story qui met en valeur ce cas limite. Cela élargit la couverture de notre test de régression et définit clairement les limites du ou des composants pour le reste de l'équipe.

Ajoutez une nouvelle story pour le cas du texte long dans `Task.stories.js`:

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

Nous pouvons maintenant reproduire et travailler sur ce cas limite avec facilité.

<video autoPlay muted playsInline loop>
  <source
    src="/intro-to-storybook/task-stories-long-title-6-4.mp4"
    type="video/mp4"
  />
</video>

Si nous faisons un [test visuel](/intro-to-storybook/react/fr/test/), nous serons également informés si la solution elliptique se brise. Les cas limites sont susceptibles d'être oubliés sans la couverture de test!

<div class="aside"><p>💡 Controls est un excellent moyen de faire jouer les non-développeurs avec vos composants et vos stories. Il peut faire bien plus que ce que nous avons vu ici; nous vous recommandons de lire la <a href="https://storybook.js.org/docs/react/essentials/controls">documentation officielle</a> pour en savoir plus. Cependant, il existe de nombreuses autres façons de personnaliser Storybook pour l'adapter à votre flux de travail grâce à des addons. Dans le <a href="https://storybook.js.org/docs/react/addons/writing-addons">guide de création d'addon</a>, nous vous apprendrons cela, en créant un addon qui vous aidera à améliorer votre flux de développement.</p></div>

### Fusionner les changements

N'oubliez pas de fusionner vos changements avec git!
