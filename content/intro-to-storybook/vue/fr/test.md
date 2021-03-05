---
title: 'Tester les composants UI'
tocTitle: 'Les tests'
description: 'Apprenez à tester les composants UI'
commit: 8bf107e
---

Aucun tutoriel de Storybook ne serait complet sans test. Les tests sont essentiels pour créer des interfaces utilisateur de haute qualité. Dans les systèmes modulaires, de minuscules ajustements peuvent entraîner des régressions majeures. Jusqu'à présent, nous avons rencontré trois types de tests:

- Les **tests visuels** reposent sur les développeurs pour examiner manuellement un composant pour vérifier son exactitude. Ils nous aident à vérifier l’apparence d’un composant lors de sa construction.
- Les **tests instantannés** avec Storyshots capturent le balisage rendu d'un composant. Ils nous aident à rester au courant des changements de balisage qui provoquent des erreurs de rendu et des avertissements.
- Les **tests unitaires** avec Jest vérifient que la sortie d'un composant reste la même avec une entrée fixe. Ils sont parfaits pour tester les qualités fonctionnelles d'un composant.

## "Mais cela a-t-il l'air correct?”

Malheureusement, les méthodes de test mentionnés plus haut ne suffisent pas à elles seules à éviter les bugs de l'interface utilisateur. Les interfaces utilisateur sont difficiles à tester car la conception est subjective et nuancée. Les tests visuels sont trop manuels, les tests instantanés déclenchent trop de faux positifs lorsqu'ils sont utilisés pour l'interface utilisateur, et les tests unitaires au niveau des pixels sont d'une valeur médiocre. Une stratégie complète de test de Storybook comprend également des tests de régression visuelle.

## Test de régression visuelle pour Storybook

Les tests de régression visuelle sont conçus pour détecter les changements d'apparence. Ils travaillent en capturant des captures d'écran de chaque histoire et en les comparant commit par commit sur des changements de surface. C'est parfait pour vérifier les éléments graphiques tels que la mise en page, la couleur, la taille et le contraste.

<video autoPlay muted playsInline loop style="width:480px; margin: 0 auto;">
  <source
    src="/intro-to-storybook/visual-regression-testing.mp4"
    type="video/mp4"
  />
</video>

Storybook est un outil fantastique pour les tests de régression visuelle, car chaque histoire est essentiellement une spécification de test. Chaque fois que nous écrivons ou mettons à jour une histoire, nous obtenons une spécification gratuitement!

Il existe de nombreux outils pour les tests de régression visuelle. Pour les équipes professionnelles, nous recommandons [**Chromatic**](https://www.chromatic.com/), un addon créé par les mainteneurs de Storybook qui exécute des tests dans le cloud.

## Configurer les tests de régression visuelle

Chromatic est un module complémentaire de Storybook sans tracas pour les tests de régression visuelle et la révision dans le cloud. Puisqu'il s'agit d'un service payant (avec un essai gratuit), il peut ne pas convenir à tout le monde. Cependant, Chromatic est un exemple instructif de flux de travail de test visuel de production que nous allons essayer gratuitement. Regardons.

### Mettez Git à jour

Vue CLI a déjà créé un répertoire pour votre projet; vérifions les modifications que nous avons apportées:

```bash
$ git add .
```

Maintenant soumettez les fichiers.

```bash
$ git commit -m "taskbox UI"
```

### Obtenir Chromatic

Ajoutez le paquetage comme une dépendance.

```bash
yarn add -D chromatic
```

Une chose fantastique à propos de cet addon est qu'il utilisera l'historique Git pour garder une trace de vos composants d'interface utilisateur.

Ensuite [connectez-vous Chromatic](https://bit.ly/2Is93Ez) avec votre compte GitHub (Chromatic ne demande que des autorisations légères). Créez un projet avec le nom "taskbox" et copiez votre `project-token` unique.

<video autoPlay muted playsInline loop style="width:520px; margin: 0 auto;">
  <source
    src="/intro-to-storybook/chromatic-setup-learnstorybook.mp4"
    type="video/mp4"
  />
</video>

Exécutez la commande de test dans la ligne de commande pour configurer des tests de régression visuelle pour Storybook. N'oubliez pas d'ajouter votre code d'application unique à la place de `<project-token>`.

```bash
npx chromatic --project-token=<project-token>
```

<div class="aside">
Si votre Storybook a un script de construction personnalisé, vous devrez peut-être [ajouter des options](https://www.chromatic.com/docs/setup#command-options) à cette commande.
</div>

Une fois le premier test terminé, nous avons des références de test pour chaque histoire. En d'autres termes, des captures d'écran de chaque histoire connue pour être «bonne». Les futurs changements apportés à ces histoires seront comparés aux références.

![Chromatic baselines](/intro-to-storybook/chromatic-baselines.png)

## Attraper un changement d'interface utilisateur

Les tests de régression visuelle reposent sur la comparaison des images du nouveau code d'interface utilisateur rendu aux images de base. Si une modification de l'interface utilisateur est détectée, vous en êtes averti. Voyez comment cela fonctionne en modifiant l'arrière-plan du composant `Task`:

![Changement de code](/intro-to-storybook/chromatic-change-to-task-component.png)

Cela donne une nouvelle couleur d'arrière-plan pour l'élément.

![Modification de la couleur d'arrière plan d'une tâche](/intro-to-storybook/chromatic-task-change.png)

Utilisez la commande de test précédente pour exécuter un autre test chromatique.

```bash
npx chromatic --project-token=<project-token>
```

Suivez le lien vers l'interface utilisateur Web où vous verrez les modifications.

![Changement UI dans Chromatic](/intro-to-storybook/chromatic-catch-changes.png)

Il y a beaucoup de changements! La hiérarchie des composants où `Task` est un enfant de `TaskList` et `Inbox` signifie une petite modification des boules de neige en régressions majeures. Cette circonstance est précisément la raison pour laquelle les développeurs ont besoin de tests de régression visuelle en plus d'autres méthodes de test.

![Petites modifications UI, grande régression](/intro-to-storybook/minor-major-regressions.gif)

## Examiner les changements

Les tests de régression visuelle garantissent que les composants ne changent pas par accident. Mais c’est à vous de déterminer si les changements sont intentionnels ou non.

Si une modification est intentionnelle, vous devez mettre à jour la base de référence afin que les futurs tests soient comparés à la dernière version de l'histoire. Si un changement n'est pas intentionnel, il doit être corrigé.

<video autoPlay muted playsInline loop style="width:480px; margin: 0 auto;">
  <source
    src="/intro-to-storybook/website-workflow-review-merge-optimized.mp4"
    type="video/mp4"
  />
</video>

Étant donné que les applications modernes sont construites à partir de composants, il est important de tester au niveau du composant. Cela nous aide à identifier la cause première d'un changement, le composant, au lieu de réagir aux symptômes d'un changement, les écrans et les composants composites.

## Fusionner les modifications

Lorsque nous avons terminé la revue, nous sommes prêts à fusionner les modifications de l'interface utilisateur en toute confiance, sachant que les mises à jour n'introduiront pas de bugs par inadvertance. Si vous aimez le nouveau fond rouge, acceptez les modifications, sinon revenez à l'état précédent.

![Changement prêts à être fusionnés](/intro-to-storybook/chromatic-review-finished.png)

Storybook vous aide à **construire** des composants; les tests vous aident à les **maintenir**. Les quatre types de tests d'interface utilisateur sont traités dans ce didacticiel: les tests de régression visuelle, instantanée, unitaire et visuelle. Vous pouvez automatiser les trois derniers en les ajoutant à votre script CI. Cela vous aide à expédier des composants sans vous soucier des insectes passagers. L'ensemble du flux de travail est illustré ci-dessous.

![Le workflow des tests de régression visuelle](/intro-to-storybook/cdd-review-workflow.png)
