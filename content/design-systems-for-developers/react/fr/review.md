---
title: 'Relecture avec les équipes'
tocTitle: 'Relecture'
description: "Collaborer grâce à l'intégration continue et l'examen visuel"
commit: 'fe0944a'
---

Dans ce chapitre 4, nous en apprendrons plus sur les flux de travail professionnels pour apporter des améliorations au design system tout en atténuant les incohérences. Ce chapitre présente les techniques permettant de recueillir des retours sur l'interface utilisateur et de parvenir à un consensus avec votre équipe.
Ces processus de production sont utilisés par des personnes travaillant pour Auth0, Shopify et Discovery Network.

## Source unique de vérité ou point de défaillance unique

Précédemment, j'ai écrit que les design systems sont un [point de défaillance unique](https://www.chromatic.com/blog/why-design-systems-are-a-single-point-of-failure) pour les équipes frontend. Par essence, les design systems sont des dépendances. Si vous modifiez un composant du design system, cette modification se propage aux applications dépendantes. Le mécanisme de publication des modifications n'est pas biaisé : il renvoie à la fois les améliorations et les bugs.

![Dépendances du design system](/design-systems-for-developers/design-system-dependencies.png)

Les bugs constituent un risque existentiel pour les design systems, c'est pourquoi nous ferons tout pour les éviter. Des ajustements mineurs finissent par avoir des impacts et peuvent entraîner d'innombrables régressions. En l'absence d'une stratégie de maintenance continue, les design systems se détériorent.

> « Mais ça marche sur mon ordinateur ?! » - tout le monde

## Revue visuelle des composants UI avec votre équipe

La revue visuelle est le processus qui valide le comportement et le rendu des interfaces. Elle a lieu à la fois pendant le développement de l'interface utilisateur et pendant l'étape d'assurance qualité avec l'équipe.

La plupart des développeurs connaissent bien la revue du code, qui consiste à recueillir les commentaires d'autres développeurs sur le code afin d'en améliorer la qualité. Étant donné que les composants de l'interface utilisateur expriment le code de manière graphique, une revue visuelle est nécessaire pour recueillir les commentaires sur l'UI (Interface Utilisateur) et l'UX (Expérience Utilisateur).

### Établir un point de référence universel

Supprimer les node_modules. Réinstaller les packages. Effacer le stockage local.
Supprimer les cookies. Si ces actions vous semblent familières, vous savez à quel point il est difficile de s'assurer que les coéquipiers se réfèrent au code le plus récent. Lorsque les gens n'ont pas des environnements de développement identiques, c'est un cauchemar de discerner les problèmes causés par l'environnement local des bugs réels.

Heureusement, en tant que développeurs frontend, nous avons une cible de compilation commune : le navigateur. Les équipes avisées publient leur Storybook en ligne pour servir de point de référence universel lors de la revue visuelle, évitant ainsi les complications inhérentes aux environnements de développement locaux (il est de toute façon ennuyeux d'être le support technique).

![Relire votre travail dans le cloud](/design-systems-for-developers/design-system-visual-review.jpg)

Lorsque les composants existants de l'interface utilisateur sont accessibles via une URL, les utilisateurs peuvent confirmer l'aspect et la fonctionnalité de l'interface utilisateur simplement depuis leur navigateur. Cela signifie que les développeurs, les designers et les chefs de produit n'ont pas à se préoccuper d'un environnement de développement local, à faire circuler des captures d'écran ou à se référer à des interfaces utilisateur obsolètes.

> « Déployer Storybook à chaque PR rend la revue visuelle plus facile et aide les chefs de produits à penser en matière de composants ». - Norbert de Langen, mainteneur principal de Storybook

<h2 id="publish-storybook">Publier le Storybook</h2>

Nous ferons la démonstration d'un processus de revue visuelle avec [Chromatic](https://www.chromatic.com/?utm_source=storybook_website&utm_medium=link&utm_campaign=storybook), un service de publication gratuit créé par les mainteneurs de Storybook. Cela vous permet de déployer et d'héberger votre Storybook en toute sécurité dans le cloud, mais il est également assez simple de [développer Storybook comme un site statique et de le déployer](https://storybook.js.org/docs/react/sharing/publish-storybook) sur d'autres services d'hébergement.

### Obtenir Chromatic

Tout d'abord, allez sur [chromatic.com](https://www.chromatic.com/?utm_source=storybook_website&utm_medium=link&utm_campaign=storybook) et inscrivez-vous avec votre compte GitHub.

![S'inscrire sur Chromatic](/design-systems-for-developers/chromatic-signup.png)

A partir de là, sélectionnez le dépôt de votre design system.

En arrière-plan, les autorisations d'accès seront synchronisées et les pull request (PR) vérifiées.

<video autoPlay muted playsInline loop style="width:520px; margin: 0 auto;">
  <source
    src="/design-systems-for-developers/chromatic-setup-learnstorybook-design-system.mp4"
    type="video/mp4"
  />
</video>

Installez le package [chromatic](https://www.npmjs.com/package/chromatic) via npm.

```shell
yarn add --dev chromatic
```

Une fois installé, lancez la commande suivante pour développer et déployer votre Storybook (vous devrez utiliser le `project-token` que Chromatic fournit sur le site web) :

```shell
npx chromatic --project-token=<project-token>
```

![Chromatic dans la ligne de commande](/design-systems-for-developers/chromatic-manual-storybook-console-log.png)

Visualisez votre Storybook publié en copiant le lien fourni et en le collant dans une nouvelle fenêtre de votre navigateur. Vous constaterez que votre environnement de développement local Storybook est reproduit en ligne.

![Storybook avec Chromatic](/design-systems-for-developers/chromatic-published-storybook-7-0.png)

Cela permet à votre équipe d'examiner facilement les composants de l'interface utilisateur tels que vous les voyez localement. Et voici la confirmation que vous verrez dans Chromatic.

![Résultat de notre premier développement dans Chromatic](/design-systems-for-developers/chromatic-first-build.png)

Félicitations ! Maintenant que vous avez mis en place l'infrastructure pour publier Storybook, améliorons-la avec l'intégration continue.

<h3 id="chromatic-ci">Intégration continue</h3>

L'intégration continue est la méthode la plus utilisée pour assurer la maintenance des applications web modernes. Elle vous permet d'effectuer des tests, des analyses et des déploiements à chaque fois que vous ajoutez du code. Nous adopterons cette technique pour nous épargner des actions manuelles et répétitives.

Nous utiliserons GitHub Actions, qui est gratuit pour notre cas d'utilisation simple. Les mêmes principes s'appliquent aux autres services d'intégration continue.

Ajoutez un dossier `.github` au plus au niveau de votre projet. Créez ensuite un autre dossier appelé `workflows`.

Créez un fichier appelé chromatic.yml comme celui ci-dessous. Il nous permettra de scripter le comportement de notre processus d'intégration continue. Nous allons commencer avec quelque chose de simple pour l'instant et continuer à l'améliorer au fur et à mesure que nous avancerons :

```yaml:title=.github/workflows/chromatic.yml
# Name of our action
name: 'Chromatic'
# The event that will trigger the action
on: push

# What the action will do
jobs:
  test:
    # The operating system it will run on
    runs-on: ubuntu-latest
    # The list of steps that the action will go through
    steps:
      - uses: actions/checkout@v2
        with:
          #👇 Fetches all history so Chromatic can compare against previous builds
          fetch-depth: 0
      - uses: actions/setup-node@v3
        with:
          #👇 Sets the version of Node.js to use
          node-version: 16
      - run: yarn
        #👇 Adds Chromatic as a step in the workflow
      - uses: chromaui/action@v1
        # Options required for Chromatic's GitHub Action
        with:
          #👇 Chromatic projectToken, see https://storybook.js.org/tutorials/design-systems-for-developers/react/en/review/ to obtain it
          projectToken: ${{ secrets.CHROMATIC_PROJECT_TOKEN }}
          token: ${{ secrets.GITHUB_TOKEN }}
```

<div class="aside"><p>
💡 Par souci de concision, les <a href="https://help.github.com/en/actions/configuring-and-managing-workflows/creating-and-storing-encrypted-secrets">Github Secrets</a> n'ont pas été mentionnés. Les secrets sont des variables d'environnement sécurisées fournies par GitHub afin que vous n'ayez pas à coder en dur le <code>project-token</code>.</p>
</div>

Ajoutez vos modifications avec :

```shell
git add .
```

Effectuez un commit :

```shell
git commit -m "Storybook deployment with GitHub action"
```

Enfin, poussez les modifications sur le dépôt distant avec :

```shell
git push origin main
```

Super ! Nous avons amélioré notre infrastructure.

## Demander une revue visuelle à votre équipe

Lorsqu'une Pull Request (PR) contient des changements d'interface utilisateur, il est utile d'initier un processus de revue visuelle avec les parties prenantes pour atteindre un consensus sur ce qui est livré à l'utilisateur.
Ainsi, il n'y a pas de surprises indésirables ni de refactorisation.

Nous allons faire une démonstration de la revue visuelle en apportant une modification à l'interface utilisateur sur une nouvelle branche.

```shell
git checkout -b improve-button
```

Tout d'abord, modifiez le composant Button. "Faites-le ressortir", nos designers vont adorer.

```jsx:title=src/Button/Button.jsx
// ...
const StyledButton = styled.button`
  border: 10px solid red;
  font-size: 20px;
`;
// ...
```

Effectuez un commit avec les changements et poussez-les sur votre dépôt GitHub.

```shell:clipboard=false
git commit -am "make Button pop"
git push -u origin improve-button
```

Allez sur GitHub.com et ouvrez une pull request pour la branche `improve-button`.
Une fois la PR ouverte, le build de CI de Storybook s'exécutera.

![PR créées dans GitHub](/design-systems-for-developers/github-created-pr-actions.png)

Dans votre liste de vérifications de la PR en bas de la page, cliquez sur **Publication de Storybook** pour voir le Storybook publié avec les nouveaux changements.

![Composant Button modifié dans le site déployé](/design-systems-for-developers/chromatic-deployed-site-with-changed-button.png)

Pour chaque composant et story modifiés, copiez l'URL depuis la barre d'adresse du navigateur et collez-la dans les outils des gestion de tâches de votre équipe (GitHub, Asana, Jira, etc.) pour aider les coéquipiers à passer rapidement en revue les stories pertinentes.

![PR Github avec un lien vers le Storybook](/design-systems-for-developers/github-created-pr-with-links-actions.png)

Attribuez la PR à vos coéquipiers et observez leurs retours.

![Pourquoi ?!](/design-systems-for-developers/github-visual-review-feedback.gif)

<div class="aside">💡 Chromatic propose également un flux de travail complet de revue de l'interface utilisateur intégré au produit avec son offre payante. La technique qui consiste à copier les liens Storybook dans une PR GitHub fonctionne à plus petite échelle (et avec n'importe quel service qui héberge votre Storybook, pas seulement Chromatic), mais au fur et à mesure que votre utilisation augmente, vous pouvez considérer ce service car il automatise le processus.
</div>

Dans le domaine du développement de logiciels, la plupart des défauts sont dus à une mauvaise communication et non à la technologie. La revue visuelle permet aux équipes de recueillir un retour d'information continu pendant le développement afin de livrer plus rapidement les design systems.

![Processus de revue visuelle](/design-systems-for-developers/visual-review-loop.jpg)

> Déployer une URL Storybook pour chaque Pull Request est quelque chose que nous faisons depuis un certain temps dans le design system de Shopify, Polaris, et cela s'est avéré incroyablement utile. Ben Scott, Ingénieur chez Shopify

## Tester votre design system

La revue visuelle est inestimable. Cependant, relire et examiner des centaines de stories de composants peut prendre des heures. Idéalement, nous voulons voir uniquement les changements intentionnels (ajouts / améliorations) et détecter automatiquement les régressions non intentionnelles.

Dans le chapitre 5, nous présentons les stratégies de tests qui allègent la revue visuelle et garantissent la durabilité de nos composants dans le temps.
