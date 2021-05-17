---
title: 'Tutoriel Storybook pour Vue'
tocTitle: 'Commencer'
description: 'Configurer Vue Storybook dans votre environnement de développement'
commit: 'b218a07'
---

Storybook fonctionne avec votre application en mode développement. Il vous aide à créer des composants graphiques isolés de la logique métier et du contexte de votre application. Cette édition du tutoriel de l'Introduction à Storybook est pour Vue. D'autres éditions existent pour [React](/react/en/get-started), [React Native](/react-native/en/get-started/), [Angular](/angular/en/get-started) et [Svelte](/svelte/en/get-started).

![Storybook et votre application](/intro-to-storybook/storybook-relationship.jpg)

## Configurer Storybook pour Vue

Nous allons suivre quelques étapes pour configurer votre environnement. Pour commencer, nous voulons utiliser [degit](https://github.com/Rich-Harris/degit) pour configurer notre système de construction. En utilisant ce package, vous pouvez télécharger des « modèles » (applications partiellement construites avec une configuration par défaut) pour vous aider à accélérer votre flux de travail de développement.

Exécutons les commandes suivantes :

```bash
# Clone the template
npx degit chromaui/intro-storybook-vue-template taskbox

cd taskbox

# Install dependencies
yarn

```

<div class="aside">
💡 Ce modèle contient les styles, les ressources et les configurations essentielles pour cette version du tutoriel.
</div>

Nous pouvons maintenant vérifier rapidement que les différentes environnements de votre application fonctionnent correctement :

```bash
# Run the test runner (Jest) in a terminal:
yarn test:unit

# Start the component explorer on port 6006:
yarn storybook

# Run the frontend app proper on port 8080:
yarn serve
```

Nos trois modalités de notre application : tests automatisés (Jest), le composant de développement (Storybook) et l'application elle-même.

![3 modalités](/intro-to-storybook/app-three-modalities-vue.png)

En fonction de la partie de l'application sur laquelle vous travaillez, vous souhaiterez peut-être exécuter une ou plusieurs d'entre elles simultanément. Étant donné que notre objectif actuel est de créer un seul composant d'interface utilisateur, nous allons continuer d'exécuter Storybook.

## Valider les modifications

À ce stade, il est préférable d'ajouter nos fichiers à un référentiel local. Exécutez les commandes suivantes pour initialiser un référentiel local, ajouter et valider les modifications que nous avons effectuées jusqu'à présent.

```shell
$ git init
```

Et ensuite :

```shell
$ git add .
```

Et pour finir :

```shell
$ git commit -m "first commit"
```

Commençons à construire notre premier composant !
