---
title: "Systèmes d'architecture"
tocTitle: 'Architecture'
description: 'Comment extraire un design system à partir de librairies de composants'
commit: '341ea8a'
---

Dans ce chapitre 2, nous allons créer un design system à partir de librairies de composants existantes. Nous déterminerons au fur et à mesure quels composants correspondent au design system et nous mettrons en avant les défis communs que rencontrent les développeurs au début de ce processus.

Dans les grandes entreprises, cette étape est faite en collaboration avec les équipes de design, de développement et relatives au produit. [Chromatic](https://www.chromatic.com/?utm_source=storybook_website&utm_medium=link&utm_campaign=storybook) (l'entreprise derrière Storybook) et [Storybook](https://storybook.js.org/) partagent une équipe dynamique chargée de l'infrastructure frontend qui aide plus de 1400 contributeurs et contributrices open source à travers plus de 3 propriétés. Nous allons donc vous expliquer le processus.

## Le défi

Si vous travaillez au sein d'une équipe de développement, vous avez probablement remarqué que grandes les équipes ne sont pas les plus efficaces. Une mauvaise communication peut vite s'installer au fur et à mesure que les équipes grandissent. Les modèles d'interface utilisateur existants ne sont pas documentés ou sont totalement abandonnés. En d'autres termes, les développeurs tentent de réinventer la roue plutôt que de développer de nouvelles fonctionnalités. Au fil du temps, les projets sont remplis de composants uniques.

Nous nous sommes heurtés à cette situation inconfortable. Malgré de bonnes intentions au sein d'un équipe expérimentée, les composants UI étaient sans cesse refactorisés ou recopiés. Les modèles d'interface utilisateur, qui étaient censés être identiques, différaient en termes d'apparence ou de fonctionnalités. Chaque composant était une entité unique, ce qui rendait impossible pour les nouveaux développeurs de discerner la source de vérité, et encore moins de contribuer.

![Les UIs divergent](/design-systems-for-developers/design-system-inconsistent-buttons.jpg)

## Créer un design system

Un design system rassemble les composants communs de l'interface utilisateur dans un répertoire central correctement maintenu et partagé via un gestionnaire de packages. Les développeurs importent ces composants UI standardisés au lieu de copier le même code dans plusieurs projets.

La plupart des design systems ne sont pas créés de A à Z. Ils sont plutôt assemblés à partir de composants UI testés, approuvés et utilisés dans toute l'entreprise, et sont ensuite regroupés sous la forme d'un design system. Notre projet ne fait pas exception. Nous sélectionnerons des composants à partir de librairies existantes en production afin de gagner du temps et de mettre à disposition le design system plus rapidement.

![Que contient un design system](/design-systems-for-developers/design-system-contents.jpg)

## Où se trouve le design system ?

On peut imaginer qu'un design system est une librairie de composants de plus, mais elle est partagée à l'échelle d'une entreprise entière plutôt qu'à l'échelle d'une seule application. Un design system se concentre sur les premières briques de l'interface utilisateur, tandis que les librairies de composants spécifiques à un projet peuvent tout contenir : des composants aux écrans.

Ainsi, notre design system doit être à la fois indépendant de n'importe quel projet tout en étant une dépendance de tous les projets. Les modifications se propagent au sein de l'organisation sous la forme d'un package versionné distribué par un gestionnaire de packages. Les projets peuvent réutiliser les composants du design system et les personnaliser davantage si besoin. Ces contraintes nous permettent de structurer nos projets frontend.

![Qui utilise un design system](/design-systems-for-developers/design-system-consumers.jpg)

## Créer un dépôt dans GitHub

React est la couche de visualisation (view layer) la plus populaire selon l'enquête de [State of JS](https://stateofjs.com/). Un nombre incalculable de Storybooks utilisent React : c'est la raison pour laquelle nous l'utiliserons dans ce tutoriel pour créer notre design system.

Dans votre ligne de commande, exécutez les commandes suivantes :

```shell:clipboard=false
# Clone the files
npx degit chromaui/learnstorybook-design-system-template learnstorybook-design-system

cd learnstorybook-design-system

# Install the dependencies
yarn install
```

<div class="aside">
💡 Nous utilisons <a href="https://github.com/Rich-Harris/degit">degit</a> pour télécharger les dossiers provenant de GitHub. Si vous souhaitez le faire manuellement, vous pouvez récupérer le contenu <a href="https://github.com/chromaui/learnstorybook-design-system-template">ici</a>.
</div>

Une fois que tout est installé, nous pouvons publier le tout sur GitHub (que nous utiliserons pour héberger le code de notre design system). Commencez par vous connecter et créer un nouveau dépôt sur GitHub.com :

![Créer un dépôt GitHub](/design-systems-for-developers/create-github-repository.png)

Suivez ensuite les instructions de GitHub pour créer le dépôt (pour l'instant presque vide) :

```shell:clipboard=false
git init
git add .
git commit -m "first commit"
git branch -M main
git remote add origin https://github.com/your-username/learnstorybook-design-system.git
git push -u origin main
```

Veillez à remplacer `votre-nom-d'utilisateur` par le nom de votre compte.

![Commit initial dans le dépôt GitHub](/design-systems-for-developers/created-github-repository.png)

<div class="aside">💡 D'autres méthodes valables existent pour créer un design system comme le HTML/CSS bruts, l'utilisation d'autres couches de visualisation, la compilation de composants avec Svelte ou l'utilisation de composants web. Choisissez ce qui convient le mieux à votre équipe.</div>

## Ce qui appartient au design system et ce qui n’en fait pas partie

Les design systems ne devraient contenir que des composants purs et destinés à l'affichage. Ces composants sont liés à l'affichage au sein de l'interface utilisateur, ne fonctionnent qu'avec des propriétés et ne contiennent pas de logique métier ou spécifique à une application, ils ne sont pas déterminants dans le chargement de données. Ces propriétés sont essentielles pour rendre un composant réutilisable.

Les design systems ne sont pas un ensemble de librairies de composants au sein d'une organisation. Ce serait un véritable casse-tête.

Les composants spécifiques à une application qui contiennent de la logique métier ne devraient pas être inclus de part leur difficulté à être réutilisés : ils fonctionnent dans des projets qui ont des contraintes métiers similaires.

Oubliez les composants uniques qui ne sont pour le moment pas réutilisés. Même si vous pensez qu'ils feront partis du design system un jour, les équipes agiles évitent autant que possible de maintenir du code superflu.

## Créer un inventaire

La première tâche consiste à dresser un inventaire de vos composants afin d'identifier les plus utilisés. Cela implique souvent de parcourir les interfaces de plusieurs sites ou applications afin de repérer les composants UI qui se répètent. Les designers [Brad Frost](http://bradfrost.com/blog/post/interface-inventory/) et [Nathan Curtis](https://medium.com/eightshapes-llc/the-component-cut-up-workshop-1378ae110517) ont déjà publié des méthodes pratiques pour faire l'inventaire des composants, par conséquent nous ne rentrerons pas en détail dans ce tutoriel.

Méthodes complètes et utiles pour les développeurs :

- Si un modèle d'interface utilisateur est utilisé plus de 3 fois, transformez-le en composant UI.
- Si un modèle d'interface utilisateur est utilisé dans plus de 3 projets / équipes, ajoutez-le à votre design system.

![Contenu d'un design system](/design-systems-for-developers/design-system-grid.png)

En suivant cette méthode, nous obtenons des composants UI primitifs : Avatar, Badge, Button, Checkbox, Input, Radio, Select, Textarea, Highlight (pour le code), Icon, Link, Tooltip et plus encore. Ces blocs de constructions sont configurés de différentes manières afin de créer plein de fonctionnalités et mises en page uniques pour les applications clientes.

![Variantes dans un seul composant](/design-systems-for-developers/design-system-consolidate-into-one-button.jpg)

Nous avons sélectionné un sous-ensemble de ces composants pour ce tutoriel afin de simplifier la compréhension du dépôt. Certaines équipes utilisent aussi des composants tiers dans leurs design systems pour d'autres composants comme les Tableaux ou les Formulaires.

<div class="aside">💡 CSS-in-JS : Nous utilisons <a href="https://emotion.sh/docs/introduction">Emotion</a>, une librairie conçue pour écrire du CSS avec du JavaScript. Elle fournit un modèle de composition de style puissant et intuitif. Il existe d'autres méthodes valables pour styliser les composants, notamment l'utilisation de classes, les modules CSS, etc.</div>

En plus de nos composants UI, il est pertinent d'ajouter des constantes liées au style comme la typographie, les couleurs, les espacements, etc., qui sont réutilisées dans les projets. Selon la nomenclature des design systems, les variables de styles globales sont appelées «design tokens». Nous ne nous attarderons pas ici dans la théorie derrière ces design tokens, mais vous pouvez en apprendre plus en ligne (voici un [article intéressant](https://medium.com/eightshapes-llc/tokens-in-design-systems-25dd82d58421)).

## Commençons à développer

Nous avons défini ce qu'il faut construire et comment tout s'assemble. Rentrons dans le vif du sujet. Dans le chapitre 3, nous mettrons en place les outils fondamentaux pour les design systems. Notre dossier de composants d'interface utilisateur sera organisé et consultable grâce à Storybook.
