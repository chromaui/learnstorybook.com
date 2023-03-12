---
title: 'Tests visuels'
tocTitle: 'Test visuel'
description: 'Apprenez à tester les composants UI'
---

Aucun tutoriel de Storybook ne serait complet sans tests. Les tests sont essentiels pour créer des UI de haute qualité. Dans les systèmes modulaires, de minuscules modifications peuvent entraîner des régressions majeures. Jusqu'à présent, nous avons rencontré trois types de tests:

- **Les tests manuels** qui consistent pour les développeurs à examiner manuellement un composant pour en vérifier l'exactitude. Ils nous aident à vérifier l'aspect d'un composant au fur et à mesure de sa construction.

- **Les tests d'accessibilité**, avec l'addon a11y, vérifient que le composant est accessible à tout type de personne. Ils sont parfaits pour collecter de l'information sur comment les personnes avec des difficultés physique utilisent les composants.

- **Les tests d'interactions**, avec la fonction play, vérifient que le composant agit de la manière attendue quand nous interagissons avec lui. Ils sont parfaits pour tester les actions utilisateurs quand le composant est utilisé.

## "Mais est-ce que ça a l'air bien?"

Malheureusement, les méthodes de test mentionnées ci-dessus ne suffisent pas à prévenir les bogues de l'UI. Les interfaces utilisateur sont délicates à tester car la conception est subjective et nuancée. Les tests manuels sont, malheureusement, manuels. Les autres tests d'UI, comme les tests de snapshots, déclenchent trop de faux positifs, et les tests unitaires au niveau pixel sont de mauvaise qualité. Une stratégie de test complète de Storybook comprend également des tests de régression visuelle.

## Tests visuels pour Storybook

Les tests de régression visuelle, également appelés tests visuels, sont conçus pour détecter les changements d'apparence. Ils fonctionnent en prenant des captures d'écran de chaque story et en les comparant entre elles commit par commit pour faire ressortir les changements. Ils sont parfaits pour vérifier les éléments graphiques comme la mise en page, la couleur, la taille et le contraste.

<video autoPlay muted playsInline loop style="width:480px; margin: 0 auto;">
  <source
    src="/intro-to-storybook/visual-regression-testing.mp4"
    type="video/mp4"
  />
</video>

Storybook est un outil fantastique pour les tests de régression visuelle car chaque story est essentiellement une spécification de test. Chaque fois que nous écrivons ou mettons à jour une story, nous obtenons gratuitement une spécification!

Il existe un certain nombre d'outils pour les tests de régression visuelle. Nous recommandons [**Chromatic**](https://www.chromatic.com/?utm_source=storybook_website&utm_medium=link&utm_campaign=storybook), un service de publication gratuit créé par les mainteneurs de Storybook qui effectue des tests visuels dans un cloud parallélisé. Il nous permet également de publier Storybook en ligne, comme nous l'avons vu dans le [chapitre précédent](/intro-to-storybook/react/fr/deploy/).

## Voir les modifications de l'UI

Les tests de régression visuelle reposent sur la comparaison des images du nouveau code UI rendu avec les images de base. Si une modification de l'UI est détectée, nous en sommes informés.

Voyons comment cela fonctionne en modifiant l'arrière-plan du composant `Task`.

Commencez par créer une nouvelle branche pour ce changement:

```shell
git checkout -b change-task-background
```

Modifiez `src/components/Task.js` comme suit:

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
+         style={{ background: 'red' }}
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

Cela donne une nouvelle couleur de fond pour l'objet.

![Changement de fond de la tâche](/intro-to-storybook/chromatic-task-change.png)

Ajoutez le fichier:

```shell
git add .
```

Faire un commit:

```shell
git commit -m "change task background to red"
```

Et envoyer les changements au dépôt à distance:

```shell
git push -u origin change-task-background
```

Enfin, ouvrez votre dépôt GitHub et lancez une pull request pour la branche `change-task-background`.

![Créer une PR dans GitHub pour la tâche](/github/pull-request-background.png)

Ajoutez un texte descriptif à votre pull request et cliquez sur `Create pull request`. Cliquez sur le bouton "🟡 UI Tests" en bas de la page.

![Créer une PR dans GitHub pour la tâche](/github/pull-request-background-ok.png)

Cela vous montrera les modifications de l'UI prises en compte par votre commit.

![Changements détectés par Chromatic](/intro-to-storybook/chromatic-catch-changes.png)

Il y a beaucoup de changements! La hiérarchie des composants où `Task` est un enfant de `TaskList` et `Inbox` signifie qu'une petite modification provoque des régressions majeures. C'est précisément pour cette raison que les développeurs ont besoin de tests de régression visuelle en plus des autres méthodes de test.

![Un petit changement d'UI provoque des régressions majeures](/intro-to-storybook/minor-major-regressions.gif)

## Révision des changements

Les tests de régression visuelle permettent de s'assurer que les composants ne changent pas par accident. Mais c'est toujours à nous de déterminer si les changements sont intentionnels ou non.

Si un changement est intentionnel, nous devrons mettre à jour les images de référence afin que les futurs tests soient comparés à la dernière version de la story. Si un changement n'est pas intentionnel, il doit être corrigé.

<video autoPlay muted playsInline loop style="width:480px; margin: 0 auto;">
  <source
    src="/intro-to-storybook/website-workflow-review-merge-optimized.mp4"
    type="video/mp4"
  />
</video>

Comme les applications modernes sont construites à partir de composants, il est important de tester au niveau du composant. Cela nous aide à identifier la cause première d'un changement, le composant, plutôt que de réagir aux symptômes d'un changement, les écrans et les composants complexes.

## Fusionner les changements

Lorsque nous avons terminé notre revue des changements, nous sommes prêts à fusionner les changements apportés à l'UI en toute confiance, sachant que les mises à jour n'introduise pas accidentellement des bogues. Si vous aimez le nouveau fond `rouge`, alors acceptez les changements, sinon revenez à l'état précédent.

![Changements prêts à être fusionnés](/intro-to-storybook/chromatic-review-finished.png)

Storybook nous aide à **construire** des composants; les tests nous aident à **les maintenir**. Les quatre types de tests de l'UI couverts dans ce tutoriel sont les tests visuels, d'accessibilité, d'interactions et de régression visuelle. Les trois derniers peuvent être automatisés en les ajoutant à une CI alors que nous venons de terminer la mise en place, et cela nous aide à délivrer des composants sans nous soucier des bogues clandestins. L'ensemble du déroulement des opérations est illustré ci-dessous.

![Déroulement des opérations du test de régression visuel](/intro-to-storybook/cdd-review-workflow.png)
