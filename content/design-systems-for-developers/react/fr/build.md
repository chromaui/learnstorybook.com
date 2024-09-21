---
title: "Construire les composants de l'interface utilisateur"
tocTitle: 'Construction'
description: 'Configurer Storybook pour construire et classer les composants du design system'
commit: 'c5f4c8d'
---

Dans ce chapitre 3, nous mettrons en place les outils essentiels au design system en commençant par Storybook, l'outil de visualisation de composants le plus populaire. L'objectif de ce guide est de vous montrer comment les équipes professionnelles construisent des design systems. Nous nous concentrerons donc sur des détails plus précis comme la qualité du code, les modules complémentaires (addons) Storybook qui permettent de gagner du temps, et la structure des dossiers.

![La place de Storybook](/design-systems-for-developers/design-system-framework-storybook.jpg)

## Formatage et linting pour l'hygiène du code

Les design systems étant collaboratifs, les outils qui corrigent la syntaxe et normalisent le formatage permettent d'améliorer la qualité des contributions. Garantir une cohérence du code à l'aide d'outils est beaucoup moins laborieuse que de corriger le code à la main, ce qui est un avantage pour l'auteur du design system qui sait comment s'y prendre.

Dans ce tutoriel, nous utiliserons [VSCode](https://code.visualstudio.com/) comme éditeur de code, mais vous pouvez appliquer les mêmes principes à d'autres éditeurs modernes comme [Atom](https://atom.io/), [Sublime](https://www.sublimetext.com/), ou [IntelliJ](https://www.jetbrains.com/idea/).

Pour garantir un style de code cohérent, nous utiliserons [Prettier] (https://prettier.io/). Ce formateur de code est largement utilisé et prend en charge plusieurs langages. Il s'intègre parfaitement à la plupart des éditeurs, y compris celui que nous utilisons, et était inclus dans le modèle que nous avons clôné plus haut dans ce guide lorsque nous avons initialisé notre design system. Si vous utilisez Prettier pour la première fois, vous devrez peut-être le configurer pour votre éditeur. Avec VSCode, installez l'extension Prettier.

![Prettier pour VSCode](/design-systems-for-developers/prettier-addon.png)

Activez le format de sauvegarde `editor.formatOnSave` si vous ne l'avez pas déjà fait. Une fois que vous avez installé Prettier, vous devriez constater qu'il formate automatiquement votre code chaque fois que vous enregistrez un fichier.

## Installer Storybook

Storybook est [l'outil de visualisation de composants](https://www.chromatic.com/blog/ui-component-explorers---your-new-favorite-tool) standard de l'industrie pour développer des composants UI en isolation. Puisque les design systems se concentrent sur les composants UI, Storybook est l'outil idéal pour ce cas d'utilisation. Nous nous appuierons sur les caractéristiques suivantes :

- 📕Cataloguer les composants de l'interface utilisateur
- 📄Enregistrer les variations de composants sous forme de stories
- ⚡️Utiliser un outil pour l'expérience développeur comme Hot Module Reloading
- 🛠Prendre en charge de nombreuses couches de visualisation, y compris React

Installez et lancez Storybook avec les commandes suivantes :

```shell:clipboard=false
# Installs Storybook
npx storybook@latest init

# Starts Storybook in development mode
yarn storybook
```

Vous devriez voir ceci :

![Interface de démarrage de Storybook](/design-systems-for-developers/storybook-initial-7-0.png)

Bien, nous avons mis en place notre outil de visualisation de composants !

Chaque fois que vous installez Storybook dans une application, il ajoute des exemples dans le dossier `stories`. Si vous le souhaitez, prenez le temps de les explorer. Mais nous n'en aurons pas besoin pour notre design system, il vaut donc mieux supprimer le dossier `stories`.

Votre Storybook devrait maintenant ressembler à ceci (vous voyez que les styles de police sont un peu différents, par exemple la story « Avatar : Initials ») :

<video autoPlay muted playsInline loop>
  <source
    src="/design-systems-for-developers/storybook-initial-stories-without-styles-7-0.mp4"
    type="video/mp4"
  />
</video>

### Ajouter les styles globaux

Notre design system nécessite que certains styles globaux (un reset CSS) soient appliqués au document pour afficher correctement nos composants. Nous pouvons les ajouter facilement à l'aide de la [propriété de style global](https://emotion.sh/docs/globals) d'Emotion. Mettez à jour votre fichier `src/shared/global.js` comme suit :

```diff:title=src/shared/global.js
import { css } from '@emotion/react';

import { color, typography } from './styles';

+ export const fontUrl = 'https://fonts.googleapis.com/css?family=Nunito+Sans:400,700,800,900';

export const bodyStyles = css`
  /* Same as before */
`;

export const GlobalStyle = css`
  body {
    ${bodyStyles}
  }
`;
```

Pour utiliser le « composant » `Global` dans Storybook, nous pouvons utiliser un [décorateur](https://storybook.js.org/docs/react/writing-stories/decorators) (un élément qui enveloppe le composant, aussi appelé wrapper). En règle générale, nous placerions ce composant au plus haut niveau de notre application, mais dans Storybook, nous enveloppons toutes les stories en utilisant le fichier de configuration « preview » [`.storybook/preview.js`](https://storybook.js.org/docs/react/configure/overview#configure-story-rendering).
Renommez le fichier en `.storybook/preview.jsx` et mettez-le à jour comme suit :

```diff:title=.storybook/preview.jsx
+ import { Global } from '@emotion/react';

+ import { GlobalStyle } from '../src/shared/global';

/** @type { import('@storybook/react').Preview } */
const preview = {
+ decorators: [
+   (Story) => (
+     <>
+       <Global styles={GlobalStyle} />
+       <Story />
+     </>
+   ),
+ ],
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
  },
};

export default preview;
```

<div class="aside">💡 Le <code><></code> dans le décorateur n'est pas une faute de frappe : c'est un <a href="https://reactjs.org/docs/fragments.html"> Fragment React</a> que nous utilisons ici pour éviter d'ajouter une balise HTML supplémentaire inutile à notre élément de sortie.</div>

Le décorateur assure le rendu du `GlobalStyle` quelle que soit la story sélectionnée.

![Storybook avec des styles globaux](/design-systems-for-developers/storybook-global-styles-7-0.png)

## Optimiser Storybook avec des modules complémentaires

Storybook comprend un puissant [écosystème d'addons](https://storybook.js.org/addons) créé par une vaste communauté. En tant que développeurs pragmatiques, il est plus facile de construire notre flux de travail en utilisant l'écosystème plutôt que de créer nous-mêmes des outils personnalisés (ce qui peut prendre beaucoup de temps).

<h4 id="storybook-addon-actions">L'addon Actions pour vérifier l'interactivité</h4>

L'addon [actions](https://storybook.js.org/docs/react/essentials/actions) vous donne une information dans Storybook lorsqu'une action est effectuée sur un élément interactif comme un bouton ou un lien. Les actions sont installées par défaut dans Storybook, et vous les utilisez simplement en passant une « action » en tant que propriété à un composant.

Voyons comment l'utiliser dans notre élément Button, qui prend en option un composant enveloppant pour réagir aux clics. Nous avons une story qui transmet une action à ce wrapper :

```jsx:title=src/Button/Button.stories.jsx
import styled from '@emotion/styled';

import { Button } from './Button';

import { Icon } from '../Icon/Icon';

import { StoryLinkWrapper } from '../LinkWrapper';

// When the user clicks a button, it will trigger the `action()`,
// ultimately showing up in Storybook's addon panel.
function ButtonWrapper(props) {
  return <CustomButton {...props} />;
}

export const buttonWrapper = {
  name: 'button wrapper',
  render: () => (
    <div>
      <ButtonWrapper>Original Button Wrapper</ButtonWrapper>
      <br />
      <Button ButtonWrapper={ButtonWrapper} appearance='primary'>
        Primary
      </Button>
      /* Removed for brevity */
    </div>
  ),
};
```

<video autoPlay muted playsInline loop>
  <source
    src="/design-systems-for-developers/storybook-addon-actions-7-0.mp4"
    type="video/mp4"
  />
</video>

<h4 id="storybook-addon-controls">Controls pour tester les composants de manière approfondie</h4>

Les nouvelles fonctionnalités de Storybook incluent l'[addon Controls](https://storybook.js.org/docs/react/essentials/controls) configuré par défaut.

Il vous permet d'interagir avec les entrées des composants (props) de façon dynamique dans l'interface utilisateur de Storybook. Vous pouvez fournir plusieurs valeurs à une propriété du composant via des [arguments](https://storybook.js.org/docs/react/writing-stories/args) (ou args en abrégé) et les ajuster via l'interface utilisateur. Il aide les créateurs de design systems à tester les entrées des composants (props) en ajustant les valeurs de l'argument. Il permet également aux utilisateurs des design systems de tester les composants avant de les intégrer afin de comprendre comment chaque entrée (prop) les affecte.

Voyons comment ils fonctionnent en ajoutant une nouvelle story dans le composant `Avatar`, situé dans `src/Avatar/Avatar.stories.jsx` :

```jsx:title=src/Avatar/Avatar.stories.jsx
import { Avatar } from './Avatar';

export default {
  title: 'Design System/Avatar',
  component: Avatar,
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

// Other Avatar stories

/*
 * New story using Controls
 * Read more about Storybook templates at:
 * https://storybook.js.org/docs/react/writing-stories/introduction#using-args
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

Regardez l'onglet Controls dans le panneau des addons. Les Controls génèrent automatiquement une interface graphique permettant d'ajuster les propriétés. Par exemple, le sélecteur « size » nous permet de faire défiler les tailles d'Avatar disponibles : `tiny`, `small`, `medium`, et `large`. La même chose a été appliquée aux autres propriétés du composant (« loading », « username » et « src »), ce qui nous a permis de créer une méthode centrée sur l'utilisateur pour tester les composants.

<video autoPlay muted playsInline loop>
  <source
    src="/design-systems-for-developers/storybook-addon-controls-7-0.mp4"
    type="video/mp4"
  />
</video>

Ceci étant dit, les Controls ne remplacent pas les stories. Ils sont parfaits pour explorer les cas limites des composants et des stories, et pour mettre en avant les états supposés.

Nous explorerons les addons Accessibility et Docs dans les prochains chapitres.

> Storybook est un puissant outil d'environnement frontend qui permet aux équipes de concevoir, de construire et d'organiser des composants d'interface utilisateur (et même des écrans complets !) sans se laisser embrouiller par la logique métier et les détails techniques - Brad Frost, auteur de Atomic Design

## Apprendre à automatiser la maintenance

Maintenant que les composants de notre design system sont dans Storybook, nous avons fait un pas de plus vers la création d'un design system standard pour l'industrie. C'est maintenant le moment idéal pour livrer notre travail sur notre dépôt distant. Ensuite, nous pouvons commencer à réfléchir à la manière de mettre en place les outils automatisés qui simplifient la maintenance continue.

Un design system, comme tout logiciel, doit évoluer. Le défi consiste à s'assurer que les composants de l'interface utilisateur conservent l'apparence et la fonctionnalité voulues au fur et à mesure que le design system se développe.

Dans le chapitre 4, nous apprendrons à mettre en place l'intégration continue et à publier automatiquement le design system en ligne à des fins de collaboration.
