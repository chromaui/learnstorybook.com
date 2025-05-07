---
title: 'Tutoriel de Storybook pour React'
tocTitle: 'Débuter'
description: 'Configurer Storybook dans votre environnement de développement'
commit: '2407c3c'
---

Storybook s'exécute parallèlement à votre application en mode développement. Il vous aide à construire des composants d'interface utilisateur (User Interface ou UI) isolés de la logique applicative et du contexte de votre application. Cette édition de Learn Storybook est pour React; d'autres éditions existent pour [React Native](/intro-to-storybook/react-native/en/get-started), [Vue](/intro-to-storybook/vue/fr/get-started), [Angular](/intro-to-storybook/angular/en/get-started), [Svelte](/intro-to-storybook/svelte/en/get-started).

![Storybook et votre application](/intro-to-storybook/storybook-relationship.jpg)

## Configurer React Storybook

Voici les étapes pour configurer le processus de compilation dans votre environnement. Pour commencer, nous allons utiliser [degit](https://github.com/Rich-Harris/degit) pour mettre en place notre système de build. L'usage de cette librairie permet de télécharger des "templates" (des mini applications construites avec une configuration par défaut) et de vous aider à développer plus vite.

Exécutez les commandes suivantes:

```shell:clipboard=false
# Clone the template
npx degit chromaui/intro-storybook-react-template taskbox

cd taskbox

# Install dependencies
yarn
```

<div class="aside">
💡 Ce template contient les styles nécessaires, images et toute configuration essentiels au fonctionnement de cette version du tutoriel.
</div>

Maintenant, nous pouvons vérifier rapidement que les différents environnements de notre application fonctionnent correctement:

```shell:clipboard=false
# Start the component explorer on port 6006:
yarn storybook

# Run the frontend app proper on port 5173:
yarn dev
```

Les principales modalités de notre application frontend : développement de composants (Storybook) et l'application elle-même.

![Modalités principales](/intro-to-storybook/app-main-modalities-react.png)

Selon la partie de l'application sur laquelle vous travaillez, vous voudriez peut-être exécuter un ou plusieurs de ces modules simultanément. Comme nous nous concentrerons actuellement sur la création d'un seul composant d'UI, nous continuerons à exécuter Storybook.

## Commiter les changements

À cette étape, il est préférable d'ajouter les fichiers modifiés à notre environnement de développement en local. Exécutez les commandes suivantes pour initialiser notre dépôt, et commiter les changements que nous avons faits jusque là.

```shell
git init
```

Suivi de:

```shell
git add .
```

Puis:

```shell
git commit -m "first commit"
```

Et enfin:

```shell
git branch -M main
```

Il est temps maintenant de développer notre premier composant !
