---
title: 'Bonus : créer un addon'
tocTitle: "Bonus : création d'addons"
description: "Apprenez à construire vos propres addons qui vous permettront d'optimiser votre développement"
commit: 'ed54b16'
---

Plus tôt, nous avons lancé une fonctionnalité clé du Storybook : le robuste écosystème [addons](https://storybook.js.org/docs/react/configure/storybook-addons). Les addons sont utilisés pour améliorer l'expérience et les workflows des développeurs.

Dans ce chapitre bonus, nous allons voir comment créer notre propre addon. Vous pensez peut-être que l'écrire est une tâche insurmontable, mais en fait, ce n'est pas le cas, nous devons juste prendre quelques étapes pour commencer et nous pourrons commencer à l'écrire.

Mais d'abord, il faut déterminer ce que notre addon va faire.

## L'addon que nous allons écrire

Pour cet exemple, supposons que notre équipe dispose de certaines design assets qui sont d'une manière ou d'une autre, liées aux autres composants existants de l'UI. En examinant l'UI actuelle de Storybook, il semble que cette relation ne soit pas vraiment apparente. Comment pouvons-nous y remédier?

Nous avons notre objectif, maintenant définissons les fonctionnalités que notre addon va prendre en charge:

- Affichage du design assets dans un panneau
- Supportez les images, mais aussi les urls pour l'intégration
- Devrait prendre en charge plusieurs assets, juste au cas où il y aurait plusieurs versions ou thèmes

Nous joindrons la liste des ressources aux story avec [paramètres](https://storybook.js.org/docs/react/writing-stories/parameters#story-parameters), une fonctionnalité de Storybook qui nous permet d'ajouter des métadonnées supplémentaires à nos stories.

```javascript
export default {
  title: 'Your component',
  decorators: [
    /*...*/
  ],
  parameters: {
    assets: ['path/to/your/asset.png'],
  },
  //
};
```

## Configuration

Nous avons décrit ce que notre addon va faire, il est temps de commencer à travailler dessus.

Dans le dossier racine de votre projet, créez un nouveau fichier appelé `.babelrc` avec ce qui suit à l'intérieur :

```json
{
  "presets": [
    [
      "@babel/preset-env",
      {
        "targets": {
          "node": "current"
        }
      }
    ],
    "@babel/preset-react"
  ]
}
```

L'ajout de ce fichier nous permettra d'utiliser les préréglages et les options corrects pour l'addon que nous allons développer.

Ensuite, dans votre dossier `.storybook`, créez un nouveau dossier appelé `design-addon` et à l'intérieur de celui-ci, un nouveau fichier appelé `register.js`.

Et c'est tout! Nous sommes prêts à commencer le développement de notre addon.

<div class="aside">Nous allons utiliser le dossier <code>.storybook</code> comme emplacement pour notre addon. La raison en est de maintenir une approche simple et d'éviter de trop le compliquer. Si cet addon devait être transformé en un véritable addon, il serait préférable de le déplacer dans un paquet séparé avec sa propre structure de fichiers et de dossiers.</div>

## Écrire l'addon

Ajoutez les éléments suivants à votre dossier récemment créé:

```javascript
//.storybook/design-addon/register.js

import React from 'react';
import { AddonPanel } from '@storybook/components';
import { addons, types } from '@storybook/addons';

addons.register('my/design-addon', () => {
  addons.add('design-addon/panel', {
    title: 'assets',
    type: types.PANEL,
    render: ({ active, key }) => (
      <AddonPanel active={active} key={key}>
        implement
      </AddonPanel>
    ),
  });
});
```

C'est le code typique pour vous aider à démarrer. Nous allons voir ce que fait le code :

- Nous enregistrons un nouvel addon dans notre Storybook.
- Ajoutez un nouvel élément UI pour notre addon avec quelques options (un titre qui définira notre addon et le type d'élément utilisé) et rendez le avec du texte pour l'instant.

Si nous démarrons Storybook à ce stade, nous ne pourrons pas encore voir l'addon. Comme nous l'avons fait précédemment avec l'addon Controls, nous devons enregistrer la nôtre dans le fichier `.storybook/main.js`. Il suffit d'ajouter ce qui suit à la liste des `addons` déjà existants :

```js
// .storybook/main.js

module.exports = {
  stories: ['../src/components/**/*.stories.js'],
  addons: [
    // same as before
    './design-addon/register.js', // our addon
  ],
};
```

![addon de design assets fonctionnant dans Storybook](/intro-to-storybook/create-addon-design-assets-added.png)

Succès! Nous avons ajouté notre nouvel addon à l'UI de Storybook.

<div class="aside">Storybook vous permet d'ajouter non seulement des panneaux, mais aussi toute une série de types de composants d'UI différents. Et la plupart, sinon tous, sont déjà créés dans le paquet @storybook/components, afin que vous ne perdiez pas trop de temps à implémenter l'UI et que vous vous concentriez sur l'écriture de fonctionnalités.</div>

### Création du composant contenu

Nous avons atteint notre premier objectif. Il est temps de commencer à travailler sur le second.

Pour le mener à bien, nous devons apporter quelques modifications à nos imports et introduire un nouveau composant qui affichera les informations sur les assets.

Apportez les modifications suivantes au fichier addon:

```javascript
//.storybook/design-addon/register.js

import React, { Fragment } from 'react';
/* same as before */
import { useParameter } from '@storybook/api';

const Content = () => {
  const results = useParameter('assets', []); // story's parameter being retrieved here
  return (
    <Fragment>
      {results.length ? (
        <ol>
          {results.map(i => (
            <li>{i}</li>
          ))}
        </ol>
      ) : null}
    </Fragment>
  );
};
```

Nous avons créé le composant, modifié les imports, tout ce qui manque c'est de connecter le composant à notre panel et nous aurons un addon fonctionnel capable d'afficher des informations relatives à nos story.

Votre code devrait ressembler à ce qui suit:

```javascript
//.storybook/design-addon/register.js

import React, { Fragment } from 'react';
import { AddonPanel } from '@storybook/components';
import { useParameter } from '@storybook/api';
import { addons, types } from '@storybook/addons';

const Content = () => {
  const results = useParameter('assets', []); // story's parameter being retrieved here
  return (
    <Fragment>
      {results.length ? (
        <ol>
          {results.map(i => (
            <li>{i}</li>
          ))}
        </ol>
      ) : null}
    </Fragment>
  );
};

addons.register('my/design-addon', () => {
  addons.add('design-addon/panel', {
    title: 'assets',
    type: types.PANEL,
    render: ({ active, key }) => (
      <AddonPanel active={active} key={key}>
        <Content />
      </AddonPanel>
    ),
  });
});
```

Remarquez que nous utilisons le [useParameter](https://storybook.js.org/docs/react/addons/addons-api#useparameter), ce hook pratique nous permettra de lire les informations fournies par l'option `paramètres` pour chaque story, qui dans notre cas sera soit un chemin unique vers un assets, soit une liste de chemins. Vous le verrez bientôt entrer en vigueur.

### Utiliser notre addon avec un story

Nous avons connecté toutes les pièces nécessaires. Mais comment pouvons-nous voir si cela fonctionne et affiche quelque chose?

Pour ce faire, nous allons apporter une petite modification au fichier `Task.stories.js` et ajouter l'option [parameters](https://storybook.js.org/docs/react/writing-stories/parameters).

```javascript
// src/components/Task.stories.js

export default {
  component: Task,
  title: 'Task',
  parameters: {
    assets: [
      'path/to/your/asset.png',
      'path/to/another/asset.png',
      'path/to/yet/another/asset.png',
    ],
  },
  argTypes: {
    /* ...actionsData, */
    backgroundColor: { control: 'color' },
  },
};
/* comme avant  */
```

Allez-y, redémarrez votre Storybook et sélectionnez le story Task, vous devriez voir quelque chose comme ceci :

![story de Storybook montrant le contenu avec l'addon design assets](/intro-to-storybook/create-addon-design-assets-inside-story.png)

### Afficher du contenu dans notre addon

À ce stade, nous pouvons voir que l'addon fonctionne comme il le devrait, mais maintenant changeons le composant `Contenu` pour afficher réellement ce que nous voulons:

```javascript
//.storybook/design-addon/register.js

import React, { Fragment } from 'react';
import { AddonPanel } from '@storybook/components';
import { useParameter, useStorybookState } from '@storybook/api';
import { addons, types } from '@storybook/addons';
import { styled } from '@storybook/theming';

const getUrl = input => {
  return typeof input === 'string' ? input : input.url;
};

const Iframe = styled.iframe({
  width: '100%',
  height: '100%',
  border: '0 none',
});
const Img = styled.img({
  width: '100%',
  height: '100%',
  border: '0 none',
  objectFit: 'contain',
});

const Asset = ({ url }) => {
  if (!url) {
    return null;
  }
  if (url.match(/\.(png|gif|jpeg|tiff|svg|anpg|webp)/)) {
    // do image viewer
    return <Img alt="" src={url} />;
  }

  return <Iframe title={url} src={url} />;
};

const Content = () => {
  // story's parameter being retrieved here
  const results = useParameter('assets', []);
  // the id of story retrieved from Storybook global state
  const { storyId } = useStorybookState();

  if (results.length === 0) {
    return null;
  }

  const url = getUrl(results[0]).replace('{id}', storyId);

  return (
    <Fragment>
      <Asset url={url} />
    </Fragment>
  );
};
```

Si vous regardez de plus près, vous verrez que nous utilisons le tag `style`, ce tag vient du paquet `@storybook/theming`. L'utilisation de cette balise nous permettra de personnaliser non seulement le thème de Storybook mais aussi l'UI en fonction de nos besoins. De plus, [`useStorybookState`](https://storybook.js.org/docs/react/addons/addons-api#usestorybookstate), qui est un hook très pratique, nous permet d'accéder à l'état interne de Storybook afin de récupérer n'importe quelle information présente. Dans notre cas, nous l'utilisons pour récupérer uniquement l'id de chaque story créé.

### Affichage des assets réels

Pour voir réellement les ressources affichées dans notre addon, nous devons les copier dans le dossier `public` et ajuster l'option `parameters` du story pour refléter ces changements.

Le Storybook prendra en compte ces changements et chargera les ressources, mais pour l'instant, seulement la première.

![assets réels chargés](/intro-to-storybook/design-assets-image-loaded.png)

## Addons stateful

Revenir sur nos objectifs initiaux :

- ✔️ Afficher le design asset dans un panneau
- ✔️ Images de soutien, mais aussi urls pour l'intégration
- ❌ Devrait prendre en charge plusieurs assets, juste au cas où il y aurait plusieurs versions ou thèmes

Nous y sommes presque, il ne reste plus qu'un but à atteindre.

Pour le dernier, nous allons avoir besoin d'une sorte d'état, nous pourrions utiliser le hook `useState` de React, ou si nous travaillions avec des composants de classe `this.setState()`. Mais à la place, nous allons utiliser le [`useStorybookState`](https://storybook.js.org/docs/react/addons/addons-api#usestorybookstate) de Storybook, qui nous donne un moyen de persister l'état de l'addon, et d'éviter de créer une logique supplémentaire pour persister l'état local. Nous utiliserons également un autre élément de l'UI de Storybook, l'`ActionBar`, qui nous permettra de passer d'un élément à l'autre.

Nous devons adapter nos imports à nos besoins :

```javascript
//.storybook/design-addon/register.js

import { useParameter, useStorybookState, useAddonState } from '@storybook/api';
import { AddonPanel, ActionBar } from '@storybook/components';
/* same as before */
```

Et modifier notre composant `Content`, afin que nous puissions passer d'un asset à l'autre:

```javascript
//.storybook/design-addon/register.js

const Content = () => {
  // story's parameter being retrieved here
  const results = useParameter('assets', []);
  // addon state being persisted here
  const [selected, setSelected] = useAddonState('my/design-addon', 0);
  // the id of the story retrieved from Storybook global state
  const { storyId } = useStorybookState();

  if (results.length === 0) {
    return null;
  }

  if (results.length && !results[selected]) {
    setSelected(0);
    return null;
  }

  const url = getUrl(results[selected]).replace('{id}', storyId);
  return (
    <Fragment>
      <Asset url={url} />
      {results.length > 1 ? (
        <ActionBar
          actionItems={results.map((i, index) => ({
            title: typeof i === 'string' ? `asset #${index + 1}` : i.name,
            onClick: () => setSelected(index),
          }))}
        />
      ) : null}
    </Fragment>
  );
};
```

## Addon construit

Nous avons accompli ce que nous nous étions fixé comme objectif, à savoir créer un addon Storybook pleinement fonctionnel qui affiche les design assets liés aux composants de l'UI.

<details>
  <summary>Cliquez pour étendre et voir le code complet utilisé dans cet exemple</summary>

```javascript
// .storybook/design-addon/register.js

import React, { Fragment } from 'react';

import { useParameter, useStorybookState, useAddonState } from '@storybook/api';
import { addons, types } from '@storybook/addons';
import { AddonPanel, ActionBar } from '@storybook/components';
import { styled } from '@storybook/theming';

const getUrl = input => {
  return typeof input === 'string' ? input : input.url;
};

const Iframe = styled.iframe({
  width: '100%',
  height: '100%',
  border: '0 none',
});
const Img = styled.img({
  width: '100%',
  height: '100%',
  border: '0 none',
  objectFit: 'contain',
});

const Asset = ({ url }) => {
  if (!url) {
    return null;
  }
  if (url.match(/\.(png|gif|jpeg|tiff|svg|anpg|webp)/)) {
    return <Img alt="" src={url} />;
  }

  return <Iframe title={url} src={url} />;
};

const Content = () => {
  const results = useParameter('assets', []); // story's parameter being retrieved here
  const [selected, setSelected] = useAddonState('my/design-addon', 0); // addon state being persisted here
  const { storyId } = useStorybookState(); // the story«s unique identifier being retrieved from Storybook global state

  if (results.length === 0) {
    return null;
  }

  if (results.length && !results[selected]) {
    setSelected(0);
    return null;
  }

  const url = getUrl(results[selected]).replace('{id}', storyId);

  return (
    <Fragment>
      <Asset url={url} />
      {results.length > 1 ? (
        <ActionBar
          actionItems={results.map((i, index) => ({
            title: typeof i === 'string' ? `asset #${index + 1}` : i.name,
            onClick: () => setSelected(index),
          }))}
        />
      ) : null}
    </Fragment>
  );
};

addons.register('my/design-addon', () => {
  addons.add('design-addon/panel', {
    title: 'assets',
    type: types.PANEL,
    render: ({ active, key }) => (
      <AddonPanel active={active} key={key}>
        <Content />
      </AddonPanel>
    ),
  });
});
```

</details>

## Prochaines étapes

La prochaine étape logique pour notre addon, serait d'en faire son propre paquet et de permettre sa distribution avec votre équipe et éventuellement avec le reste de la communauté.

Mais cela dépasse le cadre de ce tutoriel. Cet exemple montre comment vous pouvez utiliser l'API de Storybook pour créer votre propre addon personnalisé afin d'améliorer encore votre workflow de développement.

Apprenez à personnaliser davantage votre addon :

- [ajouter des boutons dans la barre d'outils Storybook](https://github.com/storybookjs/storybook/blob/next/addons/viewport/src/register.tsx#L8-L15)
- [communiquer par le biais du canal avec l'iframe](https://github.com/storybookjs/storybook/blob/next/dev-kits/addon-roundtrip/README.md)
- [envoyer les commandes et les résultats](https://github.com/storybookjs/storybook/tree/next/addons/events)
- [effectuer une analyse sur le html/css produit par votre composant](https://github.com/storybookjs/storybook/tree/next/addons/a11y)
- [envelopper les composants, refaire le rendu avec de nouvelles données](https://github.com/storybookjs/storybook/tree/next/addons/knobs)
- [provoquer les événements DOM, faire des changements DOM](https://github.com/storybookjs/storybook/tree/next/addons/events)
- [effectuer des tests](https://github.com/storybookjs/storybook/tree/next/addons/jest)

Et bien plus encore !

<div class="aside">Si vous créez un nouvel addon et que vous souhaitez le faire figurer, n'hésitez pas à ouvrir un PR dans la documentation du Storybook pour le faire figurer.</div>

### Dev kits(Kits de développement)

Pour vous aider à démarrer le développement de l'addon, l'équipe de Storybook a mis au point des `dev-kits`.

Ces paquets sont des kits de démarrage pour vous aider à commencer à construire vos propres addons.
L'addon que nous venons de créer est basé sur un de ces starter-sets, plus précisément le dev-kit `addon-parameters`.

Vous pouvez trouver celui-ci et d'autres ici :
https://github.com/storybookjs/storybook/tree/next/dev-kits

D'autres kits de développement seront disponibles à l'avenir.

## Partager les addons avec l'équipe

Les addons sont des ajouts qui vous font gagner du temps, mais il peut être difficile pour les coéquipiers non techniques et les examinateurs de tirer parti de leurs fonctionnalités. Vous ne pouvez pas garantir que les gens utiliseront Storybook sur leur machine locale. C'est pourquoi il peut être très utile de déployer votre Storybook sur un site en ligne où chacun pourra s'y référer. C'est ce que nous allons faire dans le prochain chapitre!
