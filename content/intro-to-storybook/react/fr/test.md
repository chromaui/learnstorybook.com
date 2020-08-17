---
title: "Tester les composantes d'interface utilisateur"
tocTitle: 'Test'
description: "Apprenez à tester les composants d'interface utilisateur"
commit: '3e283f7'
---

Aucun tutoriel de Storybook ne serait complet sans test. Les tests sont essentiels pour créer des interfaces utilisateur de haute qualité. Dans les systèmes modulaires, de minuscules modifications peuvent entraîner des régressions majeures. Jusqu'à présent, nous avons rencontré trois types de tests :

- **Tests manuels** qui consistent pour les développeurs à examiner manuellement un composant pour en vérifier l'exactitude. Ils nous aident à vérifier l'aspect d'un composant au fur et à mesure de sa construction.
- **Les captures instantanées** avec Storyshots capturent le balisage rendu d'un composant. Ils nous aident à nous tenir au courant des changements de balisage qui provoquent des erreurs de rendu et des avertissements.
- **Les tests unitaires** avec Jest vérifient que la sortie d'un composant reste la même avec une entrée fixe. Ils sont parfaits pour tester les qualités fonctionnelles d'un composant.

## "Mais est-ce que ça a l'air bien ?"

Malheureusement, les méthodes de test mentionnées ci-dessus ne suffisent pas à prévenir les bugs de l'interface utilisateur. Les interfaces utilisateur sont délicates à tester car la conception est subjective et nuancée. Les tests manuels sont, eh bien, manuels. Les tests instantanés déclenchent trop de faux positifs lorsqu'ils sont utilisés pour l'interface utilisateur. Les tests unitaires au niveau pixel sont de mauvaise qualité. Une stratégie de test complète de Storybook comprend également des tests de régression visuelle.

## Tests visuels pour Storybook

Les tests de régression visuelle, également appelés tests visuels, sont conçus pour détecter les changements d'apparence. Ils fonctionnent en prenant des captures d'écran de chaque story et en les comparant entre elles commit par commit pour faire ressortir les changements. C'est parfait pour vérifier des éléments graphiques comme la mise en page, la couleur, la taille et le contraste.

<video autoPlay muted playsInline loop style="width:480px; margin: 0 auto;">
  <source
    src="/intro-to-storybook/visual-regression-testing.mp4"
    type="video/mp4"
  />
</video>

Storybook est un outil fantastique pour les tests de régression visuelle car chaque story est essentiellement une spécification de test. Chaque fois que nous écrivons ou mettons à jour un story, nous obtenons gratuitement une spécification !

Il existe un certain nombre d'outils pour les tests de régression visuelle. Nous recommandons [**Chromatic**](https://www.chromatic.com/), un service de publication gratuit créé par les mainteneurs de Storybook qui effectue des tests visuels dans un cloud parallélisé. Il nous permet également de publier Storybook en ligne, comme nous l'avons vu dans le [chapitre précédent](/react/fr/deploy/).

## Voir les modifications de l'interface utilisateur

Les tests de régression visuelle reposent sur la comparaison des images du nouveau code UI rendu avec les images de base. Si une modification de l'interface utilisateur est détectée, nous en sommes informés.

Voyons comment cela fonctionne en modifiant l'arrière-plan du composant `Tâche`.

Commencez par créer une nouvelle branche pour ce changement :

```bash
git checkout -b change-task-background
```

Modifiez `Task` comme suit:

```js
// src/components/Task.js
<div className="title">
  <input
    type="text"
    value={title}
    readOnly={true}
    placeholder="Input title"
    style={{ textOverflow: 'ellipsis', background: 'red' }}
  />
</div>
```

Cela donne une nouvelle couleur de fond pour l'objet.

![changement de fond de la tâche](/intro-to-storybook/chromatic-task-change.png)

Ajoutez le fichier:

```bash
git add src\components\Task.js
```

Faire un commit:

```bash
git commit -m “change task background to red”
```

Et envoyer les changements au repo à distance:

```bash
git push -u origin change-task-background
```

Enfin, ouvrez votre dépôt GitHub et lancez un pull request pour la branche `change-task-background`.

![Créer un PR dans GitHub pour la tâche](/github/pull-request-background.png)

Ajoutez un texte descriptif à votre pull request et cliquez sur `Create pull request`. Cliquez sur le bouton "🟡 UI Tests" en bas de la page.

![Créé un PR dans GitHub pour la tâche](/github/pull-request-background-ok.png)

Cela vous montrera les modifications de l'interface utilisateur prises en compte par votre commit.

![Changements détectés par Chromatic](/intro-to-storybook/chromatic-catch-changes.png)

Il y a beaucoup de changements! La hiérarchie des composants où `Task` est un enfant de `TaskList et`Inbox` signifie une petite modification provoque des régressions majeures. C'est précisément pour cette raison que les développeurs ont besoin de tests de régression visuelle en plus des autres méthodes de test.

![UI minor tweaks major regressions](/intro-to-storybook/minor-major-regressions.gif)

## Révision des changements

Les tests de régression visuelle permettent de s'assurer que les composants ne changent pas par accident. Mais c'est toujours à nous de déterminer si les changements sont intentionnels ou non.

Si un changement est intentionnel, nous devrons mettre à jour la base de référence afin que les futurs tests soient comparés à la dernière version du story. Si un changement n'est pas intentionnel, il doit être corrigé.

<video autoPlay muted playsInline loop style="width:480px; margin: 0 auto;">
  <source
    src="/intro-to-storybook/website-workflow-review-merge-optimized.mp4"
    type="video/mp4"
  />
</video>

Comme les applications modernes sont construites à partir de composants, il est important de tester au niveau du composant. Cela nous aide à identifier la cause première d'un changement, le composant, plutôt que de réagir aux symptômes d'un changement, les écrans et les composants complexes.

## Fusionner les changements

Lorsque nous aurons terminé notre examen, nous serons prêts à fusionner les changements apportés à l'interface utilisateur en toute confiance, sachant que les mises à jour n'introduiront pas accidentellement des bogues. Si vous aimez le nouveau fond "rouge", alors acceptez les changements, sinon revenez à l'état précédent.

![Changements prêts à être fusionnés](/intro-to-storybook/chromatic-review-finished.png)

Storybook nous aide à **construire** des composants ; les tests nous aident à **les entretenir**. Les quatre types de tests de l'interface utilisateur couverts dans ce tutoriel sont les tests visuels, captures instantanées, unitaires et de régression visuelle. Les trois derniers peuvent être automatisés en les ajoutant à un CI alors que nous venons de terminer la mise en place. Cela nous aide à distribuer les composants sans nous soucier des bogues clandestins. L'ensemble du déroulement des opérations est illustré ci-dessous.

![Déroulement des opérations du test de régression visuel](/intro-to-storybook/cdd-review-workflow.png)
