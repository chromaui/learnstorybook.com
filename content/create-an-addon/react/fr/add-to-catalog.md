---
title: 'Ajouter votre Addon au catalogue'
tocTitle: 'Ajouter au catalogue'
description: 'Partagez votre addon Storybook avec la communauté'
commit: '927e729'
---

Le [catalogue d'addons](https://storybook.js.org/addons) rassemble tous les addons Storybook. C'est là que nous affichons vos addons et où les développeurs en découvrent de nouveaux. Préparons le vôtre pour le publier dans le catalogue.

![](../../images/catalog.png)

## Préparer votre addon pour le publier

Les addons Storybook, comme la plupart des packages de l'écosystème JavaScript, sont distribués via NPM. Cependant, ils respectent certains critères :

1. Ils ont un répertoire dist contenant le code ES5 transpilé.
2. Un fichier `preset.js` à la racine, écrit en tant que module ES5.
3. Un fichier `package.json` déclarant :
   - Les peerDependencies
   - Les informations liées au module
   - Les métadonnées pour le catalogue

L'Addon Kit se charge de presque tout ça pour nous. Nous devons juste nous assurer de fournir les bonnes métadonnées.

## Métadonnées du module

Elles incluent le point d'entrée de l'addon et quels fichiers sont à inclure lorsque vous le publiez, ainsi que toutes ses dépendances. Par exemple, React, React DOM et toutes les APIs liées à Storybook.

```json:title=package.json
{
  ...
  "main": "dist/preset.js",
  "files": [
    "dist/**/*",
    "README.md",
    "*.js"
  ],
  "peerDependencies": {
    "@storybook/addons": "^6.1.14",
    "@storybook/api": "^6.1.14",
    "@storybook/components": "^6.1.14",
    "@storybook/core-events": "^6.1.14",
    "@storybook/theming": "^6.1.14",
    "react": "^16.8.0 || ^17.0.0",
    "react-dom": "^16.8.0 || ^17.0.0"
  },
  ...
}
```

#### Pourquoi les peerDependencies ?

Imaginons que vous créiez une bibliothèque de formulaire fonctionnant avec React. Si vous incluez React comme dépendance, tout le code de React sera embarqué dans votre paquet. Imaginons maintenant que vos utilisateurs aient déjà React en dépendance. Si les versions diffèrent, leur application ne fonctionnera plus. C'est le même principe ici.

## Métadonnées pour le catalogue

En plus des informations liées au module, vous devez préciser quelques métadonnées pour le catalogue d'addons de Storybook.

![les métadonnées du catalogue comprennent les tags, la compatibilité, les auteurs, etc.](../../images/catalog-metadata.png)

Certaines de ces informations sont pré-configurées. Des choses comme le nom, l'icône ou la compatibilité des différents frameworks sont définies sous la propriété
`storybook`. Consultez la [documentation concernant les métadonnées des Addons](https://storybook.js.org/docs/react/addons/addon-catalog/#addon-metadata) pour une spécification complète de l'API des métadonnées.

```json:title=package.json
{
  ...
  "name": "my-storybook-addon",
  "version": "1.0.0",
  "description": "My first storybook addon",
  "author": "Your Name",
  "storybook": {
    "displayName": "My Storybook Addon",
    "unsupportedFrameworks": ["react-native"],
    "icon": "https://yoursite.com/link-to-your-icon.png"
  },
  "keywords": ["storybook-addons", "appearance", "style", "css", "layout", "debug"]
  ...
}
```

La propriété `keywords` correspond aux mots-clés du catalogue. Par exemple, le mot-clé storybook-addons assure que votre addon sera ajouté au catalogue. Le mot-clé "appearence" représente une catégorie du catalogue. Le reste pour la recherche.

## Publier sur NPM

La dernière étape est de publier l'addon. L'Addon Kit est pré-configuré avec [Auto](https://github.com/intuit/auto) pour la gestion de releases : un changelog est généré et poussé à la fois sur GitHub et sur NPM. Vous devez donc configurer l'accès à ces derniers.

1. Authentifiez-vous en utilisant [npm adduser](https://docs.npmjs.com/cli/adduser.html)
2. Créez un [token](https://docs.npmjs.com/creating-and-viewing-access-tokens#creating-access-tokens). Vous aurez besoin d'un token avec les droits de lecture et de publication.
3. De la même manière, générez un [token Github](https://github.com/settings/tokens). Ce token nécessitera les droits sur le dépôt.
4. Créez un fichier `.env` à la racine de votre projet et ajoutez-y les deux tokens :

````bash
GH_TOKEN=valeur_récupérée_depuis_GitHub
NPM_TOKEN=valeur_récupérée_depuis_NPM

**Créez ensuite des labels sur GitHub**. Vous utiliserez ces labels plus tard lorsque vous apporterez des modifications à votre package.

```bash
npx auto create-labels
````

Rendez-vous sur GitHub, vous devriez désormais voir un ensemble de labels qu'Auto aimerait que vous utilisiez. Utilisez-les pour tagger les futures Pull Requests.

Enfin, la création d'une release

```bash
yarn release
```

Cette commande va :

- compiler et empaqueter le code de l'addon
- générer une nouvelle version
- pousser une release sur GitHub et NPM
- pousser un changelog sur GitHub

Voilà ! Nous avons réussi à publier notre package sur npm et à sortir notre premier addon Storybook. Il peut y avoir un délai entre le moment où vous le publiez et le moment où il apparaît dans le catalogue car ce dernier doit parcourir npm. Si votre addon n'apparaît pas, ouvrez une issue sur le projet GitHub de Storybook.
