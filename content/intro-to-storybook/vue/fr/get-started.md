---
title: 'Tutoriel Storybook pour Vue'
tocTitle: 'Commencer'
description: 'Configurer Vue Storybook dans votre environnement de développement'
commit: '9e3165c'
---

Storybook fonctionne avec votre application en mode développement. Il vous aide à créer des composants graphiques isolés de la logique métier et du contexte de votre application. Cette édition de Learn Storybook est pour Vue. D'autres éditions existent pour [React](/intro-to-storybook/react/fr/get-started), [React Native](/intro-to-storybook/react-native/en/get-started/), [Angular](/intro-to-storybook/angular/en/get-started) et [Svelte](/intro-to-storybook/svelte/en/get-started).

![Storybook et votre application](/intro-to-storybook/storybook-relationship.jpg)

## Configurer Storybook pour Vue

Nous allons suivre quelques étapes pour configurer votre environnement. Pour commencer, nous allons utiliser le [Vue CLI](https://cli.vuejs.org) pour créer notre application et activer [Storybook](https://storybook.js.org/) ainsi que les tests avec [Jest](https://facebook.github.io/jest/). Exécutons les commandes suivantes :

```bash
# Création de notre application, utilisant une configuration utilisant jest :
npx -p @vue/cli vue create taskbox --preset chromaui/vue-preset-learnstorybook

cd taskbox

# Ajout de Storybook:
npx -p @storybook/cli sb init
```

<div class="aside">
Tout au long de cette version du tutoriel, nous allons utiliser <code>yarn</code> pour exécuter la majorité de nos commandes.

Si vous avez Yarn d'installé, mais préférez utiliser <code>npm</code>, pas de panique, vous pouvez suivre tout de même le tutoriel sans aucun problème. Ajoutez simplement cette option <code> --packageManager=npm</code> à la première commande ci-dessus et Vue CLI et Storybook seront initialisés en fonction. De plus, pendant que vous progressez dans le tutoriel, n'oubliez pas d'ajuster les commandes avec l'équivalent <code>npm</code>.

</div>

Nous pouvons rapidement vérifier que les différentes parties de votre application fonctionnent correctement :

```bash
# Exécutez les tests (Jest) dans un terminal :
yarn test:unit

# Exécutez le composant d'exploration sur le port 6006 :
yarn storybook

# Exécutez l'application sur le port 8080 :
yarn serve
```

Nos trois modalités de notre application : tests automatisés (Jest), le composant de développement (Storybook) et l'application elle-même.

![3 modalités](/intro-to-storybook/app-three-modalities-vue.png)

En fonction de la partie de l'application sur laquelle vous travaillez, vous souhaiterez peut-être exécuter une ou plusieurs d'entre elles simultanément. Étant donné que notre objectif actuel est de créer un seul composant d'interface utilisateur, nous allons continuer d'exécuter Storybook.

## Réutiliser CSS

Taskbox réutilise les éléments de conception du tutoriel de GraphQL et de React [application exemple](https://blog.hichroma.com/graphql-react-tutorial-part-1-6-d0691af25858), nous n'aurons donc pas besoin d'écrire du CSS dans ce tutoriel. Copiez et collez [ce CSS compilé](https://github.com/chromaui/learnstorybook-code/blob/master/src/index.css) dans `src/index.css` puis importez le dans l'application en modifiant la balise `<style>` dans le fichier `src/App.vue` pour qu'elle ressemble à ceci :

```html
<style>
  @import './index.css';
</style>
```

![Taskbox UI](/intro-to-storybook/ss-browserchrome-taskbox-learnstorybook.png)

<div class="aside">
Si vous voulez modifier le style, les fichiers sont fournis dans le projet GitHub.
</div>

## Ajoutez des ressources

Pour correspondre à la conception souhaitée, vous devrez télécharger les répertoires de polices et d'icônes et placer son contenu dans votre dossier `src/assets`.

<div class="aside">
<p>Nous avons utilisé <code>svn</code> (Subversion) pour télécharger facilement des fichiers d'un répertoire à partir de GitHub. Si vous n'avez pas subversion d'installé ou si vous voulez le faire manuellement, vous pouvez récupérer les fichiers directement <a href="https://github.com/chromaui/learnstorybook-code/tree/master/src/assets">ici</a>.</p></div>

```bash
svn export https://github.com/chromaui/learnstorybook-code/branches/master/src/assets/icon src/assets/icon
svn export https://github.com/chromaui/learnstorybook-code/branches/master/src/assets/font src/assets/font
```

Nous devons également mettre à jour nos scripts Storybook pour pointer vers le répertoire `public` (dans le fichier `package.json`):

```json
{
  "scripts": {
    "storybook": "start-storybook -p 6006 -s public"
  }
}
```

Après avoir ajouté le style et les ressources, le rendu de l'application sera un peu étrange. C'est normal. Nous ne travaillons pas sur l'application pour le moment. Nous commençons par construire notre premier composant !
