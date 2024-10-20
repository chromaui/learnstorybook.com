---
title: "Partager l'interface utilisateur au sein d'une organisation"
tocTitle: 'Partager'
description: "Apprenez à packager et à importer votre design system dans d'autres applications"
commit: '7a53150'
---

D'un point de vue architectural, les design systems constituent une autre dépendance frontend. Ils ne sont pas tant différents des dépendances populaires telles que moment ou lodash. Les composants UI sont du code, nous pouvons donc nous appuyer sur des techniques établies pour la réutilisation du code.

Ce chapitre traite du partage des design systems, du packaging des composants de l'interface utilisateur à leur import dans d'autres applications. Nous découvrirons également des techniques permettant de gagner du temps pour simplifier la gestion des mises en production et les processus de publication.

![Propager des composants dans les sites](/design-systems-for-developers/design-system-propagation.png)

## Packager le design system

Les entreprises disposent de milliers de composants d'interface utilisateur répartis dans différentes applications. Auparavant, nous avons extrait les composants les plus utilisés dans notre design system, et nous devons maintenant réintroduire ces composants dans les applications.

Notre design system utilise npm, le gestionnaire de packages JavaScript pour gérer la distribution, les versions et la gestion des dépendances.

Il existe de nombreuses méthodes valables pour packager les design systems. Jetez un coup d'œil aux design systems de Lonely Planet, Auth0, Salesforce, GitHub et Microsoft pour voir la diversité des approches. Certains livrent chaque élément séparément, tandis que d'autres livrent tous les éléments dans un seul package.

Pour les design systems naissants, la méthode la plus directe consiste à publier une version unique d'un package qui comprend :

- 🏗 Les composants communs de l'interface utilisateur
- 🎨 Les design tokens (également appelés variables de style)
- 📕 La documentation

![Packager un design system](/design-systems-for-developers/design-system-package.jpg)

## Préparer votre design system pour l'exportation

Nous avons utilisé un modèle personnalisé à des fins de développement, de test et de documentation. Toutefois, nous devons améliorer sa nature descriptive avant de publier notre design system. Il est essentiel de mettre de l'ordre dans certains éléments initiaux et de mettre à jour le fichier README.md avec une description détaillée de notre design system.

```markdown:title=README.md
# Storybook design system tutorial

The Storybook design system tutorial is a subset of the full [Storybook design system](https://github.com/storybookjs/design-system/), created as a learning resource for those interested in learning how to write and publish a design system using best in practice techniques.

Learn more in [Storybook tutorials](https://storybook.js.org/tutorials/).
```

Voyons maintenant comment nous allons construire le système de packages. Pour compiler notre design system, nous utiliserons [Rollup](https://rollupjs.org/), un outil de regroupement de modules JavaScript qui combine de petits fragments de code dans de plus grandes librairies ou applications. L'avantage est que les paramètres requis et les points d'entrée communs sont déjà inclus dans le fichier `src/index.js` et `rollup.config.mjs`, il n'est donc pas nécessaire de les configurer nous-mêmes.

```js:clipboard=false
// src/index.js


import * as styles from './shared/styles';
import * as global from './shared/global';
import * as animation from './shared/animation';
import * as icons from './shared/icons';

export { styles, global, animation, icons };


export * from './Avatar';
export * from './Badge';
export * from './Button';
export * from './Icon';
export * from './Link';
```

```js:clipboard=false
// rollup.config.mjs

import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import terser from '@rollup/plugin-terser';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import { babel } from '@rollup/plugin-babel';

// This is required to read package.json file when
// using Native ES modules in Node.js
// https://rollupjs.org/command-line-interface/#importing-package-json
import { createRequire } from 'node:module';
const requireFile = createRequire(import.meta.url);
const packageJson = requireFile('./package.json');

export default [
  {
    input: 'src/index.js',
    output: [
      {
        file: packageJson.main,
        format: 'cjs',
        sourcemap: true,
      },
      {
        file: packageJson.module,
        format: 'esm',
        exports: 'named',
        sourcemap: true,
      },
    ],
    plugins: [
      peerDepsExternal(),
      resolve({
        extensions: ['.js', '.jsx'],
      }),
      commonjs(),
      terser(),
      babel({
        extensions: ['.js', '.jsx'],
        exclude: 'node_modules/**',
      }),
    ],
    external: ['react', 'react-dom', '@emotion/react', '@emotion/styled'],
  },
];
```

Maintenant nous pouvons lancer `yarn build` pour compiler notre code dans le dossier `dist`. Nous devrions aussi ajouter ce dossier à `.gitignore`, pour ne pas l'ajouter accidentellement à nos commits :

```TEXT:title=.gitignore
// ...
dist
```

#### Ajouter les métadonnées du package pour la publication

Nous allons devoir modifier notre `package.json` pour nous assurer que nos utilisateurs du package détiennent toutes les informations nécessaires. La façon la plus simple de le faire est de lancer `yarn init`, une commande qui initialise le package pour la publication :

```shell:clipboard=false
# Initializes a scoped package
yarn init --scope=@your-npm-username

yarn init v1.22.5
question name (learnstorybook-design-system): @your-npm-username/learnstorybook-design-system
question version (0.1.0):
question description (Learn Storybook design system):Storybook design systems tutorial
question entry point (dist/cjs/index.js):
question repository url (https://github.com/your-username/learnstorybook-design-system.git):
question author (your-npm-username <your-email-address@email-provider.com>):
question license (MIT):
question private: no
```

La commande nous posera une série de questions, certaines sont pré-remplies, tandis que d'autres nécessiteront une réflexion. Vous devrez choisir un nom unique pour le package npm (vous ne pourrez pas utiliser `learnstorybook-design-system` : mais plutôt `@votre-nom-d'utilisateur-npm/learnstorybook-design-system`).

En résumé, il mettra à jour le `package.json` avec les nouvelles valeurs résultant de ces questions :

```json:clipboard=false
{
  "name": "@your-npm-username/learnstorybook-design-system",
  "description": "Storybook design systems tutorial",
  "version": "0.1.0",
  "license": "MIT",
  "main": "dist/cjs/index.js",
  "repository": "https://github.com/your-username/learnstorybook-design-system.git"
  // ...
}
```

<div class="aside"> Par souci de concision, les <a href="https://docs.npmjs.com/creating-and-publishing-scoped-public-packages">scopes du package</a> n'ont pas été mentionnées. L'utilisation des scopes vous permet de créer un package portant le même nom qu'un package créé par un autre utilisateur ou une autre organisation sans qu'il n'y ait de conflit.
</div>

Maintenant que nous avons préparé notre package, nous pouvons le publier sur npm pour la première fois !

## Gestion des mises en production avec Auto

Pour publier des mises en production sur npm, nous utiliserons un processus qui met également à jour un historique des versions (changelog) qui décrit les modifications, définit un numéro de version appropré, et crée un tag git qui lie ce numéro de version à un commit dans notre référentiel. Pour vous aider, nous utiliserons un outil open-source appelé [Auto](https://github.com/intuit/auto), conçu précisément dans ce but. Auto est un outil en ligne de commande que nous pouvons utiliser pour diverses tâches courantes liées à la gestion des mises en production. Vous pouvez en savoir plus sur Auto en consultant [leur site de documentation](https://intuit.github.io/auto/).

#### Obtenir un token GitHub et npm

Pour les prochaines étapes, Auto communiquera avec GitHub et npm. Pour que cela fonctionne correctement, nous avons besoin d'un token d'accès personnel.
Vous pouvez en obtenir un sur [cette page](https://github.com/settings/tokens) pour GitHub. Le token aura besoin des deux scopes `repo` et `workflow`.

Pour npm, vous pouvez créer un token via l'URL suivante : https://www.npmjs.com/settings/&lt;your-username&gt;/tokens.

Vous aurez besoin d'un token avec les permissions « Lecture et Publication ».

Ajoutons ce token à un fichier appelé `.env` dans notre projet :

```TEXT:title=.env
GH_TOKEN=<value you just got from GitHub>
NPM_TOKEN=<value you just got from npm>
```

En ajoutant le fichier à `.gitignore`, nous nous assurons que nous ne poussons pas accidentellement cette valeur dans un référentiel open-source que tous nos utilisateurs peuvent voir ! Ce point est crucial. Si d'autres mainteneurs ont besoin de publier le package localement (plus tard, nous mettrons en place une publication automatique lorsqu'une Pull Request (PR) est mergée dans la branche par défaut), ils doivent configurer leur propre fichier `.env` en suivant ce processus :

```TEXT:title=.gitignore
dist
.env
```

#### Créer des labels sur GitHub

La première chose à faire avec Auto est de créer un ensemble de labels dans GitHub. Nous utiliserons ces labels plus tard lorsque nous effectuerons des changements dans le package (voir le chapitre suivant), cela permettra à `auto` de mettre à jour la version du package de manière appropriée et de créer un historique des versions et des notes de publication.

```shell
yarn auto create-labels
```

Si vous vérifiez sur GitHub, vous verrez maintenant un ensemble de labels que `auto` voudrait que nous utilisions :

![Ensemble de labels créés sur GitHub par auto](/design-systems-for-developers/github-auto-labels.png)

Nous devrions attribuer l'un des labels suivants à chaque prochaine Pull Request (PR) : `major`, `minor`, `patch`, `skip-release`, `prerelease`, `internal`, `documentation` avant de la merger.

#### Publier notre première mise en production avec Auto manuellement

Dans le futur, nous déterminerons les nouveaux numéros de version avec `auto` via des scripts, mais pour la première mise en production, lançons les commandes manuellement pour comprendre ce qu'elles font. Générons notre première entrée dans l'historique des versions :

```shell
yarn auto changelog
```

La commande générera une longue entrée de l'historique des versions avec chaque commit que nous avons créé jusqu'à présent (et un avertissement que nous avons poussé vers la branche par défaut, ce que nous devrons bientôt cesser de faire).

Bien qu'il soit utile d'avoir un l'historique des versions généré automatiquement, afin de ne pas manquer des choses, c'est aussi une bonne idée de l'éditer manuellement et de rédiger le message de la manière la plus claire pour les utilisateurs. Dans notre cas, les utilisateurs n'ont pas besoin de connaître toutes les modifications apportées en cours de route. Créons un message simple et agréable pour notre première version v0.1.0. Commencez par annuler le commit qu'Auto vient de créer (mais conservez les modifications) :

```shell
git reset HEAD^
```

Ensuite, nous mettrons à jour l'historique des versions et l'ajouterons au commit :

```markdown:title=CHANGELOG.md
# v0.1.0 (Mon Jun 12 2023)

- Created first version of the design system, with `Avatar`, `Badge`, `Button`, `Icon` and `Link` components.

#### Authors: 1

- [your-username](https://github.com/your-username)
```

Ajoutons cet historique à git. Notez que nous utilisons `[skip ci]` pour indiquer aux plateformes CI d'ignorer ces commits, sinon nous nous retrouverons avec une boucle de build et de publications.

```shell:clipboard=false
git add CHANGELOG.md
git commit -m "Changelog for v0.1.0 [skip ci]"
```

Nous pouvons maintenant publier :

```shell:clipboard=false
npm --allow-same-version version 0.1.0 -m "Bump version to: %s [skip ci]"
npm publish --access=public
```

<div class="aside">
💡 N'oubliez pas d'ajuster les commandes en conséquence si vous utilisez <a href="https://classic.yarnpkg.com/en/docs/cli/">yarn</a> pour publier votre package. 
</div>

Et utilisez Auto pour mettre en production sur GitHub :

```shell:clipboard=false
git push --follow-tags origin main
yarn release
```

Super !
Nous avons publié avec succès notre package sur npm et fait une première mise en production sur GitHub (avec un peu de chance !).

![Package publié sur npm](/design-systems-for-developers/npm-published-package.png)

![Version publiée sur GitHub](/design-systems-for-developers/github-published-release.png)

<div class="aside">

💡 Bien que nous ayons modifié les notes de version initiales pour qu'elles aient un sens pour la première version, `auto` génère automatiquement les notes de version basées sur les messages de commit pour les prochaines versions.

</div>

Maintenant, quand nous lançons `yarn release`, nous allons passer par toutes les étapes que nous avons exécutées ci-dessus (sauf l'utilisation de l'historique auto-généré) de manière automatisée. Toutes les modifications apportées à la branche par défaut seront publiées.

Bravo ! Vous avez mis en place l'infrastructure nécessaire pour publier manuellement les versions de votre design system. Apprenez maintenant à les automatiser grâce à l'intégration continue.

## Mettre en production automatiquement

Nous utilisons GitHub Actions pour l'intégration continue. Mais avant de continuer, nous devons stocker de manière sécurisée les tokens GitHub et NPM de tout à l'heure afin que Actions puisse y accéder.

#### Ajoutez vos tokens à GitHub Secrets

GitHub Secrets nous permet de stocker des informations sensibles dans notre référentiel. Dans une fenêtre du navigateur, ouvrez votre référentiel GitHub.

Cliquez sur l'onglet ⚙️ Settings (Paramètres), puis sur le menu déroulant `Secrets and variables` dans la barre latérale, suivi du lien `Actions`. L'écran suivant apparaît :

![Page vide des secrets GitHub](/design-systems-for-developers/github-empty-secrets-page.png)

Cliquez sur le bouton **New repository secret**. Utilisez `NPM_TOKEN` pour le nom et collez le token que vous avez obtenu de npm plus tôt dans ce chapitre.

![Formulaire GitHub secrets rempli](/design-systems-for-developers/github-secrets-form-filled.png)

Lorsque vous ajoutez le secret npm à votre référentiel, vous pourrez y accéder en via `secrets.NPM_TOKEN`. Vous n'avez pas besoin de définir un autre secret pour votre token GitHub. Tous les utilisateurs de GitHub ont automatiquement un `secrets.GITHUB_TOKEN` associé à leur compte.

#### Automatiser les mises en production avec GitHub Actions

Chaque fois que nous mergeons une Pull Request (PR), nous voulons publier automatiquement le design system. Créez un nouveau fichier appelé `push.yml` dans le même dossier que nous avons utilisé plus tôt pour <a href="https://storybook.js.org/tutorials/design-systems-for-developers/react/en/review/#publish-storybook">publier Storybook</a> et ajoutez le code suivant :

```yml:title=.github/workflows/push.yml
# Name of our action
name: Release

# The event that will trigger the action
on:
  push:
    branches: [main]

# what the action will do
jobs:
  release:
    runs-on: ubuntu-latest
    if: "!contains(github.event.head_commit.message, 'ci skip') && !contains(github.event.head_commit.message, 'skip ci')"
    steps:
      - uses: actions/checkout@v2

      - name: Prepare repository
        run: git fetch --unshallow --tags
      - name: Use Node.js 16.x
        uses: actions/setup-node@v3
        with:
          node-version: 16
      - name: Install dependencies
        uses: bahmutov/npm-install@v1
      - name: Create Release
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          #👇 npm token, see https://storybook.js.org/tutorials/design-systems-for-developers/react/en/distribute/ to obtain it
          NPM_TOKEN: ${{ secrets.NPM_TOKEN }}
        run: |
          yarn release
```

<div class="aside">
Des permissions supplémentaires peuvent être nécessaires pour permettre à GitHub Actions de récupérer le contenu du référentiel et de publier le package dans npm. Consultez <a href="https://docs.github.com/en/actions/using-jobs/assigning-permissions-to-jobs">la documentation de GitHub</a> pour plus d'informations.
</div>

Enregistrez et effectuez un commit de vos modifications vers le dépôt distant.

Bravo ! Désormais, chaque fois que vous mergerez une Pull Request (PR) dans la branche par défaut, une nouvelle version sera automatiquement publiée, en incrémentant le numéro de version comme il se doit grâce aux labels que vous avez ajoutés.

<div class="aside">💡 Nous n'avons pas parcouru toutes les fonctionnalités et intégrations d'Auto qui pourraient être utiles pour les design systems en devenir. Consultez la documentation <a href="https://github.com/intuit/auto">ici</a>.</div>

![Importer le design system](/design-systems-for-developers/design-system-import.png)

## Importer le design system dans une application

Maintenant que notre design system est en ligne, l'installation de la dépendance et l'utilisation des composants de l'interface utilisateur sont simples.

#### Obtenir l'application d'exemple

Plus tôt dans ce tutoriel, nous nous sommes basés sur un ensemble d'outils frontend populaires qui inclut React et Emotion. Cela signifie que notre application d'exemple doit également utiliser React et Emotion pour tirer pleinement parti du design system.

<div class="aside">

💡 Bien que d'autres outils tels que Svelte ou Web Components, permettent de partager des composants UI sans dépendre d'un framework spécifique, nous nous sommes concentrés sur les méthodes les plus couramment utilisées et les plus documentées afin de garantir une prise en main rapide de ce tutoriel.
Soyez assurés que nous explorerons d'autres méthodes dans les prochaines mises à jour.

</div>

L'application d'exemple utilise Storybook pour faciliter le [développement centré sur les composants](https://www.componentdriven.org/), une méthodologie de développement d'applications qui développe des interfaces utilisateur à partir de la base, en commençant par les composants et en terminant par les pages. Nous utiliserons deux Storybooks en parallèle pendant la démonstration : un pour notre application d'exemple et un pour notre design system.

Exécutez les commandes suivantes dans votre ligne de commande pour configurer l'application d'exemple :

```shell:clipboard=false
# Clones the files locally
npx degit chromaui/learnstorybook-design-system-example-app example-app

cd example-app

# Install the dependencies
yarn install

## Start Storybook
yarn storybook
```

Vous devriez voir le Storybook se lancer avec les stories des composants simples utilisés par l'application :

![Storybook initial pour l'application d'exemple](/design-systems-for-developers/example-app-starting-storybook-7-0.png)

<h4>Intégrer le design system</h4>

Nous avons publié le Storybook de notre design system. Ajoutons-le à notre application d'exemple. Nous pouvons le faire en mettant à jour le fichier `.storybook/main.js` de l'application d'exemple avec ce qui suit :

```diff:title=.storybook/main.js
/** @type { import('@storybook/react-vite').StorybookConfig } */
const config = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
  ],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  docs: {
    autodocs: 'tag',
  },
+ refs: {
+   "design-system": {
+     title: 'My design system',
+     //👇 The url provided by Chromatic when it was deployed
+     url: 'https://your-published-url.chromatic.com',
+   },
+ },
};
export default config;
```

<video autoPlay muted playsInline loop>
  <source
    src="/design-systems-for-developers/storybook-composition-7-0.mp4"
    type="video/mp4"
  />
</video>

<div class="aside">
Ajouter le <code>refs</code> qui pointe vers <code>.storybook/main.js</code>, nous permet de <a href="https://storybook.js.org/docs/react/sharing/storybook-composition">créer</a> plusieurs Storybook en un. Cette fonction est utile lorsque l'on travaille sur de gros projets qui nécessitent plusieurs technologies différentes.
</div>

Vous pourrez désormais parcourir les composants du design system et la documentation tout en développant l'application d'exemple. La mise en place du design system pendant le développement de nouvelles fonctionnalités augmente la probabilité que les développeurs réutilisent les composants existants au lieu de perdre du temps à les réinventer.

Nous avons tout ce dont nous avons besoin, il est temps d'ajouter notre design system et de commencer à l'utiliser. Exécutez la commande suivante dans votre terminal :

```shell
yarn add @your-npm-username/learnstorybook-design-system
```

Nous devrons utiliser les mêmes styles globaux définis dans le design system, et donc mettre à jour le fichier de configuration [`.storybook/preview.jsx`](https://storybook.js.org/docs/react/configure/overview#configure-story-rendering) et ajouter un [décorateur global](https://storybook.js.org/docs/react/writing-stories/decorators#global-decorators).

````diff:title=.storybook/main.js
```jsx:title=.storybook/preview.jsx
import { Global } from '@emotion/react';

// The styles imported from the design system.
import { global as designSystemGlobal } from '@your-npm-username/learnstorybook-design-system';

const { GlobalStyle } = designSystemGlobal;

/** @type { import('@storybook/react').Preview } */
const preview = {
  /*
  * Adds a global decorator to include the imported styles from the design system.
  * More on Storybook decorators at:
  * https://storybook.js.org/docs/react/writing-stories/decorators#global-decorators
  */
  decorators: [
    (Story) => (
      <>
        <Global styles={GlobalStyle} />
        <Story />
      </>
    ),
  ],
  /*
  * More on Storybook parameters at:
  * https://storybook.js.org/docs/react/writing-stories/parameters#global-parameters
  */
  parameters: {
    actions: { argTypesRegex: "^on[A-Z].*" },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
  },
};

export default preview;
````

![Le storybook de l'application d'exemple avec les stories du design system](/design-systems-for-developers/example-app-storybook-with-design-system-stories-7-0.png)

Nous utiliserons le composant `Avatar` de notre design system dans le composant `UserItem` de l'application d'exemple. `UserItem` doit restituer des informations d'un utilisateur, notamment son nom et sa photo de profil.

Dans votre éditeur, ouvrez le composant `UserItem` situé dans `src/components/UserItem.js`. Sélectionnez également `UserItem` dans votre Storybook pour voir les changements de code que nous sommes sur le point de faire instantanément avec le rechargement du hot module.

Importez le composant Avatar.

```js:title=src/components/UserItem.jsx
import { Avatar } from '@your-npm-username/learnstorybook-design-system';
```

Nous voulons afficher le composant Avatar à côté du nom d'utilisateur.

```diff:title=src/components/UserItem.jsx
import PropTypes from 'prop-types';

import styled from '@emotion/styled';

+ import { Avatar } from '@your-npm-username/learnstorybook-design-system';


const Container = styled.div`
  background: #eee;

margin-bottom: 1em;

padding: 0.5em;
`;

- const Avatar = styled.img`
-   border: 1px solid black;
-   width: 30px;
-   height: 30px;
-   margin-right: 0.5em;
- `;

const Name = styled.span`

color: #333;

font-size: 16px;
`;

export default ({ user: { name, avatarUrl } }) => (

<Container>
+   <Avatar username={name} src={avatarUrl} />

<Name>{name}</Name>

</Container>
);


UserItem.propTypes = {
  user: PropTypes.shape({
    name: PropTypes.string,
    avatarUrl: PropTypes.string,

}),
};

```

Lors de la sauvegarde, le composant `UserItem` sera mis à jour dans Storybook pour afficher le nouveau composant Avatar. Comme `UserItem` fait partie du composant `UserList`, vous verrez également `Avatar` dans `UserList`.

![L'application d'exemple qui utilise le design system](/design-systems-for-developers/example-app-storybook-using-design-system-7-0.png)

Et voilà ! Vous venez d'importer un composant du design system dans l'application d'exemple. Chaque fois que vous publierez une mise à jour du composant Avatar dans le design system, cette modification sera également répercutée dans l'application d'exemple lorsque vous mettrez à jour le package.

![Partager des design systems](/design-systems-for-developers/design-system-propagation-storybook.png)

## Maîtriser le flux de travail du design system

Le flux de travail du design system commence par le développement de composants d'interface utilisateur dans Storybook et se termine par leur distribution aux applications clientes. Mais ce n'est pas tout. Les design systems doivent évoluer en permanence pour répondre aux exigences toujours changeantes des produits, et notre travail ne fait que commencer.

Le chapitre 8 illustre le flux de travail du design system de bout en bout que nous avons créé dans ce guide. Nous verrons comment les modifications de l'interface utilisateur se répercutent sur le design system.
