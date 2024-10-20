---
title: 'Introduction aux design system'
tocTitle: 'Introduction'
description: "Un guide sur les derniers outils pour créer des design system prêts à l'emploi"
---

<div class="aside">Ce guide a été créé pour <b>les développeurs professionnels</b> qui souhaitent apprendre à créer des design system. Un niveau intermédiaire en JavaScript, Git et en intégration continue est recommandé. Vous devriez également avoir quelques bases en matière de Storybook, comme par exemple savoir écrire une story et éditer des fichiers de configuration (<a href="/intro-to-storybook">Rendez-vous sur Introduction à Storybook pour apprendre les bases</a>).
</div>
<br />

Les design system connaissent une popularité fulgurante. Des poids lourds en matière de tech comme Airbnb aux petites startups, les entreprises de toutes tailles réutilisent des modèles d'interface utilisateur (User Interface ou UI) dans le but de faire des économies de temps et d'argent. Il y a cependant une grande différence entre les design system créés par la BBC, Airbnb, IBM ou Microsoft et les design system créés par la plupart des développeurs.

Pourquoi les équipes en charge des design system utilisent ces outils et ces techniques en particulier ? Mon co-auteur Tom et moi avons recherché les caractéristiques des design system les plus réussis de la communauté Storybook afin d'identifier les meilleures pratiques.

Ce guide en plusieurs étapes présente les outils automatisés et les flux de travail minutieux utilisés dans les design system à grande échelle. Nous passerons en revue l'assemblage d'un design system à partir de librairies de composants existantes, puis nous mettrons en place les services de base, les librairies et les flux de travail.

![Aperçu d'un design system](/design-systems-for-developers/design-system-overview.jpg)

## Pourquoi autant d'engouement autour des design system ?

Soyons clairs : le concept d'interface utilisateur réutilisable n'est pas nouveau. Les guides de style, les kits d'interface utilisateur et les widgets à partager existent depuis des décennies. Aujourd'hui, les designers et développeurs s'orientent vers la construction de composants d'interface utilisateur (UI). Un composant d'interface utilisateur encapsule les propriétés visuelles et fonctionnelles d'éléments distincts de l'interface utilisateur. Pensez aux LEGO.

Les interfaces utilisateurs modernes sont constituées de centaines de composants modulaires qui sont réorganisés pour offrir différentes expériences utilisateurs.

Les design system contiennent des composants d'interface utilisateur réutilisables qui aident les équipes à créer des interfaces utilisateur complexes, durables et accessibles pour tous les projets. Étant donné que les designers et les développeurs contribuent aux composants de l'interface utilisateur, le design system sert de lien entre les métiers. Il est également la « source de vérité » pour les composants communs d'une organisation.

![Les design system sont un lien entre design et dévelopement](/design-systems-for-developers/design-system-context.jpg)

Les designers parlent souvent de la création des design system au sein de leurs outils. Dans son entièreté, un design system englobe les images (Sketch, Figma, etc.), les principes généraux de conception, la structure de contribution, la gouvernance, etc. Il existe une multitude de guides destinés aux designers qui traitent ces sujets en profondeur, nous n'y reviendrons donc pas ici.

Pour les développeurs, plusieurs choses sont certaines. Les design system de production doivent inclure les composants de l'interface utilisateur et l'infrastructure frontend qui les gère. Un design system comporte trois parties techniques dont nous parlerons dans ce guide :

- 🏗 Des composants d'interface utilisateur réutilisables mis en commun
- 🎨 Des jetons de conception (design tokens): Variables spécifiques au style telles que les couleurs de la marque et les espacements
- 📕 Une documentation : Instructions d'utilisation, narration, bonnes pratiques et erreurs à éviter

Les éléments sont compilés, versionnés et distribués aux applications qui les utilisent par l'intermédiaire d'un gestionnaire de packages.

## Avez-vous besoin d'un design system ?

Bien qu'il soit populaire, un design system n'est pas une solution miracle. Si vous travaillez au sein d'une équipe restreinte sur une seule application, un dossier de composants d'interface utilisateur sera amplement suffisant plutôt que la mise en place d'une infrastructure nécessaire à la création d'un design system. Pour les petits projets, le coût de la maintenance, de l'intégration et des outils dépasse largement les bénéfices en termes de productivité que vous pourriez observer.

Les économies d'échelles avec un design system jouent en votre faveur lorsque vous partagez des composants UI entre plusieurs projets. Si vous vous retrouvez à dupliquer des composants UI dans différentes applications ou équipes, ce guide est fait pour vous.

## Ce que nous construisons

Storybook alimente les design system de la [BBC](https://www.bbc.co.uk/iplayer/storybook/index.html?path=/story/style-guide--colours), [Airbnb](https://github.com/airbnb/lunar), [IBM](https://www.carbondesignsystem.com/), [GitHub](https://primer.style/css/), et de centaines d'autres entreprises. Les recommandations formulées ici s'inspirent des meilleures pratiques et des outils des équipes les plus performantes. Pour ce faire, nous utiliserons les outils frontend suivants :

#### Construire des composants

- 📚 [Storybook](http://storybook.js.org) pour le développement des composants d'interface utilisateur et une documentation générée automatiquement
- ⚛️ [React](https://reactjs.org/) pour une UI déclarative centrée sur les composants (via create-react-app)
- 💅 [Emotion](https://emotion.sh/docs/introduction) pour un style centré sur les composants
- ✨ [Prettier](https://prettier.io/) pour le formatage automatique du code

#### Maintenir le système

- 🚥 [GitHub Actions](https://github.com/features/actions) pour l'intégration continue
- 📐 [ESLint](https://eslint.org/) pour le linting JavaScript
- ✅ [Chromatic](https://www.chromatic.com/?utm_source=storybook_websiteutm_medium=link&utm_campaign=storybook) pour détecter les bugs visuels dans les composants (par les mainteneurs de Storybook)
- 📦 [npm](https://npmjs.com) pour partager la librairie
- 🛠 [Auto](https://github.com/intuit/auto) pour la gestion des mises en production

#### Les addons Storybook

- ♿ [Accessibility](https://github.com/storybookjs/storybook/tree/master/addons/a11y) pour contrôler l'accessibilité pendant le développement
- 💥 [Actions](https://storybook.js.org/docs/react/essentials/actions) pour l'assurance qualité des interactions au clic et au toucher
- 🎛 [Contrôles](https://storybook.js.org/docs/react/essentials/controls) pour ajuster interactivement les propriétés afin d'expérimenter avec les composants
- 📕 [Docs](https://storybook.js.org/docs/react/writing-docs/introduction) pour la génération automatique de documentation à partir des stories
- 🔍 [Interactions](https://storybook.js.org/addons/@storybook/addon-interactions/) pour le débogage des interactions entre composants
- 🏎 [Test-runner](https://storybook.js.org/docs/react/writing-tests/test-runner) pour tester les composants de manière automatisée

![Design system workflow](/design-systems-for-developers/design-system-workflow.jpg)

## Comprendre le flux de travail

Les design system sont un investissement dans l'infrastructure frontend. En plus de montrer comment utiliser la technologie ci-dessus, ce guide se concentre également sur les flux de travail de base qui favorisent la prise en main et simplifient la maintenance. Dans la mesure du possible, les tâches manuelles seront automatisées. Vous trouverez ci-dessous les activités que nous rencontrerons.

#### Construire des composants d'interface utilisateur isolés

Chaque design system est composé de composants d'interface utilisateur.
Nous utiliserons Storybook comme une sorte d' « atelier » pour construire des composants UI isolés en dehors de nos applications finales. Ensuite, nous intégrerons des addons qui vous aideront à garantir la durabilité des composants (Actions, A11y, Controls, Interactions).

#### Relecture pour parvenir à un consensus et recueillir les retours

Le développement de l'interface utilisateur est un travail d'équipe qui nécessite un alignement entre les développeurs, les designers et les autres acteurs du projet. Nous publierons des composants d'interface utilisateur en cours de développement afin d'intégrer les parties prenantes au processus de développement et d'accélérer les livraisons.

#### Tester pour éviter les bugs de l'interface utilisateur

Les design system sont une source de vérité et un point unique de défaillance. Des bugs mineurs dans des composants de base peuvent provoquer des incidents à l'échelle de l'entreprise. Nous automatiserons les tests pour vous aider à atténuer les bugs inévitables et à livrer en toute confiance des composants d'interface utilisateur durables et accessibles.

#### Documenter pour accélérer la prise en main

La documentation est essentielle, mais sa création est souvent la dernière priorité d'un développeur. Nous vous faciliterons la tâche pour documenter les composants de l'interface utilisateur en générant automatiquement une documentation minimale et durable qui peut être personnalisée.

#### Partager le design system aux projets qui l'utilisent

Une fois vos composants d'interface utilisateur finalisés et bien documentés, vous devez les partager aux autres équipes. Nous aborderons le packaging, la publication et la manière d'utiliser le design system dans d'autres Storybook.

## Le design system de Storybook

L'exemple de design system de ce guide s'inspire du [design system officiel](https://github.com/storybookjs/design-system) de Storybook. Il est utilisé par trois sites et touche des dizaines de milliers de développeurs dans l'écosystème Storybook.

Dans le chapitre suivant, nous vous montrerons comment extraire un design system à partir de librairies de composants hétérogènes.
