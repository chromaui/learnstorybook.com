---
title: 'Tutoriel de Storybook pour React'
tocTitle: 'Débuter'
description: 'Configurer Storybook dans votre environnement de développement'
commit: '9245261'
---

Storybook s'éxécute parallèlement à votre application en mode développement. Il vous aide à construire des composants UI(User Interface) qui sont isolés de la logique applicative et du contexte de votre application. Cette édition de Learn Storybook est pour React; d'autres éditions existent pour [React Native](/intro-to-storybook/react-native/en/get-started), [Vue](/intro-to-storybook/vue/fr/get-started), [Angular](/intro-to-storybook/angular/en/get-started) et [Svelte](/intro-to-storybook/svelte/en/get-started).

![Storybook et votre application](/intro-to-storybook/storybook-relationship.jpg)

## Configurer React Storybook

Voici les étapes pour configurer le processus de compilation dans votre environnement. Pour commencer, nous allons utiliser [Create React App](https://github.com/facebook/create-react-app) (CRA) pour mettre en place notre système de compilation, et ensuite ajouter [Storybook](https://storybook.js.org/) et l'outil de test [Jest](https://facebook.github.io/jest/) dans notre application. Exécutons les commandes suivantes:

```bash
# Create our application:
npx create-react-app taskbox

cd taskbox

# Add Storybook:
npx -p @storybook/cli sb init
```

<div class="aside">
Tout au long de ce tutoriel, nous allons utiliser <code>yarn</code> pour exécuter la majorité de nos commandes. 
Si vous avez déjà installé <code>yarn</code>, mais que vous préférez utiliser <code>npm</code> à la place, ne vous inquiétez pas, vous pouvez toujours suivre ce tutoriel sans aucun problème. Il suffit d'ajouter le drapeau <code>--use-npm</code> à la première commande ci-dessus, CRA et Storybook en tiendront compte lors de leur initialisation. De plus, pendant que vous progressez dans le tutoriel, n'oubliez pas d'ajuster les commandes utilisées à leurs équivalents <code>npm</code>.
</div>

Pour vérifier rapidement que les différents environnements de notre application fonctionnent correctement:

```bash
# Run the test runner (Jest) in a terminal:
yarn test --watchAll

# Start the component explorer on port 6006:
yarn storybook

# Run the frontend app proper on port 3000:
yarn start
```

<div class="aside"> 
Vous avez peut-être remarqué que nous avons ajouté le drapeau <code>--watchAll</code> à notre commande de test, ne vous inquiétez pas, c'est intentionnel, ce petit changement permettra de s'assurer que tous les tests sont effectués et que tout va bien avec notre application. Pendant que vous progressez dans ce tutoriel, vous serez exposés à différents scénarios de test. Pour vous assurer que votre suite de tests fonctionnera dans son intégralité, vous pouvez aussi ajouter ce drapeau à votre script de test dans votre <code>package.json</code> .
</div>

Notre application front-end se compose de trois modules: test automatisé (Jest), développement de composants (Storybook) et l'application elle-même.

![les 3 modules](/intro-to-storybook/app-three-modalities.png)

Selon la partie de l'application sur laquelle vous travaillez, vous voudriez peut-être exécuter un ou plusieurs de ces modules simultanément. Comme nous nous concentrerons actuellement sur la création d'un seul composant d'UI, nous continuerons à exécuter Storybook.

## Réutiliser les CSS

Taskbox réutilise des éléments de design du tutoriel GraphQL et React [l'application d'éxample](https://www.chromatic.com/blog/graphql-react-tutorial-part-1-6), donc ce ne sera pas necessaire d'écrire de CSS dans ce tutoriel. Copier et coller [ce CSS compilé](https://github.com/chromaui/learnstorybook-code/blob/master/src/index.css) dans le fichier `src/index.css`.

![UI de Taskbox](/intro-to-storybook/ss-browserchrome-taskbox-learnstorybook.png)

<div class="aside">
Si vous souhaitez modifier le styling, les fichiers sources LESS sont fournis dans le répertoire GitHub.
</div>

## Ajouter les assets

Pour correspondre au design prévu, vous devrez télécharger les répertoires des polices et des icônes et placer leur contenu dans votre dossier `src/assets`.

```bash
npx degit chromaui/learnstorybook-code/src/assets/font src/assets/font
npx degit chromaui/learnstorybook-code/src/assets/icon src/assets/icon
```

<div class="aside">
Nous utilisons <a href="https://github.com/Rich-Harris/degit">degit</a> pour télécharger les dossiers de GitHub. Si vous voulez le faire manuellement, vous pouvez récupérer les dossiers <a href="https://github.com/chromaui/learnstorybook-code/tree/master/src/assets/">ici</a>.
</div>

Après avoir ajouté le styling et les ressources, l'application aura un rendu un peu étrange. Ce n'est pas grave, car nous ne travaillons pas sur l'application pour l'instant. Nous sommes d'abord en train de construire notre premier composant!
