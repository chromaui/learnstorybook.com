---
title: 'Documenter pour les utilisateurs'
tocTitle: 'Documentation'
description: 'Faciliter la prise en main du design system grâce à la documentation'
commit: '4af4d77'
---

Les [équipes](https://medium.com/@didoo/measuring-the-impact-of-a-design-system-7f925af090f7) [frontend](https://segment.com/blog/driving-adoption-of-a-design-system/) [professionnelles](https://product.hubspot.com/blog/how-to-gain-widespread-adoption-of-your-design-system) mesurent le succès d'un design system par sa prise en main. Pour bénéficier pleinement des avantages d'un design system en termes d'économie de travail, les composants doivent être largement diffusés. Sinon, quel est l'intérêt ?

Dans ce chapitre, nous allons créer un « manuel d'utilisateur » du design system pour aider les utilisateurs à réutiliser les composants dans leurs applications. En cours de route, nous découvrirons les meilleures pratiques en matière de documentation de l'interface utilisateur utilisées par les équipes de Shopify, Microsoft, Auth0 et le gouvernement britannique.

![Générer automatiquement une documentation avec Storybook](/design-systems-for-developers/design-system-generate-docs.jpg)

## La documentation, c'est épuisant

C'est évident : la documentation est inestimable pour le développement collaboratif de l'interface utilisateur. Elle aide les équipes à apprendre comment et quand utiliser les composants communs de l'interface utilisateur. Mais pourquoi cela demande-t-il tant d'efforts ?

Si vous avez déjà créé une documentation, vous avez probablement consacré du temps à des tâches non liées à de la documentation, telles que l'infrastructure du site ou la gestion des rédacteurs techniques. Et même si vous trouvez le temps de publier une documentation, il est épuisant de la maintenir tout en développant de nouvelles fonctionnalités.

**La plupart des documentations sont datées au moment même où elles sont créées.** Les documentations datées diminuent la confiance dans les composants du design system, ce qui incite les développeurs à créer de nouveaux composants au lieu de réutiliser ceux qui existent déjà.

## Prérequis

La création et la mise à jour de la documentation peuvent s'avérer difficiles, c'est pourquoi il est important de minimiser les obstacles. Voici ce qu'il faudrait faire :

- **🔄 Rester à jour** en utilisant le code de production le plus récent
- **✍️ Faciliter l'écriture** en utilisant des outils d'écriture familiers comme Markdown
- **⚡️ Réduire le temps de maintenance** pour que les équipes puissent se concentrer sur l'écriture
- **📐Fournir des modèles standards** pour que les développeurs ne réécrivent pas les modèles communs.
- **🎨 Offrir des possibilités de personnalisation** pour les cas d'utilisation et les composants particulièrement complexes.

En tant qu'utilisateurs de Storybook, nous avons une longueur d'avance car les variations des composants sont déjà enregistrées sous forme de stories : c'est une forme de documentation en soi. Une story montre comment un composant est censé fonctionner en fonction de différents inputs (propriétés).
Les stories sont faciles à écrire et se mettent à jour automatiquement car elles utilisent les composants de production.
De plus, les stories peuvent être testées par régression à l'aide des outils du chapitre précédent !

> Lorsque vous écrivez des stories, vous obtenez gratuitement de la documentation sur les composants ainsi que des exemples d'utilisation ! - Justin Bennett, ingénieur chez Artsy

## Rédiger des stories, générer une documentation

Avec l'addon Storybook Docs, nous pouvons générer une documentation riche à partir de stories existantes afin de réduire le temps de maintenance et d'obtenir des valeurs par défaut prêtes à l'emploi.
Comme les addons que nous avons couverts dans le chapitre [build](/design-systems-for-developers/react/fr/build/) (Controls et Actions), l'addon Docs est aussi inclus et configuré avec chaque installation de Storybook, ce qui nous permet de nous concentrer sur l'écriture d'une bonne documentation.

Chaque fois que vous ouvrez votre Storybook, vous devriez voir une nouvelle entrée ajoutée à la barre latérale nommée « Docs » :

![Onglet Docs dans Storybook](/design-systems-for-developers/storybook-docs-7-0.png)

En parallèle, Storybook a rempli la barre latérale avec une entrée « Docs » pour chaque composant de la story qui a été configurée via la propriété de métadonnées [`tags`](https://storybook.js.org/docs/react/writing-docs/autodocs), créant une page de documentation auto-générée avec les éléments les plus fréquemment utilisés comme les aperçus interactifs, les visionneurs de code source, et une tableau d'arguments (args). Vous trouverez des caractéristiques similaires dans la documentation du design system de Shopify et d'Auth0. Le tout en moins de 2 minutes.

## Générer la documentation

Jusqu'à présent, nous avons bien avancé sans trop d'efforts, en veillant à ce que notre design system reste à jour du point de vue du code. Pourtant, la documentation manque encore d'une touche _humaine_. Nous devons la configurer et donner aux autres développeurs plus de contexte (pourquoi, quand et comment). Commencez par ajouter une propriété `tags` à la story du composant `Avatar` dans `src/Avatar/Avatar.stories.jsx` :

```diff:title=src/Avatar/Avatar.stories.jsx
import { Avatar } from './Avatar';

export default {
  title: 'Design System/Avatar',
  component: Avatar,
+ tags: ['autodocs'],
  /*
   * More on Storybook argTypes at:
   * https://storybook.js.org/docs/react/api/argtypes
   */
  argTypes: {
    size: {
      control: {
        type: 'select',
      },
      options: ['tiny', 'small', 'medium', 'large'],
    },
  },
};
```

Ensuite, ajoutons quelques métadonnées supplémentaires qui expliquent ce que fait le composant. Dans notre cas, nous ajouterons un sous-titre décrivant l'utilisation du composant Avatar :

```diff:title=src/Avatar/Avatar.stories.jsx
import { Avatar } from './Avatar';

export default {
  title: 'Design System/Avatar',
  component: Avatar,
  tags: ['autodocs'],
+ parameters: {
+   docs: {
+      subtitle: 'Displays an image that represents a user or organization',
+    },
+ },
  /*
   * More on Storybook argTypes at:
   * https://storybook.js.org/docs/react/api/argtypes
   */
  argTypes: {
    size: {
      control: {
        type: 'select',
      },
      options: ['tiny', 'small', 'medium', 'large'],
    },
  },
};
```

Vous devriez maintenant avoir la documentation minimale pour le composant Avatar, générée automatiquement par la partie args de Storybook et les valeurs par défaut obtenues avec les `propTypes` du composant et [JSdoc](https://jsdoc.app/), ce qui constitue la première étape pour réduire le temps de maintenance et s'assurer que la documentation reste à jour.

Cependant, nous n'avons pas encore terminé. Étant donné que nous élaborons de la documentation pour d'autres types utilisateurs, y compris des personnes non techniques comme les designers ou utilisateurs du design system, nous ne pouvons pas supposer qu'elles savent ce que chaque story représente. Ajoutons un texte descriptif pour les stories dans `src/Avatar/Avatar.stories.jsx` :

```jsx:title=src/Avatar/Avatar.stories.jsx
import { Avatar } from './Avatar';

export default {
  title: 'Design System/Avatar',
  component: Avatar,
  tags: ['autodocs'],
  parameters: {
    componentSubtitle:
      'Displays an image that represents a user or organization',
  },
  /*
   * More on Storybook argTypes at:
   * https://storybook.js.org/docs/react/api/argtypes
   */
  argTypes: {
    size: {
      control: {
        type: 'select',
      },
      options: ['tiny', 'small', 'medium', 'large'],
    },
  },
};

export const Standard = {
  args: {
    size: 'large',
    username: 'Tom Coleman',
    src: 'https://avatars2.githubusercontent.com/u/132554',
  },
};

/**
 * 4 sizes are supported.
 */
export const Sizes = {
  args: {
    username: 'Tom Coleman',
    src: 'https://avatars2.githubusercontent.com/u/132554',
  },
  render: (args) => (
    <>
      <Avatar {...args} size='large' />
      <Avatar {...args} size='medium' />
      <Avatar {...args} size='small' />
      <Avatar {...args} size='tiny' />
    </>
  ),
};

/**
 * Shows the user's initials as a fallback when no image is provided.
 */
export const Initials = {
  render: (args) => (
    <>
      <Avatar username='Tom Coleman' />
      <Avatar username='Dominic Nguyen' />
      <Avatar username='Varun Vachhar' />
      <Avatar username='Michael Shilman' />
    </>
  ),
};

/**
 * Shows a loading indicator.
 */
export const Loading = {
  args: {
    loading: true,
  },
  render: (args) => (
    <>
      <Avatar {...args} size='large' />
      <Avatar {...args} size='medium' />
      <Avatar {...args} size='small' />
      <Avatar {...args} size='tiny' />
    </>
  ),
};

/**
 * Shows the user's avatar when provided with a `src` prop or in various states and sizes.
 */
export const Large = {
  render: () => (
    <>
      <Avatar loading size='large' />
      <Avatar size='large' username='Tom Coleman' />
      <Avatar
        size='large'
        username='Tom Coleman'
        src='https://avatars2.githubusercontent.com/u/132554'
      />
    </>
  ),
};

/**
 * Avatar component using Controls
 */
export const Controls = {
  args: {
    loading: false,
    size: 'tiny',
    username: 'Dominic Nguyen',
    src: 'https://avatars.githubusercontent.com/u/263385',
  },
};
```

Vous devriez à présent voir ceci :

<video autoPlay muted playsInline loop>
  <source
    src="/design-systems-for-developers/storybook-docspage-expanded-7-0.mp4"
    type="video/mp4"
  />
</video>

#### Optimiser la documentation avec Markdown/MDX

Chaque composant a des exigences uniques en matière de documentation, ce qui peut s'avérer difficile à gérer. Nous avons utilisé la fonction de documentation automatique de Storybook avec l'addon Docs pour simplifier ce processus. Cela nous a permis de créer une documentation complète tout en adhérant aux meilleures pratiques, sans encourir de dépenses supplémentaires. À l'avenir, nous pourrons encore améliorer notre processus de documentation en identifiant tous les défis ou problèmes potentiels qui peuvent survenir lorsque nous travaillons avec nos composants.

Markdown est un format simple pour écrire du texte. MDX vous permet d'utiliser du code interactif (JSX) dans Markdown. Storybook Docs utilise MDX pour donner aux développeurs un contrôle ultime sur le rendu de la documentation.

Lors de l'installation de Storybook, les fichiers MDX sont enregistrés par défaut. Votre fichier `.storybook/main.js` devrait ressembler à ceci :

```js:title=.storybook/main.js
/** @type { import('@storybook/react-vite').StorybookConfig } */
const config = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
    '@storybook/addon-a11y',
    '@storybook/addon-coverage',
  ],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  docs: {
    autodocs: 'tag',
  },
};
export default config;

```

Créez un nouveau fichier `src/Avatar/Avatar.mdx` et fournissez quelques détails. Nous allons supprimer les `tags` et les `parameters` du fichier `Avatar.stories.jsx` et recréer notre documentation dans le fichier mdx.

<!-- prettier-ignore-start -->

```mdx:title=src/Avatar/Avatar.mdx
import {
  Canvas,
  Controls,
  Description,
  Meta,
  Subtitle,
  Story,
} from '@storybook/blocks';

import * as AvatarStories from './Avatar.stories';

# Avatar

<Meta of={AvatarStories} />

<Subtitle>Displays an image that represents a user or organization</Subtitle>

Use an avatar for attributing actions or content to specific users.

The user's name should _always_ be present when using Avatar – either printed beside the avatar or in a tooltip.

<Canvas>
  <Story of={AvatarStories.Standard} />
</Canvas>

## Additional variants

### Sizes

<Description of={AvatarStories.Sizes} />

<Story of={AvatarStories.Sizes} />

### Initials

<Description of={AvatarStories.Initials} />

<Story of={AvatarStories.Initials} />

### Loading

<Description of={AvatarStories.Loading} />

<Story of={AvatarStories.Loading} />

### Playground

Interact with the component and see how it responds to the different input properties.

<Canvas>
  <Story of={AvatarStories.Controls} />
</Canvas>

<Controls of={AvatarStories.Controls} />
```

<!-- prettier-ignore-end -->

Dans Storybook, l'entrée « Docs » de votre composant Avatar devrait être remplacée par notre page MDX.

![Documentation MDX pour Storybook](/design-systems-for-developers/storybook-docs-mdx-docblocks-7-0.png)

Storybook Docs est livré avec [« Doc Blocks »](https://storybook.js.org/docs/react/writing-docs/doc-blocks), des composants prêts à l'emploi tels que les[aperçus interactifs](https://storybook.js.org/docs/react/api/doc-block-canvas), [l'iconographie](https://storybook.js.org/docs/react/api/doc-block-icongallery), et bien d'autres. Par défaut, ils sont utilisés en parallèle pour les pages de documentation générées automatiquement, mais ils peuvent également être extraits pour un usage individuel. Notre objectif est de personnaliser la documentation du composant Avatar sans tout refaire nous-même, donc nous réutiliserons les Doc Blocks dans la mesure du possible.

Ajoutons le Doc Block [`ArgTypes`](https://storybook.js.org/docs/react/api/doc-block-argtypes) à notre fichier MDX. Il génère automatiquement un tableau avec toutes les propriétés du composant et ses types.

<!-- prettier-ignore-start -->

```diff:title=src/Avatar/Avatar.mdx
import {
+ ArgTypes,
  Canvas,
  Controls,
  Description,
  Meta,
  Subtitle,
  Story,
} from '@storybook/blocks';

{/* Same content as before */}

<Canvas>
  <Story of={AvatarStories.Standard} />
</Canvas>

+ <ArgTypes of={AvatarStories} />
```

<!-- prettier-ignore-end -->

![Storybook docs from MDX with blocks](/design-systems-for-developers/storybook-docs-mdx-argtypes-block.png)

Super ! Nous sommes revenus au point de départ, mais avec un contrôle total sur les commandes et le contenu. Les avantages de la génération de documentation automatique persistent parce que nous utilisons Doc Blocks.

Personnalisez la documentation du composant Avatar avec une note sur les cas d'utilisation. On explique aux développeurs comment utiliser pleinement ce composant. Nous pouvons simplement ajouter du markdown comme nous le ferions dans n'importe quel autre document markdown :

<!-- prettier-ignore-start -->

```diff:title=src/Avatar/Avatar.mdx
{/* Same content as before */}

<Canvas>
  <Story of={AvatarStories.Standard} />
</Canvas>

<ArgTypes of={AvatarStories} />

+ ## Usage

+ Avatar is used to represent a person or an organization. By default the avatar shows an image and gracefully falls back to the first initial of the username. While hydrating the component you may find it useful to render a skeleton template to indicate that Avatar is awaiting data. Avatars can be grouped with the AvatarList component.

{/* Same content as before */}
```

<!-- prettier-ignore-end -->

![Storybook docs pour MDX avec des informations sur l'utilisation](/design-systems-for-developers/storybook-docs-mdx-usage-7-0.png)

#### Pages personnalisées

Chaque design system est accompagné d'une page de couverture.
Storybook Docs vous permet de créer des pages distinctes en utilisant MDX.

Créer un nouveau fichier `src/Intro.mdx` :

<!-- prettier-ignore-start -->

```mdx:title=src/Intro.stories.mdx
import { Meta } from '@storybook/blocks';

<Meta title='Design System/Introduction' />

# Introduction to the Storybook design system tutorial

The Storybook design system tutorial is a subset of the full [Storybook design system](https://github.com/storybookjs/design-system/), created as a learning resource for those interested in learning how to write and publish a design system using best practice techniques.

Learn more in the [Storybook tutorials](https://storybook.js.org/tutorials/)

```

<!-- prettier-ignore-end -->

La page de couverture que nous avons créée ici est un exemple de [« documentation non jointe »](https://storybook.js.org/docs/react/writing-docs/mdx#writing-unattached-documentation) qui apparaît différemment dans la barre latérale par rapport aux autres pages de documentation générées automatiquement.

![Documentation Storybook avec une page d'introduction non classée](/design-systems-for-developers/storybook-docs-introduction-unsorted-7-0.png)

Pour que la documentation apparaisse en premier, nous devons dire à Storybook de charger le fichier Introduction dans `.storybook/main.js` :

```diff:title=.storybook/main.js
/** @type { import('@storybook/react-vite').StorybookConfig } */
const config = {
  stories: [
+   '../src/Intro.mdx',
    '../src/**/*.mdx',
    '../src/**/*.stories.@(js|jsx|ts|tsx)',
  ],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
    '@storybook/addon-a11y',
    '@storybook/addon-coverage',
  ],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  docs: {
    autodocs: 'tag',
  },
};
export default config;
```

![Documentation Storybook avec une page d'introduction](/design-systems-for-developers/storybook-docs-introduction-7-0.png)

## Publier la documentation en ligne

Si vous rédigez une documentation que personne ne lit, est-ce utile ? Non. Il ne suffit pas uniquement de créer du contenu d'apprentissage de grande qualité, nous devons faire connaître ce contenu aux utilisateurs et aux collègues. Pour l'instant, notre documentation est cachée dans le dépôt, ce qui signifie que les utilisateurs doivent exécuter Storybook localement pour la voir.

Dans le chapitre précédent, nous avons publié le Storybook en ligne pour une relecture visuelle. Il est simple d'utiliser le même système pour publier notre documentation de composants. Ajoutons un nouveau script au `package.json` pour builder notre Storybook en mode documentation :

```json:clipboard=false
{
  "scripts": {
    "build-storybook-docs": "storybook build  --docs"
  }
}
```

Enregistrez et effectuez un commit.

Lancer `build-storybook-docs` dans votre ligne de commande ou votre outil d'intégration continue produira un site statique dans la configuration « docs ». Mettez en place un outil de déploiement de sites statiques tel que [Netlify](https://www.netlify.com/) ou [Vercel](https://vercel.com/) pour déployer le site de documentation à chaque nouveau commit.

<div class="aside">💡 Au fur et à mesure que votre design system se développe, vous pouvez être confronté aux exigences spécifiques de votre organisation qui justifient l'utilisation d'outils personnalisés ou même la création de votre propre site statique à l'aide d'outils tels que Gatsby ou Next. Il est facile de porter markdown et MDX vers d'autres solutions.
</div>

## Importer le design system dans d'autres applications

Jusqu'à présent, nous nous sommes concentrés sur l'aspect interne. Tout d'abord, en créant des composants d'interface utilisateur durables. Ensuite, en les examinant, les testant et les documentant. Nous allons maintenant nous tourner vers l'extérieur pour examiner la manière dont les équipes utilisent les design system.

Le chapitre 7 traite de la transformation du design system sous forme de paquet en vue de son utilisation dans d'autres applications. Apprenez à combiner npm, le gestionnaire de paquets JavaScript, avec Auto, un outil de gestion des versions qui permet de gagner du temps.
