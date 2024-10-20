---
title: 'Flux de travail pour les design systems'
tocTitle: 'Flux de travail'
description: "Un aperçu du flux de travail d'un design system pour les développeurs frontend"
commit: '9d13d12'
---

La manière dont les outils frontend fonctionnent ensemble a un impact significatif sur la valeur finale que les équipes de design et de développement peuvent réaliser. S'il est bien fait, le développement et la réutilisation des composants UI devraient se faire en toute transparence.

Ce chapitre présente le flux de travail en cinq étapes en introduisant un nouveau composant, AvatarList.

![Flux de travail d'un design system](/design-systems-for-developers/design-system-workflow-horizontal.jpg)

## Construire

`AvatarList` est un composant qui affiche plusieurs Avatars. Comme les autres composants du design system, `AvatarList` a commencé par être réutilisé dans de nombreux projets, et c'est la raison pour laquelle il mérite d'être inclus dans le design system. Supposons que le composant ait été développé dans un autre projet et passons directement au code final de cette démonstration.

![AvatarList](/design-systems-for-developers/AvatarList.jpg)

Tout d'abord, créez une nouvelle branche dans laquelle nous suivrons ce travail.

```shell
git checkout -b create-avatar-list-component
```

Téléchargez le composant `AvatarList` et la story sur votre machine et placez-les dans le dossier `/src/AvatarList` :

- [Fichier du composant](https://raw.githubusercontent.com/chromaui/learnstorybook-design-system/bd9a7647bfa61717c2388153955756e1591227de/src/AvatarList/AvatarList.jsx)
- [Fichier de la story](https://raw.githubusercontent.com/chromaui/learnstorybook-design-system/bd9a7647bfa61717c2388153955756e1591227de/src/AvatarList/AvatarList.stories.jsx)
- [Fichier index](https://raw.githubusercontent.com/chromaui/learnstorybook-design-system/bd9a7647bfa61717c2388153955756e1591227de/src/AvatarList/index.js)

![Storybook avec le composant AvatarList](/design-systems-for-developers/storybook-with-avatarlist-7-0.png)

<div class="aside">

💡 Storybook est configuré pour détecter automatiquement les fichiers se terminant par `*.stories.js|jsx` et les afficher dans l'interface utilisateur.

</div>

Super ! Maintenant, articulons chaque état de l'interface utilisateur pris en charge par `AvatarList`. A première vue, il est clair que `AvatarList` comporte certaines propriétés de `Avatar` comme `small` et `loading`.

```jsx:title=src/AvatarList/AvatarList.stories.jsx
export const SmallSize = {
  args: {
    ...Short.args,
    size: 'small',
  },
};

export const Loading = {
  args: {
    ...Short.args,
    loading: true,
  },
};
```

![Storybook avec des stories AvatarList supplémentaires](/design-systems-for-developers/storybook-with-avatarlist-loading-7-0.png)

Etant donné qu'il s'agit d'une liste, elle devrait afficher beaucoup d'Avatars. Ajoutons des stories qui illustrent ce qui se passe avec de nombreux éléments et avec peu d'éléments dans la liste.

```jsx:title=src/AvatarList/AvatarList.stories.jsx
export const Ellipsized = {
  args: {
    users: [
      ...Short.args.users,
      {
        id: '3',
        name: 'Zoltan Olah',
        avatarUrl: 'https://avatars0.githubusercontent.com/u/81672',
      },
      {
        id: '4',
        name: 'Tim Hingston',
        avatarUrl: 'https://avatars3.githubusercontent.com/u/1831709',
      },
    ],
  },
};

export const BigUserCount = {
  args: {
    users: Ellipsized.args.users,
    userCount: 100,
  },
};

export const Empty = {
  args: {
    users: [],
  },
};
```

<video autoPlay muted playsInline loop>
  <source
    src="/design-systems-for-developers/storybook-with-all-avatarlist-stories-7-0.mp4"
    type="video/mp4"
  />
</video>

Sauvegardez vos modifications et validez.

```shell
git commit -am « Added AvatarList and stories »
```

## Documenter

Avec la fonction [auto-documentation](https://storybook.js.org/docs/react/writing-docs/autodocs) du Storybook, créer une documentation personnalisable est un jeu d'enfant. C'est un avantage pour ceux qui veulent apprendre à utiliser AvatarList, car ils peuvent facilement se référer à la partie Docs dans l'interface utilisateur de Storybook.

![Storybook docs avec des informations de base sur AvatarList](/design-systems-for-developers/storybook-docs-minimal-avatarlist-7-0.png)

Et voilà une documentation minimale et utilisable !

Ajoutons à AvatarList un aspect un peu plus humain en fournissant un contexte supplémentaire sur la façon de l'utiliser.

```jsx:title=src/AvatarList/AvatarList.jsx
/**
 * A list of Avatars, ellipsized to at most 3. Supports passing only a subset of the total user count.
 */
export function AvatarList({ loading, users, userCount, size, ...props }) {}
```

Ajoutez quelques détails supplémentaires sur les propriétés supportées.

```jsx:title=src/AvatarList/AvatarList.jsx
AvatarList.propTypes = {
  /**
   * Are we loading avatar data from the network?
   */
  loading: PropTypes.bool,
  /**
   * A (sub)-list of the users whose avatars we have data for. Note: only 3 will be displayed.
   */
  users: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string,
      avatarUrl: PropTypes.string,
    })
  ),
  /**
   * The total number of users, if a subset is passed to `users`.
   */
  userCount: PropTypes.number,
  /**
   * AvatarList comes in four sizes. In most cases, you’ll be fine with `medium`.
   */
  size: PropTypes.oneOf(Object.keys(sizes)),
};
```

Facile comme bonjour ! Ce niveau de détail est suffisant pour l'instant, nous pourrons toujours personnaliser davantage à l'aide de MDX par la suite.

![Storybook docs avec des informations complètes sur AvatarList](/design-systems-for-developers/storybook-docs-full-avatarlist-7-0.png)

La documentation n'a pas besoin d'être fastidieuse. Grâce à des outils automatisés, nous avons supprimé les tâches lourdes pour passer directement à l'écriture.

Effectuez un commit avec les modifications et publiez-les sur GitHub.

```shell
git commit -am "Improved AvatarList docs"
```

### Préparer la publication

Avant de publier notre composant dans le design system, nous devons nous assurer qu'il est disponible une fois tout d'installé. Ajoutons-le au fichier`index.js` du design system.

```diff:title=src/index.js
import * as styles from './shared/styles';
import * as animation from './shared/animation';
import * as icons from './shared/icons';
import * as global from './shared/global';

export { styles, animation, icons, global };

export * from './Avatar';
+ export * from './AvatarList';
export * from './Badge';
export * from './Button';
export * from './Icon';
export * from './Link';
export * from './LinkWrapper';

```

#### Créer une Pull Request (PR)

Poussons notre branche `AvatarList` sur GitHub et créons une PR :

```shell
git push -u origin create-avatar-list-component
```

Ensuite, allez sur GitHub et ouvrez une PR.

![PR créée pour AvatarList](/design-systems-for-developers/github-pr-create-avatarlist.png)

## Relecture

A ce stade, `AvatarList` est une proposition d'ajout dans le design system.
Les membres de l'équipe doivent relire le code du composant pour voir s'il répond aux attentes en matière de fonctionnalités et d'apparence. Le Storybook du design system est automatiquement publié avec chaque Pull Request (PR) afin de simplifier la revue. Faites défiler la page jusqu'aux vérifications de la PR pour y trouver un lien vers le Storybook déployé.

![Vérifications de la PR déployée](/design-systems-for-developers/avatarlist-github-pr-checks-chromatic-changes.png)

Cherchez `AvatarList` dans votre Storybook en ligne. Il devrait être identique à votre Storybook local.

![AvatarList dans le Storybook en ligne](/design-systems-for-developers/chromatic-deployed-avatarlist-stories-7-0.png)

Le Storybook en ligne est un point de référence universel pour l'équipe. Partagez le lien vers `AvatarList` avec d'autres membres pour obtenir un retour d'information plus rapide. Votre équipe appréciera parce qu'elle n'aura pas à s'occuper du code ou à mettre en place un environnement de développement.

![Ca semble bon, c'est parti !](/design-systems-for-developers/visual-review-shipit.png)

Parvenir à un consensus avec de nombreuses équipes ressemble souvent à un exercice futile. Les gens font référence à du code obsolète, n'ont pas d'environnement de développement ou dispersent leurs commentaires dans plusieurs outils. La revue en ligne du Storybook est aussi simple que le partage d'une URL.

## Test

Notre série de tests s'exécute en arrière-plan à chaque validation.

`AvatarList` est un simple composant d'affichage, les tests unitaires ne sont donc pas nécessaires. Mais si nous examinons les vérifications des Pull Request (PR), notre outil de test visuel Chromatic a déjà détecté des changements qui doivent être revus.

![Changements Chromatic affichés dans les vérifications de la PR Github](/design-systems-for-developers/avatarlist-github-pr-checks-chromatic-changes.png)

Comme AvatarList est un nouveau composant, il ne possède pas encore de tests visuels. Nous devrons ajouter des références de tests pour chaque story. Accepter les « nouvelles stories » dans Chromatic pour augmenter la couverture des tests visuels.

![Changements Chromatic pour les stories du composant AvatarList](/design-systems-for-developers/chromatic-avatarlist-changes.png)

Une fois que vous avez terminé, la compilation passera dans Chromatic.

![Changements Chromatic validés pour les stories du composant AvatarList](/design-systems-for-developers/chromatic-avatarlist-changes-accepted.png)

Ce qui, à son tour, met à jour la vérification de la Pull Request (PR) dans GitHub.

![Changements Chromatic pour les stories du composant AvatarList validés sur Github](/design-systems-for-developers/avatarlist-github-pr-checks-chromatic-changes-accepted.png)

Les tests ont été mis à jour avec succès. À l'avenir, les régressions auront du mal à se faufiler dans le design system.

## Partager

Nous avons une Pull Request (PR) ouverte qui ajoute `AvatarList` au design system. Nous avons écrit nos stories, les tests sont passés et la documentation existe. Enfin, nous sommes prêts à mettre à jour notre design system avec Auto et npm. Ajouter le label « minor » à la PR. Cela indique à Auto de mettre à jour la version mineure du paquet lors du merge.

![PR GitHub avec les labels](/design-systems-for-developers/github-pr-labelled.png)

Maintenant mergez votre PR, naviguez vers votre paquet sur npm, et attendez quelques minutes le temps que le paquet se mette mis à jour.

![Paquet publié sur npm](/design-systems-for-developers/npm-published-package-minor.png)

Bravo ! Le paquet de votre design system a été mis à jour grâce à GitHub. Pas besoin de toucher à la ligne de commande ou de s'occuper de npm.

Mettez à jour la dépendance `learnstorybook-design-system` dans l'application d'exemple pour commencer à utiliser AvatarList.

## Votre voyage commence

_Design Systems for Developers_ met en évidence le flux de travail de bout en bout utilisé par les équipes frontend professionnelles pour vous donner une longueur d'avance lorsque vous développez le vôtre. Au fur et à mesure que votre design system se développe, ajoutez, réorganisez et étendez ces outils pour répondre aux besoins de votre équipe.

Le chapitre 9 se termine par un exemple de code complet, des ressources utiles et une liste de questions fréquemment posées par les développeurs.
