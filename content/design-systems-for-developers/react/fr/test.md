---
title: 'Tester pour garantir la qualité'
tocTitle: 'Tester'
description: "Comment tester l'apparence, les fonctionnalités et l'accessibilité du design system"
commit: 'f5a815f'
---

Dans ce chapitre 5, nous automatisons les tests du design system pour éviter les bugs de l'interface utilisateur. Ce chapitre explore en profondeur les caractéristiques des composants UI qui justifient des tests et les pièges potentiels à éviter. Nous avons observé les équipes professionnelles de chez Wave, BBC et Salesforce pour aboutir à une stratégie de test qui concilie une couverture complète, une configuration simple et une maintenance réduite.

<img src="/design-systems-for-developers/ui-component.png" width="250">

## Les fondamentaux des tests de composants UI

Avant de commencer, déterminons ce qu'il est judicieux de tester. Les design system sont composés d'éléments d'interface utilisateur. Chaque composant UI comprend des stories (variations) qui décrivent l'apparence et la fonctionnalité souhaitées en fonction d'un ensemble de paramètres (propriétés). Les stories sont ensuite affichées par le navigateur ou l'appareil à l'utilisateur final.

![Les états des composants sont combinatoires](/design-systems-for-developers/component-test-cases.png)

Wouah ! Comme vous pouvez le constater, un composant contient plusieurs états.
Multipliez le nombre d'états par le nombre de composants du design system et vous comprendrez pourquoi il est difficile de les répertorier. En réalité, il n'est pas viable de tester chaque élément à la main, en particulier au fur et à mesure que le design system se développe. Une raison de plus de mettre en place des tests automatisés **dès maintenant** afin d'économiser du travail **à l'avenir**.

## Préparer les tests

J'ai interrogé 4 équipes équipes frontend sur les flux de travail professionnels de Storybook dans un [article précédent](https://www.chromatic.com/blog/the-delightful-storybook-workflow). Ils se sont mis d'accord sur ces bonnes pratiques pour rédiger des stories afin de rendre les tests faciles et complets.

**Articuler les états des composants pris en charge** en tant que stories pour clarifier quelles combinaisons de paramètres produisent un état donné. Eliminer les états non utilisés pour alléger le composant.
**Affichez les composants de manière cohérente** pour atténuer la variabilité qui peut être déclenchée par des fonctions aléatoires (Math.random()) ou relatives (Date.now()).

> Les meilleures stories vous permettent de visualiser tous les états que votre composant pourrait connaître dans l'application » - Tim Hingston, Tech lead chez Apollo GraphQL

## Tests visuels

Les design system contiennent des composants d'interface utilisateur dédiés à de l'affichage, qui sont intrinsèquement visuels. Les tests visuels valident les aspects visuels de l'interface utilisateur affichée.

Les tests visuels capturent une image de chaque composant de l'interface utilisateur dans un environnement de navigation cohérent. Les nouvelles captures d'écran sont automatiquement comparées aux captures d'écran de référence précédemment acceptées. Lorsqu'il y a des différences visuelles, vous en êtes informé.

![Composants de test visuel](/design-systems-for-developers/component-visual-testing.gif)

Si vous développez une interface utilisateur moderne, les tests visuels permettent à votre équipe frontend d'éviter les modifications manuelles fastidieuses et les régressions coûteuses de l'interface utilisateur.

Dans le <a href="https://storybook.js.org/tutorials/design-systems-for-developers/react/en/review/#publish-storybook">chapitre précédent</a>, nous avons appris à publier un Storybook en utilisant [Chromatic](https://www.chromatic.com/?utm_source=storybook_website&utm_medium=link&utm_campaign=storybook). Nous avons ajouté une bordure rouge en gras autour de chaque composant `Button`, puis nous avons demandé l'avis de nos coéquipiers.

![Bouton avec une bordure rouge](/design-systems-for-developers/chromatic-button-border-change.png)

Voyons maintenant comment fonctionnent les tests visuels à l'aide des [outils de test](https://www.chromatic.com/features/test/?utm_source=storybook_website&utm_medium=link&utm_campaign=storybook) intégrés de Chromatic. Lorsque nous avons créé la Pull Request (PR), Chromatic a capturé des images de nos modifications et les a comparées aux versions précédentes des mêmes composants. Quatre changements ont été trouvés :

![Liste des vérifications dans la Pull Request](/design-systems-for-developers/chromatic-list-of-checks.png)

Cliquez sur la partie **🟡 UI Tests** pour les passer en revue.

![Second build dans Chromatic avec les modifications](/design-systems-for-developers/chromatic-second-build-from-pr.png)

Passez-les en revue pour confirmer s'ils sont intentionnels (améliorations) ou non intentionnels (bugs). Si vous acceptez les modifications, les bases de référence des tests seront mises à jour. Cela signifie que les modifications ultérieures seront comparées aux nouvelles références afin de détecter les bugs.

![Examiner les modifications dans Chromatic](/design-systems-for-developers/chromatic-review-changes-pr.png)

Dans le dernier chapitre, notre coéquipier ne voulait pas d'une bordure rouge autour des `Button` pour une raison ou une autre. Refusez les modifications pour indiquer qu'elles doivent être annulées.

![Refuser des modifications dans Chromatic](/design-systems-for-developers/chromatic-review-deny.png)

Annulez les changements et faites un commit pour relancer et valider vos tests visuels.

## Tests d'interaction

Jusqu'à présent, nous avons vu comment les tests visuels nous permettaient de vérifier l'apparence et de détecter les régressions de l'interface utilisateur. Mais au fur et à mesure que nous développons notre design system, nos composants deviendront responsables de bien plus que le simple rendu de l'interface utilisateur. À un moment donné, ils s'occuperont de la gestion de l'état ou même de la recherche de données. C'est là que les tests d'interaction entre les composants nous aideront.

Le test d'interaction est un modèle bien connu pour vérifier le comportement de l'utilisateur. Vous commencez par fournir des données simulées pour mettre en place votre test, simuler les interactions de l'utilisateur avec une librairie de test et vérifier les modifications de l'interface utilisateur. Dans Storybook, cela se déroule dans le navigateur, ce qui facilite le débogage parce que vous exécutez les tests dans le même environnement que celui dans lequel vous développez les composants : le navigateur.

Pour l'activer, nous allons cliquer sur la fonction [`play`](https://storybook.js.org/docs/react/writing-stories/play-function) de Storybook et sur les librairies de test instrumentées pour configurer nos tests, puis utiliser le [test-runner](https://storybook.js.org/docs/react/writing-tests/test-runner) pour vérifier que le rendu de notre composant est correct.

### Configurer le test runner

Commencez par ajouter les dépendances nécessaires avec :

```shell
yarn add --dev @storybook/test-runner
```

Ensuite, ajoutez une nouvelle tâche de test à vos scripts dans le `package.json` :

```json:clipboard=false
{
  "scripts": {
    "test-storybook": "test-storybook"
  }
}
```

### Ecrire un test d'interaction en utilisant la fonction play

Les tests d'interaction sont centrés sur la façon dont l'interface utilisateur gère les actions de l'utilisateur, soit en utilisant le clavier, la souris ou d'autres périphériques d'entrée et en vérifiant si les éléments visuels de l'interface utilisateur sont affichés et fonctionnent correctement. Les libraires de test telles que [Jest](https://jestjs.io/) fournissent des API utiles pour simuler les interactions humaines et vérifier l'état de l'interface utilisateur. Nous utiliserons des versions instrumentées de ces outils pour écrire nos tests. Le but est donc de conserver une syntaxe commune, mais avec des données d'analyse supplémentaires pour nous aider à déboguer.

Le test lui-même est défini dans une fonction [`play`](https://storybook.js.org/docs/react/writing-stories/play-function) reliée à une story. Il s'agit de petits bouts de code qui s'exécutent après le rendu de la story.

Voyons comment cela fonctionne en mettant à jour la story `Button` et en mettant en place notre premier test d'interaction en ajoutant ce qui suit :

```diff:title=src/Button/Button.stories.jsx
import styled from '@emotion/styled';

import { Button } from './Button';
import { Icon } from '../Icon/Icon';
import { StoryLinkWrapper } from '../LinkWrapper';

+ import { expect, userEvent, within } from '@storybook/test';

export default {
  title: 'Design System/Button',
  component: Button,
};

// Other Button stories

/*
 * New story using the play function.
 * See https://storybook.js.org/docs/react/writing-stories/play-function
 * to learn more about the play function.
 */
+ export const WithInteractions = {
+   args: {
+     appearance: 'primary',
+     href: 'http://storybook.js.org',
+     ButtonWrapper: StoryLinkWrapper,
+     children: 'Button',
+   },
+   play: async ({ canvasElement }) => {
+     // Assigns canvas to the component root element
+     const canvas = within(canvasElement);
+     await userEvent.click(canvas.getByRole('link'));
+     expect(canvas.getByRole('link')).toHaveAttribute(
+       'href',
+       'http://storybook.js.org',
+     );
+   },
+ };
```

<div class="aside">

💡 Le package `@storybook/test` remplace les packages de tests `@storybook/jest` et `@storybook/testing-library`, offrant une taille de package plus petite et une API plus directe basée sur le package [Vitest](https://vitest.dev/).

</div>

<video autoPlay muted playsInline loop>
  <source
    src="/design-systems-for-developers/dsd-storybook-interaction-testing-with-play-function-7-0.mp4"
    type="video/mp4"
  />
</video>

Lorsque Storybook a fini d'afficher la story, il exécute les étapes définies à l'intérieur de la fonction `play`, en interagissant avec le composant, de la même manière qu'un utilisateur le ferait. Cliquez sur le panneau [`Interactions`](https://storybook.js.org/docs/react/writing-tests/interaction-testing#interactive-debugger). Vous verrez un flux d'exécution détaillé tout en disposant d'un ensemble pratique de contrôles d'interface utilisateur pour mettre en pause, reprendre, revenir en arrière et passer en revue chaque interaction.

### Automatiser les tests avec le test runner

Nous avons vu de quelle manière les tests d'interaction avec la fonction `play` nous ont aidé à vérifier comment un composant réagit lorsque nous interagissons avec lui. Mais avec l'évolution des design system, la vérification manuelle de chaque modification peut rapidement devenir irréaliste. Storybook test runner automatise ce processus. Il s'agit d'un utilitaire autonome alimenté par [Playwright](https://playwright.dev/), qui fonctionne en parallèle de votre Storybook, exécutant tous les tests d'interaction et détectant les stories cassées. Avec Storybook en cours d'exécution, ouvrez une nouvelle fenêtre dans votre terminal et exécutez le test runner avec :

```shell
yarn test-storybook --watch
```

![Exécution du programme de test Storybook](/design-systems-for-developers/test-runner-execution.png)

Il vérifiera que toutes nos stories sont affichées sans erreur et que tous les cas passent automatiquement pendant l'exécution. De plus, si un test échoue, il nous fournira un lien qui ouvrira le composant concerné dans le navigateur.

### Exécuter des tests d'interaction dans la CI (intégration continue)

Les tests d'interaction avec la fonction `play` et l'automatisation avec le test runner nous ont aidé à simuler les interactions de l'utilisateur et à vérifier l'état de l'interface utilisateur de nos composants. Cependant, les exécuter localement peut être une tâche longue et répétitive, même si notre design system continue à se développer. Une fois de plus, c'est là que la CI intervient. Voyons comment la mettre en place dans notre flux de travail d'intégration continue existant. Mettez à jour le flux de travail existant que nous avons créé dans le [chapitre précédent](/design-systems-for-developers/react/fr/review/#chromatic-ci) et activez les tests d'interaction comme suit :

```yaml:title=.github/workflows/chromatic.yml
# Name of our action
name: 'Chromatic'
# The event that will trigger the action
on: push

# What the action will do
jobs:
  # Run interaction tests
  interaction-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v3
        with:
          #👇 Sets the version of Node.js to use
          node-version: 16
      - name: Install dependencies
        run: yarn
      - name: Install Playwright
        run: npx playwright install --with-deps
      - name: Build Storybook
        run: yarn build-storybook --quiet
      - name: Serve Storybook and run tests
        run: |
          npx concurrently -k -s first -n "SB,TEST" -c "magenta,blue" \
            "npx http-server storybook-static --port 6006 --silent" \
            "npx wait-on tcp:6006 && yarn test-storybook"
  visual-tests:
    # The operating system it will run on
    runs-on: ubuntu-latest
    # The list of steps that the action will go through
    steps:
      - uses: actions/checkout@v2
        with:
          #👇 Fetches all history so Chromatic can compare against previous builds
          fetch-depth: 0
      - uses: actions/setup-node@v3
        with:
          #👇 Sets the version of Node.js to use
          node-version: 16
      - run: yarn
        #👇 Adds Chromatic as a step in the workflow
      - uses: chromaui/action@v1
        # Options required for Chromatic's GitHub Action
        with:
          #👇 Chromatic projectToken, see https://storybook.js.org/tutorials/design-systems-for-developers/react/en/review/ to obtain it
          projectToken: ${{ secrets.CHROMATIC_PROJECT_TOKEN }}
          token: ${{ secrets.GITHUB_TOKEN }}
```

Notre flux de travail s'exécutera lorsque le code sera ajouté sur n'importe quelle branche du dépôt de notre design system, et il aura deux tâches : une pour les tests d'interaction et une pour les tests visuels. La tâche de test d'interaction commence par le build du Storybook et exécute ensuite le programme de test, en nous informant des tests qui ne fonctionnent pas. La tâche de test visuel fonctionnera comme auparavant, en exécutant Chromatic pour vérifier l'état visuel de nos composants.

## Test d'accessibilité

« L'accessibilité signifie que toutes les personnes, y compris les personnes en situation de handicap, peuvent comprendre, naviguer et interagir avec votre application ... En ligne, [des exemples présentent] des moyens alternatifs d'accéder au contenu, comme l'utilisation de la touche de tabulation et d'un lecteur d'écran pour parcourir un site », écrit le développeur [Alex Wilson de T.Rowe Price](https://medium.com/storybookjs/instant-accessibility-qa-linting-in-storybook-4a474b0f5347).

Les handicaps touchent 15 % de la population, selon [l'Organisation mondiale de la santé](https://www.who.int/disabilities/world_report/2011/report/en/). Les design system ont un impact considérable sur l'accessibilité car ils contiennent les éléments constitutifs des interfaces utilisateur. L'amélioration de l'accessibilité d'un seul composant signifie que toutes les instances de ce composant dans votre entreprise en bénéficient.

![addon Accessibility de Storybook](/design-systems-for-developers/a11y-workflow.png)

Prenez une longueur d'avance en matière d'interface utilisateur inclusive grâce à l'addon Accessibility de Storybook, un outil en temps réel permettant de vérifier les normes d'accessibilité du Web (WCAG).

```shell
yarn add --dev @storybook/addon-a11y
```

Mettez à jour votre configuration Storybook pour inclure l'addon.

```diff:title=.storybook/main.js
/** @type { import('@storybook/react-vite').StorybookConfig } */
const config = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
+   '@storybook/addon-a11y',
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

Une fois que tout est configuré, vous verrez un nouvel onglet « Accessibilité » dans le panneau des addons de Storybook.

![addon Accessibility de Storybook](/design-systems-for-developers/storybook-addon-a11y-7-0.png)

Il vous montre les niveaux d'accessibilité des éléments DOM (violations et validations). Cliquez sur la case à cocher « mettre en évidence les résultats » pour visualiser les violations directement dans le composant UI.

<video autoPlay muted playsInline loop>
  <source
    src="/design-systems-for-developers/storybook-addon-a11y-7-0-highlighted.mp4"
    type="video/mp4"
  />
</video>

À partir de là, suivez les recommandations de l'addon en matière d'accessibilité.

## Autres stratégies de test

Paradoxalement, les tests peuvent faire gagner du temps mais aussi ralentir la vitesse de développement en raison de la maintenance. Faites preuve de discernement en testant les bons éléments uniquement. Bien que le développement de logiciels comporte de nombreuses stratégies de test, nous avons découvert à nos dépens que certaines d'entre elles ne sont pas adaptées aux design system.

### Tests de couverture du code

Les tests de couverture du code mesurent la part de votre base de code couverte par les tests. C'est un bon moyen de s'assurer que vos tests testent réellement quelque chose. Cependant, ils ne constituent pas un bon moyen de mesurer la qualité de vos tests, mais ils peuvent être utiles pour vérifier que tous les composants et utilitaires fournis par le design system fonctionnent comme prévu, ce qui permet d'identifier toute lacune ou tout problème potentiel dans la mise en œuvre du design system. Storybook fournit un [addon](https://storybook.js.org/addons/@storybook/addon-coverage/) pour nous aider dans cette tâche. Développé par [Istanbul](https://istanbul.js.org/), l'addon coverage de Storybook génère un rapport de couverture de code pour vos stories Storybook. Voyons comment.

Commencez par lancer la commande suivante pour installer l'addon coverage :

```shell
yarn add --dev @storybook/addon-coverage
```

Ensuite, mettez à jour votre configuration Storybook pour inclure l'addon :

```diff:title=.storybook/main.js
/** @type { import('@storybook/react-vite').StorybookConfig } */
const config = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
    '@storybook/addon-a11y',
+   '@storybook/addon-coverage',
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

Enfin, un fois que Storybook est affiché, lancer le test runner (dans une nouvelle fenêtre du terminal) avec le flag `--coverage` :

```shell
yarn test-storybook --coverage
```

![Rapport des tests de couverture de Storybook](/design-systems-for-developers/test-runner-coverage-testing.png)

A partir d'ici, suivez les recommandations pour améliorer votre couverture de code.

#### Tests instantanés (Jest)

Cette technique permet de capturer le code des composants de l'interface utilisateur et de le comparer aux versions précédentes. Tester le balisage des composants de l'interface utilisateur revient à tester les détails de l'implémentation (code), et non l'expérience de l'utilisateur dans le navigateur.

Les tests instantanés (snapshots) sont imprévisibles et sujets à des faux positifs. Au niveau des composants, le test instantané ne tient pas compte des changements globaux tels que les design tokens, les feuilles de style CSS et les mises à jour d'API tierces (polices web, formulaires Stripe, Google Maps, etc.). Dans la pratique, les développeurs ont recours à l'«approbation totale» ou ignorent complètement les tests instantanés.

> La plupart des tests d'instantanés de composants ne sont en fait qu'une version aggravée des tests d'instantanés d'écran. Testez l'affichage. Testez ce qui est affiché, et non le balisage sous-jacent (inutile !). - Mark Dalgliesh, infrastructure Frontend chez SEEK, créateur de modules CSS

#### Tests end-to-end (Selenium, Cypress)

Les tests end-to-end traversent le DOM du composant pour simuler le parcours de l'utilisateur. Ils conviennent mieux à la vérification des parcours d'applications tels que le processus d'inscription ou de paiement. Plus la fonctionnalité est complexe, plus cette stratégie de test est utile.

Les design system contiennent des composants atomiques dotés d'une fonctionnalité relativement simple. La validation des parcours utilisateurs est souvent exagérée pour cette tâche, car les tests sont longs à créer et difficiles à maintenir. Toutefois, dans de rares cas, les composants peuvent bénéficier de tests end-to-end. Par exemple, la validation d'interfaces utilisateur complexes telles que les sélecteurs de date ou les formulaires de paiement autonomes.

## Favoriser la prise en main grâce à la documentation

Un design system n'est pas complet si l'on se contente de tests. Étant donné que les design system sont au service des acteurs de l'ensemble de l'équipe, nous devons enseigner aux autres comment tirer le meilleur parti de nos composants d'interface utilisateur bien testés.

Dans le chapitre 6, nous apprendrons comment faciliter la prise en main des design system grâce à la documentation. Découvrez pourquoi Storybook Docs est l'arme secrète pour créer une documentation complète en un claquement de doigts.
